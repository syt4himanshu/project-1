import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export interface Filters {
    search: string
    semester: string
    section: string
    year: string
    domain: string
    careerGoal: string
}

interface Props {
    filters: Filters
    onChange: (f: Filters) => void
}

const CAREER_GOALS = ['Placement', 'Higher Studies', 'Not Decided']

export default function StudentFilters({ filters, onChange }: Props) {
    const set = (key: keyof Filters, val: string) => onChange({ ...filters, [key]: val })
    const clear = () => onChange({ search: '', semester: '', section: '', year: '', domain: '', careerGoal: '' })

    return (
        <div className="bg-slate-50 border-b border-slate-200 p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Search</p>
                    <Input placeholder="Name or UID" value={filters.search} onChange={(e) => set('search', e.target.value)} className="h-8 text-xs" />
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Semester</p>
                    <Select value={filters.semester} onValueChange={(v) => set('semester', v)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All" /></SelectTrigger>
                        <SelectContent>{[1, 2, 3, 4, 5, 6, 7, 8].map(s => <SelectItem key={s} value={String(s)}>Sem {s}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Section</p>
                    <Input placeholder="e.g. A" value={filters.section} onChange={(e) => set('section', e.target.value)} className="h-8 text-xs" />
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Year of Admission</p>
                    <Select value={filters.year} onValueChange={(v) => set('year', v)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All" /></SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
                                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Domain</p>
                    <Input placeholder="Domain" value={filters.domain} onChange={(e) => set('domain', e.target.value)} className="h-8 text-xs" />
                </div>
                <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Career Goal</p>
                    <Select value={filters.careerGoal} onValueChange={(v) => set('careerGoal', v)}>
                        <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="All" /></SelectTrigger>
                        <SelectContent>{CAREER_GOALS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </div>
            <div className="mt-3 flex justify-end">
                <Button size="sm" variant="ghost" onClick={clear} className="text-xs h-7">Clear Filters</Button>
            </div>
        </div>
    )
}
