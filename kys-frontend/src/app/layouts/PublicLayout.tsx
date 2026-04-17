import { Outlet, useLocation } from 'react-router-dom'

export default function PublicLayout() {
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const isLogin = location.pathname === '/login'
  const isDeveloperPage = location.pathname === '/developers'
  const isRoles = location.pathname === '/roles'

  if (isLanding || isLogin || isDeveloperPage || isRoles) {
    return <Outlet />
  }

  return (
    <div className="public-shell">
      <div className="public-shell__content">
        <Outlet />
      </div>
    </div>
  )
}
