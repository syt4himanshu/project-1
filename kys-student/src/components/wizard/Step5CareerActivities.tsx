import { WizardStepProps, field, input, sectionCardCls } from './shared'

export default function Step5CareerActivities({ data, update }: WizardStepProps) {
    const activities = (data.career_activities as Record<string, unknown>[]) || [{}, {}, {}]
    const upd = (i: number, key: string, value: unknown) => {
        const updated = [...activities]
        updated[i] = { ...updated[i], [key]: value }
        update({ career_activities: updated })
    }

    return (
        <div className="space-y-5">
            {[0, 1, 2].map(i => (
                <section key={i} className={sectionCardCls}>
                    <h3 className="mb-4 font-serif text-2xl text-[#20324e]">Activity {i + 1}</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                        {field('Activity Name', input('text', (activities[i]?.activity_name as string) || '', v => upd(i, 'activity_name', v)))}
                        {field('Score / Rank', input('text', (activities[i]?.score_rank as string) || '', v => upd(i, 'score_rank', v)))}
                        {field('Exam Date', input('date', (activities[i]?.exam_date as string) || '', v => upd(i, 'exam_date', v)))}
                    </div>
                </section>
            ))}
        </div>
    )
}
