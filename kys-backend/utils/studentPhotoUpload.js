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
  if (file.mimetype !== 'application/pdf') return 'Only PDF files are allowed';
  if (file.size > 1 * 1024 * 1024) return 'File too large. Max size is 1MB';
  return null;
};

const deleteOldStudentPhotoSafely = async (previousPublicId, currentPublicId) => {
  if (!previousPublicId || previousPublicId === currentPublicId) return;

  try {
    await cloudinary.uploader.destroy(previousPublicId, { invalidate: true });
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
    console.log("=== UPLOADING TO CLOUDINARY ===");
    console.log({
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      bufferLength: file.buffer?.length,
      firstBytes: file.buffer?.subarray(0, 20).toString('hex')
    });

    // Step 1: Verify actual PDF magic bytes
    const hex = file.buffer?.subarray(0, 5).toString('hex');
    if (hex !== '255044462d') { // %PDF-
      throw new Error(`File is not a valid PDF document (missing PDF signature, got ${hex}).`);
    }

    // Use default image resource type for PDF rendering
    const uploadOptions = { folder: 'students', upload_preset: 'student_images_kys' };
    console.log("Upload Options:", uploadOptions);

    uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error("Cloudinary Error:", error);
            return reject(error);
          }
          resolve(result);
        }
      );
      const { Readable } = require('stream');
      Readable.from(file.buffer).pipe(stream);
    });

    console.log("=== CLOUDINARY RESPONSE ===");
    console.log({
      public_id: uploadResult.public_id,
      secure_url: uploadResult.secure_url,
      url: uploadResult.url,
      resource_type: uploadResult.resource_type,
      type: uploadResult.type,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      original_filename: uploadResult.original_filename,
      version: uploadResult.version
    });

    if (!uploadResult || !uploadResult.public_id || !uploadResult.secure_url || uploadResult.resource_type !== 'image' || !(uploadResult.bytes > 0)) {
      throw new Error('Cloudinary returned an invalid or incomplete response for an image asset.');
    }

    // Generate preview URL (page 1 as JPG)
    const previewUrl = cloudinary.url(uploadResult.public_id, {
      secure: true,
      format: 'jpg',
      type: uploadResult.type,
      resource_type: 'image'
    });
    console.log("Generated preview URL:", previewUrl);

    // Step 3: Verify the Cloudinary Asset
    try {
      const assetDetails = await cloudinary.api.resource(uploadResult.public_id, { resource_type: 'image' });
      if (!assetDetails || assetDetails.resource_type !== 'image' || !(assetDetails.bytes > 0)) {
        throw new Error('Asset verification failed in Cloudinary.');
      }
    } catch (verifyError) {
      throw new Error(`Asset verification error: ${verifyError.message || verifyError}`);
    }

    personalInfo.photo_url = uploadResult.secure_url;
    personalInfo.photo_public_id = uploadResult.public_id;
    personalInfo.photo_preview_url = previewUrl;
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
        photo_preview_url: personalInfo.photo_preview_url,
        secure_url: uploadResult.secure_url,
      },
    };
  } catch (uploadError) {
    console.error("=== UPLOAD CATCH ERROR ===");
    console.error(uploadError);
    if (uploadError.stack) console.error(uploadError.stack);

    // Rollback: Clean up newly uploaded photo if DB save fails
    if (uploadResult?.public_id) {
      try {
        await cloudinary.uploader.destroy(uploadResult.public_id, { invalidate: true });
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
      error: uploadError.message || JSON.stringify(uploadError) || 'Upload failed',
    };
  }
};

module.exports = {
  ensureCloudinaryConfigured,
  validateStudentPhotoFile,
  uploadStudentPhotoForRecord,
};
