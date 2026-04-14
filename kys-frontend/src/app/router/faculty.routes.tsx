import { Navigate, type RouteObject } from 'react-router-dom'
import FacultyLayout from '../layouts/FacultyLayout'
import RequireAuth from './guards/RequireAuth'
import RequireRole from './guards/RequireRole'
import { FacultyDashboardPage } from '../../modules/faculty/routes'

export const facultyRoutes: RouteObject = {
  path: '/faculty',
  element: <RequireAuth />,
  children: [
    {
      element: <RequireRole role="faculty" />,
      children: [
        {
          element: <FacultyLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="dashboard" replace />,
            },
            {
              path: 'dashboard',
              element: <FacultyDashboardPage />,
            },
          ],
        },
      ],
    },
  ],
}
