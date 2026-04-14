import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, GraduationCap, Lock, Moon, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(true)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            console.log('[LOGIN] attempt', { username })
            await login(username, password)
            console.log('[LOGIN] success', {
                access_token: localStorage.getItem('access_token'),
                user: localStorage.getItem('user'),
            })
            console.log('[LOGIN] token stored', localStorage.getItem('access_token'))
            navigate('/dashboard')
        } catch (err: unknown) {
            console.log('[LOGIN] error', err)
            const axiosMsg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
            const thrown = err instanceof Error ? err.message : ''
            setError(axiosMsg || thrown || 'Invalid credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#EEF2F7] px-3 py-8 sm:px-4">
            <div className="w-[92vw] max-w-[400px] overflow-hidden rounded-2xl shadow-xl sm:w-[460px] sm:max-w-none lg:w-[470px]">
                <div className="rounded-t-2xl border-t-4 border-[#F5A623] bg-gradient-to-br from-[#263C67] via-[#334A7A] to-[#3E588E] px-6 py-7 sm:px-7 sm:py-8">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-[#4A5E8E]/45 sm:h-11 sm:w-11">
                                <GraduationCap className="h-5 w-5 text-[#F5A623]" />
                            </div>
                            <div>
                                <p className="text-[clamp(1.2rem,2.3vw,1.65rem)] font-bold leading-tight text-white [font-family:Georgia,'Times_New_Roman',serif]">
                                    KYS Portal
                                </p>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9BA9C7] sm:text-[11px]">
                                    KNOW YOUR STUDENT
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            aria-label="Toggle dark mode"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/10 text-[#D7DDF0]"
                        >
                            <Moon className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="mt-7 sm:mt-8">
                        <p className="text-[clamp(0.72rem,1.2vw,0.85rem)] font-semibold uppercase tracking-[0.1em] text-[#9BA9C7]">SECURE SIGN IN</p>
                        <h1 className="mt-2 text-[clamp(2rem,4vw,2.75rem)] font-medium leading-[1.05] text-white [font-family:Georgia,'Times_New_Roman',serif]">
                            Welcome Back
                        </h1>
                        <p className="mt-1 text-[clamp(0.95rem,2vw,1.15rem)] text-[#C5D0E5]">Sign in to your account to continue</p>
                    </div>
                </div>

                <div className="rounded-b-2xl bg-[#F5F7FB] px-6 py-7 sm:px-7 sm:py-8">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.08em] text-[#1E2D4E]">
                                USERNAME <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7C8598]" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value) }}
                                    required
                                    placeholder="Enter your username"
                                    className="h-[52px] w-full rounded-[10px] border border-[#CAD2DF] bg-[#F8FAFD] pl-11 pr-4 text-[15px] text-[#1E2D4E] placeholder:text-[#99A3B5] focus:outline-none focus:ring-2 focus:ring-[#1E2D4E]"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="mb-2 block text-[13px] font-bold uppercase tracking-[0.08em] text-[#1E2D4E]">
                                PASSWORD <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7C8598]" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                    className="h-[52px] w-full rounded-[10px] border border-[#CAD2DF] bg-[#F8FAFD] pl-11 pr-12 text-[15px] text-[#1E2D4E] placeholder:text-[#99A3B5] focus:outline-none focus:ring-2 focus:ring-[#1E2D4E]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7C8598]"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-[#D7DCE6]" />

                        <label className="mt-5 flex items-center gap-3 text-[clamp(0.95rem,1.6vw,1.2rem)] text-[#5F6A7F]">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 rounded border-[#C8D0DC] accent-[#1E2D4E] focus:ring-[#1E2D4E]"
                            />
                            Remember me
                        </label>

                        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 h-[52px] w-full rounded-[10px] bg-[#1E2D4E] px-4 text-[15px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_8px_20px_rgba(30,45,78,0.35)] hover:bg-[#17253F] disabled:opacity-50"
                        >
                            {loading ? 'SIGNING IN...' : 'SIGN IN'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
