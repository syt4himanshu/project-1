import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useGenerateAllocation, useConfirmAllocation } from '@/hooks/useAllocation'
import { type SuggestedStudent } from '@/lib/api'

interface Props {
    facultyId: number
    facultyName: string
    onClose: () => void
}

export default function AllocationPanel({ facultyId, facultyName, onClose }: Props) {
    const [suggestions, setSuggestions] = useState<SuggestedStudent[]>([])
    const [selected, setSelected] = useState<Set<number>>(new Set())
    const { mutateAsync: generate, isPending: generating } = useGenerateAllocation()
    const { mutateAsync: confirm, isPending: confirming } = useConfirmAllocation()

    const handleGenerate = async () => {
        const result = await generate(facultyId)
        setSuggestions(result)
        setSelected(new Set(result.map((s) => s.id)))
    }

    const toggleStudent = (id: number) => {
        setSelected((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    const handleConfirm = async () => {
        await confirm({ faculty_id: facultyId, student_ids: Array.from(selected) })
        onClose()
    }

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-4 animate-in fade-in">
            <h3 className="text-lg font-semibold text-slate-800">Allocating students to {facultyName}</h3>
            <div className="mt-3 flex gap-2 flex-wrap">
                <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                    onClick={handleGenerate}
                    disabled={generating}
                >
                    {generating && <Loader2 className="w-4 h-4 animate-spin mr-1" />} Generate Random Allocation
                </Button>
                <Button size="sm" onClick={handleConfirm} disabled={confirming || selected.size === 0}>
                    {confirming && <Loader2 className="w-4 h-4 animate-spin mr-1" />} Confirm Allocation
                </Button>
                <Button size="sm" variant="outline" onClick={onClose}>Cancel</Button>
            </div>

            <div className="mt-4">
                {suggestions.length === 0 ? (
                    <p className="text-slate-400 italic text-sm text-center py-8">
                        Click 'Generate Random Allocation' to get suggestions
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {suggestions.map((s) => (
                            <div
                                key={s.id}
                                onClick={() => toggleStudent(s.id)}
                                className={`border rounded-lg p-3 bg-white cursor-pointer select-none flex items-center gap-3 transition-colors ${selected.has(s.id) ? 'border-blue-400 bg-blue-50' : 'border-slate-200'
                                    }`}
                            >
                                <Checkbox checked={selected.has(s.id)} onCheckedChange={() => toggleStudent(s.id)} onClick={(e) => e.stopPropagation()} />
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
