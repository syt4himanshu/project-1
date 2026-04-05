import { useQuery } from '@tanstack/react-query'
import { CheckCircle } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { reportsApi } from '@/lib/api'

export default function BacklogList() {
    const { data: backlogs = [], isLoading } = useQuery({
        queryKey: ['backlogs'],
        queryFn: reportsApi.backlogs,
    })

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-200">
                <h3 className="text-base font-semibold text-slate-800">Students with Backlogs</h3>
            </div>
            <div className="p-5">
                {isLoading ? (
                    <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
                ) : backlogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                        <p className="text-emerald-600 font-medium">No students with backlogs!</p>
                    </div>
                ) : (
                    backlogs.map((b) => (
                        <div key={b.student_id} className="bg-slate-50 border border-slate-100 rounded-lg p-3 mb-2 flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-slate-800">{b.name}</p>
                                <p className="text-xs text-slate-500">{b.uid}</p>
                            </div>
                            <p className="text-sm text-red-600 text-right max-w-[60%]">{b.subjects.join(', ')}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
