import type { QueryClient } from '@tanstack/react-query'
import { facultyClient, facultyKeys, normalizeMenteeMinutes, normalizeMenteePayload, normalizeProfile } from '../../modules/faculty/api'
import { HttpError } from '../api/httpClient'
import { isNetworkOrOfflineError } from '../api/isNetworkError'
import { readStoredSession } from '../auth/storage'
import {
  facultyProfileRepository,
  menteeRepository,
  mentoringMinuteRepository,
  mutationQueueRepository,
  syncMetadataRepository,
  type OfflineMutationRecord,
} from '../db'
import { generateIdempotencyKey } from '../utils/idempotency'

export interface SyncState {
  isSyncing: boolean
  pendingCount: number
  conflictCount: number
  failedCount: number
  lastSyncAt: string | null
  lastError: string | null
}

export interface SyncResult {
  processed: number
  succeeded: number
  failed: number
  conflicts: number
  stoppedOnNetworkError: boolean
}

export interface SessionContext {
  facultyId: number
  accessToken: string
}

type SyncListener = () => void

function getCurrentFacultyId(): number | null {
  const session = readStoredSession()
  if (session?.user && typeof session.user.id === 'number') {
    return session.user.id
  }
  return null
}

function getCurrentSessionContext(): SessionContext | null {
  const session = readStoredSession()
  if (session?.user && typeof session.user.id === 'number' && session.accessToken) {
    return {
      facultyId: session.user.id,
      accessToken: session.accessToken,
    }
  }
  return null
}

const MAX_RETRIES = 5

export class SyncEngine {
  private isSyncing = false
  private lastSyncAt: string | null = null
  private lastError: string | null = null
  private listeners = new Set<SyncListener>()
  private queryClient: QueryClient | null = null
  private activeAbortController: AbortController | null = null

  public setQueryClient(qc: QueryClient) {
    this.queryClient = qc
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notify() {
    this.listeners.forEach((l) => l())
  }

  public abortActiveSync(): void {
    if (this.activeAbortController) {
      this.activeAbortController.abort()
      this.activeAbortController = null
    }
    this.isSyncing = false
    this.notify()
  }

  public async getSyncState(facultyIdOverride?: number): Promise<SyncState> {
    const facultyId = facultyIdOverride ?? getCurrentFacultyId()
    if (!facultyId) {
      return {
        isSyncing: this.isSyncing,
        pendingCount: 0,
        conflictCount: 0,
        failedCount: 0,
        lastSyncAt: this.lastSyncAt,
        lastError: this.lastError,
      }
    }

    const mutations = await mutationQueueRepository.getMutationsInSequenceOrder(facultyId)
    const pendingCount = mutations.filter((m) => m.status === 'pending' || m.status === 'syncing').length
    const conflictCount = mutations.filter((m) => m.status === 'conflict').length
    const failedCount = mutations.filter((m) => m.status === 'failed').length

    return {
      isSyncing: this.isSyncing,
      pendingCount,
      conflictCount,
      failedCount,
      lastSyncAt: this.lastSyncAt,
      lastError: this.lastError,
    }
  }

  public async getConflictingMutations(facultyIdOverride?: number): Promise<OfflineMutationRecord[]> {
    const facultyId = facultyIdOverride ?? getCurrentFacultyId()
    if (!facultyId) return []
    return mutationQueueRepository.getConflictingMutationsForFaculty(facultyId)
  }

  public async resolveConflictKeepServer(idempotencyKey: string): Promise<void> {
    const mutation = await mutationQueueRepository.getMutationByIdempotencyKey(idempotencyKey)
    if (!mutation) return

    await mutationQueueRepository.removeMutation(idempotencyKey)
    await this.reconcileLocalCache(mutation)
    this.notify()
  }

  public async resolveConflictKeepLocal(
    idempotencyKey: string,
    updatedPayload?: Record<string, unknown>,
  ): Promise<void> {
    const mutation = await mutationQueueRepository.getMutationByIdempotencyKey(idempotencyKey)
    if (!mutation) return

    // Remove old conflict record so idempotency key is NEVER reused
    await mutationQueueRepository.removeMutation(idempotencyKey)

    // Enqueue a new mutation record with a NEW idempotency key
    const newIdempotencyKey = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: newIdempotencyKey,
      facultyId: mutation.facultyId,
      operationType: mutation.operationType,
      targetEntity: mutation.targetEntity,
      targetId: mutation.targetId,
      payload: updatedPayload ?? mutation.payload,
      status: 'pending',
    })

    this.notify()
    await this.syncNow(mutation.facultyId)
  }

  public async syncNow(
    facultyIdOverride?: number,
    sessionContextOverride?: SessionContext,
  ): Promise<SyncResult> {
    const sessionCtx = sessionContextOverride ?? getCurrentSessionContext()
    const facultyId = facultyIdOverride ?? sessionCtx?.facultyId ?? getCurrentFacultyId()

    if (!facultyId || !sessionCtx) {
      return { processed: 0, succeeded: 0, failed: 0, conflicts: 0, stoppedOnNetworkError: false }
    }

    if (this.isSyncing) {
      return { processed: 0, succeeded: 0, failed: 0, conflicts: 0, stoppedOnNetworkError: false }
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return { processed: 0, succeeded: 0, failed: 0, conflicts: 0, stoppedOnNetworkError: true }
    }

    const lockName = `kys_sync_lock_faculty_${facultyId}`
    if (typeof navigator !== 'undefined' && 'locks' in navigator && navigator.locks?.request) {
      return navigator.locks.request(lockName, { ifAvailable: true }, async (lock) => {
        if (!lock) {
          // Another tab is actively syncing this faculty's queue
          return { processed: 0, succeeded: 0, failed: 0, conflicts: 0, stoppedOnNetworkError: false }
        }
        return this.runSyncLoop(facultyId, sessionCtx)
      })
    }

    return this.runSyncLoop(facultyId, sessionCtx)
  }

  private async runSyncLoop(
    facultyId: number,
    sessionCtx: SessionContext,
  ): Promise<SyncResult> {
    this.isSyncing = true
    this.lastError = null
    this.activeAbortController = new AbortController()
    const signal = this.activeAbortController.signal
    this.notify()

    let processed = 0
    let succeeded = 0
    let failed = 0
    let conflicts = 0
    let stoppedOnNetworkError = false

    try {
      const mutations = await mutationQueueRepository.getPendingMutationsForFaculty(facultyId)

      for (const mutation of mutations) {
        if (signal.aborted) {
          this.lastError = 'Sync aborted: operation cancelled.'
          break
        }

        // Session validation guard: verify active session matches initial bound session
        const currentCtx = getCurrentSessionContext()
        if (!currentCtx || currentCtx.facultyId !== sessionCtx.facultyId) {
          await mutationQueueRepository.updateMutationStatus(
            mutation.idempotencyKey,
            'pending',
            'Sync aborted: session changed mid-sync',
          )
          this.lastError = 'Sync stopped: session changed. Mutations preserved for replay.'
          this.notify()
          break
        }

        processed++
        await mutationQueueRepository.updateMutationStatus(mutation.idempotencyKey, 'syncing')
        this.notify()

        try {
          await this.executeMutation(mutation, sessionCtx, signal)
          await this.reconcileLocalCache(mutation)
          await mutationQueueRepository.removeMutation(mutation.idempotencyKey)
          await syncMetadataRepository.updateSyncMetadata(
            facultyId,
            mutation.targetEntity,
            new Date().toISOString(),
            'idle',
          )
          succeeded++
        } catch (error) {
          if (signal.aborted) {
            await mutationQueueRepository.updateMutationStatus(
              mutation.idempotencyKey,
              'pending',
              'Sync aborted mid-request',
            )
            this.lastError = 'Sync aborted: session ended or cancelled.'
            this.notify()
            break
          }

          if (error instanceof HttpError) {
            const status = error.status

            if (status === 401 || status === 403) {
              await mutationQueueRepository.updateMutationStatus(
                mutation.idempotencyKey,
                'failed',
                `Authentication failed (${status}): ${error.message}`,
              )
              failed++
              this.lastError = `Authentication error (${status}). Please log in again.`
              this.notify()
              break
            }

            if (status === 409) {
              await mutationQueueRepository.updateMutationStatus(
                mutation.idempotencyKey,
                'conflict',
                `Server conflict (409): ${error.message}`,
              )
              conflicts++
              this.notify()
              break
            }

            if (status === 404 || status === 422) {
              await mutationQueueRepository.updateMutationStatus(
                mutation.idempotencyKey,
                'failed',
                `Request error (${status}): ${error.message}`,
              )
              failed++
              this.notify()
              break
            }

            if (status === 429 || status >= 500) {
              const retries = mutation.retryCount + 1
              await mutationQueueRepository.incrementRetryCount(mutation.idempotencyKey)
              if (retries >= MAX_RETRIES) {
                await mutationQueueRepository.updateMutationStatus(
                  mutation.idempotencyKey,
                  'failed',
                  `Max retries reached (${status}): ${error.message}`,
                )
                failed++
              } else {
                await mutationQueueRepository.updateMutationStatus(
                  mutation.idempotencyKey,
                  'pending',
                  `Server error (${status}), retry ${retries}/${MAX_RETRIES}: ${error.message}`,
                )
              }
              this.notify()
              break
            }
          }

          if (isNetworkOrOfflineError(error)) {
            await mutationQueueRepository.incrementRetryCount(mutation.idempotencyKey)
            await mutationQueueRepository.updateMutationStatus(
              mutation.idempotencyKey,
              'pending',
              'Network connection unavailable',
            )
            stoppedOnNetworkError = true
            this.lastError = 'Network connection lost during sync.'
            this.notify()
            break
          }

          await mutationQueueRepository.updateMutationStatus(
            mutation.idempotencyKey,
            'failed',
            error instanceof Error ? error.message : String(error),
          )
          failed++
          this.notify()
          break
        }
      }

      this.lastSyncAt = new Date().toISOString()
    } finally {
      this.isSyncing = false
      this.activeAbortController = null
      this.notify()
    }

    return { processed, succeeded, failed, conflicts, stoppedOnNetworkError }
  }

  public async executeMutation(
    mutation: OfflineMutationRecord,
    sessionContext?: SessionContext,
    signal?: AbortSignal,
  ): Promise<unknown> {
    const { operationType, targetId, payload, idempotencyKey } = mutation
    const headers = { 'X-Idempotency-Key': idempotencyKey }
    const options = {
      headers,
      token: sessionContext?.accessToken,
      signal,
    }

    switch (operationType) {
      case 'ADD_MENTORING_MINUTE': {
        const { uid, remarks, mentor_remarks, issues, suggestion, action } = payload as Record<string, string>
        return facultyClient.addMentoringMinute(
          uid || targetId,
          {
            remarks,
            mentor_remarks,
            issues,
            suggestion,
            action,
          },
          options,
        )
      }

      case 'UPDATE_STUDENT_PROFILE': {
        const { profileData } = payload as { profileData: unknown }
        return facultyClient.updateMenteeProfile(targetId, profileData, options)
      }

      case 'LOCK_MENTEE': {
        return facultyClient.lockMentee(targetId, options)
      }

      case 'UNLOCK_MENTEE': {
        return facultyClient.unlockMentee(targetId, options)
      }

      case 'UPDATE_FACULTY_PROFILE': {
        return facultyClient.updateProfile(payload as Record<string, string>, options)
      }

      default:
        throw new Error(`Unsupported mutation operationType: ${operationType}`)
    }
  }

  public async reconcileLocalCache(mutation: OfflineMutationRecord): Promise<void> {
    const facultyId = mutation.facultyId
    const targetId = mutation.targetId

    switch (mutation.operationType) {
      case 'ADD_MENTORING_MINUTE': {
        await mentoringMinuteRepository.deleteMinute(`pending-${mutation.idempotencyKey}`)

        try {
          const raw = await facultyClient.getMenteeMinutes(targetId, { limit: 20, offset: 0 })
          const normalized = normalizeMenteeMinutes(raw)
          if (normalized.mentoring_minutes.length > 0) {
            await mentoringMinuteRepository.saveMinutes(
              normalized.mentoring_minutes.map((m) => ({
                id: m.id,
                facultyId,
                studentUid: targetId,
                studentId: normalized.student?.uid ? Number(normalized.student.uid) || 0 : 0,
                semester: m.semester,
                date: m.date,
                remarks: m.remarks,
                mentor_remarks: m.mentor_remarks,
                issues: m.issues,
                suggestion: m.suggestion,
                action: m.action,
                created_by_faculty: m.created_by_faculty,
                updatedAt: new Date().toISOString(),
              })),
            )
          }
        } catch {
          // Secondary fetch error ignored
        }

        if (this.queryClient) {
          void this.queryClient.invalidateQueries({ queryKey: facultyKeys.menteeMinutes(targetId) })
        }
        break
      }

      case 'UPDATE_STUDENT_PROFILE':
      case 'LOCK_MENTEE':
      case 'UNLOCK_MENTEE': {
        try {
          const raw = await facultyClient.getMentee(targetId)
          const normalized = normalizeMenteePayload(raw)
          await menteeRepository.saveMentee({
            uid: normalized.uid,
            facultyId,
            id: normalized.id,
            full_name: normalized.full_name,
            first_name: normalized.first_name,
            middle_name: normalized.middle_name,
            last_name: normalized.last_name,
            semester: normalized.semester,
            section: normalized.section,
            year_of_admission: normalized.year_of_admission,
            is_profile_locked: normalized.is_profile_locked,
            profile_locked_at: normalized.profile_locked_at,
            profile_locked_by: normalized.profile_locked_by,
            detailPayload: normalized,
            updatedAt: new Date().toISOString(),
          })
        } catch {
          // Secondary fetch error ignored
        }

        if (this.queryClient) {
          void this.queryClient.invalidateQueries({ queryKey: facultyKeys.mentee(targetId) })
          void this.queryClient.invalidateQueries({ queryKey: facultyKeys.mentees() })
        }
        break
      }

      case 'UPDATE_FACULTY_PROFILE': {
        try {
          const raw = await facultyClient.getProfile()
          const normalized = normalizeProfile(raw)
          await facultyProfileRepository.saveProfile({
            facultyId,
            email: normalized.email,
            first_name: normalized.first_name,
            last_name: normalized.last_name,
            contact_number: normalized.contact_number,
            updatedAt: new Date().toISOString(),
          })
        } catch {
          // Secondary fetch error ignored
        }

        if (this.queryClient) {
          void this.queryClient.invalidateQueries({ queryKey: facultyKeys.profile() })
        }
        break
      }
    }
  }
}

export const syncEngine = new SyncEngine()

/**
 * Initializes automatic sync listeners on browser 'online' event.
 */
export function initSyncListeners(): () => void {
  if (typeof window === 'undefined') return () => { }

  const handleOnline = () => {
    void syncEngine.syncNow()
  }

  window.addEventListener('online', handleOnline)

  if (typeof navigator !== 'undefined' && navigator.onLine) {
    void syncEngine.syncNow()
  }

  return () => {
    window.removeEventListener('online', handleOnline)
  }
}
