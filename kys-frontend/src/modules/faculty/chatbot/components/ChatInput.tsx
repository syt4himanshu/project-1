import type { FormEvent } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../app/store/hooks'
import {
    facultyChatActions,
    regenerateFacultyChatResponse,
    selectFacultyChatCanSend,
    selectFacultyChatComposerQuery,
    selectFacultyChatContextLabel,
    selectFacultyChatIsLoading,
    selectFacultyChatIsStudentSelectionInvalid,
    selectFacultyChatLastPayloadExists,
    selectFacultyChatRequestError,
    selectFacultyChatScopeMode,
    selectFacultyChatSelectedStudentUid,
    stopFacultyChatResponse,
    submitFacultyChatPayload,
} from '../../store/facultyChatSlice'
import { ErrorState } from './ErrorState'

export function ChatInput() {
    const dispatch = useAppDispatch()
    const query = useAppSelector(selectFacultyChatComposerQuery)
    const contextLabel = useAppSelector(selectFacultyChatContextLabel)
    const requestError = useAppSelector(selectFacultyChatRequestError)
    const isLoading = useAppSelector(selectFacultyChatIsLoading)
    const canSend = useAppSelector(selectFacultyChatCanSend)
    const isStudentSelectionInvalid = useAppSelector(selectFacultyChatIsStudentSelectionInvalid)
    const hasLastPayload = useAppSelector(selectFacultyChatLastPayloadExists)
    const scopeMode = useAppSelector(selectFacultyChatScopeMode)
    const selectedStudentUid = useAppSelector(selectFacultyChatSelectedStudentUid)

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const nextQuery = query.trim()
        if (!nextQuery || !canSend) return

        dispatch(facultyChatActions.setComposerQuery(''))
        await dispatch(submitFacultyChatPayload({
            query: nextQuery,
            studentId: scopeMode === 'student' ? selectedStudentUid : undefined,
        }))
    }

    return (
        <div className="faculty-chat__input-area">
            <p className="faculty-chat__context-label">
                Active context: <strong>{contextLabel}</strong>
            </p>

            {requestError && (
                <div className="faculty-chat__input-error">
                    <ErrorState
                        message={requestError}
                        retryLabel="Regenerate"
                        onRetry={() => void dispatch(regenerateFacultyChatResponse())}
                    />
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
                        onChange={(e) => dispatch(facultyChatActions.setComposerQuery(e.target.value))}
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
                            onClick={() => void dispatch(stopFacultyChatResponse())}
                            disabled={!isLoading}
                        >
                            Stop
                        </button>
                        <button
                            type="button"
                            className="button button--ghost"
                            onClick={() => void dispatch(regenerateFacultyChatResponse())}
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
