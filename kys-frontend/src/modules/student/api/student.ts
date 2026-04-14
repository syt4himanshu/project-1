import { requestJson } from '../../../shared/api/httpClient'
import { ENDPOINTS } from '../../../shared/api/endpointRegistry'
import { readStoredSession } from '../../../shared/auth/storage'

function getToken() {
  return readStoredSession()?.accessToken ?? null
}

function toApiError(error: unknown, fallback: string): Error {
  if (error instanceof Error) {
    return error
  }
  return new Error(fallback)
}

export async function getProfile() {
  try {
    const data = await requestJson<Record<string, unknown>>(ENDPOINTS.student.me, {
      method: 'GET',
      token: getToken(),
    })
    return { data }
  } catch (error) {
    throw toApiError(error, 'Failed to load profile')
  }
}

export async function updateProfile(payload: unknown) {
  try {
    const data = await requestJson<Record<string, unknown>>(ENDPOINTS.student.me, {
      method: 'PUT',
      token: getToken(),
      body: payload,
    })
    return { data }
  } catch (error) {
    throw toApiError(error, 'Failed to save profile')
  }
}

export async function getMentor() {
  const data = await requestJson<Record<string, unknown>>(ENDPOINTS.students.mentor, {
    method: 'GET',
    token: getToken(),
  })
  return { data }
}

export async function getMentoringMinutes() {
  const data = await requestJson<Array<Record<string, unknown>>>(ENDPOINTS.students.mentoringMinutes, {
    method: 'GET',
    token: getToken(),
  })
  return { data }
}

export async function uploadProfilePhoto(file: File) {
  const formData = new FormData()
  formData.append('photo', file)

  const data = await requestJson<Record<string, unknown>>(ENDPOINTS.student.uploadPhoto, {
    method: 'POST',
    token: getToken(),
    body: formData,
  })

  return { data }
}
