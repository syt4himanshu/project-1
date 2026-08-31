const WELL_FORMED_RESPONSE = `Direct Answer:
The student is progressing well academically and shows strong placement readiness.

Student Overview:
- Semester 6 B.Tech CSE student
- CGPA 8.4

Strengths & Potential:
- Strong programming fundamentals
- Active in projects

Areas for Improvement:
- Needs more internship exposure

Faculty Recommendations:
- Apply for summer internships this semester`;

const MARKDOWN_FENCED_RESPONSE = `\`\`\`markdown
${WELL_FORMED_RESPONSE}
\`\`\``;

// openai/gpt-oss-120b default output shape (bold headers with colon outside markers)
const MARKDOWN_BOLD_RESPONSE = WELL_FORMED_RESPONSE.replace(
  /^(Direct Answer|Student Overview|Strengths & Potential|Areas for Improvement|Faculty Recommendations):/gm,
  "**$1:**",
);

const WITH_THINKING_BLOCK = `<think>
Let me analyze the student profile carefully before answering.
</think>
${WELL_FORMED_RESPONSE}`;

const TRUNCATED_RESPONSE = `Direct Answer:
Partial answer only.

Student Overview:
- Overview text

Strengths & Potential:
- Strength text

Areas for Improvement:
- Improvement text`;

const EMPTY_RESPONSES = [null, undefined, '', '   '];

module.exports = {
  WELL_FORMED_RESPONSE,
  MARKDOWN_FENCED_RESPONSE,
  MARKDOWN_BOLD_RESPONSE,
  WITH_THINKING_BLOCK,
  TRUNCATED_RESPONSE,
  EMPTY_RESPONSES,
};
