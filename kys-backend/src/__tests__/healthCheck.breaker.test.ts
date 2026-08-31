import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import CircuitBreaker from '../../utils/circuitBreaker';
import {
  getCircuitBreakerStatus,
  mapBreakerStateToHealthStatus,
  performHealthCheck,
} from '../../utils/healthCheck';

vi.mock('../../models', () => ({
  sequelize: {
    authenticate: vi.fn().mockResolvedValue(undefined),
    connectionManager: {
      pool: {
        size: 5,
        available: 3,
        using: 2,
        waiting: 0,
      },
    },
  },
}));

describe('healthCheck circuit breaker integration', () => {
  let breaker: InstanceType<typeof CircuitBreaker>;

  beforeEach(() => {
    breaker = new CircuitBreaker({
      failureThreshold: 2,
      successThreshold: 1,
      timeout: 30000,
      name: 'test-groq-api',
    });
  });

  it('maps CLOSED, HALF_OPEN, and OPEN to expected health statuses', () => {
    expect(mapBreakerStateToHealthStatus('CLOSED')).toBe('healthy');
    expect(mapBreakerStateToHealthStatus('HALF_OPEN')).toBe('degraded');
    expect(mapBreakerStateToHealthStatus('OPEN')).toBe('unhealthy');
  });

  it('reports live breaker state from the exported instance', () => {
    breaker.reset();
    expect(getCircuitBreakerStatus(breaker)).toMatchObject({
      status: 'healthy',
      state: 'CLOSED',
    });

    breaker.state = 'HALF_OPEN';
    expect(getCircuitBreakerStatus(breaker)).toMatchObject({
      status: 'degraded',
      state: 'HALF_OPEN',
    });

    breaker.state = 'OPEN';
    breaker.failureCount = 5;
    expect(getCircuitBreakerStatus(breaker)).toMatchObject({
      status: 'unhealthy',
      state: 'OPEN',
      failureCount: 5,
    });
  });

  it('marks /api/health/ready unhealthy when breaker is OPEN and skips live Groq probe', async () => {
    breaker.state = 'OPEN';
    breaker.failureCount = 5;
    breaker.nextAttempt = Date.now() + 30000;

    const health = await performHealthCheck({
      includeGroq: true,
      groqCircuitBreaker: breaker,
    });

    expect(health.status).toBe('unhealthy');
    expect(health.checks.groqCircuitBreaker).toMatchObject({
      status: 'unhealthy',
      state: 'OPEN',
    });
    expect(health.checks.groq).toMatchObject({
      status: 'unhealthy',
      skippedLiveProbe: true,
    });
  });

  it('marks readiness degraded when breaker is HALF_OPEN', async () => {
    breaker.state = 'HALF_OPEN';

    const health = await performHealthCheck({
      includeGroq: true,
      groqCircuitBreaker: breaker,
    });

    expect(health.status).toBe('degraded');
    expect(health.checks.groqCircuitBreaker.state).toBe('HALF_OPEN');
    expect(health.checks.groq.skippedLiveProbe).toBe(true);
  });
});
