import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { QueryState } from '../../../shared/ui'
import { useAdminStatisticsQuery } from '../hooks'
import type { AdminStatistics } from '../api'

const STAT_CARDS: Array<{ key: keyof AdminStatistics; label: string; helper: string }> = [
  { key: 'totalUsers', label: 'Total Users', helper: 'All admin, faculty, and student logins' },
  { key: 'totalStudents', label: 'Students', helper: 'Student profiles available in KYS' },
  { key: 'totalFaculty', label: 'Teachers', helper: 'Faculty records in mentoring pool' },
  { key: 'activeUsers', label: 'Active Users', helper: 'Current active accounts' },
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
        <article className="admin-stat-card" key={card.key}>
          <p className="admin-stat-card__label">{card.label}</p>
          {statisticsQuery.isPending ? (
            <div className="admin-stat-card__value-skeleton" />
          ) : (
            <p className="admin-stat-card__value">{formatStat(statisticsQuery.data?.[card.key] ?? 0)}</p>
          )}
          <p className="admin-stat-card__helper">{card.helper}</p>
        </article>
      ))}
    </div>
  )
}
