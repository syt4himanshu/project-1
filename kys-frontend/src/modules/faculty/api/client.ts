import { ENDPOINTS } from '../../../shared/api/endpointRegistry'
import { requestJson } from '../../../shared/api/httpClient'
import { readStoredSession } from '../../../shared/auth/storage'
import type {
  AddMinuteInput,
  AIRemarksRequest,
  AIRemarksResponse,
  ChangePasswordInput,
  ChatbotRequest,
  ChatbotResponse,
  FacultyProfile,
  FacultyProfileUpdateInput,
  LockMenteeResponse,
  MenteeMinutesPayload,
  MenteePayload,
  MenteeRow,
  MutationResult,
  UpdateMenteeProfileResponse,
} from './types'

function token() {
  return readStoredSession()?.accessToken ?? null
}

// Groq SDK 10s × 3 attempts + backoff (~32s) < backend extendedTimeout 60s < nginx 60s.
// Client abort is set just under the backend budget so the UI fails cleanly first.
const CHATBOT_REQUEST_TIMEOUT_MS = 55_000

export interface MenteesParams {
  limit?: number
  offset?: number
}

export interface MenteeMinutesParams {
  limit?: number
  offset?: number
}

function buildQuery(params: Record<string, number | undefined>): string {
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${v}`)
  return parts.length ? `?${parts.join('&')}` : ''
}

export const facultyClient = {
  getProfile: () =>
    requestJson<FacultyProfile>(ENDPOINTS.faculty.me, { token: token() }),

  updateProfile: (data: FacultyProfileUpdateInput) =>
    requestJson<MutationResult>(ENDPOINTS.faculty.me, {
      method: 'PUT',
      body: data,
      token: token(),
    }),

  getMentees: ({ limit = 50, offset = 0 }: MenteesParams = {}) =>
    requestJson<MenteeRow[]>(
      `${ENDPOINTS.faculty.mentees}${buildQuery({ limit, offset })}`,
      { token: token() },
    ),

  getMentee: (uid: string) =>
    requestJson<MenteePayload>(ENDPOINTS.faculty.mentee(uid), { token: token() }),

  getMenteeMinutes: (uid: string, { limit = 20, offset = 0 }: MenteeMinutesParams = {}) =>
    requestJson<MenteeMinutesPayload>(
      `${ENDPOINTS.faculty.menteeMinutes(uid)}${buildQuery({ limit, offset })}`,
      { token: token() },
    ),

  lockMentee: (uid: string) =>
    requestJson<LockMenteeResponse>(ENDPOINTS.faculty.lockMentee(uid), {
      method: 'PUT',
      token: token(),
    }),

  unlockMentee: (uid: string) =>
    requestJson<LockMenteeResponse>(ENDPOINTS.faculty.unlockMentee(uid), {
      method: 'PUT',
      token: token(),
    }),

  updateMenteeProfile: (uid: string, data: unknown) =>
    requestJson<UpdateMenteeProfileResponse>(ENDPOINTS.faculty.updateMenteeProfile(uid), {
      method: 'PUT',
      body: data,
      token: token(),
    }),

  addMentoringMinute: (uid: string, data: AddMinuteInput) =>
    requestJson<MutationResult>(ENDPOINTS.faculty.menteeMinutes(uid), {
      method: 'POST',
      body: data,
      token: token(),
    }),

  uploadMenteePhoto: (studentId: number, file: File) => {
    const formData = new FormData()
    formData.append('photo', file)

    return requestJson<MutationResult>(ENDPOINTS.students.uploadPhoto(studentId), {
      method: 'POST',
      body: formData,
      token: token(),
    })
  },

  askChatbot: (data: ChatbotRequest, signal?: AbortSignal) =>
    requestJson<ChatbotResponse>(ENDPOINTS.faculty.chatbot, {
      method: 'POST',
      body: data,
      token: token(),
      signal,
      timeoutMs: CHATBOT_REQUEST_TIMEOUT_MS,
      retry: { maxAttempts: 1 },
    }),

  askAIRemarks: (data: AIRemarksRequest, signal?: AbortSignal) =>
    requestJson<AIRemarksResponse>(ENDPOINTS.faculty.aiRemarks, {
      method: 'POST',
      body: data,
      token: token(),
      signal,
    }),

  changePassword: (data: ChangePasswordInput) =>
    requestJson<MutationResult>(ENDPOINTS.auth.changePassword, {
      method: 'POST',
      body: data,
      token: token(),
    }),
}
