import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/providers/auth-context'
import { toDashboardPath } from '../../shared/auth/roleGuards'
import type { UserRole } from '../../shared/auth/session'

type RoleCard = {
  role: UserRole
  title: string
  description: string
}

const ROLE_CARDS: RoleCard[] = [
  {
    role: 'admin',
    title: 'Administrator',
    description: 'Manage users, reports, and mentoring allocation.',
  },
  {
    role: 'faculty',
    title: 'Faculty',
    description: 'Review mentees and monitor mentoring insights.',
  },
  {
    role: 'student',
    title: 'Student',
    description: 'Access profile progress and mentoring journey.',
  },
]

export function RoleSelectionPage() {
  const navigate = useNavigate()
  const { status, session } = useAuth()

  if (status === 'bootstrapping') {
    return (
      <section className="card role-selection">
        <h1>Choose your role</h1>
        <p className="subtext">Checking existing session...</p>
      </section>
    )
  }

  if (status === 'authenticated' && session) {
    return <Navigate to={toDashboardPath(session.user.role)} replace />
  }

  return (
    <section className="card role-selection">
      <h1>Choose your role</h1>
      <p className="subtext">Phase 1 RBAC entrypoint for the unified KYS frontend.</p>

      <div className="role-grid">
        {ROLE_CARDS.map((card) => (
          <button
            key={card.role}
            type="button"
            className="role-card"
            onClick={() => navigate(`/login?role=${card.role}`)}
          >
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </button>
        ))}
      </div>
    </section>
  )
}
