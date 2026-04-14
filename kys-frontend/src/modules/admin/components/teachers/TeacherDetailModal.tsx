import { toApiErrorMessage } from '../../../../shared/api/errorMapper'
import { Modal, QueryState } from '../../../../shared/ui'
import { normalizeForDisplay } from '../../api'
import { useAdminFacultyDetailQuery } from '../../hooks'

interface TeacherDetailModalProps {
  facultyId: number | null
  onClose: () => void
}

export function TeacherDetailModal({ facultyId, onClose }: TeacherDetailModalProps) {
  const detailQuery = useAdminFacultyDetailQuery(facultyId)
  const detail = detailQuery.data

  return (
    <Modal
      open={Boolean(facultyId)}
      onClose={onClose}
      title="Teacher Detail"
      subtitle={detail ? `${detail.faculty.name} (${detail.faculty.uid})` : 'Loading teacher details...'}
      size="lg"
      footer={(
        <button type="button" className="button button--primary" onClick={onClose}>
          Close
        </button>
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
        <div className="detail-scroll">
          <section className="detail-section">
            <h4>Profile</h4>
            <table className="detail-table">
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{normalizeForDisplay(detail.faculty.name)}</td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>{normalizeForDisplay(detail.faculty.email)}</td>
                </tr>
                <tr>
                  <th>Contact</th>
                  <td>{normalizeForDisplay(detail.faculty.contact)}</td>
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
              <table className="table detail-list-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>UID</th>
                    <th>Name</th>
                    <th>Semester</th>
                    <th>Section</th>
                    <th>Admission Year</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.mentees.map((mentee, index) => (
                    <tr key={mentee.id || `${mentee.uid}-${index}`}>
                      <td>{index + 1}</td>
                      <td className="mono-cell">{normalizeForDisplay(mentee.uid)}</td>
                      <td>{normalizeForDisplay(mentee.fullName)}</td>
                      <td>{normalizeForDisplay(mentee.semester)}</td>
                      <td>{normalizeForDisplay(mentee.section)}</td>
                      <td>{normalizeForDisplay(mentee.yearOfAdmission)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>
      ) : null}
    </Modal>
  )
}
