import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../app/providers/auth-context'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { QueryState } from '../../../shared/ui'
import { PhotoAvatar } from '../../../shared/components/PhotoAvatar'
import { StudentPreviewModal } from '../components/StudentPreviewModal'
import { useMentees } from '../hooks'

export function FacultyDashboardPage() {
  const { user } = useAuth()
  const menteesQuery = useMentees()

  const [searchValue, setSearchValue] = useState('')
  const [semesterFilter, setSemesterFilter] = useState('')
  const [batchFilter, setBatchFilter] = useState('')
  const [sectionFilter, setSectionFilter] = useState('')
  const [activeUid, setActiveUid] = useState('')

  const mentees = menteesQuery.data ?? []

  const semesterOptions = useMemo(
    () => [...new Set(mentees.map((row) => row.semester).filter((v) => Number.isFinite(v)))].sort((a, b) => a - b),
    [mentees],
  )

  const batchOptions = useMemo(
    () => [...new Set(mentees.map((row) => row.year_of_admission).filter((v): v is number => typeof v === 'number'))].sort((a, b) => b - a),
    [mentees],
  )

  const sectionOptions = useMemo(
    () => [...new Set(mentees.map((row) => row.section?.trim()).filter((v): v is string => Boolean(v)))].sort(),
    [mentees],
  )

  const filteredMentees = useMemo(() => {
    const search = searchValue.trim().toLowerCase()

    return mentees.filter((row) => {
      const searchHaystack = `${row.uid} ${row.full_name} ${row.section ?? ''} ${row.year_of_admission ?? ''} ${row.semester}`
        .toLowerCase()
      const searchMatch = search ? searchHaystack.includes(search) : true
      const semesterMatch = semesterFilter ? String(row.semester) === semesterFilter : true
      const batchMatch = batchFilter ? String(row.year_of_admission ?? '') === batchFilter : true
      const sectionMatch = sectionFilter ? String(row.section ?? '') === sectionFilter : true

      return searchMatch && semesterMatch && batchMatch && sectionMatch
    })
  }, [batchFilter, mentees, searchValue, sectionFilter, semesterFilter])

  const getInitials = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')

  const totalStudents = mentees.length
  const totalSemesters = semesterOptions.length
  const totalBatches = batchOptions.length
  const totalSections = sectionOptions.length

  useEffect(() => {
    console.log('[FACULTY] mentee photo_urls:', mentees.map((row) => ({
      uid: row.uid,
      photo_url: row.photo_url ?? null,
    })))
  }, [mentees])

  return (
    <div className="faculty-dashboard faculty-dashboard--teacher">
      <header className="faculty-dashboard__banner">
        <div>
          <h1 className="faculty-dashboard__title">
            Welcome back{user?.username ? `, ${user.username}` : ''}
          </h1>
          <p className="faculty-dashboard__subtitle">
            Here&apos;s a snapshot of your mentoring workspace.
          </p>
        </div>
      </header>

      {menteesQuery.isError ? (
        <QueryState
          tone="error"
          title="Unable to load mentee summary"
          description={toApiErrorMessage(menteesQuery.error, 'Please retry in a moment.')}
          actionLabel="Retry"
          onAction={() => void menteesQuery.refetch()}
        />
      ) : null}

      <div className="faculty-overview">
        <div className="faculty-overview__head">
          <h2 className="faculty-overview__title">Teacher Dashboard</h2>
          <div className="faculty-overview__quick-links">
            <Link to="/faculty/chatbot" className="button button--ghost">Chatbot</Link>
            <Link to="/faculty/profile#change-password" className="button button--ghost">Change Password</Link>
          </div>
        </div>

        <div className="faculty-overview__metrics">
          <article className="faculty-metric-card">
            <p className="faculty-metric-card__label">Total Students</p>
            <p className="faculty-metric-card__value">{menteesQuery.isPending ? '...' : totalStudents}</p>
          </article>
          <article className="faculty-metric-card">
            <p className="faculty-metric-card__label">Semesters</p>
            <p className="faculty-metric-card__value">{menteesQuery.isPending ? '...' : totalSemesters}</p>
          </article>
          <article className="faculty-metric-card">
            <p className="faculty-metric-card__label">Batches</p>
            <p className="faculty-metric-card__value">{menteesQuery.isPending ? '...' : totalBatches}</p>
          </article>
          <article className="faculty-metric-card">
            <p className="faculty-metric-card__label">Sections</p>
            <p className="faculty-metric-card__value">{menteesQuery.isPending ? '...' : totalSections}</p>
          </article>
        </div>

        <section className="faculty-overview__filters">
          <h3>Search & Filter Students</h3>
          <div className="faculty-overview__filter-grid">
            <label className="admin-field" htmlFor="faculty-dashboard-search">
              <span className="sr-only">Search students</span>
              <input
                id="faculty-dashboard-search"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search students by name, UID, section"
                autoComplete="off"
              />
            </label>
            <label className="admin-field" htmlFor="faculty-dashboard-semester">
              <span className="sr-only">Semester</span>
              <select
                id="faculty-dashboard-semester"
                value={semesterFilter}
                onChange={(event) => setSemesterFilter(event.target.value)}
              >
                <option value="">All Semesters</option>
                {semesterOptions.map((semester) => (
                  <option key={semester} value={semester}>Sem {semester}</option>
                ))}
              </select>
            </label>
            <label className="admin-field" htmlFor="faculty-dashboard-batch">
              <span className="sr-only">Batch</span>
              <select
                id="faculty-dashboard-batch"
                value={batchFilter}
                onChange={(event) => setBatchFilter(event.target.value)}
              >
                <option value="">All Batches</option>
                {batchOptions.map((batch) => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </label>
            <label className="admin-field" htmlFor="faculty-dashboard-section">
              <span className="sr-only">Section</span>
              <select
                id="faculty-dashboard-section"
                value={sectionFilter}
                onChange={(event) => setSectionFilter(event.target.value)}
              >
                <option value="">All Sections</option>
                {sectionOptions.map((section) => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="faculty-overview__students">
          <div className="faculty-overview__students-head">
            <h3>Students ({filteredMentees.length})</h3>
            <span className="faculty-overview__students-badge">Student Details</span>
          </div>

          <div className="faculty-overview__students-list">
            {filteredMentees.length === 0 ? (
              <p className="faculty-overview__empty">
                No students match the selected filters.
              </p>
            ) : (
              filteredMentees.map((row) => (
                <article className="faculty-student-row" key={row.id || row.uid}>
                  <div className="faculty-student-row__left">
                    <PhotoAvatar
                      url={row.photo_url}
                      alt={`${row.full_name} profile`}
                      className="faculty-student-row__avatar faculty-student-row__avatar--image"
                      fallback={<div className="faculty-student-row__avatar">{getInitials(row.full_name)}</div>}
                    />
                    <div>
                      <p className="faculty-student-row__name">{row.full_name}</p>
                      <div className="faculty-student-row__meta">
                        <span>Sem {row.semester}</span>
                        <span>{row.section?.trim() || 'Section N/A'}</span>
                        <span>{row.year_of_admission ?? 'Batch N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <button type="button" className="button button--primary" onClick={() => setActiveUid(row.uid)}>
                    View
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      <StudentPreviewModal
        uid={activeUid}
        open={Boolean(activeUid)}
        onClose={() => setActiveUid('')}
      />
    </div>
  )
}
