import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/auth-context'

const FACULTY_TABS = [
  { to: '/faculty/dashboard', label: 'Dashboard' },
  { to: '/faculty/mentees', label: 'My Mentees' },
  { to: '/faculty/chatbot', label: 'Chatbot' },
  { to: '/faculty/profile', label: 'My Profile' },
] as const

export default function FacultyLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-nav">
        <h1 className="dashboard-nav__title">KYS Faculty</h1>
        <p className="dashboard-nav__user">Signed in as {user?.username}</p>

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
        <Outlet />
      </main>
    </div>
  )
}
