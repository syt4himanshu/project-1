const fs = require('fs');
const path = require('path');

const p = (fp) => path.join('d:/All projects and Websites/KYS-final/project-1/kys-frontend/src', fp);

// 1. Step8CareerSkills.tsx
let step8Content = fs.readFileSync(p('modules/student/components/wizard/Step8CareerSkills.tsx'), 'utf8');

const step8TargetCareerGoal = `{field('Career Goal *', (() => {
                        const goalOptions = ['Campus / Off-Campus Placement', 'Higher Studies', 'Entrepreneurship', 'UPSC Civil Services', 'General Government Jobs (SSC CGL, Bank PO/RBI Grade B, PSUs)', 'Research']
                        const goalValue = co.career_goal as string
                        const isCustom = goalValue && !goalOptions.includes(goalValue) && goalValue !== 'Other'
                        const displayValue = isCustom ? 'Other' : (goalValue || '')
                        const showInput = displayValue === 'Other'
                        const validation = getFieldValidation('career_objective.career_goal')
                        return (
                            <div className="flex flex-col gap-4">
                                {select([...goalOptions, 'Other'], displayValue, v => updCo('career_goal', v), 'Select Career Goal', !showInput ? validation : undefined)}
                                {showInput && input('text', isCustom ? goalValue : '', v => updCo('career_goal', v), 'Enter desired career goal', validation)}
                            </div>
                        )
                    })())}`;

const step8ReplacementCareerGoal = `{field('Career Goal *', (() => {
                        const goalOptions = ['Placement', 'Higher Studies', 'Entrepreneurship']
                        const goalValue = co.career_goal as string
                        const isCustomGoal = goalValue && !goalOptions.includes(goalValue) && goalValue !== 'Other'
                        const displayGoal = isCustomGoal ? 'Other' : (goalValue || '')
                        
                        const specificDetailsValue = (co.specific_details as string) || ''
                        let specificOptions: string[] = []
                        if (displayGoal === 'Placement') {
                            specificOptions = ['Core', 'IT', 'Finance', 'Management', 'Government or Public Sector', 'Other']
                        } else if (displayGoal === 'Higher Studies') {
                            specificOptions = ['Technical (GATE)', 'Management (CAT)', 'Other in India', 'Abroad']
                        }
                        
                        const isCustomSpecific = specificDetailsValue && !specificOptions.includes(specificDetailsValue) && specificDetailsValue !== 'Other'
                        const displaySpecific = isCustomSpecific ? 'Other' : (specificDetailsValue || '')
                        
                        const showCustomGoalInput = displayGoal === 'Other'
                        const showCustomSpecificInput = specificOptions.length > 0 && displaySpecific === 'Other'

                        return (
                            <div className="flex flex-col gap-4">
                                {select([...goalOptions, 'Other'], displayGoal, v => {
                                    updCo('career_goal', v)
                                    if (v !== displayGoal) updCo('specific_details', '')
                                }, 'Select Career Goal', getFieldValidation('career_objective.career_goal'))}
                                
                                {showCustomGoalInput && input('text', isCustomGoal ? goalValue : '', v => updCo('career_goal', v), 'Enter desired career goal', getFieldValidation('career_objective.career_goal'))}

                                {specificOptions.length > 0 && (
                                    <>
                                        <label className="-mb-2 block text-sm font-semibold text-[#3a4a62]">Specific Goal *</label>
                                        {select(specificOptions, displaySpecific, v => updCo('specific_details', v), 'Select Specific Goal')}
                                        {showCustomSpecificInput && input('text', isCustomSpecific ? specificDetailsValue : '', v => updCo('specific_details', v), 'Enter desired specific goal')}
                                    </>
                                )}
                            </div>
                        )
                    })())}`;

step8Content = step8Content.replace(step8TargetCareerGoal, step8ReplacementCareerGoal);

const step8TargetSpecificDetails = `{field('Specific Details / Notes', (
                        <textarea
                            value={(co.specific_details as string) || ''}
                            onChange={e => updCo('specific_details', e.target.value)}
                            rows={3}
                            placeholder='e.g. Full stack development and placement-focused preparation'
                            className={textareaCls}
                        />
                    ))}`;

step8Content = step8Content.replace(step8TargetSpecificDetails, "");
fs.writeFileSync(p('modules/student/components/wizard/Step8CareerSkills.tsx'), step8Content);

// 2. Step9CareerSkills.tsx
let step9Content = fs.readFileSync(p('modules/student/components/wizard/Step9CareerSkills.tsx'), 'utf8');
const step9TargetCareerGoal = `{field('Career Goal', select(['Higher Studies', 'Job', 'Entrepreneurship', 'Research', 'Other'],
                        (co.career_goal as string) || '', v => updCo('career_goal', v)))}
                    {field('Clarity & Preparedness', select(['Very Clear', 'Somewhat Clear', 'Not Sure'],
                        (co.clarity_preparedness as string) || '', v => updCo('clarity_preparedness', v)))}
                    <div className="sm:col-span-2">
                        {field('Specific Details', (
                            <textarea value={(co.specific_details as string) || ''} onChange={e => updCo('specific_details', e.target.value)}
                                rows={3} className={textareaCls} />
                        ))}
                    </div>`;

const step9ReplacementCareerGoal = `{field('Career Goal', (() => {
                        const goalOptions = ['Placement', 'Higher Studies', 'Entrepreneurship']
                        const goalValue = co.career_goal as string
                        const isCustomGoal = goalValue && !goalOptions.includes(goalValue) && goalValue !== 'Other'
                        const displayGoal = isCustomGoal ? 'Other' : (goalValue || '')
                        
                        const specificDetailsValue = (co.specific_details as string) || ''
                        let specificOptions: string[] = []
                        if (displayGoal === 'Placement') {
                            specificOptions = ['Core', 'IT', 'Finance', 'Management', 'Government or Public Sector', 'Other']
                        } else if (displayGoal === 'Higher Studies') {
                            specificOptions = ['Technical (GATE)', 'Management (CAT)', 'Other in India', 'Abroad']
                        }
                        
                        const isCustomSpecific = specificDetailsValue && !specificOptions.includes(specificDetailsValue) && specificDetailsValue !== 'Other'
                        const displaySpecific = isCustomSpecific ? 'Other' : (specificDetailsValue || '')
                        
                        const showCustomGoalInput = displayGoal === 'Other'
                        const showCustomSpecificInput = specificOptions.length > 0 && displaySpecific === 'Other'

                        return (
                            <div className="flex flex-col gap-4">
                                {select([...goalOptions, 'Other'], displayGoal, v => {
                                    updCo('career_goal', v)
                                    if (v !== displayGoal) updCo('specific_details', '')
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
                        (co.clarity_preparedness as string) || '', v => updCo('clarity_preparedness', v)))}`;

step9Content = step9Content.replace(step9TargetCareerGoal, step9ReplacementCareerGoal);
fs.writeFileSync(p('modules/student/components/wizard/Step9CareerSkills.tsx'), step9Content);

console.log('Career goals updated.');
