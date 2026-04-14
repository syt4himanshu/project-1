import type { UserRole } from './session'

export const dashboardPathByRole: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  faculty: '/faculty/dashboard',
  student: '/student/dashboard',
}

export function toDashboardPath(role: UserRole): string {
  return dashboardPathByRole[role]
}
