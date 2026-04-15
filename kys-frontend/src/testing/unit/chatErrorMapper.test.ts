import { describe, expect, it } from 'vitest'
import { HttpError } from '../../shared/api/httpClient'
import { mapChatbotError } from '../../modules/faculty/chatbot/utils/chatErrorMapper'

describe('mapChatbotError', () => {
    it('maps 403 to assigned-student message', () => {
        const err = new HttpError('Forbidden', 403, null)
        expect(mapChatbotError(err)).toMatch(/only query students assigned/i)
    })

    it('maps 404 to no-data message', () => {
        const err = new HttpError('Not found', 404, null)
        expect(mapChatbotError(err)).toMatch(/not enough.*data/i)
    })

    it('maps 429 to rate-limit message', () => {
        const err = new HttpError('Too many requests', 429, null)
        expect(mapChatbotError(err)).toMatch(/rate limit/i)
    })

    it('maps 401 to session-expired message', () => {
        const err = new HttpError('Unauthorized', 401, null)
        expect(mapChatbotError(err)).toMatch(/session.*expired/i)
    })

    it('maps 500 to AI service error message', () => {
        const err = new HttpError('Internal server error', 500, null)
        expect(mapChatbotError(err)).toMatch(/AI service/i)
    })

    it('maps message-level "not assigned" pattern', () => {
        const err = new HttpError('Student is not assigned to this faculty', 400, null)
        expect(mapChatbotError(err)).toMatch(/only query students assigned/i)
    })

    it('maps message-level timeout pattern', () => {
        const err = new HttpError('Request timeout exceeded', 408, null)
        expect(mapChatbotError(err)).toMatch(/timed out/i)
    })

    it('maps message-level rate-limit pattern', () => {
        const err = new HttpError('Rate limit exceeded', 400, null)
        expect(mapChatbotError(err)).toMatch(/rate limit/i)
    })

    it('returns error message for generic Error', () => {
        const err = new Error('Something went wrong')
        expect(mapChatbotError(err)).toBe('Something went wrong')
    })

    it('returns fallback for unknown values', () => {
        expect(mapChatbotError(null)).toBe('Could not generate insights right now.')
        expect(mapChatbotError(undefined)).toBe('Could not generate insights right now.')
        expect(mapChatbotError({})).toBe('Could not generate insights right now.')
    })
})
