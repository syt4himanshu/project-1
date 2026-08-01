import { useStudentProfileDraft } from '../../hooks/useStudentProfileWizard'
import { field, input, inputCls, sectionCardCls, select } from './shared'
import Step6CoCurricular from './Step6CoCurricular'

export default function Step5ProjectsInternships() {
    const { data, update, error } = useStudentProfileDraft()
    const projects = (data.projects as Record<string, unknown>[]) || [{}, {}, {}]
    const internships = (data.internships as Record<string, unknown>[]) || [{}]
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

    const getValidation = (fieldName: string) => {
        const missingFields = error && error.startsWith('Please fill required fields: ')
            ? error.replace('Please fill required fields: ', '').split(', ')
            : []

        if (missingFields.includes(fieldName)) {
            return {
                error: `${fieldName} is required`,
                touched: true
            }
        }
        return undefined
    }

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

    const addInternship = () => {
        update({ internships: [...internships, {}] })
    }

    const removeInternship = (i: number) => {
        const updated = internships.filter((_, idx) => idx !== i)
        update({ internships: updated.length > 0 ? updated : [{}] })
    }

    const setHasInternshipExperience = (value: string) => {
        const nextHasInternshipExperience = value === 'yes'

        update({
            hasInternshipExperience: nextHasInternshipExperience,
            internships: nextHasInternshipExperience ? (internships.length > 0 ? internships : [{}]) : [],
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
                    {field('Mini Project Title *', input('text', (projects[0]?.title as string) || '', v => updProject(0, 'title', v), 'e.g. Hostel Payment System', getValidation('Mini Project Title')))}
                    {field('Project Guide', input('text', (projects[0]?.description as string) || '', v => updProject(0, 'description', v), 'Name of project guide / mentor'))}
                </div>
            </section>

            <section className={sectionCardCls}>
                <h3 className="mb-4 border-b-2 border-[#3b8ed9] pb-2 text-3xl font-semibold text-[#223b60]">Major Project</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                    {field('Major Project Title *', input('text', (projects[1]?.title as string) || '', v => updProject(1, 'title', v), 'e.g. Know Your Student System', getValidation('Major Project Title')))}
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
                <div className="space-y-4">
                    {internships.map((internship, i) => (
                        <section key={i} className={sectionCardCls}>
                            <div className="mb-4 flex items-center justify-between border-b-2 border-[#df981e] pb-2">
                                <h3 className="text-3xl font-semibold text-[#223b60]">Internship {i + 1}</h3>
                                {internships.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeInternship(i)}
                                        className="rounded-lg border border-[#f0c8c8] bg-[#fff5f5] px-3 py-1 text-xs font-semibold text-[#b42318] transition hover:bg-[#ffeaea]"
                                    >
                                        Remove Internship
                                    </button>
                                )}
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                                {field('Company / Organization Name', input('text', (internship?.company_name as string) || '', v => updInternship(i, 'company_name', v), 'e.g. Web development Frontend'))}
                                {field('Designation / Title', input('text', (internship?.designation as string) || '', v => updInternship(i, 'designation', v), 'e.g. Data Analyst Intern'))}
                                {field('Domain', input('text', (internship?.domain as string) || '', v => updInternship(i, 'domain', v), 'e.g. Web Development'))}
                                {field('Description', input('text', (internship?.description as string) || '', v => updInternship(i, 'description', v), 'Brief description'))}

                                {field('Internship Type', select(['Online', 'Physical'], (internship?.internship_type as string) || '', v => updInternship(i, 'internship_type', v), 'Internship Type'))}
                                {field('Paid / Unpaid', select(['Paid', 'Unpaid'], (internship?.paid_unpaid as string) || '', v => updInternship(i, 'paid_unpaid', v), 'Paid / Unpaid'))}

                                {field('Start Date', input('date', (internship?.start_date as string) || '', v => updInternship(i, 'start_date', v), 'dd-mm-yyyy'))}
                                {field('End Date', input('date', (internship?.end_date as string) || '', v => updInternship(i, 'end_date', v), 'dd-mm-yyyy'))}
                            </div>
                        </section>
                    ))}

                    <button
                        type="button"
                        onClick={addInternship}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#3e5f93] px-4 py-2.5 text-sm font-semibold text-[#3e5f93] transition hover:bg-[#eaf2fb]"
                    >
                        + Add Another Internship
                    </button>
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
