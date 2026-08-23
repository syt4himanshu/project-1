import { useMemo, useState, type FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { Modal, QueryState } from '../../../shared/ui'
import { PhotoAvatar } from '../../../shared/components/PhotoAvatar'
import { extractStudentPhotoUrl } from '../../../shared/utils/studentPhoto'
import { useAddMentoringMinute, useLockMentee, useMentee, useMenteeMinutes, useUnlockMentee } from '../hooks'
import { AIRemarksAssistant } from '../components/AIRemarksAssistant'
import { FacultyMenteeEditModal } from '../components/FacultyMenteeEditModal'
import { useToast } from '../../../app/providers/toast-context'
import '../components/AIRemarksAssistant.css'
import { CheckCircle, Edit3, Lock, Sparkles, Unlock } from 'lucide-react'

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

  const toast = useToast()
  const menteeQuery = useMentee(uid)
  const minutesQuery = useMenteeMinutes(uid)
  const addMinuteMutation = useAddMentoringMinute(uid)
  const lockMutation = useLockMentee(uid)
  const unlockMutation = useUnlockMentee(uid)

  const [remarksOpen, setRemarksOpen] = useState(false)
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
  const [lockConfirmOpen, setLockConfirmOpen] = useState(false)
  const [unlockConfirmOpen, setUnlockConfirmOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [lockError, setLockError] = useState('')

  const [remarks, setRemarks] = useState('')
  const [mentorRemarks, setMentorRemarks] = useState('')
  const [issues, setIssues] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [actionPlan, setActionPlan] = useState('')
  const [formError, setFormError] = useState('')

  const handleLock = async () => {
    setLockError('')
    try {
      await lockMutation.mutateAsync()
      toast.success('Mentee profile locked successfully.')
      setLockConfirmOpen(false)
    } catch (error) {
      setLockError(toApiErrorMessage(error, 'Failed to lock mentee profile.'))
    }
  }

  const handleUnlock = async () => {
    setLockError('')
    try {
      await unlockMutation.mutateAsync()
      toast.success('Mentee profile unlocked successfully.')
      setUnlockConfirmOpen(false)
    } catch (error) {
      setLockError(toApiErrorMessage(error, 'Failed to unlock mentee profile.'))
    }
  }

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0 }}>{student.full_name}</h2>
              {student.is_profile_locked ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                  <Lock size={12} /> Profile Locked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">
                  <CheckCircle size={12} /> Editable by Student
                </span>
              )}
            </div>
            <p><strong>UID:</strong> {student.uid}</p>
            <p><strong>Program:</strong> {program}</p>
            <p><strong>Current Semester:</strong> {student.semester}</p>
            {student.is_profile_locked && student.profile_locked_at ? (
              <p style={{ fontSize: '0.8125rem', color: '#64748b', marginTop: '0.25rem' }}>
                Locked on: {formatDate(student.profile_locked_at)}
              </p>
            ) : null}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="button button--soft"
            onClick={() => setEditModalOpen(true)}
          >
            <Edit3 size={16} style={{ marginRight: '6px' }} /> Edit Profile
          </button>

          {student.is_profile_locked ? (
            <button
              type="button"
              className="button button--soft"
              onClick={() => setUnlockConfirmOpen(true)}
            >
              <Unlock size={16} style={{ marginRight: '6px' }} /> Unlock Profile
            </button>
          ) : (
            <button
              type="button"
              className="button button--soft"
              onClick={() => setLockConfirmOpen(true)}
            >
              <Lock size={16} style={{ marginRight: '6px' }} /> Lock Profile
            </button>
          )}

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

      <Modal
        open={lockConfirmOpen}
        title="Lock Mentee Profile"
        subtitle={`Student: ${student.full_name} (${student.uid})`}
        onClose={() => setLockConfirmOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Lock this student&apos;s profile?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            After locking, the student will be able to view their profile but will not be able to edit it. You will still be able to edit the profile.
          </p>

          {lockError ? <p className="form-error">{lockError}</p> : null}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              className="button button--soft"
              onClick={() => setLockConfirmOpen(false)}
              disabled={lockMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button button--primary"
              onClick={() => void handleLock()}
              disabled={lockMutation.isPending}
            >
              {lockMutation.isPending ? 'Locking...' : 'Lock Profile'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={unlockConfirmOpen}
        title="Unlock Mentee Profile"
        subtitle={`Student: ${student.full_name} (${student.uid})`}
        onClose={() => setUnlockConfirmOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Unlock this student&apos;s profile?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The student will be able to edit their profile again.
          </p>

          {lockError ? <p className="form-error">{lockError}</p> : null}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              className="button button--soft"
              onClick={() => setUnlockConfirmOpen(false)}
              disabled={unlockMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button button--primary"
              onClick={() => void handleUnlock()}
              disabled={unlockMutation.isPending}
            >
              {unlockMutation.isPending ? 'Unlocking...' : 'Unlock Profile'}
            </button>
          </div>
        </div>
      </Modal>

      <FacultyMenteeEditModal
        uid={uid}
        open={editModalOpen}
        mentee={student}
        onClose={() => setEditModalOpen(false)}
      />
    </div>
  )
}
