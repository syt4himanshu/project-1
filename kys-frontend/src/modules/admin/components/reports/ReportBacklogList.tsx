import { useMemo, useState } from 'react'
import { DataTable, QueryState, type TableColumn } from '../../../../shared/ui'
import type { AdminBacklogEntry } from '../../api'
import { useAdminReportBacklogsQuery } from '../../hooks'

export function ReportBacklogList() {
  const [search, setSearch] = useState('')
  const backlogsQuery = useAdminReportBacklogsQuery()

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    const rows = backlogsQuery.data ?? []
    if (!query) return rows

    return rows.filter((row) => {
      const haystack = [row.uid, row.name, row.subjects.join(' ')].join(' ').toLowerCase()
      return haystack.includes(query)
    })
  }, [backlogsQuery.data, search])

  const columns = useMemo<TableColumn<AdminBacklogEntry>[]>(
    () => [
      { id: 'uid', header: 'UID', cell: (row) => <span className="mono-cell">{row.uid}</span> },
      { id: 'name', header: 'Student', cell: (row) => row.name },
      {
        id: 'subjects',
        header: 'Backlog Subjects',
        cell: (row) => (
          <span className="reports-backlog-subjects">{row.subjects.length > 0 ? row.subjects.join(', ') : 'N/A'}</span>
        ),
      },
      { id: 'count', header: 'Count', cell: (row) => row.subjects.length },
    ],
    [],
  )

  return (
    <section className="admin-section card reports-card" aria-label="Backlog list report">
      <header className="reports-card__header">
        <h3>Students with Backlogs</h3>
        <label className="admin-field reports-inline-field" htmlFor="backlog-search">
          <span>Search</span>
          <input
            id="backlog-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="UID, name, subject"
            autoComplete="off"
          />
        </label>
      </header>

      {backlogsQuery.isError ? (
        <QueryState
          tone="error"
          title="Unable to load backlog list"
          description="Please retry in a moment."
          actionLabel="Retry"
          onAction={() => void backlogsQuery.refetch()}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredRows}
          keyExtractor={(row) => row.studentId}
          isLoading={backlogsQuery.isPending}
          pageSize={10}
          emptyLabel="No students with backlogs found."
        />
      )}
    </section>
  )
}
