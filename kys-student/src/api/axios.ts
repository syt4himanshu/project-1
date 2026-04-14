import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5002',
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            const config = err.config
            const isLogin = config?.url?.includes('/login')
            if (!isLogin && config) {
                localStorage.clear()
                window.location.href = '/'
            }
        }
        return Promise.reject(err)
    }
)

export default api
