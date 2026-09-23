/**
 * Mentor-safe profile validation.
 *
 * PURPOSE
 * -------
 * When a mentor edits a mentee profile, the payload includes fields that were
 * loaded directly from the database — including values that may pre-date the
 * current student-form constraints (e.g. a `specific_details` string that was
 * entered before the 200-character limit was added).
 *
 * Using the student-form Joi schema (`validateStudentProfileData`) for mentor
 * saves is wrong because it validates the *entire snapshot* — including
 * untouched legacy values — and blocks the save even when the mentor only
 * changed an unrelated field (e.g. mobile number).
 *
 * DESIGN
 * ------
 * This schema keeps every *structural* rule from the student schema:
 *   - Correct data types
 *   - Integer ranges (semester 1–8, year 1990–2100)
 *   - Pattern checks (email, phone — only where the mentor can actually edit them)
 *   - The admission-type cross-validation (no DIPLOMA record for HSC type etc.)
 *
 * It removes or relaxes the *free-text length caps* on fields whose DB column
 * is TEXT (no database-level constraint).  If the DB already accepted the
 * value, there is no reason to reject it here.  The student-form limits remain
 * in place for student self-submissions via `validateStudentProfileData`.
 *
 * WHAT IS NOT CHANGED
 * -------------------
 * - Student self-edit uses `validateStudentProfileData` as before (untouched).
 * - Backend route uses a parallel `menteeProfileSchema` (see
 *   kys-backend/middleware/validation/menteeProfileSchema.js).
 * - Authorization, profile locking, and API shape are unchanged.
 */

import Joi from 'joi'

// ---------------------------------------------------------------------------
// Primitive helpers
// ---------------------------------------------------------------------------

/** Uncapped text — used for fields stored as DB TEXT columns. */
const text = Joi.string().trim().allow('', null)

/** Fields that genuinely have a column-level VARCHAR constraint. */
const text120 = Joi.string().trim().max(120).allow('', null)

const optionalEmail = Joi.string()
  .trim()
  .max(255)
  .allow('', null)
  .pattern(/^(|n\/a|na|-|[^\s@]+@[^\s@]+\.[^\s@]+)$/i)
  .messages({ 'string.pattern.base': '{#label} must be a valid email' })

// Phone pattern kept — the mentor can edit phone numbers and should receive
// a format error if they enter a non-10-digit value.
const phoneNumber = Joi.string()
  .trim()
  .allow('', null)
  .pattern(/^\d{10}$/)
  .messages({ 'string.pattern.base': '{#label} must be a valid 10 digit phone number' })

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

const menteeProfileJoiSchema = Joi.object({
  full_name: text120,
  section: Joi.string().trim().max(10).allow('', null),
  semester: Joi.number().integer().min(1).max(8).allow(null),
  year_of_admission: Joi.number().integer().min(1990).max(2100).allow(null),
  admission_type: Joi.string().valid('hsc', 'diploma').allow('', null),

  personal_info: Joi.object({
    mobile_no:              phoneNumber,
    personal_email:         optionalEmail,
    college_email:          optionalEmail,
    father_mobile_no:       phoneNumber,
    father_email:           optionalEmail,
    mother_mobile_no:       phoneNumber,
    mother_email:           optionalEmail,
    guardian_mobile:        phoneNumber,
    guardian_email:         optionalEmail,
    emergency_contact_number: phoneNumber,
    // All other personal_info text fields are uncapped at this layer.
  }).unknown(true),

  past_education_records: Joi.array().items(
    Joi.object({
      exam_name:      Joi.string().trim().max(100).allow('', null),
      percentage:     Joi.number().min(0).max(100).allow(null),
      year_of_passing: Joi.number().integer().min(1990).max(2100).allow(null),
      board:          Joi.string().trim().max(100).allow('', null),
      exam_type:      Joi.string().trim().max(100).allow('', null),
    }).unknown(true),
  ),

  post_admission_records: Joi.array().items(
    Joi.object({
      semester:       Joi.number().integer().min(1).max(8).allow(null),
      sgpa:           Joi.number().min(0).max(10).allow(null),
      backlog_subjects: text,
      season:         Joi.string().trim().max(20).allow('', null),
      year_of_passing: Joi.number().integer().min(1990).max(2100).allow(null),
      college_rank:   Joi.string().trim().max(100).allow('', null),
      academic_awards: text,
    }).unknown(true),
  ),

  projects: Joi.array().items(
    Joi.object({
      title:       text,
      description: text,
      domain:      text,
    }).unknown(true),
  ),

  internships: Joi.array().items(
    Joi.object({
      company_name:     text,
      domain:           text,
      internship_type:  Joi.string().trim().max(20).allow('', null),
      paid_unpaid:      Joi.string().trim().max(10).allow('', null),
      start_date:       Joi.string().trim().allow('', null),
      end_date:         Joi.string().trim().allow('', null),
      designation:      Joi.string().trim().max(120).allow('', null),
      description:      text,
    }).unknown(true),
  ),

  cocurricular_participations: Joi.array().items(
    Joi.object({
      name:   text,
      date:   Joi.string().trim().allow('', null),
      level:  Joi.string().trim().max(100).allow('', null),
      awards: text,
    }).unknown(true),
  ),

  cocurricular_organizations: Joi.array().items(
    Joi.object({
      name:   text,
      date:   Joi.string().trim().allow('', null),
      level:  Joi.string().trim().max(100).allow('', null),
      remark: text,
    }).unknown(true),
  ),

  skill_programs: Joi.array().items(
    Joi.object({
      course_title:    text,
      platform:        text,
      domain:          text,
      duration_hours:  Joi.number().min(0).max(10000).allow(null),
      date_from:       Joi.string().trim().allow('', null),
      date_to:         Joi.string().trim().allow('', null),
    }).unknown(true),
  ),

  career_objective: Joi.object({
    career_goal:                    Joi.string().trim().max(120).allow('', null),
    // specific_details is TEXT in the DB — no cap here so legacy values pass.
    specific_details:               text,
    clarity_preparedness:           Joi.string().trim().max(20).allow('', null),
    interested_in_campus_placement: Joi.boolean().allow(null),
    campus_placement_reasons:       text,
    non_technical_areas:            text,
    student_mentor_interest:        Joi.string().trim().max(20).allow('', null),
    mentorship_domain:              Joi.string().trim().max(100).allow('', null),
    expectations_from_institute:    text,
    placement_type:                 Joi.string().trim().max(50).allow('', null),
    higher_studies_type:            Joi.string().trim().max(50).allow('', null),
    higher_studies_location:        Joi.string().trim().max(20).allow('', null),
  }).unknown(true),

  skills: Joi.object({
    programming_languages:             text,
    technologies_frameworks:           text,
    frontend_technologies_frameworks:  text,
    backend_technologies_databases:    text,
    domains_of_interest:               text,
    familiar_tools_platforms:          text,
    technical_soft_skills_overall:     text,
    additional_technical_skills:       text,
    additional_soft_skills:            text,
  }).unknown(true),

  swoc: Joi.object({
    strengths:     text,
    weaknesses:    text,
    opportunities: text,
    challenges:    text,
  }).unknown(true),

}).unknown(true).custom((value, helpers) => {
  // Preserve the admission-type cross-validation: this is a business rule, not
  // a length cap, and it must fire whether the editor is student or faculty.
  const admissionType = String(value.admission_type || '').trim()
  const records = Array.isArray(value.past_education_records)
    ? value.past_education_records
    : []
  const hasHssc   = records.some((r: Record<string, unknown>) => r && r.exam_name === 'HSSC')
  const hasDiploma = records.some((r: Record<string, unknown>) => r && r.exam_name === 'DIPLOMA')

  if (admissionType === 'hsc' && hasDiploma) {
    return helpers.error('any.invalid', {
      message: 'Diploma details are not allowed for HSC admission type',
    })
  }
  if (admissionType === 'diploma' && hasHssc) {
    return helpers.error('any.invalid', {
      message: 'HSC details are not allowed for Diploma admission type',
    })
  }

  return value
}, 'admission route consistency').messages({
  'any.invalid': '{{#message}}',
})

// ---------------------------------------------------------------------------
// Exported validator
// ---------------------------------------------------------------------------

export function validateMenteeProfileData(
  data: Record<string, unknown>,
  fullDraft?: Record<string, unknown>,
): {
  isValid: boolean
  errors: string[]
} {
  const dataToValidate = { ...data }
  if (fullDraft) {
    if ('admission_type' in data || 'past_education_records' in data) {
      if (!('admission_type' in dataToValidate) && fullDraft.admission_type) {
        dataToValidate.admission_type = fullDraft.admission_type
      }
      if (!('past_education_records' in dataToValidate) && fullDraft.past_education_records) {
        dataToValidate.past_education_records = fullDraft.past_education_records
      }
    }
  }

  const { error } = menteeProfileJoiSchema.validate(dataToValidate, {
    abortEarly: false,
    convert: true,
  })

  if (!error) return { isValid: true, errors: [] }

  const errors = [...new Set(
    error.details.map((d) => d.message.replace(/"/g, '')),
  )]
  return { isValid: false, errors }
}
