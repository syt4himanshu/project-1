import { useEffect, useState } from 'react'
import { Modal } from '../../../../shared/ui'
import type { AdminAutoAllocationResult, AdminAutoAllocationSummaryItem } from '../../api'
import { useAutoAllocateUnassignedMutation } from '../../hooks'

interface AllocationAutoModalProps {
  open: boolean
  onClose: () => void
}

export function AllocationAutoModal({ open, onClose }: AllocationAutoModalProps) {
  const [previewData, setPreviewData] = useState<AdminAutoAllocationResult | null>(null)
  const autoAllocateMutation = useAutoAllocateUnassignedMutation()

  useEffect(() => {
    if (open) {
      void autoAllocateMutation.mutateAsync({ preview: true }).then((res) => {
        setPreviewData(res)
      }).catch(() => {
        setPreviewData(null)
      })
    } else {
      setPreviewData(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleConfirm = async () => {
    try {
      await autoAllocateMutation.mutateAsync({ preview: false })
      onClose()
    } catch {
      // Error handled in mutation toast
    }
  }

  const isBusy = autoAllocateMutation.isPending
  const allocations = previewData?.allocations ?? []
  const distributedCount = previewData?.distributedCount ?? 0
  const unassignedCount = previewData?.unassignedCount ?? 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Auto-Allocate Remaining Students"
      subtitle="Equally distribute all unassigned students among faculty with available capacity."
      size="lg"
      footer={(
        <>
          <button type="button" className="button button--ghost" onClick={onClose} disabled={isBusy}>
            Cancel
          </button>
          <button
            type="button"
            className="button button--primary"
            onClick={() => void handleConfirm()}
            disabled={isBusy || distributedCount === 0}
          >
            {isBusy ? 'Allocating...' : `Confirm Allocation (${distributedCount})`}
          </button>
        </>
      )}
    >
      {isBusy && !previewData ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Calculating balanced allocation preview...
        </div>
      ) : autoAllocateMutation.isError && !previewData ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontWeight: 600, fontSize: '1.1rem', color: '#ef4444', marginBottom: '0.5rem' }}>
            Unable to Load Allocation Preview
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Could not communicate with auto-allocation endpoint. Please verify backend service is restarted on the server.
          </p>
          <button
            type="button"
            className="button button--soft"
            onClick={() => {
              void autoAllocateMutation.mutateAsync({ preview: true }).then((res) => {
                setPreviewData(res)
              }).catch(() => {
                setPreviewData(null)
              })
            }}
          >
            Retry Preview
          </button>
        </div>
      ) : unassignedCount === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontWeight: 600, fontSize: '1.1rem', color: '#10b981', marginBottom: '0.5rem' }}>
            ✓ All Students Assigned
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            There are no unassigned students in the system. Every student currently has an assigned faculty mentor.
          </p>
        </div>
      ) : distributedCount === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ fontWeight: 600, fontSize: '1.1rem', color: '#ef4444', marginBottom: '0.5rem' }}>
            Capacity Reached
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            All faculty members have reached their maximum capacity of 30 mentees.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              padding: '0.875rem 1.25rem',
              borderRadius: '0.5rem',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              fontSize: '0.875rem',
              color: 'var(--text)',
            }}
          >
            <strong>{distributedCount} unassigned students</strong> will be distributed across{' '}
            <strong>{allocations.length} faculty members</strong> to ensure an equal student-faculty ratio.
          </div>

          <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.625rem 1rem' }}>Faculty</th>
                  <th style={{ padding: '0.625rem 1rem', textAlign: 'center' }}>Current</th>
                  <th style={{ padding: '0.625rem 1rem', textAlign: 'center' }}>New Added</th>
                  <th style={{ padding: '0.625rem 1rem', textAlign: 'center' }}>Final Total</th>
                </tr>
              </thead>
              <tbody>
                {allocations.map((item: AdminAutoAllocationSummaryItem) => (
                  <tr key={item.facultyId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.625rem 1rem' }}>
                      <div style={{ fontWeight: 600 }}>{item.facultyName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.email}</div>
                    </td>
                    <td style={{ padding: '0.625rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      {item.initialCount}
                    </td>
                    <td style={{ padding: '0.625rem 1rem', textAlign: 'center', fontWeight: 600, color: '#10b981' }}>
                      +{item.newAssignedCount}
                    </td>
                    <td style={{ padding: '0.625rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                      {item.finalCount} / {item.capacity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Modal>
  )
}
