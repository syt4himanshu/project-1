import { useRegisterSW } from 'virtual:pwa-register/react'

export function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        console.info('Service Worker registered successfully')
      }
    },
    onRegisterError(error) {
      console.error('Service Worker registration error:', error)
    },
  })

  const close = () => {
    setNeedRefresh(false)
  }

  if (!needRefresh) return null

  return (
    <div
      role="alert"
      className="fixed bottom-4 right-4 z-50 flex items-center justify-between gap-4 rounded-lg bg-slate-900 px-4 py-3 text-sm text-white shadow-xl border border-slate-800"
    >
      <span>A new version of KYS is available.</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => void updateServiceWorker(true)}
          className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
        >
          Update
        </button>
        <button
          type="button"
          onClick={close}
          className="rounded bg-slate-800 px-2 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
