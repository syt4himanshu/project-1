import { useMemo, useState } from 'react'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { DataTable, QueryState, SectionShell, type TableColumn } from '../../../shared/ui'
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
      <SectionShell title="Students" subtitle="Summary view from /api/students?view=summary.">
        <QueryState
          tone="error"
          title="Unable to load student summary"
          description={toApiErrorMessage(studentsQuery.error, 'Please retry in a moment.')}
          actionLabel="Retry"
          onAction={() => void studentsQuery.refetch()}
        />
      </SectionShell>
    )
  }

  return (
    <SectionShell
      title="Students"
      subtitle="Filter, inspect details, and export profile snapshots."
      actions={(
        <div className="admin-filter-grid">
          <label className="admin-field" htmlFor="students-search">
            <span>Search</span>
            <input
              id="students-search"
              value={filters.search}
              onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
              placeholder="UID or name"
              autoComplete="off"
            />
          </label>

          <label className="admin-field" htmlFor="students-semester">
            <span>Semester</span>
            <select
              id="students-semester"
              value={filters.semester}
              onChange={(event) => setFilters((current) => ({ ...current, semester: event.target.value }))}
            >
              {SEMESTER_OPTIONS.map((option) => (
                <option key={option || 'all'} value={option}>
                  {option ? `Sem ${option}` : 'All semesters'}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-field" htmlFor="students-section">
            <span>Section</span>
            <input
              id="students-section"
              value={filters.section}
              onChange={(event) => setFilters((current) => ({ ...current, section: event.target.value }))}
              placeholder="e.g. A"
              autoComplete="off"
            />
          </label>

          <label className="admin-field" htmlFor="students-year">
            <span>Admission Year</span>
            <input
              id="students-year"
              value={filters.yearOfAdmission}
              onChange={(event) => setFilters((current) => ({ ...current, yearOfAdmission: event.target.value }))}
              placeholder="e.g. 2024"
              autoComplete="off"
              inputMode="numeric"
            />
          </label>

          <label className="admin-field" htmlFor="students-domain">
            <span>Domain</span>
            <input
              id="students-domain"
              value={filters.domain}
              onChange={(event) => setFilters((current) => ({ ...current, domain: event.target.value }))}
              placeholder="AI, Web, Data..."
              autoComplete="off"
            />
          </label>

          <label className="admin-field" htmlFor="students-goal">
            <span>Career Goal</span>
            <select
              id="students-goal"
              value={filters.careerGoal}
              onChange={(event) => setFilters((current) => ({ ...current, careerGoal: event.target.value }))}
            >
              {CAREER_GOAL_OPTIONS.map((option) => (
                <option key={option || 'all'} value={option}>
                  {option || 'All goals'}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    >
      <DataTable
        columns={columns}
        data={studentsQuery.data ?? []}
        keyExtractor={(row) => row.id || row.uid}
        isLoading={studentsQuery.isPending}
        pageSize={15}
        emptyLabel="No students matched the current filters."
      />

      <StudentDetailModal
        studentId={selectedStudentId}
        onClose={() => setSelectedStudentId(null)}
      />
    </SectionShell>
  )
}
