/**
 * normalizers.ts
 * Single source of truth for all snake_case → domain-model normalization.
 * Components and hooks must NOT do inline field mapping.
 */
import type {
    FacultyProfile,
    MenteeMinutesPayload,
    MenteePayload,
    MenteeRow,
    MenteesPage,
    MinuteRow,
} from './types'
import { extractStudentPhotoUrl } from '../../../shared/utils/studentPhoto'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function str(v: unknown, fallback = ''): string {
    return typeof v === 'string' ? v : fallback
}

function num(v: unknown, fallback = 0): number {
    return typeof v === 'number' && Number.isFinite(v) ? v : fallback
}

function bool(v: unknown): boolean {
    return v === true
}

function nullable(v: unknown): string | null {
    return typeof v === 'string' && v.trim() ? v : null
}

function arr(v: unknown): unknown[] {
    return Array.isArray(v) ? v : []
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export function normalizeProfile(raw: unknown): FacultyProfile {
    const r = (raw ?? {}) as Record<string, unknown>
    return {
        first_name: str(r.first_name),
        last_name: str(r.last_name),
        email: str(r.email),
        contact_number: nullable(r.contact_number),
    }
}

// ─── Mentee row (list item) ───────────────────────────────────────────────────

export function normalizeMenteeRow(raw: unknown): MenteeRow {
    const r = (raw ?? {}) as Record<string, unknown>
    const firstName = str(r.first_name)
    const middleName = str(r.middle_name)
    const lastName = str(r.last_name)
    const fullName =
        str(r.full_name) ||
        [firstName, middleName, lastName].filter(Boolean).join(' ')

    return {
        id: num(r.id),
        uid: str(r.uid),
        full_name: fullName,
        photo_url: extractStudentPhotoUrl(r),
        first_name: firstName || undefined,
        middle_name: middleName || undefined,
        last_name: lastName || undefined,
        semester: num(r.semester),
        section: str(r.section) || undefined,
        year_of_admission: typeof r.year_of_admission === 'number' ? r.year_of_admission : undefined,
    }
}

export function normalizeMentees(data: unknown): MenteeRow[] {
    return arr(data).map(normalizeMenteeRow)
}

export function normalizeMenteesPage(data: unknown, limit: number, offset: number): MenteesPage {
    const rows = normalizeMentees(data)
    return {
        rows,
        limit,
        offset,
        isLastPage: rows.length < limit,
    }
}

// ─── Mentee detail ───────────────────────────────────────────────────────────

export function normalizeMenteePayload(raw: unknown): MenteePayload {
    const r = (raw ?? {}) as Record<string, unknown>
    const firstName = str(r.first_name)
    const middleName = str(r.middle_name)
    const lastName = str(r.last_name)
    const fullName =
        str(r.full_name) ||
        [firstName, middleName, lastName].filter(Boolean).join(' ')

    return {
        id: num(r.id),
        uid: str(r.uid),
        full_name: fullName,
        first_name: firstName || undefined,
        middle_name: middleName || undefined,
        last_name: lastName || undefined,
        semester: num(r.semester),
        section: str(r.section) || undefined,
        year_of_admission: typeof r.year_of_admission === 'number' ? r.year_of_admission : undefined,
        personal_info: r.personal_info,
        past_education_records: arr(r.past_education_records),
        post_admission_records: arr(r.post_admission_records),
        projects: arr(r.projects),
        internships: arr(r.internships),
        cocurricular_participations: arr(r.cocurricular_participations),
        cocurricular_organizations: arr(r.cocurricular_organizations),
        career_objective: r.career_objective,
        skills: r.skills,
        swoc: r.swoc,
    }
}

// ─── Mentoring minutes ───────────────────────────────────────────────────────

export function normalizeMinuteRow(raw: unknown): MinuteRow {
    const r = (raw ?? {}) as Record<string, unknown>
    return {
        id: num(r.id),
        semester: num(r.semester),
        date: str(r.date),
        remarks: str(r.remarks),
        suggestion: nullable(r.suggestion as unknown),
        action: nullable(r.action as unknown),
        created_by_faculty: bool(r.created_by_faculty),
    }
}

export function normalizeMenteeMinutes(raw: unknown): MenteeMinutesPayload {
    const r = (raw ?? {}) as Record<string, unknown>
    const s = (r.student ?? {}) as Record<string, unknown>
    return {
        student: {
            uid: str(s.uid) || undefined,
            full_name: str(s.full_name) || undefined,
            semester: typeof s.semester === 'number' ? s.semester : undefined,
            section: str(s.section) || undefined,
            year_of_admission: typeof s.year_of_admission === 'number' ? s.year_of_admission : undefined,
        },
        mentoring_minutes: arr(r.mentoring_minutes).map(normalizeMinuteRow),
    }
}
