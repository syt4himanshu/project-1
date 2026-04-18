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
    description: 'Comprehensive system management with full access to user administration, system settings, and advanced analytics.',
  },
  {
    role: 'student',
    letter: 'S',
    accentClass: 'role-select-kys__badge--student',
    title: 'Student',
    description: 'Streamline your acadamic journey with our comprehensive system. Form Submission, Mentoring, and more.',
  },
  {
    role: 'faculty',
    letter: 'T',
    accentClass: 'role-select-kys__badge--teacher',
    title: 'Teacher',
    description: 'Manage your classes, track student performance, create assessments, and communicate with students and parents.',
  },
]

export function RoleSelectionPage() {
  const navigate = useNavigate()
  const { status, session } = useAuth()

  if (status === 'bootstrapping') {
    return (
      <section className="role-select-kys">
        <div className="role-select-kys__header">
          <button onClick={() => navigate(-1)} className="kys-landing__footer-btn" style={{ borderRadius: '6px' }}>
            &larr; Back
          </button>
          <h1 className="role-select-kys__title">
            Choose Your Role
          </h1>
          <div className="role-select-kys__spacer" aria-hidden="true" />
        </div>
        <div className="role-select-kys__shell">
          <p className="role-select-kys__subtitle">Checking existing session...</p>
        </div>
      </section>
    )
  }

  if (status === 'authenticated' && session) {
    return <Navigate to={toDashboardPath(session.user.role)} replace />
  }

  return (
    <section className="role-select-kys" style={{ overflow: 'hidden', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="role-select-kys__header">
        <button onClick={() => navigate(-1)} className="kys-landing__footer-btn" style={{ borderRadius: '6px' }}>
          &larr; Back
        </button>
        <h1 className="role-select-kys__title">
          Choose Your Role
        </h1>
        <div className="role-select-kys__spacer" aria-hidden="true" />
      </div>

      <div className="role-select-kys__shell" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="role-select-kys__grid">
        {ROLE_CARDS.map((card) => (
          <button
            key={card.role}
            type="button"
            className="role-select-kys__card"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
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
