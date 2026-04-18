const Groq = require('groq-sdk');
const { AI_CONFIG, FALLBACK_MODELS } = require('../config/ai.config');

const SYSTEM_PROMPT = `You are a faculty assistant. Provide concise, actionable insights about the student.
Use the provided context to answer questions. Summarize the insights effectively. DO NOT output massive raw database arrays. Extrapolate metrics and performance overviews instead.

Output format should be structured and concise:
Summary:
...
Key Observations:
...
Concerns:
...
Suggestions:
...`;

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

  let currentModel = AI_CONFIG.model;
  let fallbackIndex = 0;

  while (true) {
    const start = Date.now();
    try {
      const completion = await groq.chat.completions.create({
        model: currentModel,
        messages,
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.max_tokens,
      }, { timeout: 8000 });

      const latency = Date.now() - start;
      console.log("Groq Model:", currentModel);
      console.log("Latency:", latency, "ms");

      return completion?.choices?.[0]?.message?.content || "No response generated";
    } catch (error) {
      console.error("Groq API Error:", error.message);

      if (error.status === 401 || error.response?.status === 401) {
        throw new Error("Invalid GROQ_API_KEY");
      }

      const isModelError = error.error?.error?.code === "model_decommissioned" || 
                           error.error?.error?.code === "invalid_request_error" ||
                           /decommissioned|not found|does not exist/.test(error.message);

      if (isModelError && fallbackIndex < FALLBACK_MODELS.length) {
        currentModel = FALLBACK_MODELS[fallbackIndex++];
        console.log(`Retrying with fallback model: ${currentModel}`);
        continue;
      }

      if (isModelError) {
        throw new Error("Groq model is deprecated or invalid");
      }

      throw error;
    }
  }
};

module.exports = {
  generateFacultyInsights,
};
