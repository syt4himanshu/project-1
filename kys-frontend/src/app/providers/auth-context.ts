import { createContext, useContext } from 'react'
import type { AuthSession, AuthUser } from '../../shared/auth/session'

export type AuthStatus = 'bootstrapping' | 'authenticated' | 'anonymous'

export interface AuthContextValue {
  status: AuthStatus
  session: AuthSession | null
  user: AuthUser | null
  token: string | null
  login: (identifier: string, password: string) => Promise<AuthSession>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
