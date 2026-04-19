/**
 * Retry utility with exponential backoff
 */

const logger = require('./logger');

/**
 * Sleep for specified milliseconds
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if error is retryable
 */
const isRetryableError = (error) => {
    // Network errors
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
        return true;
    }

    // HTTP status codes
    const status = error.status || error.response?.status;
    if (status === 429 || status === 500 || status === 502 || status === 503 || status === 504) {
        return true;
    }

    // Groq-specific errors
    if (error.message?.includes('rate limit') || error.message?.includes('timeout')) {
        return true;
    }

    return false;
};

/**
 * Execute function with retry logic and exponential backoff
 * 
 * @param {Function} fn - Async function to execute
 * @param {Object} options - Retry options
 * @param {number} options.maxAttempts - Maximum retry attempts (default: 3)
 * @param {number} options.initialDelay - Initial delay in ms (default: 1000)
 * @param {number} options.maxDelay - Maximum delay in ms (default: 10000)
 * @param {number} options.backoffMultiplier - Backoff multiplier (default: 2)
 * @param {Function} options.shouldRetry - Custom retry predicate
 * @param {string} options.operationName - Name for logging
 * @returns {Promise<any>} Result of the function
 */
const retryWithBackoff = async (fn, options = {}) => {
    const {
        maxAttempts = 3,
        initialDelay = 1000,
        maxDelay = 10000,
        backoffMultiplier = 2,
        shouldRetry = isRetryableError,
        operationName = 'operation',
    } = options;

    let lastError;
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const result = await fn();

            if (attempt > 1) {
                logger.info({
                    message: `${operationName} succeeded after retry`,
                    attempt,
                    totalAttempts: maxAttempts,
                });
            }

            return result;
        } catch (error) {
            lastError = error;

            const isLastAttempt = attempt === maxAttempts;
            const canRetry = shouldRetry(error);

            logger.warn({
                message: `${operationName} failed`,
                attempt,
                totalAttempts: maxAttempts,
                error: error.message,
                willRetry: !isLastAttempt && canRetry,
                nextDelayMs: !isLastAttempt && canRetry ? delay : null,
            });

            if (isLastAttempt || !canRetry) {
                throw error;
            }

            // Wait before retry
            await sleep(delay);

            // Exponential backoff with max cap
            delay = Math.min(delay * backoffMultiplier, maxDelay);
        }
    }

    throw lastError;
};

module.exports = {
    retryWithBackoff,
    isRetryableError,
    sleep,
};
