import { useStudentProfileDraft } from '../../hooks/useStudentProfileWizard'
import { field, input, inputCls, sectionCardCls, select } from './shared'

const LEVELS = ['Department', 'Institute', 'University', 'State', 'National', 'International']

export default function Step6CoCurricular() {
    const { data, update } = useStudentProfileDraft()
    const participations = (data.cocurricular_participations as Record<string, unknown>[]) || [{}, {}, {}]
    const organizations = (data.cocurricular_organizations as Record<string, unknown>[]) || [{}, {}, {}]
    const programs = (data.skill_programs as Record<string, unknown>[]) || [{}, {}, {}]
    const hasOrganizedActivities =
        data.hasOrganizedActivities === true
        || organizations.some(activity =>
            Boolean(activity.name || activity.date || activity.level || activity.remark),
        )
    const hasSkillPrograms =
        data.hasSkillPrograms === true
        || programs.some(program =>
            Boolean(program.course_title || program.platform || program.duration_hours || program.date_from || program.date_to),
        )

    const updP = (i: number, key: string, value: unknown) => {
        const updated = [...participations]
        updated[i] = { ...updated[i], [key]: value }
        update({ cocurricular_participations: updated })
    }

    const updO = (i: number, key: string, value: unknown) => {
        const updated = [...organizations]
        updated[i] = { ...updated[i], [key]: value }
        update({ cocurricular_organizations: updated })
    }

    const updProgram = (i: number, key: string, value: unknown) => {
        const updated = [...programs]
        updated[i] = { ...updated[i], [key]: value }
        update({ skill_programs: updated })
    }

    const setHasOrganizedActivities = (value: string) => {
        const nextHasOrganizedActivities = value === 'yes'
        update({
            hasOrganizedActivities: nextHasOrganizedActivities,
            cocurricular_organizations: nextHasOrganizedActivities ? organizations : [],
        })
    }

    const setHasSkillPrograms = (value: string) => {
        const nextHasSkillPrograms = value === 'yes'
        update({
            hasSkillPrograms: nextHasSkillPrograms,
            skill_programs: nextHasSkillPrograms ? programs : [],
        })
    }

    return (
        <div className="space-y-5">
            <section className={sectionCardCls}>
                <h3 className="mb-4 border-b-2 border-[#3b8ed9] pb-2 text-3xl font-semibold text-[#223b60]">Participation Activities</h3>
                <p className="mb-4 text-sm text-[#7a879c]">(Technical Competition / Paper Presentation / Hackathon / etc.)</p>
                {[0, 1, 2].map(i => (
                    <div key={i} className="mb-4 rounded-xl border border-[#d4dcea] dark:border-[#334155] bg-white dark:bg-[#0f172a] p-4 last:mb-0">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">Activity {i + 1}</p>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-4">
                            {field('Name of Activity', input('text', (participations[i]?.name as string) || '', v => updP(i, 'name', v), 'Name of activity'))}
                            {field('Date', input('date', (participations[i]?.date as string) || '', v => updP(i, 'date', v), 'dd-mm-yyyy'))}
                            {field('Level', select(LEVELS, (participations[i]?.level as string) || '', v => updP(i, 'level', v), 'Level'))}
                            {field('Awards Received', input('text', (participations[i]?.awards as string) || '', v => updP(i, 'awards', v), 'Awards received'))}
                        </div>
                    </div>
                ))}
            </section>

            <section className={sectionCardCls}>
                <h3 className="mb-4 border-b-2 border-[#e05050] pb-2 text-3xl font-semibold text-[#223b60]">Organized Activities</h3>
                <div className="grid grid-cols-1 gap-4 sm:max-w-md">
                    {field('Do you have organized activities?', (
                        <select
                            value={hasOrganizedActivities ? 'yes' : 'no'}
                            onChange={e => setHasOrganizedActivities(e.target.value)}
                            className={inputCls}
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    ))}
                </div>
                {hasOrganizedActivities && (
                    <>
                        <p className="mb-4 text-sm text-[#7a879c]">(Coordinator / Co-Coordinator / Member / etc.)</p>
                        {[0, 1, 2].map(i => (
                            <div key={i} className="mb-4 rounded-xl border border-[#d4dcea] dark:border-[#334155] bg-white dark:bg-[#0f172a] p-4 last:mb-0">
                                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">Activity {i + 1}</p>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-4">
                                    {field('Name of Activity', input('text', (organizations[i]?.name as string) || '', v => updO(i, 'name', v), 'Name of activity'))}
                                    {field('Date', input('date', (organizations[i]?.date as string) || '', v => updO(i, 'date', v), 'dd-mm-yyyy'))}
                                    {field('Level', select(LEVELS, (organizations[i]?.level as string) || '', v => updO(i, 'level', v), 'Level'))}
                                    {field('Remark / Role', input('text', (organizations[i]?.remark as string) || '', v => updO(i, 'remark', v), 'Remark / Role'))}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </section>

            <section className={sectionCardCls}>
                <h3 className="mb-4 border-b-2 border-[#1ea85b] pb-2 text-3xl font-semibold text-[#223b60]">Skill Development Program (SDP) / Training / MOOC</h3>
                <div className="grid grid-cols-1 gap-4 sm:max-w-md">
                    {field('Do you have done SDP / Training / MOOC?', (
                        <select
                            value={hasSkillPrograms ? 'yes' : 'no'}
                            onChange={e => setHasSkillPrograms(e.target.value)}
                            className={inputCls}
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    ))}
                </div>

                {hasSkillPrograms && (
                    <>
                        <p className="mb-4 text-sm text-[#7a879c]">(Online courses, certifications, workshops, training programs)</p>

                        {[0, 1, 2].map(i => (
                            <div key={i} className="mb-4 rounded-xl border border-[#d4dcea] dark:border-[#334155] bg-white dark:bg-[#0f172a] p-4 last:mb-0">
                                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">Program {i + 1}</p>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                                    {field('Program / Course Title', input('text', (programs[i]?.course_title as string) || '', v => updProgram(i, 'course_title', v), i === 0 ? 'e.g. Machine Learning Specialization' : 'Course Title'))}
                                    {field('Organizing Agency / Platform', input('text', (programs[i]?.platform as string) || '', v => updProgram(i, 'platform', v), i === 0 ? 'e.g. Coursera, NPTEL, CDAC' : 'Platform / Agency'))}
                                    {field('Duration (in Hours)', input('number', String(programs[i]?.duration_hours || ''), v => updProgram(i, 'duration_hours', v === '' ? null : Number(v)), 'Hours'))}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">Date From & To</label>
                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            {input('date', (programs[i]?.date_from as string) || '', v => updProgram(i, 'date_from', v), 'dd-mm-yyyy')}
                                            {input('date', (programs[i]?.date_to as string) || '', v => updProgram(i, 'date_to', v), 'dd-mm-yyyy')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </section>
        </div>
    )
}
