import { useEffect, useMemo, useRef, useState } from 'react'
import { env } from '../../../app/config/env'
import { useAuth } from '../../../app/providers/auth-context'
import { useToast } from '../../../app/providers/toast-context'
import { toApiErrorMessage } from '../../../shared/api/errorMapper'
import { ConfirmDialog, DataTable, QueryState, type TableColumn } from '../../../shared/ui'
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
import { PhotoAvatar } from '../../../shared/components/PhotoAvatar'

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

  const studentInputRef = useRef<HTMLInputElement>(null)
  const facultyInputRef = useRef<HTMLInputElement>(null)

  const { user } = useAuth()
  const toast = useToast()

  useEffect(() => {
    document.title = 'User Management - KYS'
  }, [])

  const usersQuery = useAdminUsersQuery()
  const deleteMutation = useDeleteAdminUserMutation()
  const bulkStudentsMutation = useBulkRegisterStudentsMutation()
  const bulkFacultyMutation = useBulkRegisterFacultyMutation()

  useEffect(() => {
    if (!usersQuery.data) return
    console.log('[ADMIN] photoUrls:', usersQuery.data.map((row) => ({
      username: row.username,
      photoUrl: row.photoUrl,
    })))
  }, [usersQuery.data])

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
            {row.photoUrl ? (
              <PhotoAvatar
                url={resolveImageUrl(row.photoUrl)}
                alt={`${row.name} profile`}
                className="admin-avatar"
                fallback={<span className="admin-avatar admin-avatar--placeholder">{avatarInitials(row)}</span>}
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
              className="button button--soft"
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
      <div className="admin-page">
        <div className="admin-page__header">
          <h3 className="admin-page__title">User Management</h3>
          <p className="admin-page__subtitle">Create, delete, reset passwords, and run bulk registration uploads.</p>
        </div>
        <QueryState
          tone="error"
          title="Unable to load users"
          description={toApiErrorMessage(usersQuery.error, 'Please retry in a moment.')}
          actionLabel="Retry"
          onAction={() => void usersQuery.refetch()}
        />
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h3 className="admin-page__title">User Management</h3>
        <p className="admin-page__subtitle">Create, delete, reset passwords, and run bulk registration uploads.</p>
      </div>

      <div className="admin-toolbar-grid admin-toolbar-grid--users">
        <div className="role-toolbar__card role-toolbar__card--filters admin-toolbar-block">
          <div className="role-field role-field--icon">
            <span className="material-symbols-outlined">search</span>
            <input
              className="role-input role-input--with-icon"
              placeholder="Search by name, email or ID"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              type="text"
            />
          </div>
          <div className="role-toolbar__inline">
            <span className="role-toolbar__label">Role Filter:</span>
            <select
              className="role-select"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value as UserRoleFilter)}
            >
              {USER_ROLE_FILTERS.map((role) => (
                <option key={role} value={role}>
                  {role === 'all' ? 'All Roles' : role}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="role-toolbar__card role-toolbar__card--cta admin-toolbar-cta">
          <div className="admin-toolbar-cta__head">
            <span className="material-symbols-outlined" aria-hidden="true">person_add</span>
            <span className="admin-toolbar-cta__badge">New</span>
          </div>
          <button
            className="admin-toolbar-cta__button"
            onClick={() => setIsAddOpen(true)}
          >
            Create User
          </button>
        </div>

        <div className="role-toolbar__card role-toolbar__card--bulk admin-toolbar-block">
          <h4 className="role-toolbar__label role-toolbar__label--tight">Bulk Operations</h4>
          <div className="admin-toolbar-buttons-grid">
            <button
              className="button button--ghost button--icon"
              onClick={() => downloadCsvTemplate(
                'students_bulk_template.csv',
                ['uid', 'full_name', 'semester', 'section', 'year_of_admission'],
                ['24003001', 'John A Doe', '6', 'A', '2024'],
              )}
            >
              <span className="material-symbols-outlined" aria-hidden="true">download</span> Student CSV Template
            </button>
            <button
              className="button button--ghost button--icon"
              onClick={() => downloadCsvTemplate(
                'faculty_bulk_template.csv',
                ['email', 'first_name', 'last_name', 'contact_number', 'password'],
                ['faculty@stvincentngp.edu.in', 'John', 'Doe', '9999999999', 'Pass@1234'],
              )}
            >
              <span className="material-symbols-outlined" aria-hidden="true">download</span> Faculty CSV Template
            </button>
            <button
              className="button button--ghost button--icon"
              onClick={() => studentInputRef.current?.click()}
              disabled={bulkStudentsMutation.isPending}
            >
              <span className="material-symbols-outlined" aria-hidden="true">upload</span> {bulkStudentsMutation.isPending ? 'Uploading...' : 'Upload Students CSV'}
            </button>
            <button
              className="button button--ghost button--icon"
              onClick={() => facultyInputRef.current?.click()}
              disabled={bulkFacultyMutation.isPending}
            >
              <span className="material-symbols-outlined" aria-hidden="true">upload</span> {bulkFacultyMutation.isPending ? 'Uploading...' : 'Upload Faculty CSV'}
            </button>
          </div>
        </div>
      </div>

      <div className="admin-surface">
        <DataTable
          columns={columns}
          data={filteredRows}
          keyExtractor={(row) => row.id}
          isLoading={usersQuery.isPending}
          pageSize={12}
          emptyLabel="No users matched the current filter."
        />
      </div>

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
  )
}
