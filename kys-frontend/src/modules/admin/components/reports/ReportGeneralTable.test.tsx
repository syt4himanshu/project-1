import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { AdminGeneralReportRow } from '../../api'
import { ReportGeneralTable } from './ReportGeneralTable'
import * as adminHooks from '../../hooks'

vi.mock('../../hooks', () => ({
  useAdminReportGeneralQuery: vi.fn(),
}))

const mockRows: AdminGeneralReportRow[] = [
  {
    id: 1,
    uid: 'U001',
    name: 'Alice Johnson',
    semester: 6,
    section: 'A',
    yearOfAdmission: 2023,
    domainOfInterest: 'AI',
    careerGoal: 'Placement',
    academicRecords: [
      { semester: 5, sgpa: 7.5, backlogs: 1 },
      { semester: 6, sgpa: 8.1, backlogs: 0 },
    ],
  },
  {
    id: 2,
    uid: 'U002',
    name: 'Bob Smith',
    semester: 4,
    section: 'B',
    yearOfAdmission: 2024,
    domainOfInterest: 'Web',
    careerGoal: 'Higher Studies',
    academicRecords: [{ semester: 4, sgpa: 6.2, backlogs: 3 }],
  },
  {
    id: 3,
    uid: 'U003',
    name: 'Carol Lee',
    semester: 6,
    section: 'A',
    yearOfAdmission: 2023,
    domainOfInterest: 'Data',
    careerGoal: 'Placement',
    academicRecords: [
      { semester: 5, sgpa: 9.1, backlogs: 0 },
      { semester: 6, sgpa: 9.0, backlogs: 0 },
    ],
  },
]

function createGeneralQuery(data: AdminGeneralReportRow[]) {
  return {
    data,
    isPending: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
  } as unknown as ReturnType<typeof adminHooks.useAdminReportGeneralQuery>
}

describe('ReportGeneralTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(adminHooks.useAdminReportGeneralQuery).mockReturnValue(createGeneralQuery(mockRows))
  })

  it('filters rows using semester and sgpa rules', async () => {
    const user = userEvent.setup()

    render(<ReportGeneralTable />)

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
    expect(screen.getByText('Carol Lee')).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText('Semester'), '6')
    await user.type(screen.getByLabelText('Min SGPA'), '8.5')

    expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument()
    expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument()
    expect(screen.getByText('Carol Lee')).toBeInTheDocument()
  })

  it('resets filters back to initial state', async () => {
    const user = userEvent.setup()

    render(<ReportGeneralTable />)

    await user.type(screen.getByLabelText('Search'), 'bob')
    expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Reset Filters' }))

    expect(screen.getByLabelText('Search')).toHaveValue('')
    expect(screen.getByLabelText('Semester')).toHaveValue('')
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
    expect(screen.getByText('Bob Smith')).toBeInTheDocument()
    expect(screen.getByText('Carol Lee')).toBeInTheDocument()
  })
})
