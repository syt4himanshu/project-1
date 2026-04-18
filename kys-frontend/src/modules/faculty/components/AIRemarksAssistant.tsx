import { useState, useEffect, useRef, type FormEvent } from 'react'
import { Sparkles, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { facultyClient } from '../api/client'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'

interface StudentContext {
    uid: string
    name: string
    semester: number
    program: string
    previousRemarks?: Array<{
        date: string
        remarks: string
        suggestion?: string
        action?: string
    }>
}

interface AIRemarksAssistantProps {
    open: boolean
    studentContext: StudentContext
    onClose: () => void
    onInsert: (remarks: string, suggestion?: string, action?: string) => void
}

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

const SUGGESTION_CHIPS = [
    { id: 'performance', label: 'Performance Feedback', icon: '📊' },
    { id: 'behavior', label: 'Behavior Remarks', icon: '🎯' },
    { id: 'improvement', label: 'Improvement Plan', icon: '📈' },
    { id: 'summary', label: 'Overall Summary', icon: '📝' },
]

export function AIRemarksAssistant({ open, studentContext, onClose, onInsert }: AIRemarksAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [generatedContent, setGeneratedContent] = useState<{
        remarks: string
        suggestion?: string
        action?: string
    } | null>(null)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Focus input when opened
    useEffect(() => {
        if (open) {
            inputRef.current?.focus()
            // Add initial greeting
            if (messages.length === 0) {
                setMessages([
                    {
                        id: '1',
                        role: 'assistant',
                        content: `Hi! I'm here to help you write remarks for ${studentContext.name}. Choose a suggestion below or ask me anything.`,
                        timestamp: new Date(),
                    },
                ])
            }
        }
    }, [open, studentContext.name, messages.length])

    // Keyboard trap for accessibility
    useEffect(() => {
        if (!open) return

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [open, onClose])

    const handleSuggestionClick = async (chipId: string) => {
        const prompts: Record<string, string> = {
            performance: `Generate performance feedback for ${studentContext.name} (Semester ${studentContext.semester})`,
            behavior: `Write behavior remarks for ${studentContext.name}`,
            improvement: `Suggest improvement areas for ${studentContext.name}`,
            summary: `Provide an overall mentoring summary for ${studentContext.name}`,
        }

        const prompt = prompts[chipId]
        if (prompt) {
            await handleSendMessage(prompt)
        }
    }

    const handleSendMessage = async (messageText?: string) => {
        const text = messageText || input.trim()
        if (!text || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date(),
        }

        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setIsLoading(true)
        setError(null)

        try {
            const data = await facultyClient.askAIRemarks({
                query: text,
                studentContext: {
                    uid: studentContext.uid,
                    name: studentContext.name,
                    semester: studentContext.semester,
                    program: studentContext.program,
                    previousRemarks: studentContext.previousRemarks?.slice(0, 3),
                },
            })
            const aiContent = data.content || 'No response generated'

            // Parse structured response
            const parsed = parseAIResponse(aiContent)
            setGeneratedContent(parsed)

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiContent,
                timestamp: new Date(),
            }

            setMessages((prev) => [...prev, assistantMessage])
        } catch (err) {
            setError(toApiErrorMessage(err, 'Failed to get AI response'))
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        void handleSendMessage()
    }

    const handleInsertRemarks = () => {
        if (generatedContent) {
            onInsert(generatedContent.remarks, generatedContent.suggestion, generatedContent.action)
            onClose()
        }
    }

    if (!open) return null

    return (
        <div className="ai-remarks-overlay" role="dialog" aria-modal="true" aria-labelledby="ai-remarks-title">
            <div className="ai-remarks-backdrop" onClick={onClose} />

            <div className="ai-remarks-popup">
                {/* Header */}
                <header className="ai-remarks-header">
                    <div className="ai-remarks-header-content">
                        <Sparkles className="ai-remarks-icon" size={20} />
                        <div>
                            <h3 id="ai-remarks-title" className="ai-remarks-title">AI Remarks Assistant</h3>
                            <p className="ai-remarks-subtitle">
                                {studentContext.name} • Sem {studentContext.semester} • {studentContext.program}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="ai-remarks-close"
                        onClick={onClose}
                        aria-label="Close AI assistant"
                    >
                        ×
                    </button>
                </header>

                {/* Suggestion Chips */}
                <div className="ai-remarks-chips">
                    {SUGGESTION_CHIPS.map((chip) => (
                        <button
                            key={chip.id}
                            type="button"
                            className="ai-remarks-chip"
                            onClick={() => void handleSuggestionClick(chip.id)}
                            disabled={isLoading}
                        >
                            <span className="ai-remarks-chip-icon">{chip.icon}</span>
                            {chip.label}
                        </button>
                    ))}
                </div>

                {/* Messages */}
                <div className="ai-remarks-messages">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`ai-remarks-message ${msg.role === 'user' ? 'ai-remarks-message--user' : 'ai-remarks-message--assistant'}`}
                        >
                            <div className="ai-remarks-message-content">
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="ai-remarks-message ai-remarks-message--assistant">
                            <div className="ai-remarks-message-content ai-remarks-loading">
                                <Loader2 className="ai-remarks-spinner" size={16} />
                                Generating remarks...
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="ai-remarks-error">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form className="ai-remarks-input-form" onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        className="ai-remarks-input"
                        placeholder="Ask for specific feedback or guidance..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="ai-remarks-send"
                        disabled={!input.trim() || isLoading}
                        aria-label="Send message"
                    >
                        <Send size={18} />
                    </button>
                </form>

                {/* Insert Action */}
                {generatedContent && (
                    <div className="ai-remarks-action">
                        <button
                            type="button"
                            className="ai-remarks-insert-btn"
                            onClick={handleInsertRemarks}
                        >
                            <CheckCircle2 size={18} />
                            Insert into Remarks Form
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

// Helper to parse AI response into structured format
function parseAIResponse(content: string): {
    remarks: string
    suggestion?: string
    action?: string
} {
    const lines = content.split('\n').filter(Boolean)

    let remarks = ''
    let suggestion = ''
    let action = ''
    let currentSection = 'remarks'

    for (const line of lines) {
        const lower = line.toLowerCase()

        if (lower.includes('suggestion') || lower.includes('recommendation')) {
            currentSection = 'suggestion'
            continue
        }
        if (lower.includes('action') || lower.includes('next step')) {
            currentSection = 'action'
            continue
        }

        const cleanLine = line.replace(/^[-*•]\s*/, '').trim()
        if (!cleanLine) continue

        if (currentSection === 'remarks') remarks += cleanLine + ' '
        else if (currentSection === 'suggestion') suggestion += cleanLine + ' '
        else if (currentSection === 'action') action += cleanLine + ' '
    }

    return {
        remarks: remarks.trim() || content.substring(0, 200),
        suggestion: suggestion.trim() || undefined,
        action: action.trim() || undefined,
    }
}
