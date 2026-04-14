import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/auth-context'

const ADMIN_TABS = [
  { to: '/admin/dashboard', label: 'Overview' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/teachers', label: 'Teachers' },
  { to: '/admin/students', label: 'Students' },
  { to: '/admin/allocation', label: 'Allocation' },
  { to: '/admin/reports', label: 'Reports' },
] as const

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-nav">
        <h1 className="dashboard-nav__title">KYS Admin</h1>
        <p className="dashboard-nav__user">Signed in as {user?.username}</p>

        <nav className="dashboard-nav__links" aria-label="Admin navigation">
          {ADMIN_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) => `dashboard-nav__link${isActive ? ' active' : ''}`}
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="dashboard-nav__logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}
