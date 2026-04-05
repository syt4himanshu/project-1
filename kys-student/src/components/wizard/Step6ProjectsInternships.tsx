import { WizardStepProps, field, input, select } from './shared'

export default function Step6ProjectsInternships({ data, update }: WizardStepProps) {
    const projects = (data.projects as Record<string, unknown>[]) || [{}, {}]
    const internships = (data.internships as Record<string, unknown>[]) || [{}, {}]

    const updProject = (i: number, key: string, value: unknown) => {
        const updated = [...projects]; updated[i] = { ...updated[i], [key]: value }
        update({ projects: updated })
    }
    const updInternship = (i: number, key: string, value: unknown) => {
        const updated = [...internships]; updated[i] = { ...updated[i], [key]: value }
        update({ internships: updated })
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Projects</h3>
                {[0, 1].map(i => (
                    <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Project {i + 1}</p>
                        <div className="grid grid-cols-1 gap-4">
                            {field('Title', input('text', (projects[i]?.title as string) || '', v => updProject(i, 'title', v)))}
                            {field('Description', input('text', (projects[i]?.description as string) || '', v => updProject(i, 'description', v)))}
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Internships</h3>
                {[0, 1].map(i => (
                    <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Internship {i + 1}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {field('Company', input('text', (internships[i]?.company_name as string) || '', v => updInternship(i, 'company_name', v)))}
                            {field('Domain', input('text', (internships[i]?.domain as string) || '', v => updInternship(i, 'domain', v)))}
                            {field('Type', select(['Online', 'Physical'], (internships[i]?.internship_type as string) || '', v => updInternship(i, 'internship_type', v)))}
                            {field('Paid/Unpaid', select(['Paid', 'Unpaid'], (internships[i]?.paid_unpaid as string) || '', v => updInternship(i, 'paid_unpaid', v)))}
                            {field('Start Date', input('date', (internships[i]?.start_date as string) || '', v => updInternship(i, 'start_date', v)))}
                            {field('End Date', input('date', (internships[i]?.end_date as string) || '', v => updInternship(i, 'end_date', v)))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
