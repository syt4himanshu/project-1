import { env } from '../../app/config/env'
import { readApiEnvelope } from './apiEnvelope'
import { extractErrorMessage } from './errorMapper'

export class HttpError extends Error {
  readonly status: number
  readonly payload: unknown
  readonly retryAfter: number | null

  constructor(message: string, status: number, payload: unknown, retryAfter: number | null = null) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.payload = payload
    this.retryAfter = retryAfter
  }
}

export const AUTH_EXPIRED_EVENT = 'kys:auth-expired'

interface JsonRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  token?: string | null
  /** Abort the fetch if it exceeds this duration (per attempt). */
  timeoutMs?: number
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
 * Parse Retry-After header into seconds
 */
export function parseRetryAfterHeader(headerValue: string | null): number | null {
  if (!headerValue) return null

  const seconds = parseFloat(headerValue)
  if (!Number.isNaN(seconds) && seconds >= 0) {
    return Math.round(seconds)
  }

  const dateMs = Date.parse(headerValue)
  if (!Number.isNaN(dateMs)) {
    const diffSec = Math.ceil((dateMs - Date.now()) / 1000)
    return Math.max(0, diffSec)
  }

  return null
}

/**
 * Check if error is retryable.
 * - 429 is only retryable if server specifies a Retry-After within maxDelayMs.
 * - 5xx server errors and network fetch failures are retryable.
 * - 4xx client errors (400, 401, 403, 404, etc.) are NOT retryable.
 */
const isRetryableError = (error: unknown, maxDelayMs = 5000): boolean => {
  if (error instanceof HttpError) {
    if (error.status === 429) {
      if (error.retryAfter !== null && error.retryAfter >= 0) {
        return (error.retryAfter * 1000) <= maxDelayMs
      }
      return false
    }

    return error.status >= 500
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

function mergeAbortSignals(signals: AbortSignal[]): AbortSignal {
  const active = signals.filter(Boolean)
  if (active.length === 0) {
    throw new Error('mergeAbortSignals requires at least one signal')
  }

  if (typeof AbortSignal.any === 'function') {
    return AbortSignal.any(active)
  }

  const controller = new AbortController()
  for (const signal of active) {
    if (signal.aborted) {
      controller.abort(signal.reason)
      return controller.signal
    }
    signal.addEventListener('abort', () => controller.abort(signal.reason), { once: true })
  }

  return controller.signal
}

function createTimeoutSignal(timeoutMs: number): { signal: AbortSignal; clear: () => void } {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort(new DOMException('Request timed out', 'TimeoutError'))
  }, timeoutMs)

  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  }
}

function toRequestTimeoutError(error: unknown): HttpError | null {
  if (!(error instanceof DOMException) || error.name !== 'TimeoutError') {
    return null
  }

  return new HttpError(
    'Request timed out. Try again, or narrow to one student.',
    408,
    null,
  )
}

export async function requestJson<T>(path: string, options: JsonRequestOptions = {}): Promise<T> {
  const {
    body,
    token,
    headers: customHeaders,
    retry = { maxAttempts: 2, initialDelay: 1000, maxDelay: 5000 },
    timeoutMs,
    signal: userSignal,
    ...requestInit
  } = options

  const { maxAttempts = 2, initialDelay = 1000, maxDelay = 5000 } = retry

  let lastError: unknown
  let delay = initialDelay

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let clearAttemptTimeout: (() => void) | undefined

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

      let fetchSignal = userSignal
      if (timeoutMs) {
        const { signal: timeoutSignal, clear } = createTimeoutSignal(timeoutMs)
        clearAttemptTimeout = clear
        fetchSignal = userSignal
          ? mergeAbortSignals([userSignal, timeoutSignal])
          : timeoutSignal
      }

      const response = await fetch(buildUrl(path), {
        ...requestInit,
        headers,
        body: requestBody,
        signal: fetchSignal,
      })

      const payload = await parsePayload(response)

      if (!response.ok) {
        if (response.status === 401 && typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT))
        }

        const retryAfterSec = parseRetryAfterHeader(response.headers.get('Retry-After'))
        let message = extractErrorMessage(payload)

        if (!message) {
          if (response.status === 429) {
            message = retryAfterSec
              ? `Too many requests. Please wait ${retryAfterSec}s and try again.`
              : 'Too many requests. Please wait a moment and try again.'
          } else {
            message = `Request failed with status ${response.status}`
          }
        }

        const error = new HttpError(message, response.status, payload, retryAfterSec)
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
      lastError = toRequestTimeoutError(error) ?? error

      const isLastAttempt = attempt === maxAttempts
      const canRetry = isRetryableError(error, maxDelay)

      if (isLastAttempt || !canRetry) {
        throw error
      }

      let waitTimeMs = delay
      if (error instanceof HttpError && error.status === 429 && error.retryAfter !== null) {
        waitTimeMs = Math.min(error.retryAfter * 1000, maxDelay)
      }

      console.warn(`Request failed (attempt ${attempt}/${maxAttempts}), retrying in ${waitTimeMs}ms: ${path}`)

      // Wait before retry
      await sleep(waitTimeMs)

      // Exponential backoff for subsequent attempts
      delay = Math.min(delay * 2, maxDelay)
    } finally {
      clearAttemptTimeout?.()
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

    const retryAfterSec = parseRetryAfterHeader(response.headers.get('Retry-After'))
    const errorText = await response.text().catch(() => '')
    let message = errorText

    if (!message) {
      if (response.status === 429) {
        message = retryAfterSec
          ? `Too many requests. Please wait ${retryAfterSec}s and try again.`
          : 'Too many requests. Please wait a moment and try again.'
      } else {
        message = `Request failed with status ${response.status}`
      }
    }

    throw new HttpError(message, response.status, errorText, retryAfterSec)
  }

  const blob = await response.blob()

  return {
    blob,
    headers: response.headers,
    status: response.status,
  }
}
