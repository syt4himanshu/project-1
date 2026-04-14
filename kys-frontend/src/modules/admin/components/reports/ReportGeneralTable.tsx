import { useMemo, useState } from 'react'
import { DataTable, QueryState, type TableColumn } from '../../../../shared/ui'
import { normalizeGeneralReportFilters } from '../../api'
import type { AdminGeneralReportFilters, AdminGeneralReportRow } from '../../api'
import { useAdminReportGeneralQuery } from '../../hooks'

const EMPTY_FILTERS: AdminGeneralReportFilters = {
  search: '',
  semester: '',
  minSgpa: '',
  maxSgpa: '',
  minBacklogs: '',
}

function averageSgpa(row: AdminGeneralReportRow): number {
  const values = row.academicRecords
    .map((entry) => entry.sgpa)
    .filter((value): value is number => value !== null && Number.isFinite(value))

  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function totalBacklogs(row: AdminGeneralReportRow): number {
  return row.academicRecords.reduce((sum, entry) => sum + entry.backlogs, 0)
}

export function ReportGeneralTable() {
  const [filters, setFilters] = useState<AdminGeneralReportFilters>(EMPTY_FILTERS)
  const generalQuery = useAdminReportGeneralQuery()

  const normalizedFilters = useMemo(
    () => normalizeGeneralReportFilters(filters),
    [filters],
  )

  const filteredRows = useMemo(() => {
    const rows = generalQuery.data ?? []
    const search = normalizedFilters.search.toLowerCase()
    const semester = normalizedFilters.semester ? Number(normalizedFilters.semester) : null
    const minSgpa = normalizedFilters.minSgpa ? Number(normalizedFilters.minSgpa) : null
    const maxSgpa = normalizedFilters.maxSgpa ? Number(normalizedFilters.maxSgpa) : null
    const minBacklogs = normalizedFilters.minBacklogs ? Number(normalizedFilters.minBacklogs) : null

    return rows.filter((row) => {
      if (search) {
        const haystack = [row.uid, row.name].join(' ').toLowerCase()
        if (!haystack.includes(search)) return false
      }

      if (semester !== null && row.semester !== semester) return false

      const avg = averageSgpa(row)
      if (minSgpa !== null && avg < minSgpa) return false
      if (maxSgpa !== null && avg > maxSgpa) return false

      const backlogs = totalBacklogs(row)
      if (minBacklogs !== null && backlogs < minBacklogs) return false

      return true
    })
  }, [generalQuery.data, normalizedFilters])

  const columns = useMemo<TableColumn<AdminGeneralReportRow>[]>(
    () => [
      { id: 'uid', header: 'UID', cell: (row) => <span className="mono-cell">{row.uid}</span> },
      { id: 'name', header: 'Name', cell: (row) => row.name },
      { id: 'semester', header: 'Semester', cell: (row) => row.semester ?? 'N/A' },
      {
        id: 'averageSgpa',
        header: 'Avg SGPA',
        cell: (row) => averageSgpa(row).toFixed(2),
      },
      {
        id: 'backlogs',
        header: 'Backlogs',
        cell: (row) => totalBacklogs(row),
      },
      { id: 'domain', header: 'Domain', cell: (row) => row.domainOfInterest || 'N/A' },
      { id: 'goal', header: 'Career Goal', cell: (row) => row.careerGoal || 'N/A' },
    ],
    [],
  )

  return (
    <section className="admin-section card reports-card" aria-label="General report table">
      <header className="reports-card__header">
        <h3>General Report</h3>
      </header>

      <div className="reports-filter-grid">
        <label className="admin-field" htmlFor="general-search">
          <span>Search</span>
          <input
            id="general-search"
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
            placeholder="Name or UID"
            autoComplete="off"
          />
        </label>

        <label className="admin-field" htmlFor="general-semester">
          <span>Semester</span>
          <select
            id="general-semester"
            value={filters.semester}
            onChange={(event) => setFilters((current) => ({ ...current, semester: event.target.value }))}
          >
            <option value="">All</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((option) => (
              <option key={option} value={option}>
                Semester {option}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field" htmlFor="general-min-sgpa">
          <span>Min SGPA</span>
          <input
            id="general-min-sgpa"
            value={filters.minSgpa}
            onChange={(event) => setFilters((current) => ({ ...current, minSgpa: event.target.value }))}
            placeholder="0"
            inputMode="decimal"
          />
        </label>

        <label className="admin-field" htmlFor="general-max-sgpa">
          <span>Max SGPA</span>
          <input
            id="general-max-sgpa"
            value={filters.maxSgpa}
            onChange={(event) => setFilters((current) => ({ ...current, maxSgpa: event.target.value }))}
            placeholder="10"
            inputMode="decimal"
          />
        </label>

        <label className="admin-field" htmlFor="general-min-backlogs">
          <span>Min Backlogs</span>
          <input
            id="general-min-backlogs"
            value={filters.minBacklogs}
            onChange={(event) => setFilters((current) => ({ ...current, minBacklogs: event.target.value }))}
            placeholder="0"
            inputMode="numeric"
          />
        </label>

        <div className="reports-reset-wrap">
          <button
            type="button"
            className="button button--ghost"
            onClick={() => setFilters(EMPTY_FILTERS)}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {generalQuery.isError ? (
        <QueryState
          tone="error"
          title="Unable to load general report"
          description="Please retry in a moment."
          actionLabel="Retry"
          onAction={() => void generalQuery.refetch()}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredRows}
          keyExtractor={(row) => row.id}
          isLoading={generalQuery.isPending}
          pageSize={12}
          emptyLabel="No rows matched current report filters."
        />
      )}
    </section>
  )
}
