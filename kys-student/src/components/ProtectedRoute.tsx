import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ReactNode } from 'react'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { token, user } = useAuth()
    if (!token || user?.role !== 'student') return <Navigate to="/" replace />
    return <>{children}</>
}
