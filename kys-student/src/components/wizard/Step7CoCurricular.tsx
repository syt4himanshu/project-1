import { WizardStepProps, field, input } from './shared'

export default function Step7CoCurricular({ data, update }: WizardStepProps) {
    const participations = (data.cocurricular_participations as Record<string, unknown>[]) || [{}, {}, {}]
    const organizations = (data.cocurricular_organizations as Record<string, unknown>[]) || [{}, {}, {}]

    const updP = (i: number, key: string, value: unknown) => {
        const updated = [...participations]; updated[i] = { ...updated[i], [key]: value }
        update({ cocurricular_participations: updated })
    }
    const updO = (i: number, key: string, value: unknown) => {
        const updated = [...organizations]; updated[i] = { ...updated[i], [key]: value }
        update({ cocurricular_organizations: updated })
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Participation</h3>
                {[0, 1, 2].map(i => (
                    <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Entry {i + 1}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {field('Name', input('text', (participations[i]?.name as string) || '', v => updP(i, 'name', v)))}
                            {field('Date', input('date', (participations[i]?.date as string) || '', v => updP(i, 'date', v)))}
                            {field('Level', input('text', (participations[i]?.level as string) || '', v => updP(i, 'level', v), 'e.g. State, National'))}
                            {field('Awards', input('text', (participations[i]?.awards as string) || '', v => updP(i, 'awards', v)))}
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Organization</h3>
                {[0, 1, 2].map(i => (
                    <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Entry {i + 1}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {field('Name', input('text', (organizations[i]?.name as string) || '', v => updO(i, 'name', v)))}
                            {field('Date', input('date', (organizations[i]?.date as string) || '', v => updO(i, 'date', v)))}
                            {field('Level', input('text', (organizations[i]?.level as string) || '', v => updO(i, 'level', v)))}
                            {field('Remark', input('text', (organizations[i]?.remark as string) || '', v => updO(i, 'remark', v)))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
