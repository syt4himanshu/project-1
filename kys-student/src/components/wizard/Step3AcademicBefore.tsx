import { WizardStepProps, field, input, sectionCardCls, select } from './shared'

const BOARDS = ['CBSE', 'State Board', 'ICSE', 'Other']
const ENTRANCE_EXAMS = ['MHT-CET', 'JEE']

export default function Step3AcademicBefore({ data, update }: WizardStepProps) {
    const records = (data.past_education_records as Record<string, unknown>[]) || []

    const getRecord = (exam: string) => records.find(r => r.exam_name === exam) || {}

    const upd = (exam: string, key: string, value: unknown) => {
        const existing = records.filter(r => r.exam_name !== exam)
        const current = getRecord(exam)
        update({ past_education_records: [...existing, { ...current, exam_name: exam, [key]: value }] })
    }

    const renderEducationSection = (
        title: string,
        examKey: string,
        boardLabel: string,
        boardPlaceholder: string,
        useBoardInput = false,
    ) => {
        const rec = getRecord(examKey) as Record<string, unknown>
        return (
            <section key={examKey} className={sectionCardCls}>
                <h3 className="mb-4 border-b-2 border-[#3b8ed9] pb-2 text-3xl font-semibold text-[#223b60]">{title}</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                    {field(
                        boardLabel,
                        useBoardInput
                            ? input('text', (rec.board as string) || '', v => upd(examKey, 'board', v), boardPlaceholder)
                            : select(BOARDS, (rec.board as string) || '', v => upd(examKey, 'board', v), boardPlaceholder),
                    )}
                    {field('Percentage / Grade', input('number', String(rec.percentage || ''), v => upd(examKey, 'percentage', v === '' ? null : Number(v)), 'e.g. 86.67'))}
                    {field('Year of Passing', input('number', String(rec.year_of_passing || ''), v => upd(examKey, 'year_of_passing', v === '' ? null : Number(v)), 'e.g. 2023'))}
                </div>
            </section>
        )
    }

    const entrance = getRecord('ENTRANCE_EXAM') as Record<string, unknown>

    return (
        <div className="space-y-5">
            {renderEducationSection('SSC (X) Details', 'SSC', 'Board', 'Select Board')}
            {renderEducationSection('HSSC (XII) Details', 'HSSC', 'Board', 'Select Board')}
            {renderEducationSection('Diploma Details (if applicable)', 'DIPLOMA', 'Diploma Board', 'e.g. MSBTE', true)}

            <section className={sectionCardCls}>
                <h3 className="mb-4 border-b-2 border-[#df981e] pb-2 text-3xl font-semibold text-[#223b60]">Entrance Exam & Admission Details</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                    {field('Entrance Exam Type', select(ENTRANCE_EXAMS, (entrance.exam_type as string) || '', v => upd('ENTRANCE_EXAM', 'exam_type', v), 'Select Exam'))}
                    {field('Percentile', input('text', String(entrance.percentage || ''), v => upd('ENTRANCE_EXAM', 'percentage', v === '' ? null : Number(v)), 'Score / Percentile'))}
                    {field('Year of Passing', input('number', String(entrance.year_of_passing || ''), v => upd('ENTRANCE_EXAM', 'year_of_passing', v === '' ? null : Number(v)), 'Year of Passing'))}
                </div>
            </section>
        </div>
    )
}
