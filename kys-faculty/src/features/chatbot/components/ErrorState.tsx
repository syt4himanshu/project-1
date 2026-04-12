interface ErrorStateProps {
    message: string
    retryLabel?: string
    onRetry?: () => void
}

export function ErrorState({ message, retryLabel = 'Retry', onRetry }: ErrorStateProps) {
    return (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm flex items-center justify-between gap-2">
            <span>{message}</span>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="shrink-0 text-xs font-semibold rounded border border-red-300 px-2 py-1 hover:bg-red-100"
                >
                    {retryLabel}
                </button>
            )}
        </div>
    )
}
