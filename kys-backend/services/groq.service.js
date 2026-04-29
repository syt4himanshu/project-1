const Groq = require('groq-sdk');
const { AI_CONFIG, FALLBACK_MODELS } = require('../config/ai.config');
const { retryWithBackoff } = require('../utils/retry');
const CircuitBreaker = require('../utils/circuitBreaker');
const logger = require('../utils/logger');

// Circuit breaker for Groq API
const groqCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 30000, // 30s
  name: 'groq-api',
});

const INSIGHTS_SYSTEM_PROMPT = `You are an expert academic mentor assistant for faculty.

Return output in 4 explicit sections with exactly these headings:
Summary:
Key Observations:
Concerns:
Suggestions:

Rules:
1. Under each heading, provide 2-4 concise bullet points.
2. Use concrete, student-specific points from context.
3. Keep tone professional, direct, and actionable.
4. Do not leave sections empty. If data is limited, provide practical inferred guidance.
5. Avoid generic filler text.`;

const REMARKS_SYSTEM_PROMPT = `You are an expert academic mentor assistant designed for faculty.

Generate concise, practical mentoring remarks for a student:
1. Maximum 4-5 lines total.
2. Each line should contain one observation and one action.
3. Tone should be professional, direct, and supportive.
4. Avoid generic filler and long paragraphs.`;

const buildUserMessage = ({ facultyQuery, studentDataset }) => {
  const contextSummary = JSON.stringify({
    totalCount: studentDataset.total_students,
    focusMetric: 'Extracted basic stats from schema without dumping full PII',
  });

  return `Faculty Query: ${facultyQuery}\n\nContext Summary: ${contextSummary}\n\nFull Data Dump: ${JSON.stringify(studentDataset).substring(0, 5000)}... (truncated for safety)`;
};

const buildNonBreakerError = (message) => {
  const error = new Error(message);
  error.skipCircuitBreaker = true;
  return error;
};

const generateFacultyInsights = async ({ facultyQuery, studentDataset, mode = 'insights' }) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || !String(apiKey).trim()) {
    throw new Error('Missing GROQ_API_KEY');
  }

  const groq = new Groq({ apiKey: String(apiKey).trim() });

  const messages = [
    { role: 'system', content: mode === 'remarks' ? REMARKS_SYSTEM_PROMPT : INSIGHTS_SYSTEM_PROMPT },
    { role: 'user', content: buildUserMessage({ facultyQuery, studentDataset }) },
  ];

  return groqCircuitBreaker.execute(async () => {
    let currentModel = AI_CONFIG.model;
    let fallbackIndex = 0;

    while (true) {
      const start = Date.now();

      try {
        const completion = await retryWithBackoff(
          async () => {
            return await groq.chat.completions.create({
              model: currentModel,
              messages,
              temperature: AI_CONFIG.temperature,
              max_tokens: AI_CONFIG.max_tokens,
            }, { timeout: 10000 });
          },
          {
            maxAttempts: 3,
            initialDelay: 1000,
            maxDelay: 5000,
            operationName: 'groq-api-call',
            shouldRetry: (error) => {
              if (error.status === 401 || error.response?.status === 401) {
                return false;
              }

              const isModelError = error.error?.error?.code === 'model_decommissioned' ||
                error.error?.error?.code === 'invalid_request_error' ||
                /decommissioned|not found|does not exist/.test(error.message);
              if (isModelError) {
                return false;
              }

              const status = error.status || error.response?.status;
              return status === 429 || status >= 500;
            },
          }
        );

        const latency = Date.now() - start;
        logger.info({
          message: 'Groq API success',
          model: currentModel,
          latencyMs: latency,
        });

        return completion?.choices?.[0]?.message?.content || 'No response generated';

      } catch (error) {
        logger.error({
          message: 'Groq API error',
          model: currentModel,
          error: error.message,
          latencyMs: Date.now() - start,
        });

        if (error.status === 401 || error.response?.status === 401) {
          throw buildNonBreakerError('Invalid GROQ_API_KEY');
        }

        const isModelError = error.error?.error?.code === 'model_decommissioned' ||
          error.error?.error?.code === 'invalid_request_error' ||
          /decommissioned|not found|does not exist/.test(error.message);

        if (isModelError && fallbackIndex < FALLBACK_MODELS.length) {
          currentModel = FALLBACK_MODELS[fallbackIndex++];
          logger.info({ message: `Trying fallback model: ${currentModel}` });
          continue;
        }

        if (isModelError) {
          throw buildNonBreakerError('Groq model is deprecated or invalid');
        }

        throw error;
      }
    }
  });
};

module.exports = {
  generateFacultyInsights,
};
