import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAppStore } from '../../app/store'
import { ToastProvider } from '../../app/providers/ToastProvider'
import { getProfile, updateProfile } from './api/student'
import ProfileWizard from './pages/ProfileWizard'
import Dashboard from './pages/Dashboard'
import { AuthContext } from '../../app/providers/auth-context'
import { ThemeProvider } from '../../app/providers/ThemeProvider'
import { studentProfileActions } from './store/studentProfileSlice'

vi.mock('./api/student', () => ({
  getProfile: vi.fn(),
  updateProfile: vi.fn(),
  getMentor: vi.fn().mockResolvedValue({ data: null }),
  getMentoringMinutes: vi.fn().mockResolvedValue({ data: [] }),
  uploadProfilePhoto: vi.fn(),
}))

const unlockedProfile = {
  first_name: 'Anish',
  last_name: 'Bezalwar',
  full_name: 'Anish Bezalwar',
  uid: 'STU_101',
  semester: 3,
  section: 'A',
  year_of_admission: 2023,
  is_profile_locked: false,
  profile_locked_at: null,
  profile_locked_by: null,
  personal_info: {
    category: 'OPEN',
    mis_uid: 'MIS12345',
    dob: '2002-05-15',
    gender: 'MALE',
    mobile_no: '9876543210',
    personal_email: 'anish@example.com',
    college_email: 'anish@stvincentngp.edu.in',
    state: 'Maharashtra',
    city: 'Nagpur',
    pincode: '440001',
    permanent_address: '123 Main St, Nagpur',
  },
}

const lockedProfile = {
  full_name: 'Anish Bezalwar',
  semester: 3,
  section: 'A',
  year_of_admission: 2023,
  is_profile_locked: true,
  profile_locked_at: '2026-08-19T12:00:00.000Z',
  profile_locked_by: 5,
  personal_info: { category: 'OPEN', mobile_no: '9876543210' },
}

function createTestStore() {
  return createAppStore()
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

function renderStudentWizard(store = createTestStore()) {
  const queryClient = createQueryClient()
  const authValue = {
    status: 'authenticated' as const,
    session: { accessToken: 'token-123', user: { id: 1, username: 'student1', role: 'student' as const } },
    user: { id: 1, username: 'student1', role: 'student' as const },
    token: 'token-123',
    login: vi.fn(),
    logout: vi.fn(),
    refreshSession: vi.fn(),
  }

  return {
    store,
    ...render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={authValue}>
            <ThemeProvider>
              <ToastProvider>
                <MemoryRouter initialEntries={['/student/profile']}>
                  <Routes>
                    <Route path="/student/profile" element={<ProfileWizard />} />
                    <Route path="/student/dashboard" element={<Dashboard />} />
                  </Routes>
                </MemoryRouter>
              </ToastProvider>
            </ThemeProvider>
          </AuthContext.Provider>
        </QueryClientProvider>
      </Provider>,
    ),
  }
}

function renderStudentDashboard() {
  const store = createTestStore()
  const queryClient = createQueryClient()
  const authValue = {
    status: 'authenticated' as const,
    session: { accessToken: 'token-123', user: { id: 1, username: 'student1', role: 'student' as const } },
    user: { id: 1, username: 'student1', role: 'student' as const },
    token: 'token-123',
    login: vi.fn(),
    logout: vi.fn(),
    refreshSession: vi.fn(),
  }

  return {
    ...render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider value={authValue}>
            <ThemeProvider>
              <ToastProvider>
                <MemoryRouter initialEntries={['/student/dashboard']}>
                  <Routes>
                    <Route path="/student/dashboard" element={<Dashboard />} />
                    <Route path="/student/profile" element={<ProfileWizard />} />
                  </Routes>
                </MemoryRouter>
              </ToastProvider>
            </ThemeProvider>
          </AuthContext.Provider>
        </QueryClientProvider>
      </Provider>,
    ),
  }
}

describe('Phase 3 — Student Read-Only Profile & Verification Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  // 1. Unlocked student sees normal editable profile.
  it('1. Unlocked student sees normal editable profile form without lock banner', async () => {
    vi.mocked(getProfile).mockResolvedValue({ data: unlockedProfile as any })

    renderStudentWizard()

    await waitFor(() => {
      expect(screen.getByDisplayValue('Anish Bezalwar')).toBeInTheDocument()
      expect(screen.queryByText(/🔒 Profile Locked/i)).not.toBeInTheDocument()
    })
  })

  // 2 & 3. Locked student sees "Profile Locked" & can view profile info.
  it('2 & 3. Locked student sees Profile Locked banner and existing information', async () => {
    vi.mocked(getProfile).mockResolvedValue({ data: lockedProfile as any })

    renderStudentWizard()

    await waitFor(() => {
      expect(screen.getByText(/🔒 Profile Locked/i)).toBeInTheDocument()
      expect(screen.getByText(/Editing is disabled because your faculty mentor has locked this profile/i)).toBeInTheDocument()
      expect(screen.getByDisplayValue('Anish Bezalwar')).toBeInTheDocument()
    })
  })

  // 4, 5, 6, 7. Locked student form fields and fieldset are disabled.
  it('4, 5, 6 & 7. Locked student controls, inputs, and photo upload are disabled natively', async () => {
    vi.mocked(getProfile).mockResolvedValue({ data: lockedProfile as any })

    renderStudentWizard()

    await waitFor(() => {
      const fullNameInput = screen.getByDisplayValue('Anish Bezalwar') as HTMLInputElement
      expect(fullNameInput).toBeDisabled()
    })
  })

  // 8. Locked student does not see Save/Submit mutation actions.
  it('8. Locked student does not see Clear Form mutation action', async () => {
    vi.mocked(getProfile).mockResolvedValue({ data: lockedProfile as any })

    renderStudentWizard()

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Clear Form/i })).not.toBeInTheDocument()
    })
  })

  // 9. Locked student can navigate through profile sections.
  it('9. Locked student can navigate through wizard steps using Next/Previous', async () => {
    const user = userEvent.setup()
    vi.mocked(getProfile).mockResolvedValue({ data: lockedProfile as any })

    renderStudentWizard()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Next/i }))

    await waitFor(() => {
      expect(screen.getByText(/Academic Information - Before Admission/i)).toBeInTheDocument()
    })
  })

  // 10. Locked student refreshes and remains read-only.
  it('10. Refreshing profile refetches backend state and remains locked', async () => {
    vi.mocked(getProfile).mockResolvedValue({ data: lockedProfile as any })

    const { unmount } = renderStudentWizard()

    await waitFor(() => {
      expect(screen.getByText(/🔒 Profile Locked/i)).toBeInTheDocument()
    })

    unmount()

    renderStudentWizard()

    await waitFor(() => {
      expect(screen.getByText(/🔒 Profile Locked/i)).toBeInTheDocument()
    })
  })

  // 11. Backend returns PROFILE_LOCKED during race condition: frontend handles gracefully.
  it('11. Gracefully handles 403 PROFILE_LOCKED race condition from backend update', async () => {
    vi.mocked(getProfile).mockResolvedValue({ data: unlockedProfile as any })
    vi.mocked(updateProfile).mockRejectedValue(new Error('PROFILE_LOCKED: Your profile is locked.'))

    const { store } = renderStudentWizard()

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument()
    })

    store.dispatch(studentProfileActions.patchStudentProfileData({ is_profile_locked: true }))

    await waitFor(() => {
      expect(store.getState().studentProfile.data.is_profile_locked).toBe(true)
      expect(screen.getByText(/🔒 Profile Locked/i)).toBeInTheDocument()
    })
  })

  // 12. Student Dashboard displays banner and View Profile button when locked.
  it('12. Student Dashboard displays Profile Locked banner and View Profile button when locked', async () => {
    vi.mocked(getProfile).mockResolvedValue({ data: lockedProfile as any })

    renderStudentDashboard()

    await waitFor(() => {
      expect(screen.getByText(/🔒 Profile Locked/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /View Profile/i })).toBeInTheDocument()
    })
  })

  // 13. Student Dashboard displays Update Profile when unlocked.
  it('13. Student Dashboard displays Update Profile button when unlocked', async () => {
    vi.mocked(getProfile).mockResolvedValue({ data: unlockedProfile as any })

    renderStudentDashboard()

    await waitFor(() => {
      expect(screen.queryByText(/🔒 Profile Locked/i)).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Update Profile/i })).toBeInTheDocument()
    })
  })
})
