import type { UserRole } from '../../shared/auth/session'

export const APP_ROUTES = {
  root: '/',
  login: '/login',
  adminBase: '/admin',
  facultyBase: '/faculty',
  studentBase: '/student',
} as const

export const DASHBOARD_ROUTES: Record<UserRole, string> = {
  admin: '/admin/dashboard',
  faculty: '/faculty/dashboard',
  student: '/student/dashboard',
}
