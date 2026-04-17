import { LogOut } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/auth-context'

export default function FacultyLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const heading = location.pathname.startsWith('/faculty/chatbot')
    ? 'AI Chatbot'
    : location.pathname.startsWith('/faculty/profile')
      ? 'My Profile'
      : 'Dashboard'

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="role-shell role-shell--faculty faculty-shell">
      <main className="faculty-shell__main">
        <header className="dashboard-topbar">
          <div className="dashboard-topbar__left">
            <h2 className="dashboard-topbar__title">{heading}</h2>
            <p className="dashboard-topbar__subtitle">
              Signed in as {user?.username ?? 'faculty'}
            </p>
          </div>
          <div className="dashboard-topbar__right">
            <button type="button" className="button button--danger" onClick={handleLogout}>
              <LogOut className="dashboard-nav__icon" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <section className="faculty-shell__content">
          <Outlet />
        </section>
      </main>
    </div>
  )
}
