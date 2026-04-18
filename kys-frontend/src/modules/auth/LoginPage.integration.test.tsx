import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthContext, type AuthContextValue } from '../../app/providers/auth-context'
import { LoginPage } from './routes'

function createAnonymousAuthValue(overrides: Partial<AuthContextValue> = {}): AuthContextValue {
  return {
    status: 'anonymous',
    session: null,
    user: null,
    token: null,
    login: vi.fn(),
    logout: vi.fn(),
    refreshSession: vi.fn(),
    ...overrides,
  }
}

describe('LoginPage faculty redirect', () => {
  it('routes faculty login to /faculty/dashboard', async () => {
    const user = userEvent.setup()

    const loginMock = vi.fn().mockResolvedValue({
      accessToken: 'token-1',
      user: {
        id: 42,
        username: 'faculty.user',
        role: 'faculty',
      },
    })

    const authValue = createAnonymousAuthValue({ login: loginMock })

    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={['/login?role=faculty']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/faculty/dashboard" element={<p>Faculty Dashboard Landing</p>} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    )

    await user.type(screen.getByPlaceholderText(/enter your username/i), 'faculty@stvincentngp.edu.in')
    await user.type(screen.getByPlaceholderText(/enter your password/i), 'Pass@1234')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('faculty@stvincentngp.edu.in', 'Pass@1234')
    })

    expect(await screen.findByText('Faculty Dashboard Landing')).toBeInTheDocument()
  })
})
