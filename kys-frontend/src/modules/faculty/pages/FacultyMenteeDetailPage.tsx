import { useMemo, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { Modal, QueryState } from '../../../shared/ui'
import { PhotoAvatar } from '../../../shared/components/PhotoAvatar'
import { extractStudentPhotoUrl } from '../../../shared/utils/studentPhoto'
import { useAddMentoringMinute, useMentee, useMenteeMinutes } from '../hooks'
import { AIRemarksAssistant } from '../components/AIRemarksAssistant'
import '../components/AIRemarksAssistant.css'
import { Sparkles } from 'lucide-react'

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
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
  const [remarks, setRemarks] = useState('')
  const [mentorRemarks, setMentorRemarks] = useState('')
  const [issues, setIssues] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [actionPlan, setActionPlan] = useState('')
  const [formError, setFormError] = useState('')

  const student = menteeQuery.data
  const personalInfo = (student?.personal_info && typeof student.personal_info === 'object'
    ? (student.personal_info as Record<string, unknown>)
    : {})
  const studentPhotoUrl = useMemo(() => extractStudentPhotoUrl(student), [student])
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
    setMentorRemarks('')
    setIssues('')
    setSuggestion('')
    setActionPlan('')
    setFormError('')
  }

  const handleAIInsert = (aiRemarks: string, aiSuggestion?: string, aiAction?: string) => {
    setRemarks(aiRemarks)
    if (aiSuggestion) setSuggestion(aiSuggestion)
    if (aiAction) setActionPlan(aiAction)
    setAiAssistantOpen(false)
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
        mentor_remarks: mentorRemarks.trim() || undefined,
        issues: issues.trim() || undefined,
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
          <PhotoAvatar
            url={studentPhotoUrl}
            alt={`${student.full_name} profile`}
            className="faculty-mentoring-page__avatar faculty-mentoring-page__avatar--image"
            loading="eager"
            fallback={<div className="faculty-mentoring-page__avatar">{initials(student.full_name)}</div>}
          />
          <div>
            <h2>{student.full_name}</h2>
            <p><strong>UID:</strong> {student.uid}</p>
            <p><strong>Program:</strong> {program}</p>
            <p><strong>Current Semester:</strong> {student.semester}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="button" className="button button--soft" onClick={() => setAiAssistantOpen(true)}>
            <Sparkles size={16} style={{ marginRight: '6px' }} /> AI Assistant
          </button>
          <button type="button" className="button button--soft" onClick={() => setRemarksOpen(true)}>
            Give Remarks
          </button>
        </div>
      </section>

      <section className="faculty-mentoring-page__history">
        <h3>Previous Mentoring Records</h3>
        {minutes.length === 0 ? (
          <p className="faculty-mentoring-page__empty">No mentoring records found for this mentee yet.</p>
        ) : (
          <div className="faculty-mentoring-page__history-list">
            {minutes.map((minute) => (
              <article key={minute.id} className="faculty-mentoring-page__history-item">
                <div className="faculty-mentoring-page__history-head">
                  <span>{formatDate(minute.date)}</span>
                  <span>Semester {minute.semester}</span>
                </div>
                <p><strong>AI Remarks:</strong> {minute.remarks || 'N/A'}</p>
                <p><strong>Mentor Remarks:</strong> {minute.mentor_remarks || 'None'}</p>
                <p><strong>Issues:</strong> {minute.issues || 'None'}</p>
                <p><strong>Suggestions:</strong> {minute.suggestion || 'None'}</p>
                <p><strong>Action Plan:</strong> {minute.action || 'None'}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <AIRemarksAssistant
        open={aiAssistantOpen}
        studentContext={{
          uid: student.uid,
          name: student.full_name,
          semester: student.semester,
          program,
          previousRemarks: minutes.slice(0, 3).map((m) => ({
            date: m.date,
            remarks: m.remarks,
            suggestion: m.suggestion ?? undefined,
            action: m.action ?? undefined,
          })),
        }}
        onClose={() => setAiAssistantOpen(false)}
        onInsert={handleAIInsert}
      />

      <Modal
        open={remarksOpen}
        title="Add Mentoring Remarks"
        subtitle={`Name: ${student.full_name} | UID: ${student.uid} | Semester: ${student.semester}`}
        onClose={closeRemarksModal}
        size="lg"
      >
        <form className="faculty-remarks-form" onSubmit={handleSubmitRemarks}>
          <label className="admin-field" htmlFor="faculty-remarks-page-input">
            <span>AI Remarks *</span>
            <textarea
              id="faculty-remarks-page-input"
              rows={4}
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              placeholder="AI generated observations and comments about the mentee"
              required
            />
          </label>

          <label className="admin-field" htmlFor="faculty-mentor-remarks-page-input">
            <span>Mentor Remarks</span>
            <textarea
              id="faculty-mentor-remarks-page-input"
              rows={4}
              value={mentorRemarks}
              onChange={(event) => setMentorRemarks(event.target.value)}
              placeholder="Enter your own observations and comments about the mentee"
            />
          </label>

          <label className="admin-field" htmlFor="faculty-issues-page-input">
            <span>Issues</span>
            <textarea
              id="faculty-issues-page-input"
              rows={3}
              value={issues}
              onChange={(event) => setIssues(event.target.value)}
              placeholder="Record any specific issues or concerns"
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
            <button type="button" className="button button--soft" onClick={closeRemarksModal}>
              Cancel
            </button>
            <button type="submit" className="button button--soft" disabled={addMinuteMutation.isPending}>
              {addMinuteMutation.isPending ? 'Submitting...' : 'Submit Remarks'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
