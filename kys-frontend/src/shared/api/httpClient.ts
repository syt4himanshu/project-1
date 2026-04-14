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

interface JsonRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  token?: string | null
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
  const { body, token, headers: customHeaders, ...requestInit } = options

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
    const message = extractErrorMessage(payload) || `Request failed with status ${response.status}`
    throw new HttpError(message, response.status, payload)
  }

  const parsed = readApiEnvelope<T>(payload)
  if (!parsed.ok) {
    throw new HttpError(parsed.error, response.status, payload)
  }

  return parsed.data
}
