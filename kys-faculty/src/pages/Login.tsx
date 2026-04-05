import { useState, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const { login, token, user } = useAuth()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (token && user?.role === 'faculty') navigate('/dashboard', { replace: true })
    }, [token, user, navigate])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login(username, password)
            navigate('/dashboard')
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error
                || (err as { message?: string })?.message
            setError(msg || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">Faculty Portal</h1>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-6 text-sm">Know Your Student — KYS</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email / Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="faculty@stvincentngp.edu.in" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button type="submit" disabled={loading}
                        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg transition">
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}
