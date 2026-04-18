import { useStudentProfileDraft } from '../../hooks/useStudentProfileWizard'
import { field, sectionCardCls, textareaCls } from './shared'

export default function Step7SWOC() {
    const { data, update } = useStudentProfileDraft()
    const swoc = (data.swoc as Record<string, unknown>) || {}
    const upd = (k: string, v: string) => update({ swoc: { ...swoc, [k]: v } })

    return (
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
    )
}
