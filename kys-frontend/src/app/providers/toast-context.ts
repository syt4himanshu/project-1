import { createContext, useContext } from 'react'

export type ToastIntent = 'success' | 'error' | 'info'

export interface ToastInput {
  title?: string
  message: string
  intent?: ToastIntent
  durationMs?: number
}

export interface ToastContextValue {
  notify: (toast: ToastInput) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }

  return {
    notify: context.notify,
    success: (message: string, title = 'Success') => context.notify({ title, message, intent: 'success' }),
    error: (message: string, title = 'Error') => context.notify({ title, message, intent: 'error' }),
    info: (message: string, title = 'Info') => context.notify({ title, message, intent: 'info' }),
  }
}
