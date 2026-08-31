const logger = require('./logger');
const { isAIError } = require('./aiErrors');

/**
 * Summarize student dataset for logs — presence/counts/lengths only, never content.
 */
const summarizeStudentDataset = (dataset) => {
  const students = Array.isArray(dataset?.students) ? dataset.students : [];
  const first = students[0] || null;

  return {
    studentCount: students.length,
    totalStudents: dataset?.total_students ?? students.length,
    hasName: Boolean(first?.name || first?.full_name),
    nameLength: String(first?.name || first?.full_name || '').length,
    hasAcademics: Boolean(first?.academicRecords?.length || first?.academics?.length),
    academicRecordCount:
      first?.academicRecords?.length ?? first?.academics?.length ?? 0,
    hasSkills: Boolean(first?.skills),
    projectCount: first?.projects?.length ?? 0,
    internshipCount: first?.internships?.length ?? 0,
    recentMinutesCount:
      first?.recentMinutes?.length ?? first?.recent_mentoring_minutes?.length ?? 0,
  };
};

const resolveAiErrorCode = (error) => {
  if (isAIError(error)) return error.code;
  if (error?.circuitBreakerOpen) return 'AI_UNAVAILABLE';
  if (typeof error?.code === 'string' && error.code.startsWith('AI_')) {
    return error.code;
  }
  return null;
};

const getCircuitBreakerState = (circuitBreaker) =>
  circuitBreaker?.getState?.()?.state ?? null;

/**
 * Build structured AI log fields with a consistent `ai` namespace.
 */
const buildAiLogFields = ({
  requestId,
  stage,
  circuitBreaker,
  model = null,
  providerLatencyMs = null,
  attemptNumber = null,
  errorCode = null,
  extra = {},
}) => ({
  ai: {
    requestId: requestId || null,
    stage,
    model,
    providerLatencyMs,
    attemptNumber,
    errorCode,
    circuitBreakerState: getCircuitBreakerState(circuitBreaker),
  },
  ...extra,
});

let aiLogTestSink = null;

const writeAiLog = (level, fields) => {
  const stage = fields.ai?.stage || "telemetry";
  const payload = {
    message: `ai.${stage}`,
    ...fields,
  };

  if (aiLogTestSink) {
    aiLogTestSink(level, payload);
  }

  logger[level](payload);
};

/**
 * Per-request AI logger for service-layer stages.
 */
const createAiRequestContext = (requestId, circuitBreaker) => ({
  requestId,
  circuitBreaker,

  log(level, stage, {
    model = null,
    providerLatencyMs = null,
    attemptNumber = null,
    errorCode = null,
    extra = {},
  } = {}) {
    writeAiLog(
      level,
      buildAiLogFields({
        requestId,
        stage,
        circuitBreaker,
        model,
        providerLatencyMs,
        attemptNumber,
        errorCode,
        extra,
      }),
    );
  },
});

const logFacultyChatbotControllerStart = (requestId, {
  queryLength,
  studentIdPresent,
  conversationHistoryTurns,
  studentDataset,
}) => {
  writeAiLog(
    'info',
    buildAiLogFields({
      requestId,
      stage: 'controller.start',
      circuitBreaker: null,
      extra: {
        queryLength,
        studentIdPresent,
        conversationHistoryTurns,
        studentDataset: summarizeStudentDataset(studentDataset),
      },
    }),
  );
};

const logFacultyChatbotControllerSuccess = (requestId, {
  responseLength,
  circuitBreaker,
}) => {
  writeAiLog(
    'info',
    buildAiLogFields({
      requestId,
      stage: 'controller.complete',
      circuitBreaker,
      extra: { responseLength },
    }),
  );
};

const logFacultyChatbotControllerError = (requestId, error, circuitBreaker) => {
  writeAiLog(
    'error',
    buildAiLogFields({
      requestId,
      stage: 'controller.error',
      circuitBreaker,
      errorCode: resolveAiErrorCode(error),
      extra: {
        errorMessage: error?.message || 'Unknown error',
      },
    }),
  );
};

module.exports = {
  summarizeStudentDataset,
  resolveAiErrorCode,
  buildAiLogFields,
  createAiRequestContext,
  logFacultyChatbotControllerStart,
  logFacultyChatbotControllerSuccess,
  logFacultyChatbotControllerError,
  __setAiLogSinkForTests: (sink) => {
    aiLogTestSink = sink;
  },
};
