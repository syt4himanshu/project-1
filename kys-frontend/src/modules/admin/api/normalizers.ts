import { isUserRole } from '../../../shared/auth/session'
import type {
  AdminAllocationApiResponse,
  AdminAllocationEntry,
  AdminBacklogEntry,
  AdminBacklogEntryApiResponse,
  AdminAllocationStudent,
  AdminAllocationStudentApiResponse,
  AdminFacultyApiResponse,
  AdminFacultySummary,
  AdminGeneralReportAcademicApiResponse,
  AdminGeneralReportAcademicRow,
  AdminGeneralReportApiResponse,
  AdminGeneralReportFilters,
  AdminGeneralReportRow,
  AdminIncompleteProfile,
  AdminIncompleteProfileApiResponse,
  AdminMenteeApiResponse,
  AdminMenteeSummary,
  AdminMutationResult,
  AdminReportStats,
  AdminReportStatsApiResponse,
  AdminSemesterDistributionApiResponse,
  AdminSemesterDistributionRow,
  AdminStatistics,
  AdminStatisticsApiResponse,
  AdminStudentDetail,
  AdminStudentDetailApiResponse,
  AdminStudentRemark,
  AdminStudentRemarkApiResponse,
  AdminStudentRemarksPaging,
  AdminStudentRemarksPagingApiResponse,
  AdminStudentRemarksApiResponse,
  AdminStudentRemarksResult,
  AdminStudentSummary,
  AdminStudentSummaryApiResponse,
  AdminStudentSummaryFilters,
  AdminTopper,
  AdminTopperRowApiResponse,
  AdminTopperResponseApiResponse,
  AdminTopperResponse,
  AdminUserApiResponse,
  AdminUserRole,
  AdminUserSummary,
  BulkFacultyApiItem,
  BulkFacultyApiResponse,
  BulkOperationResult,
  BulkStudentApiItem,
  BulkStudentApiResponse,
  JsonRecord,
  NormalizedAdminStudentSummaryFilters,
} from './types'
import { sanitizeDisplayValue } from '../../../shared/utils/render'

// --- Internal helpers ---------------------------------------------------------

const EMPTY_TEXT_VALUES = new Set(['', 'n/a', 'na', 'none', '-', '--', 'null', 'undefined'])

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toNullableNumber(value: unknown): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function toText(value: unknown, fallback = ''): string {
  if (typeof value !== 'string') return fallback
  const trimmed = value.trim()
  return trimmed || fallback
}

function normalizeDisplayText(value: unknown, fallback = ''): string {
  const trimmed = toText(value, fallback)
  return EMPTY_TEXT_VALUES.has(trimmed.toLowerCase()) ? fallback : trimmed
}

function normalizeSanitizedText(value: unknown, fallback = ''): string {
  const cleaned = sanitizeDisplayValue(value)
  if (cleaned === '�') return fallback
  return normalizeDisplayText(cleaned, fallback)
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value
    .map((entry) => normalizeDisplayText(entry))
    .filter((entry) => entry !== '')
}

function parseBacklogCountFromSubjects(subjects: string[]): number {
  if (subjects.length === 0) return 0
  const numericCandidate = subjects[0]?.match(/^(\d+)\s*(?:subjects?|backlogs?)$/i)
  if (subjects.length === 1 && numericCandidate) {
    return Number(numericCandidate[1])
  }
  return subjects.length
}

function toRole(value: unknown): AdminUserRole {
  return isUserRole(value) ? value : 'unknown'
}

function splitFullName(name: string): { firstName: string; lastName: string } {
  const clean = normalizeDisplayText(name)
  if (!clean) return { firstName: '', lastName: '' }
  const parts = clean.split(/\s+/)
  if (parts.length === 1) return { firstName: parts[0], lastName: '' }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

function toFacultyUid(id: number): string {
  if (!Number.isFinite(id) || id <= 0) return 'FAC---'
  return `FAC${String(id).padStart(3, '0')}`
}

function asJsonRecord(value: unknown): JsonRecord {
  return isRecord(value) ? value : {}
}

function asJsonRecordArray(value: unknown): JsonRecord[] {
  if (!Array.isArray(value)) return []
  return value.map((entry) => asJsonRecord(entry))
}

function normalizeFilterValue(value: string | undefined): string {
  return (value ?? '').trim()
}

// --- Exported normalizers -----------------------------------------------------

export function normalizeAdminStatistics(raw: AdminStatisticsApiResponse): AdminStatistics {
  return {
    totalUsers: toNumber(raw.totalUsers ?? raw.total_users, 0),
    totalStudents: toNumber(raw.totalStudents ?? raw.total_students, 0),
    totalFaculty: toNumber(raw.totalFaculty ?? raw.totalTeachers ?? raw.total_faculty, 0),
    activeUsers: toNumber(raw.activeUsers ?? raw.active_users, 0),
  }
}

export function normalizeAdminUser(raw: AdminUserApiResponse): AdminUserSummary {
  const id = toNumber(raw.id, 0)
  const username = normalizeDisplayText(raw.username, `user-${id || 'unknown'}`)
  const role = toRole(raw.role)
  const name = normalizeDisplayText(raw.name ?? raw.full_name, username)

  return {
    id,
    username,
    role,
    name,
    photoUrl: normalizeDisplayText(raw.photoUrl) || null,
    photoPreviewUrl: normalizeDisplayText(raw.photoPreviewUrl) || null,
    status: normalizeDisplayText(raw.status, 'Active'),
    createdAt: normalizeDisplayText(raw.createdAt ?? raw.created_at ?? raw.created, '2024-01-01'),
  }
}

export function normalizeAdminFaculty(raw: AdminFacultyApiResponse): AdminFacultySummary {
  const id = toNumber(raw.id, 0)
  const displayName = normalizeDisplayText(raw.name)
  const nameParts = splitFullName(displayName)

  const firstName = normalizeDisplayText(raw.firstName ?? raw.first_name, nameParts.firstName)
  const lastName = normalizeDisplayText(raw.lastName ?? raw.last_name, nameParts.lastName)

  const assignedStudents = asStringArray(raw.studentsAssigned)
  const computedAssignedCount = assignedStudents.length

  return {
    id,
    uid: normalizeDisplayText(raw.uid, toFacultyUid(id)),
    name:
      displayName ||
      [firstName, lastName].filter(Boolean).join(' ') ||
      normalizeDisplayText(raw.email, 'Unknown Faculty'),
    firstName,
    lastName,
    email: normalizeDisplayText(raw.email, 'unknown@stvincentngp.edu.in'),
    contact: normalizeDisplayText(raw.contact ?? raw.contactNumber ?? raw.contact_number, 'Not available'),
    assignedCount: toNumber(raw.assignedCount ?? raw.assigned_count, computedAssignedCount),
    studentsAssigned: assignedStudents,
  }
}

export function normalizeAdminStudentSummary(raw: AdminStudentSummaryApiResponse): AdminStudentSummary {
  return {
    id: toNumber(raw.id, 0),
    uid: normalizeDisplayText(raw.uid, 'UNKNOWN_UID'),
    name: normalizeDisplayText(raw.name ?? raw.full_name, 'Unknown Student'),
    semester: toNullableNumber(raw.semester),
    section: normalizeDisplayText(raw.section, 'N/A'),
    yearOfAdmission: toNullableNumber(raw.yearOfAdmission ?? raw.year_of_admission),
    mentorId: toNullableNumber(raw.mentorId ?? raw.mentor_id),
    mentorName: normalizeDisplayText(raw.mentorName ?? raw.mentor_name, ''),
    careerGoal: normalizeDisplayText(raw.careerGoal ?? raw.career_goal, ''),
    domainOfInterest: normalizeDisplayText(raw.domainOfInterest ?? raw.domain_of_interest, ''),
  }
}

export function normalizeAdminStudentDetail(raw: AdminStudentDetailApiResponse): AdminStudentDetail {
  return {
    id: toNumber(raw.id, 0),
    uid: normalizeDisplayText(raw.uid, 'UNKNOWN_UID'),
    name: normalizeDisplayText(raw.name ?? raw.full_name, 'Unknown Student'),
    semester: toNullableNumber(raw.semester),
    section: normalizeDisplayText(raw.section, 'N/A'),
    yearOfAdmission: toNullableNumber(raw.yearOfAdmission ?? raw.year_of_admission),
    mentorId: toNullableNumber(raw.mentorId ?? raw.mentor_id),
    mentorName: normalizeDisplayText(raw.mentorName ?? raw.mentor_name, ''),
    careerGoal: normalizeDisplayText(raw.careerGoal ?? raw.career_goal, ''),
    domainOfInterest: normalizeDisplayText(raw.domainOfInterest ?? raw.domain_of_interest, ''),
    personalInfo: asJsonRecord(raw.personal_info),
    pastEducation: asJsonRecordArray(raw.past_education ?? raw.past_education_records),
    academicRecords: asJsonRecordArray(raw.academic_records ?? raw.post_admission_records),
    projects: asJsonRecordArray(raw.projects),
    internships: asJsonRecordArray(raw.internships),
    coCurricularParticipations: asJsonRecordArray(
      raw.co_curricular_participations ?? raw.cocurricular_participations,
    ),
    coCurricularOrganizations: asJsonRecordArray(
      raw.co_curricular_organizations ?? raw.cocurricular_organizations,
    ),
    skillPrograms: asJsonRecordArray(raw.skill_programs ?? raw.skillPrograms),
    skills: asJsonRecord(raw.skills),
    swoc: asJsonRecord(raw.swoc),
    careerObjective: asJsonRecord(raw.career_objective),
  }
}

export function normalizeMenteeSummary(raw: AdminMenteeApiResponse): AdminMenteeSummary {
  const rawDates = raw.remarks_dates ?? raw.remarksDates
  const remarksDates: string[] = Array.isArray(rawDates)
    ? rawDates.filter((d): d is string => typeof d === 'string' && Boolean(d))
    : []
  return {
    id: toNumber(raw.id, 0),
    uid: normalizeDisplayText(raw.uid, 'UNKNOWN_UID'),
    fullName: normalizeDisplayText(raw.full_name ?? raw.fullName ?? raw.name, 'Unknown Student'),
    semester: toNullableNumber(raw.semester ?? raw.current_semester ?? raw.currentSemester),
    section: normalizeDisplayText(raw.section ?? raw.class_section ?? raw.classSection, 'N/A'),
    yearOfAdmission: toNullableNumber(raw.year_of_admission ?? raw.yearOfAdmission),
    remarksDates,
  }
}

export function normalizeAllocationEntry(raw: AdminAllocationApiResponse): AdminAllocationEntry {
  return {
    facultyId: toNumber(raw.faculty_id, 0),
    facultyName: normalizeDisplayText(raw.faculty_name, 'Unknown Faculty'),
    email: normalizeDisplayText(raw.email, 'N/A'),
    assignedCount: toNumber(raw.assigned_count, 0),
    capacity: toNumber(raw.capacity, 30),
  }
}

export function normalizeAllocationStudent(raw: AdminAllocationStudentApiResponse): AdminAllocationStudent {
  return {
    id: toNumber(raw.id, 0),
    uid: normalizeDisplayText(raw.uid, 'UNKNOWN_UID'),
    name: normalizeDisplayText(raw.name ?? raw.full_name, 'Unknown Student'),
  }
}

export function normalizeMutationResult(payload: unknown): AdminMutationResult {
  if (isRecord(payload) && typeof payload.message === 'string' && payload.message.trim()) {
    return { message: payload.message }
  }
  return { message: 'Operation completed successfully.' }
}

function normalizeBulkItem(
  raw: { status?: unknown; error?: unknown; uid?: unknown; email?: unknown },
  key: 'uid' | 'email',
) {
  const statusRaw = normalizeDisplayText(raw.status, 'failed').toLowerCase()
  return {
    identifier: normalizeDisplayText(raw[key], key === 'uid' ? 'unknown_uid' : 'unknown_email'),
    status: statusRaw === 'success' ? 'success' : 'failed',
    error: normalizeDisplayText(raw.error) || undefined,
  } as const
}

export function normalizeBulkStudentResult(raw: BulkStudentApiResponse): BulkOperationResult {
  const rowsRaw = Array.isArray(raw.result) ? raw.result : []
  const rows = rowsRaw
    .filter((entry): entry is BulkStudentApiItem => isRecord(entry))
    .map((entry) => normalizeBulkItem(entry, 'uid'))
  return { rows }
}

export function normalizeBulkFacultyResult(raw: BulkFacultyApiResponse): BulkOperationResult {
  const rowsRaw = Array.isArray(raw.result) ? raw.result : []
  const rows = rowsRaw
    .filter((entry): entry is BulkFacultyApiItem => isRecord(entry))
    .map((entry) => normalizeBulkItem(entry, 'email'))
  return { rows }
}

export function normalizeReportStats(raw: AdminReportStatsApiResponse): AdminReportStats {
  return {
    totalStudents: toNumber(raw.total_students, 0),
    averageSgpa: toNumber(raw.avg_sgpa, 0),
    withBacklogs: toNumber(raw.with_backlogs, 0),
    activeSemesters: toNumber(raw.active_semesters, 0),
  }
}

export function normalizeTopper(raw: AdminTopperRowApiResponse, fallbackRank: number): AdminTopper {
  return {
    rank: toNumber(raw.rank, fallbackRank),
    name: normalizeDisplayText(raw.name, 'Unknown Student'),
    uid: normalizeDisplayText(raw.uid, 'UNKNOWN_UID'),
    sgpa: toNumber(raw.sgpa, 0),
    semester: toNullableNumber(raw.semester),
    enrollment_year: toNullableNumber(raw.enrollment_year) ?? undefined,
  }
}

export function normalizeTopperResponse(raw: AdminTopperResponseApiResponse): AdminTopperResponse {
  const toppersRaw = Array.isArray(raw.toppers) ? raw.toppers : []
  const toppers = toppersRaw
    .filter((entry): entry is AdminTopperRowApiResponse => isRecord(entry))
    .map((entry, index) => normalizeTopper(entry, index + 1))

  return {
    semester: toNumber(raw.semester, 1),
    batch_current_sem: toNumber(raw.batch_current_sem, 1),
    is_in_progress: Boolean(raw.is_in_progress),
    current_cycle: (raw.current_cycle === 'even' ? 'even' : 'odd') as 'odd' | 'even',
    toppers,
  }
}

export function normalizeSemesterDistributionRow(
  raw: AdminSemesterDistributionApiResponse,
): AdminSemesterDistributionRow {
  return {
    semester: toNumber(raw.semester, 0),
    count: toNumber(raw.count, 0),
  }
}

function normalizeGeneralReportAcademicRow(
  raw: AdminGeneralReportAcademicApiResponse,
): AdminGeneralReportAcademicRow {
  return {
    semester: toNullableNumber(raw.semester),
    sgpa: toNullableNumber(raw.sgpa),
    backlogs: toNumber(raw.backlogs, 0),
  }
}

export function normalizeGeneralReportRow(raw: AdminGeneralReportApiResponse): AdminGeneralReportRow {
  const academicRowsRaw = Array.isArray(raw.academic_records) ? raw.academic_records : []
  const academicRows = academicRowsRaw
    .filter((row): row is AdminGeneralReportAcademicApiResponse => isRecord(row))
    .map((row) => normalizeGeneralReportAcademicRow(row))

  return {
    id: toNumber(raw.id, 0),
    uid: normalizeDisplayText(raw.uid, 'UNKNOWN_UID'),
    name: normalizeDisplayText(raw.name, 'Unknown Student'),
    semester: toNullableNumber(raw.semester),
    section: normalizeDisplayText(raw.section, 'N/A'),
    yearOfAdmission: toNullableNumber(raw.year_of_admission),
    domainOfInterest: normalizeDisplayText(raw.domain_of_interest),
    careerGoal: normalizeDisplayText(raw.career_goal),
    academicRecords: academicRows,
  }
}

export function normalizeBacklogEntry(raw: AdminBacklogEntryApiResponse): AdminBacklogEntry {
  const subjects = Array.isArray(raw.subjects)
    ? raw.subjects.map((value) => normalizeSanitizedText(value)).filter(Boolean)
    : normalizeSanitizedText(raw.subjects)
      .split(/[,;\n]+/)
      .map((value) => normalizeSanitizedText(value.trim()))
      .filter(Boolean)

  const parsedBacklogCount = toNumber(raw.backlog_count, 0)
  const fallbackCount = parseBacklogCountFromSubjects(subjects)
  const backlogCount = Math.max(parsedBacklogCount, fallbackCount)

  return {
    studentId: toNumber(raw.student_id, 0),
    name: normalizeSanitizedText(raw.name, 'Unknown Student'),
    uid: normalizeSanitizedText(raw.uid, 'UNKNOWN_UID'),
    subjects,
    backlogCount,
  }
}

export function normalizeIncompleteProfile(raw: AdminIncompleteProfileApiResponse): AdminIncompleteProfile {
  const missingFields = Array.isArray(raw.missing_fields)
    ? raw.missing_fields.map((value) => normalizeSanitizedText(value)).filter(Boolean)
    : normalizeSanitizedText(raw.missing_fields)
      .split(/[,;\n]+/)
      .map((value) => normalizeSanitizedText(value.trim()))
      .filter(Boolean)

  return {
    id: toNumber(raw.id, 0),
    name: normalizeSanitizedText(raw.name, 'Unknown Student'),
    uid: normalizeSanitizedText(raw.uid, 'UNKNOWN_UID'),
    yearOfAdmission: toNullableNumber(raw.year_of_admission),
    missingFields,
  }
}

export function normalizeStudentSummaryFilters(
  filters: AdminStudentSummaryFilters = {},
): NormalizedAdminStudentSummaryFilters {
  return {
    search: normalizeFilterValue(filters.search),
    semester: normalizeFilterValue(filters.semester),
    section: normalizeFilterValue(filters.section),
    yearOfAdmission: normalizeFilterValue(filters.yearOfAdmission),
    domain: normalizeFilterValue(filters.domain),
    careerGoal: normalizeFilterValue(filters.careerGoal),
  }
}

export function normalizeGeneralReportFilters(
  filters: Partial<AdminGeneralReportFilters>,
): AdminGeneralReportFilters {
  return {
    search: normalizeFilterValue(filters.search),
    semester: normalizeFilterValue(filters.semester),
    minSgpa: normalizeFilterValue(filters.minSgpa),
    maxSgpa: normalizeFilterValue(filters.maxSgpa),
    minBacklogs: normalizeFilterValue(filters.minBacklogs),
    careerGoal: normalizeFilterValue(filters.careerGoal),
  }
}

export function normalizeForDisplay(value: unknown, fallback = 'N/A'): string {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : fallback
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  const text = normalizeDisplayText(value)
  return text || fallback
}

export function normalizeArrayForDisplay(values: unknown, fallback = 'N/A'): string {
  if (!Array.isArray(values) || values.length === 0) return fallback
  const tokens = values.map((value) => normalizeDisplayText(value)).filter((value) => value)
  return tokens.length > 0 ? tokens.join(', ') : fallback
}

// --- Student Remarks Timeline -------------------------------------------------

export function normalizeAdminStudentRemark(
  raw: AdminStudentRemarkApiResponse,
  index: number,
): AdminStudentRemark {
  return {
    id: toNumber(raw.id, index),
    studentId: toNumber(raw.student_id, 0),
    facultyId: toNullableNumber(raw.faculty_id),
    facultyName: normalizeDisplayText(raw.faculty_name, 'Unknown'),
    facultyEmail: normalizeDisplayText(raw.faculty_email, 'Unknown'),
    semester: toNumber(raw.semester, 0),
    date: toText(raw.date) || null,
    remarks: toText(raw.remarks) || null,
    mentorRemarks: toText(raw.mentor_remarks) || null,
    issues: toText(raw.issues) || null,
    suggestion: toText(raw.suggestion) || null,
    action: toText(raw.action) || null,
    createdByFaculty: Boolean(raw.created_by_faculty),
  }
}

export function normalizeAdminStudentRemarksPaging(
  raw: AdminStudentRemarksPagingApiResponse,
): AdminStudentRemarksPaging {
  return {
    total: toNumber(raw.total, 0),
    limit: toNumber(raw.limit, 20),
    offset: toNumber(raw.offset, 0),
    hasMore: Boolean(raw.hasMore),
  }
}

export function normalizeAdminStudentRemarksResult(
  raw: AdminStudentRemarksApiResponse,
): AdminStudentRemarksResult {
  const remarksRaw = Array.isArray(raw.remarks) ? raw.remarks : []
  const remarks = remarksRaw
    .filter((entry): entry is AdminStudentRemarkApiResponse => isRecord(entry))
    .map((entry, i) => normalizeAdminStudentRemark(entry, i + 1))

  const pagingRaw = isRecord(raw.paging) ? raw.paging : {}
  const paging = normalizeAdminStudentRemarksPaging(pagingRaw)

  return { remarks, paging }
}

