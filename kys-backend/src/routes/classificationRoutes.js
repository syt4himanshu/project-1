const express = require('express');
const router = express.Router();
const classificationController = require('../controllers/classificationController');
const rateLimit = require('express-rate-limit');
const { createSupportPlanSchema, updateSupportPlanSchema } = require('../validations/classificationValidation');

// Use correct middleware paths based on project structure
const { verifyToken, roleRequired } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate'); 

const getLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: 'Too many action requests from this IP, please try again after 15 minutes'
});

// Protect all routes + restrict to Admin
router.use(verifyToken);
router.use(roleRequired(['admin']));

router.get('/', verifyToken, roleRequired(['admin']), getLimiter, classificationController.getClassifications);
router.get('/summary', verifyToken, roleRequired(['admin']), getLimiter, classificationController.getSummary);
router.get('/support-plans/:studentId', verifyToken, roleRequired(['admin']), getLimiter, classificationController.getSupportPlans);
router.post('/import-mse', verifyToken, roleRequired(['admin']), postLimiter, classificationController.importMseMarks);

router.post(
  '/support-plan',
  verifyToken,
  roleRequired(['admin']),
  postLimiter,
  validate(createSupportPlanSchema),
  classificationController.createSupportPlan
);

router.patch(
  '/support-plans/:planId',
  postLimiter,
  validate(updateSupportPlanSchema),
  classificationController.updateSupportPlan
);

module.exports = router;
