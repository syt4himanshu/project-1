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

const baseRows: AdminIncompleteProfile[] = [
  {
    id: 11,
    uid: 'STU001',
    name: 'Alice',
    yearOfAdmission: 2024,
    missingFields: ['mobile', 'address'],
    missingFieldCount: 2,
  },
]

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

    vi.mocked(adminHooks.useAdminReportIncompleteQuery).mockReturnValue(
      createIncompleteQuery(baseRows),
    )

    vi.mocked(adminHooks.useExportIncompleteReportsMutation).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue(undefined),
      isPending: false,
    } as unknown as ReturnType<typeof adminHooks.useExportIncompleteReportsMutation>)
  })

  it('renders Semester and Section filter controls, not a Year filter', () => {
    render(<ReportIncompleteProfilesTable />)

    expect(screen.getByLabelText('Semester')).toBeInTheDocument()
    expect(screen.getByLabelText('Section')).toBeInTheDocument()
    expect(screen.queryByLabelText('Year')).not.toBeInTheDocument()
  })

  it('Semester filter lists All Semesters plus 1–8', () => {
    render(<ReportIncompleteProfilesTable />)

    const semesterSelect = screen.getByLabelText('Semester')
    const options = Array.from((semesterSelect as HTMLSelectElement).options).map((o) => o.text)

    expect(options[0]).toBe('All Semesters')
    expect(options).toContain('Semester 1')
    expect(options).toContain('Semester 8')
    expect(options).toHaveLength(9)
  })

  it('Section filter lists All Sections plus A and B', () => {
    render(<ReportIncompleteProfilesTable />)

    const sectionSelect = screen.getByLabelText('Section')
    const options = Array.from((sectionSelect as HTMLSelectElement).options).map((o) => o.text)

    expect(options).toEqual(['All Sections', 'A', 'B'])
  })

  it('selecting Semester calls query hook with the numeric semester and no section', async () => {
    const user = userEvent.setup()
    render(<ReportIncompleteProfilesTable />)

    await user.selectOptions(screen.getByLabelText('Semester'), '5')

    expect(adminHooks.useAdminReportIncompleteQuery).toHaveBeenLastCalledWith(5, undefined)
  })

  it('selecting Section calls query hook with no semester and the section string', async () => {
    const user = userEvent.setup()
    render(<ReportIncompleteProfilesTable />)

    await user.selectOptions(screen.getByLabelText('Section'), 'A')

    expect(adminHooks.useAdminReportIncompleteQuery).toHaveBeenLastCalledWith(undefined, 'A')
  })

  it('selecting Semester 5 + Section A calls query hook with both filters', async () => {
    const user = userEvent.setup()
    render(<ReportIncompleteProfilesTable />)

    await user.selectOptions(screen.getByLabelText('Semester'), '5')
    await user.selectOptions(screen.getByLabelText('Section'), 'A')

    expect(adminHooks.useAdminReportIncompleteQuery).toHaveBeenLastCalledWith(5, 'A')
  })

  it('Export button passes semester and section to the mutation', async () => {
    const user = userEvent.setup()
    render(<ReportIncompleteProfilesTable />)

    await user.selectOptions(screen.getByLabelText('Semester'), '3')
    await user.selectOptions(screen.getByLabelText('Section'), 'B')
    await user.click(screen.getByRole('button', { name: 'Export Incomplete CSV' }))

    const mutation = vi.mocked(adminHooks.useExportIncompleteReportsMutation).mock.results[0]?.value
    expect(mutation?.mutateAsync).toHaveBeenCalledWith({ semester: 3, section: 'B' })
  })

  it('Export button with no filters passes undefined semester and section', async () => {
    const user = userEvent.setup()
    render(<ReportIncompleteProfilesTable />)

    await user.click(screen.getByRole('button', { name: 'Export Incomplete CSV' }))

    const mutation = vi.mocked(adminHooks.useExportIncompleteReportsMutation).mock.results[0]?.value
    expect(mutation?.mutateAsync).toHaveBeenCalledWith({ semester: undefined, section: undefined })
  })

  // Required Fields Not Filled column still present
  it('renders the Required Fields Not Filled column header', () => {
    render(<ReportIncompleteProfilesTable />)
    expect(screen.getByText('Required Fields Not Filled')).toBeInTheDocument()
  })

  it('displays missingFieldCount value in Required Fields Not Filled column', () => {
    vi.mocked(adminHooks.useAdminReportIncompleteQuery).mockReturnValue(
      createIncompleteQuery([
        { id: 20, uid: 'STU002', name: 'Bob', yearOfAdmission: 2023, missingFields: ['Profile Photo'], missingFieldCount: 1 },
      ]),
    )

    render(<ReportIncompleteProfilesTable />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('shows 0 in Required Fields Not Filled when student has no missing fields', () => {
    vi.mocked(adminHooks.useAdminReportIncompleteQuery).mockReturnValue(
      createIncompleteQuery([
        { id: 30, uid: 'STU003', name: 'Carol', yearOfAdmission: 2022, missingFields: [], missingFieldCount: 0 },
      ]),
    )

    render(<ReportIncompleteProfilesTable />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('shows correct count when profile has multiple missing fields including Profile Photo', () => {
    vi.mocked(adminHooks.useAdminReportIncompleteQuery).mockReturnValue(
      createIncompleteQuery([
        {
          id: 40,
          uid: 'STU004',
          name: 'Dan',
          yearOfAdmission: 2024,
          missingFields: ['Profile Photo', 'WhatsApp Mobile No.', 'Career Goal'],
          missingFieldCount: 3,
        },
      ]),
    )

    render(<ReportIncompleteProfilesTable />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
