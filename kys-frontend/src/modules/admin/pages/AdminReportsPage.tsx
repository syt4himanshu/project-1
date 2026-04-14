import { useMemo } from 'react'
import { QueryState, SectionShell } from '../../../shared/ui'
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
    <SectionShell
      title="Reports"
      subtitle="Analytics, exports, and profile completeness insights."
      actions={(
        <div className="reports-actions">
          <button
            type="button"
            className="button button--ghost"
            onClick={() => void exportAllMutation.mutateAsync()}
            disabled={exportAllMutation.isPending}
          >
            {exportAllMutation.isPending ? 'Exporting...' : 'Export All CSV'}
          </button>
          <button
            type="button"
            className="button button--ghost"
            onClick={() => void exportBacklogMutation.mutateAsync()}
            disabled={exportBacklogMutation.isPending}
          >
            {exportBacklogMutation.isPending ? 'Exporting...' : 'Export Backlog CSV'}
          </button>
        </div>
      )}
    >
      {statsQuery.isError ? (
        <QueryState
          tone="error"
          title="Unable to load report metrics"
          description="Please retry in a moment."
          actionLabel="Retry"
          onAction={() => void statsQuery.refetch()}
        />
      ) : (
        <div className="reports-metric-grid" aria-live="polite">
          {metricCards.map((card) => (
            <article key={card.label} className="reports-metric-card">
              <p>{card.label}</p>
              {statsQuery.isPending ? <div className="reports-metric-skeleton" /> : <strong>{card.value}</strong>}
            </article>
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
    </SectionShell>
  )
}
