import type { NormalizedAdminStudentSummaryFilters } from './types'

const ADMIN_QUERY_ROOT = ['admin'] as const
const ADMIN_STUDENTS_ROOT = [...ADMIN_QUERY_ROOT, 'students'] as const
const ADMIN_FACULTY_ROOT = [...ADMIN_QUERY_ROOT, 'faculty'] as const
const ADMIN_ALLOCATION_ROOT = [...ADMIN_QUERY_ROOT, 'allocation'] as const
const ADMIN_REPORTS_ROOT = [...ADMIN_QUERY_ROOT, 'reports'] as const

export const adminQueryKeys = {
  all: ADMIN_QUERY_ROOT,
  statistics: () => [...ADMIN_QUERY_ROOT, 'statistics'] as const,
  users: () => [...ADMIN_QUERY_ROOT, 'users'] as const,
  faculty: () => ADMIN_FACULTY_ROOT,
  facultyDetail: (facultyId: number) => [...ADMIN_FACULTY_ROOT, 'detail', facultyId] as const,
  facultyMentees: (facultyId: number) => [...ADMIN_FACULTY_ROOT, 'mentees', facultyId] as const,
  students: () => ADMIN_STUDENTS_ROOT,
  studentsSummary: (filters: NormalizedAdminStudentSummaryFilters) => [
    ...ADMIN_STUDENTS_ROOT,
    'summary',
    filters,
  ] as const,
  studentDetail: (studentId: number) => [...ADMIN_STUDENTS_ROOT, 'detail', studentId] as const,
  allocation: () => ADMIN_ALLOCATION_ROOT,
  allocationAssigned: (facultyId: number) => [...ADMIN_ALLOCATION_ROOT, 'assigned', facultyId] as const,
  reports: () => ADMIN_REPORTS_ROOT,
  reportStats: () => [...ADMIN_REPORTS_ROOT, 'stats'] as const,
  reportToppers: (semester: number | undefined) => [...ADMIN_REPORTS_ROOT, 'toppers', semester ?? 'all'] as const,
  reportSemesterDistribution: () => [...ADMIN_REPORTS_ROOT, 'semester-distribution'] as const,
  reportBacklogs: () => [...ADMIN_REPORTS_ROOT, 'backlogs'] as const,
  reportGeneral: () => [...ADMIN_REPORTS_ROOT, 'general'] as const,
  reportIncomplete: (year: number | undefined) => [...ADMIN_REPORTS_ROOT, 'incomplete', year ?? 'all'] as const,
}
