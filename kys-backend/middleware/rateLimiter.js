const rateLimit = require('express-rate-limit');

const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const globalRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginRateLimiter,
  globalRateLimiter,
};
