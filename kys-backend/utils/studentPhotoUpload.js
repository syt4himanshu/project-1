const cloudinary = require('cloudinary').v2;
const { invalidateMenteesCache } = require('./facultyMenteesCache');
const logger = require('./logger');
const { ensureStudentPersonalInfo, isControlledProfileError } = require('./studentPersonalInfo');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ensureCloudinaryConfigured = () =>
  Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

const validateStudentPhotoFile = (file) => {
  if (!file) return 'No file provided';
  if (!file.mimetype || !file.mimetype.startsWith('image/')) return 'Invalid file type';
  if (file.size > 2 * 1024 * 1024) return 'File too large. Max size is 2MB';
  return null;
};

const deleteOldStudentPhotoSafely = async (previousPublicId, currentPublicId) => {
  if (!previousPublicId || previousPublicId === currentPublicId) return;

  try {
    await cloudinary.uploader.destroy(previousPublicId, { invalidate: true });
    console.log('[UPLOAD] Successfully deleted old photo:', previousPublicId);
  } catch (error) {
    console.error('Cloudinary cleanup failed', {
      oldPublicId: previousPublicId,
      error: error.message || error,
    });
  }
};

const uploadStudentPhotoForRecord = async (student, file) => {
  const validationError = validateStudentPhotoFile(file);
  if (validationError) {
    return {
      ok: false,
      status: 400,
      error: validationError,
    };
  }

  if (!ensureCloudinaryConfigured()) {
    return {
      ok: false,
      status: 500,
      error: 'Cloudinary credentials are missing on the server',
    };
  }

  let personalInfo = student?.personal_info;
  if (!personalInfo) {
    try {
      personalInfo = await ensureStudentPersonalInfo(student?.id);
      student.personal_info = personalInfo;
      logger.info({
        message: 'student_personal_info row auto-created for photo upload',
        studentId: student?.id,
      });
    } catch (error) {
      logger.warn({
        message: 'Failed to ensure student_personal_info before photo upload',
        studentId: student?.id,
        error: error.message,
        code: error.code,
      });

      if (isControlledProfileError(error)) {
        return {
          ok: false,
          status: error.statusCode || 400,
          error: {
            message: error.message,
            code: error.code,
            details: error.details || [],
          },
        };
      }

      return {
        ok: false,
        status: 500,
        error: {
          message: 'Failed to prepare student personal profile for upload.',
          code: 'STUDENT_PERSONAL_INFO_SETUP_FAILED',
        },
      };
    }
  }

  const previousPublicId = personalInfo.photo_public_id || '';
  let uploadResult = null;

  try {
    uploadResult = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      { folder: 'students', resource_type: 'image' },
    );

    personalInfo.photo_url = uploadResult.secure_url;
    personalInfo.photo_public_id = uploadResult.public_id;
    await personalInfo.save();

    invalidateMenteesCache(student.mentor_id);

    // Fail-safe: cleanup never blocks a successful upload.
    await deleteOldStudentPhotoSafely(previousPublicId, uploadResult.public_id);

    return {
      ok: true,
      data: {
        message: 'Upload successful',
        photoUrl: uploadResult.secure_url,
        photo_public_id: personalInfo.photo_public_id,
        secure_url: uploadResult.secure_url,
      },
    };
  } catch (uploadError) {
    // Rollback: Clean up newly uploaded photo if DB save fails
    if (uploadResult?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadResult.public_id, { invalidate: true });
        console.log('[UPLOAD] Rolled back new photo after error:', uploadResult.public_id);
      } catch (cleanupError) {
        console.error('[UPLOAD] Rollback cleanup failed (non-blocking):', {
          newPublicId: uploadResult.public_id,
          error: cleanupError.message || cleanupError,
        });
      }
    }

    logger.error({
      message: '[UPLOAD] Cloudinary upload error',
      studentId: student?.id,
      error: uploadError.message || uploadError,
    });
    return {
      ok: false,
      status: 500,
      error: 'Upload failed',
    };
  }
};

module.exports = {
  ensureCloudinaryConfigured,
  validateStudentPhotoFile,
  uploadStudentPhotoForRecord,
};
