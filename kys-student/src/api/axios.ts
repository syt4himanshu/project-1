import axios from 'axios'
import { clearAuthStorage } from '../lib/authStorage'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    timeout: 60_000,
})

// Clear tokens from a previous origin (e.g. :5173 vs :3005) when the host changes
const storedOrigin = localStorage.getItem('app_origin')
if (storedOrigin && storedOrigin !== window.location.origin) {
    clearAuthStorage()
}
localStorage.setItem('app_origin', window.location.origin)

api.interceptors.request.use((config) => {
    console.log('[API REQUEST]', config.url, {
        token: localStorage.getItem('access_token'),
    })
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (res) => {
        console.log('[API RESPONSE]', res.config.url, res.status)
        return res
    },
    (err) => {
        console.log('[API ERROR]', err.config?.url, err.response?.status)
        if (err.response?.status === 401) {
            return Promise.reject(err)
        }
        if (err.code === 'ECONNABORTED') {
            return Promise.reject(Object.assign(err, { message: 'Request timed out. Please try again.' }))
        }
        if (!err.response) {
            return Promise.reject(
                Object.assign(err, { message: 'Network error. Check your connection and try again.' }),
            )
        }
        return Promise.reject(err)
    },
)

export default api
