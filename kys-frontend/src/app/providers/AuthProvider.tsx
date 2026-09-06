import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { AUTH_EXPIRED_EVENT } from '../../shared/api/httpClient'
import { readStoredSession } from '../../shared/auth/storage'
import { clearOfflineDataForFaculty } from '../../shared/db'
import { syncEngine } from '../../shared/sync/syncEngine'
import {
  authExpired,
  loginWithCredentials,
  logoutCurrentUser,
  refreshAuthSession,
  selectAuthSession,
  selectAuthStatus,
  selectAuthToken,
  selectAuthUser,
} from '../store/authSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { AuthContext, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const bootstrappedRef = useRef(false)
  const status = useAppSelector(selectAuthStatus)
  const session = useAppSelector(selectAuthSession)
  const user = useAppSelector(selectAuthUser)
  const token = useAppSelector(selectAuthToken)

  useEffect(() => {
    if (bootstrappedRef.current) return
    bootstrappedRef.current = true
    void dispatch(refreshAuthSession())
  }, [dispatch])

  useEffect(() => {
    const onAuthExpired = () => {
      syncEngine.abortActiveSync()
      // Purge IndexedDB for the current faculty BEFORE the session is cleared,
      // so we still have the facultyId.  The IDB clear is fire-and-forget —
      // auth expiry must not be blocked by a storage error.
      const currentSession = readStoredSession()
      if (currentSession?.user?.id) {
        void clearOfflineDataForFaculty(currentSession.user.id).catch(() => {/* non-blocking */ })
      }
      dispatch(authExpired())
    }

    window.addEventListener(AUTH_EXPIRED_EVENT, onAuthExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onAuthExpired)
  }, [dispatch])

  const login = useCallback(async (identifier: string, password: string) => {
    return dispatch(loginWithCredentials({ identifier, password })).unwrap()
  }, [dispatch])

  const logout = useCallback(async () => {
    await dispatch(logoutCurrentUser()).unwrap()
  }, [dispatch])

  const refreshSession = useCallback(async () => {
    await dispatch(refreshAuthSession())
  }, [dispatch])

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      session,
      user,
      token,
      login,
      logout,
      refreshSession,
    }),
    [status, session, user, token, login, logout, refreshSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
