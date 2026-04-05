const express = require('express');
const {
  getMyFaculty,
  updateMyFaculty,
  getMyMentees,
  getMenteeByUid,
  addMentoringMinute,
  getMenteeMentoringMinutes,
} = require('../controllers/faculty.controller');
const { verifyToken, roleRequired } = require('../middleware/auth');

const router = express.Router();
router.use(verifyToken, roleRequired(['faculty']));

router.get('/me', getMyFaculty);
router.put('/me', updateMyFaculty);
router.get('/me/mentees', getMyMentees);
router.get('/me/mentees/:uid', getMenteeByUid);
router.post('/me/mentees/:uid/minutes', addMentoringMinute);
router.get('/me/mentees/:uid/minutes', getMenteeMentoringMinutes);

module.exports = router;
