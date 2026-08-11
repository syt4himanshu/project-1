import { useMemo, useState } from 'react'
import { QueryState, ResponsiveDataView, type TableColumn, Modal } from '../../../../shared/ui'
import { sanitizeDisplayValue } from '../../../../shared/utils/render'
import type { AdminBacklogEntry } from '../../api'
import { useAdminReportBacklogsQuery } from '../../hooks'

function getInitials(name: string): string {
  const clean = sanitizeDisplayValue(name)
  const parts = clean.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return clean.slice(0, 2).toUpperCase() || 'NA'
}

export function ReportBacklogList() {
  const [search, setSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<AdminBacklogEntry | null>(null)
  const backlogsQuery = useAdminReportBacklogsQuery()

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase()
    const rows = backlogsQuery.data ?? []
    if (!query) return rows

    return rows.filter((row) => {
      const haystack = [row.uid, row.name, row.subjects.join(' ')]
        .map((entry) => sanitizeDisplayValue(entry).toLowerCase())
        .join(' ')
      return haystack.includes(query)
    })
  }, [backlogsQuery.data, search])

  const columns = useMemo<TableColumn<AdminBacklogEntry>[]>(
    () => [
      { id: 'uid', header: 'UID', cell: (row) => <span className="mono-cell">{sanitizeDisplayValue(row.uid)}</span> },
      { id: 'name', header: 'Student', cell: (row) => sanitizeDisplayValue(row.name) },
      {
        id: 'subjects',
        header: 'Backlog Subjects',
        cell: (row) => {
          const count = row.backlogCount ?? row.subjects.length
          if (count === 0) {
            return <span className="reports-backlog-subjects">N/A</span>
          }
          if (count > 2) {
            return (
              <button
                type="button"
                className="button button--ghost button--sm"
                onClick={() => setSelectedStudent(row)}
                style={{ padding: '4px 8px', fontSize: '0.875rem' }}
              >
                View Subjects
              </button>
            )
          }
          return (
            <span className="reports-backlog-subjects">
              {row.subjects.map((subject) => sanitizeDisplayValue(subject)).join(', ')}
            </span>
          )
        },
      },
      { id: 'count', header: 'Count', cell: (row) => row.backlogCount ?? row.subjects.length },
    ],
    [],
  )

  const renderBacklogCard = (row: AdminBacklogEntry) => {
    const sanitizedSubjects = row.subjects
      .map((subject) => sanitizeDisplayValue(subject))
      .filter((subject) => subject && subject !== '—')

    return (
      <div className="mobile-card">
        <div className="mobile-card__header">
          <div className="mobile-card__avatar" >
            {getInitials(row.name)}
          </div>
          <div className="mobile-card__info">
            <h4 className="mobile-card__title">{sanitizeDisplayValue(row.name)}</h4>
            <p className="mobile-card__subtitle">{sanitizeDisplayValue(row.uid)} · Student</p>
          </div>
        </div>

        <div className="mobile-card__content">
          <div className="mobile-card__row">
            <span className="mobile-card__label">Backlogs</span>
            <div className="mobile-card__pill-list">
              {sanitizedSubjects.length > 0 ? sanitizedSubjects.map((subject, index) => (
                <span key={`${subject}-${index}`} className="mobile-card__pill mobile-card__pill--danger">{subject}</span>
              )) : <span className="mobile-card__pill mobile-card__pill--success">Clear</span>}
            </div>
          </div>
          <div className="mobile-card__row">
            <span className="mobile-card__label">Count</span>
            <span className="mobile-card__value">{row.backlogCount ?? row.subjects.length}</span>
          </div>
        </div>

      </div>
    )
  }

  return (
    <>
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
        <ResponsiveDataView
          columns={columns}
          data={filteredRows}
          keyExtractor={(row) => row.studentId}
          isLoading={backlogsQuery.isPending}
          pageSize={10}
          emptyLabel="No students with backlogs found."
          renderMobileCard={renderBacklogCard}
        />
      )}
      </section>

      <Modal
        open={selectedStudent !== null}
        onClose={() => setSelectedStudent(null)}
        title="Backlog Subjects"
        subtitle={selectedStudent ? `${selectedStudent.name} (${selectedStudent.uid})` : ''}
      >
        {selectedStudent && (
          <div style={{ paddingBottom: '1rem' }}>
            <div className="mobile-card__pill-list" style={{ marginTop: '1rem' }}>
              {selectedStudent.subjects
                .flatMap(s => s.split(',').map(sub => sub.trim()))
                .filter(Boolean)
                .map((subject, index) => (
                  <span key={`${subject}-${index}`} className="mobile-card__pill mobile-card__pill--danger">
                    {sanitizeDisplayValue(subject)}
                  </span>
                ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
