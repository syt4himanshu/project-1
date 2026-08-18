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
 * Extract retry delay in milliseconds from an error object (headers, message, etc.)
 */
const extractRetryDelayMs = (error) => {
    if (!error) return null;

    const headers = error.headers || error.response?.headers;
    if (headers) {
        const retryAfter = headers['retry-after'] || headers['Retry-After'];
        if (retryAfter) {
            const parsedSec = parseFloat(retryAfter);
            if (!Number.isNaN(parsedSec) && parsedSec > 0) {
                return Math.round(parsedSec * 1000);
            }
            const parsedDate = Date.parse(retryAfter);
            if (!Number.isNaN(parsedDate)) {
                return Math.max(0, parsedDate - Date.now());
            }
        }

        const resetSec = headers['x-ratelimit-reset-requests'] || headers['x-ratelimit-reset-tokens'];
        if (resetSec) {
            const parsedSec = parseFloat(resetSec);
            if (!Number.isNaN(parsedSec) && parsedSec > 0) {
                return Math.round(parsedSec * 1000);
            }
        }
    }

    if (typeof error.message === 'string') {
        const matchSec = error.message.match(/try again in\s+([\d.]+)\s*s/i);
        if (matchSec && matchSec[1]) {
            const sec = parseFloat(matchSec[1]);
            if (!Number.isNaN(sec) && sec > 0) {
                return Math.round(sec * 1000);
            }
        }
        const matchMs = error.message.match(/try again in\s+([\d.]+)\s*ms/i);
        if (matchMs && matchMs[1]) {
            const ms = parseFloat(matchMs[1]);
            if (!Number.isNaN(ms) && ms > 0) {
                return Math.round(ms);
            }
        }
    }

    return null;
};

/**
 * Execute function with retry logic and exponential backoff
 * 
 * @param {Function} fn - Async function to execute
 * @param {Object} options - Retry options
 * @param {number} options.maxAttempts - Maximum retry attempts (default: 3)
 * @param {number} options.initialDelay - Initial delay in ms (default: 1000)
 * @param {number} options.maxDelay - Maximum delay in ms (default: 5000)
 * @param {number} options.backoffMultiplier - Backoff multiplier (default: 2)
 * @param {Function} options.shouldRetry - Custom retry predicate
 * @param {string} options.operationName - Name for logging
 * @returns {Promise<any>} Result of the function
 */
const retryWithBackoff = async (fn, options = {}) => {
    const {
        maxAttempts = 3,
        initialDelay = 1000,
        maxDelay = 5000,
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

            // Check if server or Groq suggested a specific retry-after duration
            const suggestedDelay = extractRetryDelayMs(error);
            let waitTimeMs = suggestedDelay !== null ? suggestedDelay : delay;

            // Apply slight jitter (±15%) to prevent synchronized retry spikes
            const jitterMultiplier = 0.85 + Math.random() * 0.3;
            waitTimeMs = Math.round(Math.min(Math.max(waitTimeMs * jitterMultiplier, 200), maxDelay));

            logger.warn({
                message: `${operationName} failed`,
                attempt,
                totalAttempts: maxAttempts,
                error: error.message,
                status: error.status || error.response?.status || null,
                willRetry: !isLastAttempt && canRetry,
                nextDelayMs: !isLastAttempt && canRetry ? waitTimeMs : null,
            });

            if (isLastAttempt || !canRetry) {
                throw error;
            }

            // Wait before retry
            await sleep(waitTimeMs);

            // Exponential backoff with max cap
            delay = Math.min(delay * backoffMultiplier, maxDelay);
        }
    }

    throw lastError;
};

module.exports = {
    retryWithBackoff,
    isRetryableError,
    extractRetryDelayMs,
    sleep,
};
