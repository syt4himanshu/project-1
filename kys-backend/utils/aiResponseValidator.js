/**
 * Pure validator for faculty AI insight responses.
 *
 * Input: untrusted model text.
 * Output: { ok, text, reason } — never throws.
 *
 * - ok=true  → text is cleaned faculty-safe content, reason is null
 * - ok=false → text is null, reason describes the validation failure
 *
 * Chain-of-thought (<think> blocks) is stripped server-side and
 * must never appear in text returned to callers.
 */

const REQUIRED_SECTIONS = [
  "Direct Answer",
  "Student Overview",
  "Strengths & Potential",
  "Areas for Improvement",
  "Faculty Recommendations",
];

const MAX_RESPONSE_CHARS = 20_000;

const CHAIN_OF_THOUGHT_PATTERNS = [
  /<think>[\s\S]*?<\/redacted_thinking>/gi,
  /<think>[\s\S]*?<\/think>/gi,
];

const REASONING_HEADING_PATTERN =
  /(^|\n)\s*(Thinking Process:|Analysis:|Self-?Correction:|Review and Refine:|Draft:|Let's verify|Proceed|One minor adjustment|Data used to understand this message)[\s\S]*?(?=\n[A-Z][a-zA-Z &]+:|$)/gi;

const unwrapMarkdownFences = (text) => {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:\w+)?\s*([\s\S]*?)\s*```$/);
  if (fenced) {
    return fenced[1].trim();
  }

  return text.replace(/```[\s\S]*?```/g, (block) => block.replace(/```/g, ""));
};

const collapseDuplicateLines = (text) => {
  const lines = text.split("\n");
  const collapsed = [];

  for (const line of lines) {
    if (
      collapsed.length &&
      collapsed[collapsed.length - 1].trim() === line.trim()
    ) {
      continue;
    }
    collapsed.push(line);
  }

  return collapsed.join("\n").trim();
};

const containsChainOfThought = (text) =>
  /<think>|<\/redacted_thinking>|<\/think>/i.test(text);

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Normalize markdown-wrapped section headers to plain "Section Name:" lines.
 * openai/gpt-oss-120b often returns **Direct Answer:** instead of Direct Answer:
 */
const normalizeSectionHeaders = (text) => {
  const lines = text.split("\n");

  return lines
    .map((line) => {
      for (const name of REQUIRED_SECTIONS) {
        const escaped = escapeRegExp(name);

        const patterns = [
          // **Direct Answer:** (colon inside bold — gpt-oss-120b default)
          new RegExp(`^(\\s*)\\*\\*${escaped}\\s*:\\s*\\*\\*\\s*(.*)$`, "i"),
          // **Direct Answer**: or **Direct Answer**:
          new RegExp(`^(\\s*)\\*\\*${escaped}\\*\\*\\s*:(.*)$`, "i"),
          new RegExp(`^(\\s*)#{1,6}\\s+${escaped}\\s*:(.*)$`, "i"),
          new RegExp(`^(\\s*)[-*]\\s+${escaped}\\s*:(.*)$`, "i"),
          new RegExp(`^(\\s*)\\d+\\.\\s*${escaped}\\s*:(.*)$`, "i"),
        ];

        for (const pattern of patterns) {
          const match = line.match(pattern);
          if (match) {
            return `${match[1]}${name}:${match[2] || ""}`;
          }
        }
      }

      return line;
    })
    .join("\n");
};

const findMissingSections = (text) => {
  const sectionHeaderPattern = (name) =>
    new RegExp("^" + name.replace(/[-&]/g, "\\$&") + "\\s*:", "im");

  return REQUIRED_SECTIONS.filter(
    (name) => !sectionHeaderPattern(name).test(text),
  );
};

/**
 * @param {unknown} rawText
 * @returns {{ ok: true, text: string, reason: null } | { ok: false, text: null, reason: string }}
 */
const validateFacultyInsightsResponse = (rawText) => {
  if (rawText === null || rawText === undefined) {
    return { ok: false, text: null, reason: "Empty response" };
  }

  if (typeof rawText !== "string") {
    return { ok: false, text: null, reason: "Empty response" };
  }

  if (!rawText.trim()) {
    return { ok: false, text: null, reason: "Empty response" };
  }

  let text = rawText;

  for (const pattern of CHAIN_OF_THOUGHT_PATTERNS) {
    text = text.replace(pattern, "");
  }

  text = text.replace(REASONING_HEADING_PATTERN, "\n");
  text = unwrapMarkdownFences(text);
  text = text.replace(/\r\n/g, "\n").replace(/\t/g, " ").trim();
  text = collapseDuplicateLines(text);
  text = normalizeSectionHeaders(text);

  if (!text) {
    return { ok: false, text: null, reason: "Empty response" };
  }

  if (containsChainOfThought(text)) {
    return {
      ok: false,
      text: null,
      reason: "Response contains disallowed reasoning content",
    };
  }

  if (text.length > MAX_RESPONSE_CHARS) {
    return {
      ok: false,
      text: null,
      reason: "Response exceeds maximum length",
    };
  }

  const missing = findMissingSections(text);
  if (missing.length > 0) {
    return {
      ok: false,
      text: null,
      reason: "Missing sections: " + missing.join(", "),
    };
  }

  return { ok: true, text, reason: null };
};

module.exports = {
  validateFacultyInsightsResponse,
  REQUIRED_SECTIONS,
  MAX_RESPONSE_CHARS,
};
