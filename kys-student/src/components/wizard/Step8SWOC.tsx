import { WizardStepProps, field } from './shared'

const textareaCls = 'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'

export default function Step8SWOC({ data, update }: WizardStepProps) {
    const swoc = (data.swoc as Record<string, unknown>) || {}
    const upd = (k: string, v: string) => update({ swoc: { ...swoc, [k]: v } })

    const items = [
        { key: 'strengths', label: 'Strengths', color: 'green' },
        { key: 'weaknesses', label: 'Weaknesses', color: 'red' },
        { key: 'opportunities', label: 'Opportunities', color: 'blue' },
        { key: 'challenges', label: 'Challenges', color: 'orange' },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map(({ key, label }) => (
                <div key={key}>
                    {field(label, (
                        <textarea value={(swoc[key] as string) || ''} onChange={e => upd(key, e.target.value)}
                            rows={4} placeholder={`Enter your ${label.toLowerCase()}…`} className={textareaCls} />
                    ))}
                </div>
            ))}
        </div>
    )
}
