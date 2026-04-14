import { useMemo } from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { QueryState } from '../../../../shared/ui'
import { useAdminReportSemesterDistributionQuery } from '../../hooks'

const CHART_COLORS = ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#14b8a6', '#84cc16', '#f97316']

export function ReportDistributionCard() {
  const distributionQuery = useAdminReportSemesterDistributionQuery()

  const chartData = useMemo(
    () => (distributionQuery.data ?? []).map((row) => ({
      ...row,
      name: `Sem ${row.semester}`,
    })),
    [distributionQuery.data],
  )

  const totalStudents = useMemo(
    () => chartData.reduce((sum, row) => sum + row.count, 0),
    [chartData],
  )

  return (
    <section className="admin-section card reports-card" aria-label="Semester distribution report">
      <header className="reports-card__header">
        <h3>Semester Distribution</h3>
      </header>

      {distributionQuery.isPending ? <div className="reports-chart-skeleton" /> : null}

      {distributionQuery.isError ? (
        <QueryState
          tone="error"
          title="Unable to load semester distribution"
          description="Please retry in a moment."
          actionLabel="Retry"
          onAction={() => void distributionQuery.refetch()}
        />
      ) : null}

      {!distributionQuery.isPending && !distributionQuery.isError ? (
        chartData.length === 0 ? (
          <QueryState title="No semester distribution data" description="No student distribution records are available." />
        ) : (
          <>
            <div className="reports-chart-wrap" role="img" aria-label="Pie chart of student semester distribution">
              <ResponsiveContainer width="100%" height={270}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="count"
                    label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {chartData.map((row, index) => (
                      <Cell key={`${row.semester}-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="table-scroll">
              <table className="table reports-table">
                <thead>
                  <tr>
                    <th>Semester</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((row) => (
                    <tr key={row.semester}>
                      <td>Semester {row.semester}</td>
                      <td>{row.count}</td>
                      <td>{totalStudents > 0 ? ((row.count / totalStudents) * 100).toFixed(1) : '0.0'}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      ) : null}
    </section>
  )
}
