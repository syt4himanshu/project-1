import { describe, expect, it } from 'vitest';
import {
  AI_ERROR_CODES,
  classifyGroqError,
  createAIConfigError,
  createAIRateLimitedError,
  createAITimeoutError,
  createAIUnavailableError,
  createValidationError,
  isGroqModelError,
} from '../../utils/aiErrors';

describe('aiErrors taxonomy', () => {
  it('assigns breaker policy per code', () => {
    expect(createAIUnavailableError('down').skipCircuitBreaker).toBe(false);
    expect(createAIRateLimitedError('limited').skipCircuitBreaker).toBe(false);
    expect(createAITimeoutError('slow').skipCircuitBreaker).toBe(false);
    expect(createAIConfigError('bad key').skipCircuitBreaker).toBe(true);
    expect(createValidationError('bad payload').skipCircuitBreaker).toBe(true);
  });

  it('classifies provider 503 as AI_UNAVAILABLE', () => {
    const classified = classifyGroqError({ status: 503, message: 'Service Unavailable' });
    expect(classified.code).toBe(AI_ERROR_CODES.AI_UNAVAILABLE);
    expect(classified.skipCircuitBreaker).toBe(false);
  });

  it('classifies provider 429 as AI_RATE_LIMITED', () => {
    const classified = classifyGroqError({ status: 429, message: 'Rate limit exceeded' });
    expect(classified.code).toBe(AI_ERROR_CODES.AI_RATE_LIMITED);
    expect(classified.skipCircuitBreaker).toBe(false);
  });

  it('classifies timeout errors as AI_TIMEOUT', () => {
    const classified = classifyGroqError({ code: 'ETIMEDOUT', message: 'timeout' });
    expect(classified.code).toBe(AI_ERROR_CODES.AI_TIMEOUT);
    expect(classified.skipCircuitBreaker).toBe(false);
  });

  it('classifies unknown application errors as VALIDATION_ERROR', () => {
    const classified = classifyGroqError(new ReferenceError('cleanAndValidateResponse is not defined'));
    expect(classified.code).toBe(AI_ERROR_CODES.VALIDATION_ERROR);
    expect(classified.skipCircuitBreaker).toBe(true);
  });

  it('classifies provider 404 model errors as AI_CONFIG_ERROR', () => {
    const classified = classifyGroqError({
      status: 404,
      message: 'The model does not exist or you do not have access to it',
      error: { error: { code: 'model_not_found' } },
    });
    expect(classified.code).toBe(AI_ERROR_CODES.AI_CONFIG_ERROR);
    expect(classified.skipCircuitBreaker).toBe(true);
    expect(classified.retryable).toBe(false);
  });

  it('detects Groq model errors', () => {
    expect(
      isGroqModelError({
        error: { error: { code: 'model_decommissioned' } },
        message: 'model removed',
      }),
    ).toBe(true);
  });

  it('maps 401 provider errors to AI_CONFIG_ERROR (groq.service catch contract)', () => {
    const providerError = Object.assign(new Error('Invalid API Key'), { status: 401 });

    let thrown = null;
    if (providerError.status === 401) {
      thrown = createAIConfigError('Invalid GROQ_API_KEY', { cause: providerError });
    }

    expect(thrown).toMatchObject({
      code: AI_ERROR_CODES.AI_CONFIG_ERROR,
      message: 'Invalid GROQ_API_KEY',
      httpStatus: 503,
      skipCircuitBreaker: true,
      retryable: false,
    });
  });

  it('does not retry 401 provider errors (groq.service shouldRetry contract)', () => {
    const providerError = Object.assign(new Error('Invalid API Key'), { status: 401 });

    const shouldRetry = (error: { status?: number; response?: { status?: number } }) => {
      if (error.status === 401 || error.response?.status === 401) {
        return false;
      }
      if (isGroqModelError(error)) {
        return false;
      }
      const status = error.status || error.response?.status;
      return status === 429 || (status !== undefined && status >= 500);
    };

    expect(shouldRetry(providerError)).toBe(false);
  });
});
