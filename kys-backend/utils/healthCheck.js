/**
 * Health check utilities
 */

const { sequelize } = require('../models');

/**
 * Check database health
 */
const checkDatabase = async () => {
    try {
        await sequelize.authenticate();

        // Get pool stats
        const pool = sequelize.connectionManager.pool;

        return {
            status: 'healthy',
            details: {
                connected: true,
                poolSize: pool?.size || 0,
                poolAvailable: pool?.available || 0,
                poolUsing: pool?.using || 0,
                poolWaiting: pool?.waiting || 0,
            },
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            error: error.message,
        };
    }
};

/**
 * Check Groq AI service health via a lightweight live probe.
 */
const checkGroqService = async () => {
    try {
        const Groq = require('groq-sdk');
        const { AI_CONFIG } = require('../config/ai.config');

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return {
                status: 'unhealthy',
                error: 'GROQ_API_KEY not configured',
            };
        }

        const groq = new Groq({ apiKey: String(apiKey).trim() });

        const start = Date.now();
        await groq.chat.completions.create({
            model: AI_CONFIG.model,
            messages: [{ role: 'user', content: 'health' }],
            max_tokens: 5,
        });

        const latency = Date.now() - start;

        return {
            status: 'healthy',
            details: {
                model: AI_CONFIG.model,
                latencyMs: latency,
            },
        };
    } catch (error) {
        return {
            status: 'unhealthy',
            error: error.message,
        };
    }
};

/**
 * Map circuit breaker state to a health-check status label.
 */
const mapBreakerStateToHealthStatus = (state) => {
    if (state === 'CLOSED') return 'healthy';
    if (state === 'HALF_OPEN') return 'degraded';
    return 'unhealthy';
};

/**
 * Get circuit breaker status from the live exported instance.
 */
const getCircuitBreakerStatus = (circuitBreaker) => {
    if (!circuitBreaker) {
        return { status: 'unknown', state: 'unknown' };
    }

    const state = circuitBreaker.getState();
    return {
        status: mapBreakerStateToHealthStatus(state.state),
        state: state.state,
        failureCount: state.failureCount,
        successCount: state.successCount,
        nextAttempt: state.nextAttempt,
    };
};

/**
 * Comprehensive health check.
 * When groqCircuitBreaker is supplied, readiness reflects its live state
 * instead of relying solely on a direct Groq probe.
 */
const performHealthCheck = async (options = {}) => {
    const { includeGroq = false, groqCircuitBreaker = null } = options;

    const checks = {
        database: await checkDatabase(),
    };

    if (includeGroq) {
        const breakerStatus = getCircuitBreakerStatus(groqCircuitBreaker);
        checks.groqCircuitBreaker = breakerStatus;

        if (breakerStatus.state === 'OPEN') {
            checks.groq = {
                status: 'unhealthy',
                error: 'Groq circuit breaker is OPEN',
                skippedLiveProbe: true,
            };
        } else if (breakerStatus.state === 'HALF_OPEN') {
            checks.groq = {
                status: 'degraded',
                error: 'Groq circuit breaker is HALF_OPEN',
                skippedLiveProbe: true,
            };
        } else {
            checks.groq = await checkGroqService();
        }
    }

    const checkStatuses = Object.values(checks).map((check) => check.status);
    const hasUnhealthy = checkStatuses.includes('unhealthy');
    const hasDegraded = checkStatuses.includes('degraded');

    let status = 'healthy';
    if (hasUnhealthy) {
        status = 'unhealthy';
    } else if (hasDegraded) {
        status = 'degraded';
    }

    return {
        status,
        timestamp: new Date().toISOString(),
        checks,
    };
};

module.exports = {
    checkDatabase,
    checkGroqService,
    getCircuitBreakerStatus,
    mapBreakerStateToHealthStatus,
    performHealthCheck,
};
