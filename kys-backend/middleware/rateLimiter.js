const rateLimit = require('express-rate-limit');

const skipRateLimit = () => process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);

const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipRateLimit,
});

const globalRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  skip: skipRateLimit,
});

module.exports = {
  loginRateLimiter,
  globalRateLimiter,
};
