import { useMemo, useRef, useState } from 'react'
import { toApiErrorMessage } from '../../../../shared/api/errorMapper'
import { Modal, QueryState } from '../../../../shared/ui'
import { normalizeForDisplay } from '../../api'
import { PhotoAvatar } from '../../../../shared/components/PhotoAvatar'
import { extractStudentPhotoUrl } from '../../../../shared/utils/studentPhoto'
import { sanitizeDisplayValue } from '../../../../shared/utils/render'
import { useAdminStudentDetailQuery, useAdminStudentMentoringMinutesQuery } from '../../hooks'

interface StudentDetailModalProps {
  studentId: number | null
  onClose: () => void
}

interface InfoRow {
  label: string
  value: string
}

type AnyRecord = Record<string, unknown>

interface MentoringMinute {
  id: number | string
  date?: string | null
  semester?: number | string
  faculty_name?: string
  remarks?: string
  suggestion?: string
  action?: string
}

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




function extractBacklogSubjects(record: AnyRecord): string[] {
  const raw = toText(record.backlog_subjects)
  if (!raw) return []
  return raw
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter((item) => !isEmpty(item) && item !== '0')
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
  const [remarksOpen, setRemarksOpen] = useState(false)

  const detailQuery = useAdminStudentDetailQuery(studentId)
  const student = detailQuery.data
  const minutesQuery = useAdminStudentMentoringMinutesQuery(remarksOpen ? studentId : null)
  const minutes = useMemo<MentoringMinute[]>(() => (minutesQuery.data as MentoringMinute[] | undefined) ?? [], [minutesQuery.data])

  const personalInfo = useMemo(() => student?.personalInfo ?? {}, [student?.personalInfo])
  const studentPhotoUrl = useMemo(() => extractStudentPhotoUrl({ personal_info: personalInfo }), [personalInfo])
  const skills = useMemo(() => student?.skills ?? {}, [student?.skills])
  const swoc = useMemo(() => student?.swoc ?? {}, [student?.swoc])
  const careerObjective = useMemo(() => student?.careerObjective ?? {}, [student?.careerObjective])

  // Sort academic records ascending by semester number (1 → 2 → 3 → ...)
  const academicRecords = useMemo<AnyRecord[]>(() => {
    const raw = (student?.academicRecords as AnyRecord[] | undefined) ?? []
    return [...raw].sort((a, b) => Number(a.semester ?? 0) - Number(b.semester ?? 0))
  }, [student?.academicRecords])

  // Aggregate academic awards across all semesters
  const allAcademicAwards = useMemo(() => {
    const awards: string[] = []
    for (const record of academicRecords) {
      const award = toText(record.academic_awards)
      if (!isEmpty(award)) {
        awards.push(`Sem ${toText(record.semester)}: ${award}`)
      }
    }
    return awards.length > 0 ? awards.join(' | ') : 'N/A'
  }, [academicRecords])

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

  const participationRows = useMemo(() => (student?.coCurricularParticipations as AnyRecord[] | undefined) ?? [], [student?.coCurricularParticipations])
  const organizationRows = useMemo(() => (student?.coCurricularOrganizations as AnyRecord[] | undefined) ?? [], [student?.coCurricularOrganizations])
  const programRows = useMemo(() => (student?.skillPrograms as AnyRecord[] | undefined) ?? [], [student?.skillPrograms])
  const internshipRows = useMemo(() => (student?.internships as AnyRecord[] | undefined) ?? [], [student?.internships])

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
          {student && (
            <button
              type="button"
              className="button button--soft mr-auto"
              onClick={() => setRemarksOpen(true)}
            >
              View Previous Mentoring Remarks
            </button>
          )}
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
          <DetailSection title="Photo">
            <div className="admin-student-photo-wrap">
              <PhotoAvatar
                url={studentPhotoUrl}
                alt={`${student.name} profile`}
                className="admin-student-photo-preview__image"
                loading="eager"
                fallback={(
                  <div className="admin-student-photo-preview__fallback">
                    {student.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              />
              <div className="admin-student-photo-meta">
                <p className="admin-student-photo-meta__title">
                  {studentPhotoUrl ? 'Current Cloudinary photo' : 'No photo uploaded yet'}
                </p>
                {studentPhotoUrl ? (
                  <a className="admin-student-photo-meta__link" href={studentPhotoUrl} target="_blank" rel="noreferrer">
                    Open uploaded image
                  </a>
                ) : (
                  <p className="admin-student-photo-meta__hint">The default initials avatar is shown until a photo is uploaded.</p>
                )}
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
            {student.pastEducation.length > 0 ? (
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
                  {student.pastEducation.map((record, index) => (
                    <tr key={`past-${index}`}>
                      <td>{showValue(record.exam ?? record.exam_name)}</td>
                      <td>{showValue((record as AnyRecord).exam_type)}</td>
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
            {academicRecords.length > 0 ? (
              <>
                {/* Table sorted semester 1 → 2 → 3 → ... with College Rank as a column */}
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
                        <td>{showValue(record.semester)}</td>
                        <td>{showValue(record.sgpa)}</td>
                        <td>{showValue(record.season)}</td>
                        <td>{showValue(record.year_of_passing)}</td>
                        <td>{showValue(record.college_rank)}</td>
                        <td>{showValue(record.backlogs ?? (extractBacklogSubjects(record).length || undefined))}</td>
                        <td>{showValue(record.backlog_subjects)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Academic Awards aggregated across all semesters */}
                <InfoTable
                  rows={[
                    { label: 'Academic Awards', value: allAcademicAwards },
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
                    {(() => {
                      const label = getProjectLabel(index)
                      const subtitle = getProjectSubtitle(project)

                      return (
                        <>
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h5 className="m-0">{showValue(project.title)}</h5>
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${getProjectBadgeClass(label)}`}>
                              {label}
                            </span>
                          </div>
                          <p className="text-sm text-[#5f6f86]">{subtitle}</p>
                        </>
                      )
                    })()}
                  </article>
                ))}
              </div>
            ) : (
              <p className="detail-empty">No projects submitted.</p>
            )}
          </DetailSection>

          <DetailSection title="Internships">
            {internshipRows.length > 0 ? (
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
            ) : (
              <p className="detail-empty">No internship details provided.</p>
            )}
          </DetailSection>

          <DetailSection title="Participation Activities">
            {participationRows.length > 0 ? (
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
            ) : (
              <p className="detail-empty">No participation activities provided.</p>
            )}
          </DetailSection>

          <DetailSection title="Organized Activities">
            {organizationRows.length > 0 ? (
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
            ) : (
              <p className="detail-empty">No organized activities provided.</p>
            )}
          </DetailSection>

          <DetailSection title="Skill Development Program (SDP) / Training / MOOC">
            {programRows.length > 0 ? (
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
            ) : (
              <p className="detail-empty">No skill development programs provided.</p>
            )}
          </DetailSection>

          <DetailSection title="Skills and Career">
            <InfoTable
              rows={[
                { label: 'Career Goal', value: showValue(student.careerGoal) },
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

      <Modal
        open={remarksOpen}
        onClose={() => setRemarksOpen(false)}
        title="Previous Mentoring Remarks"
        size="lg"
      >
        <div className="space-y-4">
          {minutesQuery.isPending ? (
            <p className="text-sm text-gray-500">Loading remarks...</p>
          ) : minutesQuery.isError ? (
            <p className="text-sm text-red-500">Failed to load remarks.</p>
          ) : minutes.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No mentoring remarks recorded yet.</p>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto pr-2" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {minutes.map((m, index) => (
                <div key={m.id} style={{ paddingBottom: index < minutes.length - 1 ? '24px' : '0', borderBottom: index < minutes.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>
                    <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', color: '#475569' }}>
                      {formatDate(m.date)}
                    </span>
                    <span>&bull;</span>
                    <span>Sem {m.semester}</span>
                    <span>&bull;</span>
                    <span style={{ color: '#334155', flex: 1 }}>{m.faculty_name}</span>
                  </div>
                  <div style={{ marginTop: '16px', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ background: '#f8fafc', color: '#334155', padding: '12px 14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontWeight: 600, display: 'block', marginBottom: '4px', color: '#0f172a' }}>Remarks</span>
                      <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{m.remarks}</span>
                    </div>
                    {m.suggestion && (
                      <div style={{ background: '#eff6ff', color: '#1e40af', padding: '12px 14px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                        <span style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>Suggestion</span>
                        <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{m.suggestion}</span>
                      </div>
                    )}
                    {m.action && (
                      <div style={{ background: '#f0fdf4', color: '#166534', padding: '12px 14px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                        <span style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>Action</span>
                        <span style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{m.action}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </Modal>
  )
}
