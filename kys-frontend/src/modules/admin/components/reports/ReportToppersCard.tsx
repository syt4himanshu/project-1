import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { QueryState } from '../../../../shared/ui'
import { useAdminReportToppersQuery } from '../../hooks'

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength)}...`
}

export function ReportToppersCard() {
  const [semester, setSemester] = useState<number | undefined>(undefined)
  const toppersQuery = useAdminReportToppersQuery(semester)

  const chartData = useMemo(
    () => (toppersQuery.data ?? []).map((row) => ({
      ...row,
      chartName: truncate(row.name, 10),
    })),
    [toppersQuery.data],
  )

  return (
    <section className="admin-section card reports-card" aria-label="Topper report">
      <header className="reports-card__header">
        <h3>Top 10 Toppers</h3>
        <div className="reports-card__controls" role="tablist" aria-label="Toppers semester filter">
          <button
            type="button"
            className={`reports-chip${semester === undefined ? ' active' : ''}`}
            onClick={() => setSemester(undefined)}
          >
            All
          </button>
          {SEMESTERS.map((option) => (
            <button
              key={option}
              type="button"
              className={`reports-chip${semester === option ? ' active' : ''}`}
              onClick={() => setSemester(option)}
            >
              Sem {option}
            </button>
          ))}
        </div>
      </header>

      {toppersQuery.isPending ? <div className="reports-chart-skeleton" /> : null}

      {toppersQuery.isError ? (
        <QueryState
          tone="error"
          title="Unable to load toppers"
          description="Please retry in a moment."
          actionLabel="Retry"
          onAction={() => void toppersQuery.refetch()}
        />
      ) : null}

      {!toppersQuery.isPending && !toppersQuery.isError ? (
        chartData.length === 0 ? (
          <QueryState title="No topper data" description="No records are available for the selected semester." />
        ) : (
          <>
            <div className="reports-chart-wrap" role="img" aria-label="Bar chart of topper SGPA scores">
              <ResponsiveContainer width="100%" height={270}>
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                  <XAxis dataKey="chartName" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => [Number(value ?? 0), 'SGPA']} />
                  <Bar dataKey="sgpa" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="table-scroll">
              <table className="table reports-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>UID</th>
                    <th>SGPA</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((row) => (
                    <tr key={`${row.uid}-${row.rank}`}>
                      <td>#{row.rank}</td>
                      <td>{row.name}</td>
                      <td className="mono-cell">{row.uid}</td>
                      <td>{row.sgpa.toFixed(2)}</td>
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
