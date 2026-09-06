import { HttpError } from './httpClient'

/**
 * Distinguishes network/connectivity failures (offline status, fetch failure, 5xx server errors, timeout)
 * from explicit client/auth errors (401, 403, 404, 422, 429).
 */
export function isNetworkOrOfflineError(error: unknown): boolean {
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return true
  }

  if (error instanceof HttpError) {
    return error.status === 0 || error.status === 408 || error.status >= 500
  }

  if (error instanceof TypeError) {
    const msg = error.message.toLowerCase()
    return (
      msg.includes('fetch') ||
      msg.includes('network') ||
      msg.includes('failed to fetch') ||
      msg.includes('load failed')
    )
  }

  if (error instanceof DOMException && error.name === 'TimeoutError') {
    return true
  }

  return false
}
