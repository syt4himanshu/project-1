const express = require('express');
const {
  statistics,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  resetPassword,
  listFaculty,
  listFacultyBasic,
  listFacultyMentees,
  generateMentees,
  confirmMentees,
  removeMentees,
  listAllocation,
  generateAllocation,
  confirmAllocation,
  removeAllocation,
  listAllocationAssignedStudents,
  reportsStats,
  reportsToppers,
  reportsSemesterDistribution,
  reportsBacklogs,
  reportsGeneral,
  reportsIncomplete,
  exportAllStudents,
  exportBacklogs,
  exportIncomplete,
  deleteStudentByUid,
  deleteFacultyById,
} = require('../controllers/admin.controller');
const { verifyToken, roleRequired } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken, roleRequired(['admin']));

router.get('/statistics', statistics);
router.get('/users', listUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/reset-password', resetPassword);
router.get('/faculty', listFaculty);
router.get('/faculty/basic', listFacultyBasic);
router.get('/faculty/:id/mentees', listFacultyMentees);
router.post('/faculty/:id/mentees/generate', generateMentees);
router.post('/faculty/:id/mentees/confirm', confirmMentees);
router.post('/faculty/:id/mentees/remove', removeMentees);
router.get('/allocation', listAllocation);
router.post('/allocation/generate', generateAllocation);
router.post('/allocation/confirm', confirmAllocation);
router.post('/allocation/remove', removeAllocation);
router.get('/allocation/:faculty_id/students', listAllocationAssignedStudents);
router.get('/reports/stats', reportsStats);
router.get('/reports/toppers', reportsToppers);
router.get('/reports/semester-distribution', reportsSemesterDistribution);
router.get('/reports/backlogs', reportsBacklogs);
router.get('/reports/general', reportsGeneral);
router.get('/reports/incomplete', reportsIncomplete);
router.get('/reports/export/all', exportAllStudents);
router.get('/reports/export/backlogs', exportBacklogs);
router.get('/reports/export/incomplete', exportIncomplete);
router.delete('/student/:uid', deleteStudentByUid);
router.delete('/faculty/:id', deleteFacultyById);

module.exports = router;
