import { useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { QueryState, SectionShell } from '../../../shared/ui'
import { useAddMentoringMinute, useMentee, useMenteeMinutes } from '../hooks'

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function prettyJson(value: unknown): string {
  if (value == null) return ''

  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function renderJsonPanel(title: string, value: unknown) {
  const text = prettyJson(value)

  return (
    <section className="detail-section">
      <h4>{title}</h4>
      {!text ? <p className="detail-empty">No data available.</p> : <pre className="faculty-json">{text}</pre>}
    </section>
  )
}

export function FacultyMenteeDetailPage() {
  const params = useParams<{ uid: string }>()
  const uid = params.uid ? decodeURIComponent(params.uid) : ''

  const menteeQuery = useMentee(uid)
  const minutesQuery = useMenteeMinutes(uid)
  const addMinuteMutation = useAddMentoringMinute(uid)

  const [remarks, setRemarks] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [action, setAction] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [formMessageIntent, setFormMessageIntent] = useState<'success' | 'error'>('success')

  if (!uid) {
    return (
      <SectionShell title="Mentee Detail" subtitle="Mentee identifier is missing from the route.">
        <QueryState tone="error" title="Invalid route" description="A mentee UID is required for this page." />
      </SectionShell>
    )
  }

  const isLoading = menteeQuery.isPending || minutesQuery.isPending
  const hasError = menteeQuery.isError || minutesQuery.isError

  if (isLoading) {
    return (
      <SectionShell title="Mentee Detail" subtitle="Loading mentee profile and mentoring records.">
        <QueryState title="Loading mentee data" description="Fetching profile and mentoring minutes..." />
      </SectionShell>
    )
  }

  if (hasError || !menteeQuery.data) {
    return (
      <SectionShell title="Mentee Detail" subtitle="Unable to read mentee data for the requested UID.">
        <QueryState
          tone="error"
          title="Unable to load mentee detail"
          description={toApiErrorMessage(
            menteeQuery.error ?? minutesQuery.error,
            'Please confirm the UID belongs to your assigned mentees.',
          )}
          actionLabel="Retry"
          onAction={() => {
            void Promise.all([menteeQuery.refetch(), minutesQuery.refetch()])
          }}
        />
      </SectionShell>
    )
  }

  const mentee = menteeQuery.data
  const minuteRows = minutesQuery.data?.mentoring_minutes ?? []
  const studentBanner = minutesQuery.data?.student

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!remarks.trim()) {
      setFormMessageIntent('error')
      setFormMessage('Remarks are required before saving a mentoring minute.')
      return
    }

    setFormMessage('')

    try {
      const result = await addMinuteMutation.mutateAsync({
        remarks: remarks.trim(),
        suggestion: suggestion.trim() || undefined,
        action: action.trim() || undefined,
      })

      setRemarks('')
      setSuggestion('')
      setAction('')
      setFormMessageIntent('success')
      setFormMessage(result.message || 'Mentoring minute saved successfully.')
      await minutesQuery.refetch()
    } catch (error) {
      setFormMessageIntent('error')
      setFormMessage(toApiErrorMessage(error, 'Unable to save mentoring minute.'))
    }
  }

  return (
    <SectionShell
      title={`Mentee: ${studentBanner?.full_name || mentee.full_name}`}
      subtitle={`UID ${mentee.uid} • Semester ${studentBanner?.semester ?? mentee.semester}${studentBanner?.section || mentee.section ? ` • Section ${studentBanner?.section ?? mentee.section}` : ''}`}
      actions={<Link to="/faculty/mentees">Back to mentees</Link>}
    >
      <div className="reports-grid-2">
        <section className="detail-section">
          <h4>Add mentoring minute</h4>
          <form className="detail-card-list" onSubmit={handleSubmit}>
            <label className="admin-field" htmlFor="faculty-minute-remarks">
              <span>Remarks *</span>
              <textarea
                id="faculty-minute-remarks"
                rows={4}
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                placeholder="Session notes, concerns, and progress"
                required
              />
            </label>

            <label className="admin-field" htmlFor="faculty-minute-suggestion">
              <span>Suggestion</span>
              <textarea
                id="faculty-minute-suggestion"
                rows={3}
                value={suggestion}
                onChange={(event) => setSuggestion(event.target.value)}
                placeholder="Suggested next focus area"
              />
            </label>

            <label className="admin-field" htmlFor="faculty-minute-action">
              <span>Action</span>
              <textarea
                id="faculty-minute-action"
                rows={3}
                value={action}
                onChange={(event) => setAction(event.target.value)}
                placeholder="Action items agreed during session"
              />
            </label>

            {formMessage ? (
              <p className={formMessageIntent === 'error' ? 'form-error' : 'query-state__description'}>
                {formMessage}
              </p>
            ) : null}

            <button type="submit" className="button button--primary" disabled={addMinuteMutation.isPending}>
              {addMinuteMutation.isPending ? 'Saving...' : 'Save minute'}
            </button>
          </form>
        </section>

        <section className="detail-section">
          <h4>Mentoring history</h4>
          {minuteRows.length === 0 ? (
            <p className="detail-empty">No mentoring minutes recorded yet.</p>
          ) : (
            <div className="detail-card-list">
              {minuteRows.map((minute) => (
                <article key={minute.id} className="detail-card">
                  <h5>{formatDate(minute.date)}</h5>
                  <p>
                    Sem {minute.semester}
                    {minute.created_by_faculty ? ' • Added by you' : ''}
                  </p>
                  <p>{minute.remarks}</p>
                  {minute.suggestion ? <p>Suggestion: {minute.suggestion}</p> : null}
                  {minute.action ? <p>Action: {minute.action}</p> : null}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="reports-grid-2">
        {renderJsonPanel('Personal information', mentee.personal_info)}
        {renderJsonPanel('Career objective', mentee.career_objective)}
        {renderJsonPanel('Skills', mentee.skills)}
        {renderJsonPanel('SWOC', mentee.swoc)}
        {renderJsonPanel('Past education', mentee.past_education_records)}
        {renderJsonPanel('Post-admission academics', mentee.post_admission_records)}
        {renderJsonPanel('Projects', mentee.projects)}
        {renderJsonPanel('Internships', mentee.internships)}
        {renderJsonPanel('Co-curricular participation', mentee.cocurricular_participations)}
        {renderJsonPanel('Co-curricular organizations', mentee.cocurricular_organizations)}
      </div>
    </SectionShell>
  )
}
