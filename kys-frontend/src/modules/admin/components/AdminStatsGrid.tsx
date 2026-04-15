import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { QueryState } from '../../../shared/ui'
import { useAdminStatisticsQuery } from '../hooks'
import type { AdminStatistics } from '../api'

const STAT_CARDS: Array<{
  key: keyof AdminStatistics
  label: string
  helper: string
  icon: string
  tone: 'primary' | 'secondary' | 'emerald' | 'amber'
}> = [
  {
    key: 'totalUsers',
    label: 'Total Users',
    helper: 'All admin, faculty, and student logins',
    icon: 'group',
    tone: 'primary',
  },
  {
    key: 'totalStudents',
    label: 'Students',
    helper: 'Student profiles available in KYS',
    icon: 'school',
    tone: 'secondary',
  },
  {
    key: 'totalFaculty',
    label: 'Teachers',
    helper: 'Faculty records in mentoring pool',
    icon: 'person_book',
    tone: 'emerald',
  },
  {
    key: 'activeUsers',
    label: 'Active Users',
    helper: 'Current active accounts',
    icon: 'bolt',
    tone: 'amber',
  },
]

function formatStat(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value)
}

export function AdminStatsGrid() {
  const statisticsQuery = useAdminStatisticsQuery()

  if (statisticsQuery.isError) {
    return (
      <QueryState
        tone="error"
        title="Unable to load admin statistics"
        description={toApiErrorMessage(statisticsQuery.error, 'Please retry in a moment.')}
        actionLabel="Retry"
        onAction={() => void statisticsQuery.refetch()}
      />
    )
  }

  return (
    <div className="admin-stats-grid" aria-live="polite">
      {STAT_CARDS.map((card) => (
        <article className={`admin-stat-card admin-stat-card--${card.tone}`} key={card.key}>
          <div className="admin-stat-card__head">
            <div>
              <p className="admin-stat-card__label">{card.label}</p>
              {statisticsQuery.isPending ? (
                <div className="admin-stat-card__value-skeleton" />
              ) : (
                <p className="admin-stat-card__value">{formatStat(statisticsQuery.data?.[card.key] ?? 0)}</p>
              )}
            </div>
            <span className="admin-stat-card__icon-wrap" aria-hidden="true">
              <span className="material-symbols-outlined admin-stat-card__icon">{card.icon}</span>
            </span>
          </div>
          <p className="admin-stat-card__helper">{card.helper}</p>
        </article>
      ))}
    </div>
  )
}
