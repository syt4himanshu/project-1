import { useMemo, useState } from 'react'
import { toApiErrorMessage } from '../../../../shared/api/errorMapper'
import { DataTable, QueryState, type TableColumn } from '../../../../shared/ui'
import type { AdminAllocationEntry } from '../../api'
import { useAdminAllocationQuery } from '../../hooks'
import { AllocationAssignModal } from './AllocationAssignModal'
import { AllocationRemoveModal } from './AllocationRemoveModal'

interface PanelState {
  type: 'assign' | 'remove'
  faculty: AdminAllocationEntry
}

export function AllocationPageContent() {
  const allocationQuery = useAdminAllocationQuery()
  const [panelState, setPanelState] = useState<PanelState | null>(null)

  const columns = useMemo<TableColumn<AdminAllocationEntry>[]>(
    () => [
      {
        id: 'faculty',
        header: 'Faculty',
        cell: (row) => (
          <div>
            <p className="admin-identity__primary">{row.facultyName}</p>
            <p className="admin-identity__secondary">{row.email}</p>
          </div>
        ),
      },
      {
        id: 'uid',
        header: 'UID',
        cell: (row) => <span className="mono-cell">FAC{String(row.facultyId).padStart(3, '0')}</span>,
      },
      {
        id: 'assigned',
        header: 'Assigned',
        cell: (row) => <span className="count-pill">{row.assignedCount}</span>,
      },
      {
        id: 'capacity',
        header: 'Capacity',
        cell: (row) => normalizeCapacity(row.capacity),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (row) => (
          <div className="table-actions">
            <button
              type="button"
              className="button button--soft"
              disabled={row.assignedCount >= row.capacity}
              onClick={() => setPanelState({ type: 'assign', faculty: row })}
            >
              Allocate
            </button>
            <button
              type="button"
              className="button button--danger"
              disabled={row.assignedCount === 0}
              onClick={() => setPanelState({ type: 'remove', faculty: row })}
            >
              Remove
            </button>
          </div>
        ),
      },
    ],
    [],
  )

  if (allocationQuery.isError) {
    return (
      <div className="admin-page">
        <div className="admin-page__header">
          <h3 className="admin-page__title">Student-Faculty Allocation</h3>
          <p className="admin-page__subtitle">Generate and manage mentor assignments.</p>
        </div>
        <QueryState
          tone="error"
          title="Unable to load allocation records"
          description={toApiErrorMessage(allocationQuery.error, 'Please retry in a moment.')}
          actionLabel="Retry"
          onAction={() => void allocationQuery.refetch()}
        />
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h3 className="admin-page__title">Student-Faculty Allocation</h3>
        <p className="admin-page__subtitle">Generate, confirm, and remove student-faculty allocations.</p>
      </div>

      <div className="admin-surface">
        <DataTable
          columns={columns}
          data={allocationQuery.data ?? []}
          keyExtractor={(row) => row.facultyId}
          isLoading={allocationQuery.isPending}
          pageSize={12}
          emptyLabel="No faculty records available for allocation."
        />
      </div>

      <AllocationAssignModal
        open={panelState?.type === 'assign'}
        faculty={panelState?.type === 'assign' ? panelState.faculty : null}
        onClose={() => setPanelState(null)}
      />

      <AllocationRemoveModal
        open={panelState?.type === 'remove'}
        faculty={panelState?.type === 'remove' ? panelState.faculty : null}
        onClose={() => setPanelState(null)}
      />
    </div>
  )
}

function normalizeCapacity(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '20'
  return String(value)
}
