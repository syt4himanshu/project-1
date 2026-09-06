import { useEffect, useState } from 'react'
import { Modal } from '../../ui'
import { useSyncState } from '../useSyncState'
import { facultyClient } from '../../../modules/faculty/api'
import { AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, RefreshCw, XCircle } from 'lucide-react'

interface ConflictResolutionModalProps {
  open: boolean
  onClose: () => void
}

function formatLabel(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

export function ConflictResolutionModal({ open, onClose }: ConflictResolutionModalProps) {
  const { conflicts, resolveKeepServer, resolveKeepLocal } = useSyncState()
  const [activeIndex, setActiveIndex] = useState(0)
  const [serverData, setServerData] = useState<Record<string, unknown> | null>(null)
  const [isLoadingServer, setIsLoadingServer] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const activeConflict = conflicts[activeIndex] || conflicts[0]

  useEffect(() => {
    if (!open || !activeConflict) {
      setServerData(null)
      return
    }

    let isMounted = true
    setIsLoadingServer(true)
    setFetchError(null)

    const fetchServerState = async () => {
      try {
        if (activeConflict.operationType === 'UPDATE_STUDENT_PROFILE' || activeConflict.operationType === 'LOCK_MENTEE' || activeConflict.operationType === 'UNLOCK_MENTEE') {
          const mentee = await facultyClient.getMentee(activeConflict.targetId)
          if (isMounted) setServerData(mentee as unknown as Record<string, unknown>)
        } else if (activeConflict.operationType === 'UPDATE_FACULTY_PROFILE') {
          const profile = await facultyClient.getProfile()
          if (isMounted) setServerData(profile as unknown as Record<string, unknown>)
        } else if (activeConflict.operationType === 'ADD_MENTORING_MINUTE') {
          const minutes = await facultyClient.getMenteeMinutes(activeConflict.targetId)
          if (isMounted) setServerData(minutes as unknown as Record<string, unknown>)
        } else {
          if (isMounted) setServerData(null)
        }
      } catch (err) {
        if (isMounted) {
          setFetchError(err instanceof Error ? err.message : 'Unable to fetch current server state.')
          setServerData(null)
        }
      } finally {
        if (isMounted) setIsLoadingServer(false)
      }
    }

    void fetchServerState()

    return () => {
      isMounted = false
    }
  }, [open, activeConflict])

  if (!open) return null

  if (conflicts.length === 0) {
    return (
      <Modal open={open} title="Conflict Resolution" onClose={onClose} size="md">
        <div className="text-center py-6 space-y-4">
          <CheckCircle className="mx-auto h-12 w-12 text-emerald-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Conflicts Resolved</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">There are no pending data conflicts requiring review.</p>
          <button type="button" onClick={onClose} className="button button--primary">
            Close
          </button>
        </div>
      </Modal>
    )
  }

  const handleKeepServer = async () => {
    if (!activeConflict) return
    setIsProcessing(true)
    try {
      await resolveKeepServer(activeConflict.idempotencyKey)
      if (activeIndex >= conflicts.length - 1) {
        setActiveIndex(Math.max(0, conflicts.length - 2))
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleKeepLocal = async () => {
    if (!activeConflict) return
    setIsProcessing(true)
    try {
      await resolveKeepLocal(activeConflict.idempotencyKey)
      if (activeIndex >= conflicts.length - 1) {
        setActiveIndex(Math.max(0, conflicts.length - 2))
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const renderComparison = () => {
    if (isLoadingServer) {
      return (
        <div className="flex items-center justify-center p-8 space-x-2 text-gray-500 dark:text-gray-400">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span className="text-sm">Fetching current server state...</span>
        </div>
      )
    }

    if (activeConflict.operationType === 'LOCK_MENTEE' || activeConflict.operationType === 'UNLOCK_MENTEE') {
      const serverLocked = Boolean(serverData?.is_profile_locked)
      const attemptedAction = activeConflict.operationType === 'LOCK_MENTEE' ? 'Lock Profile' : 'Unlock Profile'

      return (
        <div className="space-y-3 bg-amber-50 dark:bg-amber-950/40 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200">Lock State Conflict</h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                Your offline action: <strong>{attemptedAction}</strong>. Current server state: <strong>{serverLocked ? 'Locked' : 'Unlocked'}</strong>.
              </p>
            </div>
          </div>
        </div>
      )
    }

    const payloadObj = (
      activeConflict.operationType === 'UPDATE_STUDENT_PROFILE'
        ? (activeConflict.payload.profileData as Record<string, unknown>)
        : activeConflict.payload
    ) || {}

    const keys = Object.keys(payloadObj).filter((k) => k !== 'uid' && k !== 'id')

    if (keys.length === 0) {
      return (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-300">
          No field-level comparisons available for this change payload.
        </div>
      )
    }

    return (
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="p-2.5">Field</th>
              <th className="p-2.5 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200">Your Offline Change</th>
              <th className="p-2.5 bg-gray-50 dark:bg-gray-800/80">Current Server Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {keys.map((key) => {
              const localVal = String(payloadObj[key] ?? 'N/A')
              const serverVal = serverData ? String(serverData[key] ?? 'N/A') : (fetchError ? 'Unavailable' : '...')
              const isDifferent = localVal !== serverVal

              return (
                <tr key={key} className={isDifferent ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''}>
                  <td className="p-2.5 font-medium text-gray-900 dark:text-white">{formatLabel(key)}</td>
                  <td className="p-2.5 font-mono text-indigo-700 dark:text-indigo-300 font-medium">{localVal}</td>
                  <td className="p-2.5 font-mono text-gray-600 dark:text-gray-300">{serverVal}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <Modal
      open={open}
      title={`Resolve Conflict (${activeIndex + 1} of ${conflicts.length})`}
      subtitle={`Target: ${activeConflict.targetId} | Operation: ${formatLabel(activeConflict.operationType)}`}
      onClose={onClose}
      size="lg"
    >
      <div className="space-y-4">
        {conflicts.length > 1 && (
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg text-xs">
            <span className="font-medium text-gray-600 dark:text-gray-300">
              Conflict {activeIndex + 1} of {conflicts.length}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={activeIndex >= conflicts.length - 1}
                onClick={() => setActiveIndex((prev) => Math.min(conflicts.length - 1, prev + 1))}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200">
            <p className="font-semibold">Server Data Changed</p>
            <p className="mt-0.5">
              {activeConflict.lastError || 'The server contains updated information that conflicts with your offline change.'}
            </p>
          </div>
        </div>

        {renderComparison()}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => void handleKeepServer()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold disabled:opacity-50"
          >
            <XCircle className="h-4 w-4 text-gray-500" />
            Keep Server Version
          </button>
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => void handleKeepLocal()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4" />
            Keep My Changes
          </button>
        </div>
      </div>
    </Modal>
  )
}
