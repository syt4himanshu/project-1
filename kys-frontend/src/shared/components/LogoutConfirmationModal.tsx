import { AlertTriangle } from 'lucide-react'

export interface LogoutConfirmationModalProps {
  isOpen: boolean
  unsyncedCount: number
  onConfirm: () => void
  onCancel: () => void
}

export const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isOpen,
  unsyncedCount,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      <div
        className="modal-card"
        style={{
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          borderRadius: '0.75rem',
          maxWidth: '28rem',
          width: '100%',
          padding: '1.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid #334155',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <h3 id="logout-modal-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#f8fafc' }}>
            Unsynced Changes Warning
          </h3>
        </div>

        <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
          You have <strong>{unsyncedCount}</strong> unsynced change{unsyncedCount === 1 ? '' : 's'}. Logging out will permanently discard these offline changes and cached academic data. Continue?
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            className="button button--secondary"
            onClick={onCancel}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: '1px solid #475569',
              backgroundColor: '#334155',
              color: '#f8fafc',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button button--danger"
            onClick={onConfirm}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Discard & Logout
          </button>
        </div>
      </div>
    </div>
  )
}
