import { describe, expect, it } from 'vitest';
import {
  MAX_RESPONSE_CHARS,
  validateFacultyInsightsResponse,
} from '../../utils/aiResponseValidator';
import {
  EMPTY_RESPONSES,
  MARKDOWN_BOLD_RESPONSE,
  MARKDOWN_FENCED_RESPONSE,
  TRUNCATED_RESPONSE,
  WELL_FORMED_RESPONSE,
  WITH_THINKING_BLOCK,
} from './fixtures/aiResponseValidator.fixtures';

describe('validateFacultyInsightsResponse', () => {
  it('never throws for any input', () => {
    const inputs: unknown[] = [
      null,
      undefined,
      '',
      42,
      { text: 'nope' },
      WELL_FORMED_RESPONSE,
    ];

    for (const input of inputs) {
      expect(() => validateFacultyInsightsResponse(input)).not.toThrow();
    }
  });

  it('accepts a well-formed response', () => {
    const result = validateFacultyInsightsResponse(WELL_FORMED_RESPONSE);

    expect(result).toEqual({
      ok: true,
      text: WELL_FORMED_RESPONSE,
      reason: null,
    });
    expect(result.text).not.toMatch(/<think>|<\/think>/i);
  });

  it.each(EMPTY_RESPONSES)('rejects empty response: %p', (input) => {
    const result = validateFacultyInsightsResponse(input);

    expect(result).toEqual({
      ok: false,
      text: null,
      reason: 'Empty response',
    });
  });

  it('unwraps markdown-fenced responses', () => {
    const result = validateFacultyInsightsResponse(MARKDOWN_FENCED_RESPONSE);

    expect(result.ok).toBe(true);
    expect(result.text).toBe(WELL_FORMED_RESPONSE);
    expect(result.reason).toBeNull();
    expect(result.text).not.toContain('```');
  });

  it('accepts markdown-bold section headers from gpt-oss-120b', () => {
    const result = validateFacultyInsightsResponse(MARKDOWN_BOLD_RESPONSE);

    expect(result.ok).toBe(true);
    expect(result.reason).toBeNull();
    expect(result.text).toBe(WELL_FORMED_RESPONSE);
    expect(result.text).not.toMatch(/\*\*Direct Answer\*\*/);
  });

  it('strips redacted_thinking blocks and returns cleaned faculty-safe text', () => {
    const result = validateFacultyInsightsResponse(WITH_THINKING_BLOCK);

    expect(result.ok).toBe(true);
    expect(result.text).toBe(WELL_FORMED_RESPONSE);
    expect(result.reason).toBeNull();
    expect(result.text).not.toMatch(/<think>|<\/think>|analyze the student profile/i);
  });

  it('rejects truncated or incomplete responses', () => {
    const result = validateFacultyInsightsResponse(TRUNCATED_RESPONSE);

    expect(result).toEqual({
      ok: false,
      text: null,
      reason: 'Missing sections: Faculty Recommendations',
    });
  });

  it('reports only sections that are actually missing', () => {
    const missingDirectAnswerOnly = `Student Overview:
- Semester 6 B.Tech CSE student

Strengths & Potential:
- Strong programming fundamentals

Areas for Improvement:
- Needs more internship exposure

Faculty Recommendations:
- Apply for summer internships this semester`;

    const result = validateFacultyInsightsResponse(missingDirectAnswerOnly);

    expect(result.ok).toBe(false);
    expect(result.reason).toBe('Missing sections: Direct Answer');
  });

  it('rejects excessively long output', () => {
    const longBody = 'x'.repeat(MAX_RESPONSE_CHARS + 1);
    const result = validateFacultyInsightsResponse(longBody);

    expect(result).toEqual({
      ok: false,
      text: null,
      reason: 'Response exceeds maximum length',
    });
  });

  it('rejects responses that still contain chain-of-thought markers after cleaning', () => {
    const result = validateFacultyInsightsResponse(
      'Direct Answer:\nLeaked </think> marker.\n\nStudent Overview:\n- A\n\nStrengths & Potential:\n- B\n\nAreas for Improvement:\n- C\n\nFaculty Recommendations:\n- D',
    );

    expect(result.ok).toBe(false);
    expect(result.text).toBeNull();
    expect(result.reason).toBe('Response contains disallowed reasoning content');
  });
});
