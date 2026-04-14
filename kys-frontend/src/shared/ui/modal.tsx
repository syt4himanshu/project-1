import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  title: string
  subtitle?: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const SIZE_CLASS: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'modal__panel--sm',
  md: 'modal__panel--md',
  lg: 'modal__panel--lg',
  xl: 'modal__panel--xl',
}

export function Modal({
  open,
  title,
  subtitle,
  children,
  onClose,
  footer,
  size = 'md',
}: ModalProps) {
  useEffect(() => {
    if (!open) return

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeydown)
    return () => window.removeEventListener('keydown', onKeydown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal__backdrop" onClick={onClose} />
      <section className={`modal__panel ${SIZE_CLASS[size]}`}>
        <header className="modal__header">
          <div>
            <h3 className="modal__title">{title}</h3>
            {subtitle ? <p className="modal__subtitle">{subtitle}</p> : null}
          </div>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </header>

        <div className="modal__body">{children}</div>

        {footer ? <footer className="modal__footer">{footer}</footer> : null}
      </section>
    </div>
  )
}
