const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

const skipRateLimit = () => {
  if (process.env.ENABLE_RATE_LIMIT_TESTS === 'true') return false;
  return process.env.NODE_ENV === 'test' || Boolean(process.env.VITEST);
};

const isMonitoringOrHealthPath = (req) => {
  const path = req.path || '';
  return (
    path === '/health' ||
    path.startsWith('/api/health/') ||
    path.startsWith('/api/metrics/')
  );
};

const getClientIp = (req) =>
  req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.connection?.remoteAddress || '127.0.0.1';

const createRateLimitHandler = (limiterName, defaultMessage) => (req, res, _next, options) => {
  const retryAfterSec = Math.ceil(options.windowMs / 1000);
  res.setHeader('Retry-After', retryAfterSec);

  logger.warn({
    message: 'Rate limit exceeded',
    limiter: limiterName,
    method: req.method,
    path: req.originalUrl || req.url,
    ip: getClientIp(req),
    userId: req.currentUserId || null,
    statusCode: options.statusCode || 429,
  });

  const responseMessage =
    typeof options.message === 'function'
      ? options.message(req, res)
      : options.message || defaultMessage;

  return res.status(options.statusCode || 429).json(
    typeof responseMessage === 'object' ? responseMessage : { error: responseMessage }
  );
};

const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const username = (req.body?.username || '').toString().toLowerCase().trim();
    return `login:${getClientIp(req)}:${username || 'anonymous'}`;
  },
  skip: () => skipRateLimit(),
  handler: createRateLimitHandler(
    'login',
    'Too many login attempts. Please wait a minute before trying again.'
  ),
});

const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: (req) => (req.currentUserId ? 1000 : 300), // 1000 for authenticated users, 300 for unauthenticated
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.currentUserId) {
      return `user-${req.currentUserId}`;
    }
    return `ip-${getClientIp(req)}`;
  },
  skip: (req) => skipRateLimit() || isMonitoringOrHealthPath(req),
  handler: createRateLimitHandler(
    'global',
    'Too many requests. Please wait a moment and try again.'
  ),
});

const chatbotRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // 10 AI requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.currentUserId) {
      return `user-${req.currentUserId}`;
    }
    return `ip-${getClientIp(req)}`;
  },
  skip: () => skipRateLimit(),
  message: { error: 'Too many chatbot requests. Please retry shortly.' },
  handler: createRateLimitHandler(
    'chatbot',
    'Too many chatbot requests. Please retry shortly.'
  ),
});

module.exports = {
  loginRateLimiter,
  globalRateLimiter,
  chatbotRateLimiter,
  skipRateLimit,
  isMonitoringOrHealthPath,
};
