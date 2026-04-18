import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import { AUTH_EXPIRED_EVENT } from '../../shared/api/httpClient'
import { StoreProvider } from '../store/StoreProvider'
import { useAuth } from './auth-context'
import { AuthProvider } from './AuthProvider'

const SESSION_KEY = 'kys.auth.session'

function AuthProbe() {
  const { status, user, session } = useAuth()

  return (
    <div>
      <p data-testid="status">{status}</p>
      <p data-testid="user">{user?.username ?? 'none'}</p>
      <p data-testid="token">{session?.accessToken ?? 'none'}</p>
    </div>
  )
}

describe('AuthProvider integration', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('bootstraps a stored session using verify endpoint', async () => {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify({
      accessToken: 'token-123',
      user: {
        id: 7,
        username: 'admin.user',
        role: 'admin',
      },
    }))

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          valid: true,
          user: {
            id: 7,
            username: 'admin.user',
            role: 'admin',
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    )

    render(
      <StoreProvider>
        <AuthProvider>
          <AuthProbe />
        </AuthProvider>
      </StoreProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
    })

    expect(screen.getByTestId('user')).toHaveTextContent('admin.user')
    expect(screen.getByTestId('token')).toHaveTextContent('token-123')
  })

  it('clears session on auth-expired event', async () => {
    window.localStorage.setItem(SESSION_KEY, JSON.stringify({
      accessToken: 'token-123',
      user: {
        id: 9,
        username: 'admin.user',
        role: 'admin',
      },
    }))

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          valid: true,
          user: {
            id: 9,
            username: 'admin.user',
            role: 'admin',
          },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    )

    render(
      <StoreProvider>
        <AuthProvider>
          <AuthProbe />
        </AuthProvider>
      </StoreProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('authenticated')
    })

    window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT))

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('anonymous')
    })

    expect(screen.getByTestId('user')).toHaveTextContent('none')
    expect(screen.getByTestId('token')).toHaveTextContent('none')
    expect(window.localStorage.getItem(SESSION_KEY)).toBeNull()
  })
})
