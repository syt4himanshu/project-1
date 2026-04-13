import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL
if (!baseURL) throw new Error('VITE_API_URL is required (e.g. http://localhost:3005)')

const api = axios.create({
    baseURL,
    timeout: 60_000,
})

// Clear tokens from a previous origin (e.g. :5173) when running under :3005
const storedOrigin = localStorage.getItem('app_origin')
if (storedOrigin && storedOrigin !== window.location.origin) {
    localStorage.clear()
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
            localStorage.clear()
            const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || ''
            window.location.href = `${base}/login`
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
