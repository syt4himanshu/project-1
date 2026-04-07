import { useMemo, useState } from 'react'
import { Eye, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DataTable from '@/components/shared/DataTable'
import TeacherDetailDialog from './TeacherDetailDialog'
import { useFaculty } from '@/hooks/useFaculty'
import { type Faculty } from '@/lib/api'
import { Input } from '@/components/ui/input'

export default function TeachersTab() {
    const { data: faculty = [], isLoading } = useFaculty()
    const [viewId, setViewId] = useState<number | null>(null)
    const [query, setQuery] = useState('')

    const filteredFaculty = useMemo(() => {
        const q = query.trim().toLowerCase()
        if (!q) return faculty
        return faculty.filter((f) => {
            const name = `${f.first_name} ${f.last_name}`.toLowerCase()
            return (
                name.includes(q) ||
                f.email.toLowerCase().includes(q) ||
                (f.contact_number ?? '').toLowerCase().includes(q)
            )
        })
    }, [faculty, query])

    const getUid = (f: Faculty) => `FAC${String(f.id).padStart(3, '0')}`

    const columns = [
        { header: 'Name', cell: (f: Faculty) => `${f.first_name} ${f.last_name}` },
        { header: 'UID', cell: (f: Faculty) => <span className="text-slate-500">{getUid(f)}</span> },
        { header: 'Email', accessor: 'email' as const },
        { header: 'Contact', accessor: 'contact_number' as const },
        {
            header: 'Students Assigned',
            cell: (f: Faculty) => (
                <span className="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold bg-indigo-100 text-indigo-600">
                    {f.assigned_count}/20
                </span>
            ),
        },
        {
            header: 'Actions',
            cell: (f: Faculty) => (
                <div className="flex">
                    <Button
                        size="sm"
                        className="h-6 px-2 text-[11px] bg-slate-100 text-sky-600 border border-slate-200 hover:bg-slate-200"
                        onClick={() => setViewId(f.id)}
                    >
                        <Eye className="w-3 h-3 mr-1" /> View
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-5">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-slate-700">Teachers List</h2>
                <div className="relative w-full max-w-[180px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search teachers..."
                        className="h-8 pl-8 text-xs"
                    />
                </div>
            </div>
            <DataTable columns={columns} data={filteredFaculty} isLoading={isLoading} keyExtractor={(f) => f.id} />
            <TeacherDetailDialog facultyId={viewId} onClose={() => setViewId(null)} />
        </div>
    )
}
