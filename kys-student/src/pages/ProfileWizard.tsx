import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, updateProfile } from '../api/student'
import Step1Personal from '../components/wizard/Step1Personal'
import Step2Parents from '../components/wizard/Step2Parents'
import Step3AcademicBefore from '../components/wizard/Step3AcademicBefore'
import Step4AcademicAfter from '../components/wizard/Step4AcademicAfter'
import Step5CareerActivities from '../components/wizard/Step5CareerActivities'
import Step6ProjectsInternships from '../components/wizard/Step6ProjectsInternships'
import Step7CoCurricular from '../components/wizard/Step7CoCurricular'
import Step8SWOC from '../components/wizard/Step8SWOC'
import Step9CareerSkills from '../components/wizard/Step9CareerSkills'

const STEPS = [
    'Personal Info', 'Parents Info', 'Before Admission',
    'After Admission', 'Career Activities', 'Projects & Internships',
    'Co-Curricular', 'SWOC', 'Career & Skills'
]

export default function ProfileWizard() {
    const navigate = useNavigate()
    const [step, setStep] = useState(0)
    const [data, setData] = useState<Record<string, unknown>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        getProfile().then(r => { setData(r.data); setLoading(false) }).catch(() => setLoading(false))
    }, [])

    const update = (patch: Record<string, unknown>) => setData(prev => ({ ...prev, ...patch }))

    const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
    const prev = () => setStep(s => Math.max(s - 1, 0))

    const submit = async () => {
        setSaving(true); setError('')
        try {
            await updateProfile(data)
            navigate('/dashboard')
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
            setError(msg || 'Failed to save profile')
        } finally {
            setSaving(false)
        }
    }

    const progress = Math.round(((step + 1) / STEPS.length) * 100)

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )

    const stepProps = { data, update }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        ← Back to Dashboard
                    </button>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Step {step + 1} of {STEPS.length}</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>

                {/* Step dots */}
                <div className="flex justify-between mb-8">
                    {STEPS.map((s, i) => (
                        <div key={s} className="flex flex-col items-center gap-1">
                            <div className={`w-3 h-3 rounded-full transition-colors ${i < step ? 'bg-green-500' : i === step ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
                            <span className="text-xs text-gray-400 hidden sm:block">{s}</span>
                        </div>
                    ))}
                </div>

                {/* Step content */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">{STEPS[step]}</h2>
                    {step === 0 && <Step1Personal {...stepProps} />}
                    {step === 1 && <Step2Parents {...stepProps} />}
                    {step === 2 && <Step3AcademicBefore {...stepProps} />}
                    {step === 3 && <Step4AcademicAfter {...stepProps} />}
                    {step === 4 && <Step5CareerActivities {...stepProps} />}
                    {step === 5 && <Step6ProjectsInternships {...stepProps} />}
                    {step === 6 && <Step7CoCurricular {...stepProps} />}
                    {step === 7 && <Step8SWOC {...stepProps} />}
                    {step === 8 && <Step9CareerSkills {...stepProps} />}
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                {/* Navigation */}
                <div className="flex justify-between">
                    <button onClick={prev} disabled={step === 0}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Previous
                    </button>
                    {step < STEPS.length - 1 ? (
                        <button onClick={next} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                            Next
                        </button>
                    ) : (
                        <button onClick={submit} disabled={saving}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium">
                            {saving ? 'Saving…' : 'Submit'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
