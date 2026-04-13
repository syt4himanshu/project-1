import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import './index.css'
import LoginPage from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/shared/ProtectedRoute'
import RoleSelection from './pages/RoleSelection'

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter basename="/admin" future={{ v7_relativeSplatPath: true }}>
                <Routes>
                    <Route path="/" element={<RoleSelection />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
            <Toaster position="bottom-right" richColors />
        </QueryClientProvider>
    </React.StrictMode>
)
