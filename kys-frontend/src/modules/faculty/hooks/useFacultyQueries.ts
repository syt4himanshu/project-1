import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isNetworkOrOfflineError } from '../../../shared/api/isNetworkError'
import { readStoredSession } from '../../../shared/auth/storage'
import {
  facultyProfileRepository,
  menteeRepository,
  mentoringMinuteRepository,
  mutationQueueRepository,
  syncMetadataRepository,
  type MenteeLocalRecord,
  type MentoringMinuteLocalRecord,
} from '../../../shared/db'
import { generateIdempotencyKey } from '../../../shared/utils/idempotency'
import {
  facultyClient,
  facultyKeys,
  normalizeMenteeMinutes,
  normalizeMenteePayload,
  normalizeMenteesPage,
  normalizeProfile,
} from '../api'
import type {
  AddMinuteInput,
  ChangePasswordInput,
  ChatbotRequest,
  MenteePayload,
  MenteeRow,
} from '../api'

const DEFAULT_PAGE_SIZE = 20
const DEFAULT_MINUTES_PAGE_SIZE = 20

function getCurrentFacultyId(): number | null {
  const session = readStoredSession()
  if (session?.user && typeof session.user.id === 'number') {
    return session.user.id
  }
  return null
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export function useFacultyProfile() {
  return useQuery({
    queryKey: facultyKeys.profile(),
    queryFn: async () => {
      const facultyId = getCurrentFacultyId()
      try {
        const raw = await facultyClient.getProfile()
        const normalized = normalizeProfile(raw)
        if (facultyId) {
          void facultyProfileRepository.saveProfile({
            facultyId,
            email: normalized.email,
            first_name: normalized.first_name,
            last_name: normalized.last_name,
            contact_number: normalized.contact_number,
            updatedAt: new Date().toISOString(),
          })
          void syncMetadataRepository.updateSyncMetadata(
            facultyId,
            'profile',
            new Date().toISOString(),
            'idle',
          )
        }
        return normalized
      } catch (error) {
        if (facultyId && isNetworkOrOfflineError(error)) {
          const cached = await facultyProfileRepository.getProfile(facultyId)
          if (cached) {
            return {
              first_name: cached.first_name,
              last_name: cached.last_name,
              email: cached.email,
              contact_number: cached.contact_number,
              isOfflineCache: true,
            }
          }
        }
        throw error
      }
    },
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Parameters<typeof facultyClient.updateProfile>[0]) => {
      const facultyId = getCurrentFacultyId()
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

      if (isOffline && facultyId) {
        const idempotencyKey = generateIdempotencyKey()
        await mutationQueueRepository.enqueueMutation({
          idempotencyKey,
          facultyId,
          operationType: 'UPDATE_FACULTY_PROFILE',
          targetEntity: 'facultyProfile',
          targetId: String(facultyId),
          payload: { ...data },
        })

        const cached = await facultyProfileRepository.getProfile(facultyId)
        if (cached) {
          await facultyProfileRepository.saveProfile({
            ...cached,
            first_name: data.first_name ?? cached.first_name,
            last_name: data.last_name ?? cached.last_name,
            contact_number: data.contact_number ?? cached.contact_number,
            updatedAt: new Date().toISOString(),
          })
        }

        return {
          isOfflineQueued: true,
          idempotencyKey,
          message: 'Saved offline — will sync when online.',
        }
      }

      try {
        return await facultyClient.updateProfile(data)
      } catch (error) {
        if (facultyId && isNetworkOrOfflineError(error)) {
          const idempotencyKey = generateIdempotencyKey()
          await mutationQueueRepository.enqueueMutation({
            idempotencyKey,
            facultyId,
            operationType: 'UPDATE_FACULTY_PROFILE',
            targetEntity: 'facultyProfile',
            targetId: String(facultyId),
            payload: { ...data },
          })

          const cached = await facultyProfileRepository.getProfile(facultyId)
          if (cached) {
            await facultyProfileRepository.saveProfile({
              ...cached,
              first_name: data.first_name ?? cached.first_name,
              last_name: data.last_name ?? cached.last_name,
              contact_number: data.contact_number ?? cached.contact_number,
              updatedAt: new Date().toISOString(),
            })
          }

          return {
            isOfflineQueued: true,
            idempotencyKey,
            message: 'Saved offline — will sync when online.',
          }
        }
        throw error
      }
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: facultyKeys.profile() }),
  })
}

// ─── Mentees (paginated) ──────────────────────────────────────────────────────

export function useMenteesPage(offset = 0, limit = DEFAULT_PAGE_SIZE) {
  return useQuery({
    queryKey: facultyKeys.menteesPage(limit, offset),
    queryFn: async () => {
      const facultyId = getCurrentFacultyId()
      try {
        const raw = await facultyClient.getMentees({ limit, offset })
        const normalized = normalizeMenteesPage(raw, limit, offset)
        if (facultyId && normalized.rows.length > 0) {
          const records: MenteeLocalRecord[] = normalized.rows.map((row) => ({
            uid: row.uid,
            facultyId,
            id: row.id,
            full_name: row.full_name,
            first_name: row.first_name,
            middle_name: row.middle_name,
            last_name: row.last_name,
            semester: row.semester,
            section: row.section,
            year_of_admission: row.year_of_admission,
            is_profile_locked: row.is_profile_locked,
            profile_locked_at: row.profile_locked_at,
            profile_locked_by: row.profile_locked_by,
            mobile_no: row.mobile_no,
            photo_url: row.photo_url,
            photo_preview_url: row.photo_preview_url,
            updatedAt: new Date().toISOString(),
          }))
          void menteeRepository.saveMentees(records)
          void syncMetadataRepository.updateSyncMetadata(
            facultyId,
            'mentees',
            new Date().toISOString(),
            'idle',
          )
        }
        return normalized
      } catch (error) {
        if (facultyId && isNetworkOrOfflineError(error)) {
          const cachedRecords = await menteeRepository.listMenteesForFaculty(facultyId)
          if (cachedRecords.length > 0) {
            const rows: MenteeRow[] = cachedRecords.map((r) => ({
              id: r.id,
              uid: r.uid,
              full_name: r.full_name,
              first_name: r.first_name,
              middle_name: r.middle_name,
              last_name: r.last_name,
              semester: r.semester,
              section: r.section,
              year_of_admission: r.year_of_admission,
              is_profile_locked: r.is_profile_locked,
              profile_locked_at: r.profile_locked_at,
              profile_locked_by: r.profile_locked_by,
              mobile_no: r.mobile_no,
              photo_url: r.photo_url,
              photo_preview_url: r.photo_preview_url,
            }))
            const pageRows = rows.slice(offset, offset + limit)
            return {
              rows: pageRows.length > 0 ? pageRows : rows,
              limit,
              offset,
              isLastPage: offset + limit >= rows.length,
              isOfflineCache: true,
            }
          }
        }
        throw error
      }
    },
  })
}

/** Full list for chatbot/selectors — capped at backend max of 100 */
export function useMentees() {
  return useQuery({
    queryKey: facultyKeys.mentees(),
    queryFn: async () => {
      const facultyId = getCurrentFacultyId()
      try {
        const raw = await facultyClient.getMentees({ limit: 100, offset: 0 })
        const normalized = normalizeMenteesPage(raw, 100, 0).rows
        if (facultyId && normalized.length > 0) {
          const records: MenteeLocalRecord[] = normalized.map((row) => ({
            uid: row.uid,
            facultyId,
            id: row.id,
            full_name: row.full_name,
            first_name: row.first_name,
            middle_name: row.middle_name,
            last_name: row.last_name,
            semester: row.semester,
            section: row.section,
            year_of_admission: row.year_of_admission,
            is_profile_locked: row.is_profile_locked,
            profile_locked_at: row.profile_locked_at,
            profile_locked_by: row.profile_locked_by,
            photo_url: row.photo_url,
            photo_preview_url: row.photo_preview_url,
            updatedAt: new Date().toISOString(),
          }))
          void menteeRepository.saveMentees(records)
          void syncMetadataRepository.updateSyncMetadata(
            facultyId,
            'mentees',
            new Date().toISOString(),
            'idle',
          )
        }
        return normalized
      } catch (error) {
        if (facultyId && isNetworkOrOfflineError(error)) {
          const cachedRecords = await menteeRepository.listMenteesForFaculty(facultyId)
          if (cachedRecords.length > 0) {
            return cachedRecords.map((r) => ({
              id: r.id,
              uid: r.uid,
              full_name: r.full_name,
              first_name: r.first_name,
              middle_name: r.middle_name,
              last_name: r.last_name,
              semester: r.semester,
              section: r.section,
              year_of_admission: r.year_of_admission,
              is_profile_locked: r.is_profile_locked,
              profile_locked_at: r.profile_locked_at,
              profile_locked_by: r.profile_locked_by,
              mobile_no: r.mobile_no,
              photo_url: r.photo_url,
              photo_preview_url: r.photo_preview_url,
            }))
          }
        }
        throw error
      }
    },
  })
}

// ─── Mentee detail ───────────────────────────────────────────────────────────

export function useMentee(uid: string) {
  return useQuery({
    queryKey: facultyKeys.mentee(uid),
    queryFn: async () => {
      const facultyId = getCurrentFacultyId()
      try {
        const raw = await facultyClient.getMentee(uid)
        const normalized = normalizeMenteePayload(raw)
        if (facultyId) {
          void menteeRepository.saveMentee({
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
          void syncMetadataRepository.updateSyncMetadata(
            facultyId,
            `mentee:${uid}`,
            new Date().toISOString(),
            'idle',
          )
        }
        return normalized
      } catch (error) {
        if (facultyId && isNetworkOrOfflineError(error)) {
          const cached = await menteeRepository.getMentee(facultyId, uid)
          if (cached?.detailPayload) {
            return {
              ...cached.detailPayload,
              isOfflineCache: true,
            }
          }
          if (cached) {
            return {
              id: cached.id,
              uid: cached.uid,
              full_name: cached.full_name,
              first_name: cached.first_name,
              middle_name: cached.middle_name,
              last_name: cached.last_name,
              semester: cached.semester,
              section: cached.section,
              year_of_admission: cached.year_of_admission,
              is_profile_locked: cached.is_profile_locked,
              profile_locked_at: cached.profile_locked_at,
              profile_locked_by: cached.profile_locked_by,
              isOfflineCache: true,
            }
          }
        }
        throw error
      }
    },
    enabled: Boolean(uid),
  })
}

export function useLockMentee(uid: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const facultyId = getCurrentFacultyId()
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

      if (isOffline && facultyId) {
        const idempotencyKey = generateIdempotencyKey()
        await mutationQueueRepository.enqueueMutation({
          idempotencyKey,
          facultyId,
          operationType: 'LOCK_MENTEE',
          targetEntity: 'mentee',
          targetId: uid,
          payload: { uid, is_profile_locked: true },
        })

        const cached = await menteeRepository.getMentee(facultyId, uid)
        if (cached) {
          await menteeRepository.saveMentee({
            ...cached,
            is_profile_locked: true,
            profile_locked_at: new Date().toISOString(),
            profile_locked_by: facultyId,
            updatedAt: new Date().toISOString(),
          })
        }

        return {
          isOfflineQueued: true,
          idempotencyKey,
          message: 'Saved offline — will sync when online.',
        }
      }

      try {
        return await facultyClient.lockMentee(uid)
      } catch (error) {
        if (facultyId && isNetworkOrOfflineError(error)) {
          const idempotencyKey = generateIdempotencyKey()
          await mutationQueueRepository.enqueueMutation({
            idempotencyKey,
            facultyId,
            operationType: 'LOCK_MENTEE',
            targetEntity: 'mentee',
            targetId: uid,
            payload: { uid, is_profile_locked: true },
          })

          const cached = await menteeRepository.getMentee(facultyId, uid)
          if (cached) {
            await menteeRepository.saveMentee({
              ...cached,
              is_profile_locked: true,
              profile_locked_at: new Date().toISOString(),
              profile_locked_by: facultyId,
              updatedAt: new Date().toISOString(),
            })
          }

          return {
            isOfflineQueued: true,
            idempotencyKey,
            message: 'Saved offline — will sync when online.',
          }
        }
        throw error
      }
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: facultyKeys.mentees() }),
        qc.invalidateQueries({ queryKey: facultyKeys.mentee(uid) }),
      ])
    },
  })
}

export function useUnlockMentee(uid: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      const facultyId = getCurrentFacultyId()
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

      if (isOffline && facultyId) {
        const idempotencyKey = generateIdempotencyKey()
        await mutationQueueRepository.enqueueMutation({
          idempotencyKey,
          facultyId,
          operationType: 'UNLOCK_MENTEE',
          targetEntity: 'mentee',
          targetId: uid,
          payload: { uid, is_profile_locked: false },
        })

        const cached = await menteeRepository.getMentee(facultyId, uid)
        if (cached) {
          await menteeRepository.saveMentee({
            ...cached,
            is_profile_locked: false,
            profile_locked_at: null,
            profile_locked_by: null,
            updatedAt: new Date().toISOString(),
          })
        }

        return {
          isOfflineQueued: true,
          idempotencyKey,
          message: 'Saved offline — will sync when online.',
        }
      }

      try {
        return await facultyClient.unlockMentee(uid)
      } catch (error) {
        if (facultyId && isNetworkOrOfflineError(error)) {
          const idempotencyKey = generateIdempotencyKey()
          await mutationQueueRepository.enqueueMutation({
            idempotencyKey,
            facultyId,
            operationType: 'UNLOCK_MENTEE',
            targetEntity: 'mentee',
            targetId: uid,
            payload: { uid, is_profile_locked: false },
          })

          const cached = await menteeRepository.getMentee(facultyId, uid)
          if (cached) {
            await menteeRepository.saveMentee({
              ...cached,
              is_profile_locked: false,
              profile_locked_at: null,
              profile_locked_by: null,
              updatedAt: new Date().toISOString(),
            })
          }

          return {
            isOfflineQueued: true,
            idempotencyKey,
            message: 'Saved offline — will sync when online.',
          }
        }
        throw error
      }
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: facultyKeys.mentees() }),
        qc.invalidateQueries({ queryKey: facultyKeys.mentee(uid) }),
      ])
    },
  })
}

export function useUpdateMenteeProfile(uid: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: unknown) => {
      const facultyId = getCurrentFacultyId()
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

      if (isOffline && facultyId) {
        const idempotencyKey = generateIdempotencyKey()
        await mutationQueueRepository.enqueueMutation({
          idempotencyKey,
          facultyId,
          operationType: 'UPDATE_STUDENT_PROFILE',
          targetEntity: 'mentee',
          targetId: uid,
          payload: { uid, profileData: data },
        })

        const cached = await menteeRepository.getMentee(facultyId, uid)
        if (cached) {
          const updatedPayload = {
            ...(cached.detailPayload ?? {}),
            ...(data as Record<string, unknown>),
          } as MenteePayload
          await menteeRepository.saveMentee({
            ...cached,
            detailPayload: updatedPayload,
            updatedAt: new Date().toISOString(),
          })
        }

        return {
          isOfflineQueued: true,
          idempotencyKey,
          message: 'Saved offline — will sync when online.',
        }
      }

      try {
        return await facultyClient.updateMenteeProfile(uid, data)
      } catch (error) {
        if (facultyId && isNetworkOrOfflineError(error)) {
          const idempotencyKey = generateIdempotencyKey()
          await mutationQueueRepository.enqueueMutation({
            idempotencyKey,
            facultyId,
            operationType: 'UPDATE_STUDENT_PROFILE',
            targetEntity: 'mentee',
            targetId: uid,
            payload: { uid, profileData: data },
          })

          const cached = await menteeRepository.getMentee(facultyId, uid)
          if (cached) {
            const updatedPayload = {
              ...(cached.detailPayload ?? {}),
              ...(data as Record<string, unknown>),
            } as MenteePayload
            await menteeRepository.saveMentee({
              ...cached,
              detailPayload: updatedPayload,
              updatedAt: new Date().toISOString(),
            })
          }

          return {
            isOfflineQueued: true,
            idempotencyKey,
            message: 'Saved offline — will sync when online.',
          }
        }
        throw error
      }
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: facultyKeys.mentees() }),
        qc.invalidateQueries({ queryKey: facultyKeys.mentee(uid) }),
      ])
    },
  })
}

// ─── Mentoring minutes (paginated) ───────────────────────────────────────────

export function useMenteeMinutes(uid: string, offset = 0, limit = DEFAULT_MINUTES_PAGE_SIZE) {
  return useQuery({
    queryKey: facultyKeys.menteeMinutes(uid, offset),
    queryFn: async () => {
      const facultyId = getCurrentFacultyId()
      try {
        const raw = await facultyClient.getMenteeMinutes(uid, { limit, offset })
        const normalized = normalizeMenteeMinutes(raw)
        if (facultyId && normalized.mentoring_minutes.length > 0) {
          const records: MentoringMinuteLocalRecord[] = normalized.mentoring_minutes.map(
            (m) => ({
              id: m.id,
              facultyId,
              studentUid: uid,
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
            }),
          )
          void mentoringMinuteRepository.saveMinutes(records)
          void syncMetadataRepository.updateSyncMetadata(
            facultyId,
            `minutes:${uid}`,
            new Date().toISOString(),
            'idle',
          )
        }
        return normalized
      } catch (error) {
        if (facultyId && isNetworkOrOfflineError(error)) {
          const cachedMinutes = await mentoringMinuteRepository.listMinutesForStudent(
            facultyId,
            uid,
          )
          const menteeRecord = await menteeRepository.getMentee(facultyId, uid)
          if (cachedMinutes.length > 0 || menteeRecord) {
            return {
              student: {
                uid: menteeRecord?.uid ?? uid,
                full_name: menteeRecord?.full_name ?? '',
                semester: menteeRecord?.semester ?? 1,
                section: menteeRecord?.section ?? '',
                year_of_admission: menteeRecord?.year_of_admission ?? 2023,
              },
              mentoring_minutes: cachedMinutes.map((c) => ({
                id: Number(c.id) || 0,
                semester: c.semester,
                date: c.date,
                remarks: c.remarks,
                mentor_remarks: c.mentor_remarks,
                issues: c.issues,
                suggestion: c.suggestion,
                action: c.action,
                created_by_faculty: c.created_by_faculty,
              })),
              isOfflineCache: true,
            }
          }
        }
        throw error
      }
    },
    enabled: Boolean(uid),
  })
}

export function useAddMentoringMinute(uid: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: AddMinuteInput) => {
      const facultyId = getCurrentFacultyId()
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine

      if (isOffline && facultyId) {
        const idempotencyKey = generateIdempotencyKey()
        await mutationQueueRepository.enqueueMutation({
          idempotencyKey,
          facultyId,
          operationType: 'ADD_MENTORING_MINUTE',
          targetEntity: 'mentoringMinute',
          targetId: uid,
          payload: { uid, ...data },
        })

        const cachedMentee = await menteeRepository.getMentee(facultyId, uid)
        const semester = cachedMentee?.semester ?? 1

        await mentoringMinuteRepository.saveMinutes([
          {
            id: `pending-${idempotencyKey}`,
            facultyId,
            studentUid: uid,
            studentId: 0,
            semester,
            date: new Date().toISOString(),
            remarks: data.remarks,
            mentor_remarks: data.mentor_remarks,
            issues: data.issues,
            suggestion: data.suggestion,
            action: data.action,
            created_by_faculty: true,
            updatedAt: new Date().toISOString(),
          },
        ])

        return {
          isOfflineQueued: true,
          idempotencyKey,
          message: "Saved offline — will sync when you're back online.",
        }
      }

      try {
        return await facultyClient.addMentoringMinute(uid, data)
      } catch (error) {
        if (facultyId && isNetworkOrOfflineError(error)) {
          const idempotencyKey = generateIdempotencyKey()
          await mutationQueueRepository.enqueueMutation({
            idempotencyKey,
            facultyId,
            operationType: 'ADD_MENTORING_MINUTE',
            targetEntity: 'mentoringMinute',
            targetId: uid,
            payload: { uid, ...data },
          })

          const cachedMentee = await menteeRepository.getMentee(facultyId, uid)
          const semester = cachedMentee?.semester ?? 1

          await mentoringMinuteRepository.saveMinutes([
            {
              id: `pending-${idempotencyKey}`,
              facultyId,
              studentUid: uid,
              studentId: 0,
              semester,
              date: new Date().toISOString(),
              remarks: data.remarks,
              mentor_remarks: data.mentor_remarks,
              issues: data.issues,
              suggestion: data.suggestion,
              action: data.action,
              created_by_faculty: true,
              updatedAt: new Date().toISOString(),
            },
          ])

          return {
            isOfflineQueued: true,
            idempotencyKey,
            message: "Saved offline — will sync when you're back online.",
          }
        }
        throw error
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: facultyKeys.menteeMinutes(uid) })
    },
  })
}

export function usePendingMutationsCount() {
  const facultyId = getCurrentFacultyId()
  return useQuery({
    queryKey: ['faculty', 'pendingMutationsCount', facultyId],
    queryFn: async () => {
      if (!facultyId) return 0
      return mutationQueueRepository.getPendingCountForFaculty(facultyId)
    },
    enabled: Boolean(facultyId),
  })
}

export function useUploadMenteePhoto(uid: string, studentId: number | null) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => {
      if (!studentId) {
        throw new Error('Student identifier is missing.')
      }

      return facultyClient.uploadMenteePhoto(studentId, file)
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: facultyKeys.mentees() }),
        qc.invalidateQueries({ queryKey: ['faculty', 'mentees'] }),
        qc.invalidateQueries({ queryKey: facultyKeys.mentee(uid) }),
      ])
    },
  })
}

// ─── Chatbot ─────────────────────────────────────────────────────────────────

export function useFacultyChatbot() {
  return useMutation({
    mutationKey: facultyKeys.chatbot(),
    mutationFn: (payload: ChatbotRequest) => facultyClient.askChatbot(payload),
  })
}

// ─── Change password ─────────────────────────────────────────────────────────

export function useChangePassword() {
  return useMutation({
    mutationKey: facultyKeys.changePassword(),
    mutationFn: (payload: ChangePasswordInput) => facultyClient.changePassword(payload),
  })
}
