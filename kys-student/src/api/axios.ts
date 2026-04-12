import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5002',
    timeout: 60_000,
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
            localStorage.clear()
            window.location.href = '/'
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
