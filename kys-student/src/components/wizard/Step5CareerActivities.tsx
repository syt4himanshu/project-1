import { WizardStepProps, field, input } from './shared'

export default function Step5CareerActivities({ data, update }: WizardStepProps) {
    const activities = (data.career_activities as Record<string, unknown>[]) || [{}, {}, {}]
    const upd = (i: number, key: string, value: unknown) => {
        const updated = [...activities]
        updated[i] = { ...updated[i], [key]: value }
        update({ career_activities: updated })
    }

    return (
        <div className="space-y-4">
            {[0, 1, 2].map(i => (
                <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Activity {i + 1}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {field('Activity Name', input('text', (activities[i]?.activity_name as string) || '', v => upd(i, 'activity_name', v)))}
                        {field('Score / Rank', input('text', (activities[i]?.score_rank as string) || '', v => upd(i, 'score_rank', v)))}
                        {field('Exam Date', input('date', (activities[i]?.exam_date as string) || '', v => upd(i, 'exam_date', v)))}
                    </div>
                </div>
            ))}
        </div>
    )
}
