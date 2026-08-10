import { useState, useRef } from 'react'
import { useStudentProfileDraft } from '../../hooks/useStudentProfileWizard'
import { field, input, inputCls, sectionCardCls, select } from './shared'

const BOARDS = ['CBSE', 'State Board', 'ICSE', 'Other']
const ENTRANCE_EXAMS = ['MHT-CET', 'JEE', 'Other']
const YEAR_OPTIONS = Array.from({ length: 2040 - 2018 + 1 }, (_, i) => String(2018 + i))

export default function Step3AcademicBefore() {
    const { data, update, error } = useStudentProfileDraft()
    const records = (data.past_education_records as Record<string, unknown>[]) || []
    
    const [activeSem, setActiveSem] = useState<number>(1)
    const semCardRefs = useRef<Record<number, HTMLElement | null>>({})
    const derivedAdmissionType = records.some(r => r.exam_name === 'DIPLOMA')
        ? 'diploma'
        : records.some(r => r.exam_name === 'HSSC' || r.exam_name === 'ENTRANCE_EXAM')
            ? 'hsc'
            : ''
    const admissionType = (data.admission_type as string) || derivedAdmissionType

    const getRecord = (exam: string) => records.find(r => r.exam_name === exam) || {}

    const upd = (exam: string, key: string, value: unknown) => {
        const existing = records.filter(r => r.exam_name !== exam)
        const current = getRecord(exam)
        update({ past_education_records: [...existing, { ...current, exam_name: exam, [key]: value }] })
    }

    const setAdmissionType = (value: string) => {
        const keep = records.filter(r => r.exam_name === 'SSC')

        if (value === 'hsc') {
            update({
                admission_type: value,
                past_education_records: [
                    ...keep,
                    ...records.filter(r => r.exam_name === 'HSSC' || r.exam_name === 'ENTRANCE_EXAM'),
                ],
            })
            return
        }

        if (value === 'diploma') {
            update({
                admission_type: value,
                past_education_records: [
                    ...keep,
                    ...records.filter(r => r.exam_name === 'DIPLOMA'),
                ],
            })
            return
        }

        update({ admission_type: value })
    }

    const getValidation = (fieldName: string) => {
        let normalizedFieldName = fieldName
        if (fieldName.startsWith('HSSC')) {
            normalizedFieldName = fieldName.replace('HSSC', 'HSC')
        } else if (fieldName.startsWith('DIPLOMA')) {
            normalizedFieldName = fieldName.replace('DIPLOMA', 'Diploma')
        }

        const missingFields = error && error.startsWith('Please fill required fields: ')
            ? error.replace('Please fill required fields: ', '').split(', ')
            : []

        if (missingFields.includes(normalizedFieldName)) {
            return {
                error: `${normalizedFieldName} is required`,
                touched: true
            }
        }
        return undefined
    }

    const handlePercentageChange = (examKey: string, v: string) => {
        if (v === '') {
            upd(examKey, 'percentage', null)
            return
        }
        if (/^\d*\.?\d{0,2}$/.test(v)) {
            const num = v === '.' ? 0 : Number(v)
            if (num <= 100) {
                upd(examKey, 'percentage', v)
            }
        }
    }

    const renderEducationSection = (
        title: string,
        examKey: string,
        boardLabel: string,
        boardPlaceholder: string,
        useBoardInput = false,
    ) => {
        const rec = getRecord(examKey) as Record<string, unknown>
        const isCustomBoard = rec.board && !BOARDS.includes(rec.board as string) && rec.board !== 'Other'
        const displayBoard = isCustomBoard ? 'Other' : (rec.board as string || '')
        const showBoardInput = displayBoard === 'Other'

        return (
            <section key={examKey} className={sectionCardCls}>
                <h3 className="mb-4 border-b-2 border-[#3b8ed9] pb-2 text-3xl font-semibold text-[#223b60]">{title}</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                    {field(
                        `${boardLabel} *`,
                        useBoardInput
                            ? input('text', (rec.board as string) || '', v => upd(examKey, 'board', v), boardPlaceholder, getValidation(`${examKey} Board`))
                            : (
                                <div className="flex flex-col gap-4">
                                    {select(BOARDS, displayBoard, v => upd(examKey, 'board', v), boardPlaceholder, !showBoardInput ? getValidation(`${examKey} Board`) : undefined)}
                                    {showBoardInput && (
                                        input('text', isCustomBoard ? (rec.board as string) : '', v => upd(examKey, 'board', v), `Enter ${boardLabel}`, getValidation(`${examKey} Board`))
                                    )}
                                </div>
                            )
                    )}
                    {field('Percentage / Grade *', input('text', rec.percentage != null ? String(rec.percentage) : '', v => handlePercentageChange(examKey, v), 'e.g. 85.50', getValidation(`${examKey} Percentage / Grade`)))}
                    {field('Year of Passing *', select(YEAR_OPTIONS, String(rec.year_of_passing || ''), v => upd(examKey, 'year_of_passing', v === '' ? null : Number(v)), 'Select Year', getValidation(`${examKey} Year of Passing`)))}
                </div>
            </section>
        )
    }

    const entrance = getRecord('ENTRANCE_EXAM') as Record<string, unknown>
    const currentSem = Number(data.semester || 8)
    const postAdmissionRecords = (data.post_admission_records as Record<string, unknown>[]) || []

    const getPostAdmissionRecord = (sem: number) => postAdmissionRecords.find(r => Number(r.semester) === sem) || {}

    const updPostAdmission = (sem: number, key: string, value: unknown) => {
        const existing = postAdmissionRecords.filter(r => Number(r.semester) !== sem)
        const current = getPostAdmissionRecord(sem)
        update({ post_admission_records: [...existing, { ...current, semester: sem, [key]: value }] })
    }

    const semesters = Array.from({ length: Math.max(currentSem - 1, 0) }, (_, i) => i + 1)

    return (
        <div className="space-y-5">
            {renderEducationSection('SSC (X) Details', 'SSC', 'Board', 'Select Board')}

            <section className={sectionCardCls}>
                <h3 className="mb-4 border-b-2 border-[#3b8ed9] pb-2 text-2xl font-semibold text-[#223b60]">What did you do after 10th?</h3>
                <div className="grid grid-cols-1 gap-4 sm:max-w-md">
                    {field('Admission Type *', (
                        <div className="space-y-1">
                            <select
                                value={admissionType}
                                onChange={e => setAdmissionType(e.target.value)}
                                className={`${inputCls} ${getValidation('Admission Type (after 10th)') ? 'border-[#ef4444] focus:border-[#dc2626] focus:ring-[#ef4444]/20' : ''}`}
                            >
                                <option value="">Select Admission Type</option>
                                <option value="hsc">12th (HSC)</option>
                                <option value="diploma">Diploma (Direct Second Year)</option>
                            </select>
                            {getValidation('Admission Type (after 10th)') && (
                                <p className="text-xs font-medium text-[#dc2626]">{getValidation('Admission Type (after 10th)')?.error}</p>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {admissionType === 'hsc' && (
                <>
                    {renderEducationSection('HSC (XII) Details', 'HSSC', 'Board', 'Select Board')}

                    <section className={sectionCardCls}>
                        <h3 className="mb-4 border-b-2 border-[#df981e] pb-2 text-3xl font-semibold text-[#223b60]">Entrance Exam & Admission Details</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                            {field('Entrance Exam Type *', (() => {
                                const isCustomExam = entrance.exam_type && !ENTRANCE_EXAMS.includes(entrance.exam_type as string) && entrance.exam_type !== 'Other'
                                const displayExam = isCustomExam ? 'Other' : (entrance.exam_type as string || '')
                                const showExamInput = displayExam === 'Other'
                                return (
                                    <div className="flex flex-col gap-4">
                                        {select(ENTRANCE_EXAMS, displayExam, v => upd('ENTRANCE_EXAM', 'exam_type', v), 'Select Exam', !showExamInput ? getValidation('Entrance Exam Type') : undefined)}
                                        {showExamInput && (
                                            input('text', isCustomExam ? (entrance.exam_type as string) : '', v => upd('ENTRANCE_EXAM', 'exam_type', v), 'Enter Exam Type', getValidation('Entrance Exam Type'))
                                        )}
                                    </div>
                                )
                            })())}
                            {field('Percentile *', input('text', entrance.percentage != null ? String(entrance.percentage) : '', v => handlePercentageChange('ENTRANCE_EXAM', v), 'Score / Percentile', getValidation('Entrance Percentile')))}
                            {field('Year of Passing *', select(YEAR_OPTIONS, String(entrance.year_of_passing || ''), v => upd('ENTRANCE_EXAM', 'year_of_passing', v === '' ? null : Number(v)), 'Select Year', getValidation('Entrance Exam Year of Passing')))}
                        </div>
                    </section>
                    
                    <section className={sectionCardCls}>
                        <h3 className="mb-4 border-b-2 border-[#10b981] pb-2 text-3xl font-semibold text-[#223b60]">Other Programs</h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                            {field('Program Title', input('text', (getRecord('EXTRA_PROGRAM').exam_type as string) || '', v => upd('EXTRA_PROGRAM', 'exam_type', v), 'Title of the Program'))}
                            {field('Score/Percentage (Numeric)', input('number', getRecord('EXTRA_PROGRAM').percentage != null ? String(getRecord('EXTRA_PROGRAM').percentage) : '', v => handlePercentageChange('EXTRA_PROGRAM', v), 'e.g. 85.5'))}
                            {field('Year of Passing', select(YEAR_OPTIONS, String(getRecord('EXTRA_PROGRAM').year_of_passing || ''), v => upd('EXTRA_PROGRAM', 'year_of_passing', v === '' ? null : Number(v)), 'Select Year'))}
                        </div>
                    </section>
                </>
            )}
            

            {admissionType === 'diploma' && renderEducationSection('Diploma Details', 'DIPLOMA', 'Diploma Board', 'Enter Diploma Board', true)}

            <section className={sectionCardCls}>
                <h3 className="mb-4 border-b-2 border-[#3b8ed9] pb-2 text-3xl font-semibold text-[#223b60]">Academic Information - After Admission</h3>
                {semesters.length === 0 ? (
                    <p className="text-sm text-[#6e7e95]">No records needed for Semester 1 students.</p>
                ) : (
                    <div className="space-y-5">
                        {semesters.slice(0, activeSem).map(sem => {
                            const rec = getPostAdmissionRecord(sem) as Record<string, unknown>
                            return (
                                <section key={sem} ref={el => { semCardRefs.current[sem] = el }} className={sectionCardCls}>
                                    <h3 className="mb-4 text-xl font-semibold text-[#223b60]">Semester {sem}</h3>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                                        {field('SGPA / Percentage *', input('number', String(rec.sgpa || ''), v => updPostAdmission(sem, 'sgpa', v === '' ? null : Number(v)), 'e.g. 8.86', getValidation(`Semester ${sem} SGPA / Percentage`)))}

                                        <div>
                                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">Session & Year of Passing</label>
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                {select(['Summer', 'Winter'], (rec.season as string) || '', v => updPostAdmission(sem, 'season', v), 'Session')}
                                                {select(YEAR_OPTIONS, String(rec.year_of_passing || ''), v => updPostAdmission(sem, 'year_of_passing', v === '' ? null : Number(v)), 'Select Year')}
                                            </div>
                                        </div>

                                        {field('College Rank', input('text', (rec.college_rank as string) || '', v => updPostAdmission(sem, 'college_rank', v), 'Rank (if any)'))}
                                        {field('Academic Awards', input('text', (rec.academic_awards as string) || '', v => updPostAdmission(sem, 'academic_awards', v), 'Awards received (if any)'))}

                                        <div className="sm:col-span-2">
                                            {field('Backlog Subjects', input('text', (rec.backlog_subjects as string) || '', v => updPostAdmission(sem, 'backlog_subjects', v), 'e.g. list subjects comma separated'))}
                                        </div>
                                    </div>
                                    {sem === activeSem && (
                                        <div className="mt-3">
                                            {activeSem < semesters.length ? (
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        setActiveSem(prev => prev + 1)
                                                        setTimeout(() => semCardRefs.current[activeSem + 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
                                                    }} 
                                                    className="rounded-xl border border-[#3b8ed9] bg-white dark:bg-[#1e293b] px-4 py-2 text-sm font-semibold text-[#3b8ed9] transition hover:bg-[#f0f6ff] dark:hover:bg-[#243044]"
                                                >
                                                    Add Semester {activeSem + 1} →
                                                </button>
                                            ) : (
                                                <p className="text-sm font-medium text-[#12996c]">✓ All {semesters.length} semesters added</p>
                                            )}
                                        </div>
                                    )}
                                </section>
                            )
                        })}
                    </div>
                )}
            </section>
        </div>
       
    )
}
