const rateLimit = require('express-rate-limit');
const rateLimitModule = require('express-rate-limit');
const ipKeyGenerator = rateLimitModule.ipKeyGenerator || ((req) => req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip);

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

const chatbotRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Prefer authenticated user ID (using currentUserId set by auth middleware)
    if (req.currentUserId) {
      return `user-${req.currentUserId}`;
    }

    // Fallback to safe IP generator (IPv6-safe)
    return ipKeyGenerator(req);
  },
  message: { error: 'Too many chatbot requests. Please retry shortly.' },
});

module.exports = {
  loginRateLimiter,
  globalRateLimiter,
  chatbotRateLimiter,
};
