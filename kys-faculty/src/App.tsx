import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Mentees from './pages/Mentees'
import MenteeDetail from './pages/MenteeDetail'
import Profile from './pages/Profile'
import Chatbot from './pages/Chatbot'
import RoleSelection from './pages/RoleSelection'

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter basename="/faculty" future={{ v7_relativeSplatPath: true }}>
                <Routes>
                    <Route path="/" element={<RoleSelection />} />
                    <Route path="/login" element={<Login />} />
                    <Route element={<ProtectedRoute />}>
                        <Route element={<Layout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/mentees" element={<Mentees />} />
                            <Route path="/mentees/:uid" element={<MenteeDetail />} />
                            <Route path="/chatbot" element={<Chatbot />} />
                            <Route path="/profile" element={<Profile />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}
