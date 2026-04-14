import { useMemo, useRef, useState } from 'react'
import { env } from '../../../app/config/env'
import { useAuth } from '../../../app/providers/auth-context'
import { useToast } from '../../../app/providers/toast-context'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { ConfirmDialog, DataTable, QueryState, SectionShell, type TableColumn } from '../../../shared/ui'
import type {
  AdminUserSummary,
  BulkFacultyRowInput,
  BulkOperationItem,
  BulkStudentRowInput,
} from '../api'
import {
  useBulkRegisterFacultyMutation,
  useBulkRegisterStudentsMutation,
  useAdminUsersQuery,
  useDeleteAdminUserMutation,
} from '../hooks'
import { AddUserModal } from '../components/users/AddUserModal'
import { BulkUploadReport } from '../components/users/BulkUploadReport'
import { ResetPasswordModal } from '../components/users/ResetPasswordModal'
import { downloadCsvTemplate, parseCsv } from '../utils/csv'

const USER_ROLE_FILTERS = ['all', 'admin', 'faculty', 'student', 'unknown'] as const

type UserRoleFilter = (typeof USER_ROLE_FILTERS)[number]

function roleBadgeClass(role: AdminUserSummary['role']): string {
  switch (role) {
    case 'admin':
      return 'role-badge role-badge--admin'
    case 'faculty':
      return 'role-badge role-badge--faculty'
    case 'student':
      return 'role-badge role-badge--student'
    default:
      return 'role-badge role-badge--unknown'
  }
}

function formatDate(value: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed)
}

function avatarInitials(row: AdminUserSummary): string {
  const source = row.name || row.username
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  return source.slice(0, 2).toUpperCase() || 'NA'
}

function resolveImageUrl(url: string | null): string | null {
  if (!url) return null

  try {
    return new URL(url, env.apiBaseUrl || window.location.origin).toString()
  } catch {
    return url
  }
}

function normalizeStudentBulkRows(rawRows: Record<string, string>[]): BulkStudentRowInput[] {
  return rawRows.map((row) => ({
    uid: (row.uid ?? '').trim(),
    full_name: (row.full_name ?? row.name ?? '').trim(),
    semester: Number(row.semester ?? 0),
    section: (row.section ?? '').trim(),
    year_of_admission: Number(row.year_of_admission ?? 0),
  }))
}

function normalizeFacultyBulkRows(rawRows: Record<string, string>[]): BulkFacultyRowInput[] {
  return rawRows.map((row) => ({
    email: (row.email ?? '').trim().toLowerCase(),
    first_name: (row.first_name ?? '').trim(),
    last_name: (row.last_name ?? '').trim(),
    contact_number: (row.contact_number ?? '').trim(),
    password: (row.password ?? '').trim() || undefined,
  }))
}

function parseBulkRows(file: File): Promise<Record<string, string>[]> {
  return file.text().then((content) => parseCsv(content))
}

export function AdminUsersPage() {
  const [searchValue, setSearchValue] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>('all')

  const [isAddOpen, setIsAddOpen] = useState(false)
  const [resetTarget, setResetTarget] = useState<AdminUserSummary | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminUserSummary | null>(null)

  const [studentBulkRows, setStudentBulkRows] = useState<BulkOperationItem[]>([])
  const [facultyBulkRows, setFacultyBulkRows] = useState<BulkOperationItem[]>([])

  const studentInputRef = useRef<HTMLInputElement | null>(null)
  const facultyInputRef = useRef<HTMLInputElement | null>(null)

  const { user } = useAuth()
  const toast = useToast()

  const usersQuery = useAdminUsersQuery()
  const deleteMutation = useDeleteAdminUserMutation()
  const bulkStudentsMutation = useBulkRegisterStudentsMutation()
  const bulkFacultyMutation = useBulkRegisterFacultyMutation()

  const filteredRows = useMemo(() => {
    const rows = usersQuery.data ?? []
    const search = searchValue.trim().toLowerCase()

    return rows.filter((row) => {
      const matchesSearch = search
        ? [row.username, row.name]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(search))
        : true

      const matchesRole = roleFilter === 'all' ? true : row.role === roleFilter

      return matchesSearch && matchesRole
    })
  }, [usersQuery.data, searchValue, roleFilter])

  const columns = useMemo<TableColumn<AdminUserSummary>[]>(
    () => [
      {
        id: 'identity',
        header: 'User',
        cell: (row) => (
          <div className="admin-identity">
            {row.profilePhotoUrl ? (
              <img
                src={resolveImageUrl(row.profilePhotoUrl) ?? undefined}
                alt={`${row.name} profile`}
                className="admin-avatar"
                loading="lazy"
              />
            ) : (
              <span className="admin-avatar admin-avatar--placeholder">{avatarInitials(row)}</span>
            )}
            <div>
              <p className="admin-identity__primary">{row.username}</p>
              <p className="admin-identity__secondary">{row.name}</p>
            </div>
          </div>
        ),
      },
      {
        id: 'role',
        header: 'Role',
        cell: (row) => <span className={roleBadgeClass(row.role)}>{row.role}</span>,
      },
      {
        id: 'status',
        header: 'Status',
        cell: (row) => <span className="status-pill">{row.status}</span>,
      },
      {
        id: 'createdAt',
        header: 'Created',
        cell: (row) => <span className="muted-cell">{formatDate(row.createdAt)}</span>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: (row) => (
          <div className="table-actions">
            <button
              type="button"
              className="button button--ghost"
              onClick={() => setResetTarget(row)}
              disabled={row.role === 'admin' || row.role === 'unknown'}
            >
              Reset Password
            </button>
            <button
              type="button"
              className="button button--danger"
              onClick={() => setDeleteTarget(row)}
              disabled={row.id === user?.id || row.username === user?.username}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [user?.id, user?.username],
  )

  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      await deleteMutation.mutateAsync({ userId: deleteTarget.id })
      setDeleteTarget(null)
    } catch {
      // handled by mutation toast
    }
  }

  const handleBulkStudentFile = async (file: File) => {
    try {
      const rows = await parseBulkRows(file)
      if (rows.length === 0) {
        toast.error('The uploaded student CSV has no data rows.')
        return
      }

      const payload = normalizeStudentBulkRows(rows)
      const result = await bulkStudentsMutation.mutateAsync(payload)
      setStudentBulkRows(result.rows)
    } catch (error) {
      toast.error(toApiErrorMessage(error, 'Unable to process student CSV file.'))
    }
  }

  const handleBulkFacultyFile = async (file: File) => {
    try {
      const rows = await parseBulkRows(file)
      if (rows.length === 0) {
        toast.error('The uploaded faculty CSV has no data rows.')
        return
      }

      const payload = normalizeFacultyBulkRows(rows)
      const result = await bulkFacultyMutation.mutateAsync(payload)
      setFacultyBulkRows(result.rows)
    } catch (error) {
      toast.error(toApiErrorMessage(error, 'Unable to process faculty CSV file.'))
    }
  }

  if (usersQuery.isError) {
    return (
      <SectionShell title="Users" subtitle="Directory of all platform users.">
        <QueryState
          tone="error"
          title="Unable to load users"
          description={toApiErrorMessage(usersQuery.error, 'Please retry in a moment.')}
          actionLabel="Retry"
          onAction={() => void usersQuery.refetch()}
        />
      </SectionShell>
    )
  }

  return (
    <SectionShell
      title="Users"
      subtitle="Create, delete, reset passwords, and run bulk registration uploads."
      actions={(
        <div className="admin-filter-grid">
          <label className="admin-field" htmlFor="users-search">
            <span>Search</span>
            <input
              id="users-search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Username or name"
              autoComplete="off"
            />
          </label>

          <label className="admin-field" htmlFor="users-role-filter">
            <span>Role</span>
            <select
              id="users-role-filter"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value as UserRoleFilter)}
            >
              {USER_ROLE_FILTERS.map((role) => (
                <option key={role} value={role}>
                  {role === 'all' ? 'All roles' : role}
                </option>
              ))}
            </select>
          </label>

          <div className="admin-toolbar">
            <button type="button" className="button button--primary" onClick={() => setIsAddOpen(true)}>
              Create User
            </button>

            <button
              type="button"
              className="button button--ghost"
              onClick={() => downloadCsvTemplate(
                'students_bulk_template.csv',
                ['uid', 'full_name', 'semester', 'section', 'year_of_admission'],
                ['24003001', 'John A Doe', '6', 'A', '2024'],
              )}
            >
              Student CSV Template
            </button>

            <button
              type="button"
              className="button button--ghost"
              onClick={() => downloadCsvTemplate(
                'faculty_bulk_template.csv',
                ['email', 'first_name', 'last_name', 'contact_number', 'password'],
                ['faculty@stvincentngp.edu.in', 'John', 'Doe', '9999999999', 'Pass@1234'],
              )}
            >
              Faculty CSV Template
            </button>

            <button
              type="button"
              className="button button--ghost"
              onClick={() => studentInputRef.current?.click()}
              disabled={bulkStudentsMutation.isPending}
            >
              {bulkStudentsMutation.isPending ? 'Uploading...' : 'Upload Students CSV'}
            </button>

            <button
              type="button"
              className="button button--ghost"
              onClick={() => facultyInputRef.current?.click()}
              disabled={bulkFacultyMutation.isPending}
            >
              {bulkFacultyMutation.isPending ? 'Uploading...' : 'Upload Faculty CSV'}
            </button>

            <input
              ref={studentInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden-input"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  void handleBulkStudentFile(file)
                }
                event.target.value = ''
              }}
            />

            <input
              ref={facultyInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden-input"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  void handleBulkFacultyFile(file)
                }
                event.target.value = ''
              }}
            />
          </div>
        </div>
      )}
    >
      <DataTable
        columns={columns}
        data={filteredRows}
        keyExtractor={(row) => row.id}
        isLoading={usersQuery.isPending}
        pageSize={12}
        emptyLabel="No users matched the current filter."
      />

      <BulkUploadReport title="Student Bulk Upload" rows={studentBulkRows} />
      <BulkUploadReport title="Faculty Bulk Upload" rows={facultyBulkRows} />

      <AddUserModal open={isAddOpen} onClose={() => setIsAddOpen(false)} />

      <ResetPasswordModal
        open={Boolean(resetTarget)}
        user={resetTarget}
        onClose={() => setResetTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete User"
        message={deleteTarget ? `Delete ${deleteTarget.username}? This cannot be undone.` : 'Delete selected user?'}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        tone="danger"
        isBusy={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleDelete()}
      />
    </SectionShell>
  )
}
