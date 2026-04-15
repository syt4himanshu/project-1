import { describe, expect, it } from 'vitest'
import {
    formatContextLabel,
    parseStructuredResponse,
    toErrorMessage,
} from '../../modules/faculty/chatbot/utils/chatFormatters'
import type { MenteeRow } from '../../modules/faculty/api/types'

// ─── parseStructuredResponse ─────────────────────────────────────────────────

describe('parseStructuredResponse', () => {
    it('parses all four sections from a well-formed response', () => {
        const text = [
            'Summary',
            'Overall performance is good.',
            'Key Observations',
            'Student A has improved.',
            'Concerns',
            'Student B has backlogs.',
            'Suggestions',
            'Schedule a session with Student B.',
        ].join('\n')

        const result = parseStructuredResponse(text)

        expect(result.Summary).toBe('Overall performance is good.')
        expect(result['Key Observations']).toBe('Student A has improved.')
        expect(result.Concerns).toBe('Student B has backlogs.')
        expect(result.Suggestions).toBe('Schedule a session with Student B.')
    })

    it('falls back to Summary-only when no section headings found', () => {
        const text = 'This is a plain response with no headings.'
        const result = parseStructuredResponse(text)

        expect(result.Summary).toBe(text)
        expect(result['Key Observations']).toBe('')
        expect(result.Concerns).toBe('')
        expect(result.Suggestions).toBe('')
    })

    it('handles section headings with trailing colons', () => {
        const text = 'Summary:\nGood progress.\nConcerns:\nNone.'
        const result = parseStructuredResponse(text)

        expect(result.Summary).toBe('Good progress.')
        expect(result.Concerns).toBe('None.')
    })

    it('handles "Observations" as alias for "Key Observations"', () => {
        const text = 'Observations\nAttendance is low.'
        const result = parseStructuredResponse(text)

        expect(result['Key Observations']).toBe('Attendance is low.')
    })

    it('returns empty sections for empty input', () => {
        const result = parseStructuredResponse('')

        expect(result.Summary).toBe('')
        expect(result['Key Observations']).toBe('')
        expect(result.Concerns).toBe('')
        expect(result.Suggestions).toBe('')
    })

    it('accumulates multi-line content within a section', () => {
        const text = 'Summary\nLine one.\nLine two.\nLine three.'
        const result = parseStructuredResponse(text)

        expect(result.Summary).toContain('Line one.')
        expect(result.Summary).toContain('Line two.')
        expect(result.Summary).toContain('Line three.')
    })
})

// ─── toErrorMessage ───────────────────────────────────────────────────────────

describe('toErrorMessage', () => {
    it('maps forbidden/assigned errors', () => {
        const err = new Error('Forbidden: Student is not assigned to this faculty')
        expect(toErrorMessage(err)).toMatch(/only.*assigned/i)
    })

    it('maps timeout errors', () => {
        const err = new Error('Request timeout exceeded')
        expect(toErrorMessage(err)).toMatch(/timeout/i)
    })

    it('maps no-student-data errors', () => {
        const err = new Error('No student data found')
        expect(toErrorMessage(err)).toMatch(/not enough/i)
    })

    it('returns raw message for unknown errors', () => {
        const err = new Error('Something unexpected happened')
        expect(toErrorMessage(err)).toBe('Something unexpected happened')
    })

    it('returns fallback for non-Error values', () => {
        expect(toErrorMessage(null)).toBe('Could not generate insights right now.')
        expect(toErrorMessage(undefined)).toBe('Could not generate insights right now.')
        expect(toErrorMessage(42)).toBe('Could not generate insights right now.')
    })
})

// ─── formatContextLabel ───────────────────────────────────────────────────────

describe('formatContextLabel', () => {
    const mentees: MenteeRow[] = [
        { id: 1, uid: 'S001', full_name: 'Alice Smith', semester: 3 },
        { id: 2, uid: 'S002', full_name: 'Bob Jones', semester: 5 },
    ]

    it('returns "All assigned students" for all scope', () => {
        expect(formatContextLabel('all', '', mentees)).toBe('All assigned students')
    })

    it('returns student name for student scope with valid uid', () => {
        expect(formatContextLabel('student', 'S001', mentees)).toBe('Student: Alice Smith')
    })

    it('falls back to "All assigned students" when uid not found', () => {
        expect(formatContextLabel('student', 'S999', mentees)).toBe('All assigned students')
    })

    it('falls back when mentees list is empty', () => {
        expect(formatContextLabel('student', 'S001', [])).toBe('All assigned students')
    })
})
