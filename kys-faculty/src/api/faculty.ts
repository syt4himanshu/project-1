import api from './axios'

export const getProfile = () => api.get('/faculty/me')
export const updateProfile = (data: unknown) => api.put('/faculty/me', data)
export const getMentees = () => api.get('/faculty/me/mentees')
export const getMentee = (uid: string) => api.get(`/faculty/me/mentees/${uid}`)
export const getMenteeMinutes = (uid: string) => api.get(`/faculty/me/mentees/${uid}/minutes`)
export const addMentoringMinute = (uid: string, data: { remarks: string; suggestion?: string; action?: string }) =>
    api.post(`/faculty/me/mentees/${uid}/minutes`, data)
