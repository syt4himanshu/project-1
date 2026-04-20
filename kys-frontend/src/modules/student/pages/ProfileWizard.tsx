import { useNavigate } from 'react-router-dom'
import Step1Personal from '../components/wizard/Step1Personal'
import Step2Parents from '../components/wizard/Step2Parents'
import Step3AcademicBefore from '../components/wizard/Step3AcademicBefore'
import Step4AcademicAfter from '../components/wizard/Step4AcademicAfter'
import Step5ProjectsInternships from '../components/wizard/Step5ProjectsInternships'
import Step6CoCurricular from '../components/wizard/Step6CoCurricular'
import Step7SWOC from '../components/wizard/Step7SWOC'
import Step8CareerSkills from '../components/wizard/Step8CareerSkills'
import Step9ReviewSubmit from '../components/wizard/Step9ReviewSubmit'
import { useStudentProfileWizard } from '../hooks/useStudentProfileWizard'
import { ThemeToggleButton } from '../../../shared/ui/theme-toggle'

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

export default function ProfileWizard() {
    const navigate = useNavigate()
    const { step, loading, saving, error, progress, canSubmit, next, prev, submit } = useStudentProfileWizard()

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--bg-soft)]">
                <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#22456f] border-t-transparent" />
                </div>
            </div>
        )
    }

    const handleSubmit = async () => {
        const submitted = await submit()
        if (submitted) {
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
                                                : 'border-[#d5dce8] bg-[var(--panel)] text-[#9ca9bc]'
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
                        <h2 className="font-serif text-3xl font-semibold text-[var(--text)] sm:text-4xl">{STEPS[step]}</h2>
                        <p className="mt-1 text-sm text-[var(--text-muted)] sm:text-base">{STEP_SUBTEXT[step]}</p>
                    </div>

                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 sm:p-5">
                        {step === 0 && <Step1Personal />}
                        {step === 1 && <Step2Parents />}
                        {step === 2 && <Step3AcademicBefore />}
                        {step === 3 && <Step4AcademicAfter />}
                        {step === 4 && <Step5ProjectsInternships />}
                        {step === 5 && <Step6CoCurricular />}
                        {step === 6 && <Step7SWOC />}
                        {step === 7 && <Step8CareerSkills />}
                        {step === 8 && <Step9ReviewSubmit />}
                    </div>

                    {error && (
                        <div className="mt-4 rounded-xl border border-[#f2c4c4] bg-[#fff2f2] px-4 py-3 text-sm text-[#9b2c2c]">
                            {error}
                        </div>
                    )}
                </main>

                <footer className="border-t border-[var(--border)] bg-[var(--panel)] px-5 py-4 sm:px-8">
                    <div className="mb-3 text-center text-sm font-medium text-[#7a879c]">Step {step + 1} of {STEPS.length}</div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            onClick={prev}
                            disabled={step === 0}
                            className="rounded-xl border border-[#d0d8e6] bg-[var(--panel)] px-5 py-2.5 text-sm font-semibold text-[#5f6f86] transition hover:bg-[var(--bg-soft)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <button
                            onClick={() => navigate('/student/dashboard')}
                            className="rounded-xl px-4 py-2 text-sm font-medium text-[#5f7190] transition hover:bg-[var(--bg-soft)] hover:text-[#2c446b]"
                        >
                            Back to Dashboard
                        </button>

                        {step < STEPS.length - 1 ? (
                            <button
                                onClick={next}
                                disabled={saving}
                                className="rounded-xl bg-[#1f355f] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-14px_rgba(23,42,73,0.9)] transition hover:bg-[#172c4f]"
                            >
                                {saving ? 'Saving...' : 'Next'}
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={saving || !canSubmit}
                                className="rounded-xl bg-[#1f355f] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_-14px_rgba(23,42,73,0.9)] transition hover:bg-[#172c4f] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving ? 'Saving...' : 'Submit'}
                            </button>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    )
}
