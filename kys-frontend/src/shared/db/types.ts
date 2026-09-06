import type { FacultyProfile, MenteePayload, MenteeRow, MinuteRow } from '../../modules/faculty/api/types'

export type OfflineMutationType =
  | 'ADD_MENTORING_MINUTE'
  | 'UPDATE_STUDENT_PROFILE'
  | 'LOCK_MENTEE'
  | 'UNLOCK_MENTEE'
  | 'UPDATE_FACULTY_PROFILE'

export type OfflineMutationStatus = 'pending' | 'syncing' | 'failed' | 'conflict'

export interface FacultyProfileRecord {
  facultyId: number
  email: string
  first_name: string
  last_name: string
  contact_number?: string | null
  updatedAt: string
}

export interface MenteeLocalRecord {
  uid: string
  facultyId: number
  id: number
  full_name: string
  first_name?: string
  middle_name?: string
  last_name?: string
  semester: number
  section?: string
  year_of_admission?: number
  is_profile_locked?: boolean
  profile_locked_at?: string | null
  profile_locked_by?: number | null
  mobile_no?: string
  photo_url?: string | null
  photo_preview_url?: string | null
  detailPayload?: MenteePayload | null
  updatedAt: string
}

export interface MentoringMinuteLocalRecord {
  id: string | number
  facultyId: number
  studentUid: string
  studentId: number
  semester: number
  date: string
  remarks: string
  mentor_remarks?: string | null
  issues?: string | null
  suggestion?: string | null
  action?: string | null
  created_by_faculty: boolean
  updatedAt: string
}

export interface OfflineMutationRecord {
  idempotencyKey: string
  sequence: number
  facultyId: number
  operationType: OfflineMutationType
  targetEntity: string
  targetId: string
  payload: Record<string, unknown>
  status: OfflineMutationStatus
  retryCount: number
  lastError: string | null
  createdAt: string
}

export interface SyncMetadataRecord {
  key: string
  facultyId: number
  entity: string
  lastSuccessfulSync: string | null
  status: 'idle' | 'syncing' | 'error'
  updatedAt: string
}

export type { FacultyProfile, MenteePayload, MenteeRow, MinuteRow }
