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
  MenteeMinutesPayload,
  MenteePayload,
  MenteeRow,
  MutationResult,
} from './types'

function token() {
  return readStoredSession()?.accessToken ?? null
}

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

  addMentoringMinute: (uid: string, data: AddMinuteInput) =>
    requestJson<MutationResult>(ENDPOINTS.faculty.menteeMinutes(uid), {
      method: 'POST',
      body: data,
      token: token(),
    }),

  askChatbot: (data: ChatbotRequest, signal?: AbortSignal) =>
    requestJson<ChatbotResponse>(ENDPOINTS.faculty.chatbot, {
      method: 'POST',
      body: data,
      token: token(),
      signal,
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
