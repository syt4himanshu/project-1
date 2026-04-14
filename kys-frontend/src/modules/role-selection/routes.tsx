import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/providers/auth-context'
import { toDashboardPath } from '../../shared/auth/roleGuards'
import type { UserRole } from '../../shared/auth/session'

type RoleCard = {
  role: UserRole
  letter: string
  accentClass: string
  title: string
  description: string
}

const ROLE_CARDS: RoleCard[] = [
  {
    role: 'admin',
    letter: 'A',
    accentClass: 'role-select-kys__badge--admin',
    title: 'Administrator',
    description: 'Manage users, reports, and mentoring allocation.',
  },
  {
    role: 'faculty',
    letter: 'T',
    accentClass: 'role-select-kys__badge--teacher',
    title: 'Teacher',
    description: 'Manage classes, review student performance, and guide learners with structured mentoring.',
  },
  {
    role: 'student',
    letter: 'S',
    accentClass: 'role-select-kys__badge--student',
    title: 'Student',
    description: 'Streamline your academic journey with profile forms, mentoring, and progress tracking.',
  },
]

export function RoleSelectionPage() {
  const navigate = useNavigate()
  const { status, session } = useAuth()

  if (status === 'bootstrapping') {
    return (
      <section className="role-select-kys">
        <div className="role-select-kys__shell">
          <h1 className="role-select-kys__title">Choose Your Role</h1>
          <p className="role-select-kys__subtitle">Checking existing session...</p>
        </div>
      </section>
    )
  }

  if (status === 'authenticated' && session) {
    return <Navigate to={toDashboardPath(session.user.role)} replace />
  }

  return (
    <section className="role-select-kys">
      <div className="role-select-kys__shell">
        <h1 className="role-select-kys__title">Choose Your Role</h1>
        <div className="role-select-kys__grid">
        {ROLE_CARDS.map((card) => (
          <button
            key={card.role}
            type="button"
            className="role-select-kys__card"
            onClick={() => navigate(`/login?role=${card.role}`)}
          >
            <div className={`role-select-kys__badge ${card.accentClass}`}>{card.letter}</div>
            <h2 className="role-select-kys__card-title">{card.title}</h2>
            <p className="role-select-kys__card-text">{card.description}</p>
          </button>
        ))}
        </div>
      </div>
    </section>
  )
}
