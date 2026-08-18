import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  HttpError,
  parseRetryAfterHeader,
  requestJson,
} from '../../shared/api/httpClient'
import { toApiErrorMessage } from '../../shared/api/errorMapper'

describe('HTTP Client Rate Limit & Retry Behavior', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('parseRetryAfterHeader', () => {
    it('parses integer seconds correctly', () => {
      expect(parseRetryAfterHeader('10')).toBe(10)
      expect(parseRetryAfterHeader('60')).toBe(60)
      expect(parseRetryAfterHeader('0')).toBe(0)
    })

    it('parses fractional seconds and rounds them', () => {
      expect(parseRetryAfterHeader('2.5')).toBe(3)
    })

    it('returns null for null, empty, or non-numeric invalid string', () => {
      expect(parseRetryAfterHeader(null)).toBeNull()
      expect(parseRetryAfterHeader('')).toBeNull()
      expect(parseRetryAfterHeader('invalid-header')).toBeNull()
    })

    it('parses future HTTP Date format into seconds diff', () => {
      const futureDate = new Date(Date.now() + 30_000).toUTCString()
      const result = parseRetryAfterHeader(futureDate)
      expect(result).toBeGreaterThanOrEqual(28)
      expect(result).toBeLessThanOrEqual(32)
    })
  })

  describe('toApiErrorMessage for 429', () => {
    it('returns friendly message without duration when retryAfter is absent', () => {
      const err = new HttpError('Too many requests', 429, null)
      expect(toApiErrorMessage(err)).toBe('Too many requests. Please wait a moment and try again.')
    })

    it('returns friendly message with duration when retryAfter is present', () => {
      const err = new HttpError('Too many requests', 429, null, 15)
      expect(toApiErrorMessage(err)).toBe('Too many requests. Please wait 15s and try again.')
    })
  })

  describe('requestJson 429 handling and retries', () => {
    it('does NOT retry on 429 when Retry-After is absent', async () => {
      let callCount = 0
      vi.stubGlobal('fetch', vi.fn(async () => {
        callCount++
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        })
      }))

      await expect(
        requestJson('/api/test', { retry: { maxAttempts: 3, initialDelay: 10, maxDelay: 50 } }),
      ).rejects.toThrow('Rate limit exceeded')

      // Must NOT retry
      expect(callCount).toBe(1)
    })

    it('does NOT retry on 429 when Retry-After exceeds maxDelay', async () => {
      let callCount = 0
      vi.stubGlobal('fetch', vi.fn(async () => {
        callCount++
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60', // 60s exceeds maxDelay (50ms)
          },
        })
      }))

      let thrownError: HttpError | null = null
      try {
        await requestJson('/api/test', { retry: { maxAttempts: 3, initialDelay: 10, maxDelay: 50 } })
      } catch (err) {
        if (err instanceof HttpError) {
          thrownError = err
        }
      }

      expect(callCount).toBe(1)
      expect(thrownError).toBeInstanceOf(HttpError)
      expect(thrownError?.status).toBe(429)
      expect(thrownError?.retryAfter).toBe(60)
    })

    it('retries on 429 when Retry-After is small and succeeds on second attempt', async () => {
      let callCount = 0
      vi.stubGlobal('fetch', vi.fn(async () => {
        callCount++
        if (callCount === 1) {
          return new Response(JSON.stringify({ error: 'Rate limited' }), {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '0', // 0s is <= maxDelay
            },
          })
        }
        return new Response(JSON.stringify({ success: true, data: { result: 'ok' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }))

      const data = await requestJson<{ result: string }>('/api/test', {
        retry: { maxAttempts: 2, initialDelay: 10, maxDelay: 5000 },
      })

      expect(callCount).toBe(2)
      expect(data).toEqual({ result: 'ok' })
    })

    it('continues retrying transient 500 server errors with backoff', async () => {
      let callCount = 0
      vi.stubGlobal('fetch', vi.fn(async () => {
        callCount++
        if (callCount === 1) {
          return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
        return new Response(JSON.stringify({ success: true, data: { value: 123 } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }))

      const data = await requestJson<{ value: number }>('/api/test', {
        retry: { maxAttempts: 2, initialDelay: 10, maxDelay: 50 },
      })

      expect(callCount).toBe(2)
      expect(data).toEqual({ value: 123 })
    })
  })
})
