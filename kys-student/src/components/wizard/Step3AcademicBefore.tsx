import { WizardStepProps, field, input } from './shared'

export default function Step3AcademicBefore({ data, update }: WizardStepProps) {
    const records = (data.past_education_records as Record<string, unknown>[]) || []
    const getRecord = (exam: string) => records.find(r => r.exam_name === exam) || {}

    const upd = (exam: string, key: string, value: unknown) => {
        const existing = records.filter(r => r.exam_name !== exam)
        const current = getRecord(exam)
        update({ past_education_records: [...existing, { ...current, exam_name: exam, [key]: value }] })
    }

    return (
        <div className="space-y-6">
            {['SSC', 'HSSC'].map(exam => {
                const rec = getRecord(exam) as Record<string, unknown>
                return (
                    <div key={exam} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">{exam}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {field('Percentage', input('number', String(rec.percentage || ''), v => upd(exam, 'percentage', parseFloat(v)), '0-100'))}
                            {field('Year of Passing', input('number', String(rec.year_of_passing || ''), v => upd(exam, 'year_of_passing', parseInt(v)), '2020'))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
