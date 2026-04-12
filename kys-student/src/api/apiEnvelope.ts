export type ApiEnvelope<T> = {
    success: boolean
    data: T | null
    error: string | null
}

/**
 * Parses backend `{ success, data, error }` responses. If `success` is absent, treats the body as legacy raw `data`.
 */
export function readApiEnvelope<T>(body: unknown): { ok: true; data: T } | { ok: false; error: string } {
    if (body !== null && typeof body === 'object' && 'success' in body) {
        const b = body as ApiEnvelope<T>
        if (b.success === false) {
            const msg = typeof b.error === 'string' && b.error.trim() ? b.error : 'Request failed'
            return { ok: false, error: msg }
        }
        return { ok: true, data: (b.data ?? null) as T }
    }
    return { ok: true, data: body as T }
}

/** When axios rejects, map `response.data` through the same envelope rules. */
export function extractAxiosEnvelopeError(e: unknown): string | null {
    if (typeof e !== 'object' || e === null) return null
    const ax = e as { response?: { data?: unknown } }
    const d = ax.response?.data
    if (d === undefined) return null
    if (d !== null && typeof d === 'object' && 'success' in d) {
        const parsed = readApiEnvelope(d)
        return parsed.ok ? null : parsed.error
    }
    if (d !== null && typeof d === 'object' && typeof (d as { error?: unknown }).error === 'string') {
        const msg = (d as { error: string }).error.trim()
        return msg || null
    }
    return null
}
