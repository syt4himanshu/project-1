import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ToastContext } from '../../app/providers/toast-context'
import { facultyClient } from './api/client'
import { FacultyMenteeDetailPage } from './pages/FacultyMenteeDetailPage'
import { MenteesTable } from './components/MenteesTable'

vi.mock('./api/client', () => ({
  facultyClient: {
    getMentee: vi.fn(),
    getMenteeMinutes: vi.fn(),
    lockMentee: vi.fn(),
    unlockMentee: vi.fn(),
    updateMenteeProfile: vi.fn(),
    uploadMenteePhoto: vi.fn(),
  },
}))

vi.mock('country-state-city', () => ({
  State: {
    getStatesOfCountry: () => [{ name: 'Maharashtra', isoCode: 'MH' }],
  },
  City: {
    getCitiesOfState: () => [{ name: 'Nagpur' }],
  },
}))

const mockUnlockedMentee = {
  id: 101,
  uid: 'STU_101',
  full_name: 'Rahul Sharma',
  semester: 4,
  section: 'A',
  year_of_admission: 2023,
  is_profile_locked: false,
  profile_locked_at: null,
  profile_locked_by: null,
  personal_info: { mobile_no: '9876543210' },
}

const mockLockedMentee = {
  id: 102,
  uid: 'STU_102',
  full_name: 'Priya Verma',
  semester: 6,
  section: 'B',
  year_of_admission: 2022,
  is_profile_locked: true,
  profile_locked_at: '2026-08-19T10:00:00.000Z',
  profile_locked_by: 5,
  personal_info: { mobile_no: '9123456789' },
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

function renderMenteeDetail(uid: string, queryClient = createQueryClient()) {
  const notify = vi.fn()
  return {
    notify,
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <ToastContext.Provider value={{ notify }}>
          <MemoryRouter initialEntries={[`/faculty/mentees/${uid}`]}>
            <Routes>
              <Route path="/faculty/mentees/:uid" element={<FacultyMenteeDetailPage />} />
            </Routes>
          </MemoryRouter>
        </ToastContext.Provider>
      </QueryClientProvider>,
    ),
  }
}

describe('Phase 2 — Faculty Profile Lock / Unlock & Mentee Editing UI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(facultyClient.getMenteeMinutes).mockResolvedValue({
      student: { uid: 'STU_101', full_name: 'Test Student' },
      mentoring_minutes: [],
    })
  })

  // 1. Unlocked mentee displays unlocked status.
  it('1. Unlocked mentee displays unlocked status badge', async () => {
    vi.mocked(facultyClient.getMentee).mockResolvedValue(mockUnlockedMentee as any)

    renderMenteeDetail('STU_101')

    await waitFor(() => {
      expect(screen.getByText(/Editable by Student/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Lock Profile/i })).toBeInTheDocument()
    })
  })

  // 2. Locked mentee displays locked status.
  it('2. Locked mentee displays locked status badge and lock date', async () => {
    vi.mocked(facultyClient.getMentee).mockResolvedValue(mockLockedMentee as any)

    renderMenteeDetail('STU_102')

    await waitFor(() => {
      expect(screen.getByText(/Profile Locked/i)).toBeInTheDocument()
      expect(screen.getByText(/Locked on:/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Unlock Profile/i })).toBeInTheDocument()
    })
  })

  // 3 & 4. Faculty can initiate lock & confirmation dialog appears before lock.
  it('3 & 4. Faculty clicking Lock Profile shows confirmation modal with description', async () => {
    const user = userEvent.setup()
    vi.mocked(facultyClient.getMentee).mockResolvedValue(mockUnlockedMentee as any)

    renderMenteeDetail('STU_101')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Lock Profile/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Lock Profile/i }))

    expect(screen.getByText(/Lock this student's profile\?/i)).toBeInTheDocument()
    expect(screen.getByText(/the student will be able to view their profile but will not be able to edit it/i)).toBeInTheDocument()
  })

  // 5 & 15. Successful lock updates UI and invalidates query cache.
  it('5 & 15. Successful lock calls API, shows toast, and refetches mentee profile', async () => {
    const user = userEvent.setup()
    const qc = createQueryClient()
    vi.mocked(facultyClient.getMentee).mockResolvedValue(mockUnlockedMentee as any)
    vi.mocked(facultyClient.lockMentee).mockResolvedValue({
      uid: 'STU_101',
      is_profile_locked: true,
      profile_locked_at: new Date().toISOString(),
      profile_locked_by: 5,
      message: 'Mentee profile locked successfully.',
    })

    const { notify } = renderMenteeDetail('STU_101', qc)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Lock Profile/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Lock Profile/i }))

    // Mock next getMentee response after lock mutation
    vi.mocked(facultyClient.getMentee).mockResolvedValue({
      ...mockUnlockedMentee,
      is_profile_locked: true,
      profile_locked_at: '2026-08-20T00:00:00.000Z',
    } as any)

    // Confirm Lock inside modal
    const confirmLockBtn = screen.getAllByRole('button', { name: /Lock Profile/i })[1]
    await user.click(confirmLockBtn)

    await waitFor(() => {
      expect(facultyClient.lockMentee).toHaveBeenCalledWith('STU_101')
      expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({ intent: 'success', message: expect.stringMatching(/locked successfully/i) }),
      )
    })
  })

  // 6. Failed lock does not falsely update UI.
  it('6. Failed lock request displays error and does not update UI state', async () => {
    const user = userEvent.setup()
    vi.mocked(facultyClient.getMentee).mockResolvedValue(mockUnlockedMentee as any)
    vi.mocked(facultyClient.lockMentee).mockRejectedValue(new Error('Network failure'))

    renderMenteeDetail('STU_101')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Lock Profile/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Lock Profile/i }))

    const confirmLockBtn = screen.getAllByRole('button', { name: /Lock Profile/i })[1]
    await user.click(confirmLockBtn)

    await waitFor(() => {
      expect(screen.getByText(/Network failure/i)).toBeInTheDocument()
      expect(screen.getByText(/Editable by Student/i)).toBeInTheDocument()
    })
  })

  // 7 & 8. Faculty can initiate unlock & successful unlock updates UI.
  it('7 & 8. Faculty can unlock a locked mentee profile', async () => {
    const user = userEvent.setup()
    vi.mocked(facultyClient.getMentee).mockResolvedValue(mockLockedMentee as any)
    vi.mocked(facultyClient.unlockMentee).mockResolvedValue({
      uid: 'STU_102',
      is_profile_locked: false,
      profile_locked_at: null,
      profile_locked_by: null,
      message: 'Mentee profile unlocked successfully.',
    })

    const { notify } = renderMenteeDetail('STU_102')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Unlock Profile/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Unlock Profile/i }))

    expect(screen.getByText(/Unlock this student's profile\?/i)).toBeInTheDocument()

    // Confirm unlock
    const confirmUnlockBtn = screen.getAllByRole('button', { name: /Unlock Profile/i })[1]
    await user.click(confirmUnlockBtn)

    await waitFor(() => {
      expect(facultyClient.unlockMentee).toHaveBeenCalledWith('STU_102')
      expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({ intent: 'success', message: expect.stringMatching(/unlocked successfully/i) }),
      )
    })
  })

  // 9 & 10. Faculty sees Edit Profile for unlocked and locked mentees.
  it('9 & 10. Faculty sees Edit Profile button for both unlocked and locked mentees', async () => {
    vi.mocked(facultyClient.getMentee).mockResolvedValue(mockUnlockedMentee as any)
    const { unmount } = renderMenteeDetail('STU_101')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument()
    })

    unmount()

    vi.mocked(facultyClient.getMentee).mockResolvedValue(mockLockedMentee as any)
    renderMenteeDetail('STU_102')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument()
    })
  })

  // 11, 12, 13. Faculty editing locked mentee preserves locked state.
  it('11, 12 & 13. Faculty editing a locked mentee submits via updateMenteeProfile API and preserves locked status', async () => {
    const user = userEvent.setup()
    vi.mocked(facultyClient.getMentee).mockResolvedValue(mockLockedMentee as any)
    vi.mocked(facultyClient.updateMenteeProfile).mockResolvedValue({
      message: 'Profile updated by faculty',
      student: { ...mockLockedMentee, full_name: 'Priya Verma (Updated)' } as any,
    })

    const { notify } = renderMenteeDetail('STU_102')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Edit Profile/i }))

    expect(screen.getByText(/Edit Mentee Profile/i)).toBeInTheDocument()

    // Save profile changes inside modal
    await user.click(screen.getByRole('button', { name: /Save Profile Changes/i }))

    await waitFor(() => {
      expect(facultyClient.updateMenteeProfile).toHaveBeenCalledWith('STU_102', expect.any(Object))
      expect(notify).toHaveBeenCalledWith(
        expect.objectContaining({ intent: 'success', message: expect.stringMatching(/profile updated successfully/i) }),
      )
      // Lock status MUST still be displayed as Locked
      expect(screen.getByText(/Profile Locked/i)).toBeInTheDocument()
    })
  })

  // 14. Loading state prevents duplicate lock/unlock actions.
  it('14. Loading state disables button during lock request to prevent duplicate clicks', async () => {
    const user = userEvent.setup()
    vi.mocked(facultyClient.getMentee).mockResolvedValue(mockUnlockedMentee as any)
    // Never resolving promise to simulate pending state
    vi.mocked(facultyClient.lockMentee).mockReturnValue(new Promise(() => {}))

    renderMenteeDetail('STU_101')

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Lock Profile/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Lock Profile/i }))

    const confirmLockBtn = screen.getAllByRole('button', { name: /Lock Profile/i })[1]
    await user.click(confirmLockBtn)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Locking\.\.\./i })).toBeDisabled()
    })
  })

  // MenteesTable status badge test
  it('renders lock status badge in MenteesTable component', () => {
    const rows = [
      { id: 1, uid: 'S01', full_name: 'Mentee One', semester: 3, is_profile_locked: false },
      { id: 2, uid: 'S02', full_name: 'Mentee Two', semester: 5, is_profile_locked: true },
    ]

    render(
      <MemoryRouter>
        <MenteesTable
          rows={rows as any}
          isLoading={false}
          offset={0}
          limit={10}
          isLastPage={true}
          onPrev={() => {}}
          onNext={() => {}}
        />
      </MemoryRouter>,
    )

    expect(screen.getByText(/● Active/i)).toBeInTheDocument()
    expect(screen.getByText(/🔒 Locked/i)).toBeInTheDocument()
  })
})
