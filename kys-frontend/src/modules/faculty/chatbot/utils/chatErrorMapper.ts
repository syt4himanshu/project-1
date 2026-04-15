import { HttpError } from '../../../../shared/api/httpClient'

/**
 * Maps backend chatbot errors to user-safe messages.
 * Handles: 403 (forbidden/not assigned), 404 (no data), 429 (rate limit),
 * timeout, and generic fallback.
 */
export function mapChatbotError(error: unknown): string {
    if (error instanceof HttpError) {
        switch (error.status) {
            case 403:
                return 'You can only query students assigned to you.'
            case 404:
                return 'Not enough academic or profile data to generate insights.'
            case 429:
                return 'Rate limit reached (10 requests/min). Please wait a moment before trying again.'
            case 401:
                return 'Your session has expired. Please sign in again.'
            case 500:
                return 'The AI service encountered an error. Try again or narrow to one student.'
            default:
                break
        }

        // Inspect the error message for known backend patterns
        const msg = error.message.toLowerCase()
        if (/forbidden|not assigned/i.test(msg)) return 'You can only query students assigned to you.'
        if (/no student data|no assigned students/i.test(msg))
            return 'Not enough academic or profile data to generate insights.'
        if (/timeout/i.test(msg))
            return 'The request timed out. Try again or narrow to one student.'
        if (/rate.?limit|too many/i.test(msg))
            return 'Rate limit reached. Please wait a moment before trying again.'

        return error.message || 'Could not generate insights right now.'
    }

    if (error instanceof Error) {
        if (/timeout/i.test(error.message))
            return 'The request timed out. Try again or narrow to one student.'
        return error.message || 'Could not generate insights right now.'
    }

    return 'Could not generate insights right now.'
}
