const express = require('express');
const multer = require('multer');
const { validate } = require('../middleware/validate');
const { studentProfileSchema, adminStudentMentorUpdateSchema } = require('../middleware/validation/student.validation');
const { sendResponse } = require('../utils/responseWrapper');
const {
  getStudentsMe,
  putStudentsMe,
  getStudentMe,
  putStudentMe,
  uploadStudentPhoto,
  getStudentMentor,
  getStudentMentoringMinutes,
  searchStudents,
  getStudentById,
  updateStudentMentorByAdmin,
  uploadStudentPhotoByPortal,
} = require('../controllers/student.controller');
const { verifyToken, roleRequired } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

const handlePhotoUpload = (req, res, next) => {
  upload.single('photo')(req, res, (error) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return sendResponse(res, {
        success: false,
        status: 400,
        error: 'File too large. Max size is 2MB',
      });
    }

    if (error) {
      return next(error);
    }

    return next();
  });
};

const studentsRouter = express.Router();
studentsRouter.get('/me', verifyToken, roleRequired(['student']), getStudentsMe);
studentsRouter.put('/me', verifyToken, roleRequired(['student']), validate(studentProfileSchema), putStudentsMe);
studentsRouter.get('/me/mentor', verifyToken, roleRequired(['student']), getStudentMentor);
studentsRouter.get('/me/mentoring-minutes', verifyToken, roleRequired(['student']), getStudentMentoringMinutes);

const studentRouter = express.Router();
studentRouter.get('/me', verifyToken, roleRequired(['student']), getStudentMe);
studentRouter.put('/me', verifyToken, roleRequired(['student']), validate(studentProfileSchema), putStudentMe);
studentRouter.post('/me/upload-photo', verifyToken, roleRequired(['student']), handlePhotoUpload, uploadStudentPhoto);


const apiStudentsRouter = express.Router();
apiStudentsRouter.get('/', verifyToken, roleRequired(['admin', 'faculty']), searchStudents);
apiStudentsRouter.get('/:id', verifyToken, roleRequired(['admin', 'faculty']), getStudentById);
apiStudentsRouter.post(
  '/:id/upload-photo',
  verifyToken,
  roleRequired(['admin', 'faculty']),
  handlePhotoUpload,
  uploadStudentPhotoByPortal,
);
apiStudentsRouter.put(
  '/:id',
  verifyToken,
  roleRequired(['admin']),
  validate(adminStudentMentorUpdateSchema),
  updateStudentMentorByAdmin,
);

module.exports = {
  studentsRouter,
  studentRouter,
  apiStudentsRouter,
};
