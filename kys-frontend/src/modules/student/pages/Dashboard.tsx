import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMentor, getMentoringMinutes, getProfile } from '../api/student'
import ChangePasswordModal from '../components/ChangePasswordModal'
import { PhotoAvatar } from '../../../shared/components/PhotoAvatar'
import { extractStudentPhotoUrl } from '../../../shared/utils/studentPhoto'
import { isDraftResetMarked } from '../utils/studentProfileDraft'
import { extractHighlights } from '../utils/remarkHighlights'
import { ThemeToggleButton } from '../../../shared/ui/theme-toggle'
import { useTheme } from '../../../app/providers/ThemeProvider'

interface MentoringMinute {
    id: number
    faculty_name: string
    faculty_email: string
    semester: number
    date: string
    remarks: string
    mentor_remarks?: string
    issues?: string
    suggestion: string
    action: string
}

interface Mentor {
    id: number
    email: string
    full_name: string
    contact_number: string
}

interface StudentProfile {
    full_name?: string
    is_profile_locked?: boolean
    profile_locked_at?: string | null
    profile_locked_by?: number | null
    personal_info?: {
        photoUrl?: string
        photo_url?: string
        photoPreviewUrl?: string
        photo_preview_url?: string
    }
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

function initials(name: string) {
    const parts = name.split(' ').filter(Boolean)
    if (parts.length === 0) return ''
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Dashboard() {
    const { token, user, logout } = useAuth()
    const { theme } = useTheme()
    const navigate = useNavigate()
    const isDark = theme === 'dark'

    const [profile, setProfile] = useState<StudentProfile | null>(null)
    const [minutes, setMinutes] = useState<MentoringMinute[]>([])
    const [mentor, setMentor] = useState<Mentor | null>(null)

    const [loadingProfile, setLoadingProfile] = useState(true)
    const [loadingMinutes, setLoadingMinutes] = useState(true)
    const [loadingMentor, setLoadingMentor] = useState(true)

    const [showPwModal, setShowPwModal] = useState(false)
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const draftKey = `kys_student_profile_draft_${user?.id || user?.username || 'guest'}`
    const resetMarked = useMemo(() => isDraftResetMarked(draftKey), [draftKey])

    useEffect(() => {
        if (!token) return

        let isMounted = true

        getProfile({ token })
            .then(r => {
                if (!isMounted) return
                const profileData = (r.data ?? {}) as StudentProfile
                setProfile(profileData)
            })
            .catch(() => { })
            .finally(() => {
                if (isMounted) setLoadingProfile(false)
            })

        getMentoringMinutes({ token })
            .then(r => {
                if (!isMounted) return
                setMinutes(r.data as unknown as MentoringMinute[])
            })
            .catch(() => { })
            .finally(() => {
                if (isMounted) setLoadingMinutes(false)
            })

        getMentor({ token })
            .then(r => {
                if (!isMounted) return
                setMentor(r.data as unknown as Mentor)
            })
            .catch(() => { })
            .finally(() => {
                if (isMounted) setLoadingMentor(false)
            })

        return () => {
            isMounted = false
        }
    }, [token])

    const studentName = useMemo(() => {
        const fullName = profile?.full_name?.trim()
        if (fullName) return fullName

        const parts = [
            (profile as Record<string, unknown>)?.first_name,
            (profile as Record<string, unknown>)?.middle_name,
            (profile as Record<string, unknown>)?.last_name
        ].filter(Boolean).map(s => String(s).trim()).filter(Boolean).join(' ')
        if (parts) return parts

        const pInfoName = ((profile as Record<string, unknown>)?.personal_info as Record<string, unknown>)?.full_name
        if (typeof pInfoName === 'string' && pInfoName.trim()) return pInfoName.trim()

        const username = user?.username?.trim()
        if (username && !/^\d+$/.test(username)) return username

        return username ? `Student (${username})` : 'Student'
    }, [profile, user])

    const studentPhotoUrl = useMemo(() => {
        if (resetMarked) return ''
        const resolved = extractStudentPhotoUrl(profile)
        return resolved ?? ''
    }, [profile, resetMarked])

    return (
        <div
            className="min-h-screen border transition-colors duration-300"
            style={{
                backgroundColor: isDark ? '#0f172a' : '#f5f7fb',
                borderColor: isDark ? '#334155' : '#e5e7eb',
                color: isDark ? '#f1f5f9' : '#1e2d4e',
            }}
        >
            <header
                className="shadow-lg"
                style={{
                    background: 'linear-gradient(90deg, #0f2746, #223f6a)',
                }}
            >
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border text-[#f0c36b]" style={{ borderColor: isDark ? 'rgba(240,195,107,.3)' : '#dbe4f1', backgroundColor: isDark ? '#0b1d36' : '#ffffff' }}>
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 3 2 8l10 5 10-5-10-5Z" />
                                <path d="M4 11v5.5L12 21l8-4.5V11" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-serif text-xl font-semibold text-white">Mentee Portal</p>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#b8c8df]">Know Your Student</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white">
                            Hello, <span className="font-semibold">{loadingProfile ? '...' : studentName}</span>
                        </div>

                        <button
                            onClick={() => setShowPwModal(true)}
                            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
                        >
                            Change Password
                        </button>

                        <ThemeToggleButton className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20" />

                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="rounded-full border px-4 py-2 text-sm font-medium transition hover:opacity-80"
                            style={{ borderColor: '#e7a09c', backgroundColor: isDark ? 'rgba(122,32,32,.2)' : '#fff2f1', color: isDark ? '#ffd5d3' : '#a12622' }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <section className="border-b-2 border-[#f0c36b]" style={{ background: 'linear-gradient(90deg, #1d365d, #40567a)' }}>
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b9c6dc]">Welcome Back</p>
                        <h1 className="font-serif text-3xl font-semibold uppercase leading-tight text-white sm:text-4xl lg:text-5xl">
                            {loadingProfile ? 'Loading...' : studentName}
                        </h1>
                        <p className="max-w-2xl text-sm text-[#d4ddee] sm:text-base">
                            Manage your profile, track mentoring sessions and monitor progress.
                        </p>
                    </div>
                    <div className="ml-0 flex h-24 w-24 overflow-hidden items-center justify-center rounded-full border-4 border-[#f0c36b]/60 text-2xl font-bold shadow-xl md:ml-6" style={{ backgroundColor: isDark ? '#102846' : '#e8eef8', color: isDark ? '#ffffff' : '#1e2d4e' }}>
                        <PhotoAvatar
                            url={studentPhotoUrl}
                            alt="Profile"
                            className="h-24 w-24 object-cover"
                            loading="eager"
                            fallback={initials(studentName)}
                        />
                    </div>
                </div>
            </section>

            <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {profile?.is_profile_locked && (
                    <div className="mb-6 rounded-2xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4 text-amber-900 dark:text-amber-200">
                        <div className="flex items-center gap-2 font-semibold text-base">
                            🔒 Profile Locked
                        </div>
                        <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                            Your faculty mentor has locked your profile. You can view your profile, but you cannot edit it while it is locked.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <section className="rounded-3xl border p-6 shadow-sm" style={{ backgroundColor: isDark ? '#111c34' : '#ffffff', borderColor: isDark ? '#334155' : '#dbe4f1' }}>
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#4f6ea1]">Profile</p>
                        <h2 className="font-serif text-3xl font-semibold" style={{ color: isDark ? '#f1f5f9' : '#1e2d4e' }}>
                            {profile?.is_profile_locked ? 'View Profile' : 'Update Profile'}
                        </h2>
                        <p className="mt-1 text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                            {profile?.is_profile_locked
                                ? 'View your academic and personal details (Editing locked by mentor)'
                                : 'Keep your academic and personal details current'}
                        </p>

                        <div className="mt-6 rounded-2xl border p-4" style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#dbe4f1' }}>
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 shrink-0 overflow-hidden items-center justify-center rounded-full bg-[#e8eef8] text-sm font-bold text-[#2f4d7a]">
                                    <PhotoAvatar
                                        url={studentPhotoUrl}
                                        alt="Profile"
                                        className="h-12 w-12 object-cover"
                                        fallback={initials(studentName)}
                                    />
                                </div>
                                <p className="text-sm" style={{ color: isDark ? '#cbd5e1' : '#6a758a' }}>
                                    Profile information is synced from your student form details.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/student/profile')}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#223f6a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#193154]"
                        >
                            {profile?.is_profile_locked ? (
                                <>
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    View Profile
                                </>
                            ) : (
                                <>
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                    </svg>
                                    Update Profile
                                </>
                            )}
                        </button>
                    </section>

                    <section className="rounded-3xl border p-6 shadow-sm" style={{ backgroundColor: isDark ? '#111c34' : '#ffffff', borderColor: isDark ? '#334155' : '#dbe4f1' }}>
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#a37200]">Mentor</p>
                        <h2 className="font-serif text-3xl font-semibold" style={{ color: isDark ? '#f1f5f9' : '#1e2d4e' }}>Mentor Information</h2>
                        <p className="mt-1 text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Your assigned faculty mentor details</p>

                        <div className="mt-6 rounded-2xl border p-4" style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#dbe4f1' }}>
                            {loadingMentor ? (
                                <div className="flex items-center justify-center py-10">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22456f] border-t-transparent" />
                                </div>
                            ) : !mentor ? (
                                <p className="py-6 text-center text-sm text-[#7a8599]">No mentor assigned yet</p>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f3b42f] text-lg font-bold text-[#2f2f2f]">
                                            {initials(mentor.full_name)}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-lg font-semibold" style={{ color: isDark ? '#f1f5f9' : '#1e2d4e' }}>{mentor.full_name}</p>
                                            <p className="truncate text-sm text-[#64748b]">{mentor.email}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="rounded-xl border p-3" style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderColor: isDark ? '#334155' : '#dbe4f1' }}>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#61748f]">Email</p>
                                            <p className="mt-1 break-all text-sm" style={{ color: isDark ? '#cbd5e1' : '#253248' }}>{mentor.email}</p>
                                        </div>
                                        <div className="rounded-xl border p-3" style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderColor: isDark ? '#334155' : '#dbe4f1' }}>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#61748f]">Phone</p>
                                            <p className="mt-1 text-sm" style={{ color: isDark ? '#cbd5e1' : '#253248' }}>{mentor.contact_number || 'N/A'}</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </section>

                    <section className="rounded-3xl border p-6 shadow-sm lg:col-span-2" style={{ backgroundColor: isDark ? '#111c34' : '#ffffff', borderColor: isDark ? '#334155' : '#dbe4f1' }}>
                        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#3f78dc]">Mentoring</p>
                        <h2 className="font-serif text-3xl font-semibold" style={{ color: isDark ? '#f1f5f9' : '#1e2d4e' }}>Mentoring Remarks</h2>
                        <p className="mt-1 text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>Feedback and suggestions from your mentors</p>

                        <div className="mt-6 rounded-2xl border p-4 sm:p-5" style={{ backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#dbe4f1' }}>
                            {loadingMinutes ? (
                                <div className="flex items-center justify-center py-14">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#22456f] border-t-transparent" />
                                </div>
                            ) : minutes.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="font-serif text-3xl text-[#30445f]">No Mentoring Sessions Yet</p>
                                    <p className="mx-auto mt-3 max-w-xl text-sm text-[#74839a]">
                                        Your remarks will appear here once you have sessions with your faculty mentor.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                  {minutes.map(m => {
                                      const highlights = extractHighlights([m.remarks, m.mentor_remarks].filter(Boolean).join(' '))
                                      return (
                                      <article key={m.id} className="rounded-2xl border p-4" style={{ backgroundColor: isDark ? '#17243b' : '#fafcff', borderColor: isDark ? '#3b4d68' : '#e2e8f2' }}>
                                          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                              <p className="font-semibold" style={{ color: isDark ? '#f1f5f9' : '#20324e' }}>{m.faculty_name}</p>
                                              <div className="flex items-center gap-2">
                                                  <span className="rounded-full px-2 py-1 text-xs font-semibold" style={{ backgroundColor: isDark ? '#263c67' : '#e9f0ff', color: isDark ? '#bfdbfe' : '#2c4f85' }}>
                                                      Sem {m.semester}
                                                  </span>
                                                  <span className="text-xs" style={{ color: isDark ? '#94a3b8' : '#6e7e95' }}>{formatDate(m.date)}</span>
                                              </div>
                                          </div>
                                          
                                          {highlights.length > 0 && (
                                              <div
                                                  className="mb-4 rounded-xl border p-3"
                                                  style={{
                                                      backgroundColor: isDark ? 'rgba(20, 83, 45, 0.2)' : '#ecfdf3',
                                                      borderColor: isDark ? 'rgba(20, 83, 45, 0.3)' : '#bbf7d0',
                                                  }}
                                              >
                                                  <div className="flex items-center gap-2 mb-2">
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: isDark ? '#4ade80' : '#16a34a' }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                                      <span className="text-sm font-bold" style={{ color: isDark ? '#86efac' : '#166534' }}>Highlights & Achievements</span>
                                                  </div>
                                                  <ul className="space-y-1.5">
                                                      {highlights.map((hl, i) => (
                                                          <li key={i} className="flex items-start gap-2 text-sm" style={{ color: isDark ? '#4ade80' : '#15803d' }}>
                                                              <span className="mt-0.5" style={{ color: isDark ? '#4ade80' : '#16a34a' }}>•</span>
                                                              <span>{hl}</span>
                                                          </li>
                                                      ))}
                                                  </ul>
                                              </div>
                                          )}

                                          <div className="space-y-2 text-sm" style={{ color: isDark ? '#cbd5e1' : '#3f4d63' }}>
                                                <p><span className="font-semibold">AI Remarks:</span> {m.remarks || 'None'}</p>
                                                <p><span className="font-semibold">Mentor Remarks:</span> {m.mentor_remarks || 'None'}</p>
                                                <p><span className="font-semibold">Suggestion:</span> {m.suggestion || 'None'}</p>
                                                <p><span className="font-semibold">Action:</span> {m.action || 'None'}</p>
                                          </div>
                                      </article>
                                  )})}
                              </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>

            {showPwModal && <ChangePasswordModal onClose={() => setShowPwModal(false)} />}

          {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
                    <div className="w-full max-w-xl rounded-[22px] border border-[#d5dcea] bg-[#f7f9fc] p-6 shadow-[0_28px_60px_-25px_rgba(17,28,48,0.55)] sm:p-7 dark:bg-gray-800">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#f4b4b0] bg-[#fff2f1] text-[#dc2626] dark:bg-gray-700">
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 9v4" />
                                <path d="M12 17h.01" />
                                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                            </svg>
                        </div>

                        <h3 className="font-serif text-4xl font-semibold text-[#1f304d] dark:text-gray-100">Log Out</h3>
                        <p className="mt-2 text-lg text-[#6f7f96] dark:text-gray-300">Are you sure you want to log out?</p>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="rounded-xl border border-[#cdd7e7] bg-[#f4f6fa] px-7 py-3 text-lg font-semibold text-[#697a93] transition hover:bg-[#edf1f7] dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                Stay Here
                            </button>
                            <button
                                onClick={logout}
                                className="rounded-xl bg-[#df302b] px-7 py-3 text-lg font-semibold text-white shadow-[0_14px_26px_-14px_rgba(198,40,35,0.9)] transition hover:bg-[#c12520]"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
