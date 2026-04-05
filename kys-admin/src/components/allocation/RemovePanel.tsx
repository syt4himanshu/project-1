import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { useRemoveAllocation, useAssignedStudents } from '@/hooks/useAllocation'

interface Props {
    facultyId: number
    facultyName: string
    onClose: () => void
}

export default function RemovePanel({ facultyId, facultyName, onClose }: Props) {
    const { data: students = [], isLoading } = useAssignedStudents(facultyId)
    const [selected, setSelected] = useState<Set<number>>(new Set())
    const { mutateAsync: remove, isPending } = useRemoveAllocation()

    const toggle = (id: number) => {
        setSelected((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const handleRemove = async () => {
        await remove({ faculty_id: facultyId, student_ids: Array.from(selected) })
        onClose()
    }

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-4 animate-in fade-in">
            <h3 className="text-lg font-semibold text-slate-800">Remove students from {facultyName}</h3>
            <div className="mt-3 flex gap-2">
                <Button size="sm" variant="destructive" onClick={handleRemove} disabled={isPending || selected.size === 0}>
                    {isPending && <Loader2 className="w-4 h-4 animate-spin mr-1" />} Remove Selected
                </Button>
                <Button size="sm" variant="outline" onClick={onClose}>Cancel</Button>
            </div>

            <div className="mt-4">
                {isLoading ? (
                    <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
                ) : students.length === 0 ? (
                    <p className="text-slate-400 italic text-sm text-center py-8">No students assigned</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {students.map((s) => (
                            <div
                                key={s.id}
                                onClick={() => toggle(s.id)}
                                className={`border rounded-lg p-3 bg-white cursor-pointer select-none flex items-center gap-3 transition-colors ${selected.has(s.id) ? 'border-red-400 bg-red-50' : 'border-slate-200'
                                    }`}
                            >
                                <Checkbox checked={selected.has(s.id)} onCheckedChange={() => toggle(s.id)} onClick={(e) => e.stopPropagation()} />
                                <div>
                                    <p className="font-semibold text-sm text-slate-800">{s.name}</p>
                                    <p className="text-xs text-slate-500">{s.uid}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
