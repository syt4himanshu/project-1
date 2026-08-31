import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ErrorState } from '../../modules/faculty/chatbot/components/ErrorState'
import { CHATBOT_AI_UNAVAILABLE_MESSAGE } from '../../modules/faculty/chatbot/utils/chatErrorMapper'

describe('ErrorState', () => {
    it('renders a mapped safe message without technical terms', () => {
        const { container } = render(
            <ErrorState
                message={CHATBOT_AI_UNAVAILABLE_MESSAGE}
                retryLabel="Regenerate"
                onRetry={() => {}}
            />,
        )

        expect(screen.getByRole('button', { name: 'Regenerate' })).toBeInTheDocument()
        expect(screen.getByText(CHATBOT_AI_UNAVAILABLE_MESSAGE)).toBeInTheDocument()
        expect(container).toMatchInlineSnapshot(`
          <div>
            <div
              class="query-state query-state--error"
            >
              <p
                class="query-state__title"
              >
                AI mentoring service is temporarily unavailable. Please try again shortly.
              </p>
              <button
                class="query-state__action"
                type="button"
              >
                Regenerate
              </button>
            </div>
          </div>
        `)
        expect(container.textContent).not.toMatch(/circuit breaker|referenceerror|groq/i)
    })
})
