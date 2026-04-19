const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }), // Include stack traces
    format.json()
  ),
  transports: [new transports.Console()],
});

/**
 * Create a child logger with request context
 * @param {Object} context - Context object (e.g., { reqId, userId })
 * @returns {Object} Child logger with context
 */
logger.withContext = (context) => {
  return logger.child(context);
};

module.exports = logger;
