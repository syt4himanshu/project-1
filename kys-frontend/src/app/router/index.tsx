import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { adminRoutes } from './admin.routes'
import { facultyRoutes } from './faculty.routes'
import { publicRoutes } from './public.routes'
import { studentRoutes } from './student.routes'

const appRouter = createBrowserRouter([
  publicRoutes,
  adminRoutes,
  facultyRoutes,
  studentRoutes,
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export function AppRouter() {
  return <RouterProvider router={appRouter} />
}
