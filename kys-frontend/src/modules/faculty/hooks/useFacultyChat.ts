import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { facultyClient } from '../api/client'
import { normalizeMentees } from '../api/normalizers'
import {
    parseStructuredResponse,
    formatContextLabel,
    toErrorMessage,
} from '../chatbot/utils/chatFormatters'
import type { ChatMessageModel, ChatbotRequest, MenteeRow, ScopeMode } from '../api/types'

export interface UseFacultyChatResult {
    mentees: MenteeRow[]
    filteredMentees: MenteeRow[]
    menteeLoading: boolean
    menteeError: string
    scopeMode: ScopeMode
    selectedStudentUid: string
    studentSearch: string
    messages: ChatMessageModel[]
    requestError: string
    isLoading: boolean
    analysisText: string
    lastPayloadExists: boolean
    setScopeMode: (mode: ScopeMode) => void
    setSelectedStudentUid: (uid: string) => void
    setStudentSearch: (query: string) => void
    reloadMentees: () => Promise<void>
    submitPayload: (payload: ChatbotRequest) => Promise<void>
    stopResponse: () => void
    regenerate: () => Promise<void>
}

function isAbortError(error: unknown): boolean {
    return (
        (error instanceof DOMException && error.name === 'AbortError') ||
        (error as { code?: string })?.code === 'ERR_CANCELED'
    )
}

export function useFacultyChat(): UseFacultyChatResult {
    const [mentees, setMentees] = useState<MenteeRow[]>([])
    const [menteeLoading, setMenteeLoading] = useState(true)
    const [menteeError, setMenteeError] = useState('')

    const [scopeMode, setScopeModeState] = useState<ScopeMode>('all')
    const [selectedStudentUid, setSelectedStudentUidState] = useState('')
    const [studentSearch, setStudentSearch] = useState('')

    const [messages, setMessages] = useState<ChatMessageModel[]>([])
    const [requestError, setRequestError] = useState('')
    const [loadingMessageId, setLoadingMessageId] = useState('')
    const [lastPayload, setLastPayload] = useState<ChatbotRequest | null>(null)

    const abortRef = useRef<AbortController | null>(null)
    const counterRef = useRef(0)

    // ── Mentee loading ──────────────────────────────────────────────────────────

    const reloadMentees = useCallback(async () => {
        setMenteeLoading(true)
        setMenteeError('')
        try {
            const data = await facultyClient.getMentees()
            setMentees(normalizeMentees(data))
        } catch {
            setMenteeError('Could not load assigned students.')
        } finally {
            setMenteeLoading(false)
        }
    }, [])

    useEffect(() => {
        void reloadMentees()
        return () => { abortRef.current?.abort() }
    }, [reloadMentees])

    // Auto-clear invalid student selection when mentee list changes
    useEffect(() => {
        if (!selectedStudentUid) return
        if (mentees.some((r) => r.uid === selectedStudentUid)) return
        setScopeModeState('all')
        setSelectedStudentUidState('')
    }, [mentees, selectedStudentUid])

    // ── Derived state ───────────────────────────────────────────────────────────

    const filteredMentees = useMemo(() => {
        const q = studentSearch.trim().toLowerCase()
        if (!q) return mentees
        return mentees.filter((r) =>
            `${r.full_name} ${r.uid} ${r.semester}`.toLowerCase().includes(q),
        )
    }, [mentees, studentSearch])

    const isLoading = Boolean(loadingMessageId)

    // ── Scope / student selection ───────────────────────────────────────────────

    const setScopeMode = useCallback((mode: ScopeMode) => {
        setScopeModeState(mode)
        if (mode === 'all') setSelectedStudentUidState('')
    }, [])

    const setSelectedStudentUid = useCallback((uid: string) => {
        setSelectedStudentUidState(uid)
        setScopeModeState(uid ? 'student' : 'all')
    }, [])

    // ── Submit ──────────────────────────────────────────────────────────────────

    const submitPayload = useCallback(
        async (payload: ChatbotRequest) => {
            setRequestError('')
            const uid = `${Date.now()}-${(counterRef.current += 1)}`
            const assistantId = `assistant-${uid}`
            const contextLabel = formatContextLabel(scopeMode, selectedStudentUid, mentees)

            const userMsg: ChatMessageModel = {
                id: `user-${uid}`,
                role: 'user',
                content: payload.query,
                contextLabel,
                createdAt: new Date().toISOString(),
            }
            const loadingMsg: ChatMessageModel = {
                id: assistantId,
                role: 'assistant',
                content: '',
                contextLabel,
                createdAt: new Date().toISOString(),
                loading: true,
            }

            setMessages((prev) => [...prev, userMsg, loadingMsg])
            setLoadingMessageId(assistantId)
            setLastPayload(payload)

            const controller = new AbortController()
            abortRef.current = controller

            try {
                const result = await facultyClient.askChatbot(payload, controller.signal)
                const responseText = String(result?.response ?? '').trim()
                const sections = parseStructuredResponse(responseText)

                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantId
                            ? { ...m, loading: false, content: responseText, sections }
                            : m,
                    ),
                )
            } catch (error) {
                if (isAbortError(error)) {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === assistantId
                                ? { ...m, loading: false, error: true, content: 'Response stopped by user.' }
                                : m,
                        ),
                    )
                    return
                }

                const message = toErrorMessage(error)
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantId
                            ? { ...m, loading: false, error: true, content: message }
                            : m,
                    ),
                )
                setRequestError(message)
            } finally {
                abortRef.current = null
                setLoadingMessageId('')
            }
        },
        [mentees, scopeMode, selectedStudentUid],
    )

    const stopResponse = useCallback(() => { abortRef.current?.abort() }, [])

    const regenerate = useCallback(async () => {
        if (!lastPayload || isLoading) return
        await submitPayload(lastPayload)
    }, [isLoading, lastPayload, submitPayload])

    const analysisText =
        scopeMode === 'all'
            ? `Analyzing ${mentees.length} student(s)...`
            : 'Analyzing 1 student...'

    return {
        mentees,
        filteredMentees,
        menteeLoading,
        menteeError,
        scopeMode,
        selectedStudentUid,
        studentSearch,
        messages,
        requestError,
        isLoading,
        analysisText,
        lastPayloadExists: Boolean(lastPayload),
        setScopeMode,
        setSelectedStudentUid,
        setStudentSearch,
        reloadMentees,
        submitPayload,
        stopResponse,
        regenerate,
    }
}
