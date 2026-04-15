import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/auth-context'

const FACULTY_TABS = [
  { to: '/faculty/dashboard', label: 'Dashboard' },
  { to: '/faculty/mentees', label: 'My Mentees' },
  { to: '/faculty/chatbot', label: 'Chatbot' },
  { to: '/faculty/profile', label: 'My Profile' },
] as const

export default function FacultyLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = FACULTY_TABS.find((tab) => location.pathname.startsWith(tab.to))

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="dashboard-shell role-shell role-shell--faculty">
      <aside className="dashboard-nav">
        <div className="dashboard-nav__brand">
          <h1 className="dashboard-nav__title">KYS Faculty</h1>
          <p className="dashboard-nav__tag">Mentoring Workspace</p>
        </div>

        <nav className="dashboard-nav__links" aria-label="Faculty navigation">
          {FACULTY_TABS.map((tab) => (
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
        <header className="dashboard-topbar">
          <div>
            <h2 className="dashboard-topbar__title">{activeTab?.label ?? 'Faculty'}</h2>
            <p className="dashboard-topbar__subtitle">
              Signed in as {user?.username ?? 'faculty'}
            </p>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  )
}
