import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
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
  const location = useLocation()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  useEffect(() => {
    setIsMobileNavOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isMobileNavOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isMobileNavOpen])

  const handleLogout = async () => {
    await logout()
    setIsMobileNavOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <div className={`dashboard-shell role-shell role-shell--admin${isMobileNavOpen ? ' is-admin-nav-open' : ''}`}>
      <button
        type="button"
        className="admin-mobile-nav-toggle"
        aria-label={isMobileNavOpen ? 'Close admin navigation' : 'Open admin navigation'}
        aria-expanded={isMobileNavOpen}
        aria-controls="admin-navigation"
        onClick={() => setIsMobileNavOpen((current) => !current)}
      >
        <span className="material-symbols-outlined" aria-hidden="true">
          {isMobileNavOpen ? 'close' : 'menu'}
        </span>
      </button>

      <button
        type="button"
        className="admin-mobile-nav-backdrop"
        aria-label="Close navigation menu"
        onClick={() => setIsMobileNavOpen(false)}
      />

      <aside className="dashboard-nav" id="admin-navigation">
        <button
          type="button"
          className="admin-mobile-nav-close"
          aria-label="Close admin navigation"
          onClick={() => setIsMobileNavOpen(false)}
        >
          <span className="material-symbols-outlined" aria-hidden="true">close</span>
        </button>

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
              onClick={() => setIsMobileNavOpen(false)}
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
