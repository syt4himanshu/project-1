import { WizardStepProps, field, textareaCls } from './shared'

export default function Step8SWOC({ data, update }: WizardStepProps) {
    const swoc = (data.swoc as Record<string, unknown>) || {}
    const upd = (k: string, v: string) => update({ swoc: { ...swoc, [k]: v } })

    const items = [
        { key: 'strengths', label: 'Strengths' },
        { key: 'weaknesses', label: 'Weaknesses' },
        { key: 'opportunities', label: 'Opportunities' },
        { key: 'challenges', label: 'Challenges' },
    ]

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {items.map(({ key, label }) => (
                <div key={key} className="rounded-2xl border border-[#d6deea] dark:border-[#334155] bg-[#f7f9fc] dark:bg-[#1e293b] p-4">
                    {field(label, (
                        <textarea
                            value={(swoc[key] as string) || ''}
                            onChange={e => upd(key, e.target.value)}
                            rows={4}
                            placeholder={`Enter your ${label.toLowerCase()}...`}
                            className={textareaCls}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}
