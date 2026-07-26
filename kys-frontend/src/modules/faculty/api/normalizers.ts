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

const TEXT_META_MARKER = '\n[[KYS_META]]'
const EXAM_META_MARKER = '[[KYS_META]]'

function safeParseMeta(raw: string): Record<string, unknown> {
    try {
        const parsed = JSON.parse(raw)
        return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : {}
    } catch {
        return {}
    }
}

function unpackTextMeta(value: unknown): { base: string; meta: Record<string, unknown> } {
    const text = typeof value === 'string' ? value : ''
    const markerIndex = text.indexOf(TEXT_META_MARKER)
    if (markerIndex === -1) {
        return { base: text, meta: {} }
    }

    return {
        base: text.slice(0, markerIndex),
        meta: safeParseMeta(text.slice(markerIndex + TEXT_META_MARKER.length)),
    }
}

function unpackExamMeta(value: unknown): { base: string; meta: Record<string, unknown> } {
    const text = typeof value === 'string' ? value : ''
    const markerIndex = text.indexOf(EXAM_META_MARKER)
    if (markerIndex === -1) {
        return { base: text, meta: {} }
    }

    return {
        base: text.slice(0, markerIndex),
        meta: safeParseMeta(text.slice(markerIndex + EXAM_META_MARKER.length)),
    }
}

function normalizePastEducation(records: unknown): unknown[] {
    return arr(records).map((entry) => {
        const r = (entry ?? {}) as Record<string, unknown>
        const unpacked = unpackExamMeta(r.exam_name)
        return {
            ...r,
            exam_name: unpacked.base,
            board: typeof r.board === 'string' && r.board.trim()
                ? r.board
                : typeof unpacked.meta.board === 'string'
                    ? unpacked.meta.board
                    : '',
            exam_type: typeof r.exam_type === 'string' && r.exam_type.trim()
                ? r.exam_type
                : typeof unpacked.meta.exam_type === 'string'
                    ? unpacked.meta.exam_type
                    : '',
        }
    })
}

function normalizePostAdmission(records: unknown): unknown[] {
    return arr(records).map((entry) => {
        const r = (entry ?? {}) as Record<string, unknown>
        const unpacked = unpackTextMeta(r.backlog_subjects)
        const yearOfPassing = r.year_of_passing
        const parsedYear = typeof yearOfPassing === 'number'
            ? yearOfPassing
            : Number.isFinite(Number(yearOfPassing))
                ? Number(yearOfPassing)
                : null
        return {
            ...r,
            backlog_subjects: typeof r.backlog_subjects === 'string' && r.backlog_subjects.trim()
                ? r.backlog_subjects
                : unpacked.base,
            season: typeof r.season === 'string' && r.season.trim()
                ? r.season
                : typeof unpacked.meta.season === 'string'
                    ? unpacked.meta.season
                    : '',
            year_of_passing: parsedYear ?? (
                Number.isFinite(Number(unpacked.meta.year_of_passing))
                    ? Number(unpacked.meta.year_of_passing)
                    : null
            ),
            college_rank: typeof r.college_rank === 'string' && r.college_rank.trim()
                ? r.college_rank
                : typeof unpacked.meta.college_rank === 'string'
                    ? unpacked.meta.college_rank
                    : '',
            academic_awards: typeof r.academic_awards === 'string' && r.academic_awards.trim()
                ? r.academic_awards
                : typeof unpacked.meta.academic_awards === 'string'
                    ? unpacked.meta.academic_awards
                    : '',
        }
    })
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
        past_education_records: normalizePastEducation(r.past_education_records),
        post_admission_records: normalizePostAdmission(r.post_admission_records),
        projects: arr(r.projects),
        internships: arr(r.internships),
        cocurricular_participations: arr(r.cocurricular_participations),
        cocurricular_organizations: arr(r.cocurricular_organizations),
        skill_programs: arr(r.skill_programs ?? r.skillPrograms),
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
