const fs = require('fs');
const path = require('path');

const p = path.join('d:/All projects and Websites/KYS-final/project-1/kys-frontend/src', 'modules/student/components/wizard/Step9CareerSkills.tsx');

let content = fs.readFileSync(p, 'utf8');

// 1. Replace Career Goal & Specific Details
const target1 = `{field('Career Goal', select(['Higher Studies', 'Job', 'Entrepreneurship', 'Research', 'Other'],
                        (co.career_goal as string) || '', v => updCo('career_goal', v)))}
                    {field('Clarity & Preparedness', select(['Very Clear', 'Somewhat Clear', 'Not Sure'],
                        (co.clarity_preparedness as string) || '', v => updCo('clarity_preparedness', v)))}
                    <div className="sm:col-span-2">
                        {field('Specific Details', (
                            <textarea value={(co.specific_details as string) || ''} onChange={e => updCo('specific_details', e.target.value)}
                                rows={3} className={textareaCls} />
                        ))}
                    </div>`;

const replacement1 = `{field('Career Goal', (() => {
                        const goalOptions = ['Placement', 'Higher Studies', 'Entrepreneurship']
                        const goalValue = co.career_goal as string
                        const isCustomGoal = goalValue && !goalOptions.includes(goalValue) && goalValue !== 'Other'
                        const displayGoal = isCustomGoal ? 'Other' : (goalValue || '')
                        
                        const specificDetailsValue = (co.specific_details as string) || ''
                        let specificOptions = []
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

content = content.replace(target1, replacement1);

// 2. Replace Technologies & Frameworks
const target2 = `{field('Technologies & Frameworks', input('text', (sk.technologies_frameworks as string) || '', v => updSk('technologies_frameworks', v), 'React, Node.js'))}`;
const replacement2 = `{field('Frontend technologies & frameworks', input('text', (sk.frontend_technologies_frameworks as string) || '', v => updSk('frontend_technologies_frameworks', v), 'React, Vue, HTML, CSS'))}
                    {field('Backend technologies & Databases', input('text', (sk.backend_technologies_databases as string) || '', v => updSk('backend_technologies_databases', v), 'Node.js, Python, PostgreSQL'))}`;

content = content.replace(target2, replacement2);

fs.writeFileSync(p, content);

console.log('Step9CareerSkills updated.');
