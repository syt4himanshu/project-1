import { describe, expect, it, vi } from 'vitest'
import { HttpError } from '../../shared/api/httpClient'
import {
    CHATBOT_AI_UNAVAILABLE_MESSAGE,
    logChatbotError,
    mapChatbotError,
} from '../../modules/faculty/chatbot/utils/chatErrorMapper'

describe('mapChatbotError', () => {
    it.each([
        ['AI_UNAVAILABLE', { code: 'AI_UNAVAILABLE' }],
        ['AI_RATE_LIMITED', { code: 'AI_RATE_LIMITED' }],
        ['AI_CONFIG_ERROR', { code: 'AI_CONFIG_ERROR' }],
        ['VALIDATION_ERROR', { code: 'VALIDATION_ERROR' }],
        ['AI_TIMEOUT', { code: 'AI_TIMEOUT' }],
    ])('maps taxonomy code %s to the safe AI message', (_label, payload) => {
        const err = new HttpError('Provider unavailable', 503, payload)
        expect(mapChatbotError(err)).toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
    })

    it('maps circuit-breaker-open errors to the safe AI message', () => {
        const err = new HttpError('Circuit breaker is OPEN for groq-api', 500, null)
        expect(mapChatbotError(err)).toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
        expect(mapChatbotError(err)).not.toMatch(/circuit breaker/i)
    })

    it('maps generic 500 errors to the safe AI message', () => {
        const err = new HttpError('Internal server error', 500, null)
        expect(mapChatbotError(err)).toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
    })

    it('maps 503 errors to the safe AI message', () => {
        const err = new HttpError('Service unavailable', 503, null)
        expect(mapChatbotError(err)).toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
    })

    it('maps 422 validation failures to the safe AI message', () => {
        const err = new HttpError(
            'AI response failed validation after regeneration',
            422,
            { code: 'VALIDATION_ERROR' },
        )
        expect(mapChatbotError(err)).toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
    })

    it('maps timeout errors to the safe AI message', () => {
        const err = new HttpError('Request timed out. Try again, or narrow to one student.', 408, null)
        expect(mapChatbotError(err)).toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
        expect(mapChatbotError(err)).not.toMatch(/timeout/i)
    })

    it('maps 403 to assigned-student message', () => {
        const err = new HttpError('Forbidden', 403, null)
        expect(mapChatbotError(err)).toMatch(/only query students assigned/i)
    })

    it('maps 404 to no-data message', () => {
        const err = new HttpError('Not found', 404, null)
        expect(mapChatbotError(err)).toMatch(/not enough.*data/i)
    })

    it('maps middleware 429 to chatbot rate-limit message', () => {
        const err = new HttpError('Too many chatbot requests. Please retry shortly.', 429, null)
        expect(mapChatbotError(err)).toMatch(/rate limit/i)
        expect(mapChatbotError(err)).not.toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
    })

    it('maps 401 to session-expired message', () => {
        const err = new HttpError('Unauthorized', 401, null)
        expect(mapChatbotError(err)).toMatch(/session.*expired/i)
    })

    it('maps message-level "not assigned" pattern', () => {
        const err = new HttpError('Student is not assigned to this faculty', 400, null)
        expect(mapChatbotError(err)).toMatch(/only query students assigned/i)
    })

    it('never surfaces raw technical terms in mapped output', () => {
        const cases = [
            new HttpError('Circuit breaker is OPEN for groq-api', 500, null),
            new HttpError('ReferenceError: cleanAndValidateResponse is not defined', 500, null),
            new Error('ReferenceError: something failed'),
            new HttpError('AI_UNAVAILABLE: upstream failure', 503, { code: 'AI_UNAVAILABLE' }),
        ]

        for (const err of cases) {
            const mapped = mapChatbotError(err)
            expect(mapped).toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
            expect(mapped).not.toMatch(/circuit breaker|referenceerror|groq|AI_/i)
        }
    })

    it('returns safe fallback for unknown values', () => {
        expect(mapChatbotError(null)).toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
        expect(mapChatbotError(undefined)).toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
        expect(mapChatbotError({})).toBe(CHATBOT_AI_UNAVAILABLE_MESSAGE)
    })
})

describe('logChatbotError', () => {
    it('logs technical detail to console without returning it', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        const err = new HttpError('Circuit breaker is OPEN for groq-api', 500, { code: 'AI_UNAVAILABLE' })

        logChatbotError(err)

        expect(consoleSpy).toHaveBeenCalledWith(
            '[faculty-chatbot] request failed',
            expect.objectContaining({
                status: 500,
                message: 'Circuit breaker is OPEN for groq-api',
                code: 'AI_UNAVAILABLE',
            }),
        )

        consoleSpy.mockRestore()
    })
})
