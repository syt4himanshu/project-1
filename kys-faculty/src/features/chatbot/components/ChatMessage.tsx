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
            <article className="max-w-4xl ml-auto">
                <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">{message.contextLabel}</div>
                <div className="rounded-2xl rounded-tr-sm bg-indigo-600 text-white px-4 py-3 text-sm">
                    {message.content}
                </div>
            </article>
        )
    }

    return (
        <article className="max-w-4xl mr-auto">
            <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">{message.contextLabel}</div>
            <div className="rounded-2xl rounded-tl-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-4 space-y-3">
                {message.loading && <LoadingState subtitle={analysisText} />}

                {!message.loading && message.sections && (
                    <div className="grid gap-3 sm:grid-cols-2">
                        {SECTION_ORDER.map((sectionName) => (
                            <ResponseCard
                                key={`${message.id}-${sectionName}`}
                                title={sectionName}
                                content={message.sections?.[sectionName]?.trim() || ''}
                            />
                        ))}
                    </div>
                )}

                {!message.loading && !message.sections && (
                    <p className={`text-sm whitespace-pre-wrap ${message.error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-200'}`}>
                        {message.content}
                    </p>
                )}
            </div>
        </article>
    )
}

export const ChatMessage = memo(ChatMessageImpl)
