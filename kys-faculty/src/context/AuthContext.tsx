import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { login as apiLogin, logout as apiLogout, verify as apiVerify } from '../api/auth'

interface AuthUser { id: number; username: string; role: string }
interface AuthCtx {
    user: AuthUser | null
    token: string | null
    login: (username: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'))

    useEffect(() => {
        const stored = localStorage.getItem('user')
        if (stored) setUser(JSON.parse(stored))
    }, [])

    useEffect(() => {
        if (!token) return
        apiVerify()
            .then((res) => {
                const u = res.data?.user
                if (!u || u.role !== 'faculty') {
                    localStorage.clear()
                    setToken(null)
                    setUser(null)
                    return
                }
                localStorage.setItem('user', JSON.stringify(u))
                setUser(u)
            })
            .catch(() => { })
    }, [token])

    const login = async (username: string, password: string) => {
        const res = await apiLogin(username, password)
        const { access_token, user: u } = res.data
        if (u.role !== 'faculty') throw new Error('Access denied: faculty only')
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('user', JSON.stringify(u))
        setToken(access_token)
        setUser(u)
    }

    const logout = () => {
        apiLogout().catch(() => { })
        localStorage.clear()
        setToken(null)
        setUser(null)
    }

    return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
