import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProfileWizard from './pages/ProfileWizard'
import RoleSelection from './pages/RoleSelection'

export default function App() {
    console.log('[ROUTE] current path', window.location.pathname)
    return (
        <AuthProvider>
            <BrowserRouter basename="/student" future={{ v7_relativeSplatPath: true }}>
                <Routes>
                    <Route path="/" element={<RoleSelection />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><ProfileWizard /></ProtectedRoute>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}
