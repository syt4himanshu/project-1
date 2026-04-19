/**
 * Health check utilities
 */

const { sequelize } = require('../models');
const CircuitBreaker = require('./circuitBreaker');

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
 * Check Groq AI service health
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
 * Get circuit breaker status
 */
const getCircuitBreakerStatus = (circuitBreaker) => {
    if (!circuitBreaker) {
        return { status: 'unknown' };
    }

    const state = circuitBreaker.getState();
    return {
        state: state.state,
        failureCount: state.failureCount,
        successCount: state.successCount,
    };
};

/**
 * Comprehensive health check
 */
const performHealthCheck = async (options = {}) => {
    const { includeGroq = false, groqCircuitBreaker = null } = options;

    const checks = {
        database: await checkDatabase(),
    };

    if (includeGroq) {
        checks.groq = await checkGroqService();

        if (groqCircuitBreaker) {
            checks.groqCircuitBreaker = getCircuitBreakerStatus(groqCircuitBreaker);
        }
    }

    // Determine overall status
    const allHealthy = Object.values(checks).every(
        check => check.status === 'healthy' || check.status === 'unknown'
    );

    return {
        status: allHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        checks,
    };
};

module.exports = {
    checkDatabase,
    checkGroqService,
    getCircuitBreakerStatus,
    performHealthCheck,
};
