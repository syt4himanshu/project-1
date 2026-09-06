import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HttpError } from '../../api/httpClient'
import {
  clearOfflineDataForFaculty,
  db,
  menteeRepository,
  mentoringMinuteRepository,
  mutationQueueRepository,
  type MenteeLocalRecord,
  type MentoringMinuteLocalRecord,
} from '../../db'
import { generateIdempotencyKey } from '../../utils/idempotency'
import { syncEngine } from '../syncEngine'

// Mock session
vi.mock('../../auth/storage', () => ({
  readStoredSession: vi.fn(() => ({
    user: { id: 101, username: 'dr.kapil', role: 'faculty' },
    accessToken: 'mock-token',
  })),
}))

// Mock faculty client
vi.mock('../../../modules/faculty/api', async () => {
  const actual = await vi.importActual<typeof import('../../../modules/faculty/api')>('../../../modules/faculty/api')
  return {
    ...actual,
    facultyClient: {
      addMentoringMinute: vi.fn(),
      updateMenteeProfile: vi.fn(),
      lockMentee: vi.fn(),
      unlockMentee: vi.fn(),
      updateProfile: vi.fn(),
      getMenteeMinutes: vi.fn(),
      getMentee: vi.fn(),
      getProfile: vi.fn(),
    },
  }
})

import { facultyClient } from '../../../modules/faculty/api'

describe('Phase E — Offline Sync Engine Tests', () => {
  beforeEach(async () => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true, writable: true })
    await db.delete()
    await db.open()
    vi.clearAllMocks()
  })

  it('1. Pending mutation is discovered by syncEngine', async () => {
    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload: { uid: '2023CSE001', remarks: 'Session note' },
    })

    const state = await syncEngine.getSyncState(101)
    expect(state.pendingCount).toBe(1)
  })

  it('2. Pending mutations are processed in FIFO sequence order', async () => {
    const orderLog: string[] = []
    vi.mocked(facultyClient.addMentoringMinute).mockImplementation(async () => {
      orderLog.push('minute')
      return { message: 'ok' }
    })
    vi.mocked(facultyClient.lockMentee).mockImplementation(async () => {
      orderLog.push('lock')
      return { uid: '2023CSE001', is_profile_locked: true, profile_locked_at: null, profile_locked_by: 101, message: 'ok' }
    })

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload: { remarks: 'First' },
    })

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
    })

    const res = await syncEngine.syncNow(101)
    expect(res.succeeded).toBe(2)
    expect(orderLog).toEqual(['minute', 'lock'])
  })

  it('3. Correct endpoint & method are selected for operations', async () => {
    vi.mocked(facultyClient.updateProfile).mockResolvedValue({ message: 'ok' })

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'UPDATE_FACULTY_PROFILE',
      targetEntity: 'facultyProfile',
      targetId: '101',
      payload: { first_name: 'Kapil', last_name: 'Gupta' },
    })

    await syncEngine.syncNow(101)
    expect(facultyClient.updateProfile).toHaveBeenCalledWith(
      { first_name: 'Kapil', last_name: 'Gupta' },
      expect.objectContaining({ headers: expect.any(Object) }),
    )
  })

  it('4. Correct payload is sent during sync', async () => {
    vi.mocked(facultyClient.addMentoringMinute).mockResolvedValue({ message: 'ok' })

    const payload = { uid: '2023CSE001', remarks: 'Specific payload test', suggestion: 'Study harder' }
    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload,
    })

    await syncEngine.syncNow(101)
    expect(facultyClient.addMentoringMinute).toHaveBeenCalledWith(
      '2023CSE001',
      expect.objectContaining({ remarks: 'Specific payload test', suggestion: 'Study harder' }),
      expect.any(Object),
    )
  })

  it('5. Idempotency key is sent in request header', async () => {
    vi.mocked(facultyClient.lockMentee).mockResolvedValue({
      uid: '2023CSE001',
      is_profile_locked: true,
      profile_locked_at: null,
      profile_locked_by: 101,
      message: 'ok',
    })

    const idempotencyKey = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey,
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
    })

    await syncEngine.syncNow(101)
    expect(facultyClient.lockMentee).toHaveBeenCalledWith(
      '2023CSE001',
      expect.objectContaining({ headers: { 'X-Idempotency-Key': idempotencyKey } }),
    )
  })

  it('6. Same idempotency key survives retry attempts', async () => {
    const idempotencyKey = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey,
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
    })

    vi.mocked(facultyClient.lockMentee).mockRejectedValueOnce(new HttpError('Server error', 500, null))
    await syncEngine.syncNow(101)

    // Mutation retained
    const record = await mutationQueueRepository.getMutationByIdempotencyKey(idempotencyKey)
    expect(record).toBeDefined()
    expect(record?.idempotencyKey).toBe(idempotencyKey)

    // Second sync attempt uses SAME key
    vi.mocked(facultyClient.lockMentee).mockResolvedValueOnce({
      uid: '2023CSE001',
      is_profile_locked: true,
      profile_locked_at: null,
      profile_locked_by: 101,
      message: 'ok',
    })
    await syncEngine.syncNow(101)
    expect(facultyClient.lockMentee).toHaveBeenLastCalledWith(
      '2023CSE001',
      expect.objectContaining({ headers: { 'X-Idempotency-Key': idempotencyKey } }),
    )
  })

  it('7. Successful mutation is removed from queue', async () => {
    vi.mocked(facultyClient.unlockMentee).mockResolvedValue({
      uid: '2023CSE001',
      is_profile_locked: false,
      profile_locked_at: null,
      profile_locked_by: null,
      message: 'ok',
    })

    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'UNLOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
    })

    await syncEngine.syncNow(101)
    const remaining = await mutationQueueRepository.getPendingMutationsForFaculty(101)
    expect(remaining).toHaveLength(0)
  })

  it('8. Successful mutation reconciles local cache', async () => {
    vi.mocked(facultyClient.lockMentee).mockResolvedValue({
      uid: '2023CSE001',
      is_profile_locked: true,
      profile_locked_at: '2026-09-06T12:00:00Z',
      profile_locked_by: 101,
      message: 'ok',
    })

    vi.mocked(facultyClient.getMentee).mockResolvedValue({
      id: 1,
      uid: '2023CSE001',
      full_name: 'Anish Bezalwar',
      semester: 4,
      is_profile_locked: true,
      profile_locked_at: '2026-09-06T12:00:00Z',
      profile_locked_by: 101,
    })

    const mentee: MenteeLocalRecord = {
      uid: '2023CSE001',
      facultyId: 101,
      id: 1,
      full_name: 'Anish Bezalwar',
      semester: 4,
      is_profile_locked: false,
      updatedAt: new Date().toISOString(),
    }
    await menteeRepository.saveMentee(mentee)

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
    })

    await syncEngine.syncNow(101)
    const updated = await menteeRepository.getMentee(101, '2023CSE001')
    expect(updated?.is_profile_locked).toBe(true)
  })

  it('9. React Query invalidation triggered on success', async () => {
    vi.mocked(facultyClient.updateProfile).mockResolvedValue({ message: 'ok' })

    const mockQc = { invalidateQueries: vi.fn() } as unknown as import('@tanstack/react-query').QueryClient
    syncEngine.setQueryClient(mockQc)

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'UPDATE_FACULTY_PROFILE',
      targetEntity: 'facultyProfile',
      targetId: '101',
      payload: { first_name: 'Kapil' },
    })

    await syncEngine.syncNow(101)
    expect(mockQc.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['faculty', 'profile'] })
  })

  it('10. Network failure retains mutation', async () => {
    vi.mocked(facultyClient.addMentoringMinute).mockRejectedValue(new TypeError('Failed to fetch'))

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload: { remarks: 'Test' },
    })

    const res = await syncEngine.syncNow(101)
    expect(res.stoppedOnNetworkError).toBe(true)

    const pending = await mutationQueueRepository.getPendingMutationsForFaculty(101)
    expect(pending).toHaveLength(1)
    expect(pending[0].status).toBe('pending')
  })

  it('11. Network failure increments retry count or retains state', async () => {
    vi.mocked(facultyClient.lockMentee).mockRejectedValue(new HttpError('Bad gateway', 502, null))

    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
    })

    await syncEngine.syncNow(101)
    const record = await mutationQueueRepository.getMutationByIdempotencyKey(key)
    expect(record?.retryCount).toBe(1)
    expect(record?.status).toBe('pending')
  })

  it('12. 401 HTTP error does not cause infinite retry', async () => {
    vi.mocked(facultyClient.addMentoringMinute).mockRejectedValue(new HttpError('Unauthorized', 401, null))

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload: { remarks: '401 test' },
    })

    const res = await syncEngine.syncNow(101)
    expect(res.failed).toBe(1)

    const mutations = await mutationQueueRepository.getMutationsInSequenceOrder(101)
    expect(mutations[0].status).toBe('failed')
  })

  it('13. 403 HTTP error marks mutation as failed and stops loop', async () => {
    vi.mocked(facultyClient.lockMentee).mockRejectedValue(new HttpError('Forbidden', 403, null))

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
    })

    const res = await syncEngine.syncNow(101)
    expect(res.failed).toBe(1)

    const state = await syncEngine.getSyncState(101)
    expect(state.failedCount).toBe(1)
  })

  it('14. 404 HTTP error is retained and classified as failed', async () => {
    vi.mocked(facultyClient.updateMenteeProfile).mockRejectedValue(new HttpError('Mentee not found', 404, null))

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'UPDATE_STUDENT_PROFILE',
      targetEntity: 'mentee',
      targetId: '2023CSE999',
      payload: { profileData: {} },
    })

    const res = await syncEngine.syncNow(101)
    expect(res.failed).toBe(1)

    const record = (await mutationQueueRepository.getMutationsInSequenceOrder(101))[0]
    expect(record.status).toBe('failed')
    expect(record.lastError).toContain('404')
  })

  it('15. 409 HTTP error becomes conflict status', async () => {
    vi.mocked(facultyClient.lockMentee).mockRejectedValue(new HttpError('Version conflict', 409, null))

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
    })

    const res = await syncEngine.syncNow(101)
    expect(res.conflicts).toBe(1)

    const record = (await mutationQueueRepository.getMutationsInSequenceOrder(101))[0]
    expect(record.status).toBe('conflict')
  })

  it('16. 422 HTTP error marks status as failed', async () => {
    vi.mocked(facultyClient.addMentoringMinute).mockRejectedValue(new HttpError('Remarks required', 422, null))

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload: { remarks: '' },
    })

    const res = await syncEngine.syncNow(101)
    expect(res.failed).toBe(1)

    const record = (await mutationQueueRepository.getMutationsInSequenceOrder(101))[0]
    expect(record.status).toBe('failed')
  })

  it('17. 429 rate limit retries with backoff', async () => {
    vi.mocked(facultyClient.lockMentee).mockRejectedValue(new HttpError('Rate limited', 429, null))

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
    })

    await syncEngine.syncNow(101)
    const record = (await mutationQueueRepository.getMutationsInSequenceOrder(101))[0]
    expect(record.status).toBe('pending')
    expect(record.retryCount).toBe(1)
  })

  it('18. 5xx server error retries with backoff', async () => {
    vi.mocked(facultyClient.updateProfile).mockRejectedValue(new HttpError('Internal Server Error', 500, null))

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'UPDATE_FACULTY_PROFILE',
      targetEntity: 'facultyProfile',
      targetId: '101',
      payload: { first_name: 'Test' },
    })

    await syncEngine.syncNow(101)
    const record = (await mutationQueueRepository.getMutationsInSequenceOrder(101))[0]
    expect(record.status).toBe('pending')
    expect(record.retryCount).toBe(1)
  })

  it('19. Retry limits prevent infinite loops', async () => {
    vi.mocked(facultyClient.lockMentee).mockRejectedValue(new HttpError('Persistent 500', 500, null))

    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
      retryCount: 4, // Next retry reaches max (5)
    })

    await syncEngine.syncNow(101)
    const record = await mutationQueueRepository.getMutationByIdempotencyKey(key)
    expect(record?.status).toBe('failed')
    expect(record?.retryCount).toBe(5)
  })

  it('20. Sync stops safely when connectivity disappears mid-loop', async () => {
    vi.mocked(facultyClient.addMentoringMinute).mockResolvedValueOnce({ message: 'ok' })
    vi.mocked(facultyClient.lockMentee).mockRejectedValueOnce(new TypeError('Failed to fetch'))

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload: { remarks: 'First' },
    })
    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
    })

    const res = await syncEngine.syncNow(101)
    expect(res.succeeded).toBe(1)
    expect(res.stoppedOnNetworkError).toBe(true)

    const remaining = await mutationQueueRepository.getPendingMutationsForFaculty(101)
    expect(remaining).toHaveLength(1)
    expect(remaining[0].operationType).toBe('LOCK_MENTEE')
  })

  it('21. Faculty isolation is preserved during sync', async () => {
    vi.mocked(facultyClient.lockMentee).mockResolvedValue({
      uid: '2023CSE001',
      is_profile_locked: true,
      profile_locked_at: null,
      profile_locked_by: 101,
      message: 'ok',
    })

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
    })
    await mutationQueueRepository.enqueueMutation({
      facultyId: 102,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE009',
      payload: {},
    })

    const res = await syncEngine.syncNow(101)
    expect(res.succeeded).toBe(1)

    const fac102Mutations = await mutationQueueRepository.getPendingMutationsForFaculty(102)
    expect(fac102Mutations).toHaveLength(1)
  })

  it('22. Multiple queued mutations preserve order', async () => {
    const executedOrder: string[] = []
    vi.mocked(facultyClient.lockMentee).mockImplementation(async () => {
      executedOrder.push('lock')
      return { uid: '2023CSE001', is_profile_locked: true, profile_locked_at: null, profile_locked_by: 101, message: 'ok' }
    })
    vi.mocked(facultyClient.unlockMentee).mockImplementation(async () => {
      executedOrder.push('unlock')
      return { uid: '2023CSE001', is_profile_locked: false, profile_locked_at: null, profile_locked_by: null, message: 'ok' }
    })

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
      targetId: '2023CSE001',
      payload: {},
    })

    await syncEngine.syncNow(101)
    expect(executedOrder).toEqual(['lock', 'unlock'])
  })

  it('23. Successful mentoring-minute replay reconciles local records', async () => {
    vi.mocked(facultyClient.addMentoringMinute).mockResolvedValue({ message: 'ok' })
    vi.mocked(facultyClient.getMenteeMinutes).mockResolvedValue({
      student: { uid: '2023CSE001', full_name: 'Anish', semester: 4 },
      mentoring_minutes: [
        {
          id: 55,
          semester: 4,
          date: '2026-09-06',
          remarks: 'Server confirmed minute',
          created_by_faculty: true,
        },
      ],
    })

    const idempotencyKey = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey,
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload: { remarks: 'Server confirmed minute' },
    })

    const tempRecord: MentoringMinuteLocalRecord = {
      id: `pending-${idempotencyKey}`,
      facultyId: 101,
      studentUid: '2023CSE001',
      studentId: 1,
      semester: 4,
      date: '2026-09-06',
      remarks: 'Pending local minute',
      created_by_faculty: true,
      updatedAt: new Date().toISOString(),
    }
    await mentoringMinuteRepository.saveMinutes([tempRecord])

    await syncEngine.syncNow(101)

    const minutes = await mentoringMinuteRepository.listMinutesForStudent(101, '2023CSE001')
    expect(minutes.some((m) => String(m.id).startsWith('pending-'))).toBe(false)
    expect(minutes.some((m) => Number(m.id) === 55)).toBe(true)
  })

  it('24. Logout/cleanup removes queue data cleanly', async () => {
    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
    })

    await clearOfflineDataForFaculty(101)
    const state = await syncEngine.getSyncState(101)
    expect(state.pendingCount).toBe(0)
  })

  it('25. No sensitive credentials stored in queue records', async () => {
    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload: { remarks: 'Standard text' },
    })

    const record = (await mutationQueueRepository.getPendingMutationsForFaculty(101))[0]
    expect(record.payload).not.toHaveProperty('password')
    expect(record.payload).not.toHaveProperty('token')
  })

  it('26. Empty queue completes cleanly', async () => {
    const res = await syncEngine.syncNow(101)
    expect(res.processed).toBe(0)
    expect(res.succeeded).toBe(0)
    expect(res.failed).toBe(0)
  })

  it('27. LOCK -> UNLOCK sequence ordering is strictly preserved', async () => {
    const calls: string[] = []
    vi.mocked(facultyClient.lockMentee).mockImplementation(async () => {
      calls.push('lock')
      return { uid: '2023CSE001', is_profile_locked: true, profile_locked_at: null, profile_locked_by: 101, message: 'ok' }
    })
    vi.mocked(facultyClient.unlockMentee).mockImplementation(async () => {
      calls.push('unlock')
      return { uid: '2023CSE001', is_profile_locked: false, profile_locked_at: null, profile_locked_by: null, message: 'ok' }
    })

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
      targetId: '2023CSE001',
      payload: {},
    })

    await syncEngine.syncNow(101)
    expect(calls).toEqual(['lock', 'unlock'])
  })

  it('28. Concurrent syncAttempts are guarded cleanly', async () => {
    vi.mocked(facultyClient.lockMentee).mockImplementation(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
      return { uid: '2023CSE001', is_profile_locked: true, profile_locked_at: null, profile_locked_by: 101, message: 'ok' }
    })

    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
    })

    const promise1 = syncEngine.syncNow(101)
    const promise2 = syncEngine.syncNow(101)

    const [res1, res2] = await Promise.all([promise1, promise2])
    expect(res1.processed + res2.processed).toBe(1)
  })
})
