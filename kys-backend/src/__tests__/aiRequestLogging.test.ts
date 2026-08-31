import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  __resetGroqClientFactoryForTests,
  __setGroqClientFactoryForTests,
  generateFacultyInsights,
  groqCircuitBreaker,
} from '../../services/groq.service';
import { WELL_FORMED_RESPONSE } from './fixtures/aiResponseValidator.fixtures';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const aiRequestLogger = require('../../utils/aiRequestLogger') as typeof import('../../utils/aiRequestLogger');

const REQUEST_ID = 'chatbot-req-7f3a2c11';
const TEST_API_KEY = 'gsk_test_key_must_not_appear_in_logs';

function collectAiRequestIds(entries: unknown[]): string[] {
  return entries
    .map((entry) => (entry as { ai?: { requestId?: string } })?.ai?.requestId)
    .filter((id): id is string => Boolean(id));
}

function collectAiStages(entries: unknown[]): string[] {
  return entries
    .map((entry) => (entry as { ai?: { stage?: string } })?.ai?.stage)
    .filter((stage): stage is string => Boolean(stage));
}

const {
  __setAiLogSinkForTests,
  logFacultyChatbotControllerStart,
  logFacultyChatbotControllerSuccess,
  summarizeStudentDataset,
} = aiRequestLogger;

describe('AI request logging propagation', () => {
  const logEntries: unknown[] = [];
  const mockGroqCreate = vi.fn();

  beforeEach(() => {
    groqCircuitBreaker.reset();
    process.env.GROQ_API_KEY = TEST_API_KEY;
    logEntries.length = 0;
    mockGroqCreate.mockReset();
    mockGroqCreate.mockResolvedValue({
      choices: [{ message: { content: WELL_FORMED_RESPONSE } }],
    });

    __setGroqClientFactoryForTests(() => ({
      chat: {
        completions: {
          create: mockGroqCreate,
        },
      },
    }));

    __setAiLogSinkForTests((_level, payload) => {
      logEntries.push(payload);
    });
  });

  afterEach(() => {
    __setAiLogSinkForTests(null);
    __resetGroqClientFactoryForTests();
  });

  it('uses a consistent requestId across controller and service logs', async () => {
    const studentDataset = {
      total_students: 1,
      students: [
        {
          name: 'Alice Secret Student',
          semester: 6,
          cgpa: 8.4,
          academicRecords: [{ semester: 5, sgpa: 8.2, backlogs: 'None' }],
          skills: { programming: 'Python', technologies: 'React', domains: 'Web' },
          projects: [{ title: 'Secret Capstone Project' }],
        },
      ],
    };

    logFacultyChatbotControllerStart(REQUEST_ID, {
      queryLength: 28,
      studentIdPresent: true,
      conversationHistoryTurns: 0,
      studentDataset,
    });

    await generateFacultyInsights(
      {
        facultyQuery: 'How is placement readiness?',
        studentDataset,
        mode: 'insights',
        conversationHistory: [],
      },
      REQUEST_ID,
    );

    logFacultyChatbotControllerSuccess(REQUEST_ID, {
      responseLength: WELL_FORMED_RESPONSE.length,
      circuitBreaker: groqCircuitBreaker,
    });

    const requestIds = collectAiRequestIds(logEntries);
    expect(requestIds.length).toBeGreaterThan(0);
    expect(new Set(requestIds)).toEqual(new Set([REQUEST_ID]));

    const stages = collectAiStages(logEntries);
    expect(stages).toContain('controller.start');
    expect(stages).toContain('service.start');
    expect(stages).toContain('provider.call');
    expect(stages).toContain('provider.success');
    expect(stages).toContain('validation.result');
    expect(stages).toContain('service.complete');
    expect(stages).toContain('controller.complete');
    expect(mockGroqCreate).toHaveBeenCalled();
  });

  it('never logs API keys or full student profile content', async () => {
    const studentDataset = {
      total_students: 1,
      students: [
        {
          name: 'Bob Confidential',
          semester: 4,
          cgpa: 7.9,
          careerObjective: { goal: 'FAANG placement', placement_interest: 'Product' },
        },
      ],
    };

    logFacultyChatbotControllerStart(REQUEST_ID, {
      queryLength: 12,
      studentIdPresent: true,
      conversationHistoryTurns: 0,
      studentDataset,
    });

    await generateFacultyInsights(
      {
        facultyQuery: 'Placement?',
        studentDataset,
      },
      REQUEST_ID,
    );

    const serialized = JSON.stringify(logEntries);

    expect(serialized).not.toContain(TEST_API_KEY);
    expect(serialized).not.toContain('gsk_');
    expect(serialized).not.toContain('Bob Confidential');
    expect(serialized).not.toContain('FAANG placement');
    expect(serialized).not.toContain('Secret Capstone Project');

    const summary = summarizeStudentDataset(studentDataset);
    expect(summary.hasName).toBe(true);
    expect(summary.nameLength).toBe('Bob Confidential'.length);
    expect(summary).not.toHaveProperty('name');
  });

  it('records structured provider and validation metadata without raw model text', async () => {
    await generateFacultyInsights(
      {
        facultyQuery: 'Summarize strengths',
        studentDataset: { total_students: 0, students: [] },
      },
      REQUEST_ID,
    );

    const providerSuccess = logEntries.find(
      (entry) => (entry as { ai?: { stage?: string } }).ai?.stage === 'provider.success',
    ) as {
      ai?: {
        model?: string;
        providerLatencyMs?: number;
        attemptNumber?: number;
        circuitBreakerState?: string;
      };
    };

    expect(providerSuccess?.ai?.model).toBeTruthy();
    expect(typeof providerSuccess?.ai?.providerLatencyMs).toBe('number');
    expect(providerSuccess?.ai?.attemptNumber).toBeGreaterThan(0);
    expect(providerSuccess?.ai?.circuitBreakerState).toBe('CLOSED');

    const validationLog = logEntries.find(
      (entry) => (entry as { ai?: { stage?: string } }).ai?.stage === 'validation.result',
    ) as { ok?: boolean; rawResponseLength?: number };

    expect(validationLog?.ok).toBe(true);
    expect(validationLog?.rawResponseLength).toBeGreaterThan(0);
    expect(JSON.stringify(logEntries)).not.toContain(WELL_FORMED_RESPONSE);
  });
});
