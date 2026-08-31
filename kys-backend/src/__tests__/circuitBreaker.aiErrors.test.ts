import { beforeEach, describe, expect, it } from 'vitest';
import CircuitBreaker from '../../utils/circuitBreaker';
import {
  AI_ERROR_CODES,
  createAIConfigError,
  createAIUnavailableError,
  createValidationError,
} from '../../utils/aiErrors';

describe('Circuit breaker with AI error taxonomy', () => {
  let breaker: InstanceType<typeof CircuitBreaker>;

  beforeEach(() => {
    breaker = new CircuitBreaker({
      failureThreshold: 5,
      successThreshold: 2,
      timeout: 30000,
      name: 'test-groq-api',
    });
  });

  it('does not increment failureCount for application-style VALIDATION_ERROR', async () => {
    await expect(
      breaker.execute(async () => {
        throw createValidationError('cleanAndValidateResponse is not defined');
      }),
    ).rejects.toMatchObject({
      code: AI_ERROR_CODES.VALIDATION_ERROR,
      skipCircuitBreaker: true,
    });

    expect(breaker.getState().failureCount).toBe(0);
    expect(breaker.getState().state).toBe('CLOSED');
  });

  it('does not increment failureCount for wrapped ReferenceError-style bugs', async () => {
    await expect(
      breaker.execute(async () => {
        try {
          // Simulate an application bug after a successful provider call.
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const fn = cleanAndValidateResponse;
          return 'unused';
        } catch (error) {
          throw createValidationError((error as Error).message, { cause: error });
        }
      }),
    ).rejects.toMatchObject({
      code: AI_ERROR_CODES.VALIDATION_ERROR,
      skipCircuitBreaker: true,
    });

    expect(breaker.getState().failureCount).toBe(0);
    expect(breaker.getState().state).toBe('CLOSED');
  });

  it('opens after five consecutive AI_UNAVAILABLE errors', async () => {
    for (let i = 0; i < 5; i += 1) {
      await expect(
        breaker.execute(async () => {
          throw createAIUnavailableError(`provider 503 attempt ${i + 1}`);
        }),
      ).rejects.toMatchObject({
        code: AI_ERROR_CODES.AI_UNAVAILABLE,
        skipCircuitBreaker: false,
      });
    }

    expect(breaker.getState().failureCount).toBe(5);
    expect(breaker.getState().state).toBe('OPEN');
  });

  it('does not increment failureCount for AI_CONFIG_ERROR', async () => {
    await expect(
      breaker.execute(async () => {
        throw createAIConfigError('Invalid GROQ_API_KEY');
      }),
    ).rejects.toMatchObject({
      code: AI_ERROR_CODES.AI_CONFIG_ERROR,
      httpStatus: 503,
      skipCircuitBreaker: true,
    });

    expect(breaker.getState().failureCount).toBe(0);
    expect(breaker.getState().state).toBe('CLOSED');
  });
});
