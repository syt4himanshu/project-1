import { useRef, useState } from 'react'
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
  const [isExporting, setIsExporting] = useState(false)

  const handlePdf = async () => {
    if (!detailContentRef.current || !detail || isExporting) return

    setIsExporting(true)
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
      pdf.save(`${facultyUid}-teacher-detail.pdf`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Modal
      open={Boolean(facultyId)}
      onClose={onClose}
      title="Teacher Detail"
      subtitle={detail ? `${sanitizeDisplayValue(detail.faculty.name)} (${sanitizeDisplayValue(detail.faculty.uid)})` : 'Loading teacher details...'}
      size="lg"
      footer={(
        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', width: '100%' }}>
          <button
            type="button"
            className="button button--ghost"
            onClick={() => void handlePdf()}
            disabled={!detail || isExporting}
          >
            {isExporting ? 'Exporting...' : 'Download PDF'}
          </button>
          <button type="button" className="button button--primary" onClick={onClose}>
            Close
          </button>
        </div>
      )}
    >
      {detailQuery.isPending ? <QueryState title="Loading teacher profile" description="Fetching mentee list..." /> : null}

      {detailQuery.isError ? (
        <QueryState
          tone="error"
          title="Unable to load teacher detail"
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
              <p className="detail-empty">No students assigned to this teacher.</p>
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
