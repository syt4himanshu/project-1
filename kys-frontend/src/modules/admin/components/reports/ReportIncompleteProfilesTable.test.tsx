import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AdminIncompleteProfile } from '../../api'
import { ReportIncompleteProfilesTable } from './ReportIncompleteProfilesTable'
import * as adminHooks from '../../hooks'

vi.mock('../../hooks', () => ({
  useAdminReportIncompleteQuery: vi.fn(),
  useExportIncompleteReportsMutation: vi.fn(),
}))

const rowsByYear: Record<string, AdminIncompleteProfile[]> = {
  all: [
    {
      id: 11,
      uid: 'STU001',
      name: 'Alice',
      yearOfAdmission: 2024,
      missingFields: ['mobile', 'address'],
    },
  ],
  '2024': [
    {
      id: 11,
      uid: 'STU001',
      name: 'Alice',
      yearOfAdmission: 2024,
      missingFields: ['mobile', 'address'],
    },
  ],
}

function createIncompleteQuery(data: AdminIncompleteProfile[]) {
  return {
    data,
    isPending: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  } as unknown as ReturnType<typeof adminHooks.useAdminReportIncompleteQuery>
}

describe('ReportIncompleteProfilesTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(adminHooks.useAdminReportIncompleteQuery).mockImplementation((year) => {
      const key = year === undefined ? 'all' : String(year)
      return createIncompleteQuery(rowsByYear[key] ?? [])
    })

    vi.mocked(adminHooks.useExportIncompleteReportsMutation).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    } as unknown as ReturnType<typeof adminHooks.useExportIncompleteReportsMutation>)
  })

  it('passes selected year to query hook and export mutation', async () => {
    const user = userEvent.setup()
    const currentYear = new Date().getFullYear()

    render(<ReportIncompleteProfilesTable />)

    expect(adminHooks.useAdminReportIncompleteQuery).toHaveBeenLastCalledWith(undefined)

    const yearSelect = screen.getByLabelText('Year')
    await user.selectOptions(yearSelect, String(currentYear))

    expect(adminHooks.useAdminReportIncompleteQuery).toHaveBeenLastCalledWith(currentYear)

    await user.click(screen.getByRole('button', { name: 'Export Incomplete CSV' }))

    const mutation = vi.mocked(adminHooks.useExportIncompleteReportsMutation).mock.results[0]?.value
    expect(mutation?.mutateAsync).toHaveBeenCalledWith({ year: currentYear })
  })
})
