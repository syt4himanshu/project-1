import { useDeferredValue, useState } from 'react'
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

const isEmptyText = (value: unknown) => {
    const text = String(value ?? '').trim().toLowerCase()
    return !text || text === 'n/a' || text === 'na' || text === 'none' || text === '-' || text === '--'
}

export default function StudentsTab() {
    const [filters, setFilters] = useState<Filters>({ search: '', semester: '', section: '', year: '', domain: '', careerGoal: '' })
    const deferredFilters = useDeferredValue(filters)
    const { data: students = [], isLoading } = useStudents(deferredFilters)
    const { mutate: deleteStudent } = useDeleteStudent()
    const [viewId, setViewId] = useState<number | null>(null)

    const columns = [
        { header: '#', cell: (_: Student, i: number) => i + 1, className: 'w-12' },
        { header: 'UID', accessor: 'uid' as const },
        { header: 'Name', accessor: 'name' as const },
        {
            header: 'Semester',
            cell: (s: Student) => (Number.isFinite(Number(s.semester)) && Number(s.semester) > 0 ? `Sem ${s.semester}` : <span className="text-slate-400 italic">N/A</span>),
        },
        {
            header: 'Section',
            cell: (s: Student) => (!isEmptyText(s.section) ? s.section : <span className="text-slate-400 italic">N/A</span>),
        },
        {
            header: 'Mentor',
            cell: (s: Student) => {
                if (!isEmptyText(s.mentor_name)) return s.mentor_name
                if (s.mentor_id != null) return <span className="text-slate-600">Assigned</span>
                return <span className="text-slate-400 italic">Unassigned</span>
            },
        },
        {
            header: 'Career Goal',
            cell: (s: Student) => !isEmptyText(s.career_goal) ? (
                <Badge className={`text-xs ${GOAL_STYLES[String(s.career_goal)] ?? GOAL_STYLES['Not Decided']}`}>{String(s.career_goal)}</Badge>
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
            <DataTable columns={columns} data={students} isLoading={isLoading} keyExtractor={(s) => s.id} />
            <StudentDetailDialog studentId={viewId} onClose={() => setViewId(null)} />
        </div>
    )
}
