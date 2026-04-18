import { renderHook, act, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { StoreProvider } from '../../app/store/StoreProvider'
import { useFacultyChat } from '../../modules/faculty/hooks/useFacultyChat'
import { facultyClient } from '../../modules/faculty/api/client'
import { HttpError } from '../../shared/api/httpClient'
import { createAppStore } from '../../app/store'

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

    it('starts with all-scope mode', async () => {
        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        expect(result.current.scopeMode).toBe('all')
        expect(result.current.selectedStudentUid).toBe('')
    })

    it('switches scope to student when uid is selected', async () => {
        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setSelectedStudentUid('S001') })

        expect(result.current.scopeMode).toBe('student')
        expect(result.current.selectedStudentUid).toBe('S001')
    })

    it('clears student uid when scope set back to all', async () => {
        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setSelectedStudentUid('S001') })
        act(() => { result.current.setScopeMode('all') })

        expect(result.current.selectedStudentUid).toBe('')
    })

    it('filters mentees by search query', async () => {
        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setStudentSearch('alice') })

        expect(result.current.filteredMentees).toHaveLength(1)
        expect(result.current.filteredMentees[0].uid).toBe('S001')
    })

    it('submits a payload and appends user + assistant messages', async () => {
        vi.mocked(facultyClient.askChatbot).mockResolvedValue({ response: 'Summary\nAll good.' })

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        await act(async () => {
            await result.current.submitPayload({ query: 'How are my mentees?' })
        })

        expect(result.current.messages).toHaveLength(2)
        expect(result.current.messages[0].role).toBe('user')
        expect(result.current.messages[0].content).toBe('How are my mentees?')
        expect(result.current.messages[1].role).toBe('assistant')
        expect(result.current.messages[1].loading).toBe(false)
    })

    it('sets contextLabel to "All assigned students" for all-scope', async () => {
        vi.mocked(facultyClient.askChatbot).mockResolvedValue({ response: 'OK' })

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        await act(async () => {
            await result.current.submitPayload({ query: 'Test' })
        })

        expect(result.current.messages[0].contextLabel).toBe('All assigned students')
    })

    it('sets contextLabel to student name for student-scope', async () => {
        vi.mocked(facultyClient.askChatbot).mockResolvedValue({ response: 'OK' })

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        act(() => { result.current.setSelectedStudentUid('S001') })

        await act(async () => {
            await result.current.submitPayload({ query: 'Test', studentId: 'S001' })
        })

        expect(result.current.messages[0].contextLabel).toBe('Student: Alice Smith')
    })

    it('maps 403 error to user-safe message', async () => {
        vi.mocked(facultyClient.askChatbot).mockRejectedValue(
            new HttpError('Forbidden', 403, null),
        )

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        await act(async () => {
            await result.current.submitPayload({ query: 'Test' })
        })

        const assistantMsg = result.current.messages.find((m) => m.role === 'assistant')
        expect(assistantMsg?.error).toBe(true)
        expect(assistantMsg?.content).toMatch(/only query students assigned/i)
        expect(result.current.requestError).toMatch(/only query students assigned/i)
    })

    it('maps 429 error to rate-limit message', async () => {
        vi.mocked(facultyClient.askChatbot).mockRejectedValue(
            new HttpError('Too many requests', 429, null),
        )

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        await act(async () => {
            await result.current.submitPayload({ query: 'Test' })
        })

        const assistantMsg = result.current.messages.find((m) => m.role === 'assistant')
        expect(assistantMsg?.content).toMatch(/rate limit/i)
    })

    it('marks lastPayloadExists after first submit', async () => {
        vi.mocked(facultyClient.askChatbot).mockResolvedValue({ response: 'OK' })

        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        expect(result.current.lastPayloadExists).toBe(false)

        await act(async () => {
            await result.current.submitPayload({ query: 'Test' })
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

    it('analysisText reflects scope mode', async () => {
        const { result } = renderHook(() => useFacultyChat(), { wrapper: createWrapper() })
        await waitFor(() => expect(result.current.menteeLoading).toBe(false))

        expect(result.current.analysisText).toMatch(/Analyzing 2 student/)

        act(() => { result.current.setSelectedStudentUid('S001') })
        expect(result.current.analysisText).toBe('Analyzing 1 student...')
    })
})
