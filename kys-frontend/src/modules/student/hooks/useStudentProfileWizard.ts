import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
import { updateProfile } from '../api/student'
import {
  deriveDraftKey,
  loadStudentProfileWizard,
  saveStudentProfileStep,
  selectStudentProfileCanSubmit,
  selectStudentProfileData,
  selectStudentProfileError,
  selectStudentProfileIsLoading,
  selectStudentProfileIsSaving,
  selectStudentProfileProgress,
  selectStudentProfileStatus,
  selectStudentProfileStep,
  studentProfileActions,
  submitStudentProfile,
} from '../store/studentProfileSlice'
import { clearDraft, clearDraftResetMark, getDraftMetadata, markDraftReset, saveDraft } from '../utils/studentProfileDraft'
import { validateStudentProfileDataDetailed } from '../validation/studentProfileSchema'

export function useStudentProfileDraft() {
  const dispatch = useAppDispatch()
  const data = useAppSelector(selectStudentProfileData)
  const loading = useAppSelector(selectStudentProfileIsLoading)
  const error = useAppSelector(selectStudentProfileError)

  const [validationIssues, setValidationIssues] = useState<Record<string, string>>({})
  const [validationReady, setValidationReady] = useState(false)
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const validationTimerRef = useRef<number | null>(null)

  const update = useCallback((patch: Record<string, unknown>) => {
    dispatch(studentProfileActions.patchStudentProfileData(patch))
  }, [dispatch])

  const dataSignature = useMemo(() => serializeProfileData(data), [data])

  const markFieldTouched = useCallback((path: string) => {
    setTouchedFields(prev => {
      if (prev.has(path)) return prev
      const next = new Set(prev)
      next.add(path)
      return next
    })
  }, [])

  useEffect(() => {
    if (loading) {
      setValidationReady(false)
      return
    }

    if (!validationReady) {
      setValidationReady(true)
      setValidationIssues({})
      return
    }

    if (validationTimerRef.current !== null) {
      window.clearTimeout(validationTimerRef.current)
    }

    validationTimerRef.current = window.setTimeout(() => {
      const detailed = validateStudentProfileDataDetailed(data)
      const nextIssues: Record<string, string> = {}
      for (const issue of detailed.issues) {
        if (!(issue.path in nextIssues)) {
          nextIssues[issue.path] = issue.message
        }
      }
      setValidationIssues(nextIssues)
    }, 300)

    return () => {
      if (validationTimerRef.current !== null) {
        window.clearTimeout(validationTimerRef.current)
        validationTimerRef.current = null
      }
    }
  }, [data, dataSignature, loading, validationReady])

  const getFieldValidation = useCallback((path: string) => {
    const err = validationIssues[path]
    const forceShowAll = error === 'Please fix highlighted validation issues before proceeding.' || 
                         (error && error.startsWith('Please fill required fields:'))
    return {
      error: err,
      touched: Boolean(forceShowAll || touchedFields.has(path)),
      markTouched: () => markFieldTouched(path)
    }
  }, [validationIssues, touchedFields, error, markFieldTouched])

  return { data, update, getFieldValidation, error, markFieldTouched }
}

function serializeProfileData(data: Record<string, unknown>) {
  try {
    return JSON.stringify(data)
  } catch {
    return ''
  }
}

function formatRelativeDraftTime(updatedAt: string | null) {
  if (!updatedAt) return ''

  const updated = Date.parse(updatedAt)
  if (!Number.isFinite(updated)) return ''

  const diffMs = Date.now() - updated
  if (diffMs < 30_000) return 'just now'
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

type AutoSyncStatus = 'idle' | 'saving' | 'synced' | 'offline' | 'syncing' | 'failed'

interface AutoSyncState {
  status: AutoSyncStatus
  message: string
  pending: boolean
}

const AUTOSAVE_IDLE_DELAY_MS = 30_000
const AUTOSAVE_BACKOFFS_MS = [5_000, 10_000, 20_000, 40_000]
const AUTOSAVE_MAX_RETRIES = 5

function isOffline() {
  return typeof navigator !== 'undefined' && navigator.onLine === false
}

function useStudentProfileDraftPersistence(draftKey: string, data: Record<string, unknown>, loading: boolean) {
  const lastSavedSignatureRef = useRef('')
  const pendingTimerRef = useRef<number | null>(null)
  const latestDataRef = useRef<Record<string, unknown>>(data)
  const hasHydratedRef = useRef(false)
  const [lastDraftSavedAt, setLastDraftSavedAt] = useState<string | null>(() => getDraftMetadata(draftKey)?.updatedAt ?? null)

  const signature = useMemo(() => serializeProfileData(data), [data])

  useEffect(() => {
    latestDataRef.current = data
  }, [data])

  useEffect(() => {
    if (loading) return

    if (!hasHydratedRef.current) {
      hasHydratedRef.current = true
      lastSavedSignatureRef.current = signature
      return
    }

    if (signature === lastSavedSignatureRef.current) return

    if (pendingTimerRef.current !== null) {
      window.clearTimeout(pendingTimerRef.current)
    }

    pendingTimerRef.current = window.setTimeout(() => {
      if (saveDraft(draftKey, latestDataRef.current)) {
        const metadata = getDraftMetadata(draftKey)
        if (metadata) {
          lastSavedSignatureRef.current = signature
          setLastDraftSavedAt(metadata.updatedAt)
        }
      }
    }, 400)

    return () => {
      if (pendingTimerRef.current !== null) {
        window.clearTimeout(pendingTimerRef.current)
        pendingTimerRef.current = null
      }
    }
  }, [loading, signature])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (loading) return
      if (signature === lastSavedSignatureRef.current) return
      if (saveDraft(draftKey, latestDataRef.current)) {
        const metadata = getDraftMetadata(draftKey)
        if (metadata) {
          lastSavedSignatureRef.current = signature
          setLastDraftSavedAt(metadata.updatedAt)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [loading, signature])

  const markSavedFromRestore = useCallback((updatedAt: string | null) => {
    if (updatedAt) {
      lastSavedSignatureRef.current = serializeProfileData(latestDataRef.current)
      setLastDraftSavedAt(updatedAt)
    }
  }, [])

  const clearSavedDraft = useCallback(() => {
    clearDraft(draftKey)
    lastSavedSignatureRef.current = ''
    setLastDraftSavedAt(null)
  }, [draftKey])

  return {
    lastDraftSavedAt,
    lastDraftSavedLabel: formatRelativeDraftTime(lastDraftSavedAt),
    markSavedFromRestore,
    clearSavedDraft,
  }
}

function useStudentProfileAutoSync(draftKey: string, data: Record<string, unknown>, loading: boolean) {
  const [state, setState] = useState<AutoSyncState>({ status: 'idle', message: '', pending: false })
  const currentSignatureRef = useRef('')
  const lastSyncedSignatureRef = useRef('')
  const inFlightRef = useRef(false)
  const queuedDataRef = useRef<Record<string, unknown> | null>(null)
  const idleTimerRef = useRef<number | null>(null)
  const retryTimerRef = useRef<number | null>(null)
  const retryCountRef = useRef(0)
  const latestDataRef = useRef(data)
  const submitWaitersRef = useRef<Array<() => void>>([])

  const setStatus = useCallback((status: AutoSyncStatus, message: string, pending = false) => {
    setState({ status, message, pending })
  }, [])

  const flushSubmitWaiters = useCallback(() => {
    const waiters = submitWaitersRef.current.splice(0)
    waiters.forEach((resolve) => resolve())
  }, [])

  const syncNow = useCallback(async (payload: Record<string, unknown>, reason: 'idle' | 'online' | 'retry' | 'submit') => {
    if (loading) return false
    if (isOffline()) {
      setStatus('offline', 'Offline - saved locally', true)
      return false
    }

    if (inFlightRef.current) {
      queuedDataRef.current = payload
      setStatus('saving', 'Saving...', true)
      return false
    }

    inFlightRef.current = true
    setStatus(reason === 'retry' ? 'syncing' : 'saving', reason === 'retry' ? 'Syncing...' : 'Saving...', true)

    try {
      await updateProfile(payload)
      const signature = serializeProfileData(payload)
      lastSyncedSignatureRef.current = signature
      currentSignatureRef.current = signature
      retryCountRef.current = 0
      queuedDataRef.current = null
      setStatus('synced', 'Saved to cloud', false)
      flushSubmitWaiters()
      return true
    } catch {
      const offline = isOffline()
      setStatus(offline ? 'offline' : 'failed', offline ? 'Offline - saved locally' : 'Failed to sync (will retry)', true)

      if (!offline) {
        retryCountRef.current += 1
        if (retryCountRef.current <= AUTOSAVE_MAX_RETRIES) {
          const retryDelay = AUTOSAVE_BACKOFFS_MS[Math.min(retryCountRef.current - 1, AUTOSAVE_BACKOFFS_MS.length - 1)]
          if (retryTimerRef.current !== null) {
            window.clearTimeout(retryTimerRef.current)
          }
          retryTimerRef.current = window.setTimeout(() => {
            void syncNow(queuedDataRef.current ?? latestDataRef.current, 'retry')
          }, retryDelay)
        }
      }

      return false
    } finally {
      inFlightRef.current = false
      if (queuedDataRef.current) {
        const queued = queuedDataRef.current
        queuedDataRef.current = null
        void syncNow(queued, 'online')
      }
    }
  }, [flushSubmitWaiters, loading, setStatus])

  const scheduleSync = useCallback((nextData: Record<string, unknown>) => {
    latestDataRef.current = nextData
    const signature = serializeProfileData(nextData)
    currentSignatureRef.current = signature
    if (!signature || signature === lastSyncedSignatureRef.current) return

    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current)
    }

    setStatus(isOffline() ? 'offline' : 'saving', isOffline() ? 'Offline - saved locally' : 'Saving...', true)

    idleTimerRef.current = window.setTimeout(() => {
      void syncNow(latestDataRef.current, 'idle')
    }, AUTOSAVE_IDLE_DELAY_MS)
  }, [setStatus, syncNow])

  useEffect(() => {
    if (loading) return
    scheduleSync(data)
  }, [data, loading, scheduleSync])

  useEffect(() => {
    const onOnline = () => {
      if (currentSignatureRef.current !== lastSyncedSignatureRef.current) {
        setStatus('syncing', 'Syncing...', true)
        void syncNow(latestDataRef.current, 'online')
      }
    }

    const onOffline = () => {
      setStatus('offline', 'Offline - saved locally', true)
    }

    const onBeforeUnload = () => {
      if (idleTimerRef.current !== null) {
        window.clearTimeout(idleTimerRef.current)
        idleTimerRef.current = null
      }

      void saveDraft(draftKey, latestDataRef.current)

      if (typeof navigator !== 'undefined' && navigator.onLine && typeof navigator.sendBeacon === 'function') {
        try {
          const blob = new Blob([JSON.stringify(latestDataRef.current)], { type: 'application/json' })
          navigator.sendBeacon('/api/student/me', blob)
        } catch {
          // Best-effort only; never block unload.
        }
      }
    }

    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [setStatus, syncNow])

  const flushPendingSync = useCallback(async () => {
    if (idleTimerRef.current !== null) {
      window.clearTimeout(idleTimerRef.current)
      idleTimerRef.current = null
    }

    if (currentSignatureRef.current !== lastSyncedSignatureRef.current) {
      await syncNow(latestDataRef.current, 'submit')
    }
  }, [syncNow])

  const waitForSync = useCallback(async () => {
    if (!inFlightRef.current) return
    await new Promise<void>((resolve) => {
      submitWaitersRef.current.push(resolve)
    })
  }, [])

  return {
    status: state.status,
    message: state.message,
    pending: state.pending,
    flushPendingSync,
    waitForSync,
    markSyncedAfterSubmit: () => {
      lastSyncedSignatureRef.current = currentSignatureRef.current
      setStatus('synced', 'Saved to cloud', false)
      flushSubmitWaiters()
    },
  }
}

export function useStudentProfileWizard() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectStudentProfileStatus)
  const step = useAppSelector(selectStudentProfileStep)
  const data = useAppSelector(selectStudentProfileData)
  const loading = useAppSelector(selectStudentProfileIsLoading)
  const saving = useAppSelector(selectStudentProfileIsSaving)
  const error = useAppSelector(selectStudentProfileError)
  const progress = useAppSelector(selectStudentProfileProgress)
  const canSubmit = useAppSelector(selectStudentProfileCanSubmit)
  const draftUpdatedAt = useAppSelector((state) => state.studentProfile.draftUpdatedAt)
  const draftRestored = useAppSelector((state) => state.studentProfile.draftRestored)
  const draftKey = useAppSelector((state) => state.studentProfile.draftKey || deriveDraftKey(state))
  const draftPersistence = useStudentProfileDraftPersistence(draftKey, data, loading)
  const autoSync = useStudentProfileAutoSync(draftKey, data, loading)

  useEffect(() => {
    if (status !== 'idle') return
    void dispatch(loadStudentProfileWizard())
  }, [dispatch, status])

  useEffect(() => {
    if (draftRestored && draftUpdatedAt) {
      draftPersistence.markSavedFromRestore(draftUpdatedAt)
    }
  }, [draftPersistence, draftRestored, draftUpdatedAt])

  const next = useCallback(async () => {
    try {
      await autoSync.flushPendingSync()
      await autoSync.waitForSync()
      await dispatch(saveStudentProfileStep(undefined)).unwrap()
      if (typeof window !== 'undefined' && window.innerWidth < 640) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch {
      // State already captures the validation or save error.
    }
  }, [dispatch, autoSync])

  const prev = useCallback(() => {
    dispatch(studentProfileActions.goToPreviousStudentProfileStep())
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [dispatch])

  const submit = useCallback(async () => {
    try {
      await autoSync.flushPendingSync()
      await autoSync.waitForSync()
      await dispatch(submitStudentProfile(undefined)).unwrap()
      draftPersistence.clearSavedDraft()
      clearDraftResetMark(draftKey)
      autoSync.markSyncedAfterSubmit()
      return true
    } catch {
      return false
    }
  }, [autoSync, dispatch, draftPersistence, draftKey])

  const clearForm = useCallback(async () => {
    dispatch(studentProfileActions.clearStudentProfileDraft())
    draftPersistence.clearSavedDraft()
    markDraftReset(draftKey)
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [dispatch, draftPersistence, draftKey])

  return {
    step,
    data,
    loading,
    saving,
    error,
    progress,
    canSubmit,
    lastDraftSavedAt: draftPersistence.lastDraftSavedAt,
    lastDraftSavedLabel: draftPersistence.lastDraftSavedLabel,
    draftWasRestored: draftRestored,
    draftRestoredAt: draftUpdatedAt,
    autoSyncStatus: autoSync.status,
    autoSyncMessage: autoSync.message,
    autoSyncPending: autoSync.pending,
    next,
    prev,
    submit,
    clearForm,
  }
}
