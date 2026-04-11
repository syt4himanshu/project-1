import api from './axios'

export const getProfile = () => api.get('/student/me')
export const updateProfile = (data: unknown) => api.put('/student/me', data)
export const getMentor = () => api.get('/students/me/mentor')
export const getMentoringMinutes = () => api.get('/students/me/mentoring-minutes')

export const uploadProfilePhoto = (file: File) => {
    const formData = new FormData()
    formData.append('photo', file)
    return api.post('/student/me/upload-photo', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}
