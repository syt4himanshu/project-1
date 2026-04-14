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
  normalizeTopper,
} from './normalizers'
import type {
  AdminAllocationApiResponse,
  AdminAllocationEntry,
  AdminAllocationStudent,
  AdminAllocationStudentApiResponse,
  AdminAllocationUpdateInput,
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
  AdminTopper,
  AdminTopperApiResponse,
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
  const [facultyRows, mentees] = await Promise.all([
    listFaculty({ token }),
    getFacultyMentees({ token, facultyId }),
  ])

  const faculty = facultyRows.find((row) => row.id === facultyId)
  if (!faculty) {
    throw new Error('Faculty record not found.')
  }

  return {
    faculty,
    mentees,
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
): Promise<AdminTopper[]> {
  const path = semester
    ? `${ENDPOINTS.admin.reports.toppers}?semester=${encodeURIComponent(String(semester))}`
    : ENDPOINTS.admin.reports.toppers

  const payload = await requestJson<AdminTopperApiResponse[]>(path, {
    method: 'GET',
    token,
  })

  const rows = Array.isArray(payload) ? payload : []
  return rows.map((row, index) => normalizeTopper(row, index + 1))
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
  listAllocation,
  generateAllocation,
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
}
