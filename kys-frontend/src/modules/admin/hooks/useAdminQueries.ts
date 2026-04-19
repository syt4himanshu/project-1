import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../app/providers/auth-context'
import { useToast } from '../../../app/providers/toast-context'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { adminApi } from '../api/client'
import { normalizeStudentSummaryFilters } from '../api/normalizers'
import { adminQueryKeys } from '../api/queryKeys'
import type {
  AdminAllocationUpdateInput,
  AdminStatistics,
  AdminStudentSummaryFilters,
  AdminUserSummary,
  BulkFacultyRowInput,
  BulkStudentRowInput,
  CreateAdminUserInput,
  ResetPasswordInput,
} from '../api/types'

function ensureToken(token: string | null): string {
  if (!token) {
    throw new Error('Missing authentication token. Please sign in again.')
  }

  return token
}

function applyStatsDelta(stats: AdminStatistics | undefined, user: AdminUserSummary | undefined, delta: 1 | -1): AdminStatistics | undefined {
  if (!stats || !user) return stats

  const next: AdminStatistics = {
    ...stats,
    totalUsers: Math.max(0, stats.totalUsers + delta),
    totalStudents: stats.totalStudents,
    totalFaculty: stats.totalFaculty,
    activeUsers: Math.max(0, stats.activeUsers + delta),
  }

  if (user.role === 'student') {
    next.totalStudents = Math.max(0, next.totalStudents + delta)
  }

  if (user.role === 'faculty') {
    next.totalFaculty = Math.max(0, next.totalFaculty + delta)
  }

  return next
}

export function useAdminStatisticsQuery() {
  const { token } = useAuth()

  return useQuery({
    queryKey: adminQueryKeys.statistics(),
    queryFn: () => adminApi.getStatistics({ token: ensureToken(token) }),
    enabled: Boolean(token),
    staleTime: 20_000,
  })
}

export function useAdminUsersQuery() {
  const { token } = useAuth()

  return useQuery({
    queryKey: adminQueryKeys.users(),
    queryFn: () => adminApi.listUsers({ token: ensureToken(token) }),
    enabled: Boolean(token),
    staleTime: 60_000,
  })
}

export function useCreateAdminUserMutation() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationKey: ['admin', 'mutation', 'create-user'],
    scope: { id: 'admin-user-writes' },
    mutationFn: (payload: CreateAdminUserInput) => adminApi.createUser({ token: ensureToken(token), payload }),
    onSuccess: async (result, payload) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.statistics() }),
      ])

      if (payload.role === 'student') {
        await queryClient.invalidateQueries({ queryKey: adminQueryKeys.students() })
      }

      if (payload.role === 'faculty') {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: adminQueryKeys.faculty() }),
          queryClient.invalidateQueries({ queryKey: adminQueryKeys.allocation() }),
        ])
      }

      toast.success(result.message)
    },
    onError: (error) => {
      toast.error(toApiErrorMessage(error, 'Unable to create user.'))
    },
  })
}

export function useDeleteAdminUserMutation() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationKey: ['admin', 'mutation', 'delete-user'],
    scope: { id: 'admin-user-writes' },
    mutationFn: ({ userId }: { userId: number }) => adminApi.deleteUser({ token: ensureToken(token), userId }),
    onMutate: async ({ userId }) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: adminQueryKeys.users() }),
        queryClient.cancelQueries({ queryKey: adminQueryKeys.statistics() }),
      ])

      const previousUsers = queryClient.getQueryData<AdminUserSummary[]>(adminQueryKeys.users())
      const previousStats = queryClient.getQueryData<AdminStatistics>(adminQueryKeys.statistics())

      const removedUser = previousUsers?.find((row) => row.id === userId)
      if (previousUsers) {
        queryClient.setQueryData<AdminUserSummary[]>(
          adminQueryKeys.users(),
          previousUsers.filter((row) => row.id !== userId),
        )
      }

      if (previousStats && removedUser) {
        queryClient.setQueryData<AdminStatistics>(
          adminQueryKeys.statistics(),
          applyStatsDelta(previousStats, removedUser, -1),
        )
      }

      return {
        previousUsers,
        previousStats,
      }
    },
    onError: (error, _variables, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(adminQueryKeys.users(), context.previousUsers)
      }

      if (context?.previousStats) {
        queryClient.setQueryData(adminQueryKeys.statistics(), context.previousStats)
      }

      toast.error(toApiErrorMessage(error, 'Unable to delete user.'))
    },
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.statistics() }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.faculty() }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.students() }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.allocation() }),
      ])

      toast.success(result.message)
    },
  })
}

export function useResetPasswordMutation() {
  const { token } = useAuth()
  const toast = useToast()

  return useMutation({
    mutationKey: ['admin', 'mutation', 'reset-password'],
    scope: { id: 'admin-user-writes' },
    mutationFn: (payload: ResetPasswordInput) => adminApi.resetPassword({ token: ensureToken(token), payload }),
    onSuccess: (result) => {
      toast.success(result.message)
    },
    onError: (error) => {
      toast.error(toApiErrorMessage(error, 'Unable to reset password.'))
    },
  })
}

export function useBulkRegisterStudentsMutation() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationKey: ['admin', 'mutation', 'bulk-register-students'],
    scope: { id: 'admin-user-writes' },
    mutationFn: (rows: BulkStudentRowInput[]) => adminApi.bulkRegisterStudents({ token: ensureToken(token), rows }),
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.statistics() }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.students() }),
      ])

      const successCount = result.rows.filter((row) => row.status === 'success').length
      const failedCount = result.rows.length - successCount

      if (failedCount === 0) {
        toast.success(`Bulk student upload complete. ${successCount} rows succeeded.`)
      } else {
        toast.info(`Bulk student upload finished: ${successCount} succeeded, ${failedCount} failed.`)
      }
    },
    onError: (error) => {
      toast.error(toApiErrorMessage(error, 'Bulk student upload failed.'))
    },
  })
}

export function useBulkRegisterFacultyMutation() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationKey: ['admin', 'mutation', 'bulk-register-faculty'],
    scope: { id: 'admin-user-writes' },
    mutationFn: (rows: BulkFacultyRowInput[]) => adminApi.bulkRegisterFaculty({ token: ensureToken(token), rows }),
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.statistics() }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.faculty() }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.allocation() }),
      ])

      const successCount = result.rows.filter((row) => row.status === 'success').length
      const failedCount = result.rows.length - successCount

      if (failedCount === 0) {
        toast.success(`Bulk faculty upload complete. ${successCount} rows succeeded.`)
      } else {
        toast.info(`Bulk faculty upload finished: ${successCount} succeeded, ${failedCount} failed.`)
      }
    },
    onError: (error) => {
      toast.error(toApiErrorMessage(error, 'Bulk faculty upload failed.'))
    },
  })
}

export function useAdminFacultyQuery() {
  const { token } = useAuth()

  return useQuery({
    queryKey: adminQueryKeys.faculty(),
    queryFn: () => adminApi.listFaculty({ token: ensureToken(token) }),
    enabled: Boolean(token),
    staleTime: 60_000,
  })
}

export function useAdminFacultyDetailQuery(facultyId: number | null) {
  const { token } = useAuth()

  return useQuery({
    queryKey: adminQueryKeys.facultyDetail(facultyId ?? 0),
    queryFn: () => adminApi.getFacultyDetail({ token: ensureToken(token), facultyId: facultyId ?? 0 }),
    enabled: Boolean(token) && Boolean(facultyId),
    staleTime: 20_000,
  })
}

export function useAdminStudentSummaryQuery(filters: AdminStudentSummaryFilters = {}) {
  const { token } = useAuth()

  const normalizedFilters = normalizeStudentSummaryFilters(filters)

  return useQuery({
    queryKey: adminQueryKeys.studentsSummary(normalizedFilters),
    queryFn: () => adminApi.listStudentSummaries({ token: ensureToken(token), filters: normalizedFilters }),
    enabled: Boolean(token),
    staleTime: 45_000,
    placeholderData: keepPreviousData,
  })
}

export function useAdminStudentDetailQuery(studentId: number | null) {
  const { token } = useAuth()

  return useQuery({
    queryKey: adminQueryKeys.studentDetail(studentId ?? 0),
    queryFn: () => adminApi.getStudentDetail({ token: ensureToken(token), studentId: studentId ?? 0 }),
    enabled: Boolean(token) && Boolean(studentId),
    staleTime: 20_000,
  })
}

export function useAdminUploadStudentPhotoMutation(studentId: number | null) {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (file: File) => {
      if (!studentId) {
        throw new Error('Student identifier is missing.')
      }

      return adminApi.uploadStudentPhoto({ token: ensureToken(token), studentId, file })
    },
    onSuccess: async (result) => {
      // Invalidate ALL student-related queries to eliminate stale caching
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.users() }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'students'] }), // All student queries
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.studentDetail(studentId ?? 0) }),
      ])

      toast.success(result.message)
    },
    onError: (error) => {
      toast.error(toApiErrorMessage(error, 'Unable to upload student photo.'))
    },
  })
}

export function useAdminAllocationQuery() {
  const { token } = useAuth()

  return useQuery({
    queryKey: adminQueryKeys.allocation(),
    queryFn: () => adminApi.listAllocation({ token: ensureToken(token) }),
    enabled: Boolean(token),
    staleTime: 20_000,
  })
}

export function useAdminAssignedStudentsQuery(facultyId: number | null) {
  const { token } = useAuth()

  return useQuery({
    queryKey: adminQueryKeys.allocationAssigned(facultyId ?? 0),
    queryFn: () => adminApi.listAssignedStudents({ token: ensureToken(token), facultyId: facultyId ?? 0 }),
    enabled: Boolean(token) && Boolean(facultyId),
    staleTime: 10_000,
  })
}

export function useGenerateAllocationMutation() {
  const { token } = useAuth()
  const toast = useToast()

  return useMutation({
    mutationKey: ['admin', 'mutation', 'allocation-generate'],
    scope: { id: 'admin-allocation-writes' },
    mutationFn: ({ facultyId }: { facultyId: number }) => adminApi.generateAllocation({ token: ensureToken(token), facultyId }),
    onError: (error) => {
      toast.error(toApiErrorMessage(error, 'Unable to generate allocation suggestions.'))
    },
  })
}

export function useConfirmAllocationMutation() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationKey: ['admin', 'mutation', 'allocation-confirm'],
    scope: { id: 'admin-allocation-writes' },
    mutationFn: (payload: AdminAllocationUpdateInput) => adminApi.confirmAllocation({ token: ensureToken(token), payload }),
    onSuccess: async (result, payload) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.allocation() }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.allocationAssigned(payload.facultyId) }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.students() }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.facultyDetail(payload.facultyId) }),
      ])

      toast.success(result.message)
    },
    onError: (error) => {
      toast.error(toApiErrorMessage(error, 'Unable to confirm allocation.'))
    },
  })
}

export function useRemoveAllocationMutation() {
  const { token } = useAuth()
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationKey: ['admin', 'mutation', 'allocation-remove'],
    scope: { id: 'admin-allocation-writes' },
    mutationFn: (payload: AdminAllocationUpdateInput) => adminApi.removeAllocation({ token: ensureToken(token), payload }),
    onSuccess: async (result, payload) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.allocation() }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.allocationAssigned(payload.facultyId) }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.students() }),
        queryClient.invalidateQueries({ queryKey: adminQueryKeys.facultyDetail(payload.facultyId) }),
      ])

      toast.success(result.message)
    },
    onError: (error) => {
      toast.error(toApiErrorMessage(error, 'Unable to remove student allocation.'))
    },
  })
}

export function useAdminReportStatsQuery() {
  const { token } = useAuth()

  return useQuery({
    queryKey: adminQueryKeys.reportStats(),
    queryFn: () => adminApi.getReportStats({ token: ensureToken(token) }),
    enabled: Boolean(token),
    staleTime: 30_000,
  })
}

export function useAdminReportToppersQuery(semester: number | undefined) {
  const { token } = useAuth()

  return useQuery({
    queryKey: adminQueryKeys.reportToppers(semester),
    queryFn: () => adminApi.listReportToppers({ token: ensureToken(token), semester }),
    enabled: Boolean(token),
    staleTime: 20_000,
    placeholderData: keepPreviousData,
  })
}

export function useAdminReportSemesterDistributionQuery() {
  const { token } = useAuth()

  return useQuery({
    queryKey: adminQueryKeys.reportSemesterDistribution(),
    queryFn: () => adminApi.listSemesterDistribution({ token: ensureToken(token) }),
    enabled: Boolean(token),
    staleTime: 30_000,
  })
}

export function useAdminReportBacklogsQuery() {
  const { token } = useAuth()

  return useQuery({
    queryKey: adminQueryKeys.reportBacklogs(),
    queryFn: () => adminApi.listBacklogs({ token: ensureToken(token) }),
    enabled: Boolean(token),
    staleTime: 20_000,
  })
}

export function useAdminReportGeneralQuery() {
  const { token } = useAuth()

  return useQuery({
    queryKey: adminQueryKeys.reportGeneral(),
    queryFn: () => adminApi.listGeneralReport({ token: ensureToken(token) }),
    enabled: Boolean(token),
    staleTime: 30_000,
  })
}

export function useAdminReportIncompleteQuery(year: number | undefined) {
  const { token } = useAuth()

  return useQuery({
    queryKey: adminQueryKeys.reportIncomplete(year),
    queryFn: () => adminApi.listIncompleteProfiles({ token: ensureToken(token), year }),
    enabled: Boolean(token),
    staleTime: 20_000,
    placeholderData: keepPreviousData,
  })
}

function downloadExportedFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
}

export function useExportAllReportsMutation() {
  const { token } = useAuth()
  const toast = useToast()

  return useMutation({
    mutationKey: ['admin', 'mutation', 'report-export-all'],
    mutationFn: () => adminApi.exportAllReports({ token: ensureToken(token) }),
    onSuccess: (file) => {
      downloadExportedFile(file.blob, file.filename)
      toast.success('Exported all student reports.')
    },
    onError: (error) => {
      toast.error(toApiErrorMessage(error, 'Export all reports failed.'))
    },
  })
}

export function useExportBacklogsMutation() {
  const { token } = useAuth()
  const toast = useToast()

  return useMutation({
    mutationKey: ['admin', 'mutation', 'report-export-backlogs'],
    mutationFn: () => adminApi.exportBacklogReports({ token: ensureToken(token) }),
    onSuccess: (file) => {
      downloadExportedFile(file.blob, file.filename)
      toast.success('Exported backlog report.')
    },
    onError: (error) => {
      toast.error(toApiErrorMessage(error, 'Export backlog report failed.'))
    },
  })
}

export function useExportIncompleteReportsMutation() {
  const { token } = useAuth()
  const toast = useToast()

  return useMutation({
    mutationKey: ['admin', 'mutation', 'report-export-incomplete'],
    mutationFn: ({ year }: { year?: number }) => adminApi.exportIncompleteReports({ token: ensureToken(token), year }),
    onSuccess: (file) => {
      downloadExportedFile(file.blob, file.filename)
      toast.success('Exported incomplete profiles report.')
    },
    onError: (error) => {
      toast.error(toApiErrorMessage(error, 'Export incomplete profiles report failed.'))
    },
  })
}
