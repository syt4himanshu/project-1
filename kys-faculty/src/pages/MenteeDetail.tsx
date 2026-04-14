import { FormEvent, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { addMentoringMinute, getMentee, getMenteeMinutes } from '../api/faculty'
import DataPanel, { ArraySection, ObjectSection } from '../components/DataPanel'

function formatDate(iso: string) {
    try {
        return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
        return iso
    }
}

interface MinuteRow {
    id: number
    semester: number
    date: string
    remarks: string
    suggestion?: string | null
    action?: string | null
    created_by_faculty: boolean
}

interface MenteePayload {
    id: number
    uid: string
    full_name: string
    semester: number
    section?: string
    year_of_admission?: number
    personal_info?: unknown
    past_education_records?: unknown
    post_admission_records?: unknown
    projects?: unknown
    internships?: unknown
    cocurricular_participations?: unknown
    cocurricular_organizations?: unknown
    skill_programs?: unknown
    career_objective?: unknown
    skills?: unknown
    swoc?: unknown
}

export default function MenteeDetail() {
    const { uid } = useParams<{ uid: string }>()
    const [mentee, setMentee] = useState<MenteePayload | null>(null)
    const [minutes, setMinutes] = useState<MinuteRow[]>([])
    const [studentBanner, setStudentBanner] = useState<{ full_name?: string; semester?: number; section?: string } | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [remarks, setRemarks] = useState('')
    const [suggestion, setSuggestion] = useState('')
    const [action, setAction] = useState('')
    const [saving, setSaving] = useState(false)
    const [saveMsg, setSaveMsg] = useState('')

    const load = () => {
        if (!uid) return
        setLoading(true)
        setError('')
        Promise.all([getMentee(uid), getMenteeMinutes(uid)])
            .then(([mRes, minRes]) => {
                setMentee(mRes.data as MenteePayload)
                setMinutes((minRes.data?.mentoring_minutes as MinuteRow[]) || [])
                setStudentBanner(minRes.data?.student || null)
            })
            .catch(() => setError('Could not load mentee (check assignment or UID).'))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        load()
    }, [uid])

    const handleAddMinute = async (e: FormEvent) => {
        e.preventDefault()
        if (!uid || !remarks.trim()) return
        setSaving(true)
        setSaveMsg('')
        try {
            await addMentoringMinute(uid, {
                remarks: remarks.trim(),
                suggestion: suggestion.trim() || undefined,
                action: action.trim() || undefined,
            })
            setRemarks('')
            setSuggestion('')
            setAction('')
            setSaveMsg('Mentoring minute saved.')
            const minRes = await getMenteeMinutes(uid)
            setMinutes((minRes.data?.mentoring_minutes as MinuteRow[]) || [])
        } catch {
            setSaveMsg('Could not save. Try again.')
        } finally {
            setSaving(false)
        }
    }

    if (!uid) {
        return <p className="text-red-500">Invalid link</p>
    }

    if (loading) {
        return <p className="text-gray-500 dark:text-gray-400">Loading mentee…</p>
    }

    if (error || !mentee) {
        return (
            <div className="space-y-4">
                <p className="text-red-500">{error || 'Not found'}</p>
                <Link to="/mentees" className="text-indigo-600 dark:text-indigo-400 font-medium">← Back to mentees</Link>
            </div>
        )
    }

    const bannerName = studentBanner?.full_name || mentee.full_name

    return (
        <div className="max-w-5xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Link to="/mentees" className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">← My Mentees</Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{bannerName}</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 font-mono text-sm">UID {mentee.uid}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Semester {studentBanner?.semester ?? mentee.semester}
                        {(studentBanner?.section ?? mentee.section) ? ` · Section ${studentBanner?.section ?? mentee.section}` : ''}
                        {mentee.year_of_admission != null ? ` · Admitted ${mentee.year_of_admission}` : ''}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <DataPanel title="Add mentoring minute">
                    <form onSubmit={handleAddMinute} className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Remarks *</label>
                            <textarea
                                required
                                rows={3}
                                value={remarks}
                                onChange={e => setRemarks(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                                placeholder="Session notes, concerns, progress…"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Suggestion</label>
                            <textarea
                                rows={2}
                                value={suggestion}
                                onChange={e => setSuggestion(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Action</label>
                            <textarea
                                rows={2}
                                value={action}
                                onChange={e => setAction(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        {saveMsg && <p className={`text-sm ${saveMsg.includes('saved') ? 'text-green-600' : 'text-red-500'}`}>{saveMsg}</p>}
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg"
                        >
                            {saving ? 'Saving…' : 'Save minute'}
                        </button>
                    </form>
                </DataPanel>

                <DataPanel title="Mentoring history">
                    {minutes.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No minutes yet.</p>
                    ) : (
                        <ul className="space-y-4 max-h-[28rem] overflow-y-auto pr-1">
                            {minutes.map((m) => (
                                <li key={m.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                                    <div className="flex justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <span>{formatDate(m.date)}</span>
                                        <span>Sem {m.semester}{m.created_by_faculty ? ' · You' : ''}</span>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{m.remarks}</p>
                                    {m.suggestion && <p className="mt-2 text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">Suggestion:</span> {m.suggestion}</p>}
                                    {m.action && <p className="mt-1 text-sm text-gray-600 dark:text-gray-300"><span className="font-medium">Action:</span> {m.action}</p>}
                                </li>
                            ))}
                        </ul>
                    )}
                </DataPanel>
            </div>

            <h2 className="text-lg font-semibold text-gray-900 dark:text-white pt-2">KYS profile data</h2>
            <div className="grid gap-4 md:grid-cols-2">
                <ObjectSection title="Personal information" obj={mentee.personal_info} />
                <ObjectSection title="Career objective" obj={mentee.career_objective} />
                <ObjectSection title="Skills" obj={mentee.skills} />
                <ObjectSection title="SWOC" obj={mentee.swoc} />
                <div className="md:col-span-2">
                    <ArraySection title="Past education" rows={mentee.past_education_records} rowTitle={(row) => String(row.exam_name || 'Record')} />
                </div>
                <div className="md:col-span-2">
                    <ArraySection title="Post-admission academics" rows={mentee.post_admission_records} rowTitle={(row) => `Semester ${row.semester ?? ''}`} />
                </div>
                <div className="md:col-span-2">
                    <ArraySection title="Projects" rows={mentee.projects} rowTitle={(row) => String(row.title || 'Project')} />
                </div>
                <div className="md:col-span-2">
                    <ArraySection title="Internships" rows={mentee.internships} rowTitle={(row) => String(row.company_name || row.organization || 'Internship')} />
                </div>
                <div className="md:col-span-2">
                    <ArraySection title="Co-curricular participation" rows={mentee.cocurricular_participations} />
                </div>
                <div className="md:col-span-2">
                    <ArraySection title="Co-curricular organizations" rows={mentee.cocurricular_organizations} />
                </div>
                <div className="md:col-span-2">
                    <ArraySection title="Skill development programs" rows={mentee.skill_programs} rowTitle={(row, i) => String(row.course_title || `Program ${i + 1}`)} />
                </div>
            </div>
        </div>
    )
}
