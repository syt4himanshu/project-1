import { Users, GraduationCap, BookOpen, Activity } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useStats } from '@/hooks/useStats'

const cards = [
    { label: 'Total Users', key: 'total_users' as const, icon: Users, gradient: 'from-blue-500 to-indigo-600' },
    { label: 'Students', key: 'total_students' as const, icon: GraduationCap, gradient: 'from-emerald-500 to-teal-600' },
    { label: 'Teachers', key: 'total_faculty' as const, icon: BookOpen, gradient: 'from-indigo-500 to-violet-600' },
    { label: 'Active Users', key: 'active_users' as const, icon: Activity, gradient: 'from-amber-500 to-orange-500' },
]

export default function StatsGrid() {
    const { data, isLoading } = useStats()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-7">
            {cards.map((card) => (
                <div key={card.key} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center gap-4 min-h-[94px]">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${card.gradient} shrink-0`}>
                        <card.icon className="w-5 h-5" />
                    </div>
                    <div>
                        {isLoading ? (
                            <>
                                <Skeleton className="h-7 w-16 mb-1" />
                                <Skeleton className="h-4 w-24" />
                            </>
                        ) : (
                            <>
                                <div className="text-[42px] leading-none font-bold text-slate-800">{data?.[card.key] ?? 0}</div>
                                <div className="text-[22px] leading-tight text-slate-500 mt-1">{card.label}</div>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
