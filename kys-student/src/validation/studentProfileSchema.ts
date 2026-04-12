import { z, type ZodError } from 'zod'

const text200 = z.string().trim().max(200, 'Must not exceed 200 characters').nullable().optional().or(z.literal(''))
const text255 = z.string().trim().max(255).nullable().optional().or(z.literal(''))
const text500 = z.string().trim().max(500).nullable().optional().or(z.literal(''))

export const studentProfileSchema = z.object({
  full_name: z.string().trim().min(3).max(120).nullable().optional().or(z.literal('')),
  section: z.string().trim().max(10).nullable().optional().or(z.literal('')),
  semester: z.coerce.number().int().min(1).max(8).nullable().optional(),
  year_of_admission: z.coerce.number().int().min(1990).max(2100).nullable().optional(),

  personal_info: z.object({
    mobile_no: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    personal_email: z.string().trim().email({ message: 'Invalid email' }).max(255).nullable().optional().or(z.literal('')),
    college_email: z.string().trim().email({ message: 'Invalid email' }).max(255).nullable().optional().or(z.literal('')),
    linked_in_id: z.string().trim().max(255).nullable().optional().or(z.literal('')),
    permanent_address: text500,
    present_address: text500,
    dob: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    gender: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    father_name: z.string().trim().max(120).nullable().optional().or(z.literal('')),
    father_mobile_no: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    father_email: z.string().trim().email({ message: 'Invalid email' }).max(255).nullable().optional().or(z.literal('')),
    father_occupation: z.string().trim().max(255).nullable().optional().or(z.literal('')),
    mother_name: z.string().trim().max(120).nullable().optional().or(z.literal('')),
    mother_mobile_no: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    mother_email: z.string().trim().email({ message: 'Invalid email' }).max(255).nullable().optional().or(z.literal('')),
    mother_occupation: z.string().trim().max(255).nullable().optional().or(z.literal('')),
    emergency_contact_name: z.string().trim().max(120).nullable().optional().or(z.literal('')),
    emergency_contact_number: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    blood_group: z.string().trim().max(5).nullable().optional().or(z.literal('')),
    category: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    aadhar_number: z.string().trim().max(14).nullable().optional().or(z.literal('')),
    mis_uid: z.string().trim().max(50).nullable().optional().or(z.literal('')),
    github_id: z.string().trim().max(255).nullable().optional().or(z.literal('')),
    guardian_name: z.string().trim().max(120).nullable().optional().or(z.literal('')),
    guardian_mobile: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    guardian_email: z.string().trim().email({ message: 'Invalid email' }).max(255).nullable().optional().or(z.literal('')),
  }).catchall(z.unknown()).optional(),

  past_education_records: z.array(z.object({
    exam_name: z.string().trim().max(100).nullable().optional().or(z.literal('')),
    percentage: z.coerce.number().min(0).max(100).nullable().optional(),
    year_of_passing: z.coerce.number().int().min(1990).max(2100).nullable().optional(),
    board: z.string().trim().max(100).nullable().optional().or(z.literal('')),
    exam_type: z.string().trim().max(100).nullable().optional().or(z.literal('')),
  }).catchall(z.unknown())).optional(),

  post_admission_records: z.array(z.object({
    semester: z.coerce.number().int().min(1).max(8).nullable().optional(),
    sgpa: z.coerce.number().min(0).max(100).nullable().optional(),
    backlog_subjects: text500,
    season: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    year_of_passing: z.coerce.number().int().min(1990).max(2100).nullable().optional(),
    college_rank: z.string().trim().max(100).nullable().optional().or(z.literal('')),
    academic_awards: text255,
  }).catchall(z.unknown())).optional(),

  projects: z.array(z.object({
    title: text255,
    description: z.string().trim().max(200, 'Project description must not exceed 200 characters').nullable().optional().or(z.literal('')),
  }).catchall(z.unknown())).optional(),

  internships: z.array(z.object({
    company_name: text255,
    domain: text255,
    internship_type: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    paid_unpaid: z.string().trim().max(10).nullable().optional().or(z.literal('')),
    start_date: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    end_date: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    designation: z.string().trim().max(120).nullable().optional().or(z.literal('')),
    description: z.string().trim().max(200, 'Internship description must not exceed 200 characters').nullable().optional().or(z.literal('')),
  }).catchall(z.unknown())).optional(),

  cocurricular_participations: z.array(z.object({
    name: text255,
    date: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    level: z.string().trim().max(100).nullable().optional().or(z.literal('')),
    awards: text255,
  }).catchall(z.unknown())).optional(),

  cocurricular_organizations: z.array(z.object({
    name: text255,
    date: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    level: z.string().trim().max(100).nullable().optional().or(z.literal('')),
    remark: text255,
  }).catchall(z.unknown())).optional(),

  skill_programs: z.array(z.object({
    course_title: text255,
    platform: text255,
    duration_hours: z.coerce.number().min(0).max(10000).nullable().optional(),
    date_from: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    date_to: z.string().trim().max(20).nullable().optional().or(z.literal('')),
  }).catchall(z.unknown())).optional(),

  career_objective: z.object({
    career_goal: z.string().trim().max(50).nullable().optional().or(z.literal('')),
    specific_details: text200,
    clarity_preparedness: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    interested_in_campus_placement: z.boolean().nullable().optional(),
    campus_placement_reasons: text200,
    non_technical_areas: text255,
    student_mentor_interest: z.string().trim().max(20).nullable().optional().or(z.literal('')),
    expectations_from_institute: text200,
  }).catchall(z.unknown()).optional(),

  skills: z.object({
    programming_languages: text500,
    technologies_frameworks: text500,
    domains_of_interest: text255,
    familiar_tools_platforms: text500,
    technical_soft_skills_overall: text500,
    additional_technical_skills: text500,
    additional_soft_skills: text500,
  }).catchall(z.unknown()).optional(),

  swoc: z.object({
    strengths: text500,
    weaknesses: text500,
    opportunities: text500,
    challenges: text500,
  }).catchall(z.unknown()).optional(),

  declaration_accepted: z.boolean().nullable().optional(),
}).catchall(z.unknown())

/** Alias matching common naming; same schema as `studentProfileSchema`. */
export const studentSchema = studentProfileSchema

export function formatZodFieldErrors(error: ZodError): Record<string, string> {
  const acc: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.length ? issue.path.map(String).join('.') : '_root'
    if (!acc[key]) acc[key] = issue.message
  }
  return acc
}

export function validateStudentProfileData(data: unknown): {
  isValid: boolean
  errors: string[]
  fieldErrors: Record<string, string>
} {
  const result = studentProfileSchema.safeParse(data)

  if (result.success) {
    return { isValid: true, errors: [], fieldErrors: {} }
  }

  const fieldErrors = formatZodFieldErrors(result.error)
  const errors = [...new Set(result.error.issues.map(issue => issue.message))]
  return { isValid: false, errors, fieldErrors }
}
