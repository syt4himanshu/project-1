import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
    const { token, user } = useAuth()
    if (!token || user?.role !== 'faculty') return <Navigate to="/" replace />
    return <Outlet />
}
