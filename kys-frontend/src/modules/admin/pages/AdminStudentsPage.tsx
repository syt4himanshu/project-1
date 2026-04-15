import { useEffect, useMemo, useState } from 'react'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { DataTable, QueryState, type TableColumn } from '../../../shared/ui'
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

function printNumber(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return 'N/A'
  return String(value)
}

function printText(value: string): string {
  const text = value.trim()
  return text || 'N/A'
}

export function AdminStudentsPage() {
  const [filters, setFilters] = useState<AdminStudentSummaryFilters>({
    search: '',
    semester: '',
    section: '',
    yearOfAdmission: '',
    domain: '',
    careerGoal: '',
  })
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
        cell: (row) => <span className="mono-cell">{row.uid}</span>,
      },
      {
        id: 'name',
        header: 'Name',
        cell: (row) => row.name,
      },
      {
        id: 'semester',
        header: 'Semester',
        cell: (row) => printNumber(row.semester),
      },
      {
        id: 'section',
        header: 'Section',
        cell: (row) => printText(row.section),
      },
      {
        id: 'mentor',
        header: 'Mentor',
        cell: (row) => printText(row.mentorName),
      },
      {
        id: 'careerGoal',
        header: 'Career Goal',
        cell: (row) => printText(row.careerGoal),
      },
      {
        id: 'domain',
        header: 'Domain',
        cell: (row) => printText(row.domainOfInterest),
      },
      {
        id: 'year',
        header: 'Admission Year',
        cell: (row) => printNumber(row.yearOfAdmission),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (row) => (
          <button
            type="button"
            className="button button--ghost"
            onClick={() => setSelectedStudentId(row.id)}
          >
            View Detail
          </button>
        ),
      },
    ],
    [],
  )

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
        <div className="role-toolbar__card role-toolbar__card--filters admin-toolbar-block">
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

        <div className="role-toolbar__card role-toolbar__card--bulk admin-toolbar-block">
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
              <span className="material-symbols-outlined" aria-hidden="true">filter_list</span> Advanced Filters
            </button>
            <button className="button button--ghost button--icon role-chip-button">
              <span className="material-symbols-outlined" aria-hidden="true">download</span> Export Data
            </button>
          </div>
        </div>
      </div>

      <div className="admin-surface">
        <DataTable
          columns={columns}
          data={studentsQuery.data ?? []}
          keyExtractor={(row) => row.id || row.uid}
          isLoading={studentsQuery.isPending}
          pageSize={15}
          emptyLabel="No students matched the current filters."
        />
      </div>

      <StudentDetailModal
        studentId={selectedStudentId}
        onClose={() => setSelectedStudentId(null)}
      />
    </div>
  )
}
