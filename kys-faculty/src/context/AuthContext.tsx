import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react'
import { login as apiLogin, logout as apiLogout, verify as apiVerify } from '../api/auth'
import { clearAuthStorage } from '../lib/authStorage'

interface AuthUser { id: number; username: string; role: string }
interface AuthCtx {
    user: AuthUser | null
    token: string | null
    login: (username: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

function isSameUser(a: AuthUser | null, b: AuthUser | null) {
    if (a === b) return true
    if (!a || !b) return false
    return a.id === b.id && a.username === b.username && a.role === b.role
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => {
        try {
            return localStorage.getItem('access_token')
        } catch {
            return null
        }
    })
    const [user, setUser] = useState<AuthUser | null>(() => {
        try {
            const t = localStorage.getItem('access_token')
            if (!t) return null
            const stored = localStorage.getItem('user')
            return stored ? (JSON.parse(stored) as AuthUser) : null
        } catch {
            return null
        }
    })
    const isVerifyingRef = useRef(false)

    useEffect(() => {
        console.info('[auth][faculty] token changed', { hasToken: Boolean(token) })
    }, [token])

    useEffect(() => {
        if (!token) return
        if (isVerifyingRef.current) return
        isVerifyingRef.current = true

        console.info('[auth][faculty] verify called')
        void apiVerify()
            .then((res) => {
                const u = res.data?.user
                if (!u || u.role !== 'faculty') {
                    console.warn('[auth][faculty] verify failed: invalid role/user', { role: u?.role })
                    clearAuthStorage()
                    setToken(null)
                    setUser(null)
                    return
                }
                localStorage.setItem('user', JSON.stringify(u))
                localStorage.setItem('role', u.role)
                console.info('[auth][faculty] verify success', { id: u.id, username: u.username, role: u.role })
                setUser((prev) => (isSameUser(prev, u) ? prev : u))
            })
            .catch((err: unknown) => {
                const status = (err as { response?: { status?: number } })?.response?.status
                console.error('[auth][faculty] verify failed', { status, err })
                clearAuthStorage()
                setToken(null)
                setUser(null)
            })
            .finally(() => {
                isVerifyingRef.current = false
            })
    }, [token])

    const login = useCallback(async (username: string, password: string) => {
        const res = await apiLogin(username, password)
        const { access_token, user: u } = res.data
        if (u.role !== 'faculty') throw new Error('Access denied: faculty only')
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('user', JSON.stringify(u))
        localStorage.setItem('role', u.role)
        setToken(access_token)
        setUser(u)
    }, [])

    const logout = useCallback(() => {
        void apiLogout().catch((err) => console.error('[auth][faculty] logout api failed', err))
        clearAuthStorage()
        setToken(null)
        setUser(null)
    }, [])

    const value = useMemo(() => ({ user, token, login, logout }), [user, token, login, logout])
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
