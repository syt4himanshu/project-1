import { lazy, Suspense } from 'react'
/* eslint-disable react-refresh/only-export-components */
import { Navigate, type RouteObject } from 'react-router-dom'
import FacultyLayout from '../layouts/FacultyLayout'
import RequireAuth from './guards/RequireAuth'
import RequireRole from './guards/RequireRole'
import {
  FacultyDashboardPage,
  FacultyMenteeDetailPage,
  FacultyMenteesPage,
  FacultyProfilePage,
} from '../../modules/faculty/routes'

const FacultyChatbotPageLazy = lazy(async () => {
  const m = await import('../../modules/faculty/pages/FacultyChatbotPage')
  return { default: m.FacultyChatbotPage }
})

const ChatbotFallback = (
  <div className="route-loader">
    <div className="route-loader__spinner" />
    <p>Loading chatbot...</p>
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
            { path: 'dashboard', element: <FacultyDashboardPage /> },
            { path: 'mentees', element: <FacultyMenteesPage /> },
            { path: 'mentees/:uid', element: <FacultyMenteeDetailPage /> },
            { path: 'profile', element: <FacultyProfilePage /> },
            {
              path: 'chatbot',
              element: (
                <Suspense fallback={ChatbotFallback}>
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
