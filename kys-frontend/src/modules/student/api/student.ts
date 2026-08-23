import { requestJson } from '../../../shared/api/httpClient'
import { ENDPOINTS } from '../../../shared/api/endpointRegistry'
import { readStoredSession } from '../../../shared/auth/storage'

export interface StudentApiRequestOptions {
  token?: string | null
}

function resolveToken(options?: StudentApiRequestOptions): string | null {
  if (options?.token !== undefined) {
    return options.token
  }
  return readStoredSession()?.accessToken ?? null
}

function toApiError(error: unknown, fallback: string): Error {
  if (error instanceof Error) {
    return error
  }
  return new Error(fallback)
}

export async function getProfile(options: StudentApiRequestOptions = {}) {
  try {
    const data = await requestJson<Record<string, unknown>>(ENDPOINTS.student.me, {
      method: 'GET',
      token: resolveToken(options),
    })
    return { data }
  } catch (error) {
    throw toApiError(error, 'Failed to load profile')
  }
}

export async function updateProfile(payload: unknown, options: StudentApiRequestOptions = {}) {
  try {
    const data = await requestJson<Record<string, unknown>>(ENDPOINTS.student.me, {
      method: 'PUT',
      token: resolveToken(options),
      body: payload,
    })
    return { data }
  } catch (error) {
    throw toApiError(error, 'Failed to save profile')
  }
}

export async function getMentor(options: StudentApiRequestOptions = {}) {
  const data = await requestJson<Record<string, unknown>>(ENDPOINTS.students.mentor, {
    method: 'GET',
    token: resolveToken(options),
  })
  return { data }
}

export async function getMentoringMinutes(options: StudentApiRequestOptions = {}) {
  const data = await requestJson<Array<Record<string, unknown>>>(ENDPOINTS.students.mentoringMinutes, {
    method: 'GET',
    token: resolveToken(options),
  })
  return { data }
}

export async function uploadProfilePhoto(file: File, options: StudentApiRequestOptions = {}) {
  const formData = new FormData()
  formData.append('photo', file)

  const data = await requestJson<Record<string, unknown>>(ENDPOINTS.student.uploadPhoto, {
    method: 'POST',
    token: resolveToken(options),
    body: formData,
  })

  return { data }
}
