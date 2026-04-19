import { lazy, Suspense } from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import RequireAuth from './guards/RequireAuth'
import RequireRole from './guards/RequireRole'

// Lazy load student pages for better code splitting
const StudentDashboardPage = lazy(async () => {
  const { StudentDashboardPage } = await import('../../modules/student/routes')
  return { default: StudentDashboardPage }
})

const StudentProfilePage = lazy(async () => {
  const { StudentProfilePage } = await import('../../modules/student/routes')
  return { default: StudentProfilePage }
})

const PageLoader = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="route-loader">
    <div className="route-loader__spinner" />
    <p>{message}</p>
  </div>
)

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
          element: (
            <Suspense fallback={<PageLoader message="Loading dashboard..." />}>
              <StudentDashboardPage />
            </Suspense>
          ),
        },
        {
          path: 'profile',
          element: (
            <Suspense fallback={<PageLoader message="Loading profile..." />}>
              <StudentProfilePage />
            </Suspense>
          ),
        },
      ],
    },
  ],
}
