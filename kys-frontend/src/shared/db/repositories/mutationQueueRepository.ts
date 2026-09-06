import { db } from '../kysLocalDb'
import type { OfflineMutationRecord, OfflineMutationStatus } from '../types'
import { generateIdempotencyKey } from '../../utils/idempotency'

export type EnqueueMutationInput = Omit<OfflineMutationRecord, 'sequence' | 'createdAt' | 'idempotencyKey' | 'status' | 'retryCount' | 'lastError'> & {
  idempotencyKey?: string
  sequence?: number
  createdAt?: string
  status?: OfflineMutationStatus
  retryCount?: number
  lastError?: string | null
}

export const mutationQueueRepository = {
  /**
   * Calculates the next deterministic sequence number for a faculty member.
   */
  async getNextSequence(facultyId: number): Promise<number> {
    const lastMutation = await db.offlineMutations
      .where('facultyId')
      .equals(facultyId)
      .sortBy('sequence')
      .then((items) => items[items.length - 1])
    return lastMutation ? lastMutation.sequence + 1 : 1
  },

  /**
   * Enqueues an offline mutation atomically inside a Dexie transaction.
   * Assigns a stable idempotencyKey and sequence number if not provided.
   */
  async enqueueMutation(input: EnqueueMutationInput): Promise<string> {
    const idempotencyKey = input.idempotencyKey || generateIdempotencyKey()
    const createdAt = input.createdAt || new Date().toISOString()

    return db.transaction('rw', db.offlineMutations, async () => {
      // Deduplicate if mutation with same idempotency key already exists
      const existing = await db.offlineMutations.get(idempotencyKey)
      if (existing) {
        return existing.idempotencyKey
      }

      let sequence = input.sequence
      if (!sequence || sequence <= 0) {
        const lastMutation = await db.offlineMutations
          .where('facultyId')
          .equals(input.facultyId)
          .sortBy('sequence')
          .then((items) => items[items.length - 1])
        sequence = lastMutation ? lastMutation.sequence + 1 : 1
      }

      const record: OfflineMutationRecord = {
        idempotencyKey,
        sequence,
        facultyId: input.facultyId,
        operationType: input.operationType,
        targetEntity: input.targetEntity,
        targetId: input.targetId,
        payload: input.payload,
        status: input.status || 'pending',
        retryCount: input.retryCount || 0,
        lastError: input.lastError || null,
        createdAt,
      }

      await db.offlineMutations.put(record)
      return idempotencyKey
    })
  },

  /**
   * Retrieves pending or syncing mutations for a specific faculty, ordered by sequence.
   */
  async getPendingMutationsForFaculty(facultyId: number): Promise<OfflineMutationRecord[]> {
    return db.offlineMutations
      .where('facultyId')
      .equals(facultyId)
      .sortBy('sequence')
      .then((records) => records.filter((m) => m.status === 'pending' || m.status === 'syncing'))
  },

  /**
   * Retrieves all mutations with 'conflict' status for a specific faculty member.
   */
  async getConflictingMutationsForFaculty(facultyId: number): Promise<OfflineMutationRecord[]> {
    return db.offlineMutations
      .where('facultyId')
      .equals(facultyId)
      .sortBy('sequence')
      .then((records) => records.filter((m) => m.status === 'conflict'))
  },

  /**
   * Retrieves all mutations for a specific faculty in strict sequence order.
   */
  async getMutationsInSequenceOrder(facultyId: number): Promise<OfflineMutationRecord[]> {
    return db.offlineMutations
      .where('facultyId')
      .equals(facultyId)
      .sortBy('sequence')
  },

  /**
   * Fetches a single mutation by idempotency key.
   */
  async getMutationByIdempotencyKey(idempotencyKey: string): Promise<OfflineMutationRecord | undefined> {
    return db.offlineMutations.get(idempotencyKey)
  },

  /**
   * Updates the status and optional error message of a mutation.
   */
  async updateMutationStatus(
    idempotencyKey: string,
    status: OfflineMutationStatus,
    lastError: string | null = null,
  ): Promise<number> {
    return db.offlineMutations.update(idempotencyKey, {
      status,
      lastError,
    })
  },

  /**
   * Increments the retry count for a mutation.
   */
  async incrementRetryCount(idempotencyKey: string): Promise<number> {
    const existing = await db.offlineMutations.get(idempotencyKey)
    if (!existing) return 0

    return db.offlineMutations.update(idempotencyKey, {
      retryCount: existing.retryCount + 1,
    })
  },

  /**
   * Records an error string on a mutation record.
   */
  async recordError(idempotencyKey: string, error: string): Promise<number> {
    return db.offlineMutations.update(idempotencyKey, {
      lastError: error,
    })
  },

  /**
   * Returns total count of pending mutations for a specific faculty member.
   */
  async getPendingCountForFaculty(facultyId: number): Promise<number> {
    const pending = await this.getPendingMutationsForFaculty(facultyId)
    return pending.length
  },

  /**
   * Removes a mutation record from the queue.
   */
  async removeMutation(idempotencyKey: string): Promise<void> {
    await db.offlineMutations.delete(idempotencyKey)
  },

  /**
   * Purges all queued mutations for a specific faculty member.
   */
  async clearForFaculty(facultyId: number): Promise<void> {
    await db.offlineMutations.where('facultyId').equals(facultyId).delete()
  },
}
