import { Navigate, type RouteObject } from 'react-router-dom'
import StudentLayout from '../layouts/StudentLayout'
import RequireAuth from './guards/RequireAuth'
import RequireRole from './guards/RequireRole'
import { StudentDashboardPage } from '../../modules/student/routes'

export const studentRoutes: RouteObject = {
  path: '/student',
  element: <RequireAuth />,
  children: [
    {
      element: <RequireRole role="student" />,
      children: [
        {
          element: <StudentLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="dashboard" replace />,
            },
            {
              path: 'dashboard',
              element: <StudentDashboardPage />,
            },
          ],
        },
      ],
    },
  ],
}
