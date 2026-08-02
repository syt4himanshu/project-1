import { memo } from 'react'
import { SECTION_ORDER } from '../constants'
import type { ChatMessageModel } from '../types'
import { LoadingState } from './LoadingState'
import { ResponseCard } from './ResponseCard'

interface ChatMessageProps {
    message: ChatMessageModel
    analysisText: string
}

function ChatMessageImpl({ message, analysisText }: ChatMessageProps) {
    if (message.role === 'user') {
        return (
            <article className="faculty-chat-msg faculty-chat-msg--user">
                <p className="faculty-chat-msg__context">{message.contextLabel}</p>
                <div className="faculty-chat-msg__bubble faculty-chat-msg__bubble--user">
                    {message.content}
                </div>
            </article>
        )
    }

    return (
        <article className="faculty-chat-msg faculty-chat-msg--assistant">
            <p className="faculty-chat-msg__context">{message.contextLabel}</p>
            <div className="faculty-chat-msg__bubble faculty-chat-msg__bubble--assistant">

                {/* Loading state */}
                {message.loading && <LoadingState subtitle={analysisText} />}

                {/* First response: direct answer + snapshot cards */}
                {!message.loading && message.isSnapshot && (
                    <>
                        {message.directAnswer && (
                            <p className={`faculty-prewrap faculty-chat-msg__direct-answer${message.error ? ' faculty-chat-msg__error' : ''}`}>
                                {message.directAnswer}
                            </p>
                        )}

                        {message.sections && (
                            <div className="faculty-response-grid faculty-response-grid--snapshot">
                                {SECTION_ORDER.map((sectionName) => (
                                    <ResponseCard
                                        key={`${message.id}-${sectionName}`}
                                        title={sectionName}
                                        content={message.sections?.[sectionName]?.trim() ?? ''}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Follow-up response: plain conversational text only */}
                {!message.loading && !message.isSnapshot && (
                    <p className={`faculty-prewrap${message.error ? ' faculty-chat-msg__error' : ''}`}>
                        {message.content}
                    </p>
                )}
            </div>
        </article>
    )
}

export const ChatMessage = memo(ChatMessageImpl)
