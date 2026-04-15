import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../providers/auth-context'
import type { UserRole } from '../../../shared/auth/session'
import { toDashboardPath } from '../../../shared/auth/roleGuards'

interface RequireRoleProps {
  role: UserRole
}

export default function RequireRole({ role }: RequireRoleProps) {
  const { status, session } = useAuth()

  if (status === 'bootstrapping') {
    return (
      <div className="route-loader">
        <div className="route-loader__spinner" />
        <p>Loading access policy...</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/" replace />
  }

  if (session.user.role !== role) {
    return <Navigate to={toDashboardPath(session.user.role)} replace />
  }

  return <Outlet />
}
