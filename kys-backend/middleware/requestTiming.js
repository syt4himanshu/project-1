/**
 * Request timing middleware
 * Tracks and logs API response times for performance monitoring
 */

const logger = require('../utils/logger');

// Store timing stats in memory (in production, use Redis or metrics service)
const timingStats = {
    requests: [],
    maxSize: 1000, // Keep last 1000 requests
};

/**
 * Calculate percentile from sorted array
 */
const calculatePercentile = (sortedArray, percentile) => {
    if (sortedArray.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, index)];
};

/**
 * Get timing statistics
 */
const getTimingStats = () => {
    if (timingStats.requests.length === 0) {
        return {
            count: 0,
            avg: 0,
            p50: 0,
            p95: 0,
            p99: 0,
            min: 0,
            max: 0,
        };
    }

    const durations = timingStats.requests.map(r => r.duration).sort((a, b) => a - b);
    const sum = durations.reduce((a, b) => a + b, 0);

    return {
        count: durations.length,
        avg: Math.round(sum / durations.length),
        p50: calculatePercentile(durations, 50),
        p95: calculatePercentile(durations, 95),
        p99: calculatePercentile(durations, 99),
        min: durations[0],
        max: durations[durations.length - 1],
    };
};

/**
 * Get slow endpoints (P95 > 500ms)
 */
const getSlowEndpoints = () => {
    const endpointMap = new Map();

    timingStats.requests.forEach(req => {
        const key = `${req.method} ${req.path}`;
        if (!endpointMap.has(key)) {
            endpointMap.set(key, []);
        }
        endpointMap.get(key).push(req.duration);
    });

    const slowEndpoints = [];
    endpointMap.forEach((durations, endpoint) => {
        const sorted = durations.sort((a, b) => a - b);
        const p95 = calculatePercentile(sorted, 95);

        if (p95 > 500) {
            slowEndpoints.push({
                endpoint,
                count: durations.length,
                p95,
                avg: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
            });
        }
    });

    return slowEndpoints.sort((a, b) => b.p95 - a.p95);
};

/**
 * Request timing middleware
 */
const requestTiming = (req, res, next) => {
    const start = Date.now();

    // Capture response finish event
    res.on('finish', () => {
        const duration = Date.now() - start;

        const timingData = {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration,
            timestamp: new Date().toISOString(),
            reqId: req.id,
        };

        // Add to stats (circular buffer)
        timingStats.requests.push(timingData);
        if (timingStats.requests.length > timingStats.maxSize) {
            timingStats.requests.shift();
        }

        // Log slow requests (>1s)
        if (duration > 1000) {
            logger.warn({
                message: 'Slow request detected',
                ...timingData,
            });
        }

        // Log very slow requests (>3s)
        if (duration > 3000) {
            logger.error({
                message: 'Very slow request detected',
                ...timingData,
            });
        }

        // Add timing header
        res.setHeader('X-Response-Time', `${duration}ms`);
    });

    next();
};

module.exports = {
    requestTiming,
    getTimingStats,
    getSlowEndpoints,
};
