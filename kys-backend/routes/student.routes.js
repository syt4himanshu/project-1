const express = require('express');
const multer = require('multer');
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
} = require('../controllers/student.controller');
const { verifyToken, roleRequired } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

const studentsRouter = express.Router();
studentsRouter.get('/me', verifyToken, roleRequired(['student']), getStudentsMe);
studentsRouter.put('/me', verifyToken, roleRequired(['student']), putStudentsMe);
studentsRouter.get('/me/mentor', verifyToken, roleRequired(['student']), getStudentMentor);
studentsRouter.get('/me/mentoring-minutes', verifyToken, roleRequired(['student']), getStudentMentoringMinutes);

const studentRouter = express.Router();
studentRouter.get('/me', verifyToken, roleRequired(['student']), getStudentMe);
studentRouter.put('/me', verifyToken, roleRequired(['student']), putStudentMe);
studentRouter.post('/me/upload-photo', verifyToken, roleRequired(['student']), upload.single('photo'), uploadStudentPhoto);

const apiStudentsRouter = express.Router();
apiStudentsRouter.get('/', verifyToken, roleRequired(['admin', 'faculty']), searchStudents);
apiStudentsRouter.get('/:id', verifyToken, roleRequired(['admin', 'faculty']), getStudentById);
apiStudentsRouter.put('/:id', verifyToken, roleRequired(['admin']), updateStudentMentorByAdmin);

module.exports = {
  studentsRouter,
  studentRouter,
  apiStudentsRouter,
};
