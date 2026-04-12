import type { FormEvent } from 'react'
import { ErrorState } from './ErrorState'

interface ChatInputProps {
    query: string
    contextLabel: string
    requestError: string
    isLoading: boolean
    canSend: boolean
    isStudentSelectionInvalid: boolean
    hasLastPayload: boolean
    onQueryChange: (nextValue: string) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    onStop: () => void
    onRegenerate: () => void
}

export function ChatInput({
    query,
    contextLabel,
    requestError,
    isLoading,
    canSend,
    isStudentSelectionInvalid,
    hasLastPayload,
    onQueryChange,
    onSubmit,
    onStop,
    onRegenerate,
}: ChatInputProps) {
    return (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">Current context: {contextLabel}</p>
            </div>

            {requestError && (
                <div className="mb-3">
                    <ErrorState message={requestError} retryLabel="Regenerate" onRetry={onRegenerate} />
                </div>
            )}

            {isStudentSelectionInvalid && (
                <div className="mb-3 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                    Select a student first, or switch scope to all assigned students.
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-2">
                <textarea
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    rows={3}
                    maxLength={2000}
                    placeholder="Ask for mentoring insights, trends, concerns, or actionable suggestions..."
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 resize-none"
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{query.trim().length}/2000 characters</p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={onStop}
                            disabled={!isLoading}
                            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 disabled:opacity-50"
                        >
                            Stop
                        </button>
                        <button
                            type="button"
                            onClick={onRegenerate}
                            disabled={!hasLastPayload || isLoading}
                            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 disabled:opacity-50"
                        >
                            Regenerate
                        </button>
                        <button
                            type="submit"
                            disabled={!canSend}
                            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium disabled:opacity-60"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
