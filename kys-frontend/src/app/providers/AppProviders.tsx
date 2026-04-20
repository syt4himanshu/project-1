import type { ReactNode } from 'react'
import { StoreProvider } from '../store/StoreProvider'
import { AuthProvider } from './AuthProvider'
import { QueryProvider } from './QueryProvider'
import { ToastProvider } from './ToastProvider'
import { ThemeProvider } from './ThemeProvider'
import { ErrorBoundary } from '../../shared/components/ErrorBoundary'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <ToastProvider>{children}</ToastProvider>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </StoreProvider>
    </ErrorBoundary>
  )
}
