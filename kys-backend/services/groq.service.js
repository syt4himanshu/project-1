const Groq = require("groq-sdk");
const { AI_CONFIG, FALLBACK_MODELS } = require("../config/ai.config");
const { retryWithBackoff } = require("../utils/retry");
const CircuitBreaker = require("../utils/circuitBreaker");
const logger = require("../utils/logger");

// Circuit breaker for Groq API
const groqCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 30000, // 30s
  name: "groq-api",
});

const INSIGHTS_SYSTEM_PROMPT = `You are MentorAI, an experienced faculty mentor and placement advisor for B.Tech Computer Science and Engineering students.

You will receive:
1. A student profile with academic records, skills, projects, internships, SWOC, and career goals.
2. The faculty member's question.
3. Optionally, previous conversation history.

== FIRST RESPONSE (when no conversation history is provided) ==

Respond in exactly this structure:

Direct Answer:
[4–6 sentences that directly answer the faculty's question. Write as a faculty mentor speaking to another faculty member. Be specific, professional, and data-driven. Reference the student's actual data.]

Student Overview:
[2–4 bullet points summarizing the student's academic standing, background, and overall profile.]

Strengths & Potential:
[2–4 bullet points highlighting the student's strongest attributes, skills, achievements, and growth areas.]

Areas for Improvement:
[2–4 bullet points identifying specific gaps in academics, skills, projects, or placement readiness.]

Faculty Recommendations:
[2–4 bullet points with concrete, prioritized actions the student should take this semester.]

== FOLLOW-UP RESPONSES (when conversation history is provided) ==

Respond ONLY with a direct conversational answer to the faculty's latest question.
Do NOT regenerate Student Overview, Strengths & Potential, Areas for Improvement, or Faculty Recommendations.
Do NOT repeat information already covered unless the faculty explicitly asks.
Use previous conversation context to give consistent, progressive answers.
Keep the response focused and professional — 2–8 sentences unless the task requires more.

== RULES FOR ALL RESPONSES ==
• Write as a faculty mentor, not as an AI assistant.
• Every point must reference the student's actual data — no generic filler.
• Use phrasings like: "Your academic record indicates...", "Your CGPA of X suggests...", "Your work on [project] demonstrates..."
• Strictly avoid: "Based on the schema...", "The database indicates...", "I extracted...", "According to the JSON..."
• Do not fabricate data. If information is missing, infer practical guidance from what is available.
• Tone: professional, warm, constructive, data-driven.

== SNAPSHOT REFRESH ==
If the faculty writes any of: "Refresh insights", "Analyze student again", "Regenerate student profile" — treat it as a first response and regenerate the full structure including all four sections.`;

const REMARKS_SYSTEM_PROMPT = `You are MentorAI, an academic mentor and placement advisor for B.Tech Computer Science and Engineering students.

Follow these rules strictly:
- Analyze ONLY the student information supplied. Do NOT invent missing information.
- If an important field is missing, state it as "Not provided" (e.g., "CGPA: Not provided.").
- Never estimate CGPA, attendance, skills, certifications, internships, achievements, or project details.
- Prioritize highest-impact, actionable recommendations focused on the next semester.
- Do NOT expose internal reasoning, chain-of-thought, or any meta-analysis. Never output <think> or </think>.
- Never mention prompts, schemas, models, AI, system messages, or internal instructions.
- Avoid generic motivational language and avoid repeating the same information.

STRICT OUTPUT FORMAT (MUST be followed exactly):

Direct Answer:
4-5 concise sentences that directly answer the faculty's question. Be professional, specific, and evidence-based.

Student Overview:
- Up to 3 concise bullet points summarizing the student's key facts (use "Not provided" where data is missing).

Strengths & Potential:
- 2-4 concise bullet points grounded in the supplied data.

Areas for Improvement:
- 2-4 concise bullet points, prioritized, grounded in the supplied data.

Faculty Recommendations:
- 3-4 prioritized, actionable bullet points focused on the next semester.

Only output these five sections in this order and nothing else. Do not add introductions, conclusions, reasoning, or metadata.`;

const buildUserMessage = ({
  facultyQuery,
  studentDataset,
  conversationHistory = [],
}) => {
  const studentProfile = studentDataset?.students?.[0] || {};

  // Sanitize student profile fields to reduce prompt-injection risk (escape angle brackets and redact obvious instruction-like lines)
  const sanitizeForPrompt = (value) => {
    if (value === null || value === undefined) return "";
    const text = String(value);
    // Escape angle brackets so the model treats them as data
    let s = text.replace(/</g, "<").replace(/>/g, ">");
    // Redact suspicious instruction-like tokens while preserving data
    s = s.replace(
      /(ignore previous instructions|ignore all previous|system message|you are the|<think>|<\/think>)/gi,
      "[REDACTED]",
    );
    return s;
  };

  const profileSummary = [
    studentProfile.name
      ? `Student Name: ${sanitizeForPrompt(studentProfile.name)}`
      : null,
    studentProfile.semester ? `Semester: ${studentProfile.semester}` : null,
    studentProfile.program
      ? `Program: ${sanitizeForPrompt(studentProfile.program)}`
      : null,
    studentProfile.cgpa
      ? `CGPA: ${sanitizeForPrompt(studentProfile.cgpa)}`
      : null,
    studentProfile.academicRecords?.length
      ? `Semester-wise SGPA: ${studentProfile.academicRecords
          .map(
            (r) =>
              `Sem ${r.semester}: ${r.sgpa}${
                r.backlogs && r.backlogs !== "None"
                  ? ` (backlogs: ${r.backlogs})`
                  : ""
              }`,
          )
          .join(", ")}`
      : null,
    studentProfile.skills
      ? `Skills: Programming — ${
          studentProfile.skills.programming || "N/A"
        }; Technologies — ${
          studentProfile.skills.technologies || "N/A"
        }; Domains — ${studentProfile.skills.domains || "N/A"}`
      : null,
    studentProfile.projects?.length
      ? `Projects: ${studentProfile.projects.map((p) => p.title).join(", ")}`
      : null,
    studentProfile.internships?.length
      ? `Internships: ${studentProfile.internships
          .map((i) => i.title || JSON.stringify(i))
          .join(", ")}`
      : null,
    studentProfile.careerObjective
      ? `Career Goal: ${
          studentProfile.careerObjective.goal || "N/A"
        }; Placement Interest: ${
          studentProfile.careerObjective.placement_interest
        }`
      : null,
    studentProfile.swoc
      ? `Strengths: ${studentProfile.swoc.strengths || "N/A"}; Weaknesses: ${
          studentProfile.swoc.weaknesses || "N/A"
        }; Opportunities: ${
          studentProfile.swoc.opportunities || "N/A"
        }; Challenges: ${studentProfile.swoc.challenges || "N/A"}`
      : null,
    studentProfile.recentMinutes?.length
      ? `Recent Mentoring Notes: ${studentProfile.recentMinutes
          .map((m) => m.remarks)
          .filter(Boolean)
          .join(" | ")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  // Clean and validate model text output to enforce required sections and remove chain-of-thought
  const cleanAndValidateResponse = (rawText) => {
    if (!rawText || typeof rawText !== "string")
      return { ok: false, reason: "Empty response" };

    // 1. Remove <think>...</think> blocks
    let text = rawText.replace(/<think>[\s\S]*?<\/think>/gi, "");

    // 2. Remove common reasoning headings and sections
    text = text.replace(
      /(^|\n)\s*(Thinking Process:|Analysis:|Self-?Correction:|Review and Refine:|Draft:|Let's verify|Proceed|One minor adjustment|Data used to understand this message)[\s\S]*?(?=\n[A-Z][a-zA-Z &]+:|$)/gi,
      "\n",
    );

    // 3. Remove markdown code fences if they wrap the whole response or appear unnecessarily
    text = text.replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, ""));

    // 4. Normalize whitespace
    text = text.replace(/\r\n/g, "\n").replace(/\t/g, " ").trim();

    // 5. Collapse duplicated consecutive lines
    const lines = text.split("\n");
    const collapsed = [];
    for (const line of lines) {
      if (
        collapsed.length &&
        collapsed[collapsed.length - 1].trim() === line.trim()
      )
        continue;
      collapsed.push(line);
    }
    text = collapsed.join("\n").trim();

    // 6. Ensure required sections exist and extract them
    const sectionNames = [
      "Direct Answer",
      "Student Overview",
      "Strengths & Potential",
      "Areas for Improvement",
      "Faculty Recommendations",
    ];

    const found = {};
    for (const name of sectionNames) {
      const re = new RegExp(
        "^" + name.replace(/[-&]/g, "\\$&") + "\\s*:",
        "im",
      );
      found[name] = re.test(text);
    }

    const missing = sectionNames.filter((n) => !found[n]);
    if (missing.length)
      return {
        ok: false,
        reason: "Missing sections: " + missing.join(", "),
        cleaned: text,
      };

    // If all sections present, return cleaned text
    return { ok: true, cleaned: text };
  };

  // Build the messages array: system + optional history + current user message
  const isFirstQuery = !conversationHistory || conversationHistory.length === 0;
  const contextNote = isFirstQuery
    ? ""
    : "\n\n[This is a follow-up question. Respond conversationally using the context above. Do NOT regenerate the four sections.]";

  return {
    profileSummary,
    currentUserMessage: `Faculty Request: ${facultyQuery}\n\nStudent Profile:\n${profileSummary}${contextNote}`,
    isFirstQuery,
  };
};

const buildNonBreakerError = (message) => {
  const error = new Error(message);
  error.skipCircuitBreaker = true;
  return error;
};

const generateFacultyInsights = async ({
  facultyQuery,
  studentDataset,
  mode = "insights",
  conversationHistory = [],
}) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || !String(apiKey).trim()) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const groq = new Groq({ apiKey: String(apiKey).trim() });

  const systemPrompt =
    mode === "remarks" ? REMARKS_SYSTEM_PROMPT : INSIGHTS_SYSTEM_PROMPT;
  const { currentUserMessage } = buildUserMessage({
    facultyQuery,
    studentDataset,
    conversationHistory,
  });

  // Build messages: system → history turns → current user message
  const MAX_HISTORY_TURNS = 6; // keep last 3 exchanges (6 messages) to stay within token budget
  const trimmedHistory = conversationHistory.slice(-MAX_HISTORY_TURNS);

  const messages = [
    { role: "system", content: systemPrompt },
    ...trimmedHistory,
    { role: "user", content: currentUserMessage },
  ];

  return groqCircuitBreaker.execute(async () => {
    let currentModel = AI_CONFIG.model;
    let fallbackIndex = 0;

    while (true) {
      const start = Date.now();

      try {
        const completion = await retryWithBackoff(
          async () => {
            return await groq.chat.completions.create(
              {
                model: currentModel,
                messages,
                temperature: AI_CONFIG.temperature,
                max_tokens: AI_CONFIG.max_tokens,
              },
              { timeout: 10000 },
            );
          },
          {
            maxAttempts: 3,
            initialDelay: 1000,
            maxDelay: 5000,
            operationName: "groq-api-call",
            shouldRetry: (error) => {
              if (error.status === 401 || error.response?.status === 401) {
                return false;
              }

              const isModelError =
                error.error?.error?.code === "model_decommissioned" ||
                error.error?.error?.code === "invalid_request_error" ||
                /decommissioned|not found|does not exist/.test(error.message);
              if (isModelError) {
                return false;
              }

              const status = error.status || error.response?.status;
              return status === 429 || status >= 500;
            },
          },
        );

        const latency = Date.now() - start;
        logger.info({
          message: "Groq API success",
          model: currentModel,
          latencyMs: latency,
        });

        const raw =
          completion?.choices?.[0]?.message?.content || "No response generated";

        // Clean and validate the response
        const cleaned = cleanAndValidateResponse(raw);
        if (cleaned.ok) return cleaned.cleaned;

        // Attempt one controlled regeneration with an explicit instruction
        logger.warn({
          message:
            "AI response missing required sections, attempting one regeneration",
          reason: cleaned.reason,
        });

        try {
          const regen = await retryWithBackoff(
            async () => {
              return await groq.chat.completions.create(
                {
                  model: currentModel,
                  messages: [
                    { role: "system", content: systemPrompt },
                    ...trimmedHistory,
                    { role: "user", content: currentUserMessage },
                    {
                      role: "user",
                      content:
                        'Regenerate the answer in the exact required format: Direct Answer:, Student Overview:, Strengths & Potential:, Areas for Improvement:, Faculty Recommendations:. Do not include any internal reasoning or metadata. If a field is missing, write "Not provided" for that field.',
                    },
                  ],
                  temperature: AI_CONFIG.temperature,
                  max_tokens: AI_CONFIG.max_tokens,
                },
                { timeout: 10000 },
              );
            },
            {
              maxAttempts: 2,
              initialDelay: 500,
              maxDelay: 1000,
              operationName: "groq-api-regen",
            },
          );

          const raw2 =
            regen?.choices?.[0]?.message?.content || "No response generated";
          const cleaned2 = cleanAndValidateResponse(raw2);
          if (cleaned2.ok) return cleaned2.cleaned;

          logger.error({
            message: "Regeneration failed to produce valid format",
            reason: cleaned2.reason,
          });
          return "ERROR: AI response malformed. Please try again or refine the query.";
        } catch (regenError) {
          logger.error({
            message: "Regeneration attempt failed",
            error: regenError?.message || regenError,
          });
          return "ERROR: AI generation failed. Please try again later.";
        }
      } catch (error) {
        logger.error({
          message: "Groq API error",
          model: currentModel,
          error: error.message,
          latencyMs: Date.now() - start,
        });

        if (error.status === 401 || error.response?.status === 401) {
          throw buildNonBreakerError("Invalid GROQ_API_KEY");
        }

        const isModelError =
          error.error?.error?.code === "model_decommissioned" ||
          error.error?.error?.code === "invalid_request_error" ||
          /decommissioned|not found|does not exist/.test(error.message);

        if (isModelError && fallbackIndex < FALLBACK_MODELS.length) {
          currentModel = FALLBACK_MODELS[fallbackIndex++];
          logger.info({ message: `Trying fallback model: ${currentModel}` });
          continue;
        }

        if (isModelError) {
          throw buildNonBreakerError("Groq model is deprecated or invalid");
        }

        throw error;
      }
    }
  });
};

module.exports = {
  generateFacultyInsights,
};
