import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, updateProfile } from '../api/student'
import Step1Personal from '../components/wizard/Step1Personal'
import Step2Parents from '../components/wizard/Step2Parents'
import Step3AcademicBefore from '../components/wizard/Step3AcademicBefore'
import Step4AcademicAfter from '../components/wizard/Step4AcademicAfter'
import Step5ProjectsInternships from '../components/wizard/Step5ProjectsInternships'
import Step6CoCurricular from '../components/wizard/Step6CoCurricular'
import Step7SWOC from '../components/wizard/Step7SWOC'
import Step8CareerSkills from '../components/wizard/Step8CareerSkills'
import Step9ReviewSubmit from '../components/wizard/Step9ReviewSubmit'
import { useAuth } from '../context/AuthContext'

const STEPS = [
    'Student Personal Information',
    "Parent's Information",
    'Academic Information - Before Admission',
    'Academic Information - After Admission',
    'Project and Internship Details',
    'Co-Curricular Activities',
    'SWOC Analysis',
    'Career Objectives and Skills',
    'Review & Submit',
]

const STEP_SUBTEXT = [
    'Please provide your personal details',
    "Please provide your parent's details",
    'Provide your academic details before admission',
    'Provide your academic performance after admission',
    'Provide details of your projects and internships',
    'Provide details of your co-curricular activities',
    'Please provide your Strengths, Weaknesses, Opportunities, and Challenges',
    'Share your career goals and skills assessment',
    'Please review your information before submitting',
]

const DRAFT_RETENTION_DAYS = 180
const DRAFT_VERSION = 1

type ToastTone = 'success' | 'info' | 'error'

interface DraftPayload {
    version: number
    savedAt: number
    expiresAt: number
    step: number
    data: Record<string, unknown>
}

function isBlank(value: unknown) {
    return value === null || value === undefined || String(value).trim() === ''
}

function getMissingRequiredFields(step: number, data: Record<string, unknown>) {
    const pi = (data.personal_info as Record<string, unknown>) || {}
    const swoc = (data.swoc as Record<string, unknown>) || {}
    const co = (data.career_objective as Record<string, unknown>) || {}
    const sk = (data.skills as Record<string, unknown>) || {}

    if (step === 0) {
        const missing: string[] = []
        if (isBlank(data.full_name)) missing.push('Full Name')
        if (isBlank(pi.dob)) missing.push('Date of Birth')
        if (isBlank(pi.gender)) missing.push('Gender')
        if (isBlank(pi.mobile_no)) missing.push('WhatsApp Mobile No.')
        if (isBlank(pi.personal_email)) missing.push('Personal Email')
        if (isBlank(pi.college_email)) missing.push('College Email (Professional)')
        if (isBlank(pi.permanent_address)) missing.push('Permanent Address')
        return missing
    }

    if (step === 1) {
        const missing: string[] = []
        if (isBlank(pi.father_name)) missing.push("Father's Name")
        if (isBlank(pi.father_mobile_no)) missing.push("Father's WhatsApp Mobile No.")
        if (isBlank(pi.father_occupation)) missing.push("Father's Occupation")
        if (isBlank(pi.mother_name)) missing.push("Mother's Name")
        if (isBlank(pi.mother_mobile_no)) missing.push("Mother's WhatsApp Mobile No.")
        if (isBlank(pi.mother_occupation)) missing.push("Mother's Occupation")
        return missing
    }

    if (step === 6) {
        const missing: string[] = []
        if (isBlank(swoc.strengths)) missing.push('Strengths')
        if (isBlank(swoc.weaknesses)) missing.push('Weaknesses / Areas of Improvement')
        if (isBlank(swoc.opportunities)) missing.push('Opportunities')
        if (isBlank(swoc.challenges)) missing.push('Challenges')
        return missing
    }

    if (step === 7) {
        const missing: string[] = []
        if (isBlank(co.career_goal)) missing.push('Career Goal')
        if (isBlank(co.clarity_preparedness)) missing.push('Clarity and Preparedness Level')
        if (co.interested_in_campus_placement !== true && co.interested_in_campus_placement !== false) {
            missing.push('Interested in Campus Placement?')
        }
        if (isBlank(sk.domains_of_interest)) missing.push('Domains of Interest')
        return missing
    }

    return []
}

export default function ProfileWizard() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const [step, setStep] = useState(0)
    const [data, setData] = useState<Record<string, unknown>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [toast, setToast] = useState<{ message: string, tone: ToastTone } | null>(null)

    const toastTimerRef = useRef<number | null>(null)

    const draftKey = useMemo(() => {
        let fallbackId = 'guest'
        try {
            const raw = localStorage.getItem('user')
            if (raw) {
                const stored = JSON.parse(raw) as { id?: number, username?: string }
                fallbackId = String(stored.id || stored.username || fallbackId)
            }
        } catch {
            fallbackId = 'guest'
        }

        const identity = String(user?.id || user?.username || fallbackId)
        return `kys_student_profile_draft_${identity}`
    }, [user?.id, user?.username])

    const showToast = (message: string, tone: ToastTone) => {
        setToast({ message, tone })
        if (toastTimerRef.current) {
            window.clearTimeout(toastTimerRef.current)
        }
        toastTimerRef.current = window.setTimeout(() => setToast(null), 2600)
    }

    useEffect(() => {
        return () => {
            if (toastTimerRef.current) {
                window.clearTimeout(toastTimerRef.current)
            }
        }
    }, [])

    const saveDraft = (payloadData: Record<string, unknown>, nextStep: number) => {
        try {
            const now = Date.now()
            const payload: DraftPayload = {
                version: DRAFT_VERSION,
                savedAt: now,
                expiresAt: now + DRAFT_RETENTION_DAYS * 24 * 60 * 60 * 1000,
                step: nextStep,
                data: payloadData,
            }
            localStorage.setItem(draftKey, JSON.stringify(payload))
            return true
        } catch {
            return false
        }
    }

    useEffect(() => {
        getProfile()
            .then(r => {
                const serverData = (r.data || {}) as Record<string, unknown>

                let restored = false
                try {
                    const raw = localStorage.getItem(draftKey)
                    if (raw) {
                        const parsed = JSON.parse(raw) as DraftPayload
                        const validVersion = parsed?.version === DRAFT_VERSION
                        const validData = parsed?.data && typeof parsed.data === 'object'
                        const notExpired = Number(parsed?.expiresAt || 0) > Date.now()

                        if (validVersion && validData && notExpired) {
                            setData(parsed.data)
                            setStep(Math.max(0, Math.min(Number(parsed.step || 0), STEPS.length - 1)))
                            showToast('Draft restored from local storage.', 'info')
                            restored = true
                        } else {
                            localStorage.removeItem(draftKey)
                        }
                    }
                } catch {
                    localStorage.removeItem(draftKey)
                }

                if (!restored) {
                    setData(serverData)
                }

                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [draftKey])

    const update = (patch: Record<string, unknown>) => setData(prev => ({ ...prev, ...patch }))

    const next = () => {
        const missing = getMissingRequiredFields(step, data)
        if (missing.length > 0) {
            const message = `Please fill required fields: ${missing.join(', ')}`
            setError(message)
            showToast('Required fields are missing. Please complete this step.', 'error')
            return
        }

        setError('')
        const nextStep = Math.min(step + 1, STEPS.length - 1)
        const saved = saveDraft(data, nextStep)

        if (saved) {
            showToast(`Step saved.`, 'success')
        } else {
            showToast('Unable to save draft locally.', 'error')
        }

        setStep(nextStep)
    }

    const prev = () => setStep(s => Math.max(s - 1, 0))

    const submit = async () => {
        setSaving(true)
        setError('')
        try {
            await updateProfile(data)
            localStorage.removeItem(draftKey)
            navigate('/dashboard')
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
            setError(msg || 'Failed to save profile')
        } finally {
            setSaving(false)
        }
    }

    const progress = Math.round(((step + 1) / STEPS.length) * 100)
    const canSubmit = Boolean(data.declaration_accepted)

    if (loading) {
        return (
            <div className="min-h-screen bg-[#edf2f8]">
                <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#22456f] border-t-transparent" />
                </div>
            </div>
        )
    }

    const stepProps = { data, update }

    return (
        <div className="min-h-screen bg-[#edf2f8] px-3 py-5 sm:px-4 sm:py-8">
            <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-[#ccd5e4] bg-[#f5f7fb] shadow-[0_20px_45px_-24px_rgba(22,42,72,0.45)]">
                <header className="border-t-[3px] border-[#f0b243] bg-gradient-to-r from-[#1f355f] to-[#3e5380] px-5 py-6 sm:px-8 sm:py-8">
                    <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl">Student Mentoring and Career Counselling Form</h1>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#c8d3e7] sm:text-sm">Department of Computer Engineering</p>
                </header>

                <div className="border-y border-[#d8dfeb] bg-white px-5 py-5 sm:px-8 sm:py-6">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6a7a91]">Progress</p>
                        <p className="text-xl font-semibold text-[#2a3f62]">{progress}%</p>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-[#e8edf5]">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#203d68] to-[#df981e] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="mt-4 grid grid-cols-9 items-center gap-2 sm:gap-3">
                        {STEPS.map((_, i) => {
                            const done = i < step
                            const current = i === step
                            return (
                                <div key={i} className="flex items-center">
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition sm:h-9 sm:w-9 ${
                                        done
                                            ? 'border-[#12996c] bg-[#12996c] text-white'
                                            : current
                                                ? 'border-[#1f355f] bg-[#1f355f] text-white'
                                                : 'border-[#d5dce8] bg-white text-[#9ca9bc]'
                                    }`}>
                                        {done ? '\u2713' : i + 1}
                                    </div>
                                    {i < STEPS.length - 1 && <div className="h-px flex-1 bg-[#d8dfeb]" />}
                                </div>
                            )
                        })}
                    </div>
                </div>

                <main className="px-5 py-6 sm:px-8 sm:py-8">
                    <div className="mb-6">
                        <h2 className="font-serif text-3xl font-semibold text-[#1f304d] sm:text-4xl">{STEPS[step]}</h2>
                        <p className="mt-1 text-sm text-[#6d7b90] sm:text-base">{STEP_SUBTEXT[step]}</p>
                    </div>

                    <div className="rounded-2xl border border-[#d7deea] bg-white p-4 sm:p-5">
                        {step === 0 && <Step1Personal {...stepProps} />}
                        {step === 1 && <Step2Parents {...stepProps} />}
                        {step === 2 && <Step3AcademicBefore {...stepProps} />}
                        {step === 3 && <Step4AcademicAfter {...stepProps} />}
                        {step === 4 && <Step5ProjectsInternships {...stepProps} />}
                        {step === 5 && <Step6CoCurricular {...stepProps} />}
                        {step === 6 && <Step7SWOC {...stepProps} />}
                        {step === 7 && <Step8CareerSkills {...stepProps} />}
                        {step === 8 && <Step9ReviewSubmit {...stepProps} />}
                    </div>

                    {error && (
                        <div className="mt-4 rounded-xl border border-[#f2c4c4] bg-[#fff2f2] px-4 py-3 text-sm text-[#9b2c2c]">
                            {error}
                        </div>
                    )}
                </main>

                <footer className="border-t border-[#d8dfeb] bg-[#f8fafd] px-5 py-4 sm:px-8">
                    <div className="mb-3 text-center text-sm font-medium text-[#7a879c]">Step {step + 1} of {STEPS.length}</div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            onClick={prev}
                            disabled={step === 0}
                            className="rounded-xl border border-[#d0d8e6] bg-white px-5 py-2.5 text-sm font-semibold text-[#5f6f86] transition hover:bg-[#f3f6fb] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-sm text-[#5f7190] transition hover:text-[#2c446b]"
                        >
                            Back to Dashboard
                        </button>

                        {step < STEPS.length - 1 ? (
                            <button
                                onClick={next}
                                className="rounded-xl bg-[#1f355f] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-14px_rgba(23,42,73,0.9)] transition hover:bg-[#172c4f]"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={submit}
                                disabled={saving || !canSubmit}
                                className="rounded-xl bg-[#1f355f] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-14px_rgba(23,42,73,0.9)] transition hover:bg-[#172c4f] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : 'Submit'}
                            </button>
                        )}
                    </div>
                </footer>
            </div>

            {toast && (
                <div className="fixed bottom-5 right-5 z-50">
                    <div
                        className={`rounded-2xl px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.35)] ${
                            toast.tone === 'success'
                                ? 'bg-[#079669]'
                                : toast.tone === 'error'
                                    ? 'bg-[#c24141]'
                                    : 'bg-[#0f7ebf]'
                        }`}
                    >
                        {toast.message}
                    </div>
                </div>
            )}
        </div>
    )
}
