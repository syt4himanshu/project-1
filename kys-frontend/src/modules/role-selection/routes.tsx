import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../app/providers/auth-context'
import { toDashboardPath } from '../../shared/auth/roleGuards'
import type { UserRole } from '../../shared/auth/session'
import { ShieldCheck, GraduationCap, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type RoleCard = {
  role: UserRole
  icon: LucideIcon
  accentClass: string
  title: string
  subtitle: string
}

const ROLE_CARDS: RoleCard[] = [
  {
    role: 'admin',
    icon: ShieldCheck,
    accentClass: 'role-select-kys__badge--admin',
    title: 'Administrator',
    subtitle: 'Manage & Monitor'
  },
  {
    role: 'student',
    icon: GraduationCap,
    accentClass: 'role-select-kys__badge--student',
    title: 'Mentee',
    subtitle: 'Connect & Grow'
  },
  {
    role: 'faculty',
    icon: Users,
    accentClass: 'role-select-kys__badge--teacher',
    title: 'Mentor',
    subtitle: 'Guide & Empower'
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
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2.5rem 1.5rem', minHeight: '180px' }}
            onClick={() => navigate(`/login?role=${card.role}`)}
          >
            <div className={`role-select-kys__badge ${card.accentClass}`}>
              <card.icon size={28} strokeWidth={2} />
            </div>
            <h2 className="role-select-kys__card-title">{card.title}</h2>
            <p style={{ margin: '0.4rem 0 0', fontSize: '0.92rem', color: '#cbd5e1', opacity: 0.9 }}>
              {card.subtitle}
            </p>
          </button>
        ))}
        </div>
      </div>
    </section>
  )
}
