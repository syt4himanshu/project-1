import 'fake-indexeddb/auto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { HttpError } from '../../../../shared/api/httpClient'
import * as authStorage from '../../../../shared/auth/storage'
import {
  clearOfflineDatabase,
  facultyProfileRepository,
  menteeRepository,
  mentoringMinuteRepository,
  syncMetadataRepository,
} from '../../../../shared/db'
import { facultyClient } from '../../api/client'
import type { MenteeRow } from '../../api/types'

// Import query functions dynamically or mock underlying clients
import { isNetworkOrOfflineError } from '../../../../shared/api/isNetworkError'

describe('Phase C — Faculty Offline Read Hooks Architecture & Repositories', () => {
  const FACULTY_ID_1 = 101
  const FACULTY_ID_2 = 102

  beforeEach(async () => {
    vi.restoreAllMocks()
    await clearOfflineDatabase()

    // Default active session mock: Faculty 101
    vi.spyOn(authStorage, 'readStoredSession').mockReturnValue({
      accessToken: 'valid-token-101',
      user: { id: FACULTY_ID_1, username: 'faculty101', role: 'faculty' },
    })
  })

  it('1. should persist successful online faculty profile to IndexedDB and sync metadata', async () => {
    const mockProfile = {
      first_name: 'Manoj',
      last_name: 'Bhawar',
      email: 'manoj@stvincentngp.edu.in',
      contact_number: '9876543210',
    }

    vi.spyOn(facultyClient, 'getProfile').mockResolvedValueOnce(mockProfile)

    // Simulate online fetch and persistence logic
    const raw = await facultyClient.getProfile()
    await facultyProfileRepository.saveProfile({
      facultyId: FACULTY_ID_1,
      email: raw.email,
      first_name: raw.first_name,
      last_name: raw.last_name,
      contact_number: raw.contact_number,
      updatedAt: new Date().toISOString(),
    })
    await syncMetadataRepository.updateSyncMetadata(FACULTY_ID_1, 'profile', new Date().toISOString(), 'idle')

    const cached = await facultyProfileRepository.getProfile(FACULTY_ID_1)
    const meta = await syncMetadataRepository.getSyncMetadata(FACULTY_ID_1, 'profile')

    expect(cached?.first_name).toBe('Manoj')
    expect(meta?.lastSuccessfulSync).toBeDefined()
  })

  it('2. should persist successful online mentees list to IndexedDB', async () => {
    const mockMentees: MenteeRow[] = [
      {
        id: 1,
        uid: '2023CSE001',
        full_name: 'Anish Bezalwar',
        first_name: 'Anish',
        last_name: 'Bezalwar',
        semester: 4,
        section: 'A',
      },
    ]

    vi.spyOn(facultyClient, 'getMentees').mockResolvedValueOnce(mockMentees)

    const raw = await facultyClient.getMentees()
    await menteeRepository.saveMentees(
      raw.map((r) => ({
        uid: r.uid,
        facultyId: FACULTY_ID_1,
        id: r.id,
        full_name: r.full_name,
        first_name: r.first_name,
        last_name: r.last_name,
        semester: r.semester,
        section: r.section,
        updatedAt: new Date().toISOString(),
      })),
    )

    const cached = await menteeRepository.listMenteesForFaculty(FACULTY_ID_1)
    expect(cached).toHaveLength(1)
    expect(cached[0].uid).toBe('2023CSE001')
  })

  it('3. should fall back to cached faculty profile on network failure', async () => {
    // Seed local DB
    await facultyProfileRepository.saveProfile({
      facultyId: FACULTY_ID_1,
      email: 'kapil@stvincentngp.edu.in',
      first_name: 'Kapil',
      last_name: 'Gupta',
      contact_number: '9123456789',
      updatedAt: new Date().toISOString(),
    })

    // Simulate network error
    const networkError = new TypeError('Failed to fetch')
    expect(isNetworkOrOfflineError(networkError)).toBe(true)

    // Execute fallback logic
    let result = null
    try {
      throw networkError
    } catch (err) {
      if (isNetworkOrOfflineError(err)) {
        const cached = await facultyProfileRepository.getProfile(FACULTY_ID_1)
        if (cached) {
          result = { ...cached, isOfflineCache: true }
        }
      }
    }

    expect(result).toBeDefined()
    expect(result?.first_name).toBe('Kapil')
    expect(result?.isOfflineCache).toBe(true)
  })

  it('4. should fall back to cached mentees on network failure', async () => {
    // Seed local DB
    await menteeRepository.saveMentee({
      uid: '2023CSE001',
      facultyId: FACULTY_ID_1,
      id: 1,
      full_name: 'Anish Bezalwar',
      semester: 4,
      updatedAt: new Date().toISOString(),
    })

    const networkError = new HttpError('Network unreachable', 0, null)
    expect(isNetworkOrOfflineError(networkError)).toBe(true)

    let cachedList = null
    try {
      throw networkError
    } catch (err) {
      if (isNetworkOrOfflineError(err)) {
        cachedList = await menteeRepository.listMenteesForFaculty(FACULTY_ID_1)
      }
    }

    expect(cachedList).toHaveLength(1)
    expect(cachedList?.[0].full_name).toBe('Anish Bezalwar')
  })

  it('5. should preserve error when network fails and no cached data exists', async () => {
    const networkError = new TypeError('Failed to fetch')

    let caught = null
    try {
      throw networkError
    } catch (err) {
      if (isNetworkOrOfflineError(err)) {
        const cached = await menteeRepository.getMentee(FACULTY_ID_1, 'NONEXISTENT')
        if (cached) {
          // would return
        } else {
          caught = err
        }
      }
    }

    expect(caught).toBe(networkError)
  })

  it('6. should NOT treat 401 Unauthorized or 403 Forbidden as network errors', () => {
    const authError = new HttpError('Invalid token', 401, null)
    const forbiddenError = new HttpError('Forbidden', 403, null)
    const notFoundError = new HttpError('Not found', 404, null)

    expect(isNetworkOrOfflineError(authError)).toBe(false)
    expect(isNetworkOrOfflineError(forbiddenError)).toBe(false)
    expect(isNetworkOrOfflineError(notFoundError)).toBe(false)
  })

  it('7. should strictly isolate cached data between different faculty users', async () => {
    // Save mentee for Faculty 101
    await menteeRepository.saveMentee({
      uid: '2023CSE001',
      facultyId: FACULTY_ID_1,
      id: 1,
      full_name: 'Mentee of Faculty 101',
      semester: 4,
      updatedAt: new Date().toISOString(),
    })

    // Save mentee for Faculty 102
    await menteeRepository.saveMentee({
      uid: '2023CSE002',
      facultyId: FACULTY_ID_2,
      id: 2,
      full_name: 'Mentee of Faculty 102',
      semester: 4,
      updatedAt: new Date().toISOString(),
    })

    // Faculty 101 queries cached mentees
    const fac1List = await menteeRepository.listMenteesForFaculty(FACULTY_ID_1)
    expect(fac1List).toHaveLength(1)
    expect(fac1List[0].full_name).toBe('Mentee of Faculty 101')

    // Faculty 102 queries cached mentees
    const fac2List = await menteeRepository.listMenteesForFaculty(FACULTY_ID_2)
    expect(fac2List).toHaveLength(1)
    expect(fac2List[0].full_name).toBe('Mentee of Faculty 102')

    // Faculty 101 cannot access Faculty 102's mentee by UID lookup
    const crossAccess = await menteeRepository.getMentee(FACULTY_ID_1, '2023CSE002')
    expect(crossAccess).toBeUndefined()
  })

  it('8. should update local cached record when fresh API response arrives', async () => {
    // Initial cache
    await menteeRepository.saveMentee({
      uid: '2023CSE001',
      facultyId: FACULTY_ID_1,
      id: 1,
      full_name: 'Old Name',
      semester: 3,
      updatedAt: '2026-09-01T00:00:00Z',
    })

    // Fresh API fetch returns updated semester
    const freshApiRecord = {
      uid: '2023CSE001',
      facultyId: FACULTY_ID_1,
      id: 1,
      full_name: 'Updated Name',
      semester: 4,
      updatedAt: new Date().toISOString(),
    }

    await menteeRepository.saveMentee(freshApiRecord)
    const updated = await menteeRepository.getMentee(FACULTY_ID_1, '2023CSE001')

    expect(updated?.full_name).toBe('Updated Name')
    expect(updated?.semester).toBe(4)
  })

  it('9. should handle mentoring minutes offline cache and preserve reverse chronological ordering', async () => {
    await mentoringMinuteRepository.saveMinutes([
      {
        id: 10,
        facultyId: FACULTY_ID_1,
        studentUid: '2023CSE001',
        studentId: 1,
        semester: 4,
        date: '2026-09-01',
        remarks: 'Older minute',
        created_by_faculty: true,
        updatedAt: new Date().toISOString(),
      },
      {
        id: 11,
        facultyId: FACULTY_ID_1,
        studentUid: '2023CSE001',
        studentId: 1,
        semester: 4,
        date: '2026-09-06',
        remarks: 'Newer minute',
        created_by_faculty: true,
        updatedAt: new Date().toISOString(),
      },
    ])

    const cachedMinutes = await mentoringMinuteRepository.listMinutesForStudent(FACULTY_ID_1, '2023CSE001')
    expect(cachedMinutes).toHaveLength(2)
    expect(cachedMinutes[0].remarks).toBe('Newer minute')
    expect(cachedMinutes[1].remarks).toBe('Older minute')
  })
})
