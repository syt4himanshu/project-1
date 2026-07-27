import { useEffect, useMemo, useState } from 'react'
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
import { sanitizeDisplayValue } from '../../../../shared/utils/render'
import { useAdminReportToppersQuery } from '../../hooks'

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const

function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value
  return `${value.slice(0, maxLength)}...`
}

export function ReportToppersCard() {
  const [semester, setSemester] = useState<number>(1)
  const [hasAutoSelected, setHasAutoSelected] = useState(false)
  const toppersQuery = useAdminReportToppersQuery(semester)

  // Auto-select the first available semester on first successful load
  useEffect(() => {
    if (toppersQuery.data && !hasAutoSelected) {
      if (toppersQuery.data.is_in_progress) {
        const cycle = toppersQuery.data.current_cycle
        const firstAvailable = cycle === 'odd' ? 2 : 1
        // The semester must be derived from API state after the first load.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSemester(firstAvailable)
      }
      setHasAutoSelected(true)
    }
  }, [toppersQuery.data, hasAutoSelected])

  const chartData = useMemo(
    () => (toppersQuery.data?.toppers ?? []).map((row) => ({
      ...row,
      chartName: truncate(sanitizeDisplayValue(row.name), 10),
    })),
    [toppersQuery.data],
  )

  const isInProgress = toppersQuery.data?.is_in_progress

  return (
    <section className="admin-section card reports-card" aria-label="Topper report">
      <header className="reports-card__header">
        <h3>Top 10 Toppers</h3>
        <div className="reports-card__controls" role="tablist" aria-label="Toppers semester filter">
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
        isInProgress ? (
          <div className="reports-empty-state">
            <span className="material-symbols-outlined reports-empty-icon">event_busy</span>
            <p className="reports-empty-title">Results for Semester {semester} are not yet available.</p>
            <p className="reports-empty-sub">This semester is currently in progress.</p>
          </div>
        ) : chartData.length === 0 ? (
          <QueryState title="No topper data" description="No records were found for the resolved batch." />
        ) : (
          <>
            <div className="reports-chart-wrap" role="img" aria-label="Bar chart of topper SGPA scores">
              <ResponsiveContainer width="100%" height={270}>
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 6 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                  <XAxis dataKey="chartName" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                  <Tooltip 
                    formatter={(value) => [Number(value ?? 0).toFixed(2), 'SGPA']}
                    labelFormatter={(label, payload) => {
                      const item = payload[0]?.payload
                      return item ? `${item.name} (${item.uid})` : label
                    }}
                  />
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
                    <th style={{ minWidth: '8.5rem' }}>UID</th>
                    <th style={{ minWidth: '4.25rem' }}>SGPA</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((row) => (
                    <tr key={`${sanitizeDisplayValue(row.uid)}-${row.rank}`}>
                      <td style={{ fontWeight: 600 }}>#{row.rank}</td>
                      <td>{sanitizeDisplayValue(row.name)}</td>
                      <td><span className="mono-cell reports-uid-text">{sanitizeDisplayValue(row.uid)}</span></td>
                      <td style={{ fontWeight: 500 }} className="reports-sgpa-cell">{row.sgpa.toFixed(2)}</td>
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
