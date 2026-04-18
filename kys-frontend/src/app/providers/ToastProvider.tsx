import { useCallback, useMemo, type ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { dismissToast, enqueueToast, selectToastItems } from '../store/toastSlice'
import { ToastContext, type ToastInput } from './toast-context'

export function ToastProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const toasts = useAppSelector(selectToastItems)

  const notify = useCallback((toast: ToastInput) => {
    dispatch(enqueueToast(toast))
  }, [dispatch])

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <article key={toast.id} className={`toast toast--${toast.intent}`}>
            <header className="toast__header">
              <p className="toast__title">{toast.title}</p>
              <button type="button" className="toast__close" onClick={() => dispatch(dismissToast(toast.id))} aria-label="Close notification">
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
