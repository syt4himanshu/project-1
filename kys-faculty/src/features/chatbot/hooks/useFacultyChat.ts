import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { askFacultyChatbot, getMentees } from '../../../api/faculty'
import { parseStructuredResponse, toErrorMessage, formatContextLabel } from '../utils/chatFormatters'
import { extractData } from '../../../utils/apiHandler'
import type { ChatMessageModel, ChatPayload, MenteeRow, ScopeMode } from '../types'

interface UseFacultyChatResult {
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
    submitPayload: (payload: ChatPayload) => Promise<void>
    stopResponse: () => void
    regenerate: () => Promise<void>
}

const hasAbortCode = (error: unknown) => (error as { code?: string })?.code === 'ERR_CANCELED'

export const useFacultyChat = (): UseFacultyChatResult => {
    const [mentees, setMentees] = useState<MenteeRow[]>([])
    const [menteeLoading, setMenteeLoading] = useState(true)
    const [menteeError, setMenteeError] = useState('')

    const [scopeMode, setScopeModeState] = useState<ScopeMode>('all')
    const [selectedStudentUid, setSelectedStudentUidState] = useState('')
    const [studentSearch, setStudentSearch] = useState('')

    const [messages, setMessages] = useState<ChatMessageModel[]>([])
    const [requestError, setRequestError] = useState('')
    const [loadingMessageId, setLoadingMessageId] = useState('')
    const [lastPayload, setLastPayload] = useState<ChatPayload | null>(null)

    const abortRef = useRef<AbortController | null>(null)
    const messageCounterRef = useRef(0)

    const reloadMentees = useCallback(async () => {
        setMenteeLoading(true)
        setMenteeError('')

        try {
            const response = await getMentees()
            const data = extractData(response) || response.data;
            const rows = Array.isArray(data) ? (data as MenteeRow[]) : []
            setMentees(rows)
        } catch {
            setMenteeError('Could not load assigned students.')
        } finally {
            setMenteeLoading(false)
        }
    }, [])

    useEffect(() => {
        void reloadMentees()
        return () => {
            abortRef.current?.abort()
        }
    }, [reloadMentees])

    useEffect(() => {
        if (!selectedStudentUid) return
        if (mentees.some((row) => row.uid === selectedStudentUid)) return
        setScopeModeState('all')
        setSelectedStudentUidState('')
    }, [mentees, selectedStudentUid])

    const filteredMentees = useMemo(() => {
        const normalizedSearch = studentSearch.trim().toLowerCase()
        if (!normalizedSearch) return mentees

        return mentees.filter((row) =>
            `${row.full_name} ${row.uid} ${row.semester}`.toLowerCase().includes(normalizedSearch)
        )
    }, [mentees, studentSearch])

    const isLoading = Boolean(loadingMessageId)

    const setScopeMode = useCallback((mode: ScopeMode) => {
        setScopeModeState(mode)
        if (mode === 'all') {
            setSelectedStudentUidState('')
        }
    }, [])

    const setSelectedStudentUid = useCallback((uid: string) => {
        setSelectedStudentUidState(uid)
        setScopeModeState(uid ? 'student' : 'all')
    }, [])

    const submitPayload = useCallback(async (payload: ChatPayload) => {
        setRequestError('')
        const uid = `${Date.now()}-${(messageCounterRef.current += 1)}`
        const assistantMessageId = `assistant-${uid}`

        const contextLabel = formatContextLabel(scopeMode, selectedStudentUid, mentees)

        const userMessage: ChatMessageModel = {
            id: `user-${uid}`,
            role: 'user',
            content: payload.query,
            contextLabel,
            createdAt: new Date().toISOString(),
        }

        const loadingMessage: ChatMessageModel = {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            contextLabel,
            createdAt: new Date().toISOString(),
            loading: true,
        }

        setMessages((prev) => [...prev, userMessage, loadingMessage])
        setLoadingMessageId(assistantMessageId)
        setLastPayload(payload)

        const controller = new AbortController()
        abortRef.current = controller

        try {
            const response = await askFacultyChatbot(payload, controller.signal)
            const data = extractData(response) || response.data;
            const responseText = String(data?.response || '').trim()
            const sections = parseStructuredResponse(responseText)

            setMessages((prev) =>
                prev.map((message) =>
                    message.id === assistantMessageId
                        ? {
                            ...message,
                            loading: false,
                            content: responseText,
                            sections,
                        }
                        : message
                )
            )
        } catch (error) {
            const message = toErrorMessage(error)
            const wasAborted = hasAbortCode(error)

            setMessages((prev) =>
                prev.map((chatMessage) =>
                    chatMessage.id === assistantMessageId
                        ? {
                            ...chatMessage,
                            loading: false,
                            error: true,
                            content: wasAborted ? 'Response stopped by user.' : message,
                        }
                        : chatMessage
                )
            )

            if (!wasAborted) {
                setRequestError(message)
            }
        } finally {
            abortRef.current = null
            setLoadingMessageId('')
        }
    }, [mentees, scopeMode, selectedStudentUid])

    const stopResponse = useCallback(() => {
        abortRef.current?.abort()
    }, [])

    const regenerate = useCallback(async () => {
        if (!lastPayload || isLoading) return
        await submitPayload(lastPayload)
    }, [isLoading, lastPayload, submitPayload])

    const analysisText = scopeMode === 'all'
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
