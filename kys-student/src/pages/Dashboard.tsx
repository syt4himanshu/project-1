import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMentor, getMentoringMinutes } from '../api/student'
import ChangePasswordModal from '../components/ChangePasswordModal'

interface MentoringMinute {
    id: number; faculty_name: string; faculty_email: string
    semester: number; date: string; remarks: string; suggestion: string; action: string
}
interface Mentor {
    id: number; email: string; full_name: string; contact_number: string
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function initials(name: string) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function Dashboard() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [minutes, setMinutes] = useState<MentoringMinute[]>([])
    const [mentor, setMentor] = useState<Mentor | null>(null)
    const [loadingMinutes, setLoadingMinutes] = useState(true)
    const [loadingMentor, setLoadingMentor] = useState(true)
    const [showPwModal, setShowPwModal] = useState(false)

    useEffect(() => {
        getMentoringMinutes()
            .then(r => setMinutes(r.data))
            .catch(() => { })
            .finally(() => setLoadingMinutes(false))

        getMentor()
            .then(r => setMentor(r.data))
            .catch(() => { })
            .finally(() => setLoadingMentor(false))
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">Student Dashboard</span>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Hello, {user?.username}</span>
                    <button onClick={() => setShowPwModal(true)} className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                        Change Password
                    </button>
                    <button onClick={logout} className="text-sm px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Section 1 — Profile Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Student Information Form</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Keep your profile up to date with the 9-step wizard</p>
                    <button
                        onClick={() => navigate('/profile')}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                    >
                        Update Profile
                    </button>
                </div>

                {/* Section 2 — Mentoring Remarks */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 flex flex-col gap-4 lg:col-span-1">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Mentoring Remarks</h2>
                    {loadingMinutes ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : minutes.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No Mentoring Sessions Yet</p>
                    ) : (
                        <div className="space-y-3 overflow-y-auto max-h-80">
                            {minutes.map(m => (
                                <div key={m.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 relative">
                                    <span className="absolute top-3 right-3 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                                        Sem {m.semester}
                                    </span>
                                    <p className="font-medium text-sm text-gray-800 dark:text-white">{m.faculty_name}</p>
                                    <p className="text-xs text-gray-400 mb-2">{formatDate(m.date)}</p>
                                    {m.remarks && <p className="text-xs text-gray-600 dark:text-gray-300"><span className="font-semibold">Remarks:</span> {m.remarks}</p>}
                                    {m.suggestion && <p className="text-xs text-gray-600 dark:text-gray-300"><span className="font-semibold">Suggestion:</span> {m.suggestion}</p>}
                                    {m.action && <p className="text-xs text-gray-600 dark:text-gray-300"><span className="font-semibold">Action:</span> {m.action}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Section 3 — Mentor Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">My Mentor</h2>
                    {loadingMentor ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : !mentor ? (
                        <p className="text-gray-400 text-sm text-center py-8">No mentor assigned yet</p>
                    ) : (
                        <>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-700 dark:text-green-300 font-bold text-lg">
                                    {initials(mentor.full_name)}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white">{mentor.full_name}</p>
                                    <p className="text-xs text-gray-400">{mentor.email}</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Email:</span> {mentor.email}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <span className="font-medium">Phone:</span> {mentor.contact_number || 'N/A'}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {showPwModal && <ChangePasswordModal onClose={() => setShowPwModal(false)} />}
        </div>
    )
}
