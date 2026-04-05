import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { authApi } from '@/lib/api'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<'loading' | 'ok' | 'fail'>('loading')

    useEffect(() => {
        const token = localStorage.getItem('access_token')
        const role = localStorage.getItem('role')
        if (!token || role !== 'admin') { setStatus('fail'); return }
        authApi.verify()
            .then((r) => setStatus(r.valid && r.role === 'admin' ? 'ok' : 'fail'))
            .catch(() => setStatus('fail'))
    }, [])

    if (status === 'loading') return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
    if (status === 'fail') return <Navigate to="/login" replace />
    return <>{children}</>
}
