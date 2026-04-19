# 🔧 Reliability Patterns - Code Examples

## Overview

This document provides **copy-paste ready code examples** for implementing reliability patterns in your application.

---

## 1️⃣ Retry Pattern

### Basic Retry

```javascript
const { retryWithBackoff } = require('./utils/retry');

// Retry any async operation
const result = await retryWithBackoff(
  async () => {
    return await someApiCall();
  },
  {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 5000,
    operationName: 'api-call',
  }
);
```

### Custom Retry Logic

```javascript
const { retryWithBackoff } = require('./utils/retry');

const result = await retryWithBackoff(
  async () => {
    return await externalService.call();
  },
  {
    maxAttempts: 5,
    initialDelay: 500,
    maxDelay: 10000,
    backoffMultiplier: 2,
    operationName: 'external-service',
    shouldRetry: (error) => {
      // Custom retry logic
      if (error.code === 'AUTH_ERROR') return false;
      if (error.status === 429) return true;
      return error.status >= 500;
    },
  }
);
```

### Retry with Timeout

```javascript
const { retryWithBackoff } = require('./utils/retry');

const result = await Promise.race([
  retryWithBackoff(
    async () => await apiCall(),
    { maxAttempts: 3 }
  ),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Overall timeout')), 30000)
  ),
]);
```

---

## 2️⃣ Circuit Breaker Pattern

### Basic Circuit Breaker

```javascript
const CircuitBreaker = require('./utils/circuitBreaker');

// Create circuit breaker
const myServiceBreaker = new CircuitBreaker({
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 30000,
  name: 'my-service',
});

// Use circuit breaker
const result = await myServiceBreaker.execute(async () => {
  return await myService.call();
});
```

### Check Circuit Breaker State

```javascript
const state = myServiceBreaker.getState();

console.log(state);
// {
//   state: 'CLOSED',
//   failureCount: 0,
//   successCount: 0,
//   nextAttempt: 1713432000000
// }

if (state.state === 'OPEN') {
  console.log('Service is down, failing fast');
}
```

### Manual Circuit Breaker Control

```javascript
// Reset circuit breaker manually
myServiceBreaker.reset();

// Check if circuit is open
if (myServiceBreaker.getState().state === 'OPEN') {
  // Provide fallback
  return { data: 'cached-data', source: 'cache' };
}
```

### Circuit Breaker with Fallback

```javascript
let result;
try {
  result = await myServiceBreaker.execute(async () => {
    return await primaryService.call();
  });
} catch (error) {
  if (error.circuitBreakerOpen) {
    // Circuit is open, use fallback
    result = await fallbackService.call();
  } else {
    throw error;
  }
}
```

---

## 3️⃣ Timeout Pattern

### Request Timeout Middleware

```javascript
const { extendedTimeout } = require('./middleware/timeout');

// Apply to specific route
router.post('/api/heavy-operation', extendedTimeout, async (req, res) => {
  // This route has 60s timeout
  const result = await heavyOperation();
  res.json(result);
});
```

### Custom Timeout

```javascript
const { createTimeoutMiddleware } = require('./middleware/timeout');

// Create custom timeout (2 minutes)
const longTimeout = createTimeoutMiddleware(120000);

router.post('/api/batch-process', longTimeout, async (req, res) => {
  // This route has 2 minute timeout
  const result = await batchProcess();
  res.json(result);
});
```

### Promise Timeout Wrapper

```javascript
const withTimeout = (promise, timeoutMs) => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
    ),
  ]);
};

// Usage
const result = await withTimeout(
  slowOperation(),
  5000 // 5s timeout
);
```

---

## 4️⃣ Error Boundary Pattern

### Basic Error Boundary

```tsx
import { ErrorBoundary } from './shared/components/ErrorBoundary';

function MyComponent() {
  return (
    <ErrorBoundary>
      <RiskyComponent />
    </ErrorBoundary>
  );
}
```

### Custom Fallback UI

```tsx
import { ErrorBoundary } from './shared/components/ErrorBoundary';

function MyComponent() {
  return (
    <ErrorBoundary
      fallback={
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>Please contact support if this persists.</p>
        </div>
      }
    >
      <RiskyComponent />
    </ErrorBoundary>
  );
}
```

### Error Boundary with Logging

```tsx
import { ErrorBoundary } from './shared/components/ErrorBoundary';

function MyComponent() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Send to error tracking service
        console.error('Component error:', error, errorInfo);
        // errorTrackingService.captureException(error, { extra: errorInfo });
      }}
    >
      <RiskyComponent />
    </ErrorBoundary>
  );
}
```

---

## 5️⃣ Logging Pattern

### Structured Logging

```javascript
const logger = require('./utils/logger');

// Basic logging
logger.info({ message: 'User logged in', userId: 123 });
logger.warn({ message: 'Slow query detected', durationMs: 1500 });
logger.error({ message: 'API call failed', error: error.message });

// With context
const requestLogger = logger.withContext({ reqId: req.id, userId: req.currentUserId });
requestLogger.info({ message: 'Processing request', path: req.path });
```

### Request Logging Middleware

```javascript
const logger = require('./utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info({
      reqId: req.id,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: duration,
      userId: req.currentUserId,
    });
    
    if (duration > 1000) {
      logger.warn({
        message: 'Slow request',
        reqId: req.id,
        path: req.path,
        durationMs: duration,
      });
    }
  });
  
  next();
};

app.use(requestLogger);
```

### Error Logging

```javascript
const logger = require('./utils/logger');

try {
  await riskyOperation();
} catch (error) {
  logger.error({
    message: 'Operation failed',
    error: error.message,
    stack: error.stack,
    context: {
      userId: req.currentUserId,
      operation: 'riskyOperation',
    },
  });
  throw error;
}
```

---

## 6️⃣ Health Check Pattern

### Basic Health Check

```javascript
const { performHealthCheck } = require('./utils/healthCheck');

app.get('/health', async (req, res) => {
  const health = await performHealthCheck();
  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

### Custom Health Check

```javascript
const { checkDatabase } = require('./utils/healthCheck');

app.get('/health/custom', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    s3: await checkS3(),
  };
  
  const allHealthy = Object.values(checks).every(c => c.status === 'healthy');
  
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'degraded',
    checks,
  });
});
```

### Kubernetes Probes

```javascript
// Liveness probe - is the app running?
app.get('/health/live', (req, res) => {
  res.json({ status: 'ok' });
});

// Readiness probe - is the app ready to serve traffic?
app.get('/health/ready', async (req, res) => {
  const health = await performHealthCheck({ includeGroq: true });
  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

---

## 7️⃣ Database Reliability

### Query Timeout

```javascript
// Already configured in config/database.js
// All queries automatically timeout after 10s

// For specific query timeout
const result = await sequelize.query(
  'SELECT * FROM students WHERE ...',
  {
    timeout: 5000, // 5s timeout for this query
  }
);
```

### Connection Retry

```javascript
const { sequelize } = require('./models');

const connectWithRetry = async (maxAttempts = 5) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await sequelize.authenticate();
      console.log('Database connected');
      return;
    } catch (error) {
      console.error(`Connection attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxAttempts) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
    }
  }
};

// Use in server startup
await connectWithRetry();
```

### Transaction Timeout

```javascript
const result = await sequelize.transaction(
  {
    isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    timeout: 30000, // 30s transaction timeout
  },
  async (t) => {
    // Your transaction operations
    await Student.update({ ... }, { transaction: t });
    await MentoringMinute.create({ ... }, { transaction: t });
    return result;
  }
);
```

---

## 8️⃣ Frontend HTTP Retry

### Automatic Retry

```typescript
// Already configured in httpClient.ts
// All requests automatically retry on failure

import { requestJson } from './shared/api/httpClient';

// This will retry automatically
const data = await requestJson('/api/students', {
  method: 'GET',
  token: authToken,
});
```

### Custom Retry Configuration

```typescript
import { requestJson } from './shared/api/httpClient';

const data = await requestJson('/api/critical-endpoint', {
  method: 'POST',
  body: { ... },
  token: authToken,
  retry: {
    maxAttempts: 5,      // More retries for critical endpoint
    initialDelay: 500,   // Faster initial retry
    maxDelay: 10000,     // Longer max delay
  },
});
```

### Disable Retry

```typescript
import { requestJson } from './shared/api/httpClient';

const data = await requestJson('/api/no-retry', {
  method: 'POST',
  body: { ... },
  token: authToken,
  retry: {
    maxAttempts: 1, // No retry
  },
});
```

---

## 9️⃣ Graceful Degradation

### AI Service Fallback

```javascript
const { generateFacultyInsights } = require('./services/groq.service');

const generateRemarks = async (query, studentContext) => {
  try {
    // Try AI service
    const aiRemarks = await generateFacultyInsights({ query, studentContext });
    return { content: aiRemarks, source: 'ai' };
  } catch (error) {
    logger.warn({ message: 'AI service unavailable, using fallback', error: error.message });
    
    // Fallback to template-based remarks
    const templateRemarks = generateTemplateRemarks(studentContext);
    return { content: templateRemarks, source: 'template' };
  }
};
```

### Cache Fallback

```javascript
const getStudentData = async (studentId) => {
  try {
    // Try database
    const student = await Student.findByPk(studentId);
    
    // Cache the result
    await cache.set(`student:${studentId}`, student, 300); // 5 min TTL
    
    return student;
  } catch (error) {
    logger.warn({ message: 'Database unavailable, using cache', error: error.message });
    
    // Fallback to cache
    const cachedStudent = await cache.get(`student:${studentId}`);
    
    if (cachedStudent) {
      return cachedStudent;
    }
    
    throw new Error('Student data unavailable');
  }
};
```

### Feature Flag

```javascript
const isFeatureEnabled = (featureName) => {
  const features = {
    aiRemarks: process.env.ENABLE_AI_REMARKS !== 'false',
    advancedReports: process.env.ENABLE_ADVANCED_REPORTS === 'true',
  };
  
  return features[featureName] ?? false;
};

// Usage
if (isFeatureEnabled('aiRemarks')) {
  const remarks = await generateAIRemarks(query, context);
} else {
  const remarks = generateBasicRemarks(context);
}
```

---

## 🔟 Rate Limiting

### Endpoint-Specific Rate Limit

```javascript
const rateLimit = require('express-rate-limit');

const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: { error: 'Too many AI requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/api/faculty/ai-remarks', aiRateLimiter, async (req, res) => {
  // Handle request
});
```

### User-Based Rate Limit

```javascript
const rateLimit = require('express-rate-limit');

const userRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req) => {
    return req.currentUserId ? `user-${req.currentUserId}` : req.ip;
  },
});

app.use('/api/', userRateLimiter);
```

---

## 1️⃣1️⃣ Monitoring Helpers

### Performance Tracking

```javascript
const trackPerformance = async (operationName, fn) => {
  const start = Date.now();
  
  try {
    const result = await fn();
    const duration = Date.now() - start;
    
    logger.info({
      message: 'Operation completed',
      operation: operationName,
      durationMs: duration,
      success: true,
    });
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    
    logger.error({
      message: 'Operation failed',
      operation: operationName,
      durationMs: duration,
      success: false,
      error: error.message,
    });
    
    throw error;
  }
};

// Usage
const result = await trackPerformance('fetch-students', async () => {
  return await Student.findAll();
});
```

### Metrics Collection

```javascript
const metrics = {
  requests: 0,
  errors: 0,
  slowQueries: 0,
  circuitBreakerOpens: 0,
};

const incrementMetric = (metricName) => {
  metrics[metricName] = (metrics[metricName] || 0) + 1;
};

// Expose metrics endpoint
app.get('/metrics', (req, res) => {
  res.json({
    ...metrics,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});
```

---

## 📚 Complete Example: Reliable API Endpoint

```javascript
const express = require('express');
const { retryWithBackoff } = require('./utils/retry');
const CircuitBreaker = require('./utils/circuitBreaker');
const { extendedTimeout } = require('./middleware/timeout');
const logger = require('./utils/logger');

const router = express.Router();

// Circuit breaker for external service
const externalServiceBreaker = new CircuitBreaker({
  failureThreshold: 5,
  timeout: 30000,
  name: 'external-service',
});

router.post(
  '/api/reliable-endpoint',
  extendedTimeout, // 60s timeout
  async (req, res) => {
    const requestLogger = logger.withContext({ reqId: req.id });
    const start = Date.now();
    
    try {
      requestLogger.info({ message: 'Request started', body: req.body });
      
      // Validate input
      if (!req.body.data) {
        return res.status(400).json({ error: 'Missing data' });
      }
      
      // Call external service with retry + circuit breaker
      const result = await externalServiceBreaker.execute(async () => {
        return await retryWithBackoff(
          async () => {
            return await externalService.call(req.body.data);
          },
          {
            maxAttempts: 3,
            initialDelay: 1000,
            operationName: 'external-service-call',
          }
        );
      });
      
      const duration = Date.now() - start;
      requestLogger.info({
        message: 'Request completed',
        durationMs: duration,
        success: true,
      });
      
      res.json({ success: true, data: result });
      
    } catch (error) {
      const duration = Date.now() - start;
      
      requestLogger.error({
        message: 'Request failed',
        durationMs: duration,
        error: error.message,
        stack: error.stack,
      });
      
      if (error.circuitBreakerOpen) {
        return res.status(503).json({
          error: 'Service temporarily unavailable',
        });
      }
      
      res.status(500).json({
        error: 'Internal server error',
      });
    }
  }
);

module.exports = router;
```

---

**Last Updated**: 2026-04-18  
**Version**: 1.0.0
