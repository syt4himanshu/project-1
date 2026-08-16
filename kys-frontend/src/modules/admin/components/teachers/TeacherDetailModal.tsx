import { useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { toApiErrorMessage } from '../../../../shared/api/errorMapper'
import { Modal, QueryState } from '../../../../shared/ui'
import { normalizeForDisplay } from '../../api'
import { sanitizeDisplayValue } from '../../../../shared/utils/render'
import { useAdminFacultyDetailQuery } from '../../hooks'

interface TeacherDetailModalProps {
  facultyId: number | null
  onClose: () => void
}

export function TeacherDetailModal({ facultyId, onClose }: TeacherDetailModalProps) {
  const detailQuery = useAdminFacultyDetailQuery(facultyId)
  const detail = detailQuery.data
  const detailContentRef = useRef<HTMLDivElement | null>(null)
  const [isExportingExcel, setIsExportingExcel] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  const handlePdf = async () => {
    if (!detailContentRef.current || !detail || isExportingPdf) return

    setIsExportingPdf(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const { default: JsPdf } = await import('jspdf')

      const canvas = await html2canvas(detailContentRef.current, {
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

      const facultyUid = sanitizeDisplayValue(detail.faculty.uid)
      pdf.save(`${facultyUid}-mentor-detail.pdf`)
    } finally {
      setIsExportingPdf(false)
    }
  }

  const handleExcel = () => {
    if (!detail || isExportingExcel) return

    setIsExportingExcel(true)
    try {
      const wsData: any[][] = []

      wsData.push(['Profile'])
      wsData.push(['Name', sanitizeDisplayValue(normalizeForDisplay(detail.faculty.name))])
      wsData.push(['Email', sanitizeDisplayValue(normalizeForDisplay(detail.faculty.email))])
      wsData.push(['Contact', sanitizeDisplayValue(normalizeForDisplay(detail.faculty.contact))])
      wsData.push(['Assigned Students', detail.mentees.length])
      wsData.push([])

      wsData.push(['Assigned Students'])
      if (detail.mentees.length === 0) {
        wsData.push(['No students assigned to this mentor.'])
      } else {
        wsData.push(['#', 'UID', 'Name', 'Semester', 'Section', 'Admission Year', 'Mentorship Date'])
        detail.mentees.forEach((mentee, index) => {
          let datesStr = '—'
          if (mentee.remarksDates && mentee.remarksDates.length > 0) {
            datesStr = mentee.remarksDates
              .map(d => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }))
              .join(', ')
          }
          wsData.push([
            index + 1,
            sanitizeDisplayValue(normalizeForDisplay(mentee.uid)),
            sanitizeDisplayValue(normalizeForDisplay(mentee.fullName)),
            normalizeForDisplay(mentee.semester),
            sanitizeDisplayValue(normalizeForDisplay(mentee.section)),
            normalizeForDisplay(mentee.yearOfAdmission),
            datesStr
          ])
        })
      }

      const ws = XLSX.utils.aoa_to_sheet(wsData)

      ws['!cols'] = [
        { wch: 15 },
        { wch: 20 },
        { wch: 30 },
        { wch: 12 },
        { wch: 12 },
        { wch: 15 },
        { wch: 35 },
      ]

      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Mentor Detail')

      const facultyUid = sanitizeDisplayValue(detail.faculty.uid)
      XLSX.writeFile(wb, `${facultyUid}-mentor-detail.xlsx`)
    } finally {
      setIsExportingExcel(false)
    }
  }

  return (
    <Modal
      open={Boolean(facultyId)}
      onClose={onClose}
      title="Mentor Detail"
      subtitle={detail ? `${sanitizeDisplayValue(detail.faculty.name)} (${sanitizeDisplayValue(detail.faculty.uid)})` : 'Loading mentor details...'}
      size="lg"
      footer={(
        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', width: '100%' }}>
          <button
            type="button"
            className="button button--ghost"
            onClick={() => void handlePdf()}
            disabled={!detail || isExportingPdf || isExportingExcel}
          >
            {isExportingPdf ? 'Exporting PDF...' : 'Download PDF'}
          </button>
          <button
            type="button"
            className="button button--ghost"
            onClick={() => void handleExcel()}
            disabled={!detail || isExportingExcel || isExportingPdf}
          >
            {isExportingExcel ? 'Exporting Excel...' : 'Download Excel'}
          </button>
          <button type="button" className="button button--primary" onClick={onClose}>
            Close
          </button>
        </div>
      )}
    >
      {detailQuery.isPending ? <QueryState title="Loading mentor profile" description="Fetching mentee list..." /> : null}

      {detailQuery.isError ? (
        <QueryState
          tone="error"
          title="Unable to load mentor detail"
          description={toApiErrorMessage(detailQuery.error)}
          actionLabel="Retry"
          onAction={() => void detailQuery.refetch()}
        />
      ) : null}

      {detail ? (
        <div className="detail-scroll" ref={detailContentRef}>
          <section className="detail-section">
            <h4>Profile</h4>
            <table className="detail-table">
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{sanitizeDisplayValue(normalizeForDisplay(detail.faculty.name))}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{sanitizeDisplayValue(normalizeForDisplay(detail.faculty.email))}</td>
                </tr>
                <tr>
                  <th>Contact</th>
                  <td>{sanitizeDisplayValue(normalizeForDisplay(detail.faculty.contact))}</td>
                </tr>
                <tr>
                  <th>Assigned Students</th>
                  <td>{detail.mentees.length}</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="detail-section">
            <h4>Assigned Students</h4>

            {detail.mentees.length === 0 ? (
              <p className="detail-empty">No students assigned to this mentor.</p>
            ) : (
              <div className="teacher-detail__table-wrap">
                <table className="table detail-list-table detail-list-table--teachers">
                  <thead>
                    <tr>
                      <th className="teacher-detail__col-index">#</th>
                      <th className="teacher-detail__col-uid">UID</th>
                      <th className="teacher-detail__col-name">Name</th>
                      <th className="teacher-detail__col-sem">Semester</th>
                      <th className="teacher-detail__col-section">Section</th>
                      <th className="teacher-detail__col-year">Admission Year</th>
                      <th className="teacher-detail__col-date">Mentorship Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.mentees.map((mentee, index) => (
                      <tr key={mentee.id || `${mentee.uid}-${index}`}>
                        <td className="teacher-detail__col-index">{index + 1}</td>
                        <td className="teacher-detail__col-uid"><span className="mono-cell">{sanitizeDisplayValue(normalizeForDisplay(mentee.uid))}</span></td>
                        <td className="teacher-detail__col-name">{sanitizeDisplayValue(normalizeForDisplay(mentee.fullName))}</td>
                        <td className="teacher-detail__col-sem">{normalizeForDisplay(mentee.semester)}</td>
                        <td className="teacher-detail__col-section">{sanitizeDisplayValue(normalizeForDisplay(mentee.section))}</td>
                        <td className="teacher-detail__col-year">{normalizeForDisplay(mentee.yearOfAdmission)}</td>
                        <td className="teacher-detail__col-date">
                          {mentee.remarksDates && mentee.remarksDates.length > 0
                            ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                {mentee.remarksDates.map((d, i) => (
                                  <span key={i} style={{ whiteSpace: 'nowrap' }}>
                                    {new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                  </span>
                                ))}
                              </div>
                            )
                            : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      ) : null}
    </Modal>
  )
}
