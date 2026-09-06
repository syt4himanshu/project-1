import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearOfflineDataForFaculty,
  db,
  facultyProfileRepository,
  menteeRepository,
  mentoringMinuteRepository,
  mutationQueueRepository,
  syncMetadataRepository,
} from '../index'
import type {
  FacultyProfileRecord,
  MenteeLocalRecord,
  MentoringMinuteLocalRecord,
  OfflineMutationRecord,
} from '../types'

describe('KYSLocalDatabase & Repositories (Phase B Audit & Unit Tests)', () => {
  beforeEach(async () => {
    await db.delete()
    await db.open()
  })

  it('1. should initialize database tables cleanly', () => {
    expect(db.isOpen()).toBe(true)
    expect(db.name).toBe('kys_offline_db')
    expect(db.tables.map((t) => t.name)).toEqual([
      'facultyProfile',
      'mentees',
      'mentoringMinutes',
      'offlineMutations',
      'syncMetadata',
    ])
  })

  it('2. should insert and retrieve faculty profile records', async () => {
    const profile: FacultyProfileRecord = {
      facultyId: 101,
      email: 'kapil@stvincentngp.edu.in',
      first_name: 'Kapil',
      last_name: 'Gupta',
      contact_number: '9876543210',
      updatedAt: new Date().toISOString(),
    }

    await facultyProfileRepository.saveProfile(profile)
    const fetched = await facultyProfileRepository.getProfile(101)

    expect(fetched).toBeDefined()
    expect(fetched?.first_name).toBe('Kapil')
    expect(fetched?.email).toBe('kapil@stvincentngp.edu.in')
  })

  it('3. should insert, retrieve, update, and delete mentee records', async () => {
    const mentee: MenteeLocalRecord = {
      uid: '2023CSE001',
      facultyId: 101,
      id: 1,
      full_name: 'Anish Bezalwar',
      first_name: 'Anish',
      last_name: 'Bezalwar',
      semester: 4,
      section: 'A',
      year_of_admission: 2023,
      is_profile_locked: false,
      updatedAt: new Date().toISOString(),
    }

    await menteeRepository.saveMentee(mentee)
    const fetched = await menteeRepository.getMentee(101, '2023CSE001')
    expect(fetched?.full_name).toBe('Anish Bezalwar')

    // Update record
    await menteeRepository.saveMentee({
      ...mentee,
      is_profile_locked: true,
      profile_locked_at: new Date().toISOString(),
    })
    const updated = await menteeRepository.getMentee(101, '2023CSE001')
    expect(updated?.is_profile_locked).toBe(true)

    // Delete record
    await menteeRepository.deleteMentee('2023CSE001')
    const deleted = await menteeRepository.getMentee(101, '2023CSE001')
    expect(deleted).toBeUndefined()
  })

  it('4. should enforce strict faculty data isolation', async () => {
    const menteeFaculty1: MenteeLocalRecord = {
      uid: '2023CSE001',
      facultyId: 101,
      id: 1,
      full_name: 'Student Faculty 1',
      semester: 4,
      updatedAt: new Date().toISOString(),
    }

    const menteeFaculty2: MenteeLocalRecord = {
      uid: '2023CSE002',
      facultyId: 102,
      id: 2,
      full_name: 'Student Faculty 2',
      semester: 4,
      updatedAt: new Date().toISOString(),
    }

    await menteeRepository.saveMentees([menteeFaculty1, menteeFaculty2])

    const list1 = await menteeRepository.listMenteesForFaculty(101)
    const list2 = await menteeRepository.listMenteesForFaculty(102)

    expect(list1).toHaveLength(1)
    expect(list1[0].full_name).toBe('Student Faculty 1')

    expect(list2).toHaveLength(1)
    expect(list2[0].full_name).toBe('Student Faculty 2')

    // Faculty 1 cannot access Faculty 2's mentee by getMentee guard
    const unauthorized = await menteeRepository.getMentee(101, '2023CSE002')
    expect(unauthorized).toBeUndefined()
  })

  it('5. should clear data for one faculty without affecting another faculty', async () => {
    const mentee1: MenteeLocalRecord = {
      uid: '2023CSE001',
      facultyId: 101,
      id: 1,
      full_name: 'Student Faculty 1',
      semester: 4,
      updatedAt: new Date().toISOString(),
    }

    const mentee2: MenteeLocalRecord = {
      uid: '2023CSE002',
      facultyId: 102,
      id: 2,
      full_name: 'Student Faculty 2',
      semester: 4,
      updatedAt: new Date().toISOString(),
    }

    await menteeRepository.saveMentees([mentee1, mentee2])
    await clearOfflineDataForFaculty(101)

    const list1 = await menteeRepository.listMenteesForFaculty(101)
    const list2 = await menteeRepository.listMenteesForFaculty(102)

    expect(list1).toHaveLength(0)
    expect(list2).toHaveLength(1)
    expect(list2[0].full_name).toBe('Student Faculty 2')
  })

  it('6. should handle offline mentoring minute records with date ordering', async () => {
    const minute1: MentoringMinuteLocalRecord = {
      id: 'local-uuid-1',
      facultyId: 101,
      studentUid: '2023CSE001',
      studentId: 1,
      semester: 4,
      date: '2026-09-01',
      remarks: 'First minute',
      created_by_faculty: true,
      updatedAt: new Date().toISOString(),
    }

    const minute2: MentoringMinuteLocalRecord = {
      id: 'local-uuid-2',
      facultyId: 101,
      studentUid: '2023CSE001',
      studentId: 1,
      semester: 4,
      date: '2026-09-05',
      remarks: 'Second minute',
      created_by_faculty: true,
      updatedAt: new Date().toISOString(),
    }

    await mentoringMinuteRepository.saveMinutes([minute1, minute2])
    const minutes = await mentoringMinuteRepository.listMinutesForStudent(101, '2023CSE001')

    expect(minutes).toHaveLength(2)
    expect(minutes[0].remarks).toBe('Second minute') // Most recent date first
    expect(minutes[1].remarks).toBe('First minute')
  })

  it('7. should enqueue mutations with deterministic sequence ordering', async () => {
    const seq1 = await mutationQueueRepository.getNextSequence(101)
    const mut1: OfflineMutationRecord = {
      idempotencyKey: 'key-1',
      sequence: seq1,
      facultyId: 101,
      operationType: 'ADD_MENTORING_MINUTE',
      targetEntity: 'mentoring_minute',
      targetId: '2023CSE001',
      payload: { remarks: 'First note' },
      status: 'pending',
      retryCount: 0,
      lastError: null,
      createdAt: new Date().toISOString(),
    }
    await mutationQueueRepository.enqueueMutation(mut1)

    const seq2 = await mutationQueueRepository.getNextSequence(101)
    const mut2: OfflineMutationRecord = {
      idempotencyKey: 'key-2',
      sequence: seq2,
      facultyId: 101,
      operationType: 'LOCK_MENTEE',
      targetEntity: 'student',
      targetId: '2023CSE001',
      payload: { is_profile_locked: true },
      status: 'pending',
      retryCount: 0,
      lastError: null,
      createdAt: new Date().toISOString(),
    }
    await mutationQueueRepository.enqueueMutation(mut2)

    const pending = await mutationQueueRepository.getPendingMutationsForFaculty(101)
    expect(pending).toHaveLength(2)
    expect(pending[0].idempotencyKey).toBe('key-1')
    expect(pending[0].sequence).toBe(1)
    expect(pending[1].idempotencyKey).toBe('key-2')
    expect(pending[1].sequence).toBe(2)
  })

  it('8. should manage sync metadata correctly', async () => {
    await syncMetadataRepository.updateSyncMetadata(101, 'mentees', '2026-09-06T12:00:00Z', 'idle')
    const meta = await syncMetadataRepository.getSyncMetadata(101, 'mentees')

    expect(meta).toBeDefined()
    expect(meta?.lastSuccessfulSync).toBe('2026-09-06T12:00:00Z')
    expect(meta?.status).toBe('idle')
  })

  it('9. should reopen database cleanly without loss of schema integrity', async () => {
    await db.close()
    await db.open()
    expect(db.isOpen()).toBe(true)
  })
})
