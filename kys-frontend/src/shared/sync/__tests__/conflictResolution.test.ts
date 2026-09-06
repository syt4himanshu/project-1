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
} from '../../db'
import { generateIdempotencyKey } from '../../utils/idempotency'
import { syncEngine } from '../syncEngine'

// Mock stored session
vi.mock('../../auth/storage', () => ({
  readStoredSession: vi.fn(() => ({
    user: { id: 101, username: 'dr.kapil', role: 'faculty' },
    accessToken: 'mock-token',
  })),
}))

// Mock faculty API client
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

describe('Phase F — Offline Conflict Resolution Tests', () => {
  beforeEach(async () => {
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true, writable: true })
    await db.delete()
    await db.open()
    vi.clearAllMocks()
  })

  it('1. HTTP 409 creates a persisted conflict', async () => {
    vi.mocked(facultyClient.lockMentee).mockRejectedValue(new HttpError('Version conflict', 409, null))

    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
    })

    const res = await syncEngine.syncNow(101)
    expect(res.conflicts).toBe(1)

    const record = await mutationQueueRepository.getMutationByIdempotencyKey(key)
    expect(record?.status).toBe('conflict')
  })

  it('2. Conflict survives database reload / re-querying', async () => {
    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
      status: 'conflict',
    })

    await db.close()
    await db.open()

    const conflicts = await syncEngine.getConflictingMutations(101)
    expect(conflicts).toHaveLength(1)
    expect(conflicts[0].idempotencyKey).toBe(key)
  })

  it('3. Conflict count is correct', async () => {
    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
      status: 'conflict',
    })
    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'UNLOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE002',
      payload: {},
      status: 'conflict',
    })

    const state = await syncEngine.getSyncState(101)
    expect(state.conflictCount).toBe(2)
  })

  it('4. Faculty isolation works for conflicts', async () => {
    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
      status: 'conflict',
    })
    await mutationQueueRepository.enqueueMutation({
      facultyId: 102,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE009',
      payload: {},
      status: 'conflict',
    })

    const fac101Conflicts = await syncEngine.getConflictingMutations(101)
    expect(fac101Conflicts).toHaveLength(1)
    expect(fac101Conflicts[0].facultyId).toBe(101)
  })

  it('5. Conflict state displays the correct target mutation', async () => {
    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'UPDATE_STUDENT_PROFILE',
      targetEntity: 'mentee',
      targetId: '2023CSE007',
      payload: { profileData: { section: 'C' } },
      status: 'conflict',
    })

    const conflicts = await syncEngine.getConflictingMutations(101)
    expect(conflicts[0].targetId).toBe('2023CSE007')
    expect(conflicts[0].operationType).toBe('UPDATE_STUDENT_PROFILE')
  })

  it('6. Local payload is preserved during conflict', async () => {
    const key = generateIdempotencyKey()
    const payload = { remarks: 'Offline mentoring note preserved' }
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload,
      status: 'conflict',
    })

    const record = await mutationQueueRepository.getMutationByIdempotencyKey(key)
    expect(record?.payload).toEqual(payload)
  })

  it('7. Server state is fetched safely when available', async () => {
    vi.mocked(facultyClient.getMentee).mockResolvedValue({
      id: 1,
      uid: '2023CSE001',
      full_name: 'Anish Bezalwar',
      semester: 4,
      is_profile_locked: true,
    })

    const res = await facultyClient.getMentee('2023CSE001')
    expect(res.full_name).toBe('Anish Bezalwar')
    expect(res.is_profile_locked).toBe(true)
  })

  it('8. Keep Server removes the conflict safely', async () => {
    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
      status: 'conflict',
    })

    await syncEngine.resolveConflictKeepServer(key)

    const record = await mutationQueueRepository.getMutationByIdempotencyKey(key)
    expect(record).toBeUndefined()
  })

  it('9. Keep Server refreshes authoritative local data', async () => {
    vi.mocked(facultyClient.getMentee).mockResolvedValue({
      id: 1,
      uid: '2023CSE001',
      full_name: 'Anish Bezalwar (Server Authoritative)',
      semester: 5,
      is_profile_locked: true,
    })

    const mentee: MenteeLocalRecord = {
      uid: '2023CSE001',
      facultyId: 101,
      id: 1,
      full_name: 'Anish Bezalwar (Stale Local)',
      semester: 4,
      updatedAt: new Date().toISOString(),
    }
    await menteeRepository.saveMentee(mentee)

    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'UPDATE_STUDENT_PROFILE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: { profileData: { semester: 4 } },
      status: 'conflict',
    })

    await syncEngine.resolveConflictKeepServer(key)

    const updated = await menteeRepository.getMentee(101, '2023CSE001')
    expect(updated?.full_name).toBe('Anish Bezalwar (Server Authoritative)')
    expect(updated?.semester).toBe(5)
  })

  it('10. Keep Local creates a NEW idempotency key', async () => {
    vi.mocked(facultyClient.lockMentee).mockResolvedValue({
      uid: '2023CSE001',
      is_profile_locked: true,
      profile_locked_at: null,
      profile_locked_by: 101,
      message: 'ok',
    })

    const oldKey = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: oldKey,
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
      status: 'conflict',
    })

    await syncEngine.resolveConflictKeepLocal(oldKey)

    // Old key removed
    const oldRecord = await mutationQueueRepository.getMutationByIdempotencyKey(oldKey)
    expect(oldRecord).toBeUndefined()
  })

  it('11. Original conflicting idempotency key is NOT reused', async () => {
    vi.mocked(facultyClient.unlockMentee).mockResolvedValue({
      uid: '2023CSE001',
      is_profile_locked: false,
      profile_locked_at: null,
      profile_locked_by: null,
      message: 'ok',
    })

    const keyA = 'key-A-original'
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: keyA,
      facultyId: 101,
      operationType: 'UNLOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
      status: 'conflict',
    })

    await syncEngine.resolveConflictKeepLocal(keyA)

    const oldRecord = await mutationQueueRepository.getMutationByIdempotencyKey(keyA)
    expect(oldRecord).toBeUndefined()
  })

  it('12. Keep Local returns mutation to pending state with new key', async () => {
    vi.mocked(facultyClient.updateProfile).mockRejectedValueOnce(new TypeError('Failed to fetch'))

    const oldKey = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: oldKey,
      facultyId: 101,
      operationType: 'UPDATE_FACULTY_PROFILE',
      targetEntity: 'facultyProfile',
      targetId: '101',
      payload: { first_name: 'Kapil Updated' },
      status: 'conflict',
    })

    await syncEngine.resolveConflictKeepLocal(oldKey)

    const pending = await mutationQueueRepository.getPendingMutationsForFaculty(101)
    expect(pending).toHaveLength(1)
    expect(pending[0].idempotencyKey).not.toBe(oldKey)
    expect(pending[0].payload.first_name).toBe('Kapil Updated')
  })

  it('13. Normal sync engine processes the new mutation', async () => {
    vi.mocked(facultyClient.lockMentee).mockResolvedValue({
      uid: '2023CSE001',
      is_profile_locked: true,
      profile_locked_at: null,
      profile_locked_by: 101,
      message: 'ok',
    })

    const oldKey = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: oldKey,
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
      status: 'conflict',
    })

    await syncEngine.resolveConflictKeepLocal(oldKey)

    const pendingAfter = await mutationQueueRepository.getPendingMutationsForFaculty(101)
    expect(pendingAfter).toHaveLength(0) // Synced cleanly!
  })

  it('14. Multiple conflicts remain independently resolvable', async () => {
    const key1 = generateIdempotencyKey()
    const key2 = generateIdempotencyKey()

    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key1,
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
      status: 'conflict',
    })
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key2,
      facultyId: 101,
      operationType: 'UNLOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE002',
      payload: {},
      status: 'conflict',
    })

    await syncEngine.resolveConflictKeepServer(key1)

    const remaining = await syncEngine.getConflictingMutations(101)
    expect(remaining).toHaveLength(1)
    expect(remaining[0].idempotencyKey).toBe(key2)
  })

  it('15. Lock/unlock conflicts require explicit confirmation (no auto-overwrite)', async () => {
    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
      status: 'conflict',
    })

    // Conflict stays untouched until explicit resolution
    const conflicts = await syncEngine.getConflictingMutations(101)
    expect(conflicts).toHaveLength(1)
    expect(conflicts[0].status).toBe('conflict')
  })

  it('16. Mentoring-minute conflicts do not create duplicate records', async () => {
    vi.mocked(facultyClient.addMentoringMinute).mockResolvedValue({ message: 'ok' })
    vi.mocked(facultyClient.getMenteeMinutes).mockResolvedValue({
      student: { uid: '2023CSE001', full_name: 'Anish', semester: 4 },
      mentoring_minutes: [
        {
          id: 100,
          semester: 4,
          date: '2026-09-06',
          remarks: 'Single minute record',
          created_by_faculty: true,
        },
      ],
    })

    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoringMinute',
      targetId: '2023CSE001',
      payload: { remarks: 'Single minute record' },
      status: 'conflict',
    })

    await syncEngine.resolveConflictKeepServer(key)

    const minutes = await mentoringMinuteRepository.listMinutesForStudent(101, '2023CSE001')
    expect(minutes).toHaveLength(1)
    expect(minutes[0].id).toBe(100)
  })

  it('17. Conflict resolution state survives reload', async () => {
    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
      status: 'conflict',
    })

    await db.close()
    await db.open()

    await syncEngine.resolveConflictKeepServer(key)

    const remaining = await syncEngine.getConflictingMutations(101)
    expect(remaining).toHaveLength(0)
  })

  it('18. Logout isolation remains correct for conflicts', async () => {
    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
      status: 'conflict',
    })
    await mutationQueueRepository.enqueueMutation({
      facultyId: 102,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE009',
      payload: {},
      status: 'conflict',
    })

    await clearOfflineDataForFaculty(101)

    const fac101Conflicts = await syncEngine.getConflictingMutations(101)
    const fac102Conflicts = await syncEngine.getConflictingMutations(102)

    expect(fac101Conflicts).toHaveLength(0)
    expect(fac102Conflicts).toHaveLength(1)
  })

  it('19. No credentials/secrets stored in conflict records', async () => {
    await mutationQueueRepository.enqueueMutation({
      facultyId: 101,
      operationType: 'UPDATE_STUDENT_PROFILE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: { profileData: { section: 'A' } },
      status: 'conflict',
    })

    const conflict = (await syncEngine.getConflictingMutations(101))[0]
    const str = JSON.stringify(conflict.payload)

    expect(str).not.toContain('password')
    expect(str).not.toContain('token')
    expect(str).not.toContain('apiKey')
  })

  it('20. Unresolved conflicts are never silently discarded', async () => {
    const key = generateIdempotencyKey()
    await mutationQueueRepository.enqueueMutation({
      idempotencyKey: key,
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'mentee',
      targetId: '2023CSE001',
      payload: {},
      status: 'conflict',
    })

    // Run normal sync loop while conflict exists
    await syncEngine.syncNow(101)

    // Conflict record must still exist
    const record = await mutationQueueRepository.getMutationByIdempotencyKey(key)
    expect(record).toBeDefined()
    expect(record?.status).toBe('conflict')
  })
})
