const express = require('express');
const { body, param, query } = require('express-validator');
const {
  getMyFaculty,
  updateMyFaculty,
  getMyMentees,
  getMenteeByUid,
  addMentoringMinute,
  getMenteeMentoringMinutes,
  facultyChatbot,
} = require('../controllers/faculty.controller');
const { generateAIRemarks } = require('../controllers/faculty-ai.controller');
const { verifyToken, roleRequired } = require('../middleware/auth');
const { chatbotRateLimiter } = require('../middleware/rateLimiter');
const { validateRequest } = require('../middleware/validate');
const { withRequestId } = require('../middleware/requestId');

const router = express.Router();

router.use(withRequestId, verifyToken, roleRequired(['faculty']));

router.get('/me', getMyFaculty);
router.put(
  '/me',
  [
    body('first_name').optional().isString().trim(),
    body('last_name').optional().isString().trim(),
    body('contact_number').optional().isString().trim(),
    validateRequest
  ],
  updateMyFaculty
);

router.get(
  '/me/mentees',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    validateRequest
  ],
  getMyMentees
);

router.get(
  '/me/mentees/:uid',
  [param('uid').isString().trim().notEmpty(), validateRequest],
  getMenteeByUid
);

router.post(
  '/me/mentees/:uid/minutes',
  [
    param('uid').isString().trim().notEmpty(),
    body('remarks').isString().trim().notEmpty().withMessage('Remarks are required'),
    body('suggestion').optional().isString().trim(),
    body('action').optional().isString().trim(),
    validateRequest
  ],
  addMentoringMinute
);

router.get(
  '/me/mentees/:uid/minutes',
  [
    param('uid').isString().trim().notEmpty(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt(),
    validateRequest
  ],
  getMenteeMentoringMinutes
);

router.post(
  '/chatbot',
  chatbotRateLimiter,
  [
    body('query').isString().trim().isLength({ min: 1, max: 2000 }).withMessage('Query must be 1-2000 characters'),
    body('studentId').optional().isString().trim().isLength({ max: 50 }),
    validateRequest
  ],
  facultyChatbot
);

router.post(
  '/ai-remarks',
  chatbotRateLimiter,
  [
    body('query').isString().trim().isLength({ min: 1, max: 500 }).withMessage('Query must be 1-500 characters'),
    body('studentContext').isObject().withMessage('Student context is required'),
    body('studentContext.uid').isString().trim().notEmpty().withMessage('Student UID is required'),
    body('studentContext.name').isString().trim().notEmpty().withMessage('Student name is required'),
    body('studentContext.semester').isInt({ min: 1, max: 12 }).withMessage('Valid semester is required'),
    validateRequest
  ],
  generateAIRemarks
);

module.exports = router;
