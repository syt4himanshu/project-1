export const ROLE_VALUES = ['admin', 'faculty', 'student'] as const

export type UserRole = (typeof ROLE_VALUES)[number]

export interface AuthUser {
  id: number
  username: string
  role: UserRole
}

export interface AuthSession {
  accessToken: string
  user: AuthUser
}

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && (ROLE_VALUES as readonly string[]).includes(value)
}
