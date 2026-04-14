import { useMemo, useState } from 'react'
import { ConfirmDialog, Modal, QueryState } from '../../../../shared/ui'
import type { AdminAllocationEntry, AdminAllocationStudent } from '../../api'
import { useConfirmAllocationMutation, useGenerateAllocationMutation } from '../../hooks'

interface AllocationAssignModalProps {
  open: boolean
  faculty: AdminAllocationEntry | null
  onClose: () => void
}

export function AllocationAssignModal({ open, faculty, onClose }: AllocationAssignModalProps) {
  const [suggestions, setSuggestions] = useState<AdminAllocationStudent[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const generateMutation = useGenerateAllocationMutation()
  const confirmMutation = useConfirmAllocationMutation()

  const selectedCount = selectedIds.size

  const reset = () => {
    setSuggestions([])
    setSelectedIds(new Set())
    setIsConfirmOpen(false)
  }

  const handleClose = () => {
    if (confirmMutation.isPending) return
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

  const runGenerate = async () => {
    if (!faculty) return

    try {
      const rows = await generateMutation.mutateAsync({ facultyId: faculty.facultyId })
      setSuggestions(rows)
      setSelectedIds(new Set(rows.map((row) => row.id)))
    } catch {
      // Error handled in mutation toast.
    }
  }

  const confirmAllocation = async () => {
    if (!faculty) return

    try {
      await confirmMutation.mutateAsync({
        facultyId: faculty.facultyId,
        studentIds: Array.from(selectedIds),
      })

      handleClose()
    } catch {
      // Error handled in mutation toast.
    }
  }

  const selectionRows = useMemo(
    () => suggestions.map((row) => ({ ...row, selected: selectedIds.has(row.id) })),
    [suggestions, selectedIds],
  )

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        title="Generate Allocation"
        subtitle={faculty ? `Faculty: ${faculty.facultyName}` : 'Select a faculty member to continue.'}
        size="lg"
        footer={(
          <>
            <button type="button" className="button button--ghost" onClick={handleClose}>
              Close
            </button>
            <button
              type="button"
              className="button button--ghost"
              onClick={() => void runGenerate()}
              disabled={!faculty || generateMutation.isPending || confirmMutation.isPending}
            >
              {generateMutation.isPending ? 'Generating...' : 'Generate Suggestions'}
            </button>
            <button
              type="button"
              className="button button--primary"
              onClick={() => setIsConfirmOpen(true)}
              disabled={!faculty || selectedCount === 0 || confirmMutation.isPending}
            >
              Confirm Allocation ({selectedCount})
            </button>
          </>
        )}
      >
        {!faculty ? <QueryState title="Select faculty" description="No faculty selected for allocation." /> : null}

        {faculty ? (
          <div>
            {suggestions.length === 0 ? (
              <QueryState title="No suggestions yet" description="Use Generate Suggestions to fetch recommended unassigned students." />
            ) : (
              <div className="selection-grid">
                {selectionRows.map((row) => (
                  <button
                    type="button"
                    key={row.id}
                    className={`selection-card${row.selected ? ' selection-card--selected' : ''}`}
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
            )}
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Confirm Allocation"
        message={`Allocate ${selectedCount} students to ${faculty?.facultyName ?? 'this faculty member'}?`}
        confirmLabel="Allocate"
        cancelLabel="Back"
        isBusy={confirmMutation.isPending}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => void confirmAllocation()}
      />
    </>
  )
}
