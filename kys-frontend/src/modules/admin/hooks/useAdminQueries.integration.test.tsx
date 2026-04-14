import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor, act } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'
import { AuthContext, type AuthContextValue } from '../../../app/providers/auth-context'
import { ToastContext } from '../../../app/providers/toast-context'
import { adminApi } from '../api/client'
import { adminQueryKeys } from '../api/queryKeys'
import type { AdminStatistics, AdminUserSummary } from '../api/types'
import { useConfirmAllocationMutation, useDeleteAdminUserMutation } from './useAdminQueries'

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

function createAuthValue(): AuthContextValue {
  return {
    status: 'authenticated',
    session: {
      accessToken: 'token-1',
      user: { id: 1, username: 'admin', role: 'admin' },
    },
    user: { id: 1, username: 'admin', role: 'admin' },
    token: 'token-1',
    login: vi.fn(),
    logout: vi.fn(),
    refreshSession: vi.fn(),
  }
}

function createWrapper(queryClient: QueryClient, notify: (payload: { title?: string; message: string; intent?: string }) => void) {
  const authValue = createAuthValue()

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authValue}>
        <ToastContext.Provider value={{ notify }}>
          {children}
        </ToastContext.Provider>
      </AuthContext.Provider>
    </QueryClientProvider>
  )
}

describe('Admin query mutations integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('useDeleteAdminUserMutation rolls back optimistic state on failure', async () => {
    const queryClient = createQueryClient()
    const notify = vi.fn()
    const wrapper = createWrapper(queryClient, notify)

    const users: AdminUserSummary[] = [
      {
        id: 1,
        username: 'admin',
        role: 'admin',
        name: 'Admin User',
        profilePhotoUrl: null,
        status: 'Active',
        createdAt: '2026-01-01',
      },
      {
        id: 2,
        username: 'student-01',
        role: 'student',
        name: 'Student One',
        profilePhotoUrl: null,
        status: 'Active',
        createdAt: '2026-01-02',
      },
    ]

    const stats: AdminStatistics = {
      totalUsers: 2,
      totalStudents: 1,
      totalFaculty: 0,
      activeUsers: 2,
    }

    queryClient.setQueryData(adminQueryKeys.users(), users)
    queryClient.setQueryData(adminQueryKeys.statistics(), stats)

    let rejectDelete: (error: Error) => void = () => {}
    const deleteRequest = new Promise<{ message: string }>((_resolve, reject) => {
      rejectDelete = (error: Error) => reject(error)
    })

    vi.spyOn(adminApi, 'deleteUser').mockReturnValueOnce(deleteRequest)

    const { result } = renderHook(() => useDeleteAdminUserMutation(), { wrapper })

    const deletePromise = result.current.mutateAsync({ userId: 2 }).catch((error) => error as Error)

    await waitFor(() => {
      const currentUsers = queryClient.getQueryData<AdminUserSummary[]>(adminQueryKeys.users())
      expect(currentUsers).toHaveLength(1)
      expect(currentUsers?.[0].id).toBe(1)
    })

    rejectDelete(new Error('Delete failed'))
    const deleteError = await deletePromise
    expect(deleteError).toBeInstanceOf(Error)
    expect(deleteError.message).toBe('Delete failed')

    await waitFor(() => {
      expect(queryClient.getQueryData(adminQueryKeys.users())).toEqual(users)
      expect(queryClient.getQueryData(adminQueryKeys.statistics())).toEqual(stats)
    })

    expect(notify).toHaveBeenCalledWith(expect.objectContaining({
      intent: 'error',
      message: 'Delete failed',
    }))
  })

  it('useConfirmAllocationMutation invalidates allocation and related domains on success', async () => {
    const queryClient = createQueryClient()
    const notify = vi.fn()
    const wrapper = createWrapper(queryClient, notify)

    vi.spyOn(adminApi, 'confirmAllocation').mockResolvedValueOnce({ message: 'Allocation confirmed' })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useConfirmAllocationMutation(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ facultyId: 7, studentIds: [11, 12] })
    })

    expect(adminApi.confirmAllocation).toHaveBeenCalledWith({
      token: 'token-1',
      payload: {
        facultyId: 7,
        studentIds: [11, 12],
      },
    })

    const invalidatedKeys = invalidateSpy.mock.calls
      .map(([options]) => options?.queryKey)

    expect(invalidatedKeys).toEqual(expect.arrayContaining([
      adminQueryKeys.allocation(),
      adminQueryKeys.allocationAssigned(7),
      adminQueryKeys.students(),
      adminQueryKeys.facultyDetail(7),
    ]))

    expect(notify).toHaveBeenCalledWith(expect.objectContaining({
      intent: 'success',
      message: 'Allocation confirmed',
    }))
  })
})
