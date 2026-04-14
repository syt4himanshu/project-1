import type { UserRole } from '../../shared/auth/session'

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  faculty: 'Faculty',
  student: 'Student',
}
