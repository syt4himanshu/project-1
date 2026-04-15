import { SECTION_ORDER } from '../constants'
import type { MenteeRow, ParsedSections, ScopeMode, SectionKey } from '../types'

const emptySections = (): ParsedSections => ({
    Summary: '',
    'Key Observations': '',
    Concerns: '',
    Suggestions: '',
})

const normalizeSectionKey = (raw: string): SectionKey | null => {
    const key = raw.toLowerCase().trim().replace(':', '')
    if (key === 'summary') return 'Summary'
    if (key === 'key observations' || key === 'observations') return 'Key Observations'
    if (key === 'concerns') return 'Concerns'
    if (key === 'suggestions') return 'Suggestions'
    return null
}

export function parseStructuredResponse(text: string): ParsedSections {
    const lines = String(text || '').split('\n')
    const sections = emptySections()
    let active: SectionKey | null = null

    for (const line of lines) {
        const heading = normalizeSectionKey(line)
        if (heading) {
            active = heading
            continue
        }
        if (active) {
            sections[active] = `${sections[active]}${sections[active] ? '\n' : ''}${line}`.trim()
        }
    }

    const hasStructured = SECTION_ORDER.some((k) => sections[k].trim())
    if (hasStructured) return sections

    return { Summary: text.trim(), 'Key Observations': '', Concerns: '', Suggestions: '' }
}

export function toErrorMessage(error: unknown): string {
    const err = error as { response?: { data?: { error?: string } }; message?: string; status?: number }
    const raw = err?.response?.data?.error || err?.message || 'Could not generate insights right now.'
    const status = typeof err?.status === 'number' ? err.status : null

    if (status === 403 || /forbidden|assigned/i.test(raw)) {
        return 'You can only query students assigned to you.'
    }
    if (status === 429 || /too many requests|rate limit/i.test(raw)) {
        return 'Rate limit reached. Please wait and try again.'
    }
    if (/timeout/i.test(raw)) return 'Request timeout. Try again, or narrow to one student.'
    if (/no student data|no assigned students|not found/i.test(raw))
        return 'Not enough academic or profile data to generate insights.'

    return raw
}

export function formatContextLabel(
    scopeMode: ScopeMode,
    selectedStudentUid: string,
    students: MenteeRow[],
): string {
    if (scopeMode === 'all') return 'All assigned students'
    const student = students.find((s) => s.uid === selectedStudentUid)
    return student ? `Student: ${student.full_name}` : 'All assigned students'
}
