import { renderHook, act, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StoreProvider } from '../../app/store/StoreProvider'
import { useFacultyChat } from '../../modules/faculty/hooks/useFacultyChat'
import { facultyClient } from '../../modules/faculty/api/client'
import { HttpError } from '../../shared/api/httpClient'
import { createAppStore } from '../../app/store'
import { CHATBOT_AI_UNAVAILABLE_MESSAGE } from '../../modules/faculty/chatbot/utils/chatErrorMapper'

// Mock the faculty API client
vi.mock('../../modules/faculty/api/client', () => ({
    facultyClient: {
        getMentees: vi.fn(),
        askChatbot: vi.fn(),
    },
}))

const mockMentees = [
    { id: 1, uid: 'S001', full_name: 'Alice Smith', semester: 3 },
    { id: 2, uid: 'S002', full_name: 'Bob Jones', semester: 5 },
]

const FIRST_RESPONSE = [
    'Direct Answer:',
    'Alice is performing well with a CGPA of 8.1.',
    '',
    'Student Overview:',
    'Semester 3, B.Tech CSE.',
    '',
    'Strengths & Potential:',
    'Strong in Python.',
    '',
    'Areas for Improvement:',
    'Needs more projects.',
    '',
    'Faculty Recommendations:',
    'Work on DSA problems.',
].join('\n')

function createWrapper() {
    const store = createAppStore()

    return function Wrapper({ children }: { children: ReactNode }) {
        return <StoreProvider store={store}>{children}</StoreProvider>
    }
}

describe('useFacultyChat', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        vi.mocked(facultyClient.getMentees).mockResolvedValue(mockMentees)
    })

    it('loads mentees on mount', async () => {
        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })

        expect(result.current.menteeLoading).toBe(true)

        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        expect(result.current.mentees).toHaveLength(2)
        expect(result.current.mentees[0].full_name).toBe('Alice Smith')
    })

    it('starts with no student selected', async () => {
        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        expect(result.current.selectedStudentUid).toBe('')
        expect(result.current.isStudentSelectionInvalid).toBe(true)
    })

    it('selects a student by uid', async () => {
        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setSelectedStudentUid('S001') })

        expect(result.current.selectedStudentUid).toBe('S001')
        expect(result.current.isStudentSelectionInvalid).toBe(false)
    })

    it('clears messages when a different student is selected', async () => {
        vi.mocked(facultyClient.askChatbot).mockResolvedValue({ response: FIRST_RESPONSE })

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setSelectedStudentUid('S001') })
        await act(async () => {
            await result.current.submitPayload({ query: 'Analyze student', studentId: 'S001' })
        })

        expect(result.current.messages.length).toBeGreaterThan(0)

        // Switch to a different student — messages should reset
        act(() => { result.current.setSelectedStudentUid('S002') })
        expect(result.current.messages).toHaveLength(0)
    })

    it('filters mentees by search query', async () => {
        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setStudentSearch('alice') })

        expect(result.current.filteredMentees).toHaveLength(1)
        expect(result.current.filteredMentees[0].uid).toBe('S001')
    })

    it('first response produces isSnapshot message with directAnswer and sections', async () => {
        vi.mocked(facultyClient.askChatbot).mockResolvedValue({ response: FIRST_RESPONSE })

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setSelectedStudentUid('S001') })

        await act(async () => {
            await result.current.submitPayload({ query: 'Analyze student', studentId: 'S001' })
        })

        const assistantMsg = result.current.messages.find((m) => m.role === 'assistant')
        expect(assistantMsg?.isSnapshot).toBe(true)
        expect(assistantMsg?.directAnswer).toContain('CGPA of 8.1')
        expect(assistantMsg?.sections?.['Student Overview']).toContain('Semester 3')
        expect(assistantMsg?.sections?.['Strengths & Potential']).toContain('Python')
    })

    it('follow-up response produces plain content with no sections', async () => {
        vi.mocked(facultyClient.askChatbot)
            .mockResolvedValueOnce({ response: FIRST_RESPONSE })
            .mockResolvedValueOnce({ response: 'Here is the rewritten remark.' })

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setSelectedStudentUid('S001') })

        await act(async () => {
            await result.current.submitPayload({ query: 'Analyze student', studentId: 'S001' })
        })
        await act(async () => {
            await result.current.submitPayload({ query: 'Rewrite professionally', studentId: 'S001' })
        })

        const msgs = result.current.messages.filter((m) => m.role === 'assistant')
        expect(msgs).toHaveLength(2)
        expect(msgs[0].isSnapshot).toBe(true)
        expect(msgs[1].isSnapshot).toBeUndefined()
        expect(msgs[1].sections).toBeUndefined()
        expect(msgs[1].content).toBe('Here is the rewritten remark.')
    })

    it('second askChatbot call includes conversationHistory', async () => {
        vi.mocked(facultyClient.askChatbot)
            .mockResolvedValueOnce({ response: FIRST_RESPONSE })
            .mockResolvedValueOnce({ response: 'Follow-up answer.' })

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setSelectedStudentUid('S001') })

        await act(async () => {
            await result.current.submitPayload({ query: 'First query', studentId: 'S001' })
        })
        await act(async () => {
            await result.current.submitPayload({ query: 'Follow-up query', studentId: 'S001' })
        })

        const secondCall = vi.mocked(facultyClient.askChatbot).mock.calls[1][0]
        expect(secondCall.conversationHistory).toBeDefined()
        expect(secondCall.conversationHistory?.length).toBeGreaterThan(0)
    })

    it('sets contextLabel to student name when student is selected', async () => {
        vi.mocked(facultyClient.askChatbot).mockResolvedValue({ response: FIRST_RESPONSE })

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setSelectedStudentUid('S001') })

        await act(async () => {
            await result.current.submitPayload({ query: 'Test', studentId: 'S001' })
        })

        expect(result.current.messages[0].contextLabel).toBe('Mentee: Alice Smith')
    })

    it('maps 403 error to user-safe message', async () => {
        vi.mocked(facultyClient.askChatbot).mockRejectedValue(
            new HttpError('Forbidden', 403, null),
        )

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setSelectedStudentUid('S001') })

        await act(async () => {
            await result.current.submitPayload({ query: 'Test', studentId: 'S001' })
        })

        const assistantMsg = result.current.messages.find((m) => m.role === 'assistant')
        expect(assistantMsg?.error).toBe(true)
        expect(assistantMsg?.content).toMatch(/only query students assigned/i)
        expect(result.current.requestError).toMatch(/only query students assigned/i)
    })

    it('maps 429 error to rate-limit message', async () => {
        vi.mocked(facultyClient.askChatbot).mockRejectedValue(
            new HttpError('Too many chatbot requests. Please retry shortly.', 429, null),
        )

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setSelectedStudentUid('S001') })

        await act(async () => {
            await result.current.submitPayload({ query: 'Test', studentId: 'S001' })
        })

        const assistantMsg = result.current.messages.find((m) => m.role === 'assistant')
        expect(assistantMsg?.content).toMatch(/rate limit/i)
        expect(assistantMsg?.content).not.toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
    })

    it('maps circuit-breaker-open errors to the safe AI message and logs technical detail', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        vi.mocked(facultyClient.askChatbot).mockRejectedValue(
            new HttpError('Circuit breaker is OPEN for groq-api', 500, { code: 'AI_UNAVAILABLE' }),
        )

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setSelectedStudentUid('S001') })

        await act(async () => {
            await result.current.submitPayload({ query: 'Test', studentId: 'S001' })
        })

        const assistantMsg = result.current.messages.find((m) => m.role === 'assistant')
        expect(assistantMsg?.error).toBe(true)
        expect(assistantMsg?.content).toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
        expect(result.current.requestError).toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
        expect(assistantMsg?.content).not.toMatch(/circuit breaker|groq/i)
        expect(consoleSpy).toHaveBeenCalledWith(
            '[faculty-chatbot] request failed',
            expect.objectContaining({
                message: 'Circuit breaker is OPEN for groq-api',
                code: 'AI_UNAVAILABLE',
            }),
        )
        expect(result.current.lastPayloadExists).toBe(true)

        consoleSpy.mockRestore()
    })

    it('allows regenerate after a mapped AI failure', async () => {
        vi.mocked(facultyClient.askChatbot)
            .mockRejectedValueOnce(
                new HttpError('Circuit breaker is OPEN for groq-api', 500, null),
            )
            .mockResolvedValueOnce({ response: FIRST_RESPONSE })

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setSelectedStudentUid('S001') })

        await act(async () => {
            await result.current.submitPayload({ query: 'Analyze student', studentId: 'S001' })
        })

        expect(result.current.requestError).toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
        expect(result.current.lastPayloadExists).toBe(true)

        await act(async () => {
            await result.current.regenerate()
        })

        const assistantMsgs = result.current.messages.filter((m) => m.role === 'assistant')
        const latestAssistant = assistantMsgs[assistantMsgs.length - 1]
        expect(latestAssistant?.error).toBeFalsy()
        expect(latestAssistant?.content).toContain('CGPA of 8.1')
        expect(result.current.requestError).toBe('')
    })

    it('maps generic 500 errors to the safe AI unavailable message', async () => {
        vi.mocked(facultyClient.askChatbot).mockRejectedValue(
            new HttpError('Internal server error', 500, null),
        )

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setSelectedStudentUid('S001') })

        await act(async () => {
            await result.current.submitPayload({ query: 'Test', studentId: 'S001' })
        })

        const assistantMsg = result.current.messages.find((m) => m.role === 'assistant')
        expect(assistantMsg?.content).toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
        expect(assistantMsg?.content).not.toMatch(/internal server error/i)
    })

    it('maps raw provider timeout text to the safe AI unavailable message', async () => {
        vi.mocked(facultyClient.askChatbot).mockRejectedValue(
            new HttpError('Request timed out. Try again, or narrow to one student.', 408, null),
        )

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setSelectedStudentUid('S001') })

        await act(async () => {
            await result.current.submitPayload({ query: 'Test', studentId: 'S001' })
        })

        const assistantMsg = result.current.messages.find((m) => m.role === 'assistant')
        expect(assistantMsg?.content).toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
        expect(assistantMsg?.content).not.toMatch(/timeout/i)
    })

    it('never surfaces raw ReferenceError text in the chat UI', async () => {
        vi.mocked(facultyClient.askChatbot).mockRejectedValue(
            new HttpError('ReferenceError: cleanAndValidateResponse is not defined', 500, null),
        )

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setSelectedStudentUid('S001') })

        await act(async () => {
            await result.current.submitPayload({ query: 'Test', studentId: 'S001' })
        })

        const assistantMsg = result.current.messages.find((m) => m.role === 'assistant')
        expect(assistantMsg?.content).toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
        expect(assistantMsg?.content).not.toMatch(/referenceerror/i)
    })

    it('marks lastPayloadExists after first submit', async () => {
        vi.mocked(facultyClient.askChatbot).mockResolvedValue({ response: FIRST_RESPONSE })

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        expect(result.current.lastPayloadExists).toBe(false)

        act(() => { result.current.setSelectedStudentUid('S001') })

        await act(async () => {
            await result.current.submitPayload({ query: 'Test', studentId: 'S001' })
        })

        expect(result.current.lastPayloadExists).toBe(true)
    })

    it('sets menteeError when mentee load fails', async () => {
        vi.mocked(facultyClient.getMentees).mockRejectedValue(new Error('Network error'))

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        expect(result.current.menteeError).toBe('Could not load assigned students.')
        expect(result.current.mentees).toHaveLength(0)
    })

    it('analysisText is set when student is selected', async () => {
        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        expect(result.current.analysisText).toBe('')

        act(() => { result.current.setSelectedStudentUid('S001') })
        expect(result.current.analysisText).toBe('Analyzing mentee profile...')
    })
})
