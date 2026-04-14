export type ApiEnvelope<T> = {
  success: boolean
  data: T | null
  error: string | null
}

export function readApiEnvelope<T>(payload: unknown): { ok: true; data: T } | { ok: false; error: string } {
  if (payload !== null && typeof payload === 'object' && 'success' in payload) {
    const envelope = payload as ApiEnvelope<T>

    if (envelope.success === false) {
      const message = typeof envelope.error === 'string' && envelope.error.trim() ? envelope.error : 'Request failed'
      return { ok: false, error: message }
    }

    return { ok: true, data: (envelope.data ?? null) as T }
  }

  return { ok: true, data: payload as T }
}
