import { WizardStepProps, field, input, sectionCardCls, select } from './shared'

export default function Step6ProjectsInternships({ data, update }: WizardStepProps) {
    const projects = (data.projects as Record<string, unknown>[]) || [{}, {}]
    const internships = (data.internships as Record<string, unknown>[]) || [{}, {}]

    const updProject = (i: number, key: string, value: unknown) => {
        const updated = [...projects]
        updated[i] = { ...updated[i], [key]: value }
        update({ projects: updated })
    }
    const updInternship = (i: number, key: string, value: unknown) => {
        const updated = [...internships]
        updated[i] = { ...updated[i], [key]: value }
        update({ internships: updated })
    }

    return (
        <div className="space-y-5">
            <section className={sectionCardCls}>
                <h3 className="mb-4 font-serif text-2xl text-[#20324e]">Projects</h3>
                {[0, 1].map(i => (
                    <div key={i} className="mb-4 rounded-xl border border-[#d4dcea] bg-white p-4 last:mb-0">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">Project {i + 1}</p>
                        <div className="grid grid-cols-1 gap-4">
                            {field('Title', input('text', (projects[i]?.title as string) || '', v => updProject(i, 'title', v)))}
                            {field('Description', input('text', (projects[i]?.description as string) || '', v => updProject(i, 'description', v)))}
                        </div>
                    </div>
                ))}
            </section>

            <section className={sectionCardCls}>
                <h3 className="mb-4 font-serif text-2xl text-[#20324e]">Internships</h3>
                {[0, 1].map(i => (
                    <div key={i} className="mb-4 rounded-xl border border-[#d4dcea] bg-white p-4 last:mb-0">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#5f6f86]">Internship {i + 1}</p>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                            {field('Company', input('text', (internships[i]?.company_name as string) || '', v => updInternship(i, 'company_name', v)))}
                            {field('Domain', input('text', (internships[i]?.domain as string) || '', v => updInternship(i, 'domain', v)))}
                            {field('Type', select(['Online', 'Physical'], (internships[i]?.internship_type as string) || '', v => updInternship(i, 'internship_type', v)))}
                            {field('Paid/Unpaid', select(['Paid', 'Unpaid'], (internships[i]?.paid_unpaid as string) || '', v => updInternship(i, 'paid_unpaid', v)))}
                            {field('Start Date', input('date', (internships[i]?.start_date as string) || '', v => updInternship(i, 'start_date', v)))}
                            {field('End Date', input('date', (internships[i]?.end_date as string) || '', v => updInternship(i, 'end_date', v)))}
                        </div>
                    </div>
                ))}
            </section>
        </div>
    )
}
