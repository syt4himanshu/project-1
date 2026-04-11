import { useEffect, useMemo, useRef, useState } from 'react'
import { BriefcaseBusiness, CheckCircle2, Download, KeyRound, Plus, Search, Upload, UserCircle2, Users2, XCircle } from 'lucide-react'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import DataTable from '@/components/shared/DataTable'
import RoleBadge from '@/components/shared/RoleBadge'
import AddUserDialog from './AddUserDialog'
import PasswordResetDialog from './PasswordResetDialog'
import { useUsers, useDeleteUser } from '@/hooks/useUsers'
import { usersApi, type User } from '@/lib/api'
import { Input } from '@/components/ui/input'

// ── CSV parser (no external lib needed) ───────────────────────────────────────
function parseCSV(text: string): Record<string, string>[] {
    const normalized = text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').trim()
    if (!normalized) return []

    const rows: string[][] = []
    let currentRow: string[] = []
    let currentValue = ''
    let inQuotes = false

    for (let index = 0; index < normalized.length; index += 1) {
        const char = normalized[index]
        const nextChar = normalized[index + 1]

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentValue += '"'
                index += 1
            } else {
                inQuotes = !inQuotes
            }
            continue
        }

        if (char === ',' && !inQuotes) {
            currentRow.push(currentValue.trim())
            currentValue = ''
            continue
        }

        if (char === '\n' && !inQuotes) {
            currentRow.push(currentValue.trim())
            rows.push(currentRow)
            currentRow = []
            currentValue = ''
            continue
        }

        currentValue += char
    }

    currentRow.push(currentValue.trim())
    rows.push(currentRow)

    if (rows.length < 2) return []

    const headers = rows[0].map((header) => header.replace(/^"|"$/g, '').trim())
    return rows
        .slice(1)
        .filter((row) => row.some((value) => value.trim() !== ''))
        .map((row) =>
            Object.fromEntries(headers.map((header, columnIndex) => [header, row[columnIndex]?.replace(/^"|"$/g, '').trim() ?? '']))
        )
}

function downloadCsv(filename: string, headers: string[], sample: string[]) {
    const csv = `\uFEFF${headers.join(',')}\n${sample.join(',')}\n`
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

interface BulkResult {
    identifier: string
    status: 'success' | 'failed'
    error?: string
}

function getAvatarInitials(user: User) {
    const source = user.name?.trim() || user.username.trim()
    const parts = source.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return source.slice(0, 2).toUpperCase()
}

function resolvePhotoUrl(photoUrl?: string | null) {
    if (!photoUrl) return null
    try {
        return new URL(photoUrl, import.meta.env.VITE_API_URL || window.location.origin).toString()
    } catch {
        return photoUrl
    }
}

function UserAvatar({ user, onPreview }: { user: User; onPreview: (user: User, photoUrl: string) => void }) {
    const [imageFailed, setImageFailed] = useState(false)
    const photoUrl = resolvePhotoUrl(user.profile_photo_url)

    useEffect(() => {
        setImageFailed(false)
    }, [photoUrl])

    if (photoUrl && !imageFailed) {
        return (
            <button
                type="button"
                className="rounded-full transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => onPreview(user, photoUrl)}
                title="View profile photo"
            >
                <img
                    src={photoUrl}
                    alt={`${user.name ?? user.username} profile`}
                    className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                    onError={() => setImageFailed(true)}
                />
            </button>
        )
    }

    if (user.role === 'student') {
        return (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                {getAvatarInitials(user)}
            </div>
        )
    }

    return <UserCircle2 className="h-9 w-9 text-slate-300" />
}

export default function UserManagementTab() {
    const { data: users = [], isLoading } = useUsers()
    const { mutate: deleteUser } = useDeleteUser()
    const [addOpen, setAddOpen] = useState(false)
    const [resetTarget, setResetTarget] = useState<User | null>(null)
    const [query, setQuery] = useState('')
    const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'student' | 'faculty'>('all')
    const [bulkResults, setBulkResults] = useState<BulkResult[] | null>(null)
    const [bulkLoading, setBulkLoading] = useState(false)
    const [previewUser, setPreviewUser] = useState<User | null>(null)
    const [previewPhotoUrl, setPreviewPhotoUrl] = useState<string | null>(null)
    const studentFileRef = useRef<HTMLInputElement>(null)
    const facultyFileRef = useRef<HTMLInputElement>(null)
    const loggedInUser = localStorage.getItem('username')

    const openPhotoPreview = (user: User, photoUrl: string) => {
        setPreviewUser(user)
        setPreviewPhotoUrl(photoUrl)
    }

    // ── Bulk upload: parse CSV client-side → POST JSON array ─────────────────
    const handleBulkUpload = async (file: File, type: 'students' | 'faculty') => {
        setBulkResults(null)
        setBulkLoading(true)
        try {
            const text = await file.text()
            const rows = parseCSV(text)
            if (!rows.length) {
                toast.error('CSV is empty or has no data rows')
                return
            }

            if (type === 'students') {
                // Expected columns: uid, full_name, semester, section, year_of_admission
                const mapped = rows.map((r) => ({
                    uid: r.uid?.trim(),
                    full_name: r.full_name || r.name || '',
                    semester: r.semester?.trim() ? Number(r.semester) : undefined,
                    section: r.section?.trim(),
                    year_of_admission: r.year_of_admission?.trim() ? Number(r.year_of_admission) : undefined,
                }))
                const res = await usersApi.bulkRegisterStudents(mapped)
                const resultRows = Array.isArray(res.result) ? res.result : []
                const results: BulkResult[] = resultRows.map((r) => ({
                    identifier: r.uid ?? '?',
                    status: r.status as 'success' | 'failed',
                    error: r.error,
                }))
                setBulkResults(results)
                const ok = results.filter((r) => r.status === 'success').length
                const fail = results.filter((r) => r.status === 'failed').length
                if (fail === 0) toast.success(`${ok} students created successfully`)
                else toast.warning(`${ok} created, ${fail} failed — see report below`)
            } else {
                // Expected columns: email, first_name, last_name, contact_number, password
                const mapped = rows.map((r) => ({
                    email: r.email?.trim(),
                    first_name: r.first_name?.trim(),
                    last_name: r.last_name?.trim(),
                    contact_number: r.contact_number?.trim(),
                    password: r.password?.trim() || undefined,
                }))
                const res = await usersApi.bulkRegisterFaculty(mapped)
                const resultRows = Array.isArray(res.result) ? res.result : []
                const results: BulkResult[] = resultRows.map((r) => ({
                    identifier: r.email ?? '?',
                    status: r.status as 'success' | 'failed',
                    error: r.error,
                }))
                setBulkResults(results)
                const ok = results.filter((r) => r.status === 'success').length
                const fail = results.filter((r) => r.status === 'failed').length
                if (fail === 0) toast.success(`${ok} faculty created successfully`)
                else toast.warning(`${ok} created, ${fail} failed — see report below`)
            }
        } catch (err: any) {
            toast.error(err?.message ?? 'Bulk upload failed')
        } finally {
            setBulkLoading(false)
        }
    }

    const filteredUsers = useMemo(() => {
        return users.filter((u) => {
            const q = query.trim().toLowerCase()
            const matchesQuery = q
                ? [u.username, u.name ?? ''].some((value) => value.toLowerCase().includes(q))
                : true
            const matchesRole = roleFilter === 'all' ? true : u.role === roleFilter
            return matchesQuery && matchesRole
        })
    }, [users, query, roleFilter])

    const downloadStudentTemplate = () => {
        downloadCsv(
            'students_bulk_template.csv',
            ['uid', 'full_name', 'semester', 'section', 'year_of_admission'],
            ['24003001', 'John A Doe', '6', 'A', '2024']
        )
    }

    const downloadFacultyTemplate = () => {
        downloadCsv(
            'faculty_bulk_template.csv',
            ['email', 'first_name', 'last_name', 'contact_number', 'password'],
            ['faculty@stvincentngp.edu.in', 'John', 'Doe', '9999999999', 'Pass@1234']
        )
    }

    const columns = [
        {
            header: 'User ID',
            cell: (u: User) => (
                <div className="flex items-center gap-2">
                    <UserAvatar user={u} onPreview={openPhotoPreview} />
                    <div className="min-w-0">
                        <span className="block truncate font-semibold text-slate-700">{u.username}</span>
                        {u.name && u.name !== u.username && (
                            <span className="block truncate text-xs text-slate-500">{u.name}</span>
                        )}
                    </div>
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
                        className="h-7 px-2 text-xs"
                        onClick={() => setResetTarget(u)}
                        disabled={u.role === 'admin'}
                        title={u.role === 'admin' ? 'Cannot reset admin password here' : 'Reset password'}
                    >
                        <KeyRound className="w-3 h-3 mr-1" /> Password
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                size="sm"
                                variant="destructive"
                                className="h-7 px-2 text-xs"
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
                        Primary Hub: Create students &amp; faculty here. They will appear in respective sections once profiles are complete.
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

                        {/* Bulk Student Upload */}
                        <input
                            ref={studentFileRef}
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files?.[0]) handleBulkUpload(e.target.files[0], 'students')
                                e.target.value = ''
                            }}
                        />
                        <Button
                            size="sm"
                            className="h-8"
                            onClick={() => studentFileRef.current?.click()}
                            disabled={bulkLoading}
                        >
                            <Upload className="w-3.5 h-3.5 mr-1" /> Bulk Upload Student
                        </Button>

                        {/* Bulk Faculty Upload */}
                        <input
                            ref={facultyFileRef}
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files?.[0]) handleBulkUpload(e.target.files[0], 'faculty')
                                e.target.value = ''
                            }}
                        />
                        <Button
                            size="sm"
                            className="h-8"
                            onClick={() => facultyFileRef.current?.click()}
                            disabled={bulkLoading}
                        >
                            <BriefcaseBusiness className="w-3.5 h-3.5 mr-1" /> Bulk Upload Faculty
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-blue-200 text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                            onClick={downloadStudentTemplate}
                        >
                            <Download className="w-3.5 h-3.5 mr-1" /> Student Template
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 border-blue-200 text-blue-700 hover:border-blue-300 hover:bg-blue-50"
                            onClick={downloadFacultyTemplate}
                        >
                            <Download className="w-3.5 h-3.5 mr-1" /> Faculty Template
                        </Button>

                        <Button size="sm" className="h-8" onClick={() => setAddOpen(true)}>
                            <Plus className="w-3.5 h-3.5 mr-1" /> Add User
                        </Button>
                    </div>
                </div>

                {/* Bulk upload result report */}
                {bulkResults && (
                    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Bulk Upload Results</h3>
                            <button
                                type="button"
                                className="text-xs text-blue-600 transition-colors hover:text-blue-700"
                                onClick={() => setBulkResults(null)}
                            >
                                Dismiss
                            </button>
                        </div>
                        <div className="max-h-48 overflow-y-auto space-y-1">
                            {bulkResults.map((r, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${r.status === 'success'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-red-50 text-red-700'
                                        }`}
                                >
                                    {r.status === 'success'
                                        ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                                        : <XCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                                    <span className="font-mono font-medium">{r.identifier}</span>
                                    {r.error && <span className="text-red-500">— {r.error}</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
                    userRole={resetTarget.role}
                />
            )}
            <Dialog
                open={!!previewUser && !!previewPhotoUrl}
                onOpenChange={(open) => {
                    if (!open) {
                        setPreviewUser(null)
                        setPreviewPhotoUrl(null)
                    }
                }}
            >
                <DialogContent className="max-w-xl border-0 bg-white p-4">
                    <DialogHeader>
                        <DialogTitle>{previewUser?.name ?? previewUser?.username ?? 'Profile Photo'}</DialogTitle>
                    </DialogHeader>
                    {previewPhotoUrl && (
                        <img
                            src={previewPhotoUrl}
                            alt={`${previewUser?.name ?? previewUser?.username ?? 'User'} profile`}
                            className="mx-auto max-h-[70vh] w-full rounded-xl object-contain"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
