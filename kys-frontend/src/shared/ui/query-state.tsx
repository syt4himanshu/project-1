import type { ReactNode } from 'react'

interface QueryStateProps {
  title: string
  description?: string
  tone?: 'neutral' | 'error'
  actionLabel?: string
  onAction?: () => void
}

export function QueryState({
  title,
  description,
  tone = 'neutral',
  actionLabel,
  onAction,
}: QueryStateProps) {
  return (
    <div className={`query-state${tone === 'error' ? ' query-state--error' : ''}`} role={tone === 'error' ? 'alert' : 'status'}>
      <p className="query-state__title">{title}</p>
      {description ? <p className="query-state__description">{description}</p> : null}
      {actionLabel && onAction ? (
        <button type="button" className="query-state__action" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}

interface SectionShellProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

export function SectionShell({ title, subtitle, actions, children }: SectionShellProps) {
  return (
    <section className="admin-section card" aria-label={title}>
      <header className="admin-section__header">
        <div>
          <h2 className="admin-section__title">{title}</h2>
          {subtitle ? <p className="admin-section__subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="admin-section__actions">{actions}</div> : null}
      </header>
      {children}
    </section>
  )
}
