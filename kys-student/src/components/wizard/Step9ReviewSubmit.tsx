import { ReactNode } from 'react'
import { WizardStepProps } from './shared'

function valueOrNA(value: unknown) {
    if (value === null || value === undefined || value === '') return 'N/A'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    return String(value)
}

function SectionHeading({ title }: { title: string }) {
    return <h3 className="mb-4 rounded-lg border-l-4 border-[#df981e] bg-[#eef3fa] px-3 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#294267]">{title}</h3>
}

function TwoColGrid({ children }: { children: ReactNode }) {
    return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">{children}</div>
}

function Row({ label, value }: { label: string, value: unknown }) {
    return (
        <div className="border-b border-[#dde5f1] pb-2">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#6f7f96]">{label}</p>
            <p className="mt-1 break-words text-sm text-[#2f405a]">{valueOrNA(value)}</p>
        </div>
    )
}

export default function Step9ReviewSubmit({ data, update, fieldErrors = {} }: WizardStepProps) {
    const pi = (data.personal_info as Record<string, unknown>) || {}
    const past = (data.past_education_records as Record<string, unknown>[]) || []
    const post = (data.post_admission_records as Record<string, unknown>[]) || []
    const projects = (data.projects as Record<string, unknown>[]) || []
    const internships = (data.internships as Record<string, unknown>[]) || []
    const parts = (data.cocurricular_participations as Record<string, unknown>[]) || []
    const orgs = (data.cocurricular_organizations as Record<string, unknown>[]) || []
    const programs = (data.skill_programs as Record<string, unknown>[]) || []
    const swoc = (data.swoc as Record<string, unknown>) || {}
    const co = (data.career_objective as Record<string, unknown>) || {}
    const sk = (data.skills as Record<string, unknown>) || {}

    const findExam = (name: string) => past.find(r => r.exam_name === name) || {}

    return (
        <div className="space-y-5">
            <section className="rounded-2xl border border-[#d6deea] bg-[#f7f9fc] p-4 sm:p-5">
                <h2 className="mb-4 font-serif text-3xl font-semibold text-[#1f304d]">Review Your Information</h2>

                <SectionHeading title='Student Personal Information' />
                <TwoColGrid>
                    <Row label='Full Name' value={data.full_name} />
                    <Row label='Section' value={data.section} />
                    <Row label='Semester' value={data.semester} />
                    <Row label='Year of Admission' value={data.year_of_admission} />
                    <Row label='Date of Birth' value={pi.dob} />
                    <Row label='Gender' value={pi.gender} />
                    <Row label='Blood Group' value={pi.blood_group} />
                    <Row label='Category' value={pi.category} />
                    <Row label='Aadhar Number' value={pi.aadhar_number} />
                    <Row label='MIS UID' value={pi.mis_uid} />
                    <Row label='WhatsApp Mobile' value={pi.mobile_no} />
                    <Row label='Personal Email' value={pi.personal_email} />
                    <Row label='College Email' value={pi.college_email} />
                    <Row label='LinkedIn ID' value={pi.linked_in_id} />
                    <Row label='GitHub ID' value={pi.github_id} />
                    <Row label='Permanent Address' value={pi.permanent_address} />
                    <Row label='Present Address' value={pi.present_address} />
                </TwoColGrid>

                <div className="mt-5">
                    <SectionHeading title="Parent's Information" />
                    <TwoColGrid>
                        <Row label="Father's Name" value={pi.father_name} />
                        <Row label="Father's Mobile" value={pi.father_mobile_no} />
                        <Row label="Father's Email" value={pi.father_email} />
                        <Row label="Father's Occupation" value={pi.father_occupation} />
                        <Row label="Mother's Name" value={pi.mother_name} />
                        <Row label="Mother's Mobile" value={pi.mother_mobile_no} />
                        <Row label="Mother's Email" value={pi.mother_email} />
                        <Row label="Mother's Occupation" value={pi.mother_occupation} />
                        <Row label='Local Guardian Name' value={pi.guardian_name} />
                        <Row label='Local Guardian Mobile' value={pi.guardian_mobile} />
                        <Row label='Local Guardian Email' value={pi.guardian_email} />
                    </TwoColGrid>
                </div>

                <div className="mt-5">
                    <SectionHeading title='Academic Information (Before Admission)' />
                    <TwoColGrid>
                        <Row label='SSC Percentage' value={findExam('SSC').percentage} />
                        <Row label='SSC Year' value={findExam('SSC').year_of_passing} />
                        <Row label='HSSC Percentage' value={findExam('HSSC').percentage} />
                        <Row label='HSSC Year' value={findExam('HSSC').year_of_passing} />
                        <Row label='Diploma Percentage' value={findExam('DIPLOMA').percentage} />
                        <Row label='Diploma Year' value={findExam('DIPLOMA').year_of_passing} />
                        <Row label='Entrance Exam' value={findExam('ENTRANCE_EXAM').exam_type} />
                        <Row label='Entrance Percentile' value={findExam('ENTRANCE_EXAM').percentage} />
                    </TwoColGrid>
                </div>

                <div className="mt-5">
                    <SectionHeading title='Academic Information (After Admission)' />
                    <TwoColGrid>
                        {post.map((rec, idx) => (
                            <Row key={idx} label={`Semester ${rec.semester || idx + 1}`} value={`SGPA: ${valueOrNA(rec.sgpa)} | Backlogs: ${valueOrNA(rec.backlog_subjects)}`} />
                        ))}
                    </TwoColGrid>
                </div>

                <div className="mt-5">
                    <SectionHeading title='Project and Internship Details' />
                    <TwoColGrid>
                        <Row label='Mini Project Title' value={projects[0]?.title} />
                        <Row label='Mini Project Guide' value={projects[0]?.description} />
                        <Row label='Major Project Title' value={projects[1]?.title} />
                        <Row label='Major Project Guide' value={projects[1]?.description} />
                        <Row label='UBA Project Title' value={projects[2]?.title} />
                        <Row label='UBA Project Guide' value={projects[2]?.description} />
                        <Row label='Internship 1' value={`${valueOrNA(internships[0]?.company_name)} | ${valueOrNA(internships[0]?.domain)} | ${valueOrNA(internships[0]?.internship_type)} | ${valueOrNA(internships[0]?.paid_unpaid)}`} />
                        <Row label='Internship 2' value={`${valueOrNA(internships[1]?.company_name)} | ${valueOrNA(internships[1]?.domain)} | ${valueOrNA(internships[1]?.internship_type)} | ${valueOrNA(internships[1]?.paid_unpaid)}`} />
                    </TwoColGrid>
                </div>

                <div className="mt-5">
                    <SectionHeading title='Co-Curricular Activities' />
                    <TwoColGrid>
                        {parts.map((entry, idx) => (
                            <Row key={`p-${idx}`} label={`Participation ${idx + 1}`} value={`${valueOrNA(entry.name)} | ${valueOrNA(entry.level)} | ${valueOrNA(entry.awards)}`} />
                        ))}
                        {orgs.map((entry, idx) => (
                            <Row key={`o-${idx}`} label={`Organized ${idx + 1}`} value={`${valueOrNA(entry.name)} | ${valueOrNA(entry.level)} | ${valueOrNA(entry.remark)}`} />
                        ))}
                        {programs.map((entry, idx) => (
                            <Row key={`s-${idx}`} label={`SDP Program ${idx + 1}`} value={`${valueOrNA(entry.course_title)} | ${valueOrNA(entry.platform)} | ${valueOrNA(entry.duration_hours)} hours`} />
                        ))}
                    </TwoColGrid>
                </div>

                <div className="mt-5">
                    <SectionHeading title='SWOC Analysis' />
                    <TwoColGrid>
                        <Row label='Strengths' value={swoc.strengths} />
                        <Row label='Weaknesses' value={swoc.weaknesses} />
                        <Row label='Opportunities' value={swoc.opportunities} />
                        <Row label='Challenges' value={swoc.challenges} />
                    </TwoColGrid>
                </div>

                <div className="mt-5">
                    <SectionHeading title='Career Objectives and Skills' />
                    <TwoColGrid>
                        <Row label='Career Goal' value={co.career_goal} />
                        <Row label='Specific Details' value={co.specific_details} />
                        <Row label='Clarity & Preparedness' value={co.clarity_preparedness} />
                        <Row label='Campus Placement Interest' value={co.interested_in_campus_placement} />
                        <Row label='Student Mentor Interest' value={co.student_mentor_interest} />
                        <Row label='Expectations from Institute' value={co.expectations_from_institute} />
                        <Row label='Programming Languages' value={sk.programming_languages} />
                        <Row label='Technologies & Frameworks' value={sk.technologies_frameworks} />
                        <Row label='Domains of Interest' value={sk.domains_of_interest} />
                        <Row label='Familiar Tools & Platforms' value={sk.familiar_tools_platforms} />
                    </TwoColGrid>
                </div>
            </section>

            <div>
                <label className="flex items-start gap-3 rounded-xl border border-[#d0d8e6] bg-white px-4 py-3 text-sm text-[#334155]">
                    <input
                        type="checkbox"
                        checked={Boolean(data.declaration_accepted)}
                        onChange={e => update({ declaration_accepted: e.target.checked })}
                        className="mt-0.5 h-4 w-4 rounded border-[#9fb0c8] text-[#234574]"
                    />
                    <span>I confirm that all the information provided is accurate and I agree to the terms and conditions *</span>
                </label>
                {fieldErrors.declaration_accepted ? (
                    <p className="mt-2 text-xs font-medium text-[#b91c1c]">{fieldErrors.declaration_accepted}</p>
                ) : null}
            </div>
        </div>
    )
}
