import type { ReactNode } from 'react'
import { StoreProvider } from '../store/StoreProvider'
import { AuthProvider } from './AuthProvider'
import { QueryProvider } from './QueryProvider'
import { ToastProvider } from './ToastProvider'
import { ErrorBoundary } from '../../shared/components/ErrorBoundary'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </StoreProvider>
    </ErrorBoundary>
  )
}
