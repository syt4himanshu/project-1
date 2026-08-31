import { describe, expect, it, vi } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  retryWithBackoff,
  isRetryableError,
  extractRetryDelayMs,
} = require('../../utils/retry');
const {
  AI_ERROR_CODES,
  createAIConfigError,
  createAIRateLimitedError,
  createAITimeoutError,
  createAIUnavailableError,
  createValidationError,
} = require('../../utils/aiErrors');

describe('retry.js — audit scenario coverage', () => {
  it('returns immediately on successful first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('ok');

    await expect(
      retryWithBackoff(fn, { maxAttempts: 3, operationName: 'success-path' }),
    ).resolves.toBe('ok');

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('retries AI_UNAVAILABLE up to maxAttempts then exhausts', async () => {
    const fn = vi
      .fn()
      .mockRejectedValue(createAIUnavailableError('provider 503'));

    await expect(
      retryWithBackoff(fn, {
        maxAttempts: 2,
        initialDelay: 1,
        maxDelay: 1,
        operationName: 'unavailable-exhaustion',
      }),
    ).rejects.toMatchObject({ code: AI_ERROR_CODES.AI_UNAVAILABLE });

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('retries provider timeout errors', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(createAITimeoutError('provider timeout'))
      .mockResolvedValue('recovered');

    await expect(
      retryWithBackoff(fn, {
        maxAttempts: 2,
        initialDelay: 1,
        maxDelay: 1,
        operationName: 'timeout-retry',
      }),
    ).resolves.toBe('recovered');

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('retries provider 429 / AI_RATE_LIMITED errors', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(createAIRateLimitedError('rate limited'))
      .mockResolvedValue('ok');

    await expect(
      retryWithBackoff(fn, {
        maxAttempts: 2,
        initialDelay: 1,
        maxDelay: 1,
        operationName: 'rate-limit-retry',
      }),
    ).resolves.toBe('ok');

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('does not retry AI_CONFIG_ERROR (401-class permanent failures)', async () => {
    const fn = vi.fn().mockRejectedValue(createAIConfigError('Invalid GROQ_API_KEY'));

    await expect(
      retryWithBackoff(fn, { maxAttempts: 3, operationName: 'config-no-retry' }),
    ).rejects.toMatchObject({ code: AI_ERROR_CODES.AI_CONFIG_ERROR });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('does not retry VALIDATION_ERROR application failures', async () => {
    const fn = vi.fn().mockRejectedValue(createValidationError('malformed output'));

    await expect(
      retryWithBackoff(fn, { maxAttempts: 3, operationName: 'validation-no-retry' }),
    ).rejects.toMatchObject({ code: AI_ERROR_CODES.VALIDATION_ERROR });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('classifies raw 500/503 status objects as retryable via taxonomy', () => {
    expect(isRetryableError({ status: 500, message: 'Internal Server Error' })).toBe(true);
    expect(isRetryableError({ status: 503, message: 'Service Unavailable' })).toBe(true);
    expect(isRetryableError({ status: 401, message: 'Unauthorized' })).toBe(false);
    expect(isRetryableError({ status: 400, message: 'Bad Request' })).toBe(false);
  });

  it('treats network failures (ECONNRESET / ENOTFOUND) as retryable when classified', () => {
    expect(
      isRetryableError({ code: 'ECONNRESET', message: 'socket hang up' }),
    ).toBe(true);
    expect(
      isRetryableError({ code: 'ENOTFOUND', message: 'getaddrinfo ENOTFOUND api.groq.com' }),
    ).toBe(true);
  });

  it('extracts Retry-After header delays in seconds', () => {
    const delay = extractRetryDelayMs({
      headers: { 'retry-after': '2' },
      message: 'rate limited',
    });

    expect(delay).toBe(2000);
  });

  it('extracts retry delay hints from provider error messages', () => {
    const delay = extractRetryDelayMs({
      message: 'Please try again in 1.5 s',
    });

    expect(delay).toBe(1500);
  });
});
