const express = require('express');
const {
  login,
  verify,
  verifyAlias,
  register,
  registerBulkStudents,
  registerBulkFaculty,
  changePassword,
  logout,
} = require('../controllers/auth.controller');
const { verifyToken, verifyTokenOptional, roleRequired } = require('../middleware/auth');
const { loginRateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/login', loginRateLimiter, login);
router.get('/verify', verifyToken, verify);
router.get('/verify-token', verifyTokenOptional, verifyAlias);
router.post('/register', verifyToken, roleRequired(['admin']), register);
router.post('/register/bulk', verifyToken, roleRequired(['admin']), registerBulkStudents);
router.post('/register/faculty/bulk', verifyToken, roleRequired(['admin']), registerBulkFaculty);
router.post('/change-password', verifyToken, roleRequired(['student', 'faculty', 'admin']), changePassword);
router.post('/logout', verifyToken, logout);

module.exports = router;
