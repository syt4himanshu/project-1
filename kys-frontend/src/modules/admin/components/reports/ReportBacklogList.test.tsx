import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AdminBacklogEntry } from '../../api'
import { ReportBacklogList } from './ReportBacklogList'
import * as adminHooks from '../../hooks'

vi.mock('../../hooks', () => ({
  useAdminReportBacklogsQuery: vi.fn(),
}))

const backlogRows: AdminBacklogEntry[] = [
  {
    studentId: 1,
    uid: 'STU001',
    name: 'Alice',
    subjects: ['Mathematics II', 'Operating Systems'],
  },
  {
    studentId: 2,
    uid: 'STU002',
    name: 'Bob',
    subjects: ['Compiler Design'],
  },
]

function createBacklogQuery(data: AdminBacklogEntry[]) {
  return {
    data,
    isPending: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  } as unknown as ReturnType<typeof adminHooks.useAdminReportBacklogsQuery>
}

describe('ReportBacklogList', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(adminHooks.useAdminReportBacklogsQuery).mockReturnValue(createBacklogQuery(backlogRows))
  })

  it('filters rows by uid, name, and subject search', async () => {
    const user = userEvent.setup()

    render(<ReportBacklogList />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Search'), 'compiler')

    expect(screen.queryByText('Alice')).not.toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })
})
