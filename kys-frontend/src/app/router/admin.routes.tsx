/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import RequireAuth from './guards/RequireAuth'
import RequireRole from './guards/RequireRole'
import {
  AdminAllocationPage,
  AdminDashboardPage,
  AdminStudentsPage,
  AdminTeachersPage,
  AdminUsersPage,
} from '../../modules/admin/routes'

const AdminReportsPageLazy = lazy(async () => {
  const module = await import('../../modules/admin/pages/AdminReportsPage')
  return { default: module.AdminReportsPage }
})

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
              element: <AdminDashboardPage />,
            },
            {
              path: 'users',
              element: <AdminUsersPage />,
            },
            {
              path: 'teachers',
              element: <AdminTeachersPage />,
            },
            {
              path: 'students',
              element: <AdminStudentsPage />,
            },
            {
              path: 'allocation',
              element: <AdminAllocationPage />,
            },
            {
              path: 'reports',
              element: (
                <Suspense
                  fallback={(
                    <div className="route-loader">
                      <div className="route-loader__spinner" />
                      <p>Loading reports...</p>
                    </div>
                  )}
                >
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
