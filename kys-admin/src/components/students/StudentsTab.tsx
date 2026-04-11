import { useState, useMemo } from 'react'
import { Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import DataTable from '@/components/shared/DataTable'
import StudentFilters, { type Filters } from './StudentFilters'
import StudentDetailDialog from './StudentDetailDialog'
import { useStudents, useDeleteStudent } from '@/hooks/useStudents'
import { type Student } from '@/lib/api'

const GOAL_STYLES: Record<string, string> = {
    Placement: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'Higher Studies': 'bg-amber-100 text-amber-700 border border-amber-200',
    'Not Decided': 'bg-slate-100 text-slate-700 border border-slate-200',
}

export default function StudentsTab() {
    const { data: students = [], isLoading } = useStudents()
    const { mutate: deleteStudent } = useDeleteStudent()
    const [viewId, setViewId] = useState<number | null>(null)
    const [filters, setFilters] = useState<Filters>({ search: '', semester: '', section: '', year: '', domain: '', careerGoal: '' })

    const filtered = useMemo(() => {
        return students.filter((s) => {
            if (filters.search) {
                const q = filters.search.toLowerCase()
                if (!s.name.toLowerCase().includes(q) && !s.uid.toLowerCase().includes(q)) return false
            }
            if (filters.semester && String(s.semester) !== filters.semester) return false
            if (filters.section && s.section.toLowerCase() !== filters.section.toLowerCase()) return false
            if (filters.year && String(s.year_of_admission) !== filters.year) return false
            if (filters.domain && !s.domain_of_interest?.toLowerCase().includes(filters.domain.toLowerCase())) return false
            if (filters.careerGoal && s.career_goal !== filters.careerGoal) return false
            return true
        })
    }, [students, filters])

    const columns = [
        { header: '#', cell: (_: Student, i: number) => i + 1, className: 'w-12' },
        { header: 'UID', accessor: 'uid' as const },
        { header: 'Name', accessor: 'name' as const },
        { header: 'Semester', cell: (s: Student) => `Sem ${s.semester}` },
        { header: 'Section', accessor: 'section' as const },
        { header: 'Mentor', cell: (s: Student) => s.mentor_name ? s.mentor_name : <span className="text-slate-400 italic">Unassigned</span> },
        {
            header: 'Career Goal',
            cell: (s: Student) => s.career_goal ? (
                <Badge className={`text-xs ${GOAL_STYLES[s.career_goal] ?? GOAL_STYLES['Not Decided']}`}>{s.career_goal}</Badge>
            ) : <span className="text-slate-400 italic text-xs">—</span>,
        },
        {
            header: 'Actions',
            cell: (s: Student) => (
                <div className="flex gap-1.5">
                    <Button size="sm" className="h-7 px-2 text-xs" onClick={() => setViewId(s.id)}>
                        <Eye className="w-3 h-3 mr-1" /> View
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="h-7 px-2 text-xs">
                                <Trash2 className="w-3 h-3 mr-1" /> Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Student</AlertDialogTitle>
                                <AlertDialogDescription>Delete <strong>{s.name}</strong> ({s.uid})? This cannot be undone.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteStudent(s.uid)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ),
        },
    ]

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-5">
            <div className="px-5 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800">Students List</h2>
            </div>
            <StudentFilters filters={filters} onChange={setFilters} />
            <DataTable columns={columns} data={filtered} isLoading={isLoading} keyExtractor={(s) => s.id} />
            <StudentDetailDialog studentId={viewId} onClose={() => setViewId(null)} />
        </div>
    )
}
