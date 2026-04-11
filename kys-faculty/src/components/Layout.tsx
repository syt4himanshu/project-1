import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { to: '/mentees', label: 'My Mentees', icon: '👥' },
    { to: '/chatbot', label: 'Chatbot', icon: '🤖' },
    { to: '/profile', label: 'My Profile', icon: '👤' },
]

export default function Layout() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => { logout(); navigate('/') }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-56 bg-white dark:bg-gray-800 shadow-sm flex flex-col">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
                    <p className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">KYS Faculty</p>
                    <p className="text-xs text-gray-400 truncate">{user?.username}</p>
                </div>
                <nav className="flex-1 py-4 space-y-1 px-3">
                    {navItems.map(({ to, label, icon }) => (
                        <NavLink key={to} to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`
                            }>
                            <span>{icon}</span>{label}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                    <button onClick={handleLogout}
                        className="w-full py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 overflow-auto p-6"><Outlet /></main>
        </div>
    )
}
