import { useStudentProfileDraft } from '../../hooks/useStudentProfileWizard'
import { field, sectionCardCls, textareaCls } from './shared'
import Step8CareerSkills from './Step8CareerSkills'

export default function Step7SWOC() {
    const { data, update } = useStudentProfileDraft()
    const swoc = (data.swoc as Record<string, unknown>) || {}
    const upd = (k: string, v: string) => update({ swoc: { ...swoc, [k]: v } })

    return (
        <div className="space-y-5">
            <section className={sectionCardCls}>
                <div className="space-y-4">
                    {field('Strengths *', (
                        <textarea
                            value={(swoc.strengths as string) || ''}
                            onChange={e => upd('strengths', e.target.value)}
                            rows={4}
                            placeholder='e.g. Team player, leadership, communication'
                            className={textareaCls}
                        />
                    ))}

                    {field('Weaknesses / Areas of Improvement *', (
                        <textarea
                            value={(swoc.weaknesses as string) || ''}
                            onChange={e => upd('weaknesses', e.target.value)}
                            rows={4}
                            placeholder='e.g. Multitasking, time management'
                            className={textareaCls}
                        />
                    ))}

                    {field('Opportunities *', (
                        <textarea
                            value={(swoc.opportunities as string) || ''}
                            onChange={e => upd('opportunities', e.target.value)}
                            rows={4}
                            placeholder='e.g. Projects, internships, hackathons'
                            className={textareaCls}
                        />
                    ))}

                    {field('Challenges *', (
                        <textarea
                            value={(swoc.challenges as string) || ''}
                            onChange={e => upd('challenges', e.target.value)}
                            rows={4}
                            placeholder='e.g. Academics, balancing personal projects'
                            className={textareaCls}
                        />
                    ))}
                </div>
            </section>

            <div className="mb-6">
                <h2 className="font-serif text-3xl font-semibold text-[var(--text)] sm:text-4xl">Career Objectives and Skills</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)] sm:text-base">Share your career goals and skills assessment</p>
            </div>

            <div className="rounded-2xl border-0 bg-transparent p-0">
                <Step8CareerSkills />
            </div>
        </div>
    )
}
