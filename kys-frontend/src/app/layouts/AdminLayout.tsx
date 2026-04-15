import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/auth-context'

const ADMIN_TABS = [
  { to: '/admin/dashboard', label: 'Overview', icon: 'dashboard' },
  { to: '/admin/users', label: 'Users', icon: 'group' },
  { to: '/admin/teachers', label: 'Teachers', icon: 'school' },
  { to: '/admin/students', label: 'Students', icon: 'person_book' },
  { to: '/admin/allocation', label: 'Allocation', icon: 'assignment_ind' },
  { to: '/admin/reports', label: 'Reports', icon: 'assessment' },
] as const

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="dashboard-shell role-shell role-shell--admin">
      <aside className="dashboard-nav">
        <div className="dashboard-nav__brand">
          <h1 className="dashboard-nav__title">KYS Admin</h1>
          <p className="dashboard-nav__tag">Academic Management</p>
        </div>

        <nav className="dashboard-nav__links" aria-label="Admin navigation">
          {ADMIN_TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) => `dashboard-nav__link${isActive ? ' active' : ''}`}
            >
              <span className="material-symbols-outlined dashboard-nav__icon" aria-hidden="true">
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </NavLink>
          ))}
        </nav>

        <button type="button" className="dashboard-nav__logout" onClick={handleLogout}>
          <span className="material-symbols-outlined dashboard-nav__icon" aria-hidden="true">
            logout
          </span>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  )
}
