import { Modal } from './modal'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  isBusy?: boolean
  tone?: 'neutral' | 'danger'
  onCancel: () => void
  onConfirm: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isBusy = false,
  tone = 'neutral',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      size="sm"
      footer={(
        <>
          <button type="button" className="button button--ghost" onClick={onCancel} disabled={isBusy}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`button ${tone === 'danger' ? 'button--danger' : 'button--primary'}`}
            onClick={onConfirm}
            disabled={isBusy}
          >
            {isBusy ? 'Please wait...' : confirmLabel}
          </button>
        </>
      )}
    >
      <p className="confirm-dialog__message">{message}</p>
    </Modal>
  )
}
