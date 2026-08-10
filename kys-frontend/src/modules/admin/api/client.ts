import { ENDPOINTS } from '../../../shared/api/endpointRegistry'
import { requestBlob, requestJson } from '../../../shared/api/httpClient'
import {
  normalizeAdminFaculty,
  normalizeAdminStatistics,
  normalizeAdminStudentDetail,
  normalizeAdminStudentSummary,
  normalizeAdminUser,
  normalizeAllocationEntry,
  normalizeAllocationStudent,
  normalizeBacklogEntry,
  normalizeBulkFacultyResult,
  normalizeBulkStudentResult,
  normalizeGeneralReportRow,
  normalizeIncompleteProfile,
  normalizeMenteeSummary,
  normalizeMutationResult,
  normalizeReportStats,
  normalizeSemesterDistributionRow,
  normalizeStudentSummaryFilters,
  normalizeTopperResponse,
  normalizeAdminStudentRemarksResult,
} from './normalizers'
import type {
  AdminAllocationApiResponse,
  AdminAllocationEntry,
  AdminAllocationStudent,
  AdminAllocationStudentApiResponse,
  AdminAllocationUpdateInput,
  AdminAutoAllocationResult,
  AdminAutoAllocationSummaryItem,
  AdminBacklogEntry,
  AdminBacklogEntryApiResponse,
  AdminExportedFile,
  AdminFacultyApiResponse,
  AdminFacultyDetail,
  AdminFacultySummary,
  AdminGeneralReportApiResponse,
  AdminGeneralReportRow,
  AdminIncompleteProfile,
  AdminIncompleteProfileApiResponse,
  AdminMenteeApiResponse,
  AdminMutationResult,
  AdminReportStats,
  AdminReportStatsApiResponse,
  AdminSemesterDistributionApiResponse,
  AdminSemesterDistributionRow,
  AdminStatistics,
  AdminStatisticsApiResponse,
  AdminStudentDetail,
  AdminStudentDetailApiResponse,
  AdminStudentSummary,
  AdminStudentSummaryApiResponse,
  AdminStudentSummaryFilters,
  AdminTopperResponse,
  AdminTopperResponseApiResponse,
  AdminUserApiResponse,
  AdminUserSummary,
  BulkFacultyApiResponse,
  BulkFacultyRowInput,
  BulkOperationResult,
  BulkStudentApiResponse,
  BulkStudentRowInput,
  CreateAdminUserInput,
  NormalizedAdminStudentSummaryFilters,
  ResetPasswordInput,
  AdminStudentRemarksApiResponse,
  AdminStudentRemarksResult,
} from './types'

interface AdminApiRequestOptions {
  token: string
}

function buildStudentSummaryQuery(filters: NormalizedAdminStudentSummaryFilters): string {
  const params = new URLSearchParams({ view: 'summary' })

  if (filters.search) params.set('search', filters.search)
  if (filters.semester) params.set('semester', filters.semester)
  if (filters.section) params.set('section', filters.section)
  if (filters.yearOfAdmission) params.set('year_of_admission', filters.yearOfAdmission)
  if (filters.domain) params.set('domain', filters.domain)
  if (filters.careerGoal) params.set('careerGoal', filters.careerGoal)

  return params.toString()
}

function parseFilename(contentDisposition: string | null, fallback: string): string {
  if (!contentDisposition) return fallback

  const plainMatch = contentDisposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i)
  if (!plainMatch) return fallback

  try {
    return decodeURIComponent(plainMatch[1])
  } catch {
    return plainMatch[1]
  }
}

async function getStatistics({ token }: AdminApiRequestOptions): Promise<AdminStatistics> {
  const payload = await requestJson<AdminStatisticsApiResponse>(ENDPOINTS.admin.statistics, {
    method: 'GET',
    token,
  })

  return normalizeAdminStatistics(payload)
}

async function listUsers({ token }: AdminApiRequestOptions): Promise<AdminUserSummary[]> {
  const payload = await requestJson<AdminUserApiResponse[]>(ENDPOINTS.admin.users, {
    method: 'GET',
    token,
  })

  const rows = Array.isArray(payload) ? payload : []
  return rows.map((row) => normalizeAdminUser(row))
}

async function createUser({ token, payload }: AdminApiRequestOptions & { payload: CreateAdminUserInput }): Promise<AdminMutationResult> {
  const result = await requestJson<unknown>(ENDPOINTS.admin.users, {
    method: 'POST',
    token,
    body: payload,
  })

  return normalizeMutationResult(result)
}

async function deleteUser({ token, userId }: AdminApiRequestOptions & { userId: number }): Promise<AdminMutationResult> {
  const result = await requestJson<unknown>(`${ENDPOINTS.admin.users}/${userId}`, {
    method: 'DELETE',
    token,
  })

  return normalizeMutationResult(result)
}

async function resetPassword({ token, payload }: AdminApiRequestOptions & { payload: ResetPasswordInput }): Promise<AdminMutationResult> {
  const result = await requestJson<unknown>(ENDPOINTS.admin.resetPassword, {
    method: 'POST',
    token,
    body: payload,
  })

  return normalizeMutationResult(result)
}

async function bulkRegisterStudents(
  { token, rows }: AdminApiRequestOptions & { rows: BulkStudentRowInput[] },
): Promise<BulkOperationResult> {
  const result = await requestJson<BulkStudentApiResponse>(ENDPOINTS.auth.registerBulkStudents, {
    method: 'POST',
    token,
    body: rows,
  })

  return normalizeBulkStudentResult(result)
}

async function bulkRegisterFaculty(
  { token, rows }: AdminApiRequestOptions & { rows: BulkFacultyRowInput[] },
): Promise<BulkOperationResult> {
  const result = await requestJson<BulkFacultyApiResponse>(ENDPOINTS.auth.registerBulkFaculty, {
    method: 'POST',
    token,
    body: rows,
  })

  return normalizeBulkFacultyResult(result)
}

async function listFaculty({ token }: AdminApiRequestOptions): Promise<AdminFacultySummary[]> {
  const payload = await requestJson<AdminFacultyApiResponse[]>(ENDPOINTS.admin.faculty, {
    method: 'GET',
    token,
  })

  const rows = Array.isArray(payload) ? payload : []
  return rows.map((row) => normalizeAdminFaculty(row))
}

async function getFacultyMentees({ token, facultyId }: AdminApiRequestOptions & { facultyId: number }) {
  const payload = await requestJson<AdminMenteeApiResponse[]>(`${ENDPOINTS.admin.faculty}/${facultyId}/mentees`, {
    method: 'GET',
    token,
  })

  const rows = Array.isArray(payload) ? payload : []
  return rows.map((row) => normalizeMenteeSummary(row))
}

async function getFacultyDetail({ token, facultyId }: AdminApiRequestOptions & { facultyId: number }): Promise<AdminFacultyDetail> {
  const [facultyRows, mentees, studentSummaries] = await Promise.all([
    listFaculty({ token }),
    getFacultyMentees({ token, facultyId }),
    listStudentSummaries({ token }),
  ])

  const faculty = facultyRows.find((row) => row.id === facultyId)
  if (!faculty) {
    throw new Error('Faculty record not found.')
  }

  const summarizedMentees = studentSummaries
    .filter((row) => row.mentorId === facultyId)
    .map((row) => ({
      id: row.id,
      uid: row.uid,
      fullName: row.name,
      semester: row.semester,
      section: row.section,
      yearOfAdmission: row.yearOfAdmission,
    }))

  const summaryById = new Map(studentSummaries.map((row) => [row.id, row]))
  const summaryByUid = new Map(studentSummaries.map((row) => [row.uid, row]))
  const detailById = new Map<number, AdminStudentDetail>()

  await Promise.all(
    mentees.map(async (mentee) => {
      if (!mentee.id) return
      try {
        const detail = await getStudentDetail({ token, studentId: mentee.id })
        detailById.set(mentee.id, detail)
      } catch {
        // Keep rendering from summary/mentee data if a single detail fetch fails.
      }
    }),
  )

  // Build a lookup for remarksDates from the /mentees endpoint response
  // (summarizedMentees is built from studentSummaries which never carries this field)
  const remarksDatesById = new Map(mentees.map((m) => [m.id, m.remarksDates ?? []]))
  const remarksDatesByUid = new Map(mentees.map((m) => [m.uid, m.remarksDates ?? []]))

  const menteeBase = summarizedMentees.length > 0 ? summarizedMentees : mentees
  const mergedMentees = menteeBase.map((mentee) => {
    const fallback = summaryById.get(mentee.id) ?? summaryByUid.get(mentee.uid)
    const detailed = mentee.id ? detailById.get(mentee.id) : undefined
    const remarksDates =
      remarksDatesById.get(mentee.id) ?? remarksDatesByUid.get(mentee.uid) ?? []
    return {
      ...mentee,
      semester: detailed?.semester ?? mentee.semester ?? fallback?.semester ?? null,
      section: mentee.section || fallback?.section || 'N/A',
      yearOfAdmission: detailed?.yearOfAdmission ?? mentee.yearOfAdmission ?? fallback?.yearOfAdmission ?? null,
      remarksDates,
    }
  })

  return {
    faculty,
    mentees: mergedMentees,
  }
}

interface ListStudentSummariesOptions extends AdminApiRequestOptions {
  filters?: AdminStudentSummaryFilters
}

async function listStudentSummaries({ token, filters = {} }: ListStudentSummariesOptions): Promise<AdminStudentSummary[]> {
  const normalizedFilters = normalizeStudentSummaryFilters(filters)
  const query = buildStudentSummaryQuery(normalizedFilters)

  const payload = await requestJson<AdminStudentSummaryApiResponse[]>(`${ENDPOINTS.students.search}?${query}`, {
    method: 'GET',
    token,
  })

  const rows = Array.isArray(payload) ? payload : []
  return rows.map((row) => normalizeAdminStudentSummary(row))
}

async function getStudentDetail({ token, studentId }: AdminApiRequestOptions & { studentId: number }): Promise<AdminStudentDetail> {
  const payload = await requestJson<AdminStudentDetailApiResponse>(`${ENDPOINTS.students.search}/${studentId}`, {
    method: 'GET',
    token,
  })

  return normalizeAdminStudentDetail(payload)
}

async function uploadStudentPhoto(
  { token, studentId, file }: AdminApiRequestOptions & { studentId: number; file: File },
): Promise<AdminMutationResult> {
  const formData = new FormData()
  formData.append('photo', file)

  const result = await requestJson<unknown>(ENDPOINTS.students.uploadPhoto(studentId), {
    method: 'POST',
    token,
    body: formData,
  })

  return normalizeMutationResult(result)
}

export interface AdminMentoringMinute {
  id: number
  faculty_email: string | null
  faculty_name: string
  semester: number
  date: string
  remarks: string
  suggestion?: string | null
  action?: string | null
}

async function getStudentMentoringMinutes({ token, studentId }: AdminApiRequestOptions & { studentId: number }): Promise<AdminMentoringMinute[]> {
  const payload = await requestJson<AdminMentoringMinute[]>(ENDPOINTS.students.studentMentoringMinutes(studentId), {
    method: 'GET',
    token,
  })

  return Array.isArray(payload) ? payload : []
}

async function listAllocation({ token }: AdminApiRequestOptions): Promise<AdminAllocationEntry[]> {
  const payload = await requestJson<AdminAllocationApiResponse[]>(ENDPOINTS.admin.allocation, {
    method: 'GET',
    token,
  })

  const rows = Array.isArray(payload) ? payload : []
  return rows.map((row) => normalizeAllocationEntry(row))
}

async function generateAllocation(
  { token, facultyId }: AdminApiRequestOptions & { facultyId: number },
): Promise<AdminAllocationStudent[]> {
  const payload = await requestJson<AdminAllocationStudentApiResponse[]>(`${ENDPOINTS.admin.allocation}/generate`, {
    method: 'POST',
    token,
    body: { faculty_id: facultyId },
  })

  const rows = Array.isArray(payload) ? payload : []
  return rows.map((row) => normalizeAllocationStudent(row))
}

async function autoAllocateUnassigned(
  { token, preview }: AdminApiRequestOptions & { preview?: boolean },
): Promise<AdminAutoAllocationResult> {
  const payload = await requestJson<Record<string, unknown>>(`${ENDPOINTS.admin.allocation}/auto-assign`, {
    method: 'POST',
    token,
    body: { preview: Boolean(preview) },
  })

  const rawAllocations = Array.isArray(payload.allocations) ? payload.allocations : []
  const rawAllFaculty = Array.isArray(payload.all_faculty) ? payload.all_faculty : []

  const normalizeItem = (item: Record<string, unknown>): AdminAutoAllocationSummaryItem => ({
    facultyId: Number(item.faculty_id || 0),
    facultyName: String(item.faculty_name || ''),
    email: String(item.email || ''),
    initialCount: Number(item.initial_count || 0),
    newAssignedCount: Number(item.new_assigned_count || 0),
    finalCount: Number(item.final_count || 0),
    capacity: Number(item.capacity || 30),
    studentIds: Array.isArray(item.student_ids) ? item.student_ids.map(Number) : [],
    students: Array.isArray(item.students)
      ? item.students.map((s) => normalizeAllocationStudent(s as Record<string, unknown>))
      : [],
  })

  return {
    message: String(payload.message || ''),
    unassignedCount: Number(payload.unassigned_count || 0),
    distributedCount: Number(payload.distributed_count || 0),
    allocations: rawAllocations.map((item) => normalizeItem(item as Record<string, unknown>)),
    allFaculty: rawAllFaculty.map((item) => normalizeItem(item as Record<string, unknown>)),
  }
}

async function confirmAllocation(
  { token, payload }: AdminApiRequestOptions & { payload: AdminAllocationUpdateInput },
): Promise<AdminMutationResult> {
  const result = await requestJson<unknown>(`${ENDPOINTS.admin.allocation}/confirm`, {
    method: 'POST',
    token,
    body: {
      faculty_id: payload.facultyId,
      student_ids: payload.studentIds,
    },
  })

  return normalizeMutationResult(result)
}

async function removeAllocation(
  { token, payload }: AdminApiRequestOptions & { payload: AdminAllocationUpdateInput },
): Promise<AdminMutationResult> {
  const result = await requestJson<unknown>(`${ENDPOINTS.admin.allocation}/remove`, {
    method: 'POST',
    token,
    body: {
      faculty_id: payload.facultyId,
      student_ids: payload.studentIds,
    },
  })

  return normalizeMutationResult(result)
}

async function listAssignedStudents({ token, facultyId }: AdminApiRequestOptions & { facultyId: number }) {
  const payload = await requestJson<AdminAllocationStudentApiResponse[]>(`${ENDPOINTS.admin.allocation}/${facultyId}/students`, {
    method: 'GET',
    token,
  })

  const rows = Array.isArray(payload) ? payload : []
  return rows.map((row) => normalizeAllocationStudent(row))
}

async function getReportStats({ token }: AdminApiRequestOptions): Promise<AdminReportStats> {
  const payload = await requestJson<AdminReportStatsApiResponse>(ENDPOINTS.admin.reports.stats, {
    method: 'GET',
    token,
  })

  return normalizeReportStats(payload)
}

async function listReportToppers(
  { token, semester }: AdminApiRequestOptions & { semester?: number },
): Promise<AdminTopperResponse> {
  const path = semester
    ? `${ENDPOINTS.admin.reports.toppers}?semester=${encodeURIComponent(String(semester))}`
    : ENDPOINTS.admin.reports.toppers

  const payload = await requestJson<AdminTopperResponseApiResponse>(path, {
    method: 'GET',
    token,
  })

  return normalizeTopperResponse(payload)
}

async function listSemesterDistribution({ token }: AdminApiRequestOptions): Promise<AdminSemesterDistributionRow[]> {
  const payload = await requestJson<AdminSemesterDistributionApiResponse[]>(ENDPOINTS.admin.reports.semesterDistribution, {
    method: 'GET',
    token,
  })

  const rows = Array.isArray(payload) ? payload : []
  return rows
    .map((row) => normalizeSemesterDistributionRow(row))
    .filter((row) => row.semester > 0)
}

async function listBacklogs({ token }: AdminApiRequestOptions): Promise<AdminBacklogEntry[]> {
  const payload = await requestJson<AdminBacklogEntryApiResponse[]>(ENDPOINTS.admin.reports.backlogs, {
    method: 'GET',
    token,
  })

  const rows = Array.isArray(payload) ? payload : []
  return rows.map((row) => normalizeBacklogEntry(row))
}

async function listGeneralReport({ token }: AdminApiRequestOptions): Promise<AdminGeneralReportRow[]> {
  const payload = await requestJson<AdminGeneralReportApiResponse[]>(ENDPOINTS.admin.reports.general, {
    method: 'GET',
    token,
  })

  const rows = Array.isArray(payload) ? payload : []
  return rows.map((row) => normalizeGeneralReportRow(row))
}

async function listIncompleteProfiles(
  { token, year }: AdminApiRequestOptions & { year?: number },
): Promise<AdminIncompleteProfile[]> {
  const path = year
    ? `${ENDPOINTS.admin.reports.incomplete}?year=${encodeURIComponent(String(year))}`
    : ENDPOINTS.admin.reports.incomplete

  const payload = await requestJson<AdminIncompleteProfileApiResponse[]>(path, {
    method: 'GET',
    token,
  })

  const rows = Array.isArray(payload) ? payload : []
  return rows.map((row) => normalizeIncompleteProfile(row))
}

async function exportCsv(
  { token, path, fallbackFilename }: AdminApiRequestOptions & { path: string; fallbackFilename: string },
): Promise<AdminExportedFile> {
  const result = await requestBlob(path, {
    method: 'GET',
    token,
  })

  return {
    blob: result.blob,
    filename: parseFilename(result.headers.get('content-disposition'), fallbackFilename),
  }
}

async function exportAllReports({ token }: AdminApiRequestOptions): Promise<AdminExportedFile> {
  return exportCsv({
    token,
    path: ENDPOINTS.admin.reports.exportAll,
    fallbackFilename: 'all-students.csv',
  })
}

// ─── Student Remarks Timeline ─────────────────────────────────────────────────

async function getStudentRemarks(
  { token, uid, limit = 20, offset = 0 }: AdminApiRequestOptions & { uid: string; limit?: number; offset?: number },
): Promise<AdminStudentRemarksResult> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })

  const payload = await requestJson<AdminStudentRemarksApiResponse>(
    `${ENDPOINTS.admin.studentRemarks(uid)}?${params.toString()}`,
    { method: 'GET', token },
  )

  return normalizeAdminStudentRemarksResult(
    (payload as AdminStudentRemarksApiResponse) ?? {},
  )
}

async function exportBacklogReports({ token }: AdminApiRequestOptions): Promise<AdminExportedFile> {
  return exportCsv({
    token,
    path: ENDPOINTS.admin.reports.exportBacklogs,
    fallbackFilename: 'backlogs.csv',
  })
}

async function exportIncompleteReports(
  { token, year }: AdminApiRequestOptions & { year?: number },
): Promise<AdminExportedFile> {
  const path = year
    ? `${ENDPOINTS.admin.reports.exportIncomplete}?year=${encodeURIComponent(String(year))}`
    : ENDPOINTS.admin.reports.exportIncomplete

  return exportCsv({
    token,
    path,
    fallbackFilename: 'incomplete-profiles.csv',
  })
}

export const adminApi = {
  getStatistics,
  listUsers,
  createUser,
  deleteUser,
  resetPassword,
  bulkRegisterStudents,
  bulkRegisterFaculty,
  listFaculty,
  getFacultyDetail,
  getFacultyMentees,
  listStudentSummaries,
  getStudentDetail,
  uploadStudentPhoto,
  getStudentMentoringMinutes,
  listAllocation,
  generateAllocation,
  autoAllocateUnassigned,
  confirmAllocation,
  removeAllocation,
  listAssignedStudents,
  getReportStats,
  listReportToppers,
  listSemesterDistribution,
  listBacklogs,
  listGeneralReport,
  listIncompleteProfiles,
  exportAllReports,
  exportBacklogReports,
  exportIncompleteReports,
  getStudentRemarks,
}
