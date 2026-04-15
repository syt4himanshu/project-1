import { describe, expect, it } from 'vitest'
import {
    normalizeProfile,
    normalizeMenteeRow,
    normalizeMentees,
    normalizeMenteesPage,
    normalizeMenteePayload,
    normalizeMinuteRow,
    normalizeMenteeMinutes,
} from '../../modules/faculty/api/normalizers'

// ─── normalizeProfile ─────────────────────────────────────────────────────────

describe('normalizeProfile', () => {
    it('maps all fields', () => {
        const raw = { first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com', contact_number: '9876543210' }
        const result = normalizeProfile(raw)
        expect(result.first_name).toBe('Jane')
        expect(result.last_name).toBe('Doe')
        expect(result.email).toBe('jane@example.com')
        expect(result.contact_number).toBe('9876543210')
    })

    it('returns null for missing contact_number', () => {
        const result = normalizeProfile({ first_name: 'A', last_name: 'B', email: 'a@b.com' })
        expect(result.contact_number).toBeNull()
    })

    it('handles null/undefined input gracefully', () => {
        const result = normalizeProfile(null)
        expect(result.first_name).toBe('')
        expect(result.email).toBe('')
    })
})

// ─── normalizeMenteeRow ───────────────────────────────────────────────────────

describe('normalizeMenteeRow', () => {
    it('uses full_name when present', () => {
        const raw = { id: 1, uid: 'S001', full_name: 'Alice Smith', semester: 3 }
        expect(normalizeMenteeRow(raw).full_name).toBe('Alice Smith')
    })

    it('constructs full_name from parts when full_name absent', () => {
        const raw = { id: 2, uid: 'S002', first_name: 'Bob', middle_name: 'C', last_name: 'Jones', semester: 5 }
        expect(normalizeMenteeRow(raw).full_name).toBe('Bob C Jones')
    })

    it('skips empty middle_name in constructed full_name', () => {
        const raw = { id: 3, uid: 'S003', first_name: 'Carol', middle_name: '', last_name: 'White', semester: 2 }
        expect(normalizeMenteeRow(raw).full_name).toBe('Carol White')
    })

    it('returns undefined for missing optional fields', () => {
        const raw = { id: 4, uid: 'S004', full_name: 'Dave', semester: 1 }
        const result = normalizeMenteeRow(raw)
        expect(result.section).toBeUndefined()
        expect(result.year_of_admission).toBeUndefined()
    })

    it('handles null/undefined input', () => {
        const result = normalizeMenteeRow(null)
        expect(result.id).toBe(0)
        expect(result.uid).toBe('')
    })
})

// ─── normalizeMentees ─────────────────────────────────────────────────────────

describe('normalizeMentees', () => {
    it('maps an array of raw rows', () => {
        const raw = [
            { id: 1, uid: 'S001', full_name: 'Alice', semester: 3 },
            { id: 2, uid: 'S002', full_name: 'Bob', semester: 5 },
        ]
        expect(normalizeMentees(raw)).toHaveLength(2)
    })

    it('returns empty array for non-array input', () => {
        expect(normalizeMentees(null)).toEqual([])
        expect(normalizeMentees(undefined)).toEqual([])
        expect(normalizeMentees({})).toEqual([])
    })
})

// ─── normalizeMenteesPage ─────────────────────────────────────────────────────

describe('normalizeMenteesPage', () => {
    it('marks isLastPage true when rows < limit', () => {
        const raw = [{ id: 1, uid: 'S001', full_name: 'Alice', semester: 3 }]
        const page = normalizeMenteesPage(raw, 20, 0)
        expect(page.isLastPage).toBe(true)
        expect(page.rows).toHaveLength(1)
    })

    it('marks isLastPage false when rows === limit', () => {
        const raw = Array.from({ length: 20 }, (_, i) => ({
            id: i + 1, uid: `S${i}`, full_name: `Student ${i}`, semester: 1,
        }))
        const page = normalizeMenteesPage(raw, 20, 0)
        expect(page.isLastPage).toBe(false)
    })
})

// ─── normalizeMenteePayload ───────────────────────────────────────────────────

describe('normalizeMenteePayload', () => {
    it('normalizes arrays to empty arrays when absent', () => {
        const raw = { id: 1, uid: 'S001', full_name: 'Alice', semester: 3 }
        const result = normalizeMenteePayload(raw)
        expect(result.projects).toEqual([])
        expect(result.internships).toEqual([])
        expect(result.past_education_records).toEqual([])
    })

    it('preserves existing arrays', () => {
        const raw = {
            id: 1, uid: 'S001', full_name: 'Alice', semester: 3,
            projects: [{ title: 'My Project' }],
        }
        const result = normalizeMenteePayload(raw)
        expect(result.projects).toHaveLength(1)
    })
})

// ─── normalizeMinuteRow ───────────────────────────────────────────────────────

describe('normalizeMinuteRow', () => {
    it('maps all fields', () => {
        const raw = {
            id: 10, semester: 3, date: '2026-01-15T00:00:00Z',
            remarks: 'Good session', suggestion: 'Study more', action: 'Follow up',
            created_by_faculty: true,
        }
        const result = normalizeMinuteRow(raw)
        expect(result.id).toBe(10)
        expect(result.remarks).toBe('Good session')
        expect(result.suggestion).toBe('Study more')
        expect(result.created_by_faculty).toBe(true)
    })

    it('returns null for empty suggestion/action', () => {
        const raw = { id: 1, semester: 1, date: '', remarks: 'Note', suggestion: '', action: null, created_by_faculty: false }
        const result = normalizeMinuteRow(raw)
        expect(result.suggestion).toBeNull()
        expect(result.action).toBeNull()
    })
})

// ─── normalizeMenteeMinutes ───────────────────────────────────────────────────

describe('normalizeMenteeMinutes', () => {
    it('extracts student banner and minutes array', () => {
        const raw = {
            student: { uid: 'S001', full_name: 'Alice', semester: 3 },
            mentoring_minutes: [
                { id: 1, semester: 3, date: '2026-01-01', remarks: 'First session', created_by_faculty: true },
            ],
        }
        const result = normalizeMenteeMinutes(raw)
        expect(result.student?.full_name).toBe('Alice')
        expect(result.mentoring_minutes).toHaveLength(1)
    })

    it('returns empty minutes array for missing data', () => {
        const result = normalizeMenteeMinutes({})
        expect(result.mentoring_minutes).toEqual([])
    })

    it('handles null input', () => {
        const result = normalizeMenteeMinutes(null)
        expect(result.mentoring_minutes).toEqual([])
    })
})
