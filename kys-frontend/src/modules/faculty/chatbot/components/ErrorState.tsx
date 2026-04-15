interface ErrorStateProps {
    message: string
    retryLabel?: string
    onRetry?: () => void
}

export function ErrorState({ message, retryLabel = 'Retry', onRetry }: ErrorStateProps) {
    return (
        <div className="query-state query-state--error">
            <p className="query-state__title">{message}</p>
            {onRetry && (
                <button type="button" className="query-state__action" onClick={onRetry}>
                    {retryLabel}
                </button>
            )}
        </div>
    )
}
