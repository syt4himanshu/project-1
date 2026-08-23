/* eslint-disable react-refresh/only-export-components -- context module exports hook + types */
import { createContext, useContext, type ReactNode } from 'react'
import type { FieldValidationState } from '../components/wizard/shared'

export type ProfileEditorRole = 'student' | 'faculty'

export interface ProfilePhotoUploadResult {
  photoUrl?: string | null
  photo_public_id?: string | null
  photo_preview_url?: string | null
  photoPreviewUrl?: string | null
}

export interface ProfileDraftContextValue {
  data: Record<string, unknown>
  update: (patch: Record<string, unknown>) => void
  getFieldValidation: (path: string) => FieldValidationState
  error: string | null | undefined
  markFieldTouched?: (path: string) => void
  /** When set, Step1 photo upload uses this instead of the student self-upload API. */
  uploadPhoto?: (file: File) => Promise<ProfilePhotoUploadResult>
  /** Faculty editors remain editable even when the student profile is locked. */
  editorRole?: ProfileEditorRole
}

const ProfileDraftContext = createContext<ProfileDraftContextValue | null>(null)

export function ProfileDraftProvider({
  value,
  children,
}: {
  value: ProfileDraftContextValue
  children: ReactNode
}) {
  return <ProfileDraftContext.Provider value={value}>{children}</ProfileDraftContext.Provider>
}

export function useProfileDraftContext() {
  return useContext(ProfileDraftContext)
}