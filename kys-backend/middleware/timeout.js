/**
 * Request timeout middleware
 * Prevents requests from hanging indefinitely
 */

const logger = require('../utils/logger');

/**
 * Create timeout middleware with configurable duration
 * 
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Function} Express middleware
 */
const createTimeoutMiddleware = (timeoutMs = 30000) => {
    return (req, res, next) => {
        // Set timeout on request
        req.setTimeout(timeoutMs, () => {
            logger.warn({
                reqId: req.id,
                message: 'Request timeout',
                path: req.path,
                method: req.method,
                timeoutMs,
            });

            if (!res.headersSent) {
                res.status(408).json({
                    success: false,
                    data: null,
                    error: 'Request timeout',
                });
            }
        });

        // Set timeout on response
        res.setTimeout(timeoutMs, () => {
            logger.warn({
                reqId: req.id,
                message: 'Response timeout',
                path: req.path,
                method: req.method,
                timeoutMs,
            });

            if (!res.headersSent) {
                res.status(504).json({
                    success: false,
                    data: null,
                    error: 'Gateway timeout',
                });
            }
        });

        next();
    };
};

// Standard timeout for most endpoints
const standardTimeout = createTimeoutMiddleware(30000); // 30s

// Extended timeout for AI/heavy operations
const extendedTimeout = createTimeoutMiddleware(60000); // 60s

module.exports = {
    createTimeoutMiddleware,
    standardTimeout,
    extendedTimeout,
};
