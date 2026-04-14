import { useMemo, useState } from 'react'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { DataTable, QueryState, SectionShell, type TableColumn } from '../../../shared/ui'
import type { AdminFacultySummary } from '../api'
import { TeacherDetailModal } from '../components/teachers/TeacherDetailModal'
import { useAdminFacultyQuery } from '../hooks'

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase()
}

export function AdminTeachersPage() {
  const [searchValue, setSearchValue] = useState('')
  const [selectedFacultyId, setSelectedFacultyId] = useState<number | null>(null)

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
      <SectionShell title="Teachers" subtitle="Faculty list from /api/admin/faculty.">
        <QueryState
          tone="error"
          title="Unable to load teacher records"
          description={toApiErrorMessage(facultyQuery.error, 'Please retry in a moment.')}
          actionLabel="Retry"
          onAction={() => void facultyQuery.refetch()}
        />
      </SectionShell>
    )
  }

  return (
    <SectionShell
      title="Teachers"
      subtitle="Read-only faculty list with mentee detail modal."
      actions={(
        <label className="admin-field" htmlFor="teachers-search">
          <span>Search</span>
          <input
            id="teachers-search"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Name, email, UID"
            autoComplete="off"
          />
        </label>
      )}
    >
      <DataTable
        columns={columns}
        data={filteredRows}
        keyExtractor={(row) => row.id}
        isLoading={facultyQuery.isPending}
        pageSize={12}
        emptyLabel="No teachers matched the current search."
      />

      <TeacherDetailModal
        facultyId={selectedFacultyId}
        onClose={() => setSelectedFacultyId(null)}
      />
    </SectionShell>
  )
}
