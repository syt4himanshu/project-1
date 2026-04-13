import api from './axios'
import { extractAxiosEnvelopeError, readApiEnvelope } from './apiEnvelope'

export type StudentProfilePayload = Record<string, unknown>

export async function getProfile(): Promise<StudentProfilePayload> {
    try {
        const res = await api.get<unknown>('/api/student/me')
        const parsed = readApiEnvelope<StudentProfilePayload>(res.data)
        if (!parsed.ok) throw new Error(parsed.error)
        return parsed.data
    } catch (e: unknown) {
        const fromBody = extractAxiosEnvelopeError(e)
        if (fromBody) throw new Error(fromBody)
        throw e instanceof Error ? e : new Error('Failed to load profile')
    }
}

export async function updateProfile(data: unknown): Promise<{ message?: string }> {
    try {
        const res = await api.put<unknown>('/api/student/me', data)
        const parsed = readApiEnvelope<{ message?: string }>(res.data)
        if (!parsed.ok) throw new Error(parsed.error)
        return parsed.data
    } catch (e: unknown) {
        const fromBody = extractAxiosEnvelopeError(e)
        if (fromBody) throw new Error(fromBody)
        throw e instanceof Error ? e : new Error('Failed to save profile')
    }
}

export const getMentor = () => api.get('/api/students/me/mentor')
export const getMentoringMinutes = () => api.get('/api/students/me/mentoring-minutes')

export type UploadPhotoResult = {
    message?: string
    photo_url?: string
    photo_public_id?: string
}

export async function uploadProfilePhoto(file: File): Promise<UploadPhotoResult> {
    try {
        const formData = new FormData()
        formData.append('photo', file)
        const res = await api.post<unknown>('/api/student/me/upload-photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        const parsed = readApiEnvelope<UploadPhotoResult>(res.data)
        if (!parsed.ok) throw new Error(parsed.error)
        return parsed.data
    } catch (e: unknown) {
        const fromBody = extractAxiosEnvelopeError(e)
        if (fromBody) throw new Error(fromBody)
        throw e instanceof Error ? e : new Error('Upload failed')
    }
}
