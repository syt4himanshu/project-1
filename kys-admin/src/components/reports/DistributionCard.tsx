import { useQuery } from '@tanstack/react-query'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { reportsApi } from '@/lib/api'

const COLORS = ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316']

export default function DistributionCard() {
    const { data: dist = [], isLoading } = useQuery({
        queryKey: ['semester-distribution'],
        queryFn: reportsApi.semesterDistribution,
    })

    const total = dist.reduce((s, d) => s + d.count, 0)
    const chartData = dist.map((d) => ({ name: `Sem ${d.semester}`, value: d.count }))

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
            <div className="px-5 py-4 border-b border-slate-200">
                <h3 className="text-base font-semibold text-slate-800">Semester Distribution</h3>
            </div>
            <div className="p-5">
                {isLoading ? (
                    <Skeleton className="h-[280px] w-full" />
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false}>
                                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                )}

                <div className="mt-4 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Semester</TableHead>
                                <TableHead>Student Count</TableHead>
                                <TableHead>Percentage</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 4 }).map((_, i) => (
                                    <TableRow key={i}><TableCell colSpan={3}><Skeleton className="h-6 w-full" /></TableCell></TableRow>
                                ))
                            ) : dist.map((d) => (
                                <TableRow key={d.semester}>
                                    <TableCell>Semester {d.semester}</TableCell>
                                    <TableCell>{d.count}</TableCell>
                                    <TableCell>{total > 0 ? ((d.count / total) * 100).toFixed(1) : 0}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
