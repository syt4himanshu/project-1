export function extractErrorMessage(payload: unknown): string | null {
  if (payload === null || typeof payload !== 'object') return null

  const candidate = payload as {
    error?: unknown
    message?: unknown
  }

  if (typeof candidate.error === 'string' && candidate.error.trim()) return candidate.error
  if (typeof candidate.message === 'string' && candidate.message.trim()) return candidate.message

  return null
}

export function toErrorMessage(error: unknown, fallback = 'Request failed'): string {
  if (error instanceof Error && error.message.trim()) return error.message
  return fallback
}
