import { useMemo, useRef, useState } from 'react'
import { BriefcaseBusiness, Download, KeyRound, Plus, Search, Upload, UserCircle2, Users2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import DataTable from '@/components/shared/DataTable'
import RoleBadge from '@/components/shared/RoleBadge'
import AddUserDialog from './AddUserDialog'
import PasswordResetDialog from './PasswordResetDialog'
import { useUsers, useDeleteUser } from '@/hooks/useUsers'
import { usersApi, type User } from '@/lib/api'
import { Input } from '@/components/ui/input'

export default function UserManagementTab() {
    const { data: users = [], isLoading } = useUsers()
    const { mutate: deleteUser } = useDeleteUser()
    const [addOpen, setAddOpen] = useState(false)
    const [resetTarget, setResetTarget] = useState<User | null>(null)
    const [query, setQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'student' | 'faculty'>('all')
    const studentFileRef = useRef<HTMLInputElement>(null)
    const facultyFileRef = useRef<HTMLInputElement>(null)
    const loggedInUser = localStorage.getItem('username')

    const handleBulkUpload = async (file: File, type: 'students' | 'faculty') => {
        const fd = new FormData()
        fd.append('file', file)
        try {
            const res = type === 'students' ? await usersApi.bulkUploadStudents(fd) : await usersApi.bulkUploadFaculty(fd)
            toast.success(`Bulk upload complete: ${res.created ?? 0} created, ${res.skipped ?? 0} skipped`)
        } catch {
            toast.error('Bulk upload failed')
        }
    }

    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const q = query.trim().toLowerCase()
            const matchesQuery = q ? u.username.toLowerCase().includes(q) : true
            const matchesRole = roleFilter === 'all' ? true : u.role === roleFilter
            return matchesQuery && matchesRole
        })
    }, [users, query, roleFilter])

    const downloadTemplate = () => {
        const headers = ['uid', 'full_name', 'semester', 'section', 'year_of_admission']
        const sample = ['24003001', 'John A Doe', '6', 'A', '2024']
        const csv = `${headers.join(',')}\n${sample.join(',')}\n`
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'students_bulk_template.csv'
        a.click()
        URL.revokeObjectURL(url)
    }

    const columns = [
        {
            header: 'User ID',
            cell: (u: User) => (
                <div className="flex items-center gap-2">
                    <UserCircle2 className="w-7 h-7 text-slate-300" />
                    <span className="font-semibold text-slate-700">{u.username}</span>
                </div>
            ),
        },
        { header: 'Role', cell: (u: User) => <RoleBadge role={u.role} /> },
        {
            header: 'Status',
            cell: (u: User) => (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700">
                    {u.status ?? 'Active'}
                </span>
            ),
        },
        { header: 'Created', cell: (u: User) => <span className="text-slate-600">{u.created ?? '2024-01-01'}</span> },
        {
            header: 'Actions',
            cell: (u: User) => (
                <div className="flex gap-1.5 flex-wrap">
                    <Button
                        size="sm"
                        className="bg-violet-600 text-white hover:bg-violet-700 h-7 px-2 text-xs"
                        onClick={() => setResetTarget(u)}
                    >
                        <KeyRound className="w-3 h-3 mr-1" /> Password
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                size="sm"
                                className="h-7 px-2 text-xs bg-red-50 text-red-500 border border-red-200 hover:bg-red-100"
                                disabled={u.username === loggedInUser}
                            >
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to delete <strong>{u.username}</strong>? This cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteUser(u.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ),
        },
    ]

    return (
        <div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-5">
                <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center gap-3 flex-wrap">
                    <h2 className="text-[32px] leading-none font-semibold text-slate-700 flex items-center gap-2">
                        <Users2 className="w-5 h-5 text-slate-500" />
                        User Management
                    </h2>
                    <div className="bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg">
                        Primary Hub: Create students & faculty here. They will appear in respective sections once profiles are complete.
                    </div>
                </div>

                <div className="px-4 py-3 border-b border-slate-200">
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="relative w-full md:w-[220px]">
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                            <Input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by User ID..."
                                className="pl-8 h-8 text-xs"
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'student' | 'faculty')}
                            className="h-8 rounded-md border border-slate-200 px-2 text-xs text-slate-700 bg-white"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="student">Student</option>
                            <option value="faculty">Faculty</option>
                        </select>

                        <input
                            ref={studentFileRef}
                            type="file"
                            accept=".csv,.xlsx"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files?.[0]) handleBulkUpload(e.target.files[0], 'students')
                                e.target.value = ''
                            }}
                        />
                        <Button
                            size="sm"
                            className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white"
                            onClick={() => studentFileRef.current?.click()}
                        >
                            <Upload className="w-3.5 h-3.5 mr-1" /> Bulk Upload Student
                        </Button>

                        <input
                            ref={facultyFileRef}
                            type="file"
                            accept=".csv,.xlsx"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files?.[0]) handleBulkUpload(e.target.files[0], 'faculty')
                                e.target.value = ''
                            }}
                        />
                        <Button
                            size="sm"
                            className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white"
                            onClick={() => facultyFileRef.current?.click()}
                        >
                            <BriefcaseBusiness className="w-3.5 h-3.5 mr-1" /> Bulk Upload Faculty
                        </Button>

                        <Button
                            size="sm"
                            className="h-8 bg-amber-500 hover:bg-amber-600 text-white"
                            onClick={downloadTemplate}
                        >
                            <Download className="w-3.5 h-3.5 mr-1" /> Download Excel Format
                        </Button>

                        <Button size="sm" className="h-8 bg-sky-500 hover:bg-sky-600 text-white" onClick={() => setAddOpen(true)}>
                            <Plus className="w-3.5 h-3.5 mr-1" /> Add User
                        </Button>
                    </div>
                </div>

                <DataTable columns={columns} data={filteredUsers} isLoading={isLoading} keyExtractor={(u) => u.id} />
            </div>

            <AddUserDialog open={addOpen} onOpenChange={setAddOpen} />
            {resetTarget && (
                <PasswordResetDialog
                    open={!!resetTarget}
                    onOpenChange={(v) => {
                        if (!v) setResetTarget(null)
                    }}
                    userId={resetTarget.id}
                    userName={resetTarget.username}
                />
            )}
        </div>
    )
}
