import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
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

const richMentee = {
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

function renderEditor(mentee: MenteePayload = richMentee as MenteePayload, onClose = vi.fn()) {
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

describe('Faculty complete mentee profile editor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(facultyClient.updateMenteeProfile).mockResolvedValue({
      message: 'ok',
      student: richMentee as MenteePayload,
    })
  })

  it('renders major profile sections in the sidebar', () => {
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
  })

  it('shows existing personal, parent, emergency, education and career fields', () => {
    renderEditor()

    expect(screen.getByDisplayValue('Priya Verma')).toBeInTheDocument()
    expect(screen.getByDisplayValue('9123456789')).toBeInTheDocument()
    expect(screen.getByDisplayValue('priya@example.com')).toBeInTheDocument()
    expect(screen.getAllByDisplayValue('Ravi').length).toBeGreaterThan(0)
    expect(screen.getByDisplayValue('Sita')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Uncle')).toBeInTheDocument()
    expect(screen.getByDisplayValue('ABCDE12345')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Mini App')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Acme')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Teamwork')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Python, JS')).toBeInTheDocument()
  })

  it('keeps the form editable when the mentee profile is locked', async () => {
    const user = userEvent.setup()
    renderEditor()

    expect(screen.getByText(/Locked for student editing/i)).toBeInTheDocument()

    const nameInput = screen.getByDisplayValue('Priya Verma')
    expect(nameInput).not.toBeDisabled()
    await user.clear(nameInput)
    await user.type(nameInput, 'Priya Verma Updated')
    expect(screen.getByDisplayValue('Priya Verma Updated')).toBeInTheDocument()
  })

  it('saves via updateMenteeProfile and does not send lock fields', async () => {
    const user = userEvent.setup()
    const { notify, onClose } = renderEditor()

    await user.click(screen.getByRole('button', { name: /Save Profile Changes/i }))

    await waitFor(() => {
      expect(facultyClient.updateMenteeProfile).toHaveBeenCalledWith(
        'STU_102',
        expect.objectContaining({
          full_name: 'Priya Verma',
          personal_info: expect.objectContaining({
            emergency_contact_name: 'Ravi',
            emergency_contact_number: '9876543210',
          }),
          projects: expect.any(Array),
          internships: expect.any(Array),
          swoc: expect.objectContaining({ strengths: 'Teamwork' }),
        }),
      )
    })

    const payload = vi.mocked(facultyClient.updateMenteeProfile).mock.calls[0][1] as Record<string, unknown>
    expect(payload).not.toHaveProperty('is_profile_locked')
    expect(payload).not.toHaveProperty('profile_locked_at')
    expect(payload).not.toHaveProperty('profile_locked_by')
    expect(notify).toHaveBeenCalledWith(
      expect.objectContaining({
        intent: 'success',
        message: expect.stringMatching(/profile updated successfully/i),
      }),
    )
    expect(onClose).toHaveBeenCalled()
  })

  it('warns about unsaved changes before closing', async () => {
    const user = userEvent.setup()
    const { onClose } = renderEditor()

    const nameInput = screen.getByDisplayValue('Priya Verma')
    await user.clear(nameInput)
    await user.type(nameInput, 'Changed Name')

    await user.click(screen.getByRole('button', { name: /Close editor/i }))

    expect(screen.getByRole('heading', { name: 'Unsaved changes' })).toBeInTheDocument()
    expect(onClose).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /Stay/i }))
    expect(onClose).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /Close editor/i }))
    await user.click(screen.getByRole('button', { name: /Discard Changes/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('opens a read-only preview that does not mutate draft values', async () => {
    const user = userEvent.setup()
    renderEditor()

    await user.click(screen.getByRole('button', { name: /^Preview$/i }))

    const dialog = screen.getByRole('dialog', { name: /Preview Profile/i })
    expect(within(dialog).getByText(/Read-only preview/i)).toBeInTheDocument()
    expect(within(dialog).getByText('Priya Verma')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Priya Verma')).toBeInTheDocument()
  })

  it('allows editing unlocked mentees as well', async () => {
    const unlocked = {
      ...richMentee,
      is_profile_locked: false,
      profile_locked_at: null as string | null,
    }
    renderEditor(unlocked as typeof richMentee)

    expect(screen.getByText(/Editable by Student/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue('Priya Verma')).not.toBeDisabled()
  })
})
