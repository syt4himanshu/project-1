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

const INSIGHTS_SYSTEM_PROMPT = `You are MentorAI, an experienced faculty mentor and placement advisor for B.Tech Computer Engineering students.

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


const REMARKS_SYSTEM_PROMPT = `You are MentorAI, an experienced faculty mentor, placement advisor, and career counselor for engineering students.

Generate mentoring remarks for the student strictly following this sequence:
1. Recognize strengths — highlight 1-2 specific achievements or positive attributes visible in the student's profile.
2. Identify improvement opportunities — point out 1-2 specific areas that need attention, grounded in the student's data.
3. Explain why improvement matters — briefly state the career or academic consequence of addressing each gap.
4. Suggest practical next steps — give concrete, actionable recommendations tailored to the student's goals and profile.
5. End with encouragement — close with a brief, genuine, personalized statement (no generic phrases like "You can do it!" or "Keep it up!").

Tone rules:
• Professional, warm, encouraging, constructive, and data-driven.
• Write as a faculty mentor speaking directly to the student.
• Every point must be specific to this student's profile — no generic filler.

Language rules — always use phrasings like:
• "Your academic record indicates..."
• "Your current CGPA of X suggests..."
• "Your participation in [activity] reflects..."
• "Based on your profile..."
• "Your experience with [skill/project] demonstrates..."

Strictly avoid:
• "Based on the schema..." / "The database indicates..." / "The prompt suggests..."
• "I extracted..." / "According to the JSON..." / "The context shows..."
• Any reference to internal systems, databases, schemas, or data extraction.
• Generic motivational language not tied to the student's actual profile.

Format:
• 5-7 lines total. Each line is one clear, complete thought.
• No bullet points, no section headers — write as flowing mentor remarks.
• Do not fabricate data. If information is missing, infer practical guidance from what is available.`;


const buildUserMessage = ({ facultyQuery, studentDataset, conversationHistory = [] }) => {
  const studentProfile = studentDataset?.students?.[0] || {};

  const profileSummary = [
    studentProfile.name ? `Student Name: ${studentProfile.name}` : null,
    studentProfile.semester ? `Semester: ${studentProfile.semester}` : null,
    studentProfile.program ? `Program: ${studentProfile.program}` : null,
    studentProfile.cgpa ? `CGPA: ${studentProfile.cgpa}` : null,
    studentProfile.academicRecords?.length
      ? `Semester-wise SGPA: ${studentProfile.academicRecords.map(r => `Sem ${r.semester}: ${r.sgpa}${r.backlogs && r.backlogs !== 'None' ? ` (backlogs: ${r.backlogs})` : ''}`).join(', ')}`
      : null,
    studentProfile.skills
      ? `Skills: Programming — ${studentProfile.skills.programming || 'N/A'}; Technologies — ${studentProfile.skills.technologies || 'N/A'}; Domains — ${studentProfile.skills.domains || 'N/A'}`
      : null,
    studentProfile.projects?.length
      ? `Projects: ${studentProfile.projects.map(p => p.title).join(', ')}`
      : null,
    studentProfile.internships?.length
      ? `Internships: ${studentProfile.internships.map(i => i.title || JSON.stringify(i)).join(', ')}`
      : null,
    studentProfile.careerObjective
      ? `Career Goal: ${studentProfile.careerObjective.goal || 'N/A'}; Placement Interest: ${studentProfile.careerObjective.placement_interest}`
      : null,
    studentProfile.swoc
      ? `Strengths: ${studentProfile.swoc.strengths || 'N/A'}; Weaknesses: ${studentProfile.swoc.weaknesses || 'N/A'}; Opportunities: ${studentProfile.swoc.opportunities || 'N/A'}; Challenges: ${studentProfile.swoc.challenges || 'N/A'}`
      : null,
    studentProfile.recentMinutes?.length
      ? `Recent Mentoring Notes: ${studentProfile.recentMinutes.map(m => m.remarks).filter(Boolean).join(' | ')}`
      : null,
  ].filter(Boolean).join('\n');

  // Build the messages array: system + optional history + current user message
  const isFirstQuery = !conversationHistory || conversationHistory.length === 0;
  const contextNote = isFirstQuery
    ? ''
    : '\n\n[This is a follow-up question. Respond conversationally using the context above. Do NOT regenerate the four sections.]';

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

const generateFacultyInsights = async ({ facultyQuery, studentDataset, mode = 'insights', conversationHistory = [] }) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || !String(apiKey).trim()) {
    throw new Error('Missing GROQ_API_KEY');
  }

  const groq = new Groq({ apiKey: String(apiKey).trim() });

  const systemPrompt = mode === 'remarks' ? REMARKS_SYSTEM_PROMPT : INSIGHTS_SYSTEM_PROMPT;
  const { currentUserMessage } = buildUserMessage({ facultyQuery, studentDataset, conversationHistory });

  // Build messages: system → history turns → current user message
  const MAX_HISTORY_TURNS = 6; // keep last 3 exchanges (6 messages) to stay within token budget
  const trimmedHistory = conversationHistory.slice(-MAX_HISTORY_TURNS);

  const messages = [
    { role: 'system', content: systemPrompt },
    ...trimmedHistory,
    { role: 'user', content: currentUserMessage },
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
