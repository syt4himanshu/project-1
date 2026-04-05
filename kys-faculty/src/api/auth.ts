import api from './axios'

export const login = (username: string, password: string) =>
    api.post('/api/auth/login', { username, password })

export const verify = () => api.get('/api/auth/verify')

export const logout = () => api.post('/api/auth/logout')
export const changePassword = (old_password: string, new_password: string) =>
    api.post('/api/auth/change-password', { old_password, new_password })
