import { Link } from 'react-router-dom'
import { useAuth } from '../../../app/providers/auth-context'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { QueryState } from '../../../shared/ui'
import { useMentees } from '../hooks'

export function FacultyDashboardPage() {
  const { user } = useAuth()
  const menteesQuery = useMentees()
  const menteeCount = menteesQuery.data?.length ?? 0

  return (
    <div className="faculty-dashboard">
      {/* Welcome banner */}
      <header className="faculty-dashboard__banner">
        <div>
          <h1 className="faculty-dashboard__title">
            Welcome back{user?.username ? `, ${user.username}` : ''}
          </h1>
          <p className="faculty-dashboard__subtitle">
            Here's a snapshot of your mentoring workspace.
          </p>
        </div>
      </header>

      {/* Error state */}
      {menteesQuery.isError ? (
        <QueryState
          tone="error"
          title="Unable to load mentee summary"
          description={toApiErrorMessage(menteesQuery.error, 'Please retry in a moment.')}
          actionLabel="Retry"
          onAction={() => void menteesQuery.refetch()}
        />
      ) : null}

      {/* Stat cards */}
      <div className="faculty-stat-grid">
        <Link to="/faculty/mentees" className="faculty-stat-card faculty-stat-card--primary">
          <span className="faculty-stat-card__icon" aria-hidden="true">👥</span>
          <p className="faculty-stat-card__label">Assigned mentees</p>
          <p className="faculty-stat-card__value">
            {menteesQuery.isPending
              ? <span className="admin-stat-card__value-skeleton" />
              : menteeCount}
          </p>
          <p className="faculty-stat-card__cta">View all mentees →</p>
        </Link>

        <Link to="/faculty/chatbot" className="faculty-stat-card faculty-stat-card--accent">
          <span className="faculty-stat-card__icon" aria-hidden="true">🤖</span>
          <p className="faculty-stat-card__label">AI Insights</p>
          <p className="faculty-stat-card__value faculty-stat-card__value--md">Chatbot</p>
          <p className="faculty-stat-card__cta">Ask mentoring questions →</p>
        </Link>

        <Link to="/faculty/profile" className="faculty-stat-card">
          <span className="faculty-stat-card__icon" aria-hidden="true">👤</span>
          <p className="faculty-stat-card__label">My Profile</p>
          <p className="faculty-stat-card__value faculty-stat-card__value--md">Settings</p>
          <p className="faculty-stat-card__cta">Edit profile & password →</p>
        </Link>
      </div>

      {/* Quick-action hint */}
      <div className="faculty-dashboard__hint">
        <strong>Tip:</strong> Open a mentee from <Link to="/faculty/mentees">My Mentees</Link> to
        view their full KYS profile and record mentoring minutes.
      </div>
    </div>
  )
}
