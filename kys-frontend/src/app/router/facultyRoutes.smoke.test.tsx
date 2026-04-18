import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, test, vi } from 'vitest'
import {
  RouterProvider,
  createMemoryRouter,
  type RouteObject,
  useLocation,
} from 'react-router-dom'
import { AuthContext, type AuthContextValue } from '../providers/auth-context'
import { StoreProvider } from '../store/StoreProvider'
import { facultyRoutes } from './faculty.routes'
import * as facultyHooks from '../../modules/faculty/hooks'

vi.mock('../../modules/faculty/hooks', () => ({
  useMentees: vi.fn(),
  useMentee: vi.fn(),
  useMenteeMinutes: vi.fn(),
  useAddMentoringMinute: vi.fn(),
  useFacultyChat: vi.fn(),
  useFacultyChatbot: vi.fn(),
  useFacultyProfile: vi.fn(),
  useUpdateProfile: vi.fn(),
  useChangePassword: vi.fn(),
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
    isError: false,
    error: null,
  }
}

function createAuthValue(role: 'admin' | 'faculty' | 'student' = 'faculty'): AuthContextValue {
  return {
    status: 'authenticated',
    session: {
      accessToken: 'token-1',
      user: {
        id: 1,
        username: 'faculty.user',
        role,
      },
    },
    user: {
      id: 1,
      username: 'faculty.user',
      role,
    },
    token: 'token-1',
    login: vi.fn(),
    logout: vi.fn().mockResolvedValue(undefined),
    refreshSession: vi.fn(),
  }
}

function LoginSearchEcho() {
  const location = useLocation()
  return <p data-testid="login-search">{location.search}</p>
}

function Providers({ children, authValue }: { children: ReactNode; authValue: AuthContextValue }) {
  return (
    <StoreProvider>
      <AuthContext.Provider value={authValue}>
        {children}
      </AuthContext.Provider>
    </StoreProvider>
  )
}

function renderAt(path: string, authValue = createAuthValue()) {
  const extraRoutes: RouteObject[] = [
    {
      path: '/',
      element: <LoginSearchEcho />,
    },
    {
      path: '/admin/dashboard',
      element: <p>Admin Dashboard</p>,
    },
    {
      path: '/student/dashboard',
      element: <p>Student Dashboard</p>,
    },
  ]

  const router = createMemoryRouter([facultyRoutes, ...extraRoutes], {
    initialEntries: [path],
  })

  return render(
    <Providers authValue={authValue}>
      <RouterProvider router={router} />
    </Providers>,
  )
}

describe('Faculty route smoke and auth parity', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(facultyHooks.useMentees).mockReturnValue(createQuery([
      {
        id: 1,
        uid: 'STU001',
        full_name: 'Student One',
        semester: 4,
        section: 'A',
        year_of_admission: 2023,
      },
    ]) as unknown as ReturnType<typeof facultyHooks.useMentees>)

    vi.mocked(facultyHooks.useMentee).mockReturnValue(createQuery({
      id: 1,
      uid: 'STU001',
      full_name: 'Student One',
      semester: 4,
      section: 'A',
      year_of_admission: 2023,
      personal_info: { mobile: '9999999999' },
      past_education_records: [],
      post_admission_records: [],
      projects: [],
      internships: [],
      cocurricular_participations: [],
      cocurricular_organizations: [],
      career_objective: { goal: 'Placement' },
      skills: { technical: ['React'] },
      swoc: { strengths: 'Consistency' },
    }) as unknown as ReturnType<typeof facultyHooks.useMentee>)

    vi.mocked(facultyHooks.useMenteeMinutes).mockReturnValue(createQuery({
      student: { full_name: 'Student One', semester: 4, section: 'A' },
      mentoring_minutes: [
        {
          id: 10,
          semester: 4,
          date: '2026-04-10',
          remarks: 'Good progress',
          suggestion: 'Keep revising DSA',
          action: 'Weekly review',
          created_by_faculty: true,
        },
      ],
    }) as unknown as ReturnType<typeof facultyHooks.useMenteeMinutes>)

    vi.mocked(facultyHooks.useAddMentoringMinute).mockReturnValue(createMutation({ message: 'Saved' }) as unknown as ReturnType<typeof facultyHooks.useAddMentoringMinute>)
    vi.mocked(facultyHooks.useFacultyChat).mockReturnValue({
      mentees: [
        {
          id: 1,
          uid: 'STU001',
          full_name: 'Student One',
          semester: 4,
          section: 'A',
          year_of_admission: 2023,
        },
      ],
      filteredMentees: [
        {
          id: 1,
          uid: 'STU001',
          full_name: 'Student One',
          semester: 4,
          section: 'A',
          year_of_admission: 2023,
        },
      ],
      menteeLoading: false,
      menteeError: '',
      scopeMode: 'all',
      selectedStudentUid: '',
      studentSearch: '',
      messages: [],
      requestError: '',
      isLoading: false,
      analysisText: 'Analyzing 1 student...',
      lastPayloadExists: false,
      setScopeMode: vi.fn(),
      setSelectedStudentUid: vi.fn(),
      setStudentSearch: vi.fn(),
      reloadMentees: vi.fn().mockResolvedValue(undefined),
      submitPayload: vi.fn().mockResolvedValue(undefined),
      stopResponse: vi.fn(),
      regenerate: vi.fn().mockResolvedValue(undefined),
    } as unknown as ReturnType<typeof facultyHooks.useFacultyChat>)
    vi.mocked(facultyHooks.useFacultyChatbot).mockReturnValue(createMutation({ response: 'Use weekly check-ins.' }) as unknown as ReturnType<typeof facultyHooks.useFacultyChatbot>)
    vi.mocked(facultyHooks.useFacultyProfile).mockReturnValue(createQuery({
      first_name: 'Faculty',
      last_name: 'User',
      email: 'faculty@stvincentngp.edu.in',
      contact_number: '9999999999',
    }) as unknown as ReturnType<typeof facultyHooks.useFacultyProfile>)
    vi.mocked(facultyHooks.useUpdateProfile).mockReturnValue(createMutation({ message: 'Profile updated' }) as unknown as ReturnType<typeof facultyHooks.useUpdateProfile>)
    vi.mocked(facultyHooks.useChangePassword).mockReturnValue(createMutation({ message: 'Password updated' }) as unknown as ReturnType<typeof facultyHooks.useChangePassword>)
  })

  test.each([
    ['/faculty/dashboard', /welcome back/i],
    ['/faculty/mentees', /welcome back/i],
    ['/faculty/mentees/STU001', /faculty mentoring portal/i],
    ['/faculty/chatbot', /teacher insights chatbot/i],
    ['/faculty/profile', /my profile/i],
  ])('renders faculty route %s', async (path, heading) => {
    renderAt(path)
    expect((await screen.findAllByRole('heading', { name: heading })).length).toBeGreaterThan(0)
  })

  it('keeps full faculty navigation links visible', async () => {
    renderAt('/faculty/dashboard')

    expect(await screen.findByRole('button', { name: /logout/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Chatbot' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Change Password' })).toBeInTheDocument()
  })

  it('redirects non-faculty role away from /faculty/*', async () => {
    renderAt('/faculty/dashboard', createAuthValue('student'))
    expect(await screen.findByText('Student Dashboard')).toBeInTheDocument()
  })

  it('redirects anonymous access to login with next parameter', async () => {
    const anonymousValue: AuthContextValue = {
      status: 'anonymous',
      session: null,
      user: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
      refreshSession: vi.fn(),
    }

    renderAt('/faculty/profile?tab=security', anonymousValue)

    expect(await screen.findByTestId('login-search')).toHaveTextContent(
      '?next=%2Ffaculty%2Fprofile%3Ftab%3Dsecurity',
    )
  })
})
