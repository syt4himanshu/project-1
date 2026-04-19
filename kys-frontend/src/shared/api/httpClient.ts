import { env } from '../../app/config/env'
import { readApiEnvelope } from './apiEnvelope'
import { extractErrorMessage } from './errorMapper'

export class HttpError extends Error {
  readonly status: number
  readonly payload: unknown

  constructor(message: string, status: number, payload: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.payload = payload
  }
}

export const AUTH_EXPIRED_EVENT = 'kys:auth-expired'

interface JsonRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  token?: string | null
  retry?: {
    maxAttempts?: number
    initialDelay?: number
    maxDelay?: number
  }
}

interface BlobRequestOptions extends Omit<RequestInit, 'body'> {
  token?: string | null
}

/**
 * Sleep for specified milliseconds
 */
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Check if error is retryable
 */
const isRetryableError = (error: unknown): boolean => {
  if (error instanceof HttpError) {
    // Retry on rate limit and server errors
    return error.status === 429 || error.status >= 500
  }

  // Retry on network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true
  }

  return false
}

function buildUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${env.apiBaseUrl}${path}`
}

async function parsePayload(response: Response): Promise<unknown> {
  const rawText = await response.text()
  if (!rawText) return null

  try {
    return JSON.parse(rawText) as unknown
  } catch {
    return rawText
  }
}

function isSupportedBodyInit(value: unknown): value is BodyInit {
  return (
    value instanceof FormData
    || typeof value === 'string'
    || value instanceof URLSearchParams
    || value instanceof Blob
    || value instanceof ArrayBuffer
    || ArrayBuffer.isView(value)
  )
}

export async function requestJson<T>(path: string, options: JsonRequestOptions = {}): Promise<T> {
  const {
    body,
    token,
    headers: customHeaders,
    retry = { maxAttempts: 2, initialDelay: 1000, maxDelay: 5000 },
    ...requestInit
  } = options

  const { maxAttempts = 2, initialDelay = 1000, maxDelay = 5000 } = retry

  let lastError: unknown
  let delay = initialDelay

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const headers = new Headers(customHeaders ?? undefined)

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      let requestBody: BodyInit | null | undefined = undefined

      if (body === null) {
        requestBody = null
      } else if (body !== undefined) {
        if (isSupportedBodyInit(body)) {
          requestBody = body
        } else {
          headers.set('Content-Type', 'application/json')
          requestBody = JSON.stringify(body)
        }
      }

      const response = await fetch(buildUrl(path), {
        ...requestInit,
        headers,
        body: requestBody,
      })

      const payload = await parsePayload(response)

      if (!response.ok) {
        if (response.status === 401 && typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT))
        }

        const message = extractErrorMessage(payload) || `Request failed with status ${response.status}`
        const error = new HttpError(message, response.status, payload)

        // Don't retry auth errors or client errors (except 429)
        if (response.status === 401 || response.status === 403 || (response.status >= 400 && response.status < 500 && response.status !== 429)) {
          throw error
        }

        throw error
      }

      const parsed = readApiEnvelope<T>(payload)
      if (!parsed.ok) {
        throw new HttpError(parsed.error, response.status, payload)
      }

      // Log successful retry
      if (attempt > 1) {
        console.info(`Request succeeded after ${attempt} attempts: ${path}`)
      }

      return parsed.data

    } catch (error) {
      lastError = error

      const isLastAttempt = attempt === maxAttempts
      const canRetry = isRetryableError(error)

      if (isLastAttempt || !canRetry) {
        throw error
      }

      console.warn(`Request failed (attempt ${attempt}/${maxAttempts}), retrying in ${delay}ms: ${path}`)

      // Wait before retry
      await sleep(delay)

      // Exponential backoff
      delay = Math.min(delay * 2, maxDelay)
    }
  }

  throw lastError
}

export async function requestBlob(
  path: string,
  options: BlobRequestOptions = {},
): Promise<{ blob: Blob; headers: Headers; status: number }> {
  const { token, headers: customHeaders, ...requestInit } = options
  const headers = new Headers(customHeaders ?? undefined)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(buildUrl(path), {
    ...requestInit,
    headers,
  })

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT))
    }

    const errorText = await response.text().catch(() => '')
    const message = errorText || `Request failed with status ${response.status}`
    throw new HttpError(message, response.status, errorText)
  }

  const blob = await response.blob()

  return {
    blob,
    headers: response.headers,
    status: response.status,
  }
}
