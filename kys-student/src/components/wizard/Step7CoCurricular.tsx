import { WizardStepProps, field, input, sectionCardCls } from './shared'

export default function Step7CoCurricular({ data, update }: WizardStepProps) {
    const participations = (data.cocurricular_participations as Record<string, unknown>[]) || [{}, {}, {}]
    const organizations = (data.cocurricular_organizations as Record<string, unknown>[]) || [{}, {}, {}]

    const updP = (i: number, key: string, value: unknown) => {
        const updated = [...participations]
        updated[i] = { ...updated[i], [key]: value }
        update({ cocurricular_participations: updated })
    }
    const updO = (i: number, key: string, value: unknown) => {
        const updated = [...organizations]
        updated[i] = { ...updated[i], [key]: value }
        update({ cocurricular_organizations: updated })
    }

    return (
        <div className="space-y-5">
            <section className={sectionCardCls}>
                <h3 className="mb-4 font-serif text-2xl text-[#20324e]">Participation</h3>
                {[0, 1, 2].map(i => (
                    <div key={i} className="mb-4 rounded-xl border border-[#d4dcea] bg-white p-4 last:mb-0">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">Entry {i + 1}</p>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                            {field('Name', input('text', (participations[i]?.name as string) || '', v => updP(i, 'name', v)))}
                            {field('Date', input('date', (participations[i]?.date as string) || '', v => updP(i, 'date', v)))}
                            {field('Level', input('text', (participations[i]?.level as string) || '', v => updP(i, 'level', v), 'e.g. State, National'))}
                            {field('Awards', input('text', (participations[i]?.awards as string) || '', v => updP(i, 'awards', v)))}
                        </div>
                    </div>
                ))}
            </section>

            <section className={sectionCardCls}>
                <h3 className="mb-4 font-serif text-2xl text-[#20324e]">Organization</h3>
                {[0, 1, 2].map(i => (
                    <div key={i} className="mb-4 rounded-xl border border-[#d4dcea] bg-white p-4 last:mb-0">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">Entry {i + 1}</p>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                            {field('Name', input('text', (organizations[i]?.name as string) || '', v => updO(i, 'name', v)))}
                            {field('Date', input('date', (organizations[i]?.date as string) || '', v => updO(i, 'date', v)))}
                            {field('Level', input('text', (organizations[i]?.level as string) || '', v => updO(i, 'level', v)))}
                            {field('Remark', input('text', (organizations[i]?.remark as string) || '', v => updO(i, 'remark', v)))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    )
}
