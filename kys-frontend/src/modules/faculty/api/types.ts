// ─── Profile ─────────────────────────────────────────────────────────────────

export interface FacultyProfile {
  first_name: string
  last_name: string
  email: string
  contact_number?: string | null
}

export interface FacultyProfileUpdateInput {
  first_name?: string
  last_name?: string
  contact_number?: string | null
}

// ─── Mentees ─────────────────────────────────────────────────────────────────

export interface MenteeRow {
  id: number
  uid: string
  full_name: string
  photo_url?: string | null
  photo_preview_url?: string | null
  first_name?: string
  middle_name?: string
  last_name?: string
  semester: number
  section?: string
  year_of_admission?: number
}

export interface MenteesPage {
  rows: MenteeRow[]
  limit: number
  offset: number
  /** true when returned rows < limit (signals last page) */
  isLastPage: boolean
}

// ─── Mentee detail ───────────────────────────────────────────────────────────

export interface MenteePayload {
  id: number
  uid: string
  full_name: string
  first_name?: string
  middle_name?: string
  last_name?: string
  semester: number
  section?: string
  year_of_admission?: number
  personal_info?: unknown
  past_education_records?: unknown[]
  post_admission_records?: unknown[]
  projects?: unknown[]
  internships?: unknown[]
  cocurricular_participations?: unknown[]
  cocurricular_organizations?: unknown[]
  skill_programs?: unknown[]
  career_objective?: unknown
  skills?: unknown
  swoc?: unknown
}

// ─── Mentoring minutes ───────────────────────────────────────────────────────

export interface MinuteRow {
  id: number
  semester: number
  date: string
  remarks: string
  mentor_remarks?: string | null
  issues?: string | null
  suggestion?: string | null
  action?: string | null
  created_by_faculty: boolean
}

export interface MenteeMinutesBanner {
  uid?: string
  full_name?: string
  semester?: number
  section?: string
  year_of_admission?: number
}

export interface MenteeMinutesPayload {
  student?: MenteeMinutesBanner
  mentoring_minutes: MinuteRow[]
}

export interface AddMinuteInput {
  remarks: string
  mentor_remarks?: string
  issues?: string
  suggestion?: string
  action?: string
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface MutationResult {
  message: string
}

export interface ChangePasswordInput {
  old_password: string
  new_password: string
}

// ─── Chatbot ─────────────────────────────────────────────────────────────────

export interface ConversationTurn {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatbotRequest {
  query: string
  studentId: string
  conversationHistory?: ConversationTurn[]
}

export interface ChatbotResponse {
  response: string
}

export interface AIRemarksStudentContext {
  uid: string
  name: string
  semester: number
  program?: string
  previousRemarks?: Array<{
    date: string
    remarks: string
    suggestion?: string
    action?: string
  }>
}

export interface AIRemarksRequest {
  query: string
  studentContext: AIRemarksStudentContext
}

export interface AIRemarksResponse {
  content: string
  studentUid: string
  timestamp: string
}

export type SectionKey = 'Student Overview' | 'Strengths & Potential' | 'Areas for Improvement' | 'Faculty Recommendations'

export interface ParsedSections {
  'Student Overview': string
  'Strengths & Potential': string
  'Areas for Improvement': string
  'Faculty Recommendations': string
}

export interface ChatMessageModel {
  id: string
  role: 'user' | 'assistant'
  content: string
  contextLabel: string
  createdAt: string
  /** Parsed structured snapshot — only present on the first response per student */
  sections?: ParsedSections
  /** Direct conversational answer extracted from the first response */
  directAnswer?: string
  /** True if this message carries the pinned student snapshot */
  isSnapshot?: boolean
  loading?: boolean
  error?: boolean
}
