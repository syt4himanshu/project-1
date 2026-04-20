import { useStudentProfileDraft } from '../../hooks/useStudentProfileWizard'
import { field, sectionCardCls, select, textareaCls } from './shared'

const DOMAINS = ['Web Development', 'Machine Learning', 'Artificial Intelligence', 'Data Science', 'Cyber Security', 'Cloud Computing', 'Mobile Development', 'Other']
const NON_TECH_AREAS = ['Cultural Activities', 'Sports', 'Literary / Debate', 'Social Service / NSS', 'Other']

function parseCsv(value: unknown) {
    return String(value || '').split(',').map(v => v.trim()).filter(Boolean)
}

function toggleCsv(values: string[], item: string) {
    if (values.includes(item)) return values.filter(v => v !== item)
    return [...values, item]
}

export default function Step8CareerSkills() {
    const { data, update } = useStudentProfileDraft()
    const co = (data.career_objective as Record<string, unknown>) || {}
    const sk = (data.skills as Record<string, unknown>) || {}

    const updCo = (k: string, v: unknown) => update({ career_objective: { ...co, [k]: v } })
    const updSk = (k: string, v: unknown) => update({ skills: { ...sk, [k]: v } })

    const selectedDomains = parseCsv(sk.domains_of_interest)
    const selectedNonTechAreas = parseCsv(co.non_technical_areas)

    const interested = co.interested_in_campus_placement === true ? 'Yes' : co.interested_in_campus_placement === false ? 'No' : ''

    return (
        <div className="space-y-5">
            <section className={sectionCardCls}>
                <div className="space-y-4">
                    {field('Career Goal *', select(['Campus / Off-Campus Placement', 'Higher Studies', 'Entrepreneurship'], (co.career_goal as string) || '', v => updCo('career_goal', v), 'Select Career Goal'))}

                    {field('Specific Details / Notes', (
                        <textarea
                            value={(co.specific_details as string) || ''}
                            onChange={e => updCo('specific_details', e.target.value)}
                            rows={3}
                            placeholder='e.g. Full stack development and placement-focused preparation'
                            className={textareaCls}
                        />
                    ))}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                        {field('Clarity and Preparedness Level *', select(['Unsatisfactory', 'Satisfactory', 'Good', 'Excellent'], (co.clarity_preparedness as string) || '', v => updCo('clarity_preparedness', v), 'Select Level'))}
                        {field('Interested in Campus Placement? *', select(['Yes', 'No'], interested, v => updCo('interested_in_campus_placement', v === 'Yes' ? true : v === 'No' ? false : null), 'Select Option'))}
                    </div>

                    <div>
                        <label className="mb-2 block border-b border-[#b6cbe7] pb-1 text-3xl font-semibold text-[#223b60]">Areas of Interest (Other than Technical)</label>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {NON_TECH_AREAS.map(area => {
                                const active = selectedNonTechAreas.includes(area)
                                return (
                                    <button
                                        key={area}
                                        type="button"
                                        onClick={() => updCo('non_technical_areas', toggleCsv(selectedNonTechAreas, area).join(', '))}
                                        className={`rounded-xl border px-4 py-2 text-sm transition ${active
                                            ? 'border-[#1f355f] bg-[#1f355f] text-white'
                                            : 'border-[#cfd7e4] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[#3a4a62] dark:text-[#cbd5e1] hover:border-[#3e5f93]'
                                            }`}
                                    >
                                        {area}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {field('Would you be interested in being a student mentor?', select(['Yes', 'No', 'Maybe'], (co.student_mentor_interest as string) || '', v => updCo('student_mentor_interest', v), 'Select Option'))}

                    {field('Expectations from the Institute', (
                        <textarea
                            value={(co.expectations_from_institute as string) || ''}
                            onChange={e => updCo('expectations_from_institute', e.target.value)}
                            rows={3}
                            placeholder='What do you expect from the institute to support your career goals?'
                            className={textareaCls}
                        />
                    ))}
                </div>
            </section>

            <section className={sectionCardCls}>
                <h3 className="mb-4 border-b-2 border-[#3b8ed9] pb-2 text-3xl font-semibold text-[#223b60]">Skills</h3>
                <div className="space-y-4">
                    {field('Technical & Soft Skills (Overall)', (
                        <textarea
                            value={(sk.technical_soft_skills_overall as string) || ''}
                            onChange={e => updSk('technical_soft_skills_overall', e.target.value)}
                            rows={3}
                            placeholder='List your key technical and soft skills'
                            className={textareaCls}
                        />
                    ))}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                        {field('Additional Technical Skills', (
                            <textarea
                                value={(sk.additional_technical_skills as string) || ''}
                                onChange={e => updSk('additional_technical_skills', e.target.value)}
                                rows={3}
                                placeholder='Any additional technical skills not covered above'
                                className={textareaCls}
                            />
                        ))}

                        {field('Additional Soft Skills', (
                            <textarea
                                value={(sk.additional_soft_skills as string) || ''}
                                onChange={e => updSk('additional_soft_skills', e.target.value)}
                                rows={3}
                                placeholder='Any additional soft skills (e.g. Leadership, Communication)'
                                className={textareaCls}
                            />
                        ))}
                    </div>

                    {field('Programming Languages', (
                        <textarea
                            value={(sk.programming_languages as string) || ''}
                            onChange={e => updSk('programming_languages', e.target.value)}
                            rows={3}
                            placeholder='e.g. JavaScript, Python, C, C++'
                            className={textareaCls}
                        />
                    ))}

                    {field('Technologies & Frameworks', (
                        <textarea
                            value={(sk.technologies_frameworks as string) || ''}
                            onChange={e => updSk('technologies_frameworks', e.target.value)}
                            rows={3}
                            placeholder='e.g. HTML, CSS, ReactJS, Node.js, Firebase'
                            className={textareaCls}
                        />
                    ))}

                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">Domains of Interest *</label>
                        <div className="flex flex-wrap gap-2">
                            {DOMAINS.map(domain => {
                                const active = selectedDomains.includes(domain)
                                return (
                                    <button
                                        key={domain}
                                        type="button"
                                        onClick={() => updSk('domains_of_interest', toggleCsv(selectedDomains, domain).join(', '))}
                                        className={`rounded-xl border px-4 py-2 text-sm transition ${active
                                            ? 'border-[#1f355f] bg-[#1f355f] text-white'
                                            : 'border-[#cfd7e4] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[#3a4a62] dark:text-[#cbd5e1] hover:border-[#3e5f93]'
                                            }`}
                                    >
                                        {domain}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {field('Familiar Tools & Platforms', (
                        <textarea
                            value={(sk.familiar_tools_platforms as string) || ''}
                            onChange={e => updSk('familiar_tools_platforms', e.target.value)}
                            rows={3}
                            placeholder='e.g. Postman, Git, VS Code, Figma'
                            className={textareaCls}
                        />
                    ))}
                </div>
            </section>
        </div>
    )
}
