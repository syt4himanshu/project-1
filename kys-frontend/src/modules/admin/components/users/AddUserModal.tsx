import { useState } from 'react'
import { Modal } from '../../../../shared/ui'
import type { CreateAdminUserInput } from '../../api'
import { useCreateAdminUserMutation } from '../../hooks'

interface AddUserModalProps {
  open: boolean
  onClose: () => void
}

type RoleSelection = 'student' | 'faculty'

interface StudentFormState {
  uid: string
  name: string
  password: string
  semester: string
  section: string
  year_of_admission: string
}

interface FacultyFormState {
  email: string
  first_name: string
  last_name: string
  contact_number: string
  password: string
}

const EMPTY_STUDENT_FORM: StudentFormState = {
  uid: '',
  name: '',
  password: '',
  semester: '',
  section: '',
  year_of_admission: '',
}

const EMPTY_FACULTY_FORM: FacultyFormState = {
  email: '',
  first_name: '',
  last_name: '',
  contact_number: '',
  password: '',
}

function toNumber(value: string): number | null {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function validateStudent(form: StudentFormState): string | null {
  if (!form.uid.trim()) return 'UID is required.'
  if (!form.name.trim()) return 'Name is required.'
  if (form.password.trim().length < 6) return 'Password must be at least 6 characters.'

  const semester = toNumber(form.semester)
  if (!semester || semester < 1 || semester > 8) return 'Semester must be between 1 and 8.'

  if (!form.section.trim()) return 'Section is required.'

  const year = toNumber(form.year_of_admission)
  if (!year || year < 2000 || year > 2100) return 'Admission year must be between 2000 and 2100.'

  return null
}

function validateFaculty(form: FacultyFormState): string | null {
  const email = form.email.trim().toLowerCase()
  if (!email) return 'Email is required.'
  if (!email.endsWith('@stvincentngp.edu.in')) return 'Email must end with @stvincentngp.edu.in.'
  if (!form.first_name.trim()) return 'First name is required.'
  if (!form.last_name.trim()) return 'Last name is required.'
  if (form.contact_number.replace(/\D/g, '').length < 10) return 'Contact number must contain at least 10 digits.'
  if (form.password.trim().length < 6) return 'Password must be at least 6 characters.'

  return null
}

function studentPayload(form: StudentFormState): CreateAdminUserInput {
  return {
    role: 'student',
    uid: form.uid.trim(),
    name: form.name.trim(),
    password: form.password.trim(),
    semester: Number(form.semester),
    section: form.section.trim(),
    year_of_admission: Number(form.year_of_admission),
  }
}

function facultyPayload(form: FacultyFormState): CreateAdminUserInput {
  return {
    role: 'faculty',
    email: form.email.trim().toLowerCase(),
    first_name: form.first_name.trim(),
    last_name: form.last_name.trim(),
    contact_number: form.contact_number.trim(),
    password: form.password.trim(),
  }
}

export function AddUserModal({ open, onClose }: AddUserModalProps) {
  const [role, setRole] = useState<RoleSelection>('student')
  const [studentForm, setStudentForm] = useState<StudentFormState>(EMPTY_STUDENT_FORM)
  const [facultyForm, setFacultyForm] = useState<FacultyFormState>(EMPTY_FACULTY_FORM)
  const [errorMessage, setErrorMessage] = useState('')
  const createUserMutation = useCreateAdminUserMutation()

  const isSubmitting = createUserMutation.isPending

  const reset = () => {
    setStudentForm(EMPTY_STUDENT_FORM)
    setFacultyForm(EMPTY_FACULTY_FORM)
    setErrorMessage('')
    setRole('student')
  }

  const handleClose = () => {
    if (isSubmitting) return
    reset()
    onClose()
  }

  const submit = async () => {
    setErrorMessage('')

    const validationError = role === 'student'
      ? validateStudent(studentForm)
      : validateFaculty(facultyForm)

    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    const payload = role === 'student'
      ? studentPayload(studentForm)
      : facultyPayload(facultyForm)

    try {
      await createUserMutation.mutateAsync(payload)
      handleClose()
    } catch {
      // Handled via toast in mutation.
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Create User"
      subtitle="Add a student or faculty account with backend validation."
      size="md"
      footer={(
        <>
          <button type="button" className="button button--ghost" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="button" className="button button--primary" onClick={() => void submit()} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : `Create ${role}`}
          </button>
        </>
      )}
    >
      <div className="modal-switch" role="tablist" aria-label="User role selection">
        <button
          type="button"
          className={`modal-switch__item${role === 'student' ? ' active' : ''}`}
          onClick={() => setRole('student')}
          disabled={isSubmitting}
        >
          Student
        </button>
        <button
          type="button"
          className={`modal-switch__item${role === 'faculty' ? ' active' : ''}`}
          onClick={() => setRole('faculty')}
          disabled={isSubmitting}
        >
          Faculty
        </button>
      </div>

      {role === 'student' ? (
        <div className="form-grid">
          <label className="admin-field" htmlFor="student-uid">
            <span>UID</span>
            <input
              id="student-uid"
              value={studentForm.uid}
              onChange={(event) => setStudentForm((current) => ({ ...current, uid: event.target.value }))}
            />
          </label>

          <label className="admin-field" htmlFor="student-name">
            <span>Full Name</span>
            <input
              id="student-name"
              value={studentForm.name}
              onChange={(event) => setStudentForm((current) => ({ ...current, name: event.target.value }))}
            />
          </label>

          <label className="admin-field" htmlFor="student-semester">
            <span>Semester</span>
            <select
              id="student-semester"
              value={studentForm.semester}
              onChange={(event) => setStudentForm((current) => ({ ...current, semester: event.target.value }))}
            >
              <option value="">Select semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((option) => (
                <option key={option} value={option}>
                  Semester {option}
                </option>
              ))}
            </select>
          </label>

          <label className="admin-field" htmlFor="student-section">
            <span>Section</span>
            <input
              id="student-section"
              value={studentForm.section}
              onChange={(event) => setStudentForm((current) => ({ ...current, section: event.target.value }))}
            />
          </label>

          <label className="admin-field" htmlFor="student-year">
            <span>Admission Year</span>
            <input
              id="student-year"
              value={studentForm.year_of_admission}
              inputMode="numeric"
              onChange={(event) => setStudentForm((current) => ({ ...current, year_of_admission: event.target.value }))}
            />
          </label>

          <label className="admin-field" htmlFor="student-password">
            <span>Password</span>
            <input
              id="student-password"
              type="password"
              value={studentForm.password}
              onChange={(event) => setStudentForm((current) => ({ ...current, password: event.target.value }))}
            />
          </label>
        </div>
      ) : (
        <div className="form-grid">
          <label className="admin-field" htmlFor="faculty-email">
            <span>Email</span>
            <input
              id="faculty-email"
              value={facultyForm.email}
              onChange={(event) => setFacultyForm((current) => ({ ...current, email: event.target.value }))}
            />
          </label>

          <label className="admin-field" htmlFor="faculty-first-name">
            <span>First Name</span>
            <input
              id="faculty-first-name"
              value={facultyForm.first_name}
              onChange={(event) => setFacultyForm((current) => ({ ...current, first_name: event.target.value }))}
            />
          </label>

          <label className="admin-field" htmlFor="faculty-last-name">
            <span>Last Name</span>
            <input
              id="faculty-last-name"
              value={facultyForm.last_name}
              onChange={(event) => setFacultyForm((current) => ({ ...current, last_name: event.target.value }))}
            />
          </label>

          <label className="admin-field" htmlFor="faculty-contact">
            <span>Contact Number</span>
            <input
              id="faculty-contact"
              value={facultyForm.contact_number}
              onChange={(event) => setFacultyForm((current) => ({ ...current, contact_number: event.target.value }))}
            />
          </label>

          <label className="admin-field" htmlFor="faculty-password">
            <span>Password</span>
            <input
              id="faculty-password"
              type="password"
              value={facultyForm.password}
              onChange={(event) => setFacultyForm((current) => ({ ...current, password: event.target.value }))}
            />
          </label>
        </div>
      )}

      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
    </Modal>
  )
}
