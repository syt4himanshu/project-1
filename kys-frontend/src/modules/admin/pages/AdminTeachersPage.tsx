import { useEffect, useMemo, useState } from 'react'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { DataTable, QueryState, type TableColumn } from '../../../shared/ui'
import type { AdminFacultySummary } from '../api'
import { TeacherDetailModal } from '../components/teachers/TeacherDetailModal'
import { useAdminFacultyQuery } from '../hooks'

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase()
}

export function AdminTeachersPage() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null)

  useEffect(() => {
    document.title = 'Teachers Management - KYS'
  }, [])

  const facultyQuery = useAdminFacultyQuery()

  const filteredRows = useMemo(() => {
    const query = normalizeSearchValue(searchValue)
    if (!query) return facultyQuery.data ?? []

    return (facultyQuery.data ?? []).filter((row) => {
      const haystack = [row.uid, row.name, row.email, row.contact]
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
  }, [facultyQuery.data, searchValue])

  const columns = useMemo<TableColumn<AdminFacultySummary>[]>(
    () => [
      {
        id: 'uid',
        header: 'UID',
        cell: (row) => <span className="mono-cell">{row.uid}</span>,
      },
      {
        id: 'name',
        header: 'Name',
        cell: (row) => (
          <div>
            <p className="admin-identity__primary">{row.name}</p>
            <p className="admin-identity__secondary">{row.email}</p>
          </div>
        ),
      },
      {
        id: 'contact',
        header: 'Contact',
        cell: (row) => <span>{row.contact}</span>,
      },
      {
        id: 'assigned',
        header: 'Students Assigned',
        cell: (row) => <span className="count-pill">{row.assignedCount} / 20</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (row) => (
          <button
            type="button"
            className="button button--ghost"
            onClick={() => setSelectedFacultyId(row.id)}
          >
            View Detail
          </button>
        ),
      },
    ],
    [],
  )

  if (facultyQuery.isError) {
    return (
      <div className="admin-page">
        <div className="admin-page__header">
          <h3 className="admin-page__title">Teachers Management</h3>
          <p className="admin-page__subtitle">Faculty list from /api/admin/faculty.</p>
        </div>
        <QueryState
          tone="error"
          title="Unable to load teacher records"
          description={toApiErrorMessage(facultyQuery.error, 'Please retry in a moment.')}
          actionLabel="Retry"
          onAction={() => void facultyQuery.refetch()}
        />
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h3 className="admin-page__title">Teachers Management</h3>
        <p className="admin-page__subtitle">Read-only faculty list with mentee detail modal.</p>
      </div>

      <div className="role-toolbar role-toolbar--inline">
        <div className="role-toolbar__card role-toolbar__card--filters role-toolbar__card--inline admin-toolbar-block">
          <div className="role-field role-field--icon">
            <span className="material-symbols-outlined">search</span>
            <input
              className="role-input role-input--with-icon"
              placeholder="Search faculty..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              type="text"
            />
          </div>
        </div>
        <div className="role-toolbar__inline">
          <button className="button button--ghost button--icon role-chip-button">
            <span className="material-symbols-outlined" aria-hidden="true">filter_list</span> Filter
          </button>
          <button className="button button--ghost button--icon role-chip-button">
            <span className="material-symbols-outlined" aria-hidden="true">download</span> Export
          </button>
        </div>
      </div>

      <div className="admin-surface">
        <DataTable
          columns={columns}
          data={filteredRows}
          keyExtractor={(row) => row.id}
          isLoading={facultyQuery.isPending}
          pageSize={12}
          emptyLabel="No teachers matched the current search."
        />
      </div>

      <TeacherDetailModal
        facultyId={selectedFacultyId}
        onClose={() => setSelectedFacultyId(null)}
      />
    </div>
  )
}
