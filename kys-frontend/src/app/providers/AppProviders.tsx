import type { ReactNode } from 'react'
import { AuthProvider } from './AuthProvider'
import { QueryProvider } from './QueryProvider'
import { ToastProvider } from './ToastProvider'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ToastProvider>{children}</ToastProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
