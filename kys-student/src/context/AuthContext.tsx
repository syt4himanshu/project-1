import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    ReactNode,
} from 'react'
import { login as apiLogin, logout as apiLogout, verify as apiVerify } from '../api/auth'
import { clearAuthStorage } from '../lib/authStorage'

interface AuthUser {
    id: number
    username: string
    role: string
}
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

function readStoredToken(): string | null {
    try {
        return localStorage.getItem('access_token')
    } catch {
        return null
    }
}

function readStoredUser(): AuthUser | null {
    try {
        const raw = localStorage.getItem('user')
        if (!raw) return null
        return JSON.parse(raw) as AuthUser
    } catch {
        return null
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    console.log('[AUTH] render', { token: readStoredToken(), user: readStoredUser() })
    console.log('[STORAGE] access_token', localStorage.getItem('access_token'))
    console.log('[STORAGE] user', localStorage.getItem('user'))

    const [token, setToken] = useState<string | null>(readStoredToken)
    const [user, setUser] = useState<AuthUser | null>(() => {
        const t = readStoredToken()
        if (!t) return null
        return readStoredUser()
    })
    const isVerifyingRef = useRef(false)

    useEffect(() => {
        console.info('[auth][student] token changed', { hasToken: Boolean(token) })
    }, [token])

    useEffect(() => {
        if (!token) return

        console.log('[AUTH] verify effect triggered', { token })
        let cancelled = false
        if (isVerifyingRef.current) return
        isVerifyingRef.current = true

        console.log('[AUTH] calling verify API')
        void apiVerify()
            .then((res) => {
                if (cancelled) return
                const u = res.data?.user
                if (!u || u.role !== 'student') {
                    console.log('[AUTH] verify failed', res)
                    console.log('[AUTH] clearing auth state')
                    console.warn('[auth][student] verify failed: invalid role/user', { role: u?.role })
                    clearAuthStorage()
                    setToken(null)
                    setUser(null)
                    return
                }
                localStorage.setItem('user', JSON.stringify(u))
                localStorage.setItem('role', u.role)
                console.log('[AUTH] verify success', res.data)
                console.info('[auth][student] verify success', { id: u.id, username: u.username, role: u.role })
                setUser((prev) => (isSameUser(prev, u) ? prev : u))
            })
            .catch((err: unknown) => {
                if (cancelled) return
                console.log('[AUTH] verify failed', err)
                console.log('[AUTH] clearing auth state')
                const status = (err as { response?: { status?: number } })?.response?.status
                console.error('[auth][student] verify failed', { status, err })
                clearAuthStorage()
                setToken(null)
                setUser(null)
            })
            .finally(() => {
                isVerifyingRef.current = false
            })

        return () => {
            cancelled = true
        }
    }, [token])

    const login = useCallback(async (username: string, password: string) => {
        const res = await apiLogin(username, password)
        const { access_token, user: u } = res.data
        if (u.role !== 'student') throw new Error('Access denied: student only')
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('user', JSON.stringify(u))
        localStorage.setItem('role', u.role)
        console.log('[AUTH] setToken', access_token)
        setToken(access_token)
        setUser(u)
    }, [])

    const logout = useCallback(() => {
        void apiLogout().catch((err) => console.error('[auth][student] logout api failed', err))
        console.log('[AUTH] clearing auth state')
        clearAuthStorage()
        setToken(null)
        setUser(null)
    }, [])

    const value = useMemo(
        () => ({ user, token, login, logout }),
        [user, token, login, logout],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
