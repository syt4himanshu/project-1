import { FormEvent, useMemo, useState } from 'react'
import type { ScopeMode } from '../types'
import { formatContextLabel } from '../utils/chatFormatters'
import { useFacultyChat } from '../hooks/useFacultyChat'
import { StudentSelector } from './StudentSelector'
import { ChatWindow } from './ChatWindow'
import { ChatInput } from './ChatInput'

export function FacultyChatPage() {
    const {
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
        lastPayloadExists,
        setScopeMode,
        setSelectedStudentUid,
        setStudentSearch,
        reloadMentees,
        submitPayload,
        stopResponse,
        regenerate,
    } = useFacultyChat()

    const [query, setQuery] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const contextLabel = useMemo(
        () => formatContextLabel(scopeMode, selectedStudentUid, mentees),
        [mentees, scopeMode, selectedStudentUid]
    )

    const isStudentSelectionInvalid = scopeMode === 'student' && !selectedStudentUid

    const canSend = Boolean(query.trim()) && !isLoading && !isStudentSelectionInvalid

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const normalizedQuery = query.trim()
        if (!normalizedQuery || !canSend) return

        const payload = {
            query: normalizedQuery,
            studentId: scopeMode === 'student' ? selectedStudentUid : undefined,
        }

        setQuery('')
        await submitPayload(payload)
    }

    const handlePromptClick = (prompt: string) => {
        setQuery(prompt)
    }

    const handleScopeChange = (mode: ScopeMode) => {
        setScopeMode(mode)
    }

    const handleStudentSelect = (uid: string) => {
        setSelectedStudentUid(uid)
    }

    return (
        <div className="h-[calc(100vh-3rem)] min-h-[620px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm flex flex-col lg:flex-row">
            <aside className={`${sidebarOpen ? 'w-full lg:w-80' : 'w-full lg:w-14'} border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 transition-all duration-200 flex-shrink-0 bg-gray-50/70 dark:bg-gray-900/50`}>
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    {sidebarOpen ? (
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Student Context</h2>
                    ) : (
                        <span className="sr-only">Expand student panel</span>
                    )}
                    <button
                        type="button"
                        onClick={() => setSidebarOpen((prev) => !prev)}
                        className="text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                    >
                        {sidebarOpen ? 'Hide' : 'Show'}
                    </button>
                </div>

                {sidebarOpen && (
                    <StudentSelector
                        scopeMode={scopeMode}
                        mentees={mentees}
                        filteredMentees={filteredMentees}
                        selectedStudentUid={selectedStudentUid}
                        studentSearch={studentSearch}
                        menteeLoading={menteeLoading}
                        menteeError={menteeError}
                        onMenteeRetry={reloadMentees}
                        onScopeChange={handleScopeChange}
                        onStudentSearchChange={setStudentSearch}
                        onStudentSelect={handleStudentSelect}
                    />
                )}
            </aside>

            <section className="flex-1 flex flex-col min-h-0">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Faculty Insights Chatbot</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ask mentoring questions and get structured student insights.</p>
                </div>

                <ChatWindow
                    messages={messages}
                    analysisText={analysisText}
                    onPromptClick={handlePromptClick}
                />

                <ChatInput
                    query={query}
                    contextLabel={contextLabel}
                    requestError={requestError}
                    isLoading={isLoading}
                    canSend={canSend}
                    isStudentSelectionInvalid={isStudentSelectionInvalid}
                    hasLastPayload={lastPayloadExists}
                    onQueryChange={setQuery}
                    onSubmit={handleSubmit}
                    onStop={stopResponse}
                    onRegenerate={regenerate}
                />
            </section>
        </div>
    )
}
