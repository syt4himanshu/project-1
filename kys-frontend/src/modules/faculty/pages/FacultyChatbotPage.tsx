import { lazy, Suspense, useMemo, useState, type FormEvent } from 'react'
import { useFacultyChat } from '../hooks'
import { formatContextLabel } from '../chatbot/utils/chatFormatters'
import type { ScopeMode } from '../api/types'

const ChatWindow = lazy(() =>
  import('../chatbot/components/ChatWindow').then((m) => ({ default: m.ChatWindow })),
)
const ChatInput = lazy(() =>
  import('../chatbot/components/ChatInput').then((m) => ({ default: m.ChatInput })),
)
const StudentSelector = lazy(() =>
  import('../chatbot/components/StudentSelector').then((m) => ({ default: m.StudentSelector })),
)

function ChatSkeleton() {
  return (
    <div className="faculty-chat__skeleton">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="faculty-chat__skeleton-row" />
      ))}
    </div>
  )
}

export function FacultyChatbotPage() {
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
    [mentees, scopeMode, selectedStudentUid],
  )

  const isStudentSelectionInvalid = scopeMode === 'student' && !selectedStudentUid
  const canSend = Boolean(query.trim()) && !isLoading && !isStudentSelectionInvalid

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = query.trim()
    if (!q || !canSend) return
    setQuery('')
    await submitPayload({
      query: q,
      studentId: scopeMode === 'student' ? selectedStudentUid : undefined,
    })
  }

  return (
    <div className="faculty-chat" data-testid="chatbot-page">
      {/* Sidebar */}
      <aside className={`faculty-chat__sidebar${sidebarOpen ? '' : ' faculty-chat__sidebar--collapsed'}`}>
        <div className="faculty-chat__sidebar-header">
          {sidebarOpen && (
            <span className="faculty-chat__sidebar-title">Student Context</span>
          )}
          <button
            type="button"
            className="button button--ghost faculty-chat__sidebar-toggle"
            onClick={() => setSidebarOpen((p) => !p)}
            aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            {sidebarOpen ? '← Hide' : '→'}
          </button>
        </div>

        {sidebarOpen && (
          <Suspense fallback={<div className="faculty-chat__sidebar-loading" />}>
            <StudentSelector
              scopeMode={scopeMode}
              mentees={mentees}
              filteredMentees={filteredMentees}
              selectedStudentUid={selectedStudentUid}
              studentSearch={studentSearch}
              menteeLoading={menteeLoading}
              menteeError={menteeError}
              onMenteeRetry={reloadMentees}
              onScopeChange={(mode: ScopeMode) => setScopeMode(mode)}
              onStudentSearchChange={setStudentSearch}
              onStudentSelect={setSelectedStudentUid}
            />
          </Suspense>
        )}
      </aside>

      {/* Main chat area */}
      <section className="faculty-chat__main">
        <div className="faculty-chat__header">
          <div>
            <h1 className="faculty-chat__heading">Faculty Insights Chatbot</h1>
            <p className="faculty-chat__subheading">
              Ask mentoring questions and get structured student insights.
            </p>
          </div>
        </div>

        <Suspense fallback={<ChatSkeleton />}>
          <ChatWindow
            messages={messages}
            analysisText={analysisText}
            onPromptClick={setQuery}
          />
        </Suspense>

        <Suspense fallback={null}>
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
        </Suspense>
      </section>
    </div>
  )
}
