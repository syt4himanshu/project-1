const Joi = require('joi');

const text200 = Joi.string().trim().max(200).allow('', null);
const text255 = Joi.string().trim().max(255).allow('', null);
const text500 = Joi.string().trim().max(500).allow('', null);
const optionalEmail = Joi.string()
  .trim()
  .max(255)
  .allow('', null)
  .pattern(/^(|n\/a|na|-|[^\s@]+@[^\s@]+\.[^\s@]+)$/i)
  .messages({
    'string.pattern.base': 'must be a valid email',
  });

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
    dob: Joi.date().iso().allow('', null),
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

  past_education_records: Joi.array().items(
    Joi.object({
      exam_name: Joi.string().trim().max(100).allow('', null),
      percentage: Joi.number().min(0).max(100).allow(null),
      year_of_passing: Joi.number().integer().min(1990).max(2100).allow(null),
      board: Joi.string().trim().max(100).allow('', null),
      exam_type: Joi.string().trim().max(100).allow('', null),
    }).unknown(true),
  ),

  post_admission_records: Joi.array().items(
    Joi.object({
      semester: Joi.number().integer().min(1).max(8).allow(null),
      sgpa: Joi.number().min(0).max(100).allow(null),
      backlog_subjects: text500,
      season: Joi.string().trim().max(20).allow('', null),
      year_of_passing: Joi.number().integer().min(1990).max(2100).allow(null),
      college_rank: Joi.string().trim().max(100).allow('', null),
      academic_awards: text255,
    }).unknown(true),
  ),

  projects: Joi.array().items(
    Joi.object({
      title: text255,
      description: text200.messages({
        'string.max': 'Project description must not exceed 200 characters',
      }),
    }).unknown(true),
  ),

  internships: Joi.array().items(
    Joi.object({
      company_name: text255,
      domain: text255,
      internship_type: Joi.string().trim().max(20).allow('', null),
      paid_unpaid: Joi.string().trim().max(10).allow('', null),
      start_date: Joi.date().iso().allow('', null),
      end_date: Joi.date().iso().allow('', null),
      designation: Joi.string().trim().max(120).allow('', null),
      description: text200.messages({
        'string.max': 'Internship description must not exceed 200 characters',
      }),
    }).unknown(true),
  ),

  cocurricular_participations: Joi.array().items(
    Joi.object({
      name: text255,
      date: Joi.date().iso().allow('', null),
      level: Joi.string().trim().max(100).allow('', null),
      awards: text255,
    }).unknown(true),
  ),

  cocurricular_organizations: Joi.array().items(
    Joi.object({
      name: text255,
      date: Joi.date().iso().allow('', null),
      level: Joi.string().trim().max(100).allow('', null),
      remark: text255,
    }).unknown(true),
  ),

  career_objective: Joi.object({
    career_goal: Joi.string().trim().max(50).allow('', null),
    specific_details: text200,
    clarity_preparedness: Joi.string().trim().max(20).allow('', null),
    interested_in_campus_placement: Joi.boolean().allow(null),
    campus_placement_reasons: text200,
    non_technical_areas: text255,
    student_mentor_interest: Joi.string().trim().max(20).allow('', null),
    expectations_from_institute: text200,
  }).unknown(true),

  skills: Joi.object({
    programming_languages: text500,
    technologies_frameworks: text500,
    domains_of_interest: text255,
    familiar_tools_platforms: text500,
    technical_soft_skills_overall: text500,
    additional_technical_skills: text500,
    additional_soft_skills: text500,
  }).unknown(true),

  swoc: Joi.object({
    strengths: text500,
    weaknesses: text500,
    opportunities: text500,
    challenges: text500,
  }).unknown(true),
}).unknown(true).custom((value, helpers) => {
  const admissionType = String(value.admission_type || '').trim();
  const records = Array.isArray(value.past_education_records) ? value.past_education_records : [];
  const hasHssc = records.some((record) => record && record.exam_name === 'HSSC');
  const hasDiploma = records.some((record) => record && record.exam_name === 'DIPLOMA');

  if (admissionType === 'hsc' && hasDiploma) {
    return helpers.error('any.invalid', { message: 'Diploma details are not allowed for HSC admission type' });
  }

  if (admissionType === 'diploma' && hasHssc) {
    return helpers.error('any.invalid', { message: 'HSC details are not allowed for Diploma admission type' });
  }

  return value;
}, 'admission route consistency').messages({
  'any.invalid': '{{#message}}',
});

module.exports = { studentProfileSchema, adminStudentMentorUpdateSchema };
