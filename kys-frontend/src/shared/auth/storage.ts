import type { AuthSession } from './session'
import { isUserRole } from './session'

const SESSION_KEY = 'kys.auth.session'

function hasWindow() {
  return typeof window !== 'undefined'
}

export function readStoredSession(): AuthSession | null {
  if (!hasWindow()) return null

  try {
    const raw = window.localStorage.getItem(SESSION_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as {
      accessToken?: unknown
      user?: { id?: unknown; username?: unknown; role?: unknown }
    }

    if (typeof parsed.accessToken !== 'string' || parsed.accessToken.trim() === '') return null

    const user = parsed.user
    if (!user) return null
    if (typeof user.id !== 'number' || !Number.isFinite(user.id)) return null
    if (typeof user.username !== 'string' || user.username.trim() === '') return null
    if (!isUserRole(user.role)) return null

    return {
      accessToken: parsed.accessToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    }
  } catch {
    return null
  }
}

export function writeStoredSession(session: AuthSession) {
  if (!hasWindow()) return
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearStoredSession() {
  if (!hasWindow()) return
  window.localStorage.removeItem(SESSION_KEY)
}
