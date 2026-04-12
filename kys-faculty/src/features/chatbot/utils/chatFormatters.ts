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

export const parseStructuredResponse = (text: string): ParsedSections => {
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

    const hasStructuredContent = SECTION_ORDER.some((key) => sections[key].trim())
    if (hasStructuredContent) {
        return sections
    }

    return {
        Summary: text.trim(),
        'Key Observations': '',
        Concerns: '',
        Suggestions: '',
    }
}

export const toErrorMessage = (error: unknown) => {
    const err = error as { response?: { data?: { error?: string } } }
    const raw = err?.response?.data?.error || 'Could not generate insights right now.'

    if (/forbidden|assigned/i.test(raw)) return 'You can only view assigned students.'
    if (/timeout/i.test(raw)) return 'Could not generate insights right now. Try again, or narrow to one student.'
    if (/no student data|no assigned students|not found/i.test(raw)) return 'Not enough academic or profile data to generate insights.'

    return raw
}

export const formatContextLabel = (scopeMode: ScopeMode, selectedStudentUid: string, students: MenteeRow[]) => {
    if (scopeMode === 'all') return 'All assigned students'

    const student = students.find((item) => item.uid === selectedStudentUid)
    return student ? `Student: ${student.full_name}` : 'All assigned students'
}
