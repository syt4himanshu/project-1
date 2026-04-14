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

export async function changePassword(old_password: string, new_password: string) {
  try {
    const data = await requestJson<unknown>(ENDPOINTS.auth.changePassword, {
      method: 'POST',
      token: getToken(),
      body: { old_password, new_password },
    })
    return { data }
  } catch (error) {
    throw toApiError(error, 'Failed to change password')
  }
}

export async function logout() {
  const token = getToken()
  const data = await requestJson<unknown>(ENDPOINTS.auth.logout, {
    method: 'POST',
    token,
  })
  return { data }
}
