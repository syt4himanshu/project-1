import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { Modal, QueryState } from '../../../shared/ui'
import { extractStudentPhotoUrl } from '../../../shared/utils/studentPhoto'
import { sanitizeDisplayValue } from '../../../shared/utils/render'
import { useMentee } from '../hooks'

interface StudentPreviewModalProps {
  uid: string
  open: boolean
  onClose: () => void
}

interface InfoRow {
  label: string
  value: string
}

type AnyRecord = Record<string, unknown>

function formatDate(value: unknown): string {
  const text = String(value ?? '').trim()
  if (!text) return 'N/A'

  const parsed = new Date(text)
  if (Number.isNaN(parsed.getTime())) return text

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

function toText(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  return String(value).trim()
}

function isEmpty(value: unknown): boolean {
  const text = toText(value).toLowerCase()
  return text === '' || text === 'n/a' || text === 'na' || text === 'none' || text === '-' || text === '--' || text === 'null' || text === 'undefined'
}

function showValue(value: unknown): string {
  return isEmpty(value) ? 'N/A' : sanitizeDisplayValue(toText(value))
}

function pick(record: AnyRecord | undefined, ...keys: string[]): unknown {
  if (!record) return undefined
  for (const key of keys) {
    if (!isEmpty(record[key])) return record[key]
  }
  return undefined
}

function fixedSlots(records: AnyRecord[] | undefined, count: number): AnyRecord[] {
  return Array.from({ length: count }, (_, index) => records?.[index] ?? {})
}

function extractBacklogSubjects(record: AnyRecord): string[] {
  const raw = toText(pick(record, 'backlog_subjects', 'subjects', 'backlogSubjects'))
  if (!raw) return []
  return raw
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter((item) => !isEmpty(item) && item !== '0')
}

function toNumberOrFallback(value: unknown, fallback = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function sortAcademicRecords(records: AnyRecord[]): AnyRecord[] {
  return [...records].sort((a, b) => toNumberOrFallback(a.semester) - toNumberOrFallback(b.semester))
}

function getProjectLabel(index: number): string {
  if (index === 0) return 'Mini Project'
  if (index === 1) return 'Major Project'
  if (index === 2) return 'UBA / Collaborative Project'
  return 'Project'
}

function getProjectSubtitle(project: AnyRecord): string {
  const description = showValue(project.description)
  return description !== 'N/A' ? `Project Guide: ${description}` : 'Project Guide: N/A'
}

function getProjectBadgeClass(label: string) {
  switch (label) {
    case 'UBA / Collaborative Project':
      return 'border-[#7a5c00] bg-[#fff4cc] text-[#7a5c00]'
    case 'Mini Project':
      return 'border-[#4a6b9a] bg-[#e8f0fb] text-[#315484]'
    case 'Major Project':
      return 'border-[#7b4fd6] bg-[#efe7ff] text-[#5a35a8]'
    default:
      return 'border-[#bfd1ea] bg-[#edf4fb] text-[#355b8f]'
  }
}

function InfoTable({ rows }: { rows: InfoRow[] }) {
  return (
    <table className="faculty-preview__table">
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th>{row.label}</th>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="faculty-preview__section">
      <h5>{title}</h5>
      {children}
    </section>
  )
}

export function StudentPreviewModal({ uid, open, onClose }: StudentPreviewModalProps) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const navigate = useNavigate()
  const menteeQuery = useMentee(uid)
  const student = menteeQuery.data

  const personalInfo = useMemo(() => (student?.personal_info && typeof student.personal_info === 'object' ? student.personal_info as AnyRecord : {}), [student?.personal_info])
  const skills = useMemo(() => (student?.skills && typeof student.skills === 'object' ? student.skills as AnyRecord : {}), [student?.skills])
  const swoc = useMemo(() => (student?.swoc && typeof student.swoc === 'object' ? student.swoc as AnyRecord : {}), [student?.swoc])
  const careerObjective = useMemo(() => (student?.career_objective && typeof student.career_objective === 'object' ? student.career_objective as AnyRecord : {}), [student?.career_objective])

  const pastEducation = useMemo(() => (Array.isArray(student?.past_education_records) ? student.past_education_records as AnyRecord[] : []), [student?.past_education_records])
  const academicRecords = useMemo(() => sortAcademicRecords(Array.isArray(student?.post_admission_records) ? student.post_admission_records as AnyRecord[] : []), [student?.post_admission_records])
  const projects = useMemo(() => (Array.isArray(student?.projects) ? student.projects as AnyRecord[] : []), [student?.projects])
  const internships = useMemo(() => (Array.isArray(student?.internships) ? student.internships as AnyRecord[] : []), [student?.internships])
  const participations = useMemo(() => fixedSlots(Array.isArray(student?.cocurricular_participations) ? student.cocurricular_participations as AnyRecord[] : [], 3), [student?.cocurricular_participations])
  const organizations = useMemo(() => fixedSlots(Array.isArray(student?.cocurricular_organizations) ? student.cocurricular_organizations as AnyRecord[] : [], 3), [student?.cocurricular_organizations])
  const programRows = useMemo(() => fixedSlots(Array.isArray(student?.skill_programs) ? student.skill_programs as AnyRecord[] : [], 3), [student?.skill_programs])

  const personalRows = useMemo<InfoRow[]>(() => {
    if (!student) return []

    return [
      { label: 'Full Name', value: showValue(student.full_name) },
      { label: 'UID', value: showValue(student.uid) },
      { label: 'Semester', value: showValue(student.semester) },
      { label: 'Section', value: showValue(student.section) },
      { label: 'Year of Admission', value: showValue(student.year_of_admission) },
      { label: 'Roll No. / MIS UID', value: showValue(pick(personalInfo, 'roll_no', 'roll_number', 'mis_uid', 'uid', 'misid')) },
      { label: 'Date of Birth', value: formatDate(pick(personalInfo, 'dob', 'date_of_birth')) },
      { label: 'Gender', value: showValue(personalInfo.gender) },
      { label: 'Blood Group', value: showValue(personalInfo.blood_group) },
      { label: 'Category', value: showValue(personalInfo.category) },
      { label: 'Aadhar Number', value: showValue(pick(personalInfo, 'aadhar', 'aadhar_number', 'aadhar_card_number')) },
      { label: 'Mobile', value: showValue(pick(personalInfo, 'mobile', 'mobile_no', 'mobile_number', 'contact_number')) },
      { label: 'Personal Email', value: showValue(pick(personalInfo, 'personal_email', 'email')) },
      { label: 'College Email', value: showValue(pick(personalInfo, 'college_email', 'institution_email')) },
      { label: 'LinkedIn', value: showValue(pick(personalInfo, 'linkedin', 'linked_in_id', 'linkedin_id')) },
      { label: 'GitHub', value: showValue(pick(personalInfo, 'github', 'github_id')) },
      { label: 'Permanent Address', value: showValue(pick(personalInfo, 'permanent_address', 'address')) },
      { label: 'Present Address', value: showValue(pick(personalInfo, 'present_address', 'current_address')) },
    ]
  }, [student, personalInfo])

  const parentRows = useMemo<InfoRow[]>(() => [
    { label: "Father's Name", value: showValue(personalInfo.father_name) },
    { label: "Father's Mobile", value: showValue(pick(personalInfo, 'father_mobile', 'father_mobile_no')) },
    { label: "Father's Email", value: showValue(personalInfo.father_email) },
    { label: "Father's Occupation", value: showValue(personalInfo.father_occupation) },
    { label: "Mother's Name", value: showValue(personalInfo.mother_name) },
    { label: "Mother's Mobile", value: showValue(pick(personalInfo, 'mother_mobile', 'mother_mobile_no')) },
    { label: "Mother's Email", value: showValue(personalInfo.mother_email) },
    { label: "Mother's Occupation", value: showValue(personalInfo.mother_occupation) },
    { label: 'Emergency Contact', value: showValue(pick(personalInfo, 'emergency_contact', 'emergency_contact_number')) },
  ], [personalInfo])

  const skillRows = useMemo<InfoRow[]>(() => [
    { label: 'Career Goal', value: showValue(careerObjective.career_goal) },
    { label: 'Domain of Interest', value: showValue(careerObjective.domain_of_interest) },
    { label: 'Programming Languages', value: showValue(skills.programming_languages) },
    { label: 'Technologies & Frameworks', value: showValue(skills.technologies ?? skills.technologies_frameworks) },
    { label: 'Domains of Interest', value: showValue(skills.domains ?? skills.domains_of_interest) },
    { label: 'Familiar Tools & Platforms', value: showValue(skills.tools ?? skills.familiar_tools_platforms) },
    { label: 'Technical & Soft Skills (Overall)', value: showValue(skills.technical_soft_skills_overall) },
    { label: 'Additional Technical Skills', value: showValue(skills.additional_technical_skills) },
    { label: 'Additional Soft Skills', value: showValue(skills.additional_soft_skills) },
    { label: 'SWOC - Strengths', value: showValue(swoc.strengths) },
    { label: 'SWOC - Weaknesses', value: showValue(swoc.weaknesses) },
    { label: 'SWOC - Opportunities', value: showValue(swoc.opportunities) },
    { label: 'SWOC - Challenges', value: showValue(swoc.challenges) },
  ], [careerObjective, skills, swoc])

  const handlePrint = async () => {
    if (!contentRef.current || !student) return

    setIsExporting(true)
    try {
      const printWindow = window.open('', '_blank', 'width=1200,height=900')
      if (!printWindow) return

      const styleTags = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map((node) => node.outerHTML)
        .join('\n')

      printWindow.document.write(`
        <html>
          <head>
            <title>${student.full_name} - Student Detail</title>
            ${styleTags}
            <style>body { margin: 0; padding: 16px; background: #fff; }</style>
          </head>
          <body>${contentRef.current.innerHTML}</body>
        </html>
      `)

      printWindow.document.close()
      await new Promise<void>((resolve) => {
        printWindow.onload = () => {
          printWindow.focus()
          printWindow.print()
          window.setTimeout(() => {
            printWindow.close()
            resolve()
          }, 200)
        }
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handlePdf = async () => {
    if (!contentRef.current || !student) return

    setIsExporting(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const { default: JsPdf } = await import('jspdf')

      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const imageData = canvas.toDataURL('image/png')
      const pdf = new JsPdf({ orientation: 'portrait', unit: 'mm', format: 'a4' })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imageWidth = pageWidth
      const imageHeight = (canvas.height * imageWidth) / canvas.width

      let heightLeft = imageHeight
      let position = 0

      pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imageHeight
        pdf.addPage()
        pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${student.uid}-student-profile.pdf`)
    } finally {
      setIsExporting(false)
    }
  }

  const goToMentoringPanel = () => {
    if (!student) return
    onClose()
    navigate(`/faculty/mentees/${encodeURIComponent(student.uid)}`)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Student Detail"
      subtitle={student ? `${student.full_name} (${student.uid})` : 'Loading student details...'}
      size="xl"
      footer={(
        <div className="faculty-preview__footer-actions">
          <button type="button" className="button button--soft" onClick={() => void handlePrint()} disabled={menteeQuery.isPending || menteeQuery.isError || isExporting || !student}>
            Print
          </button>
          <button type="button" className="button button--soft" onClick={goToMentoringPanel} disabled={!student}>
            Give Remarks
          </button>
          <button type="button" className="button button--soft" onClick={() => void handlePdf()} disabled={menteeQuery.isPending || menteeQuery.isError || isExporting || !student}>
            {isExporting ? 'Exporting...' : 'Download PDF'}
          </button>
          <button type="button" className="button button--soft" onClick={onClose}>
            Close
          </button>
        </div>
      )}
    >
      {menteeQuery.isPending ? <QueryState title="Loading student profile" description="Fetching latest student record..." /> : null}
      {menteeQuery.isError ? (
        <QueryState
          tone="error"
          title="Unable to load student details"
          description={toApiErrorMessage(menteeQuery.error, 'Please try again.')}
          actionLabel="Retry"
          onAction={() => void menteeQuery.refetch()}
        />
      ) : null}

      {student ? (
        <div className="faculty-preview" ref={contentRef}>
          <DetailSection title="Photo">
            <div className="admin-student-photo-wrap">
              <img
                src={extractStudentPhotoUrl({ personal_info: personalInfo }) || ''}
                alt={`${student.full_name} profile`}
                className="admin-student-photo-preview__image"
                loading="eager"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none'
                }}
              />
              <div className="admin-student-photo-meta">
                <p className="admin-student-photo-meta__title">Current photo</p>
                <p className="admin-student-photo-meta__hint">Photo is shown if available.</p>
              </div>
            </div>
          </DetailSection>

          <DetailSection title="Personal Information">
            <InfoTable rows={personalRows} />
          </DetailSection>

          <DetailSection title="Parent Information">
            <InfoTable rows={parentRows} />
          </DetailSection>

          <DetailSection title="Past Education">
            {pastEducation.length > 0 ? (
              <table className="table detail-list-table">
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Exam Type</th>
                    <th>Board</th>
                    <th>Percentage</th>
                    <th>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {pastEducation.map((record, index) => (
                    <tr key={`past-${index}`}>
                      <td>{showValue(pick(record, 'exam', 'exam_name'))}</td>
                      <td>{showValue(pick(record, 'exam_type', 'entrance_exam_type'))}</td>
                      <td>{showValue(pick(record, 'board', 'board_name', 'exam_board'))}</td>
                      <td>{showValue(pick(record, 'percentage', 'exam_score', 'marks'))}</td>
                      <td>{showValue(pick(record, 'year_of_passing', 'year', 'passing_year'))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="faculty-preview__empty">No past education records.</p>
            )}
          </DetailSection>

          <DetailSection title="Academic Records">
            {academicRecords.length > 0 ? (
              <table className="table detail-list-table">
                <thead>
                  <tr>
                    <th>Semester</th>
                    <th>SGPA</th>
                    <th>Season</th>
                    <th>Year</th>
                    <th>College Rank</th>
                    <th>Backlogs</th>
                    <th>Backlog Subjects</th>
                  </tr>
                </thead>
                <tbody>
                  {academicRecords.map((record, index) => (
                    <tr key={`academic-${index}`}>
                      <td>{showValue(pick(record, 'semester', 'sem'))}</td>
                      <td>{showValue(pick(record, 'sgpa', 'grade_point'))}</td>
                      <td>{showValue(pick(record, 'season', 'term'))}</td>
                      <td>{showValue(pick(record, 'year_of_passing', 'year', 'academic_year'))}</td>
                      <td>{showValue(pick(record, 'college_rank', 'rank'))}</td>
                      <td>{showValue(pick(record, 'backlogs', 'backlog_count', 'backlogCount') ?? (extractBacklogSubjects(record).length || undefined))}</td>
                      <td>{showValue(pick(record, 'backlog_subjects', 'subjects', 'backlogSubjects'))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="faculty-preview__empty">No academic records.</p>
            )}
          </DetailSection>

          <DetailSection title="Projects">
            {projects.length > 0 ? (
              <div className="detail-card-list">
                {projects.map((project, index) => {
                  const label = getProjectLabel(index)
                  const subtitle = getProjectSubtitle(project)

                  return (
                    <article key={`project-${index}`} className="detail-card">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h5 className="m-0">{showValue(project.title)}</h5>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${getProjectBadgeClass(label)}`}>
                          {label}
                        </span>
                      </div>
                      <p className="text-sm text-[#5f6f86]">{subtitle}</p>
                    </article>
                  )
                })}
              </div>
            ) : (
              <p className="faculty-preview__empty">No projects submitted.</p>
            )}
          </DetailSection>

          <DetailSection title="Internships">
            {internships.length > 0 ? (
              <div className="detail-card-list">
                {internships.map((internship, index) => (
                  <article key={`internship-${index}`} className="detail-card">
                    <h5>Internship {index + 1}</h5>
                    <p>{showValue(pick(internship, 'company_name', 'company'))}</p>
                    <p>{showValue(internship.designation)}</p>
                    <p>{showValue(internship.domain)}</p>
                    <p>{showValue(internship.description)}</p>
                    <p>{formatDate(internship.start_date)} to {formatDate(internship.end_date)}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="faculty-preview__empty">No internships submitted.</p>
            )}
          </DetailSection>

          <DetailSection title="Participation Activities">
            <div className="detail-card-list">
              {participations.map((entry, index) => (
                <article key={`participation-${index}`} className="detail-card">
                  <h5>Activity {index + 1}</h5>
                  <p>Name: {showValue(pick(entry, 'name', 'activity'))}</p>
                  <p>Date: {formatDate(entry.date)}</p>
                  <p>Level: {showValue(entry.level)}</p>
                  <p>Awards: {showValue(entry.awards)}</p>
                </article>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Organized Activities">
            <div className="detail-card-list">
              {organizations.map((entry, index) => (
                <article key={`organization-${index}`} className="detail-card">
                  <h5>Activity {index + 1}</h5>
                  <p>Name: {showValue(pick(entry, 'name', 'organization'))}</p>
                  <p>Date: {formatDate(entry.date)}</p>
                  <p>Level: {showValue(entry.level)}</p>
                  <p>Remark / Role: {showValue(pick(entry, 'remark', 'role', 'position'))}</p>
                </article>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Skill Development Program (SDP) / Training / MOOC">
            <div className="detail-card-list">
              {programRows.map((entry, index) => (
                <article key={`program-${index}`} className="detail-card">
                  <h5>Program {index + 1}</h5>
                  <p>Title: {showValue(pick(entry, 'course_title', 'title', 'name'))}</p>
                  <p>Platform: {showValue(pick(entry, 'platform', 'provider', 'organization'))}</p>
                  <p>Duration (Hours): {showValue(pick(entry, 'duration_hours', 'duration', 'hours'))}</p>
                  <p>From: {formatDate(pick(entry, 'date_from', 'from_date', 'start_date'))}</p>
                  <p>To: {formatDate(pick(entry, 'date_to', 'to_date', 'end_date'))}</p>
                </article>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Skills and Career">
            <InfoTable rows={skillRows} />
          </DetailSection>
        </div>
      ) : null}
    </Modal>
  )
}
