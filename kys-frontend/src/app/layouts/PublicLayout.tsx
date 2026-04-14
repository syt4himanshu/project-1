import { Outlet, useLocation } from 'react-router-dom'

export default function PublicLayout() {
  const location = useLocation()
  const role = new URLSearchParams(location.search).get('role')
  const isRoleSelection = location.pathname === '/'
  const isStudentLogin = location.pathname === '/login' && role === 'student'

  if (isRoleSelection || isStudentLogin) {
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
