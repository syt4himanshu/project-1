import { lazy, Suspense } from 'react'
/* eslint-disable react-refresh/only-export-components */
import { Navigate, type RouteObject } from 'react-router-dom'
import FacultyLayout from '../layouts/FacultyLayout'
import RequireAuth from './guards/RequireAuth'
import RequireRole from './guards/RequireRole'

// Lazy load all faculty pages for better code splitting
const FacultyDashboardPage = lazy(async () => {
  const { FacultyDashboardPage } = await import('../../modules/faculty/routes')
  return { default: FacultyDashboardPage }
})

const FacultyMenteeDetailPage = lazy(async () => {
  const { FacultyMenteeDetailPage } = await import('../../modules/faculty/routes')
  return { default: FacultyMenteeDetailPage }
})

const FacultyProfilePage = lazy(async () => {
  const { FacultyProfilePage } = await import('../../modules/faculty/routes')
  return { default: FacultyProfilePage }
})

const FacultyChatbotPageLazy = lazy(async () => {
  const m = await import('../../modules/faculty/pages/FacultyChatbotPage')
  return { default: m.FacultyChatbotPage }
})

const PageLoader = ({ message = 'Loading...' }: { message?: string }) => (
  <div className="route-loader">
    <div className="route-loader__spinner" />
    <p>{message}</p>
  </div>
)

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
            { index: true, element: <Navigate to="dashboard" replace /> },
            {
              path: 'dashboard',
              element: (
                <Suspense fallback={<PageLoader message="Loading dashboard..." />}>
                  <FacultyDashboardPage />
                </Suspense>
              ),
            },
            { path: 'mentees', element: <Navigate to="/faculty/dashboard" replace /> },
            {
              path: 'mentees/:uid',
              element: (
                <Suspense fallback={<PageLoader message="Loading student details..." />}>
                  <FacultyMenteeDetailPage />
                </Suspense>
              ),
            },
            {
              path: 'profile',
              element: (
                <Suspense fallback={<PageLoader message="Loading profile..." />}>
                  <FacultyProfilePage />
                </Suspense>
              ),
            },
            {
              path: 'chatbot',
              element: (
                <Suspense fallback={<PageLoader message="Loading chatbot..." />}>
                  <FacultyChatbotPageLazy />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
  ],
}
