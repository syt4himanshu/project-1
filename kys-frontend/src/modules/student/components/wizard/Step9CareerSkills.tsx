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
            <section className="rounded-2xl border border-[#d6deea] dark:border-[#334155] bg-[#f7f9fc] dark:bg-slate-800 p-4 sm:p-5">
                <h3 className="mb-4 font-serif text-2xl text-[#20324e]">Career Objective</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    {field('Career Goal', (() => {
                        const goalOptions = ['Placement', 'Higher Studies', 'Entrepreneurship', 'Government Jobs and Exams']
                        const goalValue = co.career_goal as string
                        const isCustomGoal = goalValue && !goalOptions.includes(goalValue) && goalValue !== 'Other'
                        const displayGoal = isCustomGoal ? 'Other' : (goalValue || '')
                        
                        const specificDetailsValue = (co.specific_details as string) || ''
                        let specificOptions: string[] = []
                        if (displayGoal === 'Placement') {
                            specificOptions = ['Core', 'IT', 'Finance', 'Management', 'Government or Public Sector', 'Other']
                        } else if (displayGoal === 'Higher Studies') {
                            specificOptions = ['Technical (GATE)', 'Management (CAT)', 'Other in India', 'Abroad']
                        } else if (displayGoal === 'Government Jobs and Exams') {
                            specificOptions = ['Government Jobs (SSC CGL, Banking PO/RBI GRADE B, PSUs)', 'UPSC Civil Services', 'Other']
                        }
                        
                        const isCustomSpecific = specificDetailsValue && !specificOptions.includes(specificDetailsValue) && specificDetailsValue !== 'Other'
                        const displaySpecific = isCustomSpecific ? 'Other' : (specificDetailsValue || '')
                        
                        const showCustomGoalInput = displayGoal === 'Other'
                        const showCustomSpecificInput = specificOptions.length > 0 && displaySpecific === 'Other'

                        return (
                            <div className="flex flex-col gap-4">
                                {select([...goalOptions, 'Other'], displayGoal, v => {
                                    const updates: Record<string, unknown> = { career_goal: v }
                                    if (v !== displayGoal) updates.specific_details = ''
                                    update({ career_objective: { ...co, ...updates } })
                                })}
                                
                                {showCustomGoalInput && input('text', isCustomGoal ? goalValue : '', v => updCo('career_goal', v))}

                                {specificOptions.length > 0 && (
                                    <>
                                        {select(specificOptions, displaySpecific, v => updCo('specific_details', v), 'Select Specific Goal')}
                                        {showCustomSpecificInput && input('text', isCustomSpecific ? specificDetailsValue : '', v => updCo('specific_details', v))}
                                    </>
                                )}
                            </div>
                        )
                    })())}
                    {field('Clarity & Preparedness', select(['Very Clear', 'Somewhat Clear', 'Not Sure'],
                        (co.clarity_preparedness as string) || '', v => updCo('clarity_preparedness', v)))}
                    <div className="sm:col-span-2">
                        <label className="inline-flex items-center gap-3 rounded-xl border border-[#d4dcea] dark:border-[#334155] bg-white dark:bg-slate-900 px-4 py-3 text-sm text-[#334155] dark:text-[#cbd5e1]">
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

            <section className="rounded-2xl border border-[#d6deea] dark:border-[#334155] bg-[#f7f9fc] dark:bg-slate-800 p-4 sm:p-5">
                <h3 className="mb-4 font-serif text-2xl text-[#20324e]">Skills</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    {field('Programming Languages', input('text', (sk.programming_languages as string) || '', v => updSk('programming_languages', v), 'Python, Java, C++'))}
                    {field('Frontend technologies & frameworks', input('text', (sk.frontend_technologies_frameworks as string) || '', v => updSk('frontend_technologies_frameworks', v), 'React, Vue, HTML, CSS'))}
                    {field('Backend technologies & Databases', input('text', (sk.backend_technologies_databases as string) || '', v => updSk('backend_technologies_databases', v), 'Node.js, Python, PostgreSQL'))}
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
                                        : 'border-[#cfd7e4] dark:border-[#334155] bg-white dark:bg-slate-800 text-[#3a4a62] dark:text-[#cbd5e1] hover:border-[#3e5f93]'
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
