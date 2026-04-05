import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DataTable from '@/components/shared/DataTable'
import AllocationPanel from './AllocationPanel'
import RemovePanel from './RemovePanel'
import { useAllocation } from '@/hooks/useAllocation'
import { type AllocationEntry } from '@/lib/api'

type PanelState = { type: 'allocate' | 'remove'; facultyId: number; facultyName: string } | null

export default function AllocationTab() {
    const { data: entries = [], isLoading } = useAllocation()
    const [panel, setPanel] = useState<PanelState>(null)
    const getUid = (id: number) => `FAC${String(id).padStart(3, '0')}`

    const columns = [
        { header: 'Faculty Name', accessor: 'faculty_name' as const },
        { header: 'UID', cell: (e: AllocationEntry) => <span className="text-slate-500">{getUid(e.faculty_id)}</span> },
        { header: 'Email', accessor: 'email' as const },
        { header: 'Students Assigned', cell: (e: AllocationEntry) => <span className="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold bg-indigo-100 text-indigo-600">{e.assigned_count}</span> },
        { header: 'Max Capacity', accessor: 'capacity' as const },
        {
            header: 'Actions',
            cell: (e: AllocationEntry) => (
                <div className="flex gap-1.5">
                    <Button
                        size="sm"
                        className="h-6 px-2 text-[11px] bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200"
                        disabled={e.assigned_count >= e.capacity}
                        onClick={() => setPanel({ type: 'allocate', facultyId: e.faculty_id, facultyName: e.faculty_name })}
                    >
                        <Plus className="w-3 h-3 mr-1" /> Allocate
                    </Button>
                    <Button
                        size="sm"
                        className="h-6 px-2 text-[11px] bg-red-50 text-red-500 border border-red-200 hover:bg-red-100"
                        disabled={e.assigned_count === 0}
                        onClick={() => setPanel({ type: 'remove', facultyId: e.faculty_id, facultyName: e.faculty_name })}
                    >
                        <Trash2 className="w-3 h-3 mr-1" /> Remove
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-5">
                <div className="px-4 py-3 border-b border-slate-200">
                    <h2 className="text-sm font-semibold text-slate-700">Student Allocation to Teachers</h2>
                </div>
                <DataTable columns={columns} data={entries} isLoading={isLoading} keyExtractor={(e) => e.faculty_id} />
            </div>

            {panel?.type === 'allocate' && (
                <AllocationPanel
                    facultyId={panel.facultyId}
                    facultyName={panel.facultyName}
                    onClose={() => setPanel(null)}
                />
            )}
            {panel?.type === 'remove' && (
                <RemovePanel
                    facultyId={panel.facultyId}
                    facultyName={panel.facultyName}
                    onClose={() => setPanel(null)}
                />
            )}
        </div>
    )
}
