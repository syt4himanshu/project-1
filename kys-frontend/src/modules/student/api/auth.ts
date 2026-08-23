import { requestJson } from '../../../shared/api/httpClient'
import { ENDPOINTS } from '../../../shared/api/endpointRegistry'
import { readStoredSession } from '../../../shared/auth/storage'

export interface StudentAuthRequestOptions {
  token?: string | null
}

function resolveToken(options?: StudentAuthRequestOptions): string | null {
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

export async function changePassword(
  old_password: string,
  new_password: string,
  options: StudentAuthRequestOptions = {},
) {
  try {
    const data = await requestJson<unknown>(ENDPOINTS.auth.changePassword, {
      method: 'POST',
      token: resolveToken(options),
      body: { old_password, new_password },
    })
    return { data }
  } catch (error) {
    throw toApiError(error, 'Failed to change password')
  }
}

export async function logout(options: StudentAuthRequestOptions = {}) {
  const token = resolveToken(options)
  const data = await requestJson<unknown>(ENDPOINTS.auth.logout, {
    method: 'POST',
    token,
  })
  return { data }
}
