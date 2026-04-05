import api from './axios'

export const getProfile = () => api.get('/student/me')
export const updateProfile = (data: unknown) => api.put('/student/me', data)
export const getMentor = () => api.get('/students/me/mentor')
export const getMentoringMinutes = () => api.get('/students/me/mentoring-minutes')
