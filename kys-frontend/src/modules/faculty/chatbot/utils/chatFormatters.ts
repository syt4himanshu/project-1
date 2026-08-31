import { SECTION_ORDER, SNAPSHOT_REFRESH_PHRASES } from '../constants'
import type { MenteeRow, ParsedSections, SectionKey } from '../types'

const emptySections = (): ParsedSections => ({
    'Student Overview': '',
    'Strengths & Potential': '',
    'Areas for Improvement': '',
    'Faculty Recommendations': '',
})

const normalizeSectionKey = (raw: string): SectionKey | null => {
    const key = raw
        .toLowerCase()
        .replace(/^[\s>*#\-\d.)(]+/, '')
        .replace(/[*_`]+/g, '')
        .trim()
        .replace(/:$/, '')

    // New dashboard labels (primary)
    if (key === 'student overview' || key === 'summary' || key === 'overview') return 'Student Overview'
    if (
        key === 'strengths & potential' ||
        key === 'strengths and potential' ||
        key === 'key observations' ||
        key === 'observations' ||
        key === 'performance overview' ||
        key === 'strengths'
    ) return 'Strengths & Potential'
    if (
        key === 'areas for improvement' ||
        key === 'concerns' ||
        key === 'risk areas' ||
        key === 'risks' ||
        key === 'improvement areas'
    ) return 'Areas for Improvement'
    if (
        key === 'faculty recommendations' ||
        key === 'suggestions' ||
        key === 'recommendations' ||
        key === 'actionable advice'
    ) return 'Faculty Recommendations'

    return null
}

/**
 * Parses the full AI text into section buckets.
 * Returns null if no structured sections are found (follow-up conversational response).
 */
function parseSections(text: string): ParsedSections | null {
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
    return hasStructured ? sections : null
}

/**
 * Parses the first AI response which contains both a "Direct Answer:" block
 * and the four structured snapshot sections.
 *
 * Returns:
 *   directAnswer — the conversational answer to the faculty's question
 *   sections     — the four snapshot cards (null if not present)
 */
export function parseFirstResponse(text: string): {
    directAnswer: string
    sections: ParsedSections | null
} {
    const raw = String(text || '').trim()

    // Extract the Direct Answer block
    const directAnswerMatch = raw.match(
        /Direct Answer\s*:?\s*\n([\s\S]*?)(?=\n\s*(?:Student Overview|Strengths & Potential|Strengths and Potential|Areas for Improvement|Faculty Recommendations|Summary|Key Observations|Concerns|Suggestions)\s*:?\s*\n|$)/i,
    )
    const directAnswer = directAnswerMatch ? directAnswerMatch[1].trim() : ''

    // Parse snapshot sections from the full text
    const sections = parseSections(raw)

    // If there's no direct answer prefix, treat the whole text as a direct answer
    if (!directAnswer && !sections) {
        return { directAnswer: raw, sections: null }
    }

    // If we have sections but no explicit direct answer, use first non-section content
    if (!directAnswer && sections) {
        const firstSectionIdx = raw.search(
            /\n\s*(?:Student Overview|Strengths & Potential|Strengths and Potential|Areas for Improvement|Faculty Recommendations|Summary|Key Observations|Concerns|Suggestions)\s*:?\s*\n/i,
        )
        const before = firstSectionIdx > 0 ? raw.slice(0, firstSectionIdx).trim() : ''
        return { directAnswer: before, sections }
    }

    return { directAnswer, sections }
}

/**
 * Parses a follow-up response — always plain conversational text.
 */
export function parseFollowUpResponse(text: string): string {
    return String(text || '').trim()
}

/**
 * Legacy shim — used by tests and regenerate flow.
 * Returns sections if structured, otherwise puts everything in Student Overview.
 */
export function parseStructuredResponse(text: string): ParsedSections {
    const sections = parseSections(text)
    if (sections) return sections
    return {
        'Student Overview': text.trim(),
        'Strengths & Potential': '',
        'Areas for Improvement': '',
        'Faculty Recommendations': '',
    }
}

export function formatContextLabel(
    selectedStudentUid: string,
    students: MenteeRow[],
): string {
    const student = students.find((s) => s.uid === selectedStudentUid)
    return student ? `Mentee: ${student.full_name}` : 'No mentee selected'
}

/** Returns true if the query should trigger a full snapshot refresh */
export function isSnapshotRefreshQuery(query: string): boolean {
    const normalized = query.toLowerCase().trim()
    return SNAPSHOT_REFRESH_PHRASES.some((phrase) => normalized.includes(phrase))
}
