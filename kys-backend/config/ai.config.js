/**
 * Authoritative AI provider configuration for faculty mentoring endpoints.
 *
 * Production must set GROQ_MODEL to a currently supported Groq model.
 * llama-3.3-70b-versatile was deprecated 2026-08-16; use openai/gpt-oss-120b.
 * See: https://console.groq.com/docs/deprecations
 */
const AI_CONFIG = {
  provider: "groq",
  model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  temperature: 0.7,
  max_tokens: 2048,
  /** Per Groq HTTP call (ms). */
  requestTimeoutMs: 10_000,
  /** Max retryWithBackoff attempts per completion/regeneration call (retryable errors only). */
  maxProviderRetries: 2,
  /** Max format-regeneration rounds after a successful provider response fails validation. */
  maxRegenerationAttempts: 1,
  /**
   * Hard cap on Groq HTTP calls per user-initiated faculty chatbot request.
   * Budget: primary + optional fallback + optional regeneration.
   */
  maxCallsPerRequest: 3,
};

/** Non-reasoning models first; reasoning models last. */
const FALLBACK_MODELS = [
  "openai/gpt-oss-20b",
  "qwen/qwen3.6-27b",
];

const DEPRECATED_MODELS = new Set([
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
]);

const resolvePrimaryModel = () => {
  const configured = AI_CONFIG.model;
  if (DEPRECATED_MODELS.has(configured)) {
    return "openai/gpt-oss-120b";
  }
  return configured;
};

module.exports = {
  AI_CONFIG,
  FALLBACK_MODELS,
  DEPRECATED_MODELS,
  resolvePrimaryModel,
};
