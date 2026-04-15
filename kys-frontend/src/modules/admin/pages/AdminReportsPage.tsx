import { useEffect, useMemo } from 'react'
import { QueryState } from '../../../shared/ui'
import { useAdminReportStatsQuery, useExportAllReportsMutation, useExportBacklogsMutation } from '../hooks'
import { ReportBacklogList } from '../components/reports/ReportBacklogList'
import { ReportDistributionCard } from '../components/reports/ReportDistributionCard'
import { ReportGeneralTable } from '../components/reports/ReportGeneralTable'
import { ReportIncompleteProfilesTable } from '../components/reports/ReportIncompleteProfilesTable'
import { ReportToppersCard } from '../components/reports/ReportToppersCard'

function formatMetric(value: number, fractionDigits = 0) {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

export function AdminReportsPage() {
  const statsQuery = useAdminReportStatsQuery()
  const exportAllMutation = useExportAllReportsMutation()
  const exportBacklogMutation = useExportBacklogsMutation()

  useEffect(() => {
    document.title = 'Reports & Analytics - KYS'
  }, [])

  const metricCards = useMemo(() => {
    const stats = statsQuery.data
    return [
      {
        label: 'Total Students',
        value: stats ? formatMetric(stats.totalStudents) : '0',
      },
      {
        label: 'Average SGPA',
        value: stats ? formatMetric(stats.averageSgpa, 2) : '0.00',
      },
      {
        label: 'With Backlogs',
        value: stats ? formatMetric(stats.withBacklogs) : '0',
      },
      {
        label: 'Active Semesters',
        value: stats ? formatMetric(stats.activeSemesters) : '0',
      },
    ]
  }, [statsQuery.data])

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h3 className="admin-page__title">Reports & Analytics</h3>
        <p className="admin-page__subtitle">Analytics, exports, and profile completeness insights.</p>
      </div>

      <div className="role-toolbar__inline">
        <button
          type="button"
          className="button button--ghost button--icon role-chip-button"
          onClick={() => void exportAllMutation.mutateAsync()}
          disabled={exportAllMutation.isPending}
        >
          <span className="material-symbols-outlined" aria-hidden="true">download</span>
          {exportAllMutation.isPending ? 'Exporting...' : 'Export All Reports'}
        </button>
        <button
          type="button"
          className="button button--ghost button--icon role-chip-button"
          onClick={() => void exportBacklogMutation.mutateAsync()}
          disabled={exportBacklogMutation.isPending}
        >
          <span className="material-symbols-outlined" aria-hidden="true">download</span>
          {exportBacklogMutation.isPending ? 'Exporting...' : 'Export Backlogs'}
        </button>
      </div>

      {statsQuery.isError ? (
        <QueryState
          tone="error"
          title="Unable to load report metrics"
          description="Please retry in a moment."
          actionLabel="Retry"
          onAction={() => void statsQuery.refetch()}
        />
      ) : (
        <div className="admin-stats-grid" aria-live="polite">
          {metricCards.map((card) => (
            <div key={card.label} className="admin-stat-card admin-stat-card--primary">
              <p className="admin-stat-card__label">{card.label}</p>
              {statsQuery.isPending ? (
                <div className="admin-stat-card__value-skeleton" />
              ) : (
                <h3 className="admin-stat-card__value">{card.value}</h3>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="reports-grid-2">
        <ReportToppersCard />
        <ReportDistributionCard />
      </div>

      <ReportBacklogList />
      <ReportGeneralTable />
      <ReportIncompleteProfilesTable />
    </div>
  )
}
