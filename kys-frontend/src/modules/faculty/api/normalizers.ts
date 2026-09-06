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
import { extractStudentPhotoUrl, extractStudentPhotoPreviewUrl } from '../../../shared/utils/studentPhoto'

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

function normalizeInternships(records: unknown): unknown[] {
    return arr(records).map((entry) => {
        const r = (entry ?? {}) as Record<string, unknown>
        const company = unpackTextMeta(r.company_name)
        const domain = unpackTextMeta(r.domain)
        return {
            ...r,
            company_name: company.base || (typeof r.company_name === 'string' ? r.company_name : ''),
            designation: typeof r.designation === 'string' && r.designation.trim()
                ? r.designation
                : typeof company.meta.designation === 'string'
                    ? company.meta.designation
                    : '',
            domain: domain.base || (typeof r.domain === 'string' ? r.domain : ''),
            description: typeof r.description === 'string' && r.description.trim()
                ? r.description
                : typeof domain.meta.description === 'string'
                    ? domain.meta.description
                    : '',
        }
    })
}

function normalizeCareerObjective(raw: unknown): unknown {
    if (!raw || typeof raw !== 'object') return raw
    const r = raw as Record<string, unknown>
    const unpacked = unpackTextMeta(r.campus_placement_reasons)
    return {
        ...r,
        campus_placement_reasons: unpacked.base,
        non_technical_areas: typeof r.non_technical_areas === 'string' && r.non_technical_areas.trim()
            ? r.non_technical_areas
            : typeof unpacked.meta.non_technical_areas === 'string'
                ? unpacked.meta.non_technical_areas
                : '',
        student_mentor_interest: typeof r.student_mentor_interest === 'string' && r.student_mentor_interest.trim()
            ? r.student_mentor_interest
            : typeof unpacked.meta.student_mentor_interest === 'string'
                ? unpacked.meta.student_mentor_interest
                : '',
        expectations_from_institute: typeof r.expectations_from_institute === 'string' && r.expectations_from_institute.trim()
            ? r.expectations_from_institute
            : typeof unpacked.meta.expectations_from_institute === 'string'
                ? unpacked.meta.expectations_from_institute
                : '',
    }
}

function normalizeSkillsBundle(rawSkills: unknown, rawPrograms: unknown): {
    skills: unknown
    skill_programs: unknown[]
} {
    if (!rawSkills || typeof rawSkills !== 'object') {
        return {
            skills: rawSkills,
            skill_programs: arr(rawPrograms),
        }
    }

    const r = rawSkills as Record<string, unknown>
    const unpacked = unpackTextMeta(r.familiar_tools_platforms)
    const embeddedPrograms = Array.isArray(unpacked.meta.skill_programs)
        ? unpacked.meta.skill_programs
        : []
    const explicitPrograms = arr(rawPrograms)

    return {
        skills: {
            ...r,
            familiar_tools_platforms: unpacked.base,
            technical_soft_skills_overall: typeof r.technical_soft_skills_overall === 'string' && r.technical_soft_skills_overall.trim()
                ? r.technical_soft_skills_overall
                : typeof unpacked.meta.technical_soft_skills_overall === 'string'
                    ? unpacked.meta.technical_soft_skills_overall
                    : '',
            additional_technical_skills: typeof r.additional_technical_skills === 'string' && r.additional_technical_skills.trim()
                ? r.additional_technical_skills
                : typeof unpacked.meta.additional_technical_skills === 'string'
                    ? unpacked.meta.additional_technical_skills
                    : '',
            additional_soft_skills: typeof r.additional_soft_skills === 'string' && r.additional_soft_skills.trim()
                ? r.additional_soft_skills
                : typeof unpacked.meta.additional_soft_skills === 'string'
                    ? unpacked.meta.additional_soft_skills
                    : '',
        },
        skill_programs: explicitPrograms.length > 0 ? explicitPrograms : embeddedPrograms,
    }
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
        
    const personalInfo = (r.personal_info as Record<string, unknown>) || {}
    const mobileNo = str(personalInfo.mobile_no) || str(personalInfo.mobile) || str(personalInfo.mobile_number) || str(r.mobile_no) || undefined

    return {
        id: num(r.id),
        uid: str(r.uid),
        full_name: fullName,
        photo_url: extractStudentPhotoUrl(r),
        photo_preview_url: extractStudentPhotoPreviewUrl(r),
        first_name: firstName || undefined,
        middle_name: middleName || undefined,
        last_name: lastName || undefined,
        semester: num(r.semester),
        section: str(r.section) || undefined,
        mobile_no: mobileNo,
        year_of_admission: typeof r.year_of_admission === 'number' ? r.year_of_admission : undefined,
        is_profile_locked: bool(r.is_profile_locked),
        profile_locked_at: nullable(r.profile_locked_at),
        profile_locked_by: typeof r.profile_locked_by === 'number' ? r.profile_locked_by : null,
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

    const skillsBundle = normalizeSkillsBundle(r.skills, r.skill_programs ?? r.skillPrograms)
    const pastEducation = normalizePastEducation(r.past_education_records)

    let admissionType = typeof r.admission_type === 'string' ? r.admission_type : ''
    if (!admissionType) {
        admissionType = pastEducation.some((record) => (record as Record<string, unknown>).exam_name === 'DIPLOMA')
            ? 'diploma'
            : pastEducation.some((record) => {
                const name = (record as Record<string, unknown>).exam_name
                return name === 'HSSC' || name === 'ENTRANCE_EXAM'
            })
                ? 'hsc'
                : ''
    }

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
        is_profile_locked: bool(r.is_profile_locked),
        profile_locked_at: nullable(r.profile_locked_at),
        profile_locked_by: typeof r.profile_locked_by === 'number' ? r.profile_locked_by : null,
        personal_info: r.personal_info,
        past_education_records: pastEducation,
        post_admission_records: normalizePostAdmission(r.post_admission_records),
        projects: arr(r.projects),
        internships: normalizeInternships(r.internships),
        cocurricular_participations: arr(r.cocurricular_participations),
        cocurricular_organizations: arr(r.cocurricular_organizations),
        skill_programs: skillsBundle.skill_programs,
        career_objective: normalizeCareerObjective(r.career_objective),
        skills: skillsBundle.skills,
        swoc: r.swoc,
        admission_type: admissionType || undefined,
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
        mentor_remarks: nullable(r.mentor_remarks as unknown) as string | null,
        issues: nullable(r.issues as unknown) as string | null,
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
