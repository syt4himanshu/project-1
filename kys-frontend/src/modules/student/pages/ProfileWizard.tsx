import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Step1Personal from '../components/wizard/Step1Personal'
import Step3AcademicBefore from '../components/wizard/Step3AcademicBefore'
import Step5ProjectsInternships from '../components/wizard/Step5ProjectsInternships'
import Step7SWOC from '../components/wizard/Step7SWOC'
import Step9ReviewSubmit from '../components/wizard/Step9ReviewSubmit'
import { useStudentProfileWizard } from '../hooks/useStudentProfileWizard'
import { ThemeToggleButton } from '../../../shared/ui/theme-toggle'
import { useToast } from '../../../app/providers/toast-context'

const STEPS = [
    'Student Personal Information',
    'Academic Information - Before Admission',
    'Project and Internship Details',
    'SWOC Analysis',
    'Review & Submit',
]

const PROGRESS_STEPS = STEPS.length - 1

const STEP_SUBTEXT = [
    'Please provide your personal details',
    'Provide your academic details before admission',
    'Provide details of your projects and internships',
    'Please provide your Strengths, Weaknesses, Opportunities, and Challenges',
    'Please review your information before submitting',
]

export default function ProfileWizard() {
    const navigate = useNavigate()
    const {
        step,
        loading,
        saving,
        error,
        progress,
        canSubmit,
        lastDraftSavedLabel,
        draftWasRestored,
        draftRestoredAt,
        autoSyncMessage,
        autoSyncPending,
        next,
        prev,
        submit,
        clearForm,
    } = useStudentProfileWizard()
    const [showDraftBanner, setShowDraftBanner] = useState(false)

    useEffect(() => {
        if (draftWasRestored && draftRestoredAt) {
            setShowDraftBanner(true)
        }
    }, [draftRestoredAt, draftWasRestored])

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-soft)]">
                <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#22456f] border-t-transparent" />
                </div>
            </div>
        )
    }

    const toast = useToast()

    const handleSubmit = async () => {
        const submitted = await submit()
        if (submitted) {
            toast.success('Your mentoring profile has been successfully submitted.', 'Profile Submitted')
            navigate('/student/dashboard')
        }
    }

    return (
        <div className="min-h-screen bg-[var(--bg-soft)] px-3 py-5 sm:px-4 sm:py-8 transition-colors duration-300">
            <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-soft)] shadow-[0_20px_45px_-24px_rgba(22,42,72,0.45)]">
                <header className="border-t-[3px] border-[#f0b243] bg-gradient-to-r from-[#1f355f] to-[#3e5380] px-5 py-6 sm:px-8 sm:py-8 flex justify-between items-start">
                    <div>
                      <h1 className="font-serif text-3xl font-semibold text-white sm:text-4xl">Student Mentoring and Career Counselling Form</h1>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#c8d3e7] sm:text-sm">Department of Computer Engineering</p>
                    </div>
                    <ThemeToggleButton className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[var(--panel)]/10 text-white transition hover:bg-[var(--panel)]/20 mt-2" />
                </header>

                <div className="border-y border-[var(--border)] bg-[var(--panel)] px-5 py-5 sm:px-8 sm:py-6">
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Progress</p>
                        <p className="text-xl font-semibold text-[var(--text)]">{progress}%</p>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#203d68] to-[#df981e] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Step indicator — key must be on the outermost element from .map() */}
                    <div className="mt-4 flex w-full items-center">
                        {STEPS.slice(0, PROGRESS_STEPS).map((_, i) => {
                            const done = i < step
                            const current = i === step
                            return (
                                <div key={`step-wrapper-${i}`} className="flex flex-1 items-center last:flex-none">
                                    <div
                                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition sm:h-9 sm:w-9 ${
                                            done
                                                ? 'border-[#12996c] bg-[#12996c] text-white'
                                                : current
                                                    ? 'border-[#1f355f] bg-[#1f355f] text-white'
                                                    : 'border-[#d5dce8] bg-[var(--panel)] text-[#9ca9bc]'
                                        }`}
                                    >
                                        {done ? '✓' : i + 1}
                                    </div>
                                    {i < PROGRESS_STEPS - 1 && <div className="mx-2 h-px flex-1 bg-[#d8dfeb] sm:mx-3" />}
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[var(--text-muted)]">
                        <span>
                            {lastDraftSavedLabel ? `Saved locally ${lastDraftSavedLabel}` : 'Saved locally just now'}
                        </span>
                    </div>

                    {autoSyncMessage && (
                        <div className="mt-2 text-xs font-medium text-[#62748d]">
                            {autoSyncPending ? autoSyncMessage : autoSyncMessage}
                        </div>
                    )}

                    {showDraftBanner && draftRestoredAt && (
                        <div className="mt-3 rounded-2xl border border-[#dbe5f2] bg-[#f7fbff] px-4 py-3 text-sm text-[#324a6b]">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="font-semibold">Recovered your unsaved draft.</p>
                                    <p className="mt-1 text-xs text-[#62748d]">Last saved: {new Date(draftRestoredAt).toLocaleString()}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowDraftBanner(false)}
                                    className="self-start rounded-lg px-3 py-1 text-xs font-semibold text-[#40618f] transition hover:bg-[#eaf2fb]"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <main className="px-5 py-6 sm:px-8 sm:py-8">
                    <div className="mb-6">
                        <h2 className="font-serif text-3xl font-semibold text-[var(--text)] sm:text-4xl">{STEPS[step]}</h2>
                        <p className="mt-1 text-sm text-[var(--text-muted)] sm:text-base">{STEP_SUBTEXT[step]}</p>
                    </div>

                    <div className="rounded-2xl border-0 bg-[var(--panel)] p-4 sm:p-5">
                        {step === 0 && <Step1Personal />}
                        {step === 1 && <Step3AcademicBefore />}
                        {step === 2 && <Step5ProjectsInternships />}
                        {step === 3 && <Step7SWOC />}
                        {step === 4 && <Step9ReviewSubmit />}
                    </div>

                    {error && (
                        <div className="mt-4 rounded-xl border border-[#f2c4c4] bg-[#fff2f2] px-4 py-3 text-sm text-[#9b2c2c]">
                            {error}
                        </div>
                    )}
                </main>

                <footer className="border-t border-[var(--border)] bg-[var(--panel)] px-5 py-4 sm:px-8">
                    <div className="mb-3 text-center text-sm font-medium text-[#7a879c]">
                        {step < PROGRESS_STEPS ? `Step ${step + 1} of ${PROGRESS_STEPS}` : 'Review'}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center justify-between gap-3 sm:order-2 sm:ml-auto sm:justify-end">
                            <button
                                onClick={prev}
                                disabled={step === 0}
                                className="min-w-0 flex-0 rounded-xl border border-[#d0d8e6] bg-[var(--panel)] px-4 py-2.5 text-sm font-semibold text-[#5f6f86] transition hover:bg-[var(--bg-soft)] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-5"
                            >
                                Previous
                            </button>

                            {step < STEPS.length - 1 ? (
                                <button
                                    onClick={next}
                                    disabled={saving}
                                    className="min-w-0 flex-0 rounded-xl bg-[#1f355f] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-14px_rgba(23,42,73,0.9)] transition hover:bg-[#172c4f] sm:flex-none sm:px-5"
                                >
                                    {saving ? 'Saving...' : 'Next'}
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={saving || !canSubmit}
                                    className="min-w-0 flex-0 rounded-xl bg-[#1f355f] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-14px_rgba(23,42,73,0.9)] transition hover:bg-[#172c4f] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-5"
                                >
                                    {saving ? 'Saving...' : 'Submit'}
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={async () => {
                                    if (window.confirm('Clear all filled form data and start over?')) {
                                        await clearForm()
                                    }
                                }}
                                className="min-w-0 flex-0 rounded-xl border border-[#f0c8c8] bg-[#fff5f5] px-4 py-2.5 text-sm font-semibold text-[#b42318] transition hover:bg-[#ffeaea] sm:flex-none sm:px-5"
                            >
                                Clear Form
                            </button>
                        </div>

                        <button
                            onClick={() => navigate('/student/dashboard')}
                            className="w-fit self-center rounded-xl px-3 py-2 text-sm font-medium text-[#5f7190] transition hover:bg-[var(--bg-soft)] hover:text-[#2c446b] sm:order-1 sm:self-auto sm:px-4"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    )
}
