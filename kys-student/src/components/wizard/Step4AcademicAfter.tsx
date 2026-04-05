import { WizardStepProps, field, input } from './shared'

export default function Step4AcademicAfter({ data, update }: WizardStepProps) {
    const currentSem = Number(data.semester || 8)
    const records = (data.post_admission_records as Record<string, unknown>[]) || []

    const getRecord = (sem: number) => records.find(r => Number(r.semester) === sem) || {}

    const upd = (sem: number, key: string, value: unknown) => {
        const existing = records.filter(r => Number(r.semester) !== sem)
        const current = getRecord(sem)
        update({ post_admission_records: [...existing, { ...current, semester: sem, [key]: value }] })
    }

    const semesters = Array.from({ length: Math.max(currentSem - 1, 0) }, (_, i) => i + 1)

    if (semesters.length === 0) return (
        <p className="text-gray-400 text-sm">No records needed for Semester 1 students.</p>
    )

    return (
        <div className="space-y-4">
            {semesters.map(sem => {
                const rec = getRecord(sem) as Record<string, unknown>
                return (
                    <div key={sem} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Semester {sem}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {field('SGPA (0-10)', input('number', String(rec.sgpa || ''), v => upd(sem, 'sgpa', parseFloat(v)), '0.00'))}
                            {field('Backlog Subjects', input('text', (rec.backlog_subjects as string) || '', v => upd(sem, 'backlog_subjects', v), 'e.g. Maths, Physics'))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
