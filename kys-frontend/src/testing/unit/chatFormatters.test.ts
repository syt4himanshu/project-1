import { describe, expect, it } from 'vitest'
import {
    formatContextLabel,
    isSnapshotRefreshQuery,
    parseFirstResponse,
    parseFollowUpResponse,
    parseStructuredResponse,
} from '../../modules/faculty/chatbot/utils/chatFormatters'
import type { MenteeRow } from '../../modules/faculty/api/types'

// ─── parseFirstResponse ───────────────────────────────────────────────────────

describe('parseFirstResponse', () => {
    it('extracts directAnswer and all four renamed sections', () => {
        const text = [
            'Direct Answer:',
            'This student is performing well overall.',
            '',
            'Student Overview:',
            'Semester 5, CGPA 7.8.',
            '',
            'Strengths & Potential:',
            'Strong in Python and ML.',
            '',
            'Areas for Improvement:',
            'Communication skills need work.',
            '',
            'Faculty Recommendations:',
            'Enroll in a communication workshop.',
        ].join('\n')

        const result = parseFirstResponse(text)

        expect(result.directAnswer).toBe('This student is performing well overall.')
        expect(result.sections?.['Student Overview']).toContain('Semester 5')
        expect(result.sections?.['Strengths & Potential']).toContain('Python')
        expect(result.sections?.['Areas for Improvement']).toContain('Communication')
        expect(result.sections?.['Faculty Recommendations']).toContain('workshop')
    })

    it('returns plain text as directAnswer when no sections present', () => {
        const text = 'Here is a simple follow-up answer.'
        const result = parseFirstResponse(text)

        expect(result.directAnswer).toBe(text)
        expect(result.sections).toBeNull()
    })

    it('accepts legacy section aliases (Summary, Key Observations, Concerns, Suggestions)', () => {
        const text = [
            'Direct Answer:',
            'Legacy format answer.',
            '',
            'Summary:',
            'Student summary.',
            '',
            'Key Observations:',
            'Key obs.',
            '',
            'Concerns:',
            'Some concerns.',
            '',
            'Suggestions:',
            'Some suggestions.',
        ].join('\n')

        const result = parseFirstResponse(text)

        expect(result.sections?.['Student Overview']).toContain('summary')
        expect(result.sections?.['Strengths & Potential']).toContain('Key obs')
        expect(result.sections?.['Areas for Improvement']).toContain('concerns')
        expect(result.sections?.['Faculty Recommendations']).toContain('suggestions')
    })
})

// ─── parseFollowUpResponse ────────────────────────────────────────────────────

describe('parseFollowUpResponse', () => {
    it('returns trimmed plain text', () => {
        expect(parseFollowUpResponse('  Hello world.  ')).toBe('Hello world.')
    })

    it('returns empty string for empty input', () => {
        expect(parseFollowUpResponse('')).toBe('')
    })
})

// ─── parseStructuredResponse (legacy shim) ────────────────────────────────────

describe('parseStructuredResponse', () => {
    it('parses new section headings correctly', () => {
        const text = [
            'Student Overview',
            'Good academic standing.',
            'Strengths & Potential',
            'Strong coder.',
            'Areas for Improvement',
            'Needs internships.',
            'Faculty Recommendations',
            'Apply to internships.',
        ].join('\n')

        const result = parseStructuredResponse(text)

        expect(result['Student Overview']).toBe('Good academic standing.')
        expect(result['Strengths & Potential']).toBe('Strong coder.')
        expect(result['Areas for Improvement']).toBe('Needs internships.')
        expect(result['Faculty Recommendations']).toBe('Apply to internships.')
    })

    it('falls back to Student Overview when no headings found', () => {
        const text = 'Plain text response.'
        const result = parseStructuredResponse(text)

        expect(result['Student Overview']).toBe(text)
        expect(result['Strengths & Potential']).toBe('')
    })
})

// ─── formatContextLabel ───────────────────────────────────────────────────────

describe('formatContextLabel', () => {
    const mentees: MenteeRow[] = [
        { id: 1, uid: 'S001', full_name: 'Alice Smith', semester: 3 },
        { id: 2, uid: 'S002', full_name: 'Bob Jones', semester: 5 },
    ]

    it('returns student name when uid matches', () => {
        expect(formatContextLabel('S001', mentees)).toBe('Student: Alice Smith')
    })

    it('returns "No student selected" when uid not found', () => {
        expect(formatContextLabel('S999', mentees)).toBe('No student selected')
    })

    it('returns "No student selected" when uid is empty', () => {
        expect(formatContextLabel('', mentees)).toBe('No student selected')
    })

    it('returns "No student selected" when mentees list is empty', () => {
        expect(formatContextLabel('S001', [])).toBe('No student selected')
    })
})

// ─── isSnapshotRefreshQuery ───────────────────────────────────────────────────

describe('isSnapshotRefreshQuery', () => {
    it('detects "refresh insights"', () => {
        expect(isSnapshotRefreshQuery('Refresh insights')).toBe(true)
    })

    it('detects "analyze student again"', () => {
        expect(isSnapshotRefreshQuery('Please analyze student again')).toBe(true)
    })

    it('detects "regenerate student profile"', () => {
        expect(isSnapshotRefreshQuery('Regenerate student profile now')).toBe(true)
    })

    it('does not trigger on a normal query', () => {
        expect(isSnapshotRefreshQuery('What are the placement gaps?')).toBe(false)
    })
})
