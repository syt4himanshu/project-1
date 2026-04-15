import { useMemo, useRef, useState } from 'react'
import { toApiErrorMessage } from '../../../../shared/api/errorMapper'
import { Modal, QueryState } from '../../../../shared/ui'
import { normalizeForDisplay } from '../../api'
import { useAdminStudentDetailQuery } from '../../hooks'

interface StudentDetailModalProps {
  studentId: number | null
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
  return isEmpty(value) ? 'N/A' : toText(value)
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
  const raw = toText(record.backlog_subjects)
  if (!raw) return []
  return raw
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter((item) => !isEmpty(item) && item !== '0')
}

function InfoTable({ rows }: { rows: InfoRow[] }) {
  return (
    <table className="detail-table">
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
    <section className="detail-section">
      <h4>{title}</h4>
      {children}
    </section>
  )
}

export function StudentDetailModal({ studentId, onClose }: StudentDetailModalProps) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const detailQuery = useAdminStudentDetailQuery(studentId)
  const student = detailQuery.data

  const personalInfo = useMemo(() => student?.personalInfo ?? {}, [student?.personalInfo])
  const skills = useMemo(() => student?.skills ?? {}, [student?.skills])
  const swoc = useMemo(() => student?.swoc ?? {}, [student?.swoc])
  const careerObjective = useMemo(() => student?.careerObjective ?? {}, [student?.careerObjective])

  const academicRecords = useMemo<AnyRecord[]>(() => {
    return (student?.academicRecords as AnyRecord[] | undefined) ?? []
  }, [student?.academicRecords])

  const latestAcademicRecord = useMemo<AnyRecord | undefined>(() => {
    if (!academicRecords.length) return undefined
    return [...academicRecords].sort((a, b) => Number(a.semester ?? 0) - Number(b.semester ?? 0)).at(-1)
  }, [academicRecords])

  const backlogSubjects = useMemo(() => {
    if (latestAcademicRecord) return extractBacklogSubjects(latestAcademicRecord)
    return Array.from(new Set(academicRecords.flatMap((record) => extractBacklogSubjects(record))))
  }, [latestAcademicRecord, academicRecords])

  const activeBacklogs = useMemo(() => {
    const direct = Number(
      pick(
        latestAcademicRecord,
        'number_of_active_backlogs',
        'active_backlogs',
        'current_backlogs',
        'backlogs',
      ),
    )
    if (Number.isFinite(direct) && direct >= 0) return direct
    return backlogSubjects.length
  }, [latestAcademicRecord, backlogSubjects])

  const personalRows = useMemo<InfoRow[]>(() => {
    if (!student) return []

    return [
      { label: 'Full Name', value: showValue(student.name) },
      { label: 'UID', value: showValue(student.uid) },
      { label: 'Semester', value: showValue(student.semester) },
      { label: 'Section', value: showValue(student.section) },
      { label: 'Year of Admission', value: showValue(student.yearOfAdmission) },
      { label: 'Mentor', value: showValue(student.mentorName) },
      { label: 'Roll No. / MIS UID', value: showValue(pick(personalInfo, 'roll_no', 'roll_number', 'mis_uid', 'uid', 'misid')) },
      { label: 'Date of Birth', value: formatDate(personalInfo.dob) },
      { label: 'Gender', value: showValue(personalInfo.gender) },
      { label: 'Blood Group', value: showValue(personalInfo.blood_group) },
      { label: 'Category', value: showValue(personalInfo.category) },
      { label: 'Aadhar Number', value: showValue(pick(personalInfo, 'aadhar', 'aadhar_number')) },
      { label: 'Mobile', value: showValue(pick(personalInfo, 'mobile', 'mobile_no')) },
      { label: 'Personal Email', value: showValue(personalInfo.personal_email) },
      { label: 'College Email', value: showValue(personalInfo.college_email) },
      { label: 'LinkedIn', value: showValue(pick(personalInfo, 'linkedin', 'linked_in_id')) },
      { label: 'GitHub', value: showValue(pick(personalInfo, 'github', 'github_id')) },
      { label: 'Permanent Address', value: showValue(pick(personalInfo, 'permanent_address', 'address')) },
      { label: 'Present Address', value: showValue(personalInfo.present_address) },
      { label: 'Local Guardian Name', value: showValue(personalInfo.local_guardian_name) },
      { label: 'Local Guardian Mobile', value: showValue(personalInfo.local_guardian_mobile) },
      { label: 'Local Guardian Email', value: showValue(personalInfo.local_guardian_email) },
    ]
  }, [student, personalInfo])

  const parentRows = useMemo<InfoRow[]>(() => {
    if (!student) return []

    return [
      { label: "Father's Name", value: showValue(personalInfo.father_name) },
      { label: "Father's Mobile", value: showValue(pick(personalInfo, 'father_mobile', 'father_mobile_no')) },
      { label: "Father's Email", value: showValue(personalInfo.father_email) },
      { label: "Father's Occupation", value: showValue(personalInfo.father_occupation) },
      { label: "Mother's Name", value: showValue(personalInfo.mother_name) },
      { label: "Mother's Mobile", value: showValue(pick(personalInfo, 'mother_mobile', 'mother_mobile_no')) },
      { label: "Mother's Email", value: showValue(personalInfo.mother_email) },
      { label: "Mother's Occupation", value: showValue(personalInfo.mother_occupation) },
      { label: 'Emergency Contact', value: showValue(pick(personalInfo, 'emergency_contact', 'emergency_contact_number')) },
    ]
  }, [student, personalInfo])

  const participationRows = useMemo(() => fixedSlots(student?.coCurricularParticipations as AnyRecord[] | undefined, 3), [student?.coCurricularParticipations])
  const organizationRows = useMemo(() => fixedSlots(student?.coCurricularOrganizations as AnyRecord[] | undefined, 3), [student?.coCurricularOrganizations])
  const programRows = useMemo(() => fixedSlots(student?.skillPrograms as AnyRecord[] | undefined, 3), [student?.skillPrograms])
  const internshipRows = useMemo(() => fixedSlots(student?.internships as AnyRecord[] | undefined, 2), [student?.internships])

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
            <title>${student.name} - Student Detail</title>
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

  return (
    <Modal
      open={Boolean(studentId)}
      onClose={onClose}
      title="Student Detail"
      subtitle={student ? `${student.name} (${student.uid})` : 'Loading student details...'}
      size="xl"
      footer={(
        <>
          <button type="button" className="button button--ghost" onClick={onClose}>
            Close
          </button>
          <button
            type="button"
            className="button button--ghost"
            onClick={() => void handlePrint()}
            disabled={detailQuery.isPending || detailQuery.isError || isExporting || !student}
          >
            Print
          </button>
          <button
            type="button"
            className="button button--primary"
            onClick={() => void handlePdf()}
            disabled={detailQuery.isPending || detailQuery.isError || isExporting || !student}
          >
            {isExporting ? 'Exporting...' : 'Download PDF'}
          </button>
        </>
      )}
    >
      {detailQuery.isPending ? <QueryState title="Loading student profile" description="Fetching latest student record..." /> : null}

      {detailQuery.isError ? (
        <QueryState
          tone="error"
          title="Unable to load student detail"
          description={toApiErrorMessage(detailQuery.error)}
          actionLabel="Retry"
          onAction={() => void detailQuery.refetch()}
        />
      ) : null}

      {student ? (
        <div className="detail-scroll" ref={contentRef}>
          <DetailSection title="Personal Information">
            <InfoTable rows={personalRows} />
          </DetailSection>

          <DetailSection title="Parent Information">
            <InfoTable rows={parentRows} />
          </DetailSection>

          <DetailSection title="Past Education">
            {student.pastEducation.length > 0 ? (
              <table className="table detail-list-table">
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Board</th>
                    <th>Percentage</th>
                    <th>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {student.pastEducation.map((record, index) => (
                    <tr key={`past-${index}`}>
                      <td>{showValue(record.exam ?? record.exam_name)}</td>
                      <td>{showValue((record as AnyRecord).board)}</td>
                      <td>{showValue(record.percentage)}</td>
                      <td>{showValue(record.year_of_passing)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="detail-empty">No past education records.</p>
            )}
          </DetailSection>

          <DetailSection title="Academic Records">
            {student.academicRecords.length > 0 ? (
              <>
                <table className="table detail-list-table">
                  <thead>
                    <tr>
                      <th>Semester</th>
                      <th>SGPA</th>
                      <th>Season</th>
                      <th>Year</th>
                      <th>Backlogs</th>
                      <th>Subjects</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.academicRecords.map((record, index) => (
                      <tr key={`academic-${index}`}>
                        <td>{showValue(record.semester)}</td>
                        <td>{showValue(record.sgpa)}</td>
                        <td>{showValue((record as AnyRecord).season)}</td>
                        <td>{showValue((record as AnyRecord).year_of_passing)}</td>
                        <td>{showValue(record.backlogs)}</td>
                        <td>{showValue(record.backlog_subjects)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <InfoTable
                  rows={[
                    { label: 'Number of Active Backlogs', value: String(activeBacklogs) },
                    { label: 'Backlog Subject Names', value: backlogSubjects.length > 0 ? backlogSubjects.join(', ') : 'N/A' },
                    { label: 'College Rank', value: showValue(latestAcademicRecord?.college_rank) },
                    { label: 'Academic Awards', value: showValue(latestAcademicRecord?.academic_awards) },
                  ]}
                />
              </>
            ) : (
              <p className="detail-empty">No academic records.</p>
            )}
          </DetailSection>

          <DetailSection title="Projects">
            {student.projects.length > 0 ? (
              <div className="detail-card-list">
                {student.projects.map((project, index) => (
                  <article key={`project-${index}`} className="detail-card">
                    <h5>{showValue(project.title)}</h5>
                    <p>{showValue(project.description)}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="detail-empty">No projects submitted.</p>
            )}
          </DetailSection>

          <DetailSection title="Internships">
            <div className="detail-card-list">
              {internshipRows.map((internship, index) => (
                <article key={`internship-${index}`} className="detail-card">
                  <h5>Internship {index + 1}</h5>
                  <p>{showValue(internship.company_name ?? internship.company)}</p>
                  <p>{showValue(internship.designation)}</p>
                  <p>{showValue(internship.domain)}</p>
                  <p>{showValue(internship.description)}</p>
                  <p>{formatDate(internship.start_date)} to {formatDate(internship.end_date)}</p>
                </article>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Participation Activities">
            <div className="detail-card-list">
              {participationRows.map((entry, index) => (
                <article key={`participation-${index}`} className="detail-card">
                  <h5>Activity {index + 1}</h5>
                  <p>Name: {showValue(entry.name ?? entry.activity)}</p>
                  <p>Date: {formatDate(entry.date)}</p>
                  <p>Level: {showValue(entry.level)}</p>
                  <p>Awards: {showValue(entry.awards)}</p>
                </article>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Organized Activities">
            <div className="detail-card-list">
              {organizationRows.map((entry, index) => (
                <article key={`organization-${index}`} className="detail-card">
                  <h5>Activity {index + 1}</h5>
                  <p>Name: {showValue(entry.name ?? entry.organization)}</p>
                  <p>Date: {formatDate(entry.date)}</p>
                  <p>Level: {showValue(entry.level)}</p>
                  <p>Remark / Role: {showValue(entry.remark ?? entry.role ?? entry.position)}</p>
                </article>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Skill Development Program (SDP) / Training / MOOC">
            <div className="detail-card-list">
              {programRows.map((program, index) => (
                <article key={`program-${index}`} className="detail-card">
                  <h5>Program {index + 1}</h5>
                  <p>Title: {showValue(program.course_title)}</p>
                  <p>Platform: {showValue(program.platform)}</p>
                  <p>Duration (Hours): {showValue(program.duration_hours)}</p>
                  <p>From: {formatDate(program.date_from)}</p>
                  <p>To: {formatDate(program.date_to)}</p>
                </article>
              ))}
            </div>
          </DetailSection>

          <DetailSection title="Skills and Career">
            <InfoTable
              rows={[
                { label: 'Career Goal', value: showValue(student.careerGoal) },
                { label: 'Domain of Interest', value: showValue(student.domainOfInterest) },
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
                {
                  label: 'Clarity and Preparedness Level',
                  value: showValue(careerObjective.clarity_preparedness ?? careerObjective.clarity_score),
                },
                {
                  label: 'Interested in Campus Placement?',
                  value:
                    typeof careerObjective.interested_in_campus_placement === 'boolean'
                      ? careerObjective.interested_in_campus_placement
                        ? 'Yes'
                        : 'No'
                      : showValue(careerObjective.campus_placement),
                },
                { label: 'Areas of Interest (Non-Technical)', value: showValue(careerObjective.non_technical_areas) },
                { label: 'Student Mentor Interest', value: showValue(careerObjective.student_mentor_interest) },
                { label: 'Expectations from Institute', value: showValue(careerObjective.expectations_from_institute) },
              ]}
            />
          </DetailSection>

          <DetailSection title="Assigned Mentor">
            <InfoTable rows={[{ label: 'Mentor Name', value: normalizeForDisplay(student.mentorName) }]} />
          </DetailSection>
        </div>
      ) : null}
    </Modal>
  )
}
