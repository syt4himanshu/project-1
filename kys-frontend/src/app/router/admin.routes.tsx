import { Navigate, type RouteObject } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import RequireAuth from './guards/RequireAuth'
import RequireRole from './guards/RequireRole'
import { AdminDashboardPage } from '../../modules/admin/routes'

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
          ],
        },
      ],
    },
  ],
}
