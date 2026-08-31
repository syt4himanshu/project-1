import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AI_ERROR_CODES } = require('../../utils/aiErrors');
const { WELL_FORMED_RESPONSE } = require('./fixtures/aiResponseValidator.fixtures');
const {
  largeStudentDataset,
  minimalStudentDataset,
  missingStudentDataset,
  providerEmpty,
  providerErrors,
  providerMalformed,
  providerSuccess,
  providerTruncated,
} = require('./fixtures/groqProvider.fixtures');

const groqService = require('../../services/groq.service');
const aiRequestLogger = require('../../utils/aiRequestLogger');

const REQUEST_ID = 'groq-service-test-req';
const TEST_API_KEY = 'gsk_fixture_key_not_real';

function installMockGroq(createImpl) {
  const mockCreate = vi.fn(createImpl);
  groqService.__setGroqClientFactoryForTests(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  }));
  return mockCreate;
}

function basePayload() {
  return {
    facultyQuery: 'How is placement readiness?',
    studentDataset: minimalStudentDataset(),
    mode: 'insights',
    conversationHistory: [],
  };
}

describe('groq.service generateFacultyInsights — audit scenario coverage', () => {
  beforeEach(() => {
    groqService.groqCircuitBreaker.reset();
    process.env.GROQ_API_KEY = TEST_API_KEY;
    aiRequestLogger.__setAiLogSinkForTests(null);
  });

  afterEach(() => {
    groqService.__resetGroqClientFactoryForTests();
    aiRequestLogger.__setAiLogSinkForTests(null);
  });

  it('returns validated text on a successful provider response', async () => {
    installMockGroq(providerSuccess);

    const result = await groqService.generateFacultyInsights(basePayload(), REQUEST_ID);

    expect(result).toBe(WELL_FORMED_RESPONSE);
  });

  it('throws AI_CONFIG_ERROR when GROQ_API_KEY is missing', async () => {
    delete process.env.GROQ_API_KEY;

    await expect(
      groqService.generateFacultyInsights(basePayload(), REQUEST_ID),
    ).rejects.toMatchObject({
      code: AI_ERROR_CODES.AI_CONFIG_ERROR,
      message: 'Missing GROQ_API_KEY',
    });
  });

  it('maps provider 401 to AI_CONFIG_ERROR without retrying the HTTP client path', async () => {
    const mockCreate = installMockGroq(() => Promise.reject(providerErrors.unauthorized()));

    await expect(
      groqService.generateFacultyInsights(basePayload(), REQUEST_ID),
    ).rejects.toMatchObject({
      code: AI_ERROR_CODES.AI_CONFIG_ERROR,
      message: 'Invalid GROQ_API_KEY',
    });

    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('maps provider 429 to AI_RATE_LIMITED', async () => {
    installMockGroq(() => Promise.reject(providerErrors.rateLimited()));

    await expect(
      groqService.generateFacultyInsights(basePayload(), REQUEST_ID),
    ).rejects.toMatchObject({ code: AI_ERROR_CODES.AI_RATE_LIMITED });
  });

  it('maps provider 500 to AI_UNAVAILABLE', async () => {
    installMockGroq(() => Promise.reject(providerErrors.internal()));

    await expect(
      groqService.generateFacultyInsights(basePayload(), REQUEST_ID),
    ).rejects.toMatchObject({ code: AI_ERROR_CODES.AI_UNAVAILABLE });
  });

  it('maps provider 503 to AI_UNAVAILABLE', async () => {
    installMockGroq(() => Promise.reject(providerErrors.unavailable()));

    await expect(
      groqService.generateFacultyInsights(basePayload(), REQUEST_ID),
    ).rejects.toMatchObject({ code: AI_ERROR_CODES.AI_UNAVAILABLE });
  });

  it('maps provider timeout to AI_TIMEOUT', async () => {
    installMockGroq(() => Promise.reject(providerErrors.timeout()));

    await expect(
      groqService.generateFacultyInsights(basePayload(), REQUEST_ID),
    ).rejects.toMatchObject({ code: AI_ERROR_CODES.AI_TIMEOUT });
  });

  it('maps network failures to AI_UNAVAILABLE', async () => {
    installMockGroq(() => Promise.reject(providerErrors.networkDns()));

    await expect(
      groqService.generateFacultyInsights(basePayload(), REQUEST_ID),
    ).rejects.toMatchObject({ code: AI_ERROR_CODES.AI_UNAVAILABLE });
  });

  it('regenerates once after an empty provider response and succeeds', async () => {
    const mockCreate = installMockGroq()
      .mockImplementationOnce(providerEmpty)
      .mockImplementationOnce(providerSuccess);

    const result = await groqService.generateFacultyInsights(basePayload(), REQUEST_ID);

    expect(result).toBe(WELL_FORMED_RESPONSE);
    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  it('throws VALIDATION_ERROR when malformed output persists after regeneration', async () => {
    const mockCreate = installMockGroq()
      .mockImplementationOnce(providerMalformed)
      .mockImplementationOnce(providerMalformed);

    await expect(
      groqService.generateFacultyInsights(basePayload(), REQUEST_ID),
    ).rejects.toMatchObject({ code: AI_ERROR_CODES.VALIDATION_ERROR });

    expect(mockCreate).toHaveBeenCalledTimes(2);
  });

  it('throws VALIDATION_ERROR when truncated output persists after regeneration', async () => {
    installMockGroq()
      .mockImplementationOnce(providerTruncated)
      .mockImplementationOnce(providerTruncated);

    await expect(
      groqService.generateFacultyInsights(basePayload(), REQUEST_ID),
    ).rejects.toMatchObject({ code: AI_ERROR_CODES.VALIDATION_ERROR });
  });

  it('short-circuits when the shared circuit breaker is OPEN', async () => {
    groqService.groqCircuitBreaker.state = 'OPEN';
    groqService.groqCircuitBreaker.failureCount = 5;
    groqService.groqCircuitBreaker.nextAttempt = Date.now() + 60_000;

    const mockCreate = installMockGroq(providerSuccess);

    await expect(
      groqService.generateFacultyInsights(basePayload(), REQUEST_ID),
    ).rejects.toMatchObject({
      code: AI_ERROR_CODES.AI_UNAVAILABLE,
      circuitBreakerOpen: true,
    });

    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('handles missing student data without throwing during service orchestration', async () => {
    installMockGroq(providerSuccess);

    const result = await groqService.generateFacultyInsights(
      {
        ...basePayload(),
        studentDataset: missingStudentDataset(),
      },
      REQUEST_ID,
    );

    expect(result).toBe(WELL_FORMED_RESPONSE);
  });

  it('handles large student datasets without logging raw profile content', async () => {
    const logEntries = [];
    aiRequestLogger.__setAiLogSinkForTests((_level, payload) => {
      logEntries.push(payload);
    });

    installMockGroq(providerSuccess);

    const result = await groqService.generateFacultyInsights(
      {
        ...basePayload(),
        studentDataset: largeStudentDataset(),
      },
      REQUEST_ID,
    );

    expect(result).toBe(WELL_FORMED_RESPONSE);

    const serialized = JSON.stringify(logEntries);
    expect(serialized).not.toContain('Large Profile Student');
    expect(serialized).not.toContain('Project 1');
    expect(serialized).toContain('"projectCount":20');
  });

  it('shares circuit breaker state across concurrent chatbot-style calls', async () => {
    installMockGroq(() => Promise.reject(providerErrors.unavailable()));

    const run = () =>
      groqService
        .generateFacultyInsights(basePayload(), REQUEST_ID)
        .catch((error) => error);

    const results = await Promise.all([run(), run(), run(), run(), run(), run()]);

    expect(groqService.groqCircuitBreaker.getState().state).toBe('OPEN');

    const unavailableErrors = results.filter(
      (error) => error?.code === AI_ERROR_CODES.AI_UNAVAILABLE,
    );
    expect(unavailableErrors.length).toBe(6);
  });

  it('uses a fallback model after a model_not_found provider error without retrying 404', async () => {
    const mockCreate = installMockGroq()
      .mockRejectedValueOnce(providerErrors.modelNotFound())
      .mockImplementationOnce(providerSuccess);

    const result = await groqService.generateFacultyInsights(basePayload(), REQUEST_ID);

    expect(result).toBe(WELL_FORMED_RESPONSE);
    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(mockCreate.mock.calls[1][0].model).not.toBe(mockCreate.mock.calls[0][0].model);
  });

  it('uses a fallback model after a decommissioned-model provider error', async () => {
    const mockCreate = installMockGroq()
      .mockRejectedValueOnce(providerErrors.modelDecommissioned())
      .mockImplementationOnce(providerSuccess);

    const result = await groqService.generateFacultyInsights(basePayload(), REQUEST_ID);

    expect(result).toBe(WELL_FORMED_RESPONSE);
    expect(mockCreate).toHaveBeenCalledTimes(2);
    expect(mockCreate.mock.calls[1][0].model).not.toBe(mockCreate.mock.calls[0][0].model);
  });

  it('maps provider 400 errors to VALIDATION_ERROR via taxonomy', async () => {
    installMockGroq(() => Promise.reject(providerErrors.badRequest()));

    await expect(
      groqService.generateFacultyInsights(basePayload(), REQUEST_ID),
    ).rejects.toMatchObject({ code: AI_ERROR_CODES.VALIDATION_ERROR });
  });
});
