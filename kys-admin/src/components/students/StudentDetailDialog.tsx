import { useRef } from 'react'
import { Printer, Download, Loader2 } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import InfoTable from '@/components/shared/InfoTable'
import CollapsibleSection from '@/components/shared/CollapsibleSection'
import { useStudentDetail } from '@/hooks/useStudents'
import { formatDate } from '@/lib/utils'
import { useState } from 'react'

interface Props {
    studentId: number | null
    onClose: () => void
}

const GOAL_COLORS: Record<string, string> = {
    Placement: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Higher Studies': 'bg-amber-100 text-amber-700 border-amber-200',
    'Not Decided': 'bg-slate-100 text-slate-700 border-slate-200',
}

export default function StudentDetailDialog({ studentId, onClose }: Props) {
    const { data: student, isLoading } = useStudentDetail(studentId ?? 0)
    const printRef = useRef<HTMLDivElement>(null)
    const [exporting, setExporting] = useState(false)

    const handlePrint = () => window.print()

    const handlePDF = async () => {
        if (!printRef.current) return
        setExporting(true)
        try {
            const { default: html2canvas } = await import('html2canvas')
            const { default: jsPDF } = await import('jspdf')
            const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true })
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
            const imgData = canvas.toDataURL('image/png')
            const pdfWidth = pdf.internal.pageSize.getWidth()
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
            pdf.save(`${student?.name ?? 'student'}-profile.pdf`)
        } finally {
            setExporting(false)
        }
    }

    const pi = student?.personal_info as Record<string, unknown> | undefined
    const skills = student?.skills as Record<string, unknown> | undefined
    const swoc = student?.swoc as Record<string, unknown> | undefined
    const careerObj = student?.career_objective as Record<string, unknown> | undefined

    return (
        <Dialog open={!!studentId} onOpenChange={(v) => { if (!v) onClose() }}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                <div ref={printRef} id="student-detail-print">
                    {/* Header */}
                    <div className="bg-slate-50 border-b border-slate-200 p-5">
                        {isLoading ? (
                            <div className="flex gap-4"><Skeleton className="w-22 h-22" /><div className="flex-1 space-y-2"><Skeleton className="h-7 w-64" /><Skeleton className="h-4 w-48" /></div></div>
                        ) : (
                            <div className="grid grid-cols-[80px_1fr_100px] items-center gap-4">
                                <img src="/college-logo.png" alt="College Logo" className="w-20 h-20 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Student Information</h2>
                                    <p className="text-slate-500 text-sm">Department of Computer Science</p>
                                    <p className="text-slate-500 text-sm">KYS-Mentoring System 2026-27</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-24 h-28 border border-slate-300 rounded bg-slate-100 flex items-center justify-center mx-auto overflow-hidden">
                                        {pi?.profile_photo ? (
                                            <img src={String(pi.profile_photo)} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs text-slate-400">No Photo</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Profile Photo</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Body */}
                    <div className="p-5 space-y-4">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
                        ) : student ? (
                            <>
                                <CollapsibleSection title="Student's Personal Information" defaultOpen>
                                    <InfoTable rows={[
                                        { label: 'Full Name', value: student.name },
                                        { label: 'UID', value: student.uid },
                                        { label: 'Date of Birth', value: formatDate(pi?.dob as string) },
                                        { label: 'Gender', value: pi?.gender as string },
                                        { label: 'Mobile', value: pi?.mobile as string },
                                        { label: 'Personal Email', value: pi?.personal_email as string },
                                        { label: 'College Email', value: pi?.college_email as string },
                                        { label: 'LinkedIn', value: pi?.linkedin as string },
                                        { label: 'GitHub', value: pi?.github as string },
                                        { label: 'Blood Group', value: pi?.blood_group as string },
                                        { label: 'Category', value: pi?.category as string },
                                        { label: 'Aadhar', value: pi?.aadhar as string },
                                        { label: 'Address', value: pi?.address as string },
                                        { label: 'Father Name', value: pi?.father_name as string },
                                        { label: 'Father Mobile', value: pi?.father_mobile as string },
                                        { label: 'Father Occupation', value: pi?.father_occupation as string },
                                        { label: 'Mother Name', value: pi?.mother_name as string },
                                        { label: 'Mother Mobile', value: pi?.mother_mobile as string },
                                        { label: 'Mother Occupation', value: pi?.mother_occupation as string },
                                        { label: 'Emergency Contact', value: pi?.emergency_contact as string },
                                    ]} />
                                </CollapsibleSection>

                                <CollapsibleSection title="Past Education">
                                    {student.past_education && student.past_education.length > 0 ? (
                                        <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                                            <thead className="bg-slate-50"><tr><th className="px-4 py-2 text-left font-semibold text-slate-700">Exam</th><th className="px-4 py-2 text-left font-semibold text-slate-700">Percentage</th><th className="px-4 py-2 text-left font-semibold text-slate-700">Year of Passing</th></tr></thead>
                                            <tbody>{student.past_education.map((e, i) => (
                                                <tr key={i} className="border-t border-slate-100">
                                                    <td className="px-4 py-2">{String(e.exam ?? '—')}</td>
                                                    <td className="px-4 py-2">{String(e.percentage ?? '—')}</td>
                                                    <td className="px-4 py-2">{String(e.year_of_passing ?? '—')}</td>
                                                </tr>
                                            ))}</tbody>
                                        </table>
                                    ) : <p className="text-slate-400 italic text-sm">No records</p>}
                                </CollapsibleSection>

                                <CollapsibleSection title="Post-Admission Academic Record">
                                    {student.academic_records && student.academic_records.length > 0 ? (
                                        <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
                                            <thead className="bg-slate-50"><tr><th className="px-4 py-2 text-left font-semibold text-slate-700">Semester</th><th className="px-4 py-2 text-left font-semibold text-slate-700">SGPA</th><th className="px-4 py-2 text-left font-semibold text-slate-700">Backlogs</th></tr></thead>
                                            <tbody>{student.academic_records.map((r, i) => (
                                                <tr key={i} className="border-t border-slate-100">
                                                    <td className="px-4 py-2">{String(r.semester ?? '—')}</td>
                                                    <td className="px-4 py-2">{String(r.sgpa ?? '—')}</td>
                                                    <td className="px-4 py-2">{String(r.backlogs ?? '0')}</td>
                                                </tr>
                                            ))}</tbody>
                                        </table>
                                    ) : <p className="text-slate-400 italic text-sm">No records</p>}
                                </CollapsibleSection>

                                <CollapsibleSection title="Projects">
                                    {student.projects && student.projects.length > 0 ? (
                                        <div className="space-y-3">
                                            {student.projects.map((p, i) => (
                                                <div key={i} className="border border-slate-200 rounded-lg p-3">
                                                    <p className="font-semibold text-slate-800">{String(p.title ?? 'Untitled')}</p>
                                                    <p className="text-slate-500 text-sm mt-1">{String(p.description ?? '')}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <p className="text-slate-400 italic text-sm">No projects</p>}
                                </CollapsibleSection>

                                <CollapsibleSection title="Internships">
                                    {student.internships && student.internships.length > 0 ? (
                                        <div className="space-y-3">
                                            {student.internships.map((intern, i) => (
                                                <div key={i} className="border border-slate-200 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="font-semibold text-slate-800">{String(intern.company ?? '—')}</p>
                                                        <Badge className="bg-sky-100 text-sky-700 border-sky-200 text-xs">{String(intern.type ?? '')}</Badge>
                                                        <Badge className={`text-xs ${intern.paid ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                            {intern.paid ? 'Paid' : 'Unpaid'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-slate-500 text-sm mt-1">{String(intern.domain ?? '')} · {formatDate(intern.start_date as string)} – {formatDate(intern.end_date as string)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : <p className="text-slate-400 italic text-sm">No internships</p>}
                                </CollapsibleSection>

                                <CollapsibleSection title="Co-Curricular Participations">
                                    {student.co_curricular_participations && student.co_curricular_participations.length > 0 ? (
                                        <div className="space-y-2">
                                            {student.co_curricular_participations.map((p, i) => (
                                                <div key={i} className="border border-slate-100 rounded p-2 text-sm text-slate-700">{String(p.activity ?? '—')} — {String(p.role ?? '')} ({String(p.year ?? '')})</div>
                                            ))}
                                        </div>
                                    ) : <p className="text-slate-400 italic text-sm">No participations</p>}
                                </CollapsibleSection>

                                <CollapsibleSection title="Co-Curricular Organizations">
                                    {student.co_curricular_organizations && student.co_curricular_organizations.length > 0 ? (
                                        <div className="space-y-2">
                                            {student.co_curricular_organizations.map((o, i) => (
                                                <div key={i} className="border border-slate-100 rounded p-2 text-sm text-slate-700">{String(o.organization ?? '—')} — {String(o.position ?? '')} ({String(o.year ?? '')})</div>
                                            ))}
                                        </div>
                                    ) : <p className="text-slate-400 italic text-sm">No organizations</p>}
                                </CollapsibleSection>

                                <CollapsibleSection title="Skills & Interests">
                                    <InfoTable rows={[
                                        { label: 'Programming Languages', value: String(skills?.programming_languages ?? '—') },
                                        { label: 'Technologies', value: String(skills?.technologies ?? '—') },
                                        { label: 'Domains', value: String(skills?.domains ?? '—') },
                                        { label: 'Tools', value: String(skills?.tools ?? '—') },
                                    ]} />
                                </CollapsibleSection>

                                <CollapsibleSection title="SWOC Analysis">
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { key: 'strengths', label: 'Strengths', color: 'emerald' },
                                            { key: 'weaknesses', label: 'Weaknesses', color: 'red' },
                                            { key: 'opportunities', label: 'Opportunities', color: 'sky' },
                                            { key: 'challenges', label: 'Challenges', color: 'amber' },
                                        ].map(({ key, label, color }) => (
                                            <div key={key} className={`bg-${color}-50 border border-${color}-200 rounded-lg p-3`}>
                                                <p className={`font-semibold text-${color}-700 text-sm mb-1`}>{label}</p>
                                                <p className="text-sm text-slate-700">{String(swoc?.[key] ?? '—')}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CollapsibleSection>

                                <CollapsibleSection title="Career Objective">
                                    <InfoTable rows={[
                                        { label: 'Goal', value: student.career_goal },
                                        { label: 'Specific Details', value: String(careerObj?.specific_details ?? '—') },
                                        {
                                            label: 'Clarity & Preparedness', value: careerObj?.clarity_score ? (
                                                <Badge className="bg-sky-100 text-sky-700 border-sky-200">{String(careerObj.clarity_score)} / 5</Badge>
                                            ) : '—'
                                        },
                                        { label: 'Campus Placement', value: String(careerObj?.campus_placement ?? '—') },
                                    ]} />
                                </CollapsibleSection>

                                <CollapsibleSection title="Assigned Mentor">
                                    {student.mentor_name ? (
                                        <div className="bg-slate-50 rounded-lg p-4">
                                            <p className="font-semibold text-slate-800">{student.mentor_name}</p>
                                        </div>
                                    ) : (
                                        <p className="text-slate-400 italic text-sm">No mentor assigned</p>
                                    )}
                                </CollapsibleSection>
                            </>
                        ) : null}
                    </div>
                </div>

                {/* Sticky footer */}
                <div className="sticky bottom-0 border-t border-slate-200 bg-white px-5 py-3 flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                        <Printer className="w-4 h-4 mr-1" /> Print
                    </Button>
                    <Button size="sm" onClick={handlePDF} disabled={exporting}>
                        {exporting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Download className="w-4 h-4 mr-1" />}
                        Download PDF
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
