import { useEffect, useMemo, useState } from 'react'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { ResponsiveDataView, QueryState, type TableColumn } from '../../../shared/ui'
import { sanitizeDisplayValue, getAvatarColor } from '../../../shared/utils/render'
import type { AdminStudentSummary, AdminStudentSummaryFilters } from '../api'
import { StudentDetailModal } from '../components/students/StudentDetailModal'
import { useAdminStudentSummaryQuery } from '../hooks'

const SEMESTER_OPTIONS = ['', '1', '2', '3', '4', '5', '6', '7', '8'] as const

const CAREER_GOAL_OPTIONS = [
  '',
  'Placement',
  'Higher Studies',
  'Entrepreneurship',
  'Government Exams',
  'Not Decided',
] as const

export function AdminStudentsPage() {
  const [filters, setFilters] = useState<AdminStudentSummaryFilters>({
    search: '',
    semester: '',
    section: '',
    yearOfAdmission: '',
    domain: '',
    careerGoal: '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)

  useEffect(() => {
    document.title = 'Students Directory - KYS'
  }, [])

  const studentsQuery = useAdminStudentSummaryQuery(filters)

  const columns = useMemo<TableColumn<AdminStudentSummary>[]>(
    () => [
      {
        id: 'uid',
        header: 'UID',
        cell: (row) => <span className="mono-cell">{sanitizeDisplayValue(row.uid)}</span>,
      },
      {
        id: 'name',
        header: 'Name',
        cell: (row) => sanitizeDisplayValue(row.name),
      },
      {
        id: 'semester',
        header: 'Semester',
        cell: (row) => row.semester ? `Sem ${row.semester}` : 'N/A',
      },
      {
        id: 'section',
        header: 'Section',
        cell: (row) => sanitizeDisplayValue(row.section),
      },
      {
        id: 'mentor',
        header: 'Mentor',
        cell: (row) => sanitizeDisplayValue(row.mentorName),
      },
      {
        id: 'careerGoal',
        header: 'Career Goal',
        cell: (row) => sanitizeDisplayValue(row.careerGoal),
      },
      {
        id: 'domain',
        header: 'Domain',
        cell: (row) => sanitizeDisplayValue(row.domainOfInterest),
      },
      {
        id: 'year',
        header: 'Admission Year',
        cell: (row) => row.yearOfAdmission || 'N/A',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (row) => (
            <button
              type="button"
              className="button button--soft"
              onClick={() => setSelectedStudentId(row.id)}
            >
              View Detail
            </button>
        ),
      },
    ],
    [],
  )

  const renderStudentCard = (row: AdminStudentSummary) => {
    // Determine initials for avatar
    const nameParts = row.name.split(' ').filter(Boolean)
    const initials = nameParts.length >= 2 
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : row.name.slice(0, 2).toUpperCase()

    return (
      <div className="mobile-card">
        <div className="mobile-card__header">
          <div className="mobile-card__avatar">
            {initials}
          </div>
          <div className="mobile-card__info">
            <h4 className="mobile-card__title">{sanitizeDisplayValue(row.name)}</h4>
            <p className="mobile-card__subtitle">{sanitizeDisplayValue(row.uid)} · Student</p>
          </div>
        </div>

        <div className="mobile-card__content">
          <div className="mobile-card__row">
            <span className="mobile-card__label">Branch / Domain</span>
            <span className="mobile-card__value">{sanitizeDisplayValue(row.domainOfInterest)}</span>
          </div>
          <div className="mobile-card__row">
            <span className="mobile-card__label">Year / Sem</span>
            <span className="mobile-card__value">
              {row.yearOfAdmission || 'N/A'} · {row.semester ? `Sem ${row.semester}` : 'N/A'}
            </span>
          </div>
          <div className="mobile-card__row">
            <span className="mobile-card__label">Backlogs</span>
            <div className="mobile-card__pill-list">
              {/* Backlog data isn't in summary yet, showing Clear as default or placeholder */}
              <span className="mobile-card__pill mobile-card__pill--success">Clear</span>
            </div>
          </div>
        </div>

        <div className="mobile-card__actions">
          {/* View Only for current Student Page scope */}
          <button 
            className="mobile-action-btn mobile-action-btn--secondary"
            onClick={() => setSelectedStudentId(row.id)}
            title="View Detail"
          >
            <span className="material-symbols-outlined">visibility</span>
          </button>
        </div>
      </div>
    )
  }

  if (studentsQuery.isError) {
    return (
      <div className="admin-page">
        <div className="admin-page__header">
          <h3 className="admin-page__title">Students Directory</h3>
          <p className="admin-page__subtitle">Summary view from /api/students?view=summary.</p>
        </div>
        <QueryState
          tone="error"
          title="Unable to load student summary"
          description={toApiErrorMessage(studentsQuery.error, 'Please retry in a moment.')}
          actionLabel="Retry"
          onAction={() => void studentsQuery.refetch()}
        />
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h3 className="admin-page__title">Students Directory</h3>
        <p className="admin-page__subtitle">Filter, inspect details, and export profile snapshots.</p>
      </div>

      <div className="admin-toolbar-grid admin-toolbar-grid--students">
        {/* Search - Always Visible */}
        <div className="role-toolbar__card admin-toolbar-block">
          <div className="role-field role-field--icon">
            <span className="material-symbols-outlined">search</span>
            <input
              className="role-input role-input--with-icon"
              placeholder="Search by UID, name or email"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              type="text"
            />
          </div>
          
          <button 
            className="button button--ghost button--icon desktop-hide"
            style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="material-symbols-outlined">filter_list</span>
            {showFilters ? 'Hide Filters' : 'Filters ▼'}
          </button>
        </div>

        {/* Desktop Filters OR Mobile Conditional Filters */}
        <div className={`role-toolbar__card role-toolbar__card--filters admin-toolbar-block ${!showFilters ? 'mobile-hide' : ''}`}>
          <div className="admin-toolbar-fields-grid admin-toolbar-fields-grid--two">
            <select
              className="role-select"
              value={filters.semester}
              onChange={(event) => setFilters((current) => ({ ...current, semester: event.target.value }))}
            >
              {SEMESTER_OPTIONS.map((option) => (
                <option key={option || 'all'} value={option}>
                  {option ? `Sem ${option}` : 'All semesters'}
                </option>
              ))}
            </select>
            <input
              className="role-input"
              placeholder="Section"
              value={filters.section}
              onChange={(event) => setFilters((current) => ({ ...current, section: event.target.value }))}
            />
          </div>
        </div>

        <div className={`role-toolbar__card role-toolbar__card--bulk admin-toolbar-block ${!showFilters ? 'mobile-hide' : ''}`}>
          <div className="admin-toolbar-fields-grid admin-toolbar-fields-grid--three">
            <input
              className="role-input"
              placeholder="Admission Year"
              value={filters.yearOfAdmission}
              onChange={(event) => setFilters((current) => ({ ...current, yearOfAdmission: event.target.value }))}
            />
            <input
              className="role-input"
              placeholder="Domain"
              value={filters.domain}
              onChange={(event) => setFilters((current) => ({ ...current, domain: event.target.value }))}
            />
            <select
              className="role-select"
              value={filters.careerGoal}
              onChange={(event) => setFilters((current) => ({ ...current, careerGoal: event.target.value }))}
            >
              {CAREER_GOAL_OPTIONS.map((option) => (
                <option key={option || 'all'} value={option}>
                  {option || 'All goals'}
                </option>
              ))}
            </select>
          </div>
          <div className="role-toolbar__inline">
            <button className="button button--ghost button--icon role-chip-button">
              <span className="material-symbols-outlined" aria-hidden="true">download</span> Export Data
            </button>
          </div>
        </div>
      </div>

      <div className="admin-surface">
        <ResponsiveDataView
          columns={columns}
          data={studentsQuery.data ?? []}
          keyExtractor={(row) => row.id || row.uid}
          isLoading={studentsQuery.isPending}
          pageSize={15}
          emptyLabel="No students matched the current filters."
          renderMobileCard={renderStudentCard}
        />
      </div>

      <StudentDetailModal
        studentId={selectedStudentId}
        onClose={() => setSelectedStudentId(null)}
      />
    </div>
  )
}

