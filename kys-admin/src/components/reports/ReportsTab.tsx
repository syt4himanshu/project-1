import { useQuery } from '@tanstack/react-query'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ToppersCard from './ToppersCard'
import DistributionCard from './DistributionCard'
import BacklogList from './BacklogList'
import GeneralReportTable from './GeneralReportTable'
import IncompleteProfilesTable from './IncompleteProfilesTable'
import { reportsApi } from '@/lib/api'
import { toast } from 'sonner'

async function downloadBlob(res: Response, filename: string) {
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
}

export default function ReportsTab() {
    const { data: stats, isLoading } = useQuery({ queryKey: ['report-stats'], queryFn: reportsApi.stats })

    const metricCards = [
        { label: 'Total Students', value: stats?.total_students, color: 'text-sky-600' },
        { label: 'Avg SGPA', value: stats?.avg_sgpa?.toFixed(2), color: 'text-emerald-600' },
        { label: 'With Backlogs', value: stats?.with_backlogs, color: 'text-red-600' },
        { label: 'Active Semesters', value: stats?.active_semesters, color: 'text-violet-600' },
    ]

    return (
        <div>
            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {metricCards.map((m) => (
                    <div key={m.label} className="bg-white rounded-xl p-4 shadow-sm text-center border border-slate-100">
                        {isLoading ? (
                            <><Skeleton className="h-9 w-16 mx-auto mb-1" /><Skeleton className="h-4 w-24 mx-auto" /></>
                        ) : (
                            <>
                                <div className={`text-3xl font-bold ${m.color}`}>{m.value ?? 0}</div>
                                <div className="text-sm text-slate-500 mt-1">{m.label}</div>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Export buttons */}
            <div className="flex gap-2 mb-5 flex-wrap">
                <Button size="sm" variant="outline" className="border-sky-300 text-sky-600 hover:bg-sky-50">
                    <Download className="w-3 h-3 mr-1" /> Export Filtered
                </Button>
                <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                    onClick={async () => { try { await downloadBlob(await reportsApi.exportAll(), 'all-students.xlsx') } catch { toast.error('Export failed') } }}>
                    <Download className="w-3 h-3 mr-1" /> Export All Batched
                </Button>
                <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50"
                    onClick={async () => { try { await downloadBlob(await reportsApi.exportBacklog(), 'backlog-report.xlsx') } catch { toast.error('Export failed') } }}>
                    <Download className="w-3 h-3 mr-1" /> Export Backlog Report
                </Button>
                <Button size="sm" variant="outline" className="border-amber-300 text-amber-600 hover:bg-amber-50">
                    <Download className="w-3 h-3 mr-1" /> Export Incomplete Profiles → Excel
                </Button>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                <ToppersCard />
                <DistributionCard />
            </div>

            {/* Full-width cards */}
            <div className="space-y-5">
                <BacklogList />
                <GeneralReportTable />
                <IncompleteProfilesTable />
            </div>
        </div>
    )
}
