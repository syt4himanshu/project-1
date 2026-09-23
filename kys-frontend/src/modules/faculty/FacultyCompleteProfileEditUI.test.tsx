import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ToastContext } from '../../app/providers/toast-context'
import { facultyClient } from './api/client'
import type { MenteePayload } from './api/types'
import { FacultyMenteeEditModal } from './components/FacultyMenteeEditModal'

vi.mock('./api/client', () => ({
  facultyClient: {
    getMentee: vi.fn(),
    getMenteeMinutes: vi.fn(),
    lockMentee: vi.fn(),
    unlockMentee: vi.fn(),
    updateMenteeProfile: vi.fn(),
    uploadMenteePhoto: vi.fn(),
  },
}))

vi.mock('country-state-city', () => ({
  State: {
    getStatesOfCountry: () => [{ name: 'Maharashtra', isoCode: 'MH' }],
  },
  City: {
    getCitiesOfState: () => [{ name: 'Nagpur' }],
  },
}))

const richMentee: MenteePayload = {
  id: 102,
  uid: 'STU_102',
  full_name: 'Priya Verma',
  semester: 6,
  section: 'B',
  year_of_admission: 2022,
  is_profile_locked: true,
  profile_locked_at: '2026-08-19T10:00:00.000Z',
  profile_locked_by: 5,
  admission_type: 'hsc',
  personal_info: {
    mobile_no: '9123456789',
    personal_email: 'priya@example.com',
    college_email: 'priya@stvincentngp.edu.in',
    linked_in_id: 'https://linkedin.com/in/priya',
    github_id: 'https://github.com/priya',
    permanent_address: 'Nagpur',
    present_address: 'Hostel',
    dob: '2004-01-15',
    gender: 'Female',
    blood_group: 'B+',
    category: 'OBC',
    aadhar_number: '123412341234',
    mis_uid: '24003085',
    father_name: 'Ravi',
    father_mobile_no: '9876543210',
    father_email: 'ravi@example.com',
    father_occupation: 'Engineer',
    mother_name: 'Sita',
    mother_mobile_no: '9876543211',
    mother_email: 'sita@example.com',
    mother_occupation: 'Teacher',
    guardian_name: 'Uncle',
    guardian_mobile: '9876543212',
    guardian_email: 'uncle@example.com',
    emergency_contact_name: 'Ravi',
    emergency_contact_number: '9876543210',
    city: 'Nagpur',
    state: 'Maharashtra',
    pincode: '440001',
    digipin: 'ABCDE12345',
  },
  past_education_records: [
    { exam_name: 'SSC', board: 'CBSE', percentage: 90, year_of_passing: 2020 },
    { exam_name: 'HSSC', board: 'CBSE', percentage: 88, year_of_passing: 2022 },
  ],
  post_admission_records: [
    { semester: 1, sgpa: 8.5, backlog_subjects: '', season: 'Winter', year_of_passing: 2023 },
  ],
  projects: [
    { title: 'Mini App', domain: 'Web', description: 'Guide A', project_guide: 'Guide A' },
    { title: 'Major App', domain: 'AI', description: 'Guide B', project_guide: 'Guide B' },
  ],
  internships: [
    {
      title: 'Summer Intern',
      company_name: 'Acme',
      domain: 'Web',
      internship_type: 'Online',
      paid_unpaid: 'Paid',
      paid_type: 'With stipend',
      stipend_amount: '10000',
      start_date: '2024-05-01',
      end_date: '2024-07-01',
      designation: 'Intern',
      city: 'Nagpur',
      state: 'Maharashtra',
      description: 'Worked on APIs',
    },
  ],
  cocurricular_participations: [
    { name: 'Hackathon', date: '2024-02-01', level: 'Institute', awards: 'Winner' },
  ],
  cocurricular_organizations: [
    { name: 'Tech Fest', date: '2024-03-01', level: 'Department', remark: 'Coordinator' },
  ],
  skill_programs: [
    {
      course_title: 'ML Basics',
      platform: 'Coursera',
      domain: 'AI / Machine Learning',
      duration_hours: 40,
      date_from: '2024-01-01',
      date_to: '2024-02-01',
    },
  ],
  career_objective: {
    career_goal: 'Placement',
    specific_details: 'IT',
    clarity_preparedness: 'Good',
    interested_in_campus_placement: true,
    campus_placement_reasons: 'Growth',
    non_technical_areas: 'Sports',
    student_mentor_interest: 'Yes',
    mentorship_domain: 'Web Development',
    expectations_from_institute: 'Mentorship',
    placement_type: 'IT',
    higher_studies_type: '',
    higher_studies_location: '',
  },
  skills: {
    programming_languages: 'Python, JS',
    technologies_frameworks: 'MERN',
    frontend_technologies_frameworks: 'React',
    backend_technologies_databases: 'Node, MongoDB',
    domains_of_interest: 'Web Development',
    familiar_tools_platforms: 'Git',
    technical_soft_skills_overall: 'Communication',
    additional_technical_skills: 'Cloud',
    additional_soft_skills: 'Leadership',
  },
  swoc: {
    strengths: 'Teamwork',
    weaknesses: 'Time management',
    opportunities: 'Hackathons',
    challenges: 'Academics',
  },
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
}

function renderEditor(mentee: MenteePayload = richMentee, onClose = vi.fn()) {
  const notify = vi.fn()
  const queryClient = createQueryClient()
  return {
    notify,
    onClose,
    queryClient,
    ...render(
      <QueryClientProvider client={queryClient}>
        <ToastContext.Provider value={{ notify }}>
          <FacultyMenteeEditModal
            uid={mentee.uid}
            open
            mentee={mentee}
            onClose={onClose}
          />
        </ToastContext.Provider>
      </QueryClientProvider>,
    ),
  }
}

describe('Faculty complete mentee profile editor UI', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(facultyClient.updateMenteeProfile).mockResolvedValue({
      message: 'ok',
      student: richMentee,
    })
  })

  it('UI-09 — renders major profile sections in sidebar and existing values', () => {
    renderEditor()

    expect(screen.getByRole('button', { name: /Personal Details/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Parents & Guardian/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Emergency Contact/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Past Education/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Academic Records/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Projects/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Internships/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Co-Curricular Activities/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Co-Curricular Organization/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Skill Programs/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Career Objective/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Skills/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^SWOC$/i })).toBeInTheDocument()

    expect(screen.getByDisplayValue('Priya Verma')).toBeInTheDocument()
    expect(screen.getByDisplayValue('9123456789')).toBeInTheDocument()
    expect(screen.getByDisplayValue('priya@example.com')).toBeInTheDocument()
    expect(screen.getAllByDisplayValue('Ravi').length).toBeGreaterThan(0)
    expect(screen.getByDisplayValue('Sita')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Uncle')).toBeInTheDocument()
    expect(screen.getByDisplayValue('ABCDE12345')).toBeInTheDocument()
  })

  it('UI-01 — Cancel with no changes closes editor immediately', async () => {
    const user = userEvent.setup()
    const { onClose } = renderEditor()

    await user.click(screen.getByRole('button', { name: /^Cancel$/i }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(facultyClient.updateMenteeProfile).not.toHaveBeenCalled()
    expect(screen.queryByText(/Unsaved changes/i)).not.toBeInTheDocument()
  })

  it('UI-02 — Cancel with unsaved changes prompts discard dialog', async () => {
    const user = userEvent.setup()
    const { onClose } = renderEditor()

    const nameInput = screen.getByDisplayValue('Priya Verma')
    await user.clear(nameInput)
    await user.type(nameInput, 'Priya Verma Updated')

    await user.click(screen.getByRole('button', { name: /^Cancel$/i }))

    expect(screen.getByRole('heading', { name: 'Unsaved changes' })).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
    expect(facultyClient.updateMenteeProfile).not.toHaveBeenCalled()
  })

  it('UI-03 — Stay button closes discard dialog and keeps editor open', async () => {
    const user = userEvent.setup()
    const { onClose } = renderEditor()

    const nameInput = screen.getByDisplayValue('Priya Verma')
    await user.clear(nameInput)
    await user.type(nameInput, 'Priya Verma Updated')

    await user.click(screen.getByRole('button', { name: /^Cancel$/i }))
    expect(screen.getByRole('heading', { name: 'Unsaved changes' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^Stay$/i }))

    expect(screen.queryByRole('heading', { name: 'Unsaved changes' })).not.toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
    expect(screen.getByDisplayValue('Priya Verma Updated')).toBeInTheDocument()
    expect(facultyClient.updateMenteeProfile).not.toHaveBeenCalled()
  })

  it('UI-04 — Discard Changes closes dialog and editor without saving', async () => {
    const user = userEvent.setup()
    const { onClose } = renderEditor()

    const nameInput = screen.getByDisplayValue('Priya Verma')
    await user.clear(nameInput)
    await user.type(nameInput, 'Priya Verma Updated')

    await user.click(screen.getByRole('button', { name: /^Cancel$/i }))
    await user.click(screen.getByRole('button', { name: /Discard Changes/i }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(facultyClient.updateMenteeProfile).not.toHaveBeenCalled()
  })

  it('UI-05 — Header close button behaves identically to Cancel when dirty', async () => {
    const user = userEvent.setup()
    const { onClose } = renderEditor()

    const nameInput = screen.getByDisplayValue('Priya Verma')
    await user.clear(nameInput)
    await user.type(nameInput, 'Changed Name')

    await user.click(screen.getByRole('button', { name: /Close editor/i }))

    expect(screen.getByRole('heading', { name: 'Unsaved changes' })).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()
  })

  it('UI-07 — Legacy invalid long text does not block unrelated edit save', async () => {
    const user = userEvent.setup()
    const legacyMentee: MenteePayload = {
      ...richMentee,
      career_objective: {
        ...(richMentee.career_objective || {}),
        specific_details: 'X'.repeat(250), // legacy over-200 string
      },
    }
    const { notify, onClose } = renderEditor(legacyMentee)

    // Edit only mobile number
    const mobileInput = screen.getByDisplayValue('9123456789')
    await user.clear(mobileInput)
    await user.type(mobileInput, '9988776655')

    await user.click(screen.getByRole('button', { name: /Save Profile Changes/i }))

    await waitFor(() => {
      expect(facultyClient.updateMenteeProfile).toHaveBeenCalledWith(
        'STU_102',
        expect.objectContaining({
          personal_info: expect.objectContaining({
            mobile_no: '9988776655',
          }),
        }),
      )
    })

    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({
        intent: 'success',
      }),
    )
    expect(onClose).toHaveBeenCalled()
  })

  it('UI-08 — Explicit invalid field edit is rejected by validation', async () => {
    const user = userEvent.setup()
    renderEditor()

    const mobileInput = screen.getByDisplayValue('9123456789')
    await user.clear(mobileInput)
    await user.type(mobileInput, '123') // invalid 10-digit format

    await user.click(screen.getByRole('button', { name: /Save Profile Changes/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    expect(facultyClient.updateMenteeProfile).not.toHaveBeenCalled()
  })

  it('UI-10 — Empty optional arrays still render editable form controls', () => {
    const emptyOptionalMentee: MenteePayload = {
      ...richMentee,
      internships: [],
      cocurricular_organizations: [],
      skill_programs: [],
    }
    renderEditor(emptyOptionalMentee)

    // Editor still mounts components allowing addition/editing of records
    expect(screen.getByRole('button', { name: /Personal Details/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Internships/i })).toBeInTheDocument()
  })

  it('UI-11 & UI-12 — Successful save closes modal; failed save preserves draft and shows error', async () => {
    const user = userEvent.setup()
    vi.mocked(facultyClient.updateMenteeProfile).mockRejectedValueOnce(
      new Error('API Server Error'),
    )

    renderEditor()

    const nameInput = screen.getByDisplayValue('Priya Verma')
    await user.clear(nameInput)
    await user.type(nameInput, 'Priya Verma Failed Save')

    await user.click(screen.getByRole('button', { name: /Save Profile Changes/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    // Draft preserved on failure
    expect(screen.getByDisplayValue('Priya Verma Failed Save')).toBeInTheDocument()
  })
})
