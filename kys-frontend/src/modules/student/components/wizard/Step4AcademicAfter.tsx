import { useStudentProfileDraft } from '../../hooks/useStudentProfileWizard'
import { field, input, sectionCardCls, select } from './shared'

export default function Step4AcademicAfter() {
    const { data, update } = useStudentProfileDraft()
    const currentSem = Number(data.semester || 8)
    const records = (data.post_admission_records as Record<string, unknown>[]) || []

    const getRecord = (sem: number) => records.find(r => Number(r.semester) === sem) || {}

    const upd = (sem: number, key: string, value: unknown) => {
        const existing = records.filter(r => Number(r.semester) !== sem)
        const current = getRecord(sem)
        update({ post_admission_records: [...existing, { ...current, semester: sem, [key]: value }] })
    }

    const semesters = Array.from({ length: Math.max(currentSem - 1, 0) }, (_, i) => i + 1)

    if (semesters.length === 0) {
        return (
            <div className={sectionCardCls}>
                <p className="text-sm text-[#6e7e95]">No records needed for Semester 1 students.</p>
            </div>
        )
    }

    return (
        <div className="space-y-5">
            {semesters.map(sem => {
                const rec = getRecord(sem) as Record<string, unknown>
                return (
                    <section key={sem} className={sectionCardCls}>
                        <h3 className="mb-4 text-xl font-semibold text-[#223b60]">Semester {sem}</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                            {field('SGPA / Percentage', input('number', String(rec.sgpa || ''), v => upd(sem, 'sgpa', v === '' ? null : Number(v)), 'e.g. 8.86'))}

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">Season & Year of Passing</label>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {select(['Summer', 'Winter'], (rec.season as string) || '', v => upd(sem, 'season', v), 'Season')}
                                    {input('number', String(rec.year_of_passing || ''), v => upd(sem, 'year_of_passing', v === '' ? null : Number(v)), 'Year e.g. 2023')}
                                </div>
                            </div>

                            {field('College Rank', input('text', (rec.college_rank as string) || '', v => upd(sem, 'college_rank', v), 'Rank (if any)'))}
                            {field('Academic Awards', input('text', (rec.academic_awards as string) || '', v => upd(sem, 'academic_awards', v), 'Awards received (if any)'))}

                            <div className="sm:col-span-2">
                                {field('Backlog Subjects', input('text', (rec.backlog_subjects as string) || '', v => upd(sem, 'backlog_subjects', v), 'e.g. N/A or list subjects'))}
                            </div>
                        </div>
                    </section>
                )
            })}
        </div>
    )
}
