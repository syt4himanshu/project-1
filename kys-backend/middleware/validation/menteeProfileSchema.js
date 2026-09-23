/**
 * Mentor-safe Joi validation schema for PUT /faculty/me/mentees/:uid/profile
 *
 * PURPOSE
 * -------
 * The student route uses `studentProfileSchema` which enforces strict string
 * length caps (max 200 / 255 / 500) on free-text fields.  Those limits are
 * correct for new student submissions but will reject pre-existing database
 * values that were stored before the limits were tightened.
 *
 * When a mentor edits a mentee profile the entire payload snapshot is sent,
 * including untouched DB values.  Validating that snapshot with the student
 * schema blocks the save even when the mentor only changed an unrelated field.
 *
 * This schema keeps every *structural* rule:
 *   - Correct JS types (string / number / boolean / array)
 *   - Integer ranges  (semester 1-8, year 1990-2100, sgpa 0-10)
 *   - Pattern checks  (email format)
 *   - Admission-type cross-validation  (no DIPLOMA + HSC mixed)
 *
 * It removes the application-level string length caps on fields whose DB
 * column is TEXT (no database-level constraint).  The DB already accepted the
 * value; there is no reason to reject it at the Joi layer.
 *
 * What is NOT changed
 * -------------------
 * - `studentProfileSchema` is not modified — student self-edit is unaffected.
 * - Authorization, profile locking, and mentor-ownership checks are unchanged.
 * - The `validate()` middleware interface is unchanged.
 */

'use strict';

const Joi = require('joi');

// Uncapped text — for DB TEXT columns with no column-level constraint.
const text = Joi.string().trim().allow('', null);

// Fields that genuinely have a column-level VARCHAR constraint.
const text120 = Joi.string().trim().max(120).allow('', null);

const optionalEmail = Joi.string()
  .trim()
  .max(255)
  .allow('', null)
  .pattern(/^(|n\/a|na|-|[^\s@]+@[^\s@]+\.[^\s@]+)$/i)
  .messages({ 'string.pattern.base': 'must be a valid email' });

const menteeProfileSchema = Joi.object({
  full_name:         text120,
  section:           Joi.string().trim().max(10).allow('', null),
  semester:          Joi.number().integer().min(1).max(8).allow(null),
  year_of_admission: Joi.number().integer().min(1990).max(2100).allow(null),
  admission_type:    Joi.string().valid('hsc', 'diploma').allow('', null),

  personal_info: Joi.object({
    mobile_no:                Joi.string().trim().max(20).allow('', null),
    personal_email:           optionalEmail,
    college_email:            optionalEmail,
    linked_in_id:             Joi.string().trim().max(255).allow('', null),
    permanent_address:        text,
    present_address:          text,
    dob:                      Joi.alternatives().try(
                                Joi.date().iso(),
                                Joi.string().trim().allow('', null),
                              ).allow(null),
    gender:                   Joi.string().trim().max(20).allow('', null),
    father_name:              text120,
    father_mobile_no:         Joi.string().trim().max(20).allow('', null),
    father_email:             optionalEmail,
    father_occupation:        Joi.string().trim().max(255).allow('', null),
    mother_name:              text120,
    mother_mobile_no:         Joi.string().trim().max(20).allow('', null),
    mother_email:             optionalEmail,
    mother_occupation:        Joi.string().trim().max(255).allow('', null),
    blood_group:              Joi.string().trim().max(5).allow('', null),
    category:                 Joi.string().trim().max(20).allow('', null),
    aadhar_number:            Joi.string().trim().max(14).allow('', null),
    mis_uid:                  Joi.string().trim().max(50).allow('', null),
    github_id:                Joi.string().trim().max(255).allow('', null),
    guardian_name:            text120,
    guardian_mobile:          Joi.string().trim().max(20).allow('', null),
    guardian_email:           optionalEmail,
    emergency_contact_name:   text120,
    emergency_contact_number: Joi.string().trim().max(20).allow('', null),
  }).unknown(true),

  past_education_records: Joi.array().items(
    Joi.object({
      exam_name:       Joi.string().trim().max(100).allow('', null),
      percentage:      Joi.number().min(0).max(100).allow(null),
      year_of_passing: Joi.number().integer().min(1990).max(2100).allow(null),
      board:           Joi.string().trim().max(100).allow('', null),
      exam_type:       Joi.string().trim().max(100).allow('', null),
    }).unknown(true),
  ),

  post_admission_records: Joi.array().items(
    Joi.object({
      semester:        Joi.number().integer().min(1).max(8).allow(null),
      sgpa:            Joi.number().min(0).max(10).allow(null),
      backlog_subjects: text,
      season:          Joi.string().trim().max(20).allow('', null),
      year_of_passing: Joi.number().integer().min(1990).max(2100).allow(null),
      college_rank:    Joi.string().trim().max(100).allow('', null),
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
      company_name:    text,
      domain:          text,
      internship_type: Joi.string().trim().max(20).allow('', null),
      paid_unpaid:     Joi.string().trim().max(10).allow('', null),
      // Dates arrive as ISO strings from the frontend; accept both forms.
      start_date: Joi.alternatives().try(
        Joi.date().iso(),
        Joi.string().trim().allow('', null),
      ).allow(null),
      end_date: Joi.alternatives().try(
        Joi.date().iso(),
        Joi.string().trim().allow('', null),
      ).allow(null),
      designation:     Joi.string().trim().max(120).allow('', null),
      description:     text,
    }).unknown(true),
  ),

  cocurricular_participations: Joi.array().items(
    Joi.object({
      name:   text,
      date:   Joi.alternatives().try(
                Joi.date().iso(),
                Joi.string().trim().allow('', null),
              ).allow(null),
      level:  Joi.string().trim().max(100).allow('', null),
      awards: text,
    }).unknown(true),
  ),

  cocurricular_organizations: Joi.array().items(
    Joi.object({
      name:   text,
      date:   Joi.alternatives().try(
                Joi.date().iso(),
                Joi.string().trim().allow('', null),
              ).allow(null),
      level:  Joi.string().trim().max(100).allow('', null),
      remark: text,
    }).unknown(true),
  ),

  skill_programs: Joi.array().items(
    Joi.object({
      course_title:   text,
      platform:       text,
      domain:         text,
      duration_hours: Joi.number().min(0).max(10000).allow(null),
      date_from:      Joi.string().trim().allow('', null),
      date_to:        Joi.string().trim().allow('', null),
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
    programming_languages:            text,
    technologies_frameworks:          text,
    frontend_technologies_frameworks: text,
    backend_technologies_databases:   text,
    domains_of_interest:              text,
    familiar_tools_platforms:         text,
    technical_soft_skills_overall:    text,
    additional_technical_skills:      text,
    additional_soft_skills:           text,
  }).unknown(true),

  swoc: Joi.object({
    strengths:     text,
    weaknesses:    text,
    opportunities: text,
    challenges:    text,
  }).unknown(true),

}).unknown(true).custom((value, helpers) => {
  // Preserve the admission-type cross-validation — this is a business rule,
  // not a length cap, and it must apply on both student and faculty saves.
  const admissionType = String(value.admission_type || '').trim();
  const records = Array.isArray(value.past_education_records)
    ? value.past_education_records
    : [];
  const hasHssc   = records.some((r) => r && r.exam_name === 'HSSC');
  const hasDiploma = records.some((r) => r && r.exam_name === 'DIPLOMA');

  if (admissionType === 'hsc' && hasDiploma) {
    return helpers.error('any.invalid', {
      message: 'Diploma details are not allowed for HSC admission type',
    });
  }
  if (admissionType === 'diploma' && hasHssc) {
    return helpers.error('any.invalid', {
      message: 'HSC details are not allowed for Diploma admission type',
    });
  }

  return value;
}, 'admission route consistency').messages({
  'any.invalid': '{{#message}}',
});

module.exports = { menteeProfileSchema };
