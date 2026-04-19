const cloudinary = require('cloudinary').v2;
const { invalidateMenteesCache } = require('./facultyMenteesCache');

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

const uploadStudentPhotoForRecord = async (student, file) => {
  if (!student?.personal_info) {
    return {
      ok: false,
      status: 400,
      error: 'Please save personal information first, then upload photo.',
    };
  }

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

  const previousPublicId = student.personal_info.photo_public_id || '';
  let uploadResult = null;

  try {
    uploadResult = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      { folder: 'students', resource_type: 'image' },
    );

    student.personal_info.photo_url = uploadResult.secure_url;
    student.personal_info.photo_public_id = uploadResult.public_id;
    await student.personal_info.save();

    invalidateMenteesCache(student.mentor_id);

    // Fail-safe: Old photo deletion failure does NOT block upload success
    if (previousPublicId && previousPublicId !== uploadResult.public_id) {
      try {
        await cloudinary.uploader.destroy(previousPublicId, { invalidate: true });
        console.log('[UPLOAD] Successfully deleted old photo:', previousPublicId);
      } catch (destroyError) {
        console.error('[UPLOAD] Cloudinary cleanup failed (non-blocking):', {
          oldPublicId: previousPublicId,
          error: destroyError.message || destroyError,
        });
      }
    }

    return {
      ok: true,
      data: {
        message: 'Upload successful',
        photoUrl: uploadResult.secure_url,
        photo_public_id: student.personal_info.photo_public_id,
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

    console.error('[UPLOAD] Cloudinary upload error:', uploadError);
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
