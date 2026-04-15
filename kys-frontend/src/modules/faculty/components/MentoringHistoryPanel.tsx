import type { MinuteRow } from '../api/types'

interface MentoringHistoryPanelProps {
    minutes: MinuteRow[]
    isLoading: boolean
    offset: number
    limit: number
    isLastPage: boolean
    onPrev: () => void
    onNext: () => void
}

function formatDate(iso: string) {
    try {
        return new Date(iso).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    } catch {
        return iso
    }
}

export function MentoringHistoryPanel({
    minutes,
    isLoading,
    offset,
    limit,
    isLastPage,
    onPrev,
    onNext,
}: MentoringHistoryPanelProps) {
    const hasPrev = offset > 0
    const shownCount = Math.min(limit, minutes.length)

    if (isLoading) {
        return (
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="h-20 rounded-lg bg-gray-100 dark:bg-gray-700 animate-pulse" />
                ))}
            </div>
        )
    }

    if (minutes.length === 0) {
        return (
            <p className="text-sm text-gray-500 dark:text-gray-400">No mentoring minutes recorded yet.</p>
        )
    }

    return (
        <div className="space-y-3">
            <ul className="space-y-4 max-h-[28rem] overflow-y-auto pr-1">
                {minutes.map((m) => (
                    <li key={m.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                        <div className="flex justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span>{formatDate(m.date)}</span>
                            <span>Sem {m.semester}{m.created_by_faculty ? ' · You' : ''}</span>
                        </div>
                        <p className="mt-2 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                            {m.remarks}
                        </p>
                        {m.suggestion && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Suggestion:</span> {m.suggestion}
                            </p>
                        )}
                        {m.action && (
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                <span className="font-medium">Action:</span> {m.action}
                            </p>
                        )}
                    </li>
                ))}
            </ul>

            {(hasPrev || !isLastPage) && (
                <div className="flex items-center justify-between pt-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Showing {offset + 1}–{offset + shownCount}</span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onPrev}
                            disabled={!hasPrev}
                            className="px-3 py-1 rounded border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Newer
                        </button>
                        <button
                            type="button"
                            onClick={onNext}
                            disabled={isLastPage}
                            className="px-3 py-1 rounded border border-gray-200 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Older
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
