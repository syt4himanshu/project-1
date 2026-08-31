/**
 * Pure validator for faculty AI insight responses.
 *
 * Input: untrusted model text.
 * Output: { ok, text, reason } — never throws.
 *
 * Chain-of-thought is stripped server-side and must never appear in text
 * returned to callers.
 */

const REQUIRED_SECTIONS = [
  "Direct Answer",
  "Student Overview",
  "Strengths & Potential",
  "Areas for Improvement",
  "Faculty Recommendations",
];

const MAX_RESPONSE_CHARS = 20_000;

const THINKING_BLOCK_PATTERNS = [
  /<think>[\s\S]*?<\/redacted_thinking>/gi,
  /<think>[\s\S]*?<\/think>/gi,
  new RegExp('<' + 'think' + '>[\\s\\S]*?<\\/' + 'think' + '>', 'gi'),
];

const ORPHAN_THINKING_MARKERS = /<\/?(?:redacted_thinking|think)>/gi;

const REASONING_HEADING_PATTERN =
  /(^|\n)\s*(Thinking Process:|Analysis:|Reasoning:|Self-?Correction:|Review and Refine:|Draft:|Let's verify|Proceed|One minor adjustment|Data used to understand this message)[\s\S]*?(?=\n(?:#{1,6}\s+)?[A-Z][a-zA-Z &]+:|\nDirect Answer:|\nStudent Overview:|\nStrengths & Potential:|\nAreas for Improvement:|\nFaculty Recommendations:|$)/gi;

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
  /<think>|<\/redacted_thinking>|<\/?think>/i.test(text);

const escapeRegExp = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const sectionHeaderPatterns = (name) => {
  const escaped = escapeRegExp(name);
  return [
    new RegExp(`^${escaped}\\s*:`, "im"),
    new RegExp(`^#{1,6}\\s+${escaped}\\s*:?`, "im"),
    new RegExp(`^\\*\\*${escaped}\\*\\*\\s*:?`, "im"),
    new RegExp(`^[-*]\\s+${escaped}\\s*:?`, "im"),
    new RegExp(`^\\d+\\.\\s*${escaped}\\s*:?`, "im"),
  ];
};

const trimPreambleBeforeFirstSection = (text) => {
  let earliest = -1;

  for (const name of REQUIRED_SECTIONS) {
    for (const pattern of sectionHeaderPatterns(name)) {
      const match = text.match(pattern);
      if (match && typeof match.index === "number") {
        earliest =
          earliest === -1 ? match.index : Math.min(earliest, match.index);
      }
    }
  }

  if (earliest > 0) {
    return text.slice(earliest);
  }

  return text;
};

const stripThinkingContent = (text) => {
  let cleaned = text;

  for (const pattern of THINKING_BLOCK_PATTERNS) {
    cleaned = cleaned.replace(pattern, "");
  }

  cleaned = cleaned.replace(REASONING_HEADING_PATTERN, "\n");
  cleaned = cleaned.replace(ORPHAN_THINKING_MARKERS, "");

  return cleaned;
};

/**
 * Normalize markdown-wrapped section headers to plain "Section Name:" lines.
 */
const normalizeSectionHeaders = (text) => {
  const lines = text.split("\n");

  return lines
    .map((line) => {
      for (const name of REQUIRED_SECTIONS) {
        const escaped = escapeRegExp(name);

        const patterns = [
          new RegExp(`^(\\s*)\\*\\*${escaped}\\s*:\\s*\\*\\*\\s*(.*)$`, "i"),
          new RegExp(`^(\\s*)\\*\\*${escaped}\\*\\*\\s*:(.*)$`, "i"),
          new RegExp(`^(\\s*)#{1,6}\\s+${escaped}\\s*:?\\s*(.*)$`, "i"),
          new RegExp(`^(\\s*)[-*]\\s+${escaped}\\s*:?\\s*(.*)$`, "i"),
          new RegExp(`^(\\s*)\\d+\\.\\s*${escaped}\\s*:?\\s*(.*)$`, "i"),
          new RegExp(`^(\\s*)${escaped}\\s*:\\s*(.*)$`, "i"),
        ];

        for (const pattern of patterns) {
          const match = line.match(pattern);
          if (match) {
            const rest = (match[2] || "").trim();
            return rest ? `${match[1]}${name}:\n${rest}` : `${match[1]}${name}:`;
          }
        }
      }

      return line;
    })
    .join("\n");
};

const findMissingSections = (text) => {
  const sectionHeaderPattern = (name) =>
    new RegExp("^" + escapeRegExp(name) + "\\s*:", "im");

  return REQUIRED_SECTIONS.filter(
    (name) => !sectionHeaderPattern(name).test(text),
  );
};

const normalizeFacultyResponseText = (rawText) => {
  let text = rawText;

  text = stripThinkingContent(text);
  text = unwrapMarkdownFences(text);
  text = text.replace(/\r\n/g, "\n").replace(/\t/g, " ").trim();
  text = trimPreambleBeforeFirstSection(text);
  text = collapseDuplicateLines(text);
  text = normalizeSectionHeaders(text);

  return text.trim();
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

  let text = normalizeFacultyResponseText(rawText);

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
  normalizeFacultyResponseText,
  REQUIRED_SECTIONS,
  MAX_RESPONSE_CHARS,
};
