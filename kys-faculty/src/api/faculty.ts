import api from './axios'

export const getProfile = () => api.get('/api/faculty/me')
export const updateProfile = (data: unknown) => api.put('/api/faculty/me', data)
export const getMentees = () => api.get('/api/faculty/me/mentees')
export const getMentee = (uid: string) => api.get(`/api/faculty/me/mentees/${uid}`)
export const getMenteeMinutes = (uid: string) => api.get(`/api/faculty/me/mentees/${uid}/minutes`)
export const addMentoringMinute = (uid: string, data: { remarks: string; suggestion?: string; action?: string }) =>
    api.post(`/api/faculty/me/mentees/${uid}/minutes`, data)

export const askFacultyChatbot = (
    data: { query: string; studentId?: string },
    signal?: AbortSignal,
) => api.post('/api/faculty/chatbot', data, { signal })
