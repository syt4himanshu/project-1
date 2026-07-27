import type { ReactNode } from 'react'
import { useAuth as useSharedAuth } from '../../../app/providers/auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  return children
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = useSharedAuth
