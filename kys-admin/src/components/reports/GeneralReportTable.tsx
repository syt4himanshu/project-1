import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import DataTable from '@/components/shared/DataTable'
import { reportsApi, type Student } from '@/lib/api'

const GOAL_STYLES: Record<string, string> = {
    Placement: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'Higher Studies': 'bg-amber-100 text-amber-700 border border-amber-200',
    'Not Decided': 'bg-slate-100 text-slate-700 border border-slate-200',
}

export default function GeneralReportTable() {
    const { data: students = [], isLoading } = useQuery({ queryKey: ['general-report'], queryFn: () => reportsApi.general() })
    const [search, setSearch] = useState('')
    const [semester, setSemester] = useState('')
    const [sgpaMin, setSgpaMin] = useState('')
    const [sgpaMax, setSgpaMax] = useState('')
    const [backlogs, setBacklogs] = useState('')

    const filtered = useMemo(() => {
        return students.filter((s) => {
            if (search) {
                const q = search.toLowerCase()
                if (!s.name.toLowerCase().includes(q) && !s.uid.toLowerCase().includes(q)) return false
            }
            if (semester && String(s.semester) !== semester) return false
            const records = s.academic_records as { sgpa?: number }[] | undefined
            const avgSgpa = records && records.length > 0
                ? records.reduce((sum, r) => sum + (r.sgpa ?? 0), 0) / records.length
                : 0
            if (sgpaMin && avgSgpa < parseFloat(sgpaMin)) return false
            if (sgpaMax && avgSgpa > parseFloat(sgpaMax)) return false
            const totalBacklogs = records?.reduce((sum, r) => sum + ((r as { backlogs?: number }).backlogs ?? 0), 0) ?? 0
            if (backlogs && totalBacklogs < parseInt(backlogs)) return false
            return true
        })
    }, [students, search, semester, sgpaMin, sgpaMax, backlogs])

    const columns = [
        { header: '#', cell: (_: Student, i: number) => i + 1, className: 'w-12' },
        { header: 'UID', accessor: 'uid' as const },
        { header: 'Name', accessor: 'name' as const },
        { header: 'Semester', cell: (s: Student) => `Sem ${s.semester}` },
        {
            header: 'Avg SGPA',
            cell: (s: Student) => {
                const records = s.academic_records as { sgpa?: number }[] | undefined
                if (!records || records.length === 0) return '—'
                const avg = records.reduce((sum, r) => sum + (r.sgpa ?? 0), 0) / records.length
                return avg.toFixed(2)
            },
        },
        {
            header: 'Backlogs',
            cell: (s: Student) => {
                const records = s.academic_records as { backlogs?: number }[] | undefined
                const total = records?.reduce((sum, r) => sum + (r.backlogs ?? 0), 0) ?? 0
                return total > 0 ? <span className="text-red-600 font-medium">{total}</span> : <span className="text-emerald-600">0</span>
            },
        },
        { header: 'Domain', cell: (s: Student) => s.domain_of_interest ?? '—' },
        {
            header: 'Career Goal',
            cell: (s: Student) => s.career_goal ? (
                <Badge className={`text-xs ${GOAL_STYLES[s.career_goal] ?? GOAL_STYLES['Not Decided']}`}>{s.career_goal}</Badge>
            ) : '—',
        },
    ]

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-200">
                <h3 className="text-base font-semibold text-slate-800">General Report</h3>
            </div>
            <div className="p-4 bg-slate-50 border-b border-slate-200">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Search</p>
                        <Input placeholder="Name or UID" value={search} onChange={(e) => setSearch(e.target.value)} className="h-8 text-xs" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Semester</p>
                        <Select value={semester} onValueChange={setSemester}>
                            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All" /></SelectTrigger>
                            <SelectContent>{[1, 2, 3, 4, 5, 6, 7, 8].map(s => <SelectItem key={s} value={String(s)}>Sem {s}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">SGPA Min</p>
                        <Input type="number" min={0} max={10} step={0.1} placeholder="0" value={sgpaMin} onChange={(e) => setSgpaMin(e.target.value)} className="h-8 text-xs" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">SGPA Max</p>
                        <Input type="number" min={0} max={10} step={0.1} placeholder="10" value={sgpaMax} onChange={(e) => setSgpaMax(e.target.value)} className="h-8 text-xs" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Min Backlogs</p>
                        <Input type="number" min={0} placeholder="0" value={backlogs} onChange={(e) => setBacklogs(e.target.value)} className="h-8 text-xs" />
                    </div>
                </div>
                <div className="mt-2 flex justify-end">
                    <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => { setSearch(''); setSemester(''); setSgpaMin(''); setSgpaMax(''); setBacklogs('') }}>
                        Reset Filters
                    </Button>
                </div>
            </div>
            {isLoading ? (
                <div className="p-4 space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : (
                <DataTable columns={columns} data={filtered} keyExtractor={(s) => s.id} />
            )}
        </div>
    )
}
