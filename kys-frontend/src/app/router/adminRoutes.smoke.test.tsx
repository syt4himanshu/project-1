import { render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, test, vi } from 'vitest'
import { RouterProvider, createMemoryRouter, type RouteObject } from 'react-router-dom'
import { AuthContext, type AuthContextValue } from '../providers/auth-context'
import { ToastContext } from '../providers/toast-context'
import { adminRoutes } from './admin.routes'
import * as adminHooks from '../../modules/admin/hooks'

vi.mock('../../modules/admin/hooks', () => ({
  useAdminStatisticsQuery: vi.fn(),
  useAdminUsersQuery: vi.fn(),
  useCreateAdminUserMutation: vi.fn(),
  useDeleteAdminUserMutation: vi.fn(),
  useResetPasswordMutation: vi.fn(),
  useBulkRegisterStudentsMutation: vi.fn(),
  useBulkRegisterFacultyMutation: vi.fn(),
  useAdminFacultyQuery: vi.fn(),
  useAdminFacultyDetailQuery: vi.fn(),
  useAdminStudentSummaryQuery: vi.fn(),
  useAdminStudentDetailQuery: vi.fn(),
  useAdminUploadStudentPhotoMutation: vi.fn(),
  useAdminAllocationQuery: vi.fn(),
  useAdminAssignedStudentsQuery: vi.fn(),
  useGenerateAllocationMutation: vi.fn(),
  useConfirmAllocationMutation: vi.fn(),
  useRemoveAllocationMutation: vi.fn(),
  useAdminReportStatsQuery: vi.fn(),
  useAdminReportToppersQuery: vi.fn(),
  useAdminReportSemesterDistributionQuery: vi.fn(),
  useAdminReportBacklogsQuery: vi.fn(),
  useAdminReportGeneralQuery: vi.fn(),
  useAdminReportIncompleteQuery: vi.fn(),
  useExportAllReportsMutation: vi.fn(),
  useExportBacklogsMutation: vi.fn(),
  useExportIncompleteReportsMutation: vi.fn(),
}))

function createQuery<T>(data: T, overrides: Partial<Record<'isPending' | 'isError', boolean>> = {}) {
  return {
    data,
    isPending: overrides.isPending ?? false,
    isError: overrides.isError ?? false,
    error: null,
    refetch: vi.fn(),
  }
}

function createMutation(result: unknown = { message: 'ok' }) {
  return {
    mutateAsync: vi.fn().mockResolvedValue(result),
    isPending: false,
  }
}

function createAuthValue(): AuthContextValue {
  return {
    status: 'authenticated',
    session: {
      accessToken: 'token-1',
      user: {
        id: 1,
        username: 'admin.user',
        role: 'admin',
      },
    },
    user: {
      id: 1,
      username: 'admin.user',
      role: 'admin',
    },
    token: 'token-1',
    login: vi.fn(),
    logout: vi.fn(),
    refreshSession: vi.fn(),
  }
}

function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={createAuthValue()}>
      <ToastContext.Provider value={{ notify: vi.fn() }}>
        {children}
      </ToastContext.Provider>
    </AuthContext.Provider>
  )
}

function renderAt(path: string) {
  const extraRoutes: RouteObject[] = [
    {
      path: '/login',
      element: <p>Login</p>,
    },
    {
      path: '/faculty/dashboard',
      element: <p>Faculty Dashboard</p>,
    },
    {
      path: '/student/dashboard',
      element: <p>Student Dashboard</p>,
    },
  ]

  const router = createMemoryRouter([adminRoutes, ...extraRoutes], {
    initialEntries: [path],
  })

  return render(
    <Providers>
      <RouterProvider router={router} />
    </Providers>,
  )
}

describe('Admin tab smoke routing', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(adminHooks.useAdminStatisticsQuery).mockReturnValue(createQuery({
      totalUsers: 10,
      totalStudents: 8,
      totalFaculty: 2,
      activeUsers: 9,
    }) as unknown as ReturnType<typeof adminHooks.useAdminStatisticsQuery>)

    vi.mocked(adminHooks.useAdminUsersQuery).mockReturnValue(createQuery([]) as unknown as ReturnType<typeof adminHooks.useAdminUsersQuery>)
    vi.mocked(adminHooks.useCreateAdminUserMutation).mockReturnValue(createMutation() as unknown as ReturnType<typeof adminHooks.useCreateAdminUserMutation>)
    vi.mocked(adminHooks.useDeleteAdminUserMutation).mockReturnValue(createMutation() as unknown as ReturnType<typeof adminHooks.useDeleteAdminUserMutation>)
    vi.mocked(adminHooks.useResetPasswordMutation).mockReturnValue(createMutation() as unknown as ReturnType<typeof adminHooks.useResetPasswordMutation>)
    vi.mocked(adminHooks.useBulkRegisterStudentsMutation).mockReturnValue(createMutation({ rows: [] }) as unknown as ReturnType<typeof adminHooks.useBulkRegisterStudentsMutation>)
    vi.mocked(adminHooks.useBulkRegisterFacultyMutation).mockReturnValue(createMutation({ rows: [] }) as unknown as ReturnType<typeof adminHooks.useBulkRegisterFacultyMutation>)

    vi.mocked(adminHooks.useAdminFacultyQuery).mockReturnValue(createQuery([]) as unknown as ReturnType<typeof adminHooks.useAdminFacultyQuery>)
    vi.mocked(adminHooks.useAdminFacultyDetailQuery).mockReturnValue(createQuery(null) as unknown as ReturnType<typeof adminHooks.useAdminFacultyDetailQuery>)

    vi.mocked(adminHooks.useAdminStudentSummaryQuery).mockReturnValue(createQuery([]) as unknown as ReturnType<typeof adminHooks.useAdminStudentSummaryQuery>)
    vi.mocked(adminHooks.useAdminStudentDetailQuery).mockReturnValue(createQuery(null) as unknown as ReturnType<typeof adminHooks.useAdminStudentDetailQuery>)
    vi.mocked(adminHooks.useAdminUploadStudentPhotoMutation).mockReturnValue(createMutation() as unknown as ReturnType<typeof adminHooks.useAdminUploadStudentPhotoMutation>)

    vi.mocked(adminHooks.useAdminAllocationQuery).mockReturnValue(createQuery([]) as unknown as ReturnType<typeof adminHooks.useAdminAllocationQuery>)
    vi.mocked(adminHooks.useAdminAssignedStudentsQuery).mockReturnValue(createQuery([]) as unknown as ReturnType<typeof adminHooks.useAdminAssignedStudentsQuery>)
    vi.mocked(adminHooks.useGenerateAllocationMutation).mockReturnValue(createMutation([]) as unknown as ReturnType<typeof adminHooks.useGenerateAllocationMutation>)
    vi.mocked(adminHooks.useConfirmAllocationMutation).mockReturnValue(createMutation() as unknown as ReturnType<typeof adminHooks.useConfirmAllocationMutation>)
    vi.mocked(adminHooks.useRemoveAllocationMutation).mockReturnValue(createMutation() as unknown as ReturnType<typeof adminHooks.useRemoveAllocationMutation>)

    vi.mocked(adminHooks.useAdminReportStatsQuery).mockReturnValue(createQuery({
      totalStudents: 8,
      averageSgpa: 7.3,
      withBacklogs: 2,
      activeSemesters: 6,
    }) as unknown as ReturnType<typeof adminHooks.useAdminReportStatsQuery>)
    vi.mocked(adminHooks.useAdminReportToppersQuery).mockReturnValue(createQuery([], { isPending: true }) as unknown as ReturnType<typeof adminHooks.useAdminReportToppersQuery>)
    vi.mocked(adminHooks.useAdminReportSemesterDistributionQuery).mockReturnValue(createQuery([], { isPending: true }) as unknown as ReturnType<typeof adminHooks.useAdminReportSemesterDistributionQuery>)
    vi.mocked(adminHooks.useAdminReportBacklogsQuery).mockReturnValue(createQuery([]) as unknown as ReturnType<typeof adminHooks.useAdminReportBacklogsQuery>)
    vi.mocked(adminHooks.useAdminReportGeneralQuery).mockReturnValue(createQuery([]) as unknown as ReturnType<typeof adminHooks.useAdminReportGeneralQuery>)
    vi.mocked(adminHooks.useAdminReportIncompleteQuery).mockReturnValue(createQuery([]) as unknown as ReturnType<typeof adminHooks.useAdminReportIncompleteQuery>)
    vi.mocked(adminHooks.useExportAllReportsMutation).mockReturnValue(createMutation() as unknown as ReturnType<typeof adminHooks.useExportAllReportsMutation>)
    vi.mocked(adminHooks.useExportBacklogsMutation).mockReturnValue(createMutation() as unknown as ReturnType<typeof adminHooks.useExportBacklogsMutation>)
    vi.mocked(adminHooks.useExportIncompleteReportsMutation).mockReturnValue(createMutation() as unknown as ReturnType<typeof adminHooks.useExportIncompleteReportsMutation>)
  })

  test.each([
    ['/admin/dashboard', 'text', 'Loading dashboard...'],
    ['/admin/users', 'text', 'Loading users...'],
    ['/admin/teachers', 'heading', 'Teachers Management'],
    ['/admin/students', 'heading', 'Students Directory'],
    ['/admin/allocation', 'heading', 'Student-Faculty Allocation'],
    ['/admin/reports', 'text', 'Loading reports...'],
  ])('renders tab route %s', async (path, assertionType, expected) => {
    renderAt(path)

    if (assertionType === 'heading') {
      await waitFor(
        () => {
          expect(screen.getByRole('heading', { name: expected })).toBeInTheDocument()
        },
        { timeout: 3000 },
      )
      return
    }

    expect(await screen.findByText(expected)).toBeInTheDocument()
  })

  it('keeps admin navigation links visible on tab routes', async () => {
    renderAt('/admin/users')

    expect(await screen.findByRole('link', { name: 'Overview' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Reports' })).toBeInTheDocument()
  })
})
