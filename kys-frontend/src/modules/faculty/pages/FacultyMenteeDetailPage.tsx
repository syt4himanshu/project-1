import { useMemo, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { Modal, QueryState } from '../../../shared/ui'
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

function initials(name: string): string {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function FacultyMenteeDetailPage() {
  const params = useParams<{ uid: string }>()
  const uid = params.uid ? decodeURIComponent(params.uid) : ''

  const menteeQuery = useMentee(uid)
  const minutesQuery = useMenteeMinutes(uid)
  const addMinuteMutation = useAddMentoringMinute(uid)

  const [remarksOpen, setRemarksOpen] = useState(false)
  const [remarks, setRemarks] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [actionPlan, setActionPlan] = useState('')
  const [formError, setFormError] = useState('')

  const student = menteeQuery.data
  const personalInfo = (student?.personal_info && typeof student.personal_info === 'object'
    ? (student.personal_info as Record<string, unknown>)
    : {})
  const program = String(
    personalInfo.department ??
    personalInfo.program ??
    personalInfo.branch ??
    'N/A',
  )
  const minutes = useMemo(() => minutesQuery.data?.mentoring_minutes ?? [], [minutesQuery.data?.mentoring_minutes])

  const closeRemarksModal = () => {
    setRemarksOpen(false)
    setRemarks('')
    setSuggestion('')
    setActionPlan('')
    setFormError('')
  }

  const handleSubmitRemarks = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError('')

    if (!remarks.trim()) {
      setFormError('Remarks are required.')
      return
    }

    try {
      await addMinuteMutation.mutateAsync({
        remarks: remarks.trim(),
        suggestion: suggestion.trim() || undefined,
        action: actionPlan.trim() || undefined,
      })

      closeRemarksModal()
      await minutesQuery.refetch()
    } catch (error) {
      setFormError(toApiErrorMessage(error, 'Unable to submit remarks.'))
    }
  }

  if (!uid) {
    return (
      <div className="faculty-mentoring-page">
        <QueryState
          tone="error"
          title="Invalid student route"
          description="Student UID is missing."
        />
      </div>
    )
  }

  if (menteeQuery.isPending || minutesQuery.isPending) {
    return (
      <div className="faculty-mentoring-page">
        <QueryState title="Loading mentoring panel" description="Fetching student data and previous records..." />
      </div>
    )
  }

  if (menteeQuery.isError || minutesQuery.isError || !student) {
    return (
      <div className="faculty-mentoring-page">
        <QueryState
          tone="error"
          title="Unable to load mentoring panel"
          description={toApiErrorMessage(menteeQuery.error ?? minutesQuery.error, 'Please retry in a moment.')}
          actionLabel="Retry"
          onAction={() => {
            void Promise.all([menteeQuery.refetch(), minutesQuery.refetch()])
          }}
        />
      </div>
    )
  }

  return (
    <div className="faculty-mentoring-page">
      <header className="faculty-mentoring-page__banner">
        <h1>Faculty Mentoring Portal</h1>
        <p>Manage student mentoring records and provide guidance</p>
      </header>

      <section className="faculty-mentoring-page__student-card">
        <div className="faculty-mentoring-page__student-left">
          <div className="faculty-mentoring-page__avatar">{initials(student.full_name)}</div>
          <div>
            <h2>{student.full_name}</h2>
            <p><strong>UID:</strong> {student.uid}</p>
            <p><strong>Program:</strong> {program}</p>
            <p><strong>Current Semester:</strong> {student.semester}</p>
          </div>
        </div>

        <button type="button" className="button button--primary" onClick={() => setRemarksOpen(true)}>
          Give Remarks
        </button>
      </section>

      <section className="faculty-mentoring-page__history">
        <h3>Previous Mentoring Records</h3>
        {minutes.length === 0 ? (
          <p className="faculty-mentoring-page__empty">No mentoring records found for this student yet.</p>
        ) : (
          <div className="faculty-mentoring-page__history-list">
            {minutes.map((minute) => (
              <article key={minute.id} className="faculty-mentoring-page__history-item">
                <div className="faculty-mentoring-page__history-head">
                  <span>{formatDate(minute.date)}</span>
                  <span>Semester {minute.semester}</span>
                </div>
                <p><strong>Remarks:</strong> {minute.remarks || 'N/A'}</p>
                {minute.suggestion ? <p><strong>Suggestions:</strong> {minute.suggestion}</p> : null}
                {minute.action ? <p><strong>Action Plan:</strong> {minute.action}</p> : null}
              </article>
            ))}
          </div>
        )}
      </section>

      <Modal
        open={remarksOpen}
        title="Add Mentoring Remarks"
        subtitle={`Name: ${student.full_name} | UID: ${student.uid} | Semester: ${student.semester}`}
        onClose={closeRemarksModal}
        size="lg"
      >
        <form className="faculty-remarks-form" onSubmit={handleSubmitRemarks}>
          <label className="admin-field" htmlFor="faculty-remarks-page-input">
            <span>Remarks *</span>
            <textarea
              id="faculty-remarks-page-input"
              rows={4}
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              placeholder="Enter your observations and comments about the student"
              required
            />
          </label>

          <label className="admin-field" htmlFor="faculty-suggestion-page-input">
            <span>Suggestions</span>
            <textarea
              id="faculty-suggestion-page-input"
              rows={3}
              value={suggestion}
              onChange={(event) => setSuggestion(event.target.value)}
              placeholder="Provide suggestions for improvement"
            />
          </label>

          <label className="admin-field" htmlFor="faculty-action-page-input">
            <span>Action Plan</span>
            <textarea
              id="faculty-action-page-input"
              rows={3}
              value={actionPlan}
              onChange={(event) => setActionPlan(event.target.value)}
              placeholder="Outline specific actions to be taken"
            />
          </label>

          {formError ? <p className="form-error">{formError}</p> : null}

          <div className="faculty-remarks-form__actions">
            <button type="button" className="button button--ghost" onClick={closeRemarksModal}>
              Cancel
            </button>
            <button type="submit" className="button button--primary" disabled={addMinuteMutation.isPending}>
              {addMinuteMutation.isPending ? 'Submitting...' : 'Submit Remarks'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
