import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AIRemarksAssistant } from './AIRemarksAssistant'
import { facultyClient } from '../api/client'
import { HttpError } from '../../../shared/api/httpClient'

vi.mock('../api/client', () => ({
  facultyClient: {
    askAIRemarks: vi.fn(),
  },
}))

const studentContext = {
  uid: 'STU001',
  name: 'Anish Kishor Bezalwar',
  semester: 3,
  program: 'B.Tech CSE',
  previousRemarks: [
    {
      date: '2026-04-01',
      remarks: 'Steady progress',
      suggestion: 'Keep practicing',
      action: 'Weekly follow-up',
    },
  ],
}

describe('AIRemarksAssistant', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('submits the AI remarks request through the faculty client', async () => {
    const user = userEvent.setup()

    vi.mocked(facultyClient.askAIRemarks).mockResolvedValue({
      content: 'Remarks: Consistent progress.\nSuggestion: Encourage project work.',
      studentUid: studentContext.uid,
      timestamp: new Date().toISOString(),
    })

    render(
      <AIRemarksAssistant
        open
        studentContext={studentContext}
        onClose={() => {}}
        onInsert={() => {}}
      />,
    )

    await user.click(screen.getByRole('button', { name: /overall summary/i }))

    await waitFor(() => {
      expect(facultyClient.askAIRemarks).toHaveBeenCalledWith({
        query: 'Provide an overall mentoring summary for Anish Kishor Bezalwar',
        studentContext,
      })
    })

    expect(await screen.findByText(/consistent progress/i)).toBeInTheDocument()
  })

  it('shows the mapped API error message when the request fails', async () => {
    const user = userEvent.setup()

    vi.mocked(facultyClient.askAIRemarks).mockRejectedValue(
      new HttpError('Invalid token', 401, null),
    )

    render(
      <AIRemarksAssistant
        open
        studentContext={studentContext}
        onClose={() => {}}
        onInsert={() => {}}
      />,
    )

    await user.click(screen.getByRole('button', { name: /overall summary/i }))

    expect(await screen.findByText(/your session expired\. please sign in again\./i)).toBeInTheDocument()
    expect(await screen.findByText(/sorry, i encountered an error\. please try again\./i)).toBeInTheDocument()
  })
})
