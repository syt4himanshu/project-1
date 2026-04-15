import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import type { AuthContextValue } from '../../providers/auth-context'
import { AuthContext } from '../../providers/auth-context'
import type { AuthSession } from '../../../shared/auth/session'
import RequireAuth from './RequireAuth'
import RequireRole from './RequireRole'

function createSession(role: AuthSession['user']['role']): AuthSession {
  return {
    accessToken: 'token-1',
    user: {
      id: 1,
      username: 'user1',
      role,
    },
  }
}

function createAuthValue(partial: Partial<AuthContextValue>): AuthContextValue {
  const session = partial.session ?? null

  return {
    status: partial.status ?? 'anonymous',
    session,
    user: partial.user ?? session?.user ?? null,
    token: partial.token ?? session?.accessToken ?? null,
    login: partial.login ?? vi.fn(),
    logout: partial.logout ?? vi.fn(),
    refreshSession: partial.refreshSession ?? vi.fn(),
  }
}

function LoginEcho() {
  const location = useLocation()
  return <p data-testid="login-search">{location.search}</p>
}

function renderWithAuth(value: AuthContextValue, ui: React.ReactNode) {
  return render(
    <AuthContext.Provider value={value}>
      {ui}
    </AuthContext.Provider>,
  )
}

describe('Route guards integration', () => {
  it('RequireAuth redirects anonymous users to login with next path', () => {
    const authValue = createAuthValue({ status: 'anonymous', session: null })

    renderWithAuth(
      authValue,
      <MemoryRouter initialEntries={['/admin/users?from=test']}>
        <Routes>
          <Route element={<RequireAuth />}>
            <Route path="/admin/users" element={<p>Protected users</p>} />
          </Route>
          <Route path="/login" element={<LoginEcho />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('login-search')).toHaveTextContent('?next=%2Fadmin%2Fusers%3Ffrom%3Dtest')
  })

  it('RequireRole redirects non-admin user to their dashboard', () => {
    const authValue = createAuthValue({
      status: 'authenticated',
      session: createSession('faculty'),
    })

    renderWithAuth(
      authValue,
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route element={<RequireRole role="admin" />}>
            <Route path="/admin/dashboard" element={<p>Admin dashboard</p>} />
          </Route>
          <Route path="/faculty/dashboard" element={<p>Faculty dashboard</p>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Faculty dashboard')).toBeInTheDocument()
    expect(screen.queryByText('Admin dashboard')).not.toBeInTheDocument()
  })

  it('RequireRole redirects non-faculty user away from faculty route', () => {
    const authValue = createAuthValue({
      status: 'authenticated',
      session: createSession('student'),
    })

    renderWithAuth(
      authValue,
      <MemoryRouter initialEntries={['/faculty/dashboard']}>
        <Routes>
          <Route element={<RequireRole role="faculty" />}>
            <Route path="/faculty/dashboard" element={<p>Faculty dashboard</p>} />
          </Route>
          <Route path="/student/dashboard" element={<p>Student dashboard</p>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Student dashboard')).toBeInTheDocument()
    expect(screen.queryByText('Faculty dashboard')).not.toBeInTheDocument()
  })

  it('RequireRole allows matching role through to outlet', () => {
    const authValue = createAuthValue({
      status: 'authenticated',
      session: createSession('admin'),
    })

    renderWithAuth(
      authValue,
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route element={<RequireRole role="admin" />}>
            <Route path="/admin/dashboard" element={<Outlet />}>
              <Route index element={<p>Admin dashboard</p>} />
            </Route>
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Admin dashboard')).toBeInTheDocument()
  })
})
