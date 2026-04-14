import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/auth-context'

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
        <p className="dashboard-nav__user">{user?.username}</p>

        <nav className="dashboard-nav__links" aria-label="Faculty navigation">
          <NavLink to="/faculty/dashboard" className={({ isActive }) => `dashboard-nav__link${isActive ? ' active' : ''}`}>
            Dashboard
          </NavLink>
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
