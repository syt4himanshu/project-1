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
    onQueryChange: (value: string) => void
    onSubmit: (e: FormEvent<HTMLFormElement>) => void
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
        <div className="faculty-chat__input-area">
            <p className="faculty-chat__context-label">
                Active context: <strong>{contextLabel}</strong>
            </p>

            {requestError && (
                <div className="faculty-chat__input-error">
                    <ErrorState message={requestError} retryLabel="Regenerate" onRetry={onRegenerate} />
                </div>
            )}

            {isStudentSelectionInvalid && (
                <p className="faculty-chat__warn">
                    Select a student first, or switch scope to all assigned students.
                </p>
            )}

            <form onSubmit={onSubmit} className="faculty-chat__form">
                <label className="admin-field faculty-chat__textarea-label" htmlFor="faculty-chat-query">
                    <span>Your question</span>
                    <textarea
                        id="faculty-chat-query"
                        value={query}
                        onChange={(e) => onQueryChange(e.target.value)}
                        rows={4}
                        maxLength={2000}
                        placeholder="Ask for mentoring insights, trends, concerns, or actionable suggestions..."
                    />
                </label>

                <div className="faculty-chat__form-footer">
                    <p className="faculty-chat__char-count">{query.trim().length}/2000</p>
                    <div className="table-actions">
                        <button
                            type="button"
                            className="button button--ghost"
                            onClick={onStop}
                            disabled={!isLoading}
                        >
                            Stop
                        </button>
                        <button
                            type="button"
                            className="button button--ghost"
                            onClick={onRegenerate}
                            disabled={!hasLastPayload || isLoading}
                        >
                            Regenerate
                        </button>
                        <button
                            type="submit"
                            className="button button--primary"
                            disabled={!canSend}
                        >
                            {isLoading ? 'Generating...' : 'Send Query'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
