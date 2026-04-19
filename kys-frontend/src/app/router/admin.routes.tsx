/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import RequireAuth from './guards/RequireAuth'
import RequireRole from './guards/RequireRole'

// Lazy load all admin pages for better code splitting
const AdminDashboardPage = lazy(async () => {
  const { AdminDashboardPage } = await import('../../modules/admin/routes')
  return { default: AdminDashboardPage }
})

const AdminUsersPage = lazy(async () => {
  const { AdminUsersPage } = await import('../../modules/admin/routes')
  return { default: AdminUsersPage }
})

const AdminTeachersPage = lazy(async () => {
  const { AdminTeachersPage } = await import('../../modules/admin/routes')
  return { default: AdminTeachersPage }
})

const AdminStudentsPage = lazy(async () => {
  const { AdminStudentsPage } = await import('../../modules/admin/routes')
  return { default: AdminStudentsPage }
})

const AdminAllocationPage = lazy(async () => {
  const { AdminAllocationPage } = await import('../../modules/admin/routes')
  return { default: AdminAllocationPage }
})

const AdminReportsPageLazy = lazy(async () => {
  const module = await import('../../modules/admin/pages/AdminReportsPage')
  return { default: module.AdminReportsPage }
})

const PageLoader = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="route-loader">
    <div className="route-loader__spinner" />
    <p>{message}</p>
  </div>
)

export const adminRoutes: RouteObject = {
  path: '/admin',
  element: <RequireAuth />,
  children: [
    {
      element: <RequireRole role="admin" />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="dashboard" replace />,
            },
            {
              path: 'dashboard',
              element: (
                <Suspense fallback={<PageLoader message="Loading dashboard..." />}>
                  <AdminDashboardPage />
                </Suspense>
              ),
            },
            {
              path: 'users',
              element: (
                <Suspense fallback={<PageLoader message="Loading users..." />}>
                  <AdminUsersPage />
                </Suspense>
              ),
            },
            {
              path: 'teachers',
              element: (
                <Suspense fallback={<PageLoader message="Loading teachers..." />}>
                  <AdminTeachersPage />
                </Suspense>
              ),
            },
            {
              path: 'students',
              element: (
                <Suspense fallback={<PageLoader message="Loading students..." />}>
                  <AdminStudentsPage />
                </Suspense>
              ),
            },
            {
              path: 'allocation',
              element: (
                <Suspense fallback={<PageLoader message="Loading allocation..." />}>
                  <AdminAllocationPage />
                </Suspense>
              ),
            },
            {
              path: 'reports',
              element: (
                <Suspense fallback={<PageLoader message="Loading reports..." />}>
                  <AdminReportsPageLazy />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
  ],
}
