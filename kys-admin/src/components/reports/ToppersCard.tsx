import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { reportsApi } from '@/lib/api'
import { truncate } from '@/lib/utils'
import { cn } from '@/lib/utils'

export default function ToppersCard() {
    const [semester, setSemester] = useState<number | undefined>(undefined)
    const { data: toppers = [], isLoading } = useQuery({
        queryKey: ['toppers', semester],
        queryFn: () => reportsApi.toppers(semester),
    })

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-200">
                <h3 className="text-base font-semibold text-slate-800">Top 10 Toppers</h3>
            </div>
            <div className="p-5">
                <div className="flex gap-1 flex-wrap mb-4">
                    <button
                        onClick={() => setSemester(undefined)}
                        className={cn(
                            'px-3 py-1 text-xs rounded-full border cursor-pointer transition-all duration-200 hover:-translate-y-px',
                            !semester
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm hover:bg-blue-700'
                                : 'border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
                        )}
                    >
                        All
                    </button>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <button
                            key={s}
                            onClick={() => setSemester(s)}
                            className={cn(
                                'px-3 py-1 text-xs rounded-full border cursor-pointer transition-all duration-200 hover:-translate-y-px',
                                semester === s
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm hover:bg-blue-700'
                                    : 'border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700'
                            )}
                        >
                            Sem {s}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <Skeleton className="h-[280px] w-full" />
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={toppers} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tickFormatter={(v) => truncate(v, 10)} tick={{ fontSize: 11 }} />
                            <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(v) => [v, 'SGPA']} />
                            <Bar dataKey="sgpa" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}

                <div className="mt-4 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>UID</TableHead>
                                <TableHead>SGPA</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i}><TableCell colSpan={4}><Skeleton className="h-6 w-full" /></TableCell></TableRow>
                                ))
                            ) : toppers.map((t) => (
                                <TableRow key={t.uid}>
                                    <TableCell className="font-semibold">#{t.rank}</TableCell>
                                    <TableCell>{t.name}</TableCell>
                                    <TableCell className="text-slate-500">{t.uid}</TableCell>
                                    <TableCell className="font-semibold text-sky-600">{t.sgpa}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
