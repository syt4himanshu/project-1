const AI_CONFIG = {
  provider: "groq",
  // llama-3.3-70b-versatile was deprecated by Groq on 2026-08-16.
  // Official replacement: openai/gpt-oss-120b
  // See: https://console.groq.com/docs/deprecations
  model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
  temperature: 0.7,
  max_tokens: 2048,
};

const FALLBACK_MODELS = [
  // qwen/qwen3.6-27b: second recommended replacement for llama-3.3-70b-versatile
  "qwen/qwen3.6-27b",
  // openai/gpt-oss-20b: replacement for llama-3.1-8b-instant (lighter fallback)
  "openai/gpt-oss-20b",
];

module.exports = {
  AI_CONFIG,
  FALLBACK_MODELS
};
