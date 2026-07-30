import { useMemo, useState } from 'react'
import { toApiErrorMessage } from '../../../../shared/api/errorMapper'
import { QueryState, ResponsiveDataView, type TableColumn } from '../../../../shared/ui'
import { sanitizeDisplayValue } from '../../../../shared/utils/render'
import type { AdminAllocationEntry } from '../../api'
import { useAdminAllocationQuery } from '../../hooks'
import { AllocationAssignModal } from './AllocationAssignModal'
import { AllocationAutoModal } from './AllocationAutoModal'
import { AllocationRemoveModal } from './AllocationRemoveModal'

interface PanelState {
  type: 'assign' | 'remove'
  faculty: AdminAllocationEntry
}

function getInitials(value: string): string {
  const text = sanitizeDisplayValue(value)
  const parts = text.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return text.slice(0, 2).toUpperCase() || 'NA'
}

export function AllocationPageContent() {
  const allocationQuery = useAdminAllocationQuery()
  const [panelState, setPanelState] = useState<PanelState | null>(null)
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false)

  const columns = useMemo<TableColumn<AdminAllocationEntry>[]>(
    () => [
      {
        id: 'faculty',
        header: 'Faculty',
        cell: (row) => (
          <div>
            <p className="admin-identity__primary">{sanitizeDisplayValue(row.facultyName)}</p>
            <p className="admin-identity__secondary">{sanitizeDisplayValue(row.email)}</p>
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

  const renderAllocationCard = (row: AdminAllocationEntry) => {
    return (
      <div className="mobile-card">
        <div className="mobile-card__header">
          <div className="mobile-card__avatar">
            {getInitials(row.facultyName)}
          </div>
          <div className="mobile-card__info">
            <h4 className="mobile-card__title">{sanitizeDisplayValue(row.facultyName)}</h4>
            <p className="mobile-card__subtitle">FAC{String(row.facultyId).padStart(3, '0')} · Faculty</p>
          </div>
        </div>

        <div className="mobile-card__content">
          <div className="mobile-card__row">
            <span className="mobile-card__label">Assigned Students</span>
            <span className="mobile-card__value">{row.assignedCount}</span>
          </div>
          <div className="mobile-card__row">
            <span className="mobile-card__label">Capacity</span>
            <span className="mobile-card__value">{normalizeCapacity(row.capacity)}</span>
          </div>
          <div className="mobile-card__row">
            <span className="mobile-card__label">Email</span>
            <span className="mobile-card__value">{sanitizeDisplayValue(row.email)}</span>
          </div>
          <div className="mobile-card__row">
            <span className="mobile-card__label">Utilization</span>
            <span className="mobile-card__value">{`${row.assignedCount}/${normalizeCapacity(row.capacity)}`}</span>
          </div>
        </div>

        <div className="mobile-card__actions">
          <button
            type="button"
            className="mobile-action-btn mobile-action-btn--primary"
            disabled={row.assignedCount >= row.capacity}
            onClick={() => setPanelState({ type: 'assign', faculty: row })}
            title="Edit"
            aria-label="Edit"
          >
            <span className="material-symbols-outlined" aria-hidden="true">edit</span>
          </button>

          <button
            type="button"
            className="mobile-action-btn mobile-action-btn--secondary"
            disabled={row.assignedCount === 0}
            onClick={() => setPanelState({ type: 'remove', faculty: row })}
            title="View"
            aria-label="View"
          >
            <span className="material-symbols-outlined" aria-hidden="true">visibility</span>
          </button>
        </div>
      </div>
    )
  }

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
      <div className="admin-page__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 className="admin-page__title">Student-Faculty Allocation</h3>
          <p className="admin-page__subtitle">Generate, confirm, and remove student-faculty allocations.</p>
        </div>
        <button
          type="button"
          className="button button--primary"
          onClick={() => setIsAutoModalOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.25rem' }}>auto_awesome</span>
          Auto-Allocate Remaining
        </button>
      </div>

      <div className="admin-surface">
        <ResponsiveDataView
          columns={columns}
          data={allocationQuery.data ?? []}
          keyExtractor={(row) => row.facultyId}
          isLoading={allocationQuery.isPending}
          pageSize={12}
          emptyLabel="No faculty records available for allocation."
          renderMobileCard={renderAllocationCard}
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

      <AllocationAutoModal
        open={isAutoModalOpen}
        onClose={() => setIsAutoModalOpen(false)}
      />
    </div>
  )
}

function normalizeCapacity(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '20'
  return String(value)
}
