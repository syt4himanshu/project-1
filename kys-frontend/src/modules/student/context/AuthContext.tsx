import type { ReactNode } from 'react'
import { useAuth as useSharedAuth } from '../../../app/providers/auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  return children
}

export const useAuth = useSharedAuth
