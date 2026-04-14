import { useMemo, useState } from 'react'
import { ConfirmDialog, Modal, QueryState } from '../../../../shared/ui'
import type { AdminAllocationEntry, AdminAllocationStudent } from '../../api'
import { useAdminAssignedStudentsQuery, useRemoveAllocationMutation } from '../../hooks'

interface AllocationRemoveModalProps {
  open: boolean
  faculty: AdminAllocationEntry | null
  onClose: () => void
}

export function AllocationRemoveModal({ open, faculty, onClose }: AllocationRemoveModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const assignedQuery = useAdminAssignedStudentsQuery(faculty?.facultyId ?? null)
  const removeMutation = useRemoveAllocationMutation()

  const rows = useMemo(() => assignedQuery.data ?? [], [assignedQuery.data])
  const selectedCount = selectedIds.size

  const reset = () => {
    setSelectedIds(new Set())
    setIsConfirmOpen(false)
  }

  const handleClose = () => {
    if (removeMutation.isPending) return
    reset()
    onClose()
  }

  const toggleSelection = (studentId: number) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(studentId)) {
        next.delete(studentId)
      } else {
        next.add(studentId)
      }
      return next
    })
  }

  const confirmRemoval = async () => {
    if (!faculty) return

    try {
      await removeMutation.mutateAsync({
        facultyId: faculty.facultyId,
        studentIds: Array.from(selectedIds),
      })

      handleClose()
    } catch {
      // Error handled in mutation toast.
    }
  }

  const selectionRows = useMemo(
    () => rows.map((row) => ({ ...row, selected: selectedIds.has(row.id) })),
    [rows, selectedIds],
  )

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title="Remove Assigned Students"
        subtitle={faculty ? `Faculty: ${faculty.facultyName}` : 'Select a faculty member to continue.'}
        size="lg"
        footer={(
          <>
            <button type="button" className="button button--ghost" onClick={handleClose}>
              Close
            </button>
            <button
              type="button"
              className="button button--danger"
              onClick={() => setIsConfirmOpen(true)}
              disabled={!faculty || selectedCount === 0 || removeMutation.isPending}
            >
              Remove Selected ({selectedCount})
            </button>
          </>
        )}
      >
        {!faculty ? <QueryState title="Select faculty" description="No faculty selected for removal." /> : null}

        {faculty && assignedQuery.isPending ? <QueryState title="Loading assigned students" description="Fetching latest assignment list..." /> : null}

        {faculty && assignedQuery.isError ? (
          <QueryState
            tone="error"
            title="Unable to load assigned students"
            description="Please retry in a moment."
            actionLabel="Retry"
            onAction={() => void assignedQuery.refetch()}
          />
        ) : null}

        {faculty && !assignedQuery.isPending && !assignedQuery.isError ? (
          rows.length === 0 ? (
            <QueryState title="No assigned students" description="There are no students assigned to this faculty." />
          ) : (
            <div className="selection-grid">
              {selectionRows.map((row: AdminAllocationStudent & { selected: boolean }) => (
                <button
                  type="button"
                  key={row.id}
                  className={`selection-card${row.selected ? ' selection-card--danger' : ''}`}
                  onClick={() => toggleSelection(row.id)}
                >
                  <input
                    type="checkbox"
                    checked={row.selected}
                    onChange={() => toggleSelection(row.id)}
                    onClick={(event) => event.stopPropagation()}
                  />
                  <div>
                    <p className="selection-card__title">{row.name}</p>
                    <p className="selection-card__meta">{row.uid}</p>
                  </div>
                </button>
              ))}
            </div>
          )
        ) : null}
      </Modal>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Confirm Removal"
        message={`Remove ${selectedCount} students from ${faculty?.facultyName ?? 'this faculty member'}?`}
        confirmLabel="Remove"
        cancelLabel="Back"
        tone="danger"
        isBusy={removeMutation.isPending}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => void confirmRemoval()}
      />
    </>
  )
}
