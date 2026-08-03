import type { SectionKey } from '../api/types'

export interface QuickPrompt {
    label: string
    text: string
}

export const QUICK_PROMPTS: QuickPrompt[] = [
    {
        label: 'Comprehensive Faculty Remarks',
        text: 'Generate professional semester-end mentoring remarks for this student. Highlight strengths, identify improvement areas, and maintain a constructive and encouraging tone suitable for official faculty records.',
    },
    {
        label: 'Personalized Improvement Plan',
        text: "Analyze the student's academic performance, technical skills, communication, attendance, projects, certifications, internships, and overall profile. Recommend the top priority improvements that will have the greatest impact over the next semester.",
    },
    {
        label: 'Placement Readiness Assessment',
        text: 'Evaluate how prepared the student is for campus placements. Identify strengths, skill gaps, missing projects, DSA readiness, aptitude, communication, resume quality, internships, certifications, and suggest a roadmap to become placement-ready.',
    },
    {
        label: '90-Day Action Plan',
        text: 'Create a realistic 90-day action plan for this student covering academics, technical learning, coding practice, projects, internships, communication skills, certifications, career preparation, and measurable weekly goals.',
    },
]

export const SECTION_ORDER: SectionKey[] = [
    'Student Overview',
    'Strengths & Potential',
    'Areas for Improvement',
    'Faculty Recommendations',
]

/** Triggers a full snapshot refresh even mid-conversation */
export const SNAPSHOT_REFRESH_PHRASES = [
    'refresh insights',
    'analyze student again',
    'regenerate student profile',
]
