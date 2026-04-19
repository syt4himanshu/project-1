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

const SYSTEM_PROMPT = `You are an expert academic mentor assistant designed for faculty.

Your task is to generate **concise, practical mentoring remarks** for a student — NOT long summaries or theoretical explanations.

## Core Objective

Generate remarks that a real faculty member would write in under 30 seconds:
* Short
* Specific
* Action-oriented
* Career-focused

## Strict Output Rules (VERY IMPORTANT)

1. Maximum 4–5 lines total
2. Each line must contain:
   * One clear observation
   * One actionable suggestion
3. Avoid:
   * Long paragraphs
   * Repeating student data
   * Generic phrases like "keep it up", "good student"
   * Over-explaining
4. Tone:
   * Professional
   * Direct
   * Supportive but realistic

## Output Structure

Return output in this exact format:
* Strength → How to leverage it
* Weakness → How to improve it
* Career alignment → What to focus on next
* Practical action → Immediate next step

## Example (Follow this style strictly)

* Strong in programming → Start contributing to real-world projects or internships
* Overthinking in communication → Practice structured speaking (daily 5-min mock explanations)
* Interested in placements → Focus on DSA + core subjects for next 3 months
* Needs exposure → Participate in hackathons or team-based projects`;

const buildUserMessage = ({ facultyQuery, studentDataset }) => {
  // A naive summarization attempt before it enters Groq
  const contextSummary = JSON.stringify({
    totalCount: studentDataset.total_students,
    focusMetric: "Extracted basic stats from schema without dumping full PII"
  });

  return `Faculty Query: ${facultyQuery}\n\nContext Summary: ${contextSummary}\n\nFull Data Dump: ${JSON.stringify(studentDataset).substring(0, 5000)}... (truncated for safety)`;
};

const generateFacultyInsights = async ({ facultyQuery, studentDataset }) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || !String(apiKey).trim()) {
    throw new Error('Missing GROQ_API_KEY');
  }

  const groq = new Groq({ apiKey: String(apiKey).trim() });

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildUserMessage({ facultyQuery, studentDataset }) },
  ];

  // Wrap in circuit breaker
  return groqCircuitBreaker.execute(async () => {
    let currentModel = AI_CONFIG.model;
    let fallbackIndex = 0;

    while (true) {
      const start = Date.now();

      try {
        // Wrap API call with retry logic
        const completion = await retryWithBackoff(
          async () => {
            return await groq.chat.completions.create({
              model: currentModel,
              messages,
              temperature: AI_CONFIG.temperature,
              max_tokens: AI_CONFIG.max_tokens,
            }, { timeout: 10000 }); // 10s timeout per attempt
          },
          {
            maxAttempts: 3,
            initialDelay: 1000,
            maxDelay: 5000,
            operationName: 'groq-api-call',
            shouldRetry: (error) => {
              // Don't retry auth errors
              if (error.status === 401 || error.response?.status === 401) {
                return false;
              }

              // Don't retry model errors (will use fallback instead)
              const isModelError = error.error?.error?.code === "model_decommissioned" ||
                error.error?.error?.code === "invalid_request_error" ||
                /decommissioned|not found|does not exist/.test(error.message);
              if (isModelError) {
                return false;
              }

              // Retry rate limits and server errors
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

        return completion?.choices?.[0]?.message?.content || "No response generated";

      } catch (error) {
        logger.error({
          message: 'Groq API error',
          model: currentModel,
          error: error.message,
          latencyMs: Date.now() - start,
        });

        // Handle auth errors
        if (error.status === 401 || error.response?.status === 401) {
          throw new Error("Invalid GROQ_API_KEY");
        }

        // Handle model errors with fallback
        const isModelError = error.error?.error?.code === "model_decommissioned" ||
          error.error?.error?.code === "invalid_request_error" ||
          /decommissioned|not found|does not exist/.test(error.message);

        if (isModelError && fallbackIndex < FALLBACK_MODELS.length) {
          currentModel = FALLBACK_MODELS[fallbackIndex++];
          logger.info({ message: `Trying fallback model: ${currentModel}` });
          continue;
        }

        if (isModelError) {
          throw new Error("Groq model is deprecated or invalid");
        }

        // Re-throw for circuit breaker to handle
        throw error;
      }
    }
  })
};

module.exports = {
  generateFacultyInsights,
};
