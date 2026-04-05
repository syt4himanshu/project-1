const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function getHeaders(): HeadersInit {
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}`,
    }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: { ...getHeaders(), ...(options?.headers ?? {}) },
    })
    if (res.status === 401) {
        localStorage.clear()
        window.location.href = '/login'
        throw new Error('Unauthorized')
    }
    if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }))
        throw new Error(err.message || 'Request failed')
    }
    return res.json()
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
    login: async (body: { uid?: string; email?: string; password: string }) => {
        const raw = await request<{
            access_token: string
            role?: string
            username?: string
            user?: { role?: string; username?: string }
        }>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(body),
        })
        return {
            access_token: raw.access_token,
            role: raw.role ?? raw.user?.role ?? '',
            username: raw.username ?? raw.user?.username ?? '',
        }
    },
    verify: async () => {
        const raw = await request<{ valid: boolean; role?: string; user?: { role?: string } }>('/api/auth/verify')
        return {
            valid: Boolean(raw.valid),
            role: raw.role ?? raw.user?.role ?? '',
        }
    },
    changePassword: (body: { current_password: string; new_password: string }) =>
        request('/api/auth/change-password', { method: 'POST', body: JSON.stringify(body) }),
}

// ── Stats ─────────────────────────────────────────────────────────────────────
export interface Stats {
    total_users: number
    total_students: number
    total_faculty: number
    active_users: number
}
export const statsApi = {
    get: async () => {
        const raw = await request<Record<string, number>>('/api/admin/stats')
        return {
            total_users: raw.total_users ?? raw.totalUsers ?? 0,
            total_students: raw.total_students ?? raw.totalStudents ?? 0,
            total_faculty: raw.total_faculty ?? raw.totalTeachers ?? raw.totalFaculty ?? 0,
            active_users: raw.active_users ?? raw.activeUsers ?? 0,
        } satisfies Stats
    },
}

// ── Users ─────────────────────────────────────────────────────────────────────
export interface User {
    id: number
    username: string
    role: 'admin' | 'student' | 'faculty'
    name?: string
    status?: string
    created?: string
    created_at?: string
}
export const usersApi = {
    list: async () => {
        const raw = await request<User[]>('/api/admin/users')
        return raw.map((u) => ({
            ...u,
            name: u.name ?? u.username,
            status: u.status ?? 'Active',
            created: u.created ?? (u.created_at ? new Date(u.created_at).toISOString().slice(0, 10) : '2024-01-01'),
        }))
    },
    create: (body: Record<string, unknown>) =>
        request<User>('/api/admin/users', { method: 'POST', body: JSON.stringify(body) }),
    delete: (id: number) => request(`/api/admin/users/${id}`, { method: 'DELETE' }),
    resetPassword: (id: number, body: { new_password: string }) =>
        request(`/api/admin/users/${id}/reset-password`, { method: 'POST', body: JSON.stringify(body) }),
    bulkUploadStudents: (formData: FormData) =>
        fetch(`${BASE_URL}/api/admin/bulk-upload/students`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}` },
            body: formData,
        }).then((r) => r.json()),
    bulkUploadFaculty: (formData: FormData) =>
        fetch(`${BASE_URL}/api/admin/bulk-upload/faculty`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}` },
            body: formData,
        }).then((r) => r.json()),
}

// ── Faculty ───────────────────────────────────────────────────────────────────
export interface Faculty {
    id: number
    user_id: number
    first_name: string
    last_name: string
    email: string
    contact_number: string
    assigned_count: number
    students?: { id: number; name: string; uid: string }[]
}
export const facultyApi = {
    list: () => request<Faculty[]>('/api/admin/faculty'),
    get: (id: number) => request<Faculty>(`/api/admin/faculty/${id}`),
    delete: (id: number) => request(`/api/admin/faculty/${id}`, { method: 'DELETE' }),
}

// ── Students ──────────────────────────────────────────────────────────────────
export interface Student {
    id: number
    uid: string
    name: string
    semester: number
    section: string
    year_of_admission: number
    mentor_name?: string
    mentor_id?: number
    career_goal?: string
    domain_of_interest?: string
    personal_info?: Record<string, unknown>
    past_education?: Record<string, unknown>[]
    academic_records?: Record<string, unknown>[]
    projects?: Record<string, unknown>[]
    internships?: Record<string, unknown>[]
    co_curricular_participations?: Record<string, unknown>[]
    co_curricular_organizations?: Record<string, unknown>[]
    skills?: Record<string, unknown>
    swoc?: Record<string, unknown>
    career_objective?: Record<string, unknown>
}
export const studentsApi = {
    list: () => request<Student[]>('/api/admin/students'),
    get: (id: number) => request<Student>(`/api/admin/students/${id}`),
    delete: (id: number) => request(`/api/admin/students/${id}`, { method: 'DELETE' }),
}

// ── Allocation ────────────────────────────────────────────────────────────────
export interface AllocationEntry {
    faculty_id: number
    faculty_name: string
    email: string
    assigned_count: number
    capacity: number
}
export interface SuggestedStudent {
    id: number
    name: string
    uid: string
}
export const allocationApi = {
    list: () => request<AllocationEntry[]>('/api/admin/allocation'),
    generate: (faculty_id: number) =>
        request<SuggestedStudent[]>(`/api/admin/allocation/generate`, {
            method: 'POST',
            body: JSON.stringify({ faculty_id }),
        }),
    confirm: (faculty_id: number, student_ids: number[]) =>
        request('/api/admin/allocation/confirm', {
            method: 'POST',
            body: JSON.stringify({ faculty_id, student_ids }),
        }),
    remove: (faculty_id: number, student_ids: number[]) =>
        request('/api/admin/allocation/remove', {
            method: 'POST',
            body: JSON.stringify({ faculty_id, student_ids }),
        }),
    getAssigned: (faculty_id: number) =>
        request<SuggestedStudent[]>(`/api/admin/allocation/${faculty_id}/students`),
}

// ── Reports ───────────────────────────────────────────────────────────────────
export interface ReportStats {
    total_students: number
    avg_sgpa: number
    with_backlogs: number
    active_semesters: number
}
export interface Topper {
    rank: number
    name: string
    uid: string
    sgpa: number
    semester: number
}
export interface SemesterDist {
    semester: number
    count: number
}
export interface BacklogEntry {
    student_id: number
    name: string
    uid: string
    subjects: string[]
}
export interface IncompleteProfile {
    id: number
    name: string
    uid: string
    year_of_admission: number
    missing_fields: string[]
}
export const reportsApi = {
    stats: () => request<ReportStats>('/api/admin/reports/stats'),
    toppers: (semester?: number) =>
        request<Topper[]>(`/api/admin/reports/toppers${semester ? `?semester=${semester}` : ''}`),
    semesterDistribution: () => request<SemesterDist[]>('/api/admin/reports/semester-distribution'),
    backlogs: () => request<BacklogEntry[]>('/api/admin/reports/backlogs'),
    general: (params?: Record<string, string>) => {
        const qs = params ? '?' + new URLSearchParams(params).toString() : ''
        return request<Student[]>(`/api/admin/reports/general${qs}`)
    },
    incompleteProfiles: (year?: number) =>
        request<IncompleteProfile[]>(`/api/admin/reports/incomplete${year ? `?year=${year}` : ''}`),
    exportAll: () =>
        fetch(`${BASE_URL}/api/admin/reports/export/all`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}` },
        }),
    exportBacklog: () =>
        fetch(`${BASE_URL}/api/admin/reports/export/backlogs`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}` },
        }),
    exportIncomplete: (year?: number) =>
        fetch(`${BASE_URL}/api/admin/reports/export/incomplete${year ? `?year=${year}` : ''}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token') ?? ''}` },
        }),
}
