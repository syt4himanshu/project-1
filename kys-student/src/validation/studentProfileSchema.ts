import Joi from 'joi'

const text200 = Joi.string().trim().max(200).allow('', null)
const text255 = Joi.string().trim().max(255).allow('', null)
const text500 = Joi.string().trim().max(500).allow('', null)
const optionalEmail = Joi.string()
  .trim()
  .max(255)
  .allow('', null)
  .pattern(/^(|n\/a|na|-|[^\s@]+@[^\s@]+\.[^\s@]+)$/i)
  .messages({
    'string.pattern.base': 'must be a valid email',
  })

const studentProfileSchema = Joi.object({
  full_name: Joi.string().trim().min(3).max(120).allow('', null),
  section: Joi.string().trim().max(10).allow('', null),
  semester: Joi.number().integer().min(1).max(8).allow(null),
  year_of_admission: Joi.number().integer().min(1990).max(2100).allow(null),
  admission_type: Joi.string().valid('hsc', 'diploma').allow('', null),

  personal_info: Joi.object({
    mobile_no: Joi.string().trim().max(20).allow('', null),
    personal_email: optionalEmail,
    college_email: optionalEmail,
    linked_in_id: Joi.string().trim().max(255).allow('', null),
    permanent_address: text500,
    present_address: text500,
    dob: Joi.string().trim().max(20).allow('', null),
    gender: Joi.string().trim().max(20).allow('', null),
    father_name: Joi.string().trim().max(120).allow('', null),
    father_mobile_no: Joi.string().trim().max(20).allow('', null),
    father_email: text255,
    father_occupation: Joi.string().trim().max(255).allow('', null),
    mother_name: Joi.string().trim().max(120).allow('', null),
    mother_mobile_no: Joi.string().trim().max(20).allow('', null),
    mother_email: text255,
    mother_occupation: Joi.string().trim().max(255).allow('', null),
    emergency_contact_name: Joi.string().trim().max(120).allow('', null),
    emergency_contact_number: Joi.string().trim().max(20).allow('', null),
    blood_group: Joi.string().trim().max(5).allow('', null),
    category: Joi.string().trim().max(20).allow('', null),
    aadhar_number: Joi.string().trim().max(14).allow('', null),
    mis_uid: Joi.string().trim().max(50).allow('', null),
    github_id: Joi.string().trim().max(255).allow('', null),
    guardian_name: Joi.string().trim().max(120).allow('', null),
    guardian_mobile: Joi.string().trim().max(20).allow('', null),
    guardian_email: text255,
  }).unknown(true),

  past_education_records: Joi.array().items(Joi.object({
    exam_name: Joi.string().trim().max(100).allow('', null),
    percentage: Joi.number().min(0).max(100).allow(null),
    year_of_passing: Joi.number().integer().min(1990).max(2100).allow(null),
    board: Joi.string().trim().max(100).allow('', null),
    exam_type: Joi.string().trim().max(100).allow('', null),
  }).unknown(true)),

  post_admission_records: Joi.array().items(Joi.object({
    semester: Joi.number().integer().min(1).max(8).allow(null),
    sgpa: Joi.number().min(0).max(100).allow(null),
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

  const dynamicErrors: string[] = []
  const records = ((data.past_education_records as Record<string, unknown>[]) || [])
  const admissionType = String(data.admission_type || '').trim()
  const hasHssc = records.some((record) => record.exam_name === 'HSSC')
  const hasDiploma = records.some((record) => record.exam_name === 'DIPLOMA')

  if (admissionType === 'hsc' && hasDiploma) {
    dynamicErrors.push('Diploma details are not allowed for HSC admission type')
  }

  if (admissionType === 'diploma' && hasHssc) {
    dynamicErrors.push('HSC details are not allowed for Diploma admission type')
  }

  if (!error && dynamicErrors.length === 0) {
    return { isValid: true, errors: [] as string[] }
  }

  const joiErrors = error ? error.details.map((detail) => detail.message.replace(/\"/g, '')) : []
  const errors = [...new Set([...joiErrors, ...dynamicErrors])]
  return { isValid: false, errors }
}
