import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { ToastContext, type ToastInput, type ToastIntent } from './toast-context'

interface ToastRecord {
  id: number
  title: string
  message: string
  intent: ToastIntent
  durationMs: number
}

function clampDuration(durationMs: number | undefined): number {
  if (typeof durationMs !== 'number' || !Number.isFinite(durationMs)) return 4_000
  return Math.min(15_000, Math.max(1_500, Math.floor(durationMs)))
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([])
  const nextIdRef = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const notify = useCallback((toast: ToastInput) => {
    const id = nextIdRef.current
    nextIdRef.current += 1

    const record: ToastRecord = {
      id,
      title: toast.title?.trim() || 'Notice',
      message: toast.message.trim() || 'Action completed.',
      intent: toast.intent ?? 'info',
      durationMs: clampDuration(toast.durationMs),
    }

    setToasts((current) => [...current, record])

    window.setTimeout(() => {
      dismiss(id)
    }, record.durationMs)
  }, [dismiss])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <article key={toast.id} className={`toast toast--${toast.intent}`}>
            <header className="toast__header">
              <p className="toast__title">{toast.title}</p>
              <button type="button" className="toast__close" onClick={() => dismiss(toast.id)} aria-label="Close notification">
                ×
              </button>
            </header>
            <p className="toast__message">{toast.message}</p>
          </article>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
