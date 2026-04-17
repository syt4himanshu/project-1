import type { RouteObject } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import { LoginPage } from '../../modules/auth/routes'
import { LandingPage } from '../../modules/landing/routes'
import { RoleSelectionPage } from '../../modules/role-selection/routes'
import { DeveloperPage } from '../../modules/landing/DeveloperPage'

export const publicRoutes: RouteObject = {
  path: '/',
  element: <PublicLayout />,
  children: [
    {
      index: true,
      element: <LandingPage />,
    },
    {
      path: 'roles',
      element: <RoleSelectionPage />,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'developers',
      element: <DeveloperPage />,
    },
  ],
}
