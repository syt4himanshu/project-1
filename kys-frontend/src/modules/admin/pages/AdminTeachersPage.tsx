import { useEffect, useMemo, useState } from 'react'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { QueryState, ResponsiveDataView, type TableColumn } from '../../../shared/ui'
import { sanitizeDisplayValue } from '../../../shared/utils/render'
import type { AdminFacultySummary } from '../api'
import { TeacherDetailModal } from '../components/teachers/TeacherDetailModal'
import { useAdminFacultyQuery } from '../hooks'

function normalizeSearchValue(value: string): string {
  return value.trim().toLowerCase()
}

function getInitials(fullName: string): string {
  const cleanName = sanitizeDisplayValue(fullName)
  const parts = cleanName.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return cleanName.slice(0, 2).toUpperCase() || 'NA'
}

function readOptional(row: AdminFacultySummary, key: string): string {
  const value = (row as unknown as Record<string, unknown>)[key]
  return sanitizeDisplayValue(value)
}

export function AdminTeachersPage() {
  const [searchValue, setSearchValue] = useState('')
  const [showFilters, setShowFilters] = useState(false)
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
        .map((entry) => sanitizeDisplayValue(entry).toLowerCase())
        .join(' ')

      return haystack.includes(query)
    })
  }, [facultyQuery.data, searchValue])

  const columns = useMemo<TableColumn<AdminFacultySummary>[]>(
    () => [
      {
        id: 'uid',
        header: 'UID',
        cell: (row) => <span className="mono-cell">{sanitizeDisplayValue(row.uid)}</span>,
      },
      {
        id: 'name',
        header: 'Name',
        cell: (row) => (
          <div>
            <p className="admin-identity__primary">{sanitizeDisplayValue(row.name)}</p>
            <p className="admin-identity__secondary">{sanitizeDisplayValue(row.email)}</p>
          </div>
        ),
      },
      {
        id: 'contact',
        header: 'Contact',
        cell: (row) => <span>{sanitizeDisplayValue(row.contact)}</span>,
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
            className="button button--soft"
            onClick={() => setSelectedFacultyId(row.id)}
          >
            View Detail
          </button>
        ),
      },
    ],
    [],
  )

  const renderTeacherCard = (row: AdminFacultySummary) => {
    const subjectsAssigned = row.studentsAssigned.length > 0
      ? row.studentsAssigned.map((subject) => sanitizeDisplayValue(subject)).join(', ')
      : '—'

    return (
      <div className="mobile-card">
        <div className="mobile-card__header">
          <div className="mobile-card__avatar" >
            {getInitials(row.name)}
          </div>
          <div className="mobile-card__info">
            <h4 className="mobile-card__title">{sanitizeDisplayValue(row.name)}</h4>
            <p className="mobile-card__subtitle">{sanitizeDisplayValue(row.uid)} · Employee</p>
          </div>
        </div>

        <div className="mobile-card__content">
          <div className="mobile-card__row">
            <span className="mobile-card__label">Department</span>
            <span className="mobile-card__value">{readOptional(row, 'department')}</span>
          </div>
          <div className="mobile-card__row">
            <span className="mobile-card__label">Designation</span>
            <span className="mobile-card__value">{readOptional(row, 'designation')}</span>
          </div>
          <div className="mobile-card__row">
            <span className="mobile-card__label">Email</span>
            <span className="mobile-card__value">{sanitizeDisplayValue(row.email)}</span>
          </div>
          <div className="mobile-card__row">
            <span className="mobile-card__label">Subjects Assigned</span>
            <span className="mobile-card__value">{subjectsAssigned}</span>
          </div>
        </div>

        <div className="mobile-card__actions">
          <button
            type="button"
            className="mobile-action-btn mobile-action-btn--secondary"
            onClick={() => setSelectedFacultyId(row.id)}
            title="View"
            aria-label="View"
          >
            <span className="material-symbols-outlined" aria-hidden="true">visibility</span>
          </button>
        </div>
      </div>
    )
  }

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

          <button
            type="button"
            className="button button--ghost button--icon desktop-hide"
            style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}
            onClick={() => setShowFilters((current) => !current)}
          >
            <span className="material-symbols-outlined">filter_list</span>
            {showFilters ? 'Hide Filters' : 'Filters ▼'}
          </button>
        </div>

        <div className={`role-toolbar__inline ${!showFilters ? 'mobile-hide' : ''}`}>
          <button className="button button--ghost button--icon role-chip-button">
            <span className="material-symbols-outlined" aria-hidden="true">filter_list</span> Filter
          </button>
          <button className="button button--ghost button--icon role-chip-button">
            <span className="material-symbols-outlined" aria-hidden="true">download</span> Export
          </button>
        </div>
      </div>

      <div className="admin-surface">
        <ResponsiveDataView
          columns={columns}
          data={filteredRows}
          keyExtractor={(row) => row.id}
          isLoading={facultyQuery.isPending}
          pageSize={12}
          emptyLabel="No teachers matched the current search."
          renderMobileCard={renderTeacherCard}
        />
      </div>

      <TeacherDetailModal
        facultyId={selectedFacultyId}
        onClose={() => setSelectedFacultyId(null)}
      />
    </div>
  )
}

