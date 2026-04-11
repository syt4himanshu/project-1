const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002'

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
        throw new Error(err.message || err.error || 'Request failed')
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
    changePassword: (body: { old_password: string; new_password: string }) =>
        request('/api/auth/change-password', { method: 'POST', body: JSON.stringify(body) }),
}

// ── Stats ─────────────────────────────────────────────────────────────────────
// Backend route: GET /api/admin/statistics
// Response: { totalUsers, totalStudents, totalTeachers, activeUsers }
export interface Stats {
    total_users: number
    total_students: number
    total_faculty: number
    active_users: number
}
export const statsApi = {
    get: async () => {
        const raw = await request<Record<string, number>>('/api/admin/statistics')
        return {
            total_users: raw.total_users ?? raw.totalUsers ?? 0,
            total_students: raw.total_students ?? raw.totalStudents ?? 0,
            total_faculty: raw.total_faculty ?? raw.totalTeachers ?? raw.totalFaculty ?? 0,
            active_users: raw.active_users ?? raw.activeUsers ?? 0,
        } satisfies Stats
    },
}

// ── Users ─────────────────────────────────────────────────────────────────────
// Backend routes: GET/POST /api/admin/users, DELETE /api/admin/users/:id
// Reset: POST /api/admin/reset-password { role, username, new_password }
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

    // Backend: POST /api/admin/reset-password { role, username, new_password }
    resetPassword: (role: string, username: string, new_password: string) =>
        request('/api/admin/reset-password', {
            method: 'POST',
            body: JSON.stringify({ role, username, new_password }),
        }),

    // Bulk register: client-side CSV parse → send JSON array to existing bulk endpoints
    // Backend: POST /api/auth/register/bulk (JSON array of student objects)
    bulkRegisterStudents: (rows: Record<string, unknown>[]) =>
        request<{ result: { uid?: string; status: string; error?: string }[] }>(
            '/api/auth/register/bulk',
            { method: 'POST', body: JSON.stringify(rows) },
        ),

    // Backend: POST /api/auth/register/faculty/bulk (JSON array of faculty objects)
    bulkRegisterFaculty: (rows: Record<string, unknown>[]) =>
        request<{ result: { email?: string; status: string; error?: string }[] }>(
            '/api/auth/register/faculty/bulk',
            { method: 'POST', body: JSON.stringify(rows) },
        ),
}

// ── Faculty ───────────────────────────────────────────────────────────────────
// Backend routes:
//   GET /api/admin/faculty          → full list with mentee UIDs
//   GET /api/admin/faculty/basic    → lightweight list
//   GET /api/admin/faculty/:id/mentees → mentee details for one faculty
//   DELETE /api/admin/faculty/:id
export interface Faculty {
    id: number
    user_id?: number
    uid?: string
    name?: string
    first_name: string
    last_name: string
    email: string
    contact_number?: string
    contact?: string
    assigned_count: number
    studentsAssigned?: string[]
    students?: { id: number; name?: string; uid: string; full_name?: string; semester?: number; section?: string }[]
}

type FacultyApiResponse = {
    id: number
    user_id?: number
    uid?: string
    name?: string
    first_name?: string
    last_name?: string
    firstName?: string
    lastName?: string
    email: string
    contact_number?: string
    contact?: string
    assigned_count?: number
    studentsAssigned?: string[]
}

function normalizeFaculty(raw: FacultyApiResponse): Faculty {
    return {
        id: raw.id,
        user_id: raw.user_id,
        uid: raw.uid,
        name: raw.name,
        first_name: raw.first_name ?? raw.firstName ?? '',
        last_name: raw.last_name ?? raw.lastName ?? '',
        email: raw.email,
        contact_number: raw.contact_number ?? raw.contact ?? '',
        contact: raw.contact ?? raw.contact_number,
        assigned_count: raw.assigned_count ?? raw.studentsAssigned?.length ?? 0,
        studentsAssigned: raw.studentsAssigned ?? [],
    }
}

export const facultyApi = {
    // GET /api/admin/faculty — returns full list with studentsAssigned (UIDs)
    list: async () => {
        const rows = await request<FacultyApiResponse[]>('/api/admin/faculty')
        return rows.map(normalizeFaculty)
    },

    // Compose faculty detail by fetching the full list and the mentees separately
    get: async (id: number): Promise<Faculty> => {
        const [allFaculty, mentees] = await Promise.all([
            request<FacultyApiResponse[]>('/api/admin/faculty'),
            request<{ id: number; uid: string; full_name: string; semester?: number; section?: string }[]>(
                `/api/admin/faculty/${id}/mentees`
            ),
        ])
        const faculty = allFaculty.map(normalizeFaculty).find((f) => f.id === id)
        if (!faculty) throw new Error('Faculty not found')
        return {
            ...faculty,
            assigned_count: mentees.length,
            students: mentees.map((m) => ({
                id: m.id,
                uid: m.uid,
                full_name: m.full_name,
                name: m.full_name,
                semester: m.semester,
                section: m.section,
            })),
        }
    },

    delete: (id: number) => request(`/api/admin/faculty/${id}`, { method: 'DELETE' }),
}

// ── Students ──────────────────────────────────────────────────────────────────
// Backend routes:
//   GET /api/students      → searchStudents (admin sees all, faculty sees mentees)
//   DELETE /api/admin/student/:uid → deleteStudentByUid
export interface Student {
    id: number
    uid: string
    name: string
    full_name?: string
    semester: number
    section: string
    year_of_admission: number
    mentor_id?: number
    mentor_name?: string
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

type StudentApiResponse = Student & {
    full_name?: string
    past_education_records?: Record<string, unknown>[]
    post_admission_records?: Record<string, unknown>[]
}

function normalizeStudent(raw: StudentApiResponse): Student {
    const personalInfo = (raw.personal_info ?? {}) as Record<string, unknown>
    const skills = (raw.skills ?? {}) as Record<string, unknown>
    const careerObjective = (raw.career_objective ?? {}) as Record<string, unknown>

    return {
        ...raw,
        name: raw.name ?? raw.full_name ?? raw.uid,
        personal_info: {
            ...personalInfo,
            profile_photo: personalInfo.profile_photo ?? personalInfo.photo_url ?? null,
        },
        past_education: raw.past_education ?? raw.past_education_records ?? [],
        academic_records: raw.academic_records ?? raw.post_admission_records ?? [],
        career_goal: (careerObjective.career_goal as string) ?? raw.career_goal ?? '',
        domain_of_interest:
            (skills.domain_of_interest as string) ??
            (skills.domains_of_interest as string) ??
            raw.domain_of_interest ??
            '',
    }
}

export const studentsApi = {
    // GET /api/students — returns full serialized student list (includeIds=true for admin)
    list: async () => {
        const raw = await request<StudentApiResponse[]>('/api/students')
        return raw.map(normalizeStudent)
    },

    // GET /api/students?uid=... — fetch single student by uid
    getByUid: async (uid: string) => {
        const rows = await request<StudentApiResponse[]>(`/api/students?uid=${encodeURIComponent(uid)}`)
        const found = rows[0]
        if (!found) throw new Error('Student not found')
        return normalizeStudent(found)
    },

    // GET /api/students for a single student by integer id (search + find)
    get: async (id: number) => {
        const all = await request<StudentApiResponse[]>('/api/students')
        const found = all.find((s) => s.id === id)
        if (!found) throw new Error('Student not found')
        return normalizeStudent(found)
    },

    // DELETE /api/admin/student/:uid
    deleteByUid: (uid: string) => request(`/api/admin/student/${uid}`, { method: 'DELETE' }),
}

// ── Allocation ────────────────────────────────────────────────────────────────
// Backend routes: GET/POST /api/admin/allocation, GET /api/admin/allocation/:faculty_id/students
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
    enabled: true,
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
