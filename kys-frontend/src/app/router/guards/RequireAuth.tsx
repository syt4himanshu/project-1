import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../providers/auth-context'

export default function RequireAuth() {
  const { status, session } = useAuth()
  const location = useLocation()

  if (status === 'bootstrapping') {
    return (
      <div className="route-loader">
        <div className="route-loader__spinner" />
        <p>Checking your session...</p>
      </div>
    )
  }

  if (!session) {
    const nextPath = `${location.pathname}${location.search}`
    const next = encodeURIComponent(nextPath)
    return <Navigate to={`/?next=${next}`} replace />
  }

  return <Outlet />
}
