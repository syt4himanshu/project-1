import type { BulkOperationItem } from '../../api'

interface BulkUploadReportProps {
  title: string
  rows: BulkOperationItem[]
}

export function BulkUploadReport({ title, rows }: BulkUploadReportProps) {
  if (rows.length === 0) return null

  const successCount = rows.filter((row) => row.status === 'success').length
  const failedCount = rows.length - successCount

  return (
    <section className="bulk-report" aria-label={`${title} report`}>
      <header className="bulk-report__header">
        <h4>{title}</h4>
        <p>
          {successCount} succeeded, {failedCount} failed
        </p>
      </header>

      <div className="table-scroll">
        <table className="table bulk-report__table">
          <thead>
            <tr>
              <th>Identifier</th>
              <th>Status</th>
              <th>Error</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.identifier}-${row.status}-${row.error ?? ''}`}>
                <td className="mono-cell">{row.identifier}</td>
                <td>
                  <span className={`bulk-report__status bulk-report__status--${row.status}`}>
                    {row.status}
                  </span>
                </td>
                <td>{row.error ?? 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
