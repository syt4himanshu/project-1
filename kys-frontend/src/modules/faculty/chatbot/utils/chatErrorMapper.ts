import { HttpError } from '../../../../shared/api/httpClient'

export const CHATBOT_AI_UNAVAILABLE_MESSAGE =
    'AI mentoring service is temporarily unavailable. Please try again shortly.'

const AI_ERROR_CODES = new Set([
    'AI_UNAVAILABLE',
    'AI_RATE_LIMITED',
    'AI_CONFIG_ERROR',
    'VALIDATION_ERROR',
    'AI_TIMEOUT',
])

const PERMISSION_DENIED_MESSAGE = 'You can only query students assigned to you.'
const NO_DATA_MESSAGE = 'Not enough academic or profile data to generate insights.'
const SESSION_EXPIRED_MESSAGE = 'Your session has expired. Please sign in again.'
const CHATBOT_RATE_LIMIT_MESSAGE =
    'Rate limit reached (10 requests/min). Please wait a moment before trying again.'

const TECHNICAL_MESSAGE_PATTERN =
    /circuit\s*breaker|circuitbreaker|referenceerror|typeerror|groq-api|\bAI_[A-Z_]+\b|model_decommissioned|validation_error/i

function readErrorCode(error: unknown): string | null {
    if (!(error instanceof HttpError) || error.payload === null || typeof error.payload !== 'object') {
        return null
    }

    const payload = error.payload as { code?: unknown; error?: { code?: unknown } }
    if (typeof payload.code === 'string') return payload.code
    if (
        typeof payload.error === 'object' &&
        payload.error !== null &&
        typeof payload.error.code === 'string'
    ) {
        return payload.error.code
    }

    return null
}

function isAiInfrastructureError(error: unknown, message: string): boolean {
    const code = readErrorCode(error)
    if (code && AI_ERROR_CODES.has(code)) return true

    if (TECHNICAL_MESSAGE_PATTERN.test(message)) return true

    if (error instanceof HttpError) {
        if ([500, 502, 503, 504, 422, 408].includes(error.status)) return true
    }

    return /\btimeout\b/i.test(message)
}

function containsTechnicalLeak(message: string): boolean {
    return TECHNICAL_MESSAGE_PATTERN.test(message)
}

/**
 * Logs full technical detail for support/debugging. Never pass this output to the UI.
 */
export function logChatbotError(error: unknown): void {
    if (error instanceof HttpError) {
        console.error('[faculty-chatbot] request failed', {
            status: error.status,
            message: error.message,
            code: readErrorCode(error),
            payload: error.payload,
            retryAfter: error.retryAfter,
        })
        return
    }

    console.error('[faculty-chatbot] request failed', error)
}

/**
 * Maps backend chatbot errors to user-safe messages.
 * Domain errors (auth, assignment, missing data) keep specific copy.
 * AI/infrastructure failures always return CHATBOT_AI_UNAVAILABLE_MESSAGE.
 */
export function mapChatbotError(error: unknown): string {
    if (error instanceof HttpError) {
        const message = error.message

        switch (error.status) {
            case 401:
                return SESSION_EXPIRED_MESSAGE
            case 403:
                return PERMISSION_DENIED_MESSAGE
            case 404:
                return NO_DATA_MESSAGE
            case 429:
                if (readErrorCode(error) === 'AI_RATE_LIMITED' || /provider|groq/i.test(message)) {
                    return CHATBOT_AI_UNAVAILABLE_MESSAGE
                }
                return CHATBOT_RATE_LIMIT_MESSAGE
            default:
                break
        }

        if (/forbidden|not assigned/i.test(message)) return PERMISSION_DENIED_MESSAGE
        if (/no student data|no assigned students|not found/i.test(message)) return NO_DATA_MESSAGE

        if (isAiInfrastructureError(error, message) || containsTechnicalLeak(message)) {
            return CHATBOT_AI_UNAVAILABLE_MESSAGE
        }

        return CHATBOT_AI_UNAVAILABLE_MESSAGE
    }

    if (error instanceof Error) {
        if (/forbidden|not assigned/i.test(error.message)) return PERMISSION_DENIED_MESSAGE
        if (/no student data|no assigned students|not found/i.test(error.message)) {
            return NO_DATA_MESSAGE
        }
        if (isAiInfrastructureError(error, error.message) || containsTechnicalLeak(error.message)) {
            return CHATBOT_AI_UNAVAILABLE_MESSAGE
        }
        if (/\btimeout\b/i.test(error.message)) return CHATBOT_AI_UNAVAILABLE_MESSAGE
    }

    return CHATBOT_AI_UNAVAILABLE_MESSAGE
}
