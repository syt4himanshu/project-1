import { WizardStepProps, field, input, select } from './shared'

const DOMAINS = ['Web Dev', 'ML', 'AI', 'Data Science', 'Cyber Security', 'Other']
const textareaCls = 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'

export default function Step9CareerSkills({ data, update }: WizardStepProps) {
    const co = (data.career_objective as Record<string, unknown>) || {}
    const sk = (data.skills as Record<string, unknown>) || {}
    const updCo = (k: string, v: unknown) => update({ career_objective: { ...co, [k]: v } })
    const updSk = (k: string, v: unknown) => update({ skills: { ...sk, [k]: v } })

    const selectedDomains = ((sk.domains_of_interest as string) || '').split(',').map(s => s.trim()).filter(Boolean)
    const toggleDomain = (d: string) => {
        const updated = selectedDomains.includes(d) ? selectedDomains.filter(x => x !== d) : [...selectedDomains, d]
        updSk('domains_of_interest', updated.join(', '))
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Career Objective</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {field('Career Goal', select(['Higher Studies', 'Job', 'Entrepreneurship', 'Research', 'Other'],
                        (co.career_goal as string) || '', v => updCo('career_goal', v)))}
                    {field('Clarity & Preparedness', select(['Very Clear', 'Somewhat Clear', 'Not Sure'],
                        (co.clarity_preparedness as string) || '', v => updCo('clarity_preparedness', v)))}
                    <div className="sm:col-span-2">
                        {field('Specific Details', (
                            <textarea value={(co.specific_details as string) || ''} onChange={e => updCo('specific_details', e.target.value)}
                                rows={3} className={textareaCls} />
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="campus" checked={Boolean(co.interested_in_campus_placement)}
                            onChange={e => updCo('interested_in_campus_placement', e.target.checked)}
                            className="w-4 h-4 text-blue-600" />
                        <label htmlFor="campus" className="text-sm text-gray-700 dark:text-gray-300">Interested in Campus Placement</label>
                    </div>
                    {co.interested_in_campus_placement && (
                        <div className="sm:col-span-2">
                            {field('Placement Reasons', (
                                <textarea value={(co.campus_placement_reasons as string) || ''} onChange={e => updCo('campus_placement_reasons', e.target.value)}
                                    rows={2} className={textareaCls} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Skills</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {field('Programming Languages', input('text', (sk.programming_languages as string) || '', v => updSk('programming_languages', v), 'Python, Java, C++'))}
                    {field('Technologies & Frameworks', input('text', (sk.technologies_frameworks as string) || '', v => updSk('technologies_frameworks', v), 'React, Node.js'))}
                    {field('Familiar Tools & Platforms', input('text', (sk.familiar_tools_platforms as string) || '', v => updSk('familiar_tools_platforms', v), 'Git, Docker'))}
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Domains of Interest</label>
                        <div className="flex flex-wrap gap-2">
                            {DOMAINS.map(d => (
                                <button key={d} type="button" onClick={() => toggleDomain(d)}
                                    className={`px-3 py-1 rounded-full text-sm border transition ${selectedDomains.includes(d) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400'}`}>
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
