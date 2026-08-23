import type { ReactNode } from 'react'
import { ProfileDraftProvider } from '../context/ProfileDraftContext'
import { useReduxStudentProfileDraft } from '../hooks/useStudentProfileWizard'

/** Bridges Redux student profile state into ProfileDraftContext for wizard steps. */
export function StudentProfileDraftProvider({ children }: { children: ReactNode }) {
  const value = useReduxStudentProfileDraft()
  return <ProfileDraftProvider value={value}>{children}</ProfileDraftProvider>
}
