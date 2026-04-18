import { lazy, Suspense, useState } from 'react'
import { useFacultyChat } from '../hooks'

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
  useFacultyChat()

  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="faculty-chat" data-testid="chatbot-page">
      <aside className={`faculty-chat__sidebar${sidebarOpen ? '' : ' faculty-chat__sidebar--collapsed'}`}>
        <div className="faculty-chat__sidebar-header">
          {sidebarOpen && <span className="faculty-chat__sidebar-title">Student Context</span>}
          <button
            type="button"
            className="button button--ghost faculty-chat__sidebar-toggle"
            onClick={() => setSidebarOpen((p) => !p)}
            aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            {sidebarOpen ? 'Hide' : 'Show'}
          </button>
        </div>

        {sidebarOpen && (
          <Suspense fallback={<div className="faculty-chat__sidebar-loading" />}>
            <StudentSelector />
          </Suspense>
        )}
      </aside>

      <section className="faculty-chat__main">
        <div className="faculty-chat__header">
          <div>
            <h1 className="faculty-chat__heading">Teacher Insights Chatbot</h1>
            <p className="faculty-chat__subheading">
              Ask mentoring questions and get clear, structured student insights.
            </p>
          </div>
        </div>

        <Suspense fallback={<ChatSkeleton />}>
          <ChatWindow />
        </Suspense>

        <Suspense fallback={null}>
          <ChatInput />
        </Suspense>
      </section>
    </div>
  )
}
