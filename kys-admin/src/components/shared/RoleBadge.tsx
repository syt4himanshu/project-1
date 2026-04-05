import { Badge } from '@/components/ui/badge'

const styles: Record<string, string> = {
    admin: 'bg-red-100 text-red-700 border border-red-200',
    student: 'bg-blue-100 text-blue-700 border border-blue-200',
    faculty: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
}

export default function RoleBadge({ role }: { role: string }) {
    return (
        <Badge className={styles[role] ?? 'bg-slate-100 text-slate-700 border border-slate-200'}>
            {role}
        </Badge>
    )
}
