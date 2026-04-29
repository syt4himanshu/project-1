import { useState, useEffect, useRef, type FormEvent } from 'react'
import {
  Sparkles,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  TrendingUp,
  MessageSquareText,
  X,
} from 'lucide-react'
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
  { id: 'placement', label: 'Placement-focused advice', Icon: Briefcase },
  { id: 'skills', label: 'Skill improvement plan', Icon: TrendingUp },
  { id: 'behavior', label: 'Behavior & communication', Icon: MessageSquareText },
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
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
      if (messages.length === 0) {
        setMessages([
          {
            id: '1',
            role: 'assistant',
            content: `I can help you draft clear, professional remarks for ${studentContext.name}. Use a prompt below or ask directly.`,
            timestamp: new Date(),
          },
        ])
      }
    }
  }, [open, studentContext.name, messages.length])

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
      placement: `Provide placement-focused advice for ${studentContext.name}`,
      skills: `Suggest a skill improvement plan for ${studentContext.name}`,
      behavior: `Write behavior and communication remarks for ${studentContext.name}`,
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
        content: 'I could not generate remarks right now. Please retry in a moment.',
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
        <header className="ai-remarks-header">
          <div className="ai-remarks-header-content">
            <Sparkles className="ai-remarks-icon" size={20} />
            <div className="ai-remarks-header-text">
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
            <X size={18} />
          </button>
        </header>

        <div className="ai-remarks-chips">
          {SUGGESTION_CHIPS.map((chip) => (
            <button
              key={chip.id}
              type="button"
              className="ai-remarks-chip"
              onClick={() => void handleSuggestionClick(chip.id)}
              disabled={isLoading}
            >
              <chip.Icon className="ai-remarks-chip-icon" size={16} />
              {chip.label}
            </button>
          ))}
        </div>

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

        <form className="ai-remarks-input-form" onSubmit={handleSubmit}>
          <label className="ai-remarks-input-label" htmlFor="ai-remarks-query">Ask AI</label>
          <textarea
            ref={inputRef}
            id="ai-remarks-query"
            className="ai-remarks-input"
            placeholder="Ask for specific feedback, mentoring summary, or action-oriented remarks..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            rows={3}
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

        {generatedContent && (
          <div className="ai-remarks-action">
            <button
              type="button"
              className="ai-remarks-insert-btn"
              onClick={handleInsertRemarks}
            >
              <CheckCircle2 size={18} />
              Insert Into Remarks Form
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function parseAIResponse(content: string): {
  remarks: string
  suggestion?: string
  action?: string
} {
  return {
    remarks: content.trim(),
    suggestion: undefined,
    action: undefined,
  }
}
