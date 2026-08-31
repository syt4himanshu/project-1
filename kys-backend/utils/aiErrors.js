/**
 * AI error taxonomy for Mentor AI / Groq integration.
 *
 * Codes:
 * - AI_UNAVAILABLE   — transient upstream failure (5xx, network reset/DNS)
 * - AI_RATE_LIMITED  — provider rate limit (429)
 * - AI_TIMEOUT       — provider or client timeout
 * - AI_CONFIG_ERROR  — missing/invalid API key or model (permanent config)
 * - VALIDATION_ERROR — application/payload/response handling (non-provider)
 *
 * Circuit breaker policy (see circuitBreaker.js):
 * - COUNT toward breaker: AI_UNAVAILABLE, AI_RATE_LIMITED, AI_TIMEOUT
 * - SKIP breaker:         AI_CONFIG_ERROR, VALIDATION_ERROR, and any unclassified error
 *                         wrapped as VALIDATION_ERROR by groq.service.js
 *
 * Each error carries: code, httpStatus, retryable, skipCircuitBreaker
 */

const AI_ERROR_CODES = {
  AI_UNAVAILABLE: 'AI_UNAVAILABLE',
  AI_RATE_LIMITED: 'AI_RATE_LIMITED',
  AI_CONFIG_ERROR: 'AI_CONFIG_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AI_TIMEOUT: 'AI_TIMEOUT',
};

const ERROR_SPECS = {
  [AI_ERROR_CODES.AI_UNAVAILABLE]: {
    httpStatus: 503,
    retryable: true,
    skipCircuitBreaker: false,
  },
  [AI_ERROR_CODES.AI_RATE_LIMITED]: {
    httpStatus: 429,
    retryable: true,
    skipCircuitBreaker: false,
  },
  [AI_ERROR_CODES.AI_TIMEOUT]: {
    httpStatus: 504,
    retryable: true,
    skipCircuitBreaker: false,
  },
  [AI_ERROR_CODES.AI_CONFIG_ERROR]: {
    httpStatus: 503,
    retryable: false,
    skipCircuitBreaker: true,
  },
  [AI_ERROR_CODES.VALIDATION_ERROR]: {
    httpStatus: 422,
    retryable: false,
    skipCircuitBreaker: true,
  },
};

class AIError extends Error {
  constructor(code, message, options = {}) {
    super(message);
    this.name = 'AIError';
    this.code = code;

    const spec = ERROR_SPECS[code] || ERROR_SPECS[AI_ERROR_CODES.VALIDATION_ERROR];
    this.httpStatus = options.httpStatus ?? spec.httpStatus;
    this.retryable = options.retryable ?? spec.retryable;
    this.skipCircuitBreaker = options.skipCircuitBreaker ?? spec.skipCircuitBreaker;

    if (options.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}

const createAIError = (code, message, options = {}) => new AIError(code, message, options);

const createAIUnavailableError = (message, options = {}) =>
  createAIError(AI_ERROR_CODES.AI_UNAVAILABLE, message, options);

const createAIRateLimitedError = (message, options = {}) =>
  createAIError(AI_ERROR_CODES.AI_RATE_LIMITED, message, options);

const createAITimeoutError = (message, options = {}) =>
  createAIError(AI_ERROR_CODES.AI_TIMEOUT, message, options);

const createAIConfigError = (message, options = {}) =>
  createAIError(AI_ERROR_CODES.AI_CONFIG_ERROR, message, options);

const createValidationError = (message, options = {}) =>
  createAIError(AI_ERROR_CODES.VALIDATION_ERROR, message, options);

const isAIError = (error) => error instanceof AIError;

const isGroqModelError = (error) => {
  const providerCode = error?.error?.error?.code;
  const status = error?.status || error?.response?.status;

  return (
    providerCode === 'model_decommissioned' ||
    providerCode === 'model_not_found' ||
    providerCode === 'invalid_request_error' ||
    status === 404 ||
    /decommissioned|not found|does not exist|model_not_found/i.test(error?.message || '')
  );
};

const classifyGroqError = (error) => {
  if (isAIError(error)) {
    return error;
  }

  const status = error?.status || error?.response?.status;

  if (status === 429) {
    return createAIRateLimitedError(
      error?.message || 'AI provider rate limit exceeded',
      { cause: error },
    );
  }

  if (
    error?.code === 'ETIMEDOUT' ||
    status === 408 ||
    (typeof error?.message === 'string' && /timeout/i.test(error.message))
  ) {
    return createAITimeoutError(
      error?.message || 'AI provider request timed out',
      { cause: error },
    );
  }

  if (status === 404 || isGroqModelError(error)) {
    return createAIConfigError(
      error?.message || 'Configured Groq model is unavailable',
      { cause: error },
    );
  }

  if (status === 500 || status === 502 || status === 503 || status === 504) {
    return createAIUnavailableError(
      error?.message || 'AI provider temporarily unavailable',
      { cause: error },
    );
  }

  if (error?.code === 'ECONNRESET' || error?.code === 'ENOTFOUND') {
    return createAIUnavailableError(
      error?.message || 'AI provider network error',
      { cause: error },
    );
  }

  return createValidationError(
    error?.message || 'Unexpected AI provider error',
    { cause: error },
  );
};

module.exports = {
  AI_ERROR_CODES,
  AIError,
  createAIUnavailableError,
  createAIRateLimitedError,
  createAITimeoutError,
  createAIConfigError,
  createValidationError,
  isAIError,
  isGroqModelError,
  classifyGroqError,
};
