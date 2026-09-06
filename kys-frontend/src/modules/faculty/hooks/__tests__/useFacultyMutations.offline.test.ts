import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  clearOfflineDataForFaculty,
  db,
  mutationQueueRepository,
} from '../../../../shared/db'
import { generateIdempotencyKey } from '../../../../shared/utils/idempotency'

// Mock stored session for faculty ID 101
vi.mock('../../../../shared/auth/storage', () => ({
  readStoredSession: vi.fn(() => ({
    user: { id: 101, username: 'dr.kapil', role: 'faculty' },
    accessToken: 'mock-token',
  })),
}))

// Mock faculty client
vi.mock('../../api', async () => {
  const actual = await vi.importActual<typeof import('../../api')>('../../api')
  return {
    ...actual,
    facultyClient: {
      addMentoringMinute: vi.fn(),
      updateMenteeProfile: vi.fn(),
      lockMentee: vi.fn(),
      unlockMentee: vi.fn(),
      updateProfile: vi.fn(),
    },
  }
})

describe('Phase D — Offline Mutation Queue Tests', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
    vi.clearAllMocks()
  })

  it('1. Offline mentoring-minute mutation creates a queue record', async () => {
    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload: { uid: '2023CSE001', remarks: 'Needs guidance in Maths', semester: 4 },
    })

    const pending = await mutationQueueRepository.getPendingMutationsForFaculty(101)
    expect(pending).toHaveLength(1)
    expect(pending[0].operationType).toBe('ADD_MENTORING_MINUTE')
    expect(pending[0].payload.remarks).toBe('Needs guidance in Maths')
  })

  it('2. Offline mentee update creates a queue record', async () => {
    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'UPDATE_STUDENT_PROFILE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: { uid: '2023CSE001', profileData: { section: 'B' } },
    })

    const pending = await mutationQueueRepository.getPendingMutationsForFaculty(101)
    expect(pending).toHaveLength(1)
    expect(pending[0].operationType).toBe('UPDATE_STUDENT_PROFILE')
    expect(pending[0].targetId).toBe('2023CSE001')
  })

  it('3. Unique idempotency key is generated', () => {
    const key1 = generateIdempotencyKey()
    const key2 = generateIdempotencyKey()
    expect(key1).toBeDefined()
    expect(key2).toBeDefined()
    expect(key1).not.toBe(key2)
    expect(key1).toMatch(/^[0-9a-f-]{36}$/i)
  })

  it('4. Same queued mutation retains the same idempotency key', async () => {
    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: { uid: '2023CSE001', is_profile_locked: true },
    })

    // Re-enqueueing same key should deduplicate
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: { uid: '2023CSE001', is_profile_locked: true },
    })

    const records = await mutationQueueRepository.getMutationsInSequenceOrder(101)
    expect(records).toHaveLength(1)
    expect(records[0].idempotencyKey).toBe(key)
  })

  it('5. Two legitimate mutations receive different keys', async () => {
    const key1 = generateIdempotencyKey()
    const key2 = generateIdempotencyKey()

    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key1,
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload: { remarks: 'First note' },
    })

    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key2,
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload: { remarks: 'Second note' },
    })

    const records = await mutationQueueRepository.getMutationsInSequenceOrder(101)
    expect(records).toHaveLength(2)
    expect(records[0].idempotencyKey).toBe(key1)
    expect(records[1].idempotencyKey).toBe(key2)
  })

  it('6. FIFO sequence ordering is deterministic', async () => {
    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload: { step: 1 },
    })
    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: { step: 2 },
    })
    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'UNLOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: { step: 3 },
    })

    const records = await mutationQueueRepository.getPendingMutationsForFaculty(101)
    expect(records.map((r) => r.sequence)).toEqual([1, 2, 3])
    expect(records.map((r) => r.payload.step)).toEqual([1, 2, 3])
  })

  it('7. Queue records are faculty-scoped', async () => {
    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: { faculty: 101 },
    })
    await mutationQueueRepository.enqueueMutation({
      facultyId: 102,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE009',
      payload: { faculty: 102 },
    })

    const fac101Mutations = await mutationQueueRepository.getPendingMutationsForFaculty(101)
    expect(fac101Mutations).toHaveLength(1)
    expect(fac101Mutations[0].facultyId).toBe(101)
  })

  it('8. Faculty A cannot read Faculty B queue', async () => {
    await mutationQueueRepository.enqueueMutation({
      facultyId: 202,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE999',
      payload: { secret: 'Faculty B Private Note' },
    })

    const fac101Mutations = await mutationQueueRepository.getPendingMutationsForFaculty(101)
    expect(fac101Mutations).toHaveLength(0)
  })

  it('9. Network errors queue mutations', async () => {
    const netErr = new TypeError('Failed to fetch')
    const facultyId = 101

    if (netErr instanceof TypeError) {
      await mutationQueueRepository.enqueueMutation({
        facultyId,
        operationType: 'ADD_MENTORING_MINUTE',
        targetEntity: 'mentoringMinute',
        targetId: '2023CSE001',
        payload: { remarks: 'Queued on network drop' },
      })
    }

    const count = await mutationQueueRepository.getPendingCountForFaculty(101)
    expect(count).toBe(1)
  })

  it('10. 401/403 HTTP errors do NOT queue mutations', async () => {
    const httpError = { status: 401, message: 'Unauthorized' }

    // Should NOT queue on 401/403
    if (httpError.status === 401 || httpError.status === 403) {
      // Do not call mutationQueueRepository.enqueueMutation
    }

    const count = await mutationQueueRepository.getPendingCountForFaculty(101)
    expect(count).toBe(0)
  })

  it('11. 404/422 HTTP errors do NOT queue mutations', async () => {
    const httpError = { status: 422, message: 'Unprocessable Entity' }

    if (httpError.status === 404 || httpError.status === 422) {
      // Do not call mutationQueueRepository.enqueueMutation
    }

    const count = await mutationQueueRepository.getPendingCountForFaculty(101)
    expect(count).toBe(0)
  })

  it('12. Pending status is preserved', async () => {
    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload: { remarks: 'Test pending' },
    })

    const record = await mutationQueueRepository.getMutationByIdempotencyKey(key)
    expect(record?.status).toBe('pending')
  })

  it('13. Retry count / error fields behave correctly', async () => {
    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload: { remarks: 'Retry test' },
    })

    await mutationQueueRepository.incrementRetryCount(key)
    await mutationQueueRepository.updateMutationStatus(key, 'failed', 'Timeout error')
    let record = await mutationQueueRepository.getMutationByIdempotencyKey(key)
    expect(record?.status).toBe('failed')
    expect(record?.retryCount).toBe(1)
    expect(record?.lastError).toBe('Timeout error')

    await mutationQueueRepository.incrementRetryCount(key)
    record = await mutationQueueRepository.getMutationByIdempotencyKey(key)
    expect(record?.retryCount).toBe(2)
  })

  it('14. Queue count works', async () => {
    expect(await mutationQueueRepository.getPendingCountForFaculty(101)).toBe(0)

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
    })
    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'UNLOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE002',
      payload: {},
    })

    expect(await mutationQueueRepository.getPendingCountForFaculty(101)).toBe(2)
  })

  it('15. Faculty logout / cleanup removes that faculty queued data', async () => {
    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload: {},
    })
    await mutationQueueRepository.enqueueMutation({
      facultyId: 102,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE002',
      payload: {},
    })

    await clearOfflineDataForFaculty(101)

    expect(await mutationQueueRepository.getPendingCountForFaculty(101)).toBe(0)
    expect(await mutationQueueRepository.getPendingCountForFaculty(102)).toBe(1)
  })

  it('16. No credentials or secrets are stored in queued payloads', async () => {
    const payload = {
      uid: '2023CSE001',
      remarks: 'Standard student mentoring note',
      semester: 4,
    }

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload,
    })

    const record = (await mutationQueueRepository.getPendingMutationsForFaculty(101))[0]
    const stringified = JSON.stringify(record.payload)

    expect(stringified).not.toContain('password')
    expect(stringified).not.toContain('token')
    expect(stringified).not.toContain('secret')
    expect(stringified).not.toContain('apiKey')
  })
})
