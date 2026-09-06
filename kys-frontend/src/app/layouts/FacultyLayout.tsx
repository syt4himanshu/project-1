import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../providers/auth-context'
import { syncEngine } from '../../shared/sync/syncEngine'
import { LogoutConfirmationModal } from '../../shared/components/LogoutConfirmationModal'

export default function FacultyLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [unsyncedCount, setUnsyncedCount] = useState(0)

  const heading = location.pathname.startsWith('/faculty/chatbot')
    ? 'AI Chatbot'
    : location.pathname.startsWith('/faculty/profile')
      ? 'My Profile'
      : 'Dashboard'

  const proceedLogout = async () => {
    setShowLogoutModal(false)
    await logout()
    navigate('/', { replace: true })
  }

  const handleLogoutClick = async () => {
    if (user?.id) {
      const state = await syncEngine.getSyncState(user.id)
      const count = state.pendingCount + state.conflictCount + state.failedCount
      if (count > 0) {
        setUnsyncedCount(count)
        setShowLogoutModal(true)
        return
      }
    }
    await proceedLogout()
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
            <button type="button" className="button button--danger" onClick={handleLogoutClick}>
              <LogOut className="dashboard-nav__icon" aria-hidden="true" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <section className="faculty-shell__content">
          <Outlet />
        </section>
      </main>

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        unsyncedCount={unsyncedCount}
        onConfirm={proceedLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  )
}
