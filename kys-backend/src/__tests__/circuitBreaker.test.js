import { beforeEach, describe, expect, it } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const CircuitBreaker = require('../../utils/circuitBreaker');
const { createAIUnavailableError } = require('../../utils/aiErrors');

describe('circuitBreaker state machine', () => {
  let breaker;

  beforeEach(() => {
    breaker = new CircuitBreaker({
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 30_000,
      name: 'test-breaker',
    });
  });

  it('starts CLOSED and passes successful calls through', async () => {
    const result = await breaker.execute(async () => 'ok');
    expect(result).toBe('ok');
    expect(breaker.getState().state).toBe('CLOSED');
    expect(breaker.getState().failureCount).toBe(0);
  });

  it('opens after consecutive failures reach the threshold', async () => {
    for (let i = 0; i < 3; i += 1) {
      await expect(
        breaker.execute(async () => {
          throw new Error(`fail ${i}`);
        }),
      ).rejects.toThrow(`fail ${i}`);
    }

    expect(breaker.getState().state).toBe('OPEN');
    expect(breaker.getState().failureCount).toBe(3);
  });

  it('rejects immediately while OPEN before nextAttempt', async () => {
    breaker.state = 'OPEN';
    breaker.failureCount = 3;
    breaker.nextAttempt = Date.now() + 60_000;

    await expect(
      breaker.execute(async () => 'should not run'),
    ).rejects.toMatchObject({
      message: 'Circuit breaker is OPEN for test-breaker',
      circuitBreakerOpen: true,
    });
  });

  it('enters HALF_OPEN after the open timeout elapses', async () => {
    breaker.state = 'OPEN';
    breaker.failureCount = 3;
    breaker.nextAttempt = Date.now() - 1;

    const result = await breaker.execute(async () => 'probe ok');

    expect(result).toBe('probe ok');
    expect(breaker.getState().state).toBe('HALF_OPEN');
  });

  it('recovers to CLOSED after enough successes in HALF_OPEN', async () => {
    breaker.state = 'OPEN';
    breaker.failureCount = 3;
    breaker.nextAttempt = Date.now() - 1;

    await breaker.execute(async () => 'probe 1');
    expect(breaker.getState().state).toBe('HALF_OPEN');

    await breaker.execute(async () => 'probe 2');
    expect(breaker.getState().state).toBe('CLOSED');
    expect(breaker.getState().successCount).toBe(0);
  });

  it('returns to OPEN when HALF_OPEN probe fails enough times', async () => {
    breaker.failureThreshold = 2;
    breaker.state = 'OPEN';
    breaker.failureCount = 2;
    breaker.nextAttempt = Date.now() - 1;

    await expect(
      breaker.execute(async () => {
        throw new Error('still failing');
      }),
    ).rejects.toThrow('still failing');

    expect(breaker.getState().state).toBe('OPEN');
  });

  it('does not count skipCircuitBreaker errors toward opening', async () => {
    const skipped = createAIUnavailableError('ignored');
    skipped.skipCircuitBreaker = true;

    await expect(
      breaker.execute(async () => {
        throw skipped;
      }),
    ).rejects.toMatchObject({ code: 'AI_UNAVAILABLE' });

    expect(breaker.getState().state).toBe('CLOSED');
    expect(breaker.getState().failureCount).toBe(0);
  });

  it('handles concurrent requests against a shared breaker instance', async () => {
    breaker.failureThreshold = 2;

    const run = () =>
      breaker
        .execute(async () => {
          throw createAIUnavailableError('provider down');
        })
        .catch((error) => error);

    const [first, second, third] = await Promise.all([run(), run(), run()]);

    expect(breaker.getState().state).toBe('OPEN');
    const codes = [first, second, third].map((error) => error?.code);
    expect(codes).toContain('AI_UNAVAILABLE');
  });
});
