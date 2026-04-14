import { useMemo, useState } from 'react'
import { DataTable, QueryState, type TableColumn } from '../../../../shared/ui'
import type { AdminIncompleteProfile } from '../../api'
import {
  useAdminReportIncompleteQuery,
  useExportIncompleteReportsMutation,
} from '../../hooks'

function currentYearOptions() {
  const year = new Date().getFullYear()
  return Array.from({ length: 10 }, (_, index) => year - index)
}

export function ReportIncompleteProfilesTable() {
  const [yearFilter, setYearFilter] = useState<string>('')

  const parsedYear = yearFilter ? Number(yearFilter) : undefined
  const incompleteQuery = useAdminReportIncompleteQuery(parsedYear)
  const exportMutation = useExportIncompleteReportsMutation()

  const columns = useMemo<TableColumn<AdminIncompleteProfile>[]>(
    () => [
      { id: 'uid', header: 'UID', cell: (row) => <span className="mono-cell">{row.uid}</span> },
      { id: 'name', header: 'Name', cell: (row) => row.name },
      { id: 'year', header: 'Admission Year', cell: (row) => row.yearOfAdmission ?? 'N/A' },
      {
        id: 'missing',
        header: 'Missing Fields',
        cell: (row) => (
          <span className="reports-warning-text">
            {row.missingFields.length > 0 ? row.missingFields.join(', ') : 'N/A'}
          </span>
        ),
      },
    ],
    [],
  )

  return (
    <section className="admin-section card reports-card" aria-label="Incomplete profiles report">
      <header className="reports-card__header">
        <h3>Incomplete Profiles</h3>

        <div className="reports-card__controls">
          <label className="admin-field reports-inline-field" htmlFor="incomplete-year">
            <span>Year</span>
            <select
              id="incomplete-year"
              value={yearFilter}
              onChange={(event) => setYearFilter(event.target.value)}
            >
              <option value="">All years</option>
              {currentYearOptions().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="button button--ghost"
            onClick={() => void exportMutation.mutateAsync({ year: parsedYear })}
            disabled={exportMutation.isPending}
          >
            {exportMutation.isPending ? 'Exporting...' : 'Export Incomplete CSV'}
          </button>
        </div>
      </header>

      {incompleteQuery.isError ? (
        <QueryState
          tone="error"
          title="Unable to load incomplete profile report"
          description="Please retry in a moment."
          actionLabel="Retry"
          onAction={() => void incompleteQuery.refetch()}
        />
      ) : (
        <DataTable
          columns={columns}
          data={incompleteQuery.data ?? []}
          keyExtractor={(row) => row.id}
          isLoading={incompleteQuery.isPending}
          pageSize={10}
          emptyLabel="No incomplete profile rows found."
        />
      )}
    </section>
  )
}
