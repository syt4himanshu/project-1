import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import DataTable from '@/components/shared/DataTable'
import { reportsApi, type IncompleteProfile } from '@/lib/api'
import { toast } from 'sonner'

export default function IncompleteProfilesTable() {
    const [year, setYear] = useState<string>('')
    const { data: profiles = [], isLoading } = useQuery({
        queryKey: ['incomplete-profiles', year],
        queryFn: () => reportsApi.incompleteProfiles(year ? parseInt(year) : undefined),
    })

    const handleExport = async () => {
        try {
            const res = await reportsApi.exportIncomplete(year ? parseInt(year) : undefined)
            const blob = await res.blob()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'incomplete-profiles.xlsx'
            a.click()
            URL.revokeObjectURL(url)
        } catch {
            toast.error('Export failed')
        }
    }

    const columns = [
        { header: '#', cell: (_: IncompleteProfile, i: number) => i + 1, className: 'w-12' },
        { header: 'Name', accessor: 'name' as const },
        { header: 'UID', accessor: 'uid' as const },
        { header: 'Year', accessor: 'year_of_admission' as const },
        {
            header: 'Missing Fields',
            cell: (p: IncompleteProfile) => (
                <span className="text-amber-600 text-sm">{p.missing_fields.join(', ')}</span>
            ),
        },
    ]

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center flex-wrap gap-3">
                <h3 className="text-base font-semibold text-slate-800">Incomplete Profiles</h3>
                <div className="flex gap-2 items-center">
                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="h-8 text-xs w-32"><SelectValue placeholder="All Years" /></SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button size="sm" className="bg-amber-500 text-white hover:bg-amber-600 h-8 text-xs" onClick={handleExport}>
                        <Download className="w-3 h-3 mr-1" /> Export to Excel
                    </Button>
                </div>
            </div>
            {isLoading ? (
                <div className="p-4 space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : (
                <DataTable columns={columns} data={profiles} keyExtractor={(p) => p.id} />
            )}
        </div>
    )
}
