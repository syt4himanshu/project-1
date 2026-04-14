import { useMemo, useRef, useState } from 'react'
import { toApiErrorMessage } from '../../../../shared/api/errorMapper'
import { Modal, QueryState } from '../../../../shared/ui'
import { normalizeArrayForDisplay, normalizeForDisplay } from '../../api'
import { useAdminStudentDetailQuery } from '../../hooks'

interface StudentDetailModalProps {
  studentId: number | null
  onClose: () => void
}

interface InfoRow {
  label: string
  value: string
}

function formatDate(value: unknown): string {
  const text = normalizeForDisplay(value, '')
  if (!text) return 'N/A'

  const parsed = new Date(text)
  if (Number.isNaN(parsed.getTime())) return text

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

function pickFirst(record: Record<string, unknown>, ...keys: string[]): unknown {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null && String(record[key]).trim() !== '') {
      return record[key]
    }
  }

  return undefined
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

  const personalRows = useMemo<InfoRow[]>(() => {
    if (!student) return []

    return [
      { label: 'Full Name', value: normalizeForDisplay(student.name) },
      { label: 'UID', value: normalizeForDisplay(student.uid) },
      { label: 'Semester', value: normalizeForDisplay(student.semester) },
      { label: 'Section', value: normalizeForDisplay(student.section) },
      { label: 'Year of Admission', value: normalizeForDisplay(student.yearOfAdmission) },
      { label: 'Mentor', value: normalizeForDisplay(student.mentorName) },
      { label: 'Mobile', value: normalizeForDisplay(pickFirst(personalInfo, 'mobile', 'mobile_no')) },
      { label: 'Personal Email', value: normalizeForDisplay(personalInfo.personal_email) },
      { label: 'College Email', value: normalizeForDisplay(personalInfo.college_email) },
      { label: 'Date of Birth', value: formatDate(personalInfo.dob) },
      { label: 'Gender', value: normalizeForDisplay(personalInfo.gender) },
      { label: 'Blood Group', value: normalizeForDisplay(personalInfo.blood_group) },
      { label: 'Address', value: normalizeForDisplay(pickFirst(personalInfo, 'permanent_address', 'address')) },
    ]
  }, [student, personalInfo])

  const parentRows = useMemo<InfoRow[]>(() => {
    if (!student) return []

    return [
      { label: "Father's Name", value: normalizeForDisplay(personalInfo.father_name) },
      { label: "Father's Mobile", value: normalizeForDisplay(pickFirst(personalInfo, 'father_mobile', 'father_mobile_no')) },
      { label: "Mother's Name", value: normalizeForDisplay(personalInfo.mother_name) },
      { label: "Mother's Mobile", value: normalizeForDisplay(pickFirst(personalInfo, 'mother_mobile', 'mother_mobile_no')) },
      { label: 'Emergency Contact', value: normalizeForDisplay(pickFirst(personalInfo, 'emergency_contact', 'emergency_contact_number')) },
    ]
  }, [student, personalInfo])

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
                    <th>Percentage</th>
                    <th>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {student.pastEducation.map((record, index) => (
                    <tr key={`past-${index}`}>
                      <td>{normalizeForDisplay(record.exam ?? record.exam_name)}</td>
                      <td>{normalizeForDisplay(record.percentage)}</td>
                      <td>{normalizeForDisplay(record.year_of_passing)}</td>
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
              <table className="table detail-list-table">
                <thead>
                  <tr>
                    <th>Semester</th>
                    <th>SGPA</th>
                    <th>Backlogs</th>
                    <th>Subjects</th>
                  </tr>
                </thead>
                <tbody>
                  {student.academicRecords.map((record, index) => (
                    <tr key={`academic-${index}`}>
                      <td>{normalizeForDisplay(record.semester)}</td>
                      <td>{normalizeForDisplay(record.sgpa)}</td>
                      <td>{normalizeForDisplay(record.backlogs)}</td>
                      <td>{normalizeForDisplay(record.backlog_subjects)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="detail-empty">No academic records.</p>
            )}
          </DetailSection>

          <DetailSection title="Projects">
            {student.projects.length > 0 ? (
              <div className="detail-card-list">
                {student.projects.map((project, index) => (
                  <article key={`project-${index}`} className="detail-card">
                    <h5>{normalizeForDisplay(project.title, 'Untitled project')}</h5>
                    <p>{normalizeForDisplay(project.description)}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="detail-empty">No projects submitted.</p>
            )}
          </DetailSection>

          <DetailSection title="Internships">
            {student.internships.length > 0 ? (
              <div className="detail-card-list">
                {student.internships.map((internship, index) => (
                  <article key={`internship-${index}`} className="detail-card">
                    <h5>{normalizeForDisplay(internship.company, 'Unknown company')}</h5>
                    <p>
                      {normalizeForDisplay(internship.domain)} | {normalizeForDisplay(internship.type)} | {formatDate(internship.start_date)} to {formatDate(internship.end_date)}
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="detail-empty">No internships submitted.</p>
            )}
          </DetailSection>

          <DetailSection title="Co-Curricular">
            <InfoTable
              rows={[
                {
                  label: 'Participations',
                  value: normalizeArrayForDisplay(student.coCurricularParticipations.map((entry) => entry.activity ?? entry.role ?? entry.year)),
                },
                {
                  label: 'Organizations',
                  value: normalizeArrayForDisplay(student.coCurricularOrganizations.map((entry) => entry.organization ?? entry.position ?? entry.year)),
                },
              ]}
            />
          </DetailSection>

          <DetailSection title="Skills and Career">
            <InfoTable
              rows={[
                { label: 'Career Goal', value: normalizeForDisplay(student.careerGoal) },
                { label: 'Domain of Interest', value: normalizeForDisplay(student.domainOfInterest) },
                { label: 'Programming Languages', value: normalizeForDisplay(skills.programming_languages) },
                { label: 'Technologies', value: normalizeForDisplay(skills.technologies ?? skills.technologies_frameworks) },
                { label: 'Domains', value: normalizeForDisplay(skills.domains ?? skills.domains_of_interest) },
                { label: 'Tools', value: normalizeForDisplay(skills.tools ?? skills.familiar_tools_platforms) },
                { label: 'SWOC - Strengths', value: normalizeForDisplay(swoc.strengths) },
                { label: 'SWOC - Weaknesses', value: normalizeForDisplay(swoc.weaknesses) },
                { label: 'SWOC - Opportunities', value: normalizeForDisplay(swoc.opportunities) },
                { label: 'SWOC - Challenges', value: normalizeForDisplay(swoc.challenges) },
                { label: 'Clarity Score', value: normalizeForDisplay(careerObjective.clarity_score ?? careerObjective.clarity_preparedness) },
                { label: 'Campus Placement', value: normalizeForDisplay(careerObjective.campus_placement) },
              ]}
            />
          </DetailSection>
        </div>
      ) : null}
    </Modal>
  )
}
