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

const CHATBOT_REQUEST_TIMEOUT_MS = 55_000

export interface MenteesParams {
  limit?: number
  offset?: number
}

export interface MenteeMinutesParams {
  limit?: number
  offset?: number
}

export interface RequestExtraOptions {
  headers?: Record<string, string>
  token?: string | null
  signal?: AbortSignal
}

function buildQuery(params: Record<string, number | undefined>): string {
  const parts = Object.entries(params)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `${k}=${v}`)
  return parts.length ? `?${parts.join('&')}` : ''
}

export const facultyClient = {
  getProfile: (options?: RequestExtraOptions) =>
    requestJson<FacultyProfile>(ENDPOINTS.faculty.me, {
      token: options?.token !== undefined ? options.token : token(),
      signal: options?.signal,
      headers: options?.headers,
    }),

  updateProfile: (data: FacultyProfileUpdateInput, options?: RequestExtraOptions) =>
    requestJson<MutationResult>(ENDPOINTS.faculty.me, {
      method: 'PUT',
      body: data,
      token: options?.token !== undefined ? options.token : token(),
      signal: options?.signal,
      headers: options?.headers,
    }),

  getMentees: ({ limit = 50, offset = 0 }: MenteesParams = {}, options?: RequestExtraOptions) =>
    requestJson<MenteeRow[]>(
      `${ENDPOINTS.faculty.mentees}${buildQuery({ limit, offset })}`,
      {
        token: options?.token !== undefined ? options.token : token(),
        signal: options?.signal,
        headers: options?.headers,
      },
    ),

  getMentee: (uid: string, options?: RequestExtraOptions) =>
    requestJson<MenteePayload>(ENDPOINTS.faculty.mentee(uid), {
      token: options?.token !== undefined ? options.token : token(),
      signal: options?.signal,
      headers: options?.headers,
    }),

  getMenteeMinutes: (uid: string, { limit = 20, offset = 0 }: MenteeMinutesParams = {}, options?: RequestExtraOptions) =>
    requestJson<MenteeMinutesPayload>(
      `${ENDPOINTS.faculty.menteeMinutes(uid)}${buildQuery({ limit, offset })}`,
      {
        token: options?.token !== undefined ? options.token : token(),
        signal: options?.signal,
        headers: options?.headers,
      },
    ),

  lockMentee: (uid: string, options?: RequestExtraOptions) =>
    requestJson<LockMenteeResponse>(ENDPOINTS.faculty.lockMentee(uid), {
      method: 'PUT',
      token: options?.token !== undefined ? options.token : token(),
      signal: options?.signal,
      headers: options?.headers,
    }),

  unlockMentee: (uid: string, options?: RequestExtraOptions) =>
    requestJson<LockMenteeResponse>(ENDPOINTS.faculty.unlockMentee(uid), {
      method: 'PUT',
      token: options?.token !== undefined ? options.token : token(),
      signal: options?.signal,
      headers: options?.headers,
    }),

  updateMenteeProfile: (uid: string, data: unknown, options?: RequestExtraOptions) =>
    requestJson<UpdateMenteeProfileResponse>(ENDPOINTS.faculty.updateMenteeProfile(uid), {
      method: 'PUT',
      body: data,
      token: options?.token !== undefined ? options.token : token(),
      signal: options?.signal,
      headers: options?.headers,
    }),

  addMentoringMinute: (uid: string, data: AddMinuteInput, options?: RequestExtraOptions) =>
    requestJson<MutationResult>(ENDPOINTS.faculty.menteeMinutes(uid), {
      method: 'POST',
      body: data,
      token: options?.token !== undefined ? options.token : token(),
      signal: options?.signal,
      headers: options?.headers,
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
