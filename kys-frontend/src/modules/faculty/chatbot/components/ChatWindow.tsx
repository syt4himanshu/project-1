import { useEffect, useRef } from 'react'
import { QUICK_PROMPTS } from '../constants'
import type { ChatMessageModel } from '../types'
import { ChatMessage } from './ChatMessage'
import { EmptyState } from './EmptyState'

interface ChatWindowProps {
    messages: ChatMessageModel[]
    analysisText: string
    onPromptClick: (prompt: string) => void
}

export function ChatWindow({ messages, analysisText, onPromptClick }: ChatWindowProps) {
    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, [messages])

    return (
        <div className="faculty-chat__window">
            {messages.length === 0 && (
                <EmptyState prompts={QUICK_PROMPTS} onPromptClick={onPromptClick} />
            )}
            {messages.map((message) => (
                <ChatMessage key={message.id} message={message} analysisText={analysisText} />
            ))}
            <div ref={bottomRef} />
        </div>
    )
}
