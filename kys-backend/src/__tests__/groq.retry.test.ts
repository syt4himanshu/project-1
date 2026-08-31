import { beforeEach, describe, expect, it } from 'vitest';
import { retryWithBackoff, isRetryableError } from '../../utils/retry';
import {
  AI_ERROR_CODES,
  createAIUnavailableError,
} from '../../utils/aiErrors';
import {
  assertGroqCircuitAllowsCall,
  createGroqCallBudget,
  groqCircuitBreaker,
  MAX_GROQ_CALLS_PER_REQUEST,
} from '../../services/groq.service';

function expectErrorCode(error: unknown, code: string) {
  expect(error).toBeTruthy();
  expect((error as { code?: string }).code).toBe(code);
}

describe('Groq retry budget helpers', () => {
  beforeEach(() => {
    groqCircuitBreaker.reset();
  });

  it('enforces MAX_GROQ_CALLS_PER_REQUEST on the call budget', async () => {
    const budget = createGroqCallBudget(MAX_GROQ_CALLS_PER_REQUEST);
    let calls = 0;

    const failingCall = async () => {
      calls += 1;
      throw Object.assign(new Error('Service Unavailable'), { status: 503 });
    };

    for (let i = 0; i < MAX_GROQ_CALLS_PER_REQUEST; i += 1) {
      await expect(budget.run(failingCall)).rejects.toMatchObject({ status: 503 });
    }

    try {
      await budget.run(failingCall);
      expect.fail('expected budget exhaustion');
    } catch (error) {
      expectErrorCode(error, AI_ERROR_CODES.VALIDATION_ERROR);
    }

    expect(calls).toBe(MAX_GROQ_CALLS_PER_REQUEST);
  });

  it('short-circuits before provider calls when the circuit breaker is OPEN', async () => {
    for (let i = 0; i < 5; i += 1) {
      await groqCircuitBreaker
        .execute(async () => {
          throw createAIUnavailableError(`provider down ${i}`);
        })
        .catch(() => undefined);
    }

    expect(groqCircuitBreaker.getState().state).toBe('OPEN');

    try {
      assertGroqCircuitAllowsCall();
      expect.fail('expected circuit breaker rejection');
    } catch (error) {
      expectErrorCode(error, AI_ERROR_CODES.AI_UNAVAILABLE);
      expect((error as { circuitBreakerOpen?: boolean }).circuitBreakerOpen).toBe(true);
    }
  });

  it('allows at most three provider calls when main retry uses taxonomy gating', async () => {
    const budget = createGroqCallBudget(MAX_GROQ_CALLS_PER_REQUEST);
    let providerCalls = 0;

    const invokeWithRetry = () =>
      retryWithBackoff(
        () =>
          budget.run(async () => {
            providerCalls += 1;
            throw Object.assign(new Error('Service Unavailable'), { status: 503 });
          }),
        {
          maxAttempts: 2,
          initialDelay: 1,
          maxDelay: 1,
          shouldRetry: isRetryableError,
          operationName: 'groq-api-call-test',
        },
      );

    await expect(invokeWithRetry()).rejects.toMatchObject({ status: 503 });

    try {
      await invokeWithRetry();
      expect.fail('expected budget exhaustion');
    } catch (error) {
      expectErrorCode(error, AI_ERROR_CODES.VALIDATION_ERROR);
    }

    expect(providerCalls).toBe(MAX_GROQ_CALLS_PER_REQUEST);
  });
});
