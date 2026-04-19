/**
 * Circuit Breaker pattern implementation
 * Prevents cascading failures by failing fast when a service is down
 */

const logger = require('./logger');

const CIRCUIT_STATE = {
    CLOSED: 'CLOSED',     // Normal operation
    OPEN: 'OPEN',         // Failing, reject immediately
    HALF_OPEN: 'HALF_OPEN', // Testing if service recovered
};

class CircuitBreaker {
    constructor(options = {}) {
        this.failureThreshold = options.failureThreshold || 5;
        this.successThreshold = options.successThreshold || 2;
        this.timeout = options.timeout || 30000; // 30s
        this.name = options.name || 'circuit-breaker';

        this.state = CIRCUIT_STATE.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.nextAttempt = Date.now();
    }

    async execute(fn) {
        if (this.state === CIRCUIT_STATE.OPEN) {
            if (Date.now() < this.nextAttempt) {
                const error = new Error(`Circuit breaker is OPEN for ${this.name}`);
                error.circuitBreakerOpen = true;
                throw error;
            }

            // Try half-open
            this.state = CIRCUIT_STATE.HALF_OPEN;
            logger.info({ message: `Circuit breaker ${this.name} entering HALF_OPEN state` });
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    onSuccess() {
        this.failureCount = 0;

        if (this.state === CIRCUIT_STATE.HALF_OPEN) {
            this.successCount++;

            if (this.successCount >= this.successThreshold) {
                this.state = CIRCUIT_STATE.CLOSED;
                this.successCount = 0;
                logger.info({ message: `Circuit breaker ${this.name} CLOSED (recovered)` });
            }
        }
    }

    onFailure() {
        this.failureCount++;
        this.successCount = 0;

        if (this.failureCount >= this.failureThreshold) {
            this.state = CIRCUIT_STATE.OPEN;
            this.nextAttempt = Date.now() + this.timeout;

            logger.error({
                message: `Circuit breaker ${this.name} OPEN`,
                failureCount: this.failureCount,
                nextAttemptIn: `${this.timeout}ms`,
            });
        }
    }

    getState() {
        return {
            state: this.state,
            failureCount: this.failureCount,
            successCount: this.successCount,
            nextAttempt: this.nextAttempt,
        };
    }

    reset() {
        this.state = CIRCUIT_STATE.CLOSED;
        this.failureCount = 0;
        this.successCount = 0;
        this.nextAttempt = Date.now();
        logger.info({ message: `Circuit breaker ${this.name} manually reset` });
    }
}

module.exports = CircuitBreaker;
