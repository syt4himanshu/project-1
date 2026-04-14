import type { RouteObject } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import { LoginPage } from '../../modules/auth/routes'
import { RoleSelectionPage } from '../../modules/role-selection/routes'

export const publicRoutes: RouteObject = {
  path: '/',
  element: <PublicLayout />,
  children: [
    {
      index: true,
      element: <RoleSelectionPage />,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
  ],
}
