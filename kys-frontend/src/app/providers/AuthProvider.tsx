import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ENDPOINTS } from '../../shared/api/endpointRegistry'
import { AUTH_EXPIRED_EVENT, requestJson } from '../../shared/api/httpClient'
import { clearStoredSession, readStoredSession, writeStoredSession } from '../../shared/auth/storage'
import { isUserRole, type AuthSession, type AuthUser } from '../../shared/auth/session'
import { AuthContext, type AuthContextValue, type AuthStatus } from './auth-context'

interface LoginResponse {
  access_token?: unknown
  role?: unknown
  user?: {
    id?: unknown
    username?: unknown
    role?: unknown
  }
}

interface VerifyResponse {
  valid?: unknown
  user?: {
    id?: unknown
    username?: unknown
    role?: unknown
  }
}

function normalizeUser(raw: VerifyResponse['user'] | LoginResponse['user'] | undefined): AuthUser | null {
  if (!raw) return null
  if (typeof raw.id !== 'number' || !Number.isFinite(raw.id)) return null
  if (typeof raw.username !== 'string' || raw.username.trim() === '') return null
  if (!isUserRole(raw.role)) return null

  return {
    id: raw.id,
    username: raw.username,
    role: raw.role,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('bootstrapping')
  const [session, setSession] = useState<AuthSession | null>(null)

  const applyAnonymousState = useCallback(() => {
    clearStoredSession()
    setSession(null)
    setStatus('anonymous')
  }, [])

  const refreshSession = useCallback(async () => {
    const stored = readStoredSession()

    if (!stored) {
      setSession(null)
      setStatus('anonymous')
      return
    }

    try {
      const payload = await requestJson<VerifyResponse>(ENDPOINTS.auth.verify, {
        method: 'GET',
        token: stored.accessToken,
      })

      const isValid = payload.valid === true
      const verifiedUser = normalizeUser(payload.user)
      if (!isValid || !verifiedUser) {
        applyAnonymousState()
        return
      }

      const nextSession: AuthSession = {
        accessToken: stored.accessToken,
        user: verifiedUser,
      }

      writeStoredSession(nextSession)
      setSession(nextSession)
      setStatus('authenticated')
    } catch {
      applyAnonymousState()
    }
  }, [applyAnonymousState])

  useEffect(() => {
    let active = true

    const bootstrap = async () => {
      if (!active) return
      await refreshSession()
    }

    void bootstrap()

    return () => {
      active = false
    }
  }, [refreshSession])

  useEffect(() => {
    const onAuthExpired = () => {
      applyAnonymousState()
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, onAuthExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onAuthExpired)
  }, [applyAnonymousState])

  const login = useCallback(async (identifier: string, password: string) => {
    const payload = await requestJson<LoginResponse>(ENDPOINTS.auth.login, {
      method: 'POST',
      body: {
        username: identifier,
        uid: identifier,
        password,
      },
    })

    const accessToken = typeof payload.access_token === 'string' ? payload.access_token : ''
    if (!accessToken) {
      throw new Error('Login response did not include an access token')
    }

    const normalizedUser = normalizeUser(payload.user)

    const roleFromPayload = normalizedUser?.role ?? payload.role
    if (!isUserRole(roleFromPayload)) {
      throw new Error('Login response did not include a valid role')
    }

    const sessionUser: AuthUser = normalizedUser ?? {
      id: 0,
      username: identifier,
      role: roleFromPayload,
    }

    const nextSession: AuthSession = {
      accessToken,
      user: sessionUser,
    }

    writeStoredSession(nextSession)
    setSession(nextSession)
    setStatus('authenticated')

    return nextSession
  }, [])

  const logout = useCallback(async () => {
    const token = session?.accessToken ?? null

    if (token) {
      try {
        await requestJson<unknown>(ENDPOINTS.auth.logout, {
          method: 'POST',
          token,
        })
      } catch {
        // Ignore logout API failures and clear session locally.
      }
    }

    applyAnonymousState()
  }, [applyAnonymousState, session?.accessToken])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      user: session?.user ?? null,
      token: session?.accessToken ?? null,
      login,
      logout,
      refreshSession,
    }),
    [status, session, login, logout, refreshSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
