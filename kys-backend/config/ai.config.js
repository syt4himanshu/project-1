const AI_CONFIG = {
  provider: "groq",
  model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
  temperature: 0.7,
  max_tokens: 2048,
};

const FALLBACK_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant"
];

module.exports = {
  AI_CONFIG,
  FALLBACK_MODELS
};
