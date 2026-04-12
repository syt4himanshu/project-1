export type ScopeMode = 'all' | 'student'

export type SectionKey = 'Summary' | 'Key Observations' | 'Concerns' | 'Suggestions'

export interface MenteeRow {
    id: number
    uid: string
    full_name: string
    semester: number
}

export interface ParsedSections {
    Summary: string
    'Key Observations': string
    Concerns: string
    Suggestions: string
}

export interface ChatPayload {
    query: string
    studentId?: string
}

export interface ChatMessageModel {
    id: string
    role: 'user' | 'assistant'
    content: string
    contextLabel: string
    createdAt: string
    sections?: ParsedSections
    loading?: boolean
    error?: boolean
}
