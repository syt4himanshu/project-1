import { WizardStepProps, field, input, select, textareaCls } from './shared'

const DOMAINS = ['Web Dev', 'ML', 'AI', 'Data Science', 'Cyber Security', 'Other']

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

    const interestedInCampusPlacement = Boolean(co.interested_in_campus_placement)

    return (
        <div className="space-y-5">
            <section className="rounded-2xl border border-[#d6deea] bg-[#f7f9fc] p-4 sm:p-5">
                <h3 className="mb-4 font-serif text-2xl text-[#20324e]">Career Objective</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
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
                    <div className="sm:col-span-2">
                        <label className="inline-flex items-center gap-3 rounded-xl border border-[#d4dcea] bg-white px-4 py-3 text-sm text-[#334155]">
                            <input
                                type="checkbox"
                                id="campus"
                                checked={interestedInCampusPlacement}
                                onChange={e => updCo('interested_in_campus_placement', e.target.checked)}
                                className="h-4 w-4 rounded border-[#9fb0c8] text-[#234574]"
                            />
                            Interested in Campus Placement
                        </label>
                    </div>
                    {interestedInCampusPlacement && (
                        <div className="sm:col-span-2">
                            {field('Placement Reasons', (
                                <textarea value={(co.campus_placement_reasons as string) || ''} onChange={e => updCo('campus_placement_reasons', e.target.value)}
                                    rows={2} className={textareaCls} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="rounded-2xl border border-[#d6deea] bg-[#f7f9fc] p-4 sm:p-5">
                <h3 className="mb-4 font-serif text-2xl text-[#20324e]">Skills</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    {field('Programming Languages', input('text', (sk.programming_languages as string) || '', v => updSk('programming_languages', v), 'Python, Java, C++'))}
                    {field('Technologies & Frameworks', input('text', (sk.technologies_frameworks as string) || '', v => updSk('technologies_frameworks', v), 'React, Node.js'))}
                    {field('Familiar Tools & Platforms', input('text', (sk.familiar_tools_platforms as string) || '', v => updSk('familiar_tools_platforms', v), 'Git, Docker'))}
                    <div className="sm:col-span-2">
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">Domains of Interest</label>
                        <div className="flex flex-wrap gap-2">
                            {DOMAINS.map(d => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => toggleDomain(d)}
                                    className={`rounded-full border px-3 py-1.5 text-sm transition ${selectedDomains.includes(d)
                                        ? 'border-[#234574] bg-[#234574] text-white'
                                        : 'border-[#cfd7e4] bg-white text-[#3a4a62] hover:border-[#3e5f93]'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
