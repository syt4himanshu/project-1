import { useStudentProfileDraft } from '../../hooks/useStudentProfileWizard'
import { field, input, inputCls, sectionCardCls, select } from './shared'
import Step6CoCurricular from './Step6CoCurricular'

export default function Step5ProjectsInternships() {
    const { data, update } = useStudentProfileDraft()
    const projects = (data.projects as Record<string, unknown>[]) || [{}, {}, {}]
    const internships = (data.internships as Record<string, unknown>[]) || [{}, {}]
    const hasUbaProject =
        data.hasUbaProject === true
        || Boolean(projects[2]?.title || projects[2]?.description)
    const hasInternshipExperience =
        data.hasInternshipExperience === true
        || internships.some(internship =>
            Boolean(
                internship.company_name ||
                internship.designation ||
                internship.domain ||
                internship.description ||
                internship.internship_type ||
                internship.paid_unpaid ||
                internship.start_date ||
                internship.end_date,
            ),
        )

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

    const setHasInternshipExperience = (value: string) => {
        const nextHasInternshipExperience = value === 'yes'

        update({
            hasInternshipExperience: nextHasInternshipExperience,
            internships: nextHasInternshipExperience ? internships : [],
        })
    }

    const setHasUbaProject = (value: string) => {
        const nextHasUbaProject = value === 'yes'

        update({
            hasUbaProject: nextHasUbaProject,
            projects: nextHasUbaProject
                ? projects
                : [projects[0] || {}, projects[1] || {}, {}],
        })
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
                <h3 className="mb-4 border-b-2 border-[#b06bd8] pb-2 text-3xl font-semibold text-[#223b60]">UBA / Collaborative Project</h3>
                <div className="grid grid-cols-1 gap-4 sm:max-w-md">
                    {field('Do you have a UBA / Collaborative Project?', (
                        <select
                            value={hasUbaProject ? 'yes' : 'no'}
                            onChange={e => setHasUbaProject(e.target.value)}
                            className={inputCls}
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    ))}
                </div>
            </section>

            {hasUbaProject && (
                <section className={sectionCardCls}>
                    <h3 className="mb-4 border-b-2 border-[#b06bd8] pb-2 text-3xl font-semibold text-[#223b60]">UBA / Collaborative Project Details</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                        {field('UBA Project Title', input('text', (projects[2]?.title as string) || '', v => updProject(2, 'title', v), 'Enter UBA / collaborative project title'))}
                        {field('Project Guide', input('text', (projects[2]?.description as string) || '', v => updProject(2, 'description', v), 'Name of project guide / mentor'))}
                    </div>
                </section>
            )}

            <section className={sectionCardCls}>
                <h3 className="mb-4 border-b-2 border-[#df981e] pb-2 text-3xl font-semibold text-[#223b60]">Internship Details</h3>
                <div className="grid grid-cols-1 gap-4 sm:max-w-md">
                    {field('Do you have internship experience?', (
                        <select
                            value={hasInternshipExperience ? 'yes' : 'no'}
                            onChange={e => setHasInternshipExperience(e.target.value)}
                            className={inputCls}
                        >
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    ))}
                </div>
            </section>

            {hasInternshipExperience && (
                <div className="space-y-5">
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
            )}

            <div className="mb-6">
                <h2 className="font-serif text-3xl font-semibold text-[var(--text)] sm:text-4xl">Co-Curricular Activities</h2>
                <p className="mt-1 text-sm text-[var(--text-muted)] sm:text-base">Provide details of your co-curricular activities</p>
            </div>

            <div className="rounded-2xl border-0 bg-transparent p-0">
                <Step6CoCurricular />
            </div>
        </div>
    )
}
