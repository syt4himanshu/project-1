import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  facultyClient,
  facultyKeys,
  normalizeMenteeMinutes,
  normalizeMenteePayload,
  normalizeMenteesPage,
  normalizeProfile,
} from '../api'
import type { AddMinuteInput, ChangePasswordInput, ChatbotRequest } from '../api'

const DEFAULT_PAGE_SIZE = 20
const DEFAULT_MINUTES_PAGE_SIZE = 20

// ─── Profile ─────────────────────────────────────────────────────────────────

export function useFacultyProfile() {
  return useQuery({
    queryKey: facultyKeys.profile(),
    queryFn: async () => normalizeProfile(await facultyClient.getProfile()),
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Parameters<typeof facultyClient.updateProfile>[0]) =>
      facultyClient.updateProfile(data),
    onSuccess: () => void qc.invalidateQueries({ queryKey: facultyKeys.profile() }),
  })
}

// ─── Mentees (paginated) ──────────────────────────────────────────────────────

export function useMenteesPage(offset = 0, limit = DEFAULT_PAGE_SIZE) {
  return useQuery({
    queryKey: facultyKeys.menteesPage(limit, offset),
    queryFn: async () =>
      normalizeMenteesPage(await facultyClient.getMentees({ limit, offset }), limit, offset),
  })
}

/** Full list for chatbot/selectors — capped at backend max of 100 */
export function useMentees() {
  return useQuery({
    queryKey: facultyKeys.mentees(),
    queryFn: async () =>
      normalizeMenteesPage(await facultyClient.getMentees({ limit: 100, offset: 0 }), 100, 0).rows,
  })
}

// ─── Mentee detail ───────────────────────────────────────────────────────────

export function useMentee(uid: string) {
  return useQuery({
    queryKey: facultyKeys.mentee(uid),
    queryFn: async () => normalizeMenteePayload(await facultyClient.getMentee(uid)),
    enabled: Boolean(uid),
  })
}

// ─── Mentoring minutes (paginated) ───────────────────────────────────────────

export function useMenteeMinutes(uid: string, offset = 0, limit = DEFAULT_MINUTES_PAGE_SIZE) {
  return useQuery({
    queryKey: facultyKeys.menteeMinutes(uid, offset),
    queryFn: async () =>
      normalizeMenteeMinutes(await facultyClient.getMenteeMinutes(uid, { limit, offset })),
    enabled: Boolean(uid),
  })
}

export function useAddMentoringMinute(uid: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: AddMinuteInput) => facultyClient.addMentoringMinute(uid, data),
    onSuccess: () =>
      // Invalidate all minute pages for this mentee
      void qc.invalidateQueries({ queryKey: facultyKeys.menteeMinutes(uid) }),
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
