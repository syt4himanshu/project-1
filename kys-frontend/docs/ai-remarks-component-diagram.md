# AI Remarks Assistant - Component Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Faculty Mentee Detail Page                │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐                         │
│  │ AI Assistant │  │ Give Remarks │                         │
│  │   Button     │  │    Button    │                         │
│  └──────┬───────┘  └──────────────┘                         │
│         │                                                     │
│         │ onClick                                            │
│         ▼                                                     │
│  ┌─────────────────────────────────────────────────┐        │
│  │         AIRemarksAssistant Component            │        │
│  │                                                  │        │
│  │  Props:                                         │        │
│  │  - open: boolean                                │        │
│  │  - studentContext: StudentContext               │        │
│  │  - onClose: () => void                          │        │
│  │  - onInsert: (remarks, suggestion, action)      │        │
│  │                                                  │        │
│  │  State:                                         │        │
│  │  - messages: Message[]                          │        │
│  │  - input: string                                │        │
│  │  - isLoading: boolean                           │        │
│  │  - error: string | null                         │        │
│  │  - generatedContent: {...} | null               │        │
│  └──────────────────┬──────────────────────────────┘        │
│                     │                                         │
│                     │ API Call                               │
│                     ▼                                         │
└─────────────────────────────────────────────────────────────┘
                      │
                      │ POST /api/faculty/ai-remarks
                      │
┌─────────────────────▼─────────────────────────────────────┐
│                    Backend API Layer                       │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │     faculty.routes.js                            │     │
│  │                                                   │     │
│  │  POST /api/faculty/ai-remarks                    │     │
│  │  - Authentication (verifyToken)                  │     │
│  │  - Authorization (roleRequired: faculty)         │     │
│  │  - Rate Limiting (chatbotRateLimiter)            │     │
│  │  - Validation (express-validator)                │     │
│  └──────────────────┬───────────────────────────────┘     │
│                     │                                       │
│                     ▼                                       │
│  ┌──────────────────────────────────────────────────┐     │
│  │     faculty-ai.controller.js                     │     │
│  │                                                   │     │
│  │  generateAIRemarks()                             │     │
│  │  - Validate request                              │     │
│  │  - Fetch student data                            │     │
│  │  - Enrich context                                │     │
│  │  - Call AI service                               │     │
│  │  - Return response                               │     │
│  └──────────────────┬───────────────────────────────┘     │
│                     │                                       │
│                     ▼                                       │
│  ┌──────────────────────────────────────────────────┐     │
│  │     groq.service.js                              │     │
│  │                                                   │     │
│  │  generateFacultyInsights()                       │     │
│  │  - Build prompt                                  │     │
│  │  - Call Groq API                                 │     │
│  │  - Handle fallbacks                              │     │
│  │  - Return AI response                            │     │
│  └──────────────────┬───────────────────────────────┘     │
│                     │                                       │
└─────────────────────┼───────────────────────────────────────┘
                      │
                      │ API Call
                      ▼
              ┌───────────────┐
              │   Groq API    │
              │  (External)   │
              └───────────────┘
```

## Component Hierarchy

```
FacultyMenteeDetailPage
│
├── Header
│   └── Title + Description
│
├── Student Card
│   ├── Avatar
│   ├── Student Info
│   └── Action Buttons
│       ├── AI Assistant Button ──┐
│       └── Give Remarks Button   │
│                                  │
├── Previous Records              │
│   └── History List              │
│                                  │
├── Remarks Modal                 │
│   └── Form (remarks, suggestion, action)
│                                  │
└── AIRemarksAssistant ◄──────────┘
    │
    ├── Overlay (backdrop)
    │
    └── Popup
        │
        ├── Header
        │   ├── Icon (Sparkles)
        │   ├── Title
        │   ├── Subtitle (student context)
        │   └── Close Button
        │
        ├── Suggestion Chips
        │   ├── Performance Chip
        │   ├── Behavior Chip
        │   ├── Improvement Chip
        │   └── Summary Chip
        │
        ├── Messages Area
        │   ├── Assistant Message (greeting)
        │   ├── User Message
        │   ├── Assistant Message (response)
        │   ├── Loading Indicator
        │   └── Error Message
        │
        ├── Input Form
        │   ├── Text Input
        │   └── Send Button
        │
        └── Action Section
            └── Insert Button
```

## Data Flow

### 1. Opening the Assistant

```
User Click
    │
    ▼
setAiAssistantOpen(true)
    │
    ▼
AIRemarksAssistant renders
    │
    ├─► Focus input
    ├─► Add greeting message
    └─► Display suggestion chips
```

### 2. Sending a Query

```
User Input / Chip Click
    │
    ▼
handleSendMessage(query)
    │
    ├─► Add user message to state
    ├─► Set loading = true
    │
    ▼
fetch('/api/faculty/ai-remarks', {
    query,
    studentContext
})
    │
    ├─► Success
    │   ├─► Parse AI response
    │   ├─► Set generatedContent
    │   ├─► Add assistant message
    │   └─► Set loading = false
    │
    └─► Error
        ├─► Set error message
        ├─► Add error message
        └─► Set loading = false
```

### 3. Inserting Content

```
User clicks "Insert"
    │
    ▼
handleInsertRemarks()
    │
    ├─► Extract generatedContent
    │   ├─► remarks
    │   ├─► suggestion
    │   └─► action
    │
    ▼
onInsert(remarks, suggestion, action)
    │
    ▼
Parent component updates form
    │
    ├─► setRemarks(remarks)
    ├─► setSuggestion(suggestion)
    └─► setActionPlan(action)
    │
    ▼
setAiAssistantOpen(false)
    │
    ▼
Popup closes
```

## State Management

### Component State

```typescript
// AIRemarksAssistant.tsx
const [messages, setMessages] = useState<Message[]>([])
// Stores chat history

const [input, setInput] = useState('')
// Current input value

const [isLoading, setIsLoading] = useState(false)
// API call in progress

const [error, setError] = useState<string | null>(null)
// Error message

const [generatedContent, setGeneratedContent] = useState<{
  remarks: string
  suggestion?: string
  action?: string
} | null>(null)
// Parsed AI response ready for insertion
```

### Parent State

```typescript
// FacultyMenteeDetailPage.tsx
const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
// Controls popup visibility

const [remarks, setRemarks] = useState('')
const [suggestion, setSuggestion] = useState('')
const [actionPlan, setActionPlan] = useState('')
// Form fields that receive inserted content
```

## API Request/Response Flow

### Request Structure

```typescript
POST /api/faculty/ai-remarks

Headers:
  Content-Type: application/json
  Cookie: auth_token=...

Body:
{
  query: string,              // User's question/request
  studentContext: {
    uid: string,              // Student identifier
    name: string,             // Full name
    semester: number,         // Current semester
    program: string,          // Degree program
    previousRemarks?: [{      // Recent mentoring history
      date: string,
      remarks: string,
      suggestion?: string,
      action?: string
    }]
  }
}
```

### Response Structure

```typescript
Success (200):
{
  success: true,
  data: {
    content: string,          // AI-generated text
    studentUid: string,       // Echo back for verification
    timestamp: string         // ISO 8601 timestamp
  }
}

Error (400/500):
{
  success: false,
  error: string,              // Error message
  message: string             // User-friendly message
}
```

## Event Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Actions                          │
└───────┬─────────────────────────────────────────────────┘
        │
        ├─► Click "AI Assistant"
        │   └─► Open popup
        │
        ├─► Click suggestion chip
        │   ├─► Send predefined query
        │   └─► Show loading
        │
        ├─► Type custom query
        │   ├─► Update input state
        │   └─► Enable send button
        │
        ├─► Click send / Press Enter
        │   ├─► Send query to API
        │   ├─► Show loading
        │   └─► Display response
        │
        ├─► Click "Insert"
        │   ├─► Fill parent form
        │   └─► Close popup
        │
        ├─► Click close / Press Escape
        │   └─► Close popup
        │
        └─► Click backdrop
            └─► Close popup
```

## Error Handling Flow

```
API Call
    │
    ├─► Network Error
    │   ├─► Catch in try/catch
    │   ├─► Set error state
    │   ├─► Display error message
    │   └─► Keep popup open
    │
    ├─► Validation Error (400)
    │   ├─► Parse error response
    │   ├─► Display specific message
    │   └─► Keep popup open
    │
    ├─► Auth Error (401)
    │   ├─► Redirect to login
    │   └─► Close popup
    │
    ├─► Rate Limit (429)
    │   ├─► Display "Too many requests"
    │   └─► Suggest retry later
    │
    └─► Server Error (500)
        ├─► Display generic error
        ├─► Log to console
        └─► Keep popup open
```

## Accessibility Flow

```
Keyboard Navigation
    │
    ├─► Tab
    │   ├─► Focus chips
    │   ├─► Focus input
    │   ├─► Focus send button
    │   └─► Focus insert button
    │
    ├─► Enter
    │   ├─► On chip: Send query
    │   ├─► On input: Submit form
    │   └─► On button: Activate
    │
    ├─► Escape
    │   └─► Close popup
    │
    └─► Screen Reader
        ├─► Announce dialog open
        ├─► Read header content
        ├─► Announce messages
        └─► Announce state changes
```

## Performance Optimization

```
Component Lifecycle
    │
    ├─► Mount
    │   ├─► Minimal initial render
    │   ├─► Focus input
    │   └─► Add greeting message
    │
    ├─► Update
    │   ├─► Memoize message list
    │   ├─► Auto-scroll to bottom
    │   └─► Update button states
    │
    └─► Unmount
        ├─► Clear event listeners
        ├─► Reset body overflow
        └─► Clean up state
```

## Integration Points

```
┌─────────────────────────────────────────────────────────┐
│              External Dependencies                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  React 19.2.4                                           │
│  ├─► useState, useEffect, useRef                        │
│  └─► FormEvent, ReactNode types                         │
│                                                          │
│  lucide-react 1.8.0                                     │
│  ├─► Sparkles (header icon)                            │
│  ├─► Send (send button)                                │
│  ├─► Loader2 (loading state)                           │
│  ├─► AlertCircle (error state)                         │
│  └─► CheckCircle2 (insert button)                      │
│                                                          │
│  Fetch API                                              │
│  └─► POST /api/faculty/ai-remarks                      │
│                                                          │
│  CSS Modules                                            │
│  └─► AIRemarksAssistant.css                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Summary

The AI Remarks Assistant is a **self-contained, reusable component** with:

- ✅ Clear component hierarchy
- ✅ Unidirectional data flow
- ✅ Proper state management
- ✅ Comprehensive error handling
- ✅ Accessibility support
- ✅ Performance optimizations
- ✅ Clean integration points

**Ready for production use!** 🚀
