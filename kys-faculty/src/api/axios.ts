import axios from 'axios'
import { clearAuthStorage } from '../lib/authStorage'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
})

// Clear tokens from a previous origin when the host changes
const storedOrigin = localStorage.getItem('app_origin')
if (storedOrigin && storedOrigin !== window.location.origin) {
    clearAuthStorage()
}
localStorage.setItem('app_origin', window.location.origin)

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            // Auth state is managed by React; only propagate the error.
        }
        return Promise.reject(err)
    },
)

export default api
