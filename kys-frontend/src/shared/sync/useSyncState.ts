import { useEffect, useState } from 'react'
import { syncEngine, type SyncState } from './syncEngine'
import type { OfflineMutationRecord } from '../db'

export function useSyncState() {
  const [state, setState] = useState<SyncState>({
    isSyncing: false,
    pendingCount: 0,
    conflictCount: 0,
    failedCount: 0,
    lastSyncAt: null,
    lastError: null,
  })
  const [conflicts, setConflicts] = useState<OfflineMutationRecord[]>([])

  useEffect(() => {
    let isMounted = true

    const updateState = () => {
      void syncEngine.getSyncState().then((s) => {
        if (isMounted) setState(s)
      })
      void syncEngine.getConflictingMutations().then((c) => {
        if (isMounted) setConflicts(c)
      })
    }

    updateState()
    const unsubscribe = syncEngine.subscribe(updateState)

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  return {
    ...state,
    conflicts,
    syncNow: () => syncEngine.syncNow(),
    resolveKeepServer: (idempotencyKey: string) => syncEngine.resolveConflictKeepServer(idempotencyKey),
    resolveKeepLocal: (idempotencyKey: string, updatedPayload?: Record<string, unknown>) =>
      syncEngine.resolveConflictKeepLocal(idempotencyKey, updatedPayload),
  }
}
