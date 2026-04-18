import { useStudentProfileDraft } from '../../hooks/useStudentProfileWizard'
import { field, input, sectionCardCls, select } from './shared'

export default function Step5ProjectsInternships() {
    const { data, update } = useStudentProfileDraft()
    const projects = (data.projects as Record<string, unknown>[]) || [{}, {}, {}]
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
                <h3 className="mb-4 border-b-2 border-[#1ea85b] pb-2 text-3xl font-semibold text-[#223b60]">Mini Project</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    {field('Mini Project Title', input('text', (projects[0]?.title as string) || '', v => updProject(0, 'title', v), 'e.g. Hostel Payment System'))}
                    {field('Project Guide', input('text', (projects[0]?.description as string) || '', v => updProject(0, 'description', v), 'Name of project guide / mentor'))}
                </div>
            </section>

            <section className={sectionCardCls}>
                <h3 className="mb-4 border-b-2 border-[#3b8ed9] pb-2 text-3xl font-semibold text-[#223b60]">Major Project</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    {field('Major Project Title', input('text', (projects[1]?.title as string) || '', v => updProject(1, 'title', v), 'e.g. Know Your Student System'))}
                    {field('Project Guide', input('text', (projects[1]?.description as string) || '', v => updProject(1, 'description', v), 'Name of project guide / mentor'))}
                </div>
            </section>

            <section className={sectionCardCls}>
                <h3 className="mb-4 border-b-2 border-[#b06bd8] pb-2 text-3xl font-semibold text-[#223b60]">UBA / Collaborative Project (if applicable)</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    {field('UBA Project Title', input('text', (projects[2]?.title as string) || '', v => updProject(2, 'title', v), 'Enter UBA / collaborative project title'))}
                    {field('Project Guide', input('text', (projects[2]?.description as string) || '', v => updProject(2, 'description', v), 'Name of project guide / mentor'))}
                </div>
            </section>

            {[0, 1].map(i => (
                <section key={i} className={sectionCardCls}>
                    <h3 className="mb-4 border-b-2 border-[#df981e] pb-2 text-3xl font-semibold text-[#223b60]">Internship {i + 1}</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                        {field('Company / Organization Name', input('text', (internships[i]?.company_name as string) || '', v => updInternship(i, 'company_name', v), 'e.g. Web development Frontend'))}
                        {field('Designation / Title', input('text', (internships[i]?.designation as string) || '', v => updInternship(i, 'designation', v), 'e.g. Data Analyst Intern'))}
                        {field('Domain', input('text', (internships[i]?.domain as string) || '', v => updInternship(i, 'domain', v), 'e.g. Web Development'))}
                        {field('Description', input('text', (internships[i]?.description as string) || '', v => updInternship(i, 'description', v), 'Brief description'))}

                        {field('Internship Type', select(['Online', 'Physical'], (internships[i]?.internship_type as string) || '', v => updInternship(i, 'internship_type', v), 'Internship Type'))}
                        {field('Paid / Unpaid', select(['Paid', 'Unpaid'], (internships[i]?.paid_unpaid as string) || '', v => updInternship(i, 'paid_unpaid', v), 'Paid / Unpaid'))}

                        {field('Start Date', input('date', (internships[i]?.start_date as string) || '', v => updInternship(i, 'start_date', v), 'dd-mm-yyyy'))}
                        {field('End Date', input('date', (internships[i]?.end_date as string) || '', v => updInternship(i, 'end_date', v), 'dd-mm-yyyy'))}
                    </div>
                </section>
            ))}
        </div>
    )
}
