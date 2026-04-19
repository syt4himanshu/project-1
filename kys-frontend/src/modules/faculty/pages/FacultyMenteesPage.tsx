import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { DataTable, QueryState, SectionShell, type TableColumn } from '../../../shared/ui'
import { PhotoAvatar } from '../../../shared/components/PhotoAvatar'
import type { MenteeRow } from '../api'
import { useMentees } from '../hooks'

function asSemesterLabel(semester: number): string {
  return Number.isFinite(semester) ? `Sem ${semester}` : 'N/A'
}

function normalizeText(value: string | number | undefined): string {
  if (value == null) return ''
  return String(value).trim().toLowerCase()
}

export function FacultyMenteesPage() {
  const [searchValue, setSearchValue] = useState('')
  const menteesQuery = useMentees()

  const filteredRows = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    if (!query) return menteesQuery.data ?? []

    return (menteesQuery.data ?? []).filter((row) => {
      const haystack = [
        normalizeText(row.uid),
        normalizeText(row.full_name),
        normalizeText(row.section),
        normalizeText(row.semester),
        normalizeText(row.year_of_admission),
      ].join(' ')

      return haystack.includes(query)
    })
  }, [menteesQuery.data, searchValue])

  const columns = useMemo<TableColumn<MenteeRow>[]>(
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
          <div className="flex items-center gap-3">
            <PhotoAvatar
              url={row.photo_url}
              alt={`${row.full_name} profile`}
              className="h-9 w-9 rounded-full object-cover"
              fallback={(
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e4ebf7] text-xs font-bold text-[#2a4d83]">
                  {row.full_name
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0]?.toUpperCase() ?? '')
                    .join('')}
                </div>
              )}
            />
            <span>{row.full_name}</span>
          </div>
        ),
      },
      {
        id: 'semester',
        header: 'Semester',
        cell: (row) => asSemesterLabel(row.semester),
      },
      {
        id: 'section',
        header: 'Section',
        cell: (row) => row.section?.trim() || 'N/A',
      },
      {
        id: 'admissionYear',
        header: 'Admission Year',
        cell: (row) => row.year_of_admission ?? 'N/A',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (row) => (
          <Link className="button button--ghost" to={`/faculty/mentees/${encodeURIComponent(row.uid)}`}>
            Open
          </Link>
        ),
      },
    ],
    [],
  )

  if (menteesQuery.isError) {
    return (
      <SectionShell title="My Mentees" subtitle="Students assigned to you as mentor.">
        <QueryState
          tone="error"
          title="Unable to load mentee list"
          description={toApiErrorMessage(menteesQuery.error, 'Please retry in a moment.')}
          actionLabel="Retry"
          onAction={() => void menteesQuery.refetch()}
        />
      </SectionShell>
    )
  }

  return (
    <SectionShell
      title="My Mentees"
      subtitle="Read assigned mentees and open individual details."
      actions={(
        <div className="role-toolbar__actions">
          <label className="admin-field role-field role-field--wide" htmlFor="faculty-mentees-search">
            <span>Search</span>
            <input
              id="faculty-mentees-search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="UID, name, section"
              autoComplete="off"
            />
          </label>
        </div>
      )}
    >
      <DataTable
        columns={columns}
        data={filteredRows}
        keyExtractor={(row) => row.id || row.uid}
        isLoading={menteesQuery.isPending}
        pageSize={12}
        emptyLabel="No mentees matched the current search."
      />
    </SectionShell>
  )
}
