import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../../../app/store/hooks'
import { facultyChatActions, selectFacultyChatAnalysisText, selectFacultyChatMessages } from '../../store/facultyChatSlice'
import { QUICK_PROMPTS } from '../constants'
import { ChatMessage } from './ChatMessage'
import { EmptyState } from './EmptyState'

export function ChatWindow() {
    const dispatch = useAppDispatch()
    const messages = useAppSelector(selectFacultyChatMessages)
    const analysisText = useAppSelector(selectFacultyChatAnalysisText)
    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, [messages])

    return (
        <div className="faculty-chat__window">
            {messages.length === 0 && (
                <EmptyState
                    prompts={QUICK_PROMPTS}
                    onPromptClick={(prompt) => dispatch(facultyChatActions.setComposerQuery(prompt))}
                />
            )}
            {messages.map((message) => (
                <ChatMessage key={message.id} message={message} analysisText={analysisText} />
            ))}
            <div ref={bottomRef} />
        </div>
    )
}
