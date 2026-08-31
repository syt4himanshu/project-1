const Groq = require("groq-sdk");
const {
  AI_CONFIG,
  FALLBACK_MODELS,
  resolvePrimaryModel,
} = require("../config/ai.config");
const { retryWithBackoff, isRetryableError } = require("../utils/retry");
const CircuitBreaker = require("../utils/circuitBreaker");
const {
  createAIConfigError,
  createAIUnavailableError,
  createValidationError,
  isAIError,
  isGroqModelError,
  classifyGroqError,
} = require("../utils/aiErrors");
const { adaptStudentDataset } = require("./studentContextAdapter");
const {
  validateFacultyInsightsResponse,
} = require("../utils/aiResponseValidator");
const {
  createAiRequestContext,
  resolveAiErrorCode,
  summarizeStudentDataset,
} = require("../utils/aiRequestLogger");

// Circuit breaker for Groq API
const groqCircuitBreaker = new CircuitBreaker({
  failureThreshold: 5,
  successThreshold: 2,
  timeout: 30000, // 30s
  name: "groq-api",
});

let createGroqClient = (apiKey) =>
  new Groq({ apiKey: String(apiKey).trim() });

// Hard cap on Groq HTTP calls per user-initiated request (main + fallback + regen).
const MAX_GROQ_CALLS_PER_REQUEST = AI_CONFIG.maxCallsPerRequest;

const createGroqCallBudget = (maxCalls = MAX_GROQ_CALLS_PER_REQUEST) => {
  let used = 0;

  return {
    run(fn) {
      if (used >= maxCalls) {
        throw createValidationError(
          "AI provider call limit reached for this request",
        );
      }
      used += 1;
      return fn();
    },
    getUsed() {
      return used;
    },
    remaining() {
      return Math.max(0, maxCalls - used);
    },
  };
};

const assertGroqCircuitAllowsCall = () => {
  const { state, nextAttempt } = groqCircuitBreaker.getState();
  if (state === "OPEN" && Date.now() < nextAttempt) {
    const error = createAIUnavailableError(
      "Circuit breaker is OPEN for groq-api",
    );
    error.circuitBreakerOpen = true;
    throw error;
  }
};

const INSIGHTS_SYSTEM_PROMPT = `You are MentorAI, an experienced faculty mentor and placement advisor for B.Tech Computer Science and Engineering students.

You will receive:
1. A student profile with academic records, skills, projects, internships, SWOC, and career goals.
2. The faculty member's question.
3. Optionally, previous conversation history.

== FIRST RESPONSE (when no conversation history is provided) ==

Your response MUST begin with the literal line "Direct Answer:" as the very first line.
Do not omit this header. Do not prepend introductions, markdown, blank lines, reasoning, or any text before it.

Respond in exactly this structure using plain section headers (not markdown headings):

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

EXAMPLE (copy this exact header format — first line must be "Direct Answer:"):
Direct Answer:
The student's CGPA of 8.4 and project portfolio indicate solid placement readiness for software roles.

Student Overview:
- Semester 6 B.Tech CSE student with CGPA 8.4
- Two completed projects in web development

Strengths & Potential:
- Strong programming fundamentals in Python and Java
- Demonstrated teamwork on capstone projects

Areas for Improvement:
- Limited internship exposure to date
- No certifications in cloud technologies yet

Faculty Recommendations:
- Apply for summer internships in product-based companies
- Complete an AWS or Azure fundamentals certification this semester

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
• Do not fabricate data. If information is missing, state "Not provided" for that field.
• Never estimate CGPA, attendance, skills, certifications, internships, achievements, or project details.
• Do NOT expose internal reasoning, chain-of-thought, or meta-analysis. Never output thinking tags or hidden reasoning blocks.
• Never mention prompts, schemas, models, AI, system messages, or internal instructions.
• Tone: professional, warm, constructive, data-driven.
• Only output the required sections in the specified order. No extra sections.

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

const generateFacultyInsights = async (
  {
    facultyQuery,
    studentDataset,
    mode = "insights",
    conversationHistory = [],
  },
  requestId = null,
) => {
  const ai = createAiRequestContext(requestId, groqCircuitBreaker);

  ai.log("info", "service.start", {
    extra: {
      mode,
      queryLength: facultyQuery?.length ?? 0,
      conversationHistoryTurns: conversationHistory.length,
      studentDataset: summarizeStudentDataset(studentDataset),
    },
  });

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || !String(apiKey).trim()) {
    const configError = createAIConfigError("Missing GROQ_API_KEY");
    ai.log("error", "service.error", {
      errorCode: resolveAiErrorCode(configError),
      extra: { reason: "missing_api_key" },
    });
    throw configError;
  }

  const groq = createGroqClient(apiKey);

  const systemPrompt =
    mode === "remarks" ? REMARKS_SYSTEM_PROMPT : INSIGHTS_SYSTEM_PROMPT;
  const adaptedStudentDataset = adaptStudentDataset(studentDataset);
  const { currentUserMessage } = buildUserMessage({
    facultyQuery,
    studentDataset: adaptedStudentDataset,
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

  assertGroqCircuitAllowsCall();

  try {
    const result = await groqCircuitBreaker.execute(async () => {
      const callBudget = createGroqCallBudget();

      const invokeGroq = (payload, attemptMeta = {}) =>
        callBudget.run(async () => {
          ai.log("info", "provider.call", {
            model: payload.model,
            attemptNumber: attemptMeta.attemptNumber ?? callBudget.getUsed(),
            extra: {
              operation: attemptMeta.operation || "completion",
              groqCallsUsed: callBudget.getUsed(),
            },
          });

          return groq.chat.completions.create(payload, {
            timeout: AI_CONFIG.requestTimeoutMs,
          });
        });

      try {
        let currentModel = resolvePrimaryModel();
        let fallbackIndex = 0;

        while (true) {
          const start = Date.now();
          let providerAttemptNumber = 0;

          try {
            const completion = await retryWithBackoff(
              async () => {
                providerAttemptNumber += 1;
                return invokeGroq(
                  {
                    model: currentModel,
                    messages,
                    temperature: AI_CONFIG.temperature,
                    max_tokens: AI_CONFIG.max_tokens,
                  },
                  {
                    attemptNumber: providerAttemptNumber,
                    operation: "completion",
                  },
                );
              },
              {
                maxAttempts: AI_CONFIG.maxProviderRetries,
                initialDelay: 1000,
                maxDelay: 5000,
                operationName: "groq-api-call",
                shouldRetry: isRetryableError,
              },
            );

            const latency = Date.now() - start;
            ai.log("info", "provider.success", {
              model: currentModel,
              providerLatencyMs: latency,
              attemptNumber: providerAttemptNumber,
              extra: { groqCallsUsed: callBudget.getUsed() },
            });

            const raw =
              completion?.choices?.[0]?.message?.content ?? null;

            const validated = validateFacultyInsightsResponse(raw);
            ai.log(validated.ok ? "info" : "warn", "validation.result", {
              model: currentModel,
              extra: {
                ok: validated.ok,
                reason: validated.reason,
                rawResponseLength: typeof raw === "string" ? raw.length : 0,
                validatedResponseLength: validated.ok ? validated.text.length : 0,
              },
            });

            if (validated.ok) {
              return validated.text;
            }

            if (callBudget.remaining() === 0) {
              const validationError = createValidationError(
                "We could not produce a complete mentoring response. Please try again.",
              );
              ai.log("error", "service.error", {
                model: currentModel,
                errorCode: resolveAiErrorCode(validationError),
                extra: {
                  reason: validated.reason,
                  groqCallsUsed: callBudget.getUsed(),
                  regenerationSkipped: true,
                },
              });
              throw validationError;
            }

            ai.log("warn", "validation.regeneration", {
              model: currentModel,
              extra: {
                reason: validated.reason,
                groqCallsRemaining: callBudget.remaining(),
              },
            });

            try {
              let regenAttemptNumber = 0;
              const regen = await retryWithBackoff(
                async () => {
                  regenAttemptNumber += 1;
                  return invokeGroq(
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
                    {
                      attemptNumber: regenAttemptNumber,
                      operation: "regeneration",
                    },
                  );
                },
                {
                  maxAttempts: 1,
                  initialDelay: 500,
                  maxDelay: 1000,
                  operationName: "groq-api-regen",
                  shouldRetry: isRetryableError,
                },
              );

              const raw2 = regen?.choices?.[0]?.message?.content ?? null;
              const validated2 = validateFacultyInsightsResponse(raw2);
              ai.log(validated2.ok ? "info" : "error", "validation.result", {
                model: currentModel,
                extra: {
                  ok: validated2.ok,
                  reason: validated2.reason,
                  rawResponseLength: typeof raw2 === "string" ? raw2.length : 0,
                  validatedResponseLength: validated2.ok ? validated2.text.length : 0,
                  regeneration: true,
                },
              });

              if (validated2.ok) {
                return validated2.text;
              }

              const validationError = createValidationError(
                "We could not produce a complete mentoring response. Please try again.",
              );
              ai.log("error", "service.error", {
                model: currentModel,
                errorCode: resolveAiErrorCode(validationError),
                extra: {
                  reason: validated2.reason,
                  groqCallsUsed: callBudget.getUsed(),
                  regenerationFailed: true,
                },
              });
              throw validationError;
            } catch (regenError) {
              if (isAIError(regenError)) {
                ai.log("error", "provider.error", {
                  model: currentModel,
                  errorCode: resolveAiErrorCode(regenError),
                  extra: {
                    operation: "regeneration",
                    groqCallsUsed: callBudget.getUsed(),
                  },
                });
                throw regenError;
              }

              const classified = classifyGroqError(regenError);
              ai.log("error", "provider.error", {
                model: currentModel,
                errorCode: resolveAiErrorCode(classified),
                extra: {
                  operation: "regeneration",
                  groqCallsUsed: callBudget.getUsed(),
                },
              });
              throw classified;
            }
          } catch (error) {
            const latency = Date.now() - start;
            const classified = isAIError(error) ? error : classifyGroqError(error);

            ai.log("error", "provider.error", {
              model: currentModel,
              providerLatencyMs: latency,
              attemptNumber: providerAttemptNumber,
              errorCode: resolveAiErrorCode(classified),
              extra: { groqCallsUsed: callBudget.getUsed() },
            });

            if (error.status === 401 || error.response?.status === 401) {
              throw createAIConfigError("Invalid GROQ_API_KEY", { cause: error });
            }

            if (
              (isGroqModelError(error) || isGroqModelError(classified)) &&
              fallbackIndex < FALLBACK_MODELS.length
            ) {
              if (callBudget.remaining() === 0) {
                throw createAIConfigError("Groq model is deprecated or invalid", {
                  cause: error,
                });
              }
              currentModel = FALLBACK_MODELS[fallbackIndex++];
              ai.log("info", "provider.fallback", {
                model: currentModel,
                extra: { fallbackIndex },
              });
              continue;
            }

            if (isGroqModelError(error) || isGroqModelError(classified)) {
              throw createAIConfigError("Groq model is deprecated or invalid", {
                cause: error,
              });
            }

            throw classified;
          }
        }
      } catch (error) {
        if (isAIError(error)) {
          throw error;
        }

        throw createValidationError(
          error?.message || "Unexpected application error during AI generation",
          { cause: error },
        );
      }
    });

    ai.log("info", "service.complete", {
      extra: { responseLength: result?.length ?? 0 },
    });

    return result;
  } catch (error) {
    ai.log("error", "service.error", {
      errorCode: resolveAiErrorCode(error),
      extra: { errorMessage: error?.message || "Unknown error" },
    });
    throw error;
  }
};

module.exports = {
  generateFacultyInsights,
  groqCircuitBreaker,
  buildUserMessage,
  MAX_GROQ_CALLS_PER_REQUEST,
  createGroqCallBudget,
  assertGroqCircuitAllowsCall,
  __setGroqClientFactoryForTests: (factory) => {
    createGroqClient = factory;
  },
  __resetGroqClientFactoryForTests: () => {
    createGroqClient = (apiKey) =>
      new Groq({ apiKey: String(apiKey).trim() });
  },
};
