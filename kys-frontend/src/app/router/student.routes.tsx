import { Navigate, type RouteObject } from 'react-router-dom'
import RequireAuth from './guards/RequireAuth'
import RequireRole from './guards/RequireRole'
import { StudentDashboardPage, StudentProfilePage } from '../../modules/student/routes'

export const studentRoutes: RouteObject = {
  path: '/student',
  element: <RequireAuth />,
  children: [
    {
      element: <RequireRole role="student" />,
      children: [
        {
          index: true,
          element: <Navigate to="dashboard" replace />,
        },
        {
          path: 'dashboard',
          element: <StudentDashboardPage />,
        },
        {
          path: 'profile',
          element: <StudentProfilePage />,
        },
      ],
    },
  ],
}
