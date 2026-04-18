import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { AUTH_EXPIRED_EVENT } from '../../shared/api/httpClient'
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
