const {
  StudentPersonalInfo,
  PastEducation,
  PostAdmissionAcademicRecord,
  Project,
  Internship,
  CoCurricularParticipation,
  CoCurricularOrganization,
  CareerObjective,
  Skills,
  SWOC,
} = require('../models');
const {
  splitFullName,
  parseDate,
  validatePastEducationPayload,
  validatePostAdmissionRecords,
} = require('./helpers');
const { encodeStudentProfilePayload } = require('./profileCodec');
const { ensureStudentPersonalInfo } = require('./studentPersonalInfo');

const parseDatesInPayload = (payload) => {
  if (!payload || typeof payload !== 'object') return payload;
  Object.entries(payload).forEach(([key, value]) => {
    if ((key.includes('date') || key.includes('dob')) && !['year_of_passing', 'year_of_admission'].includes(key)) {
      payload[key] = parseDate(value);
    }
  });
  return payload;
};

const stripManagedPhotoFields = (payload) => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return payload;
  const sanitized = { ...payload };
  delete sanitized.photoUrl;
  delete sanitized.photo_url;
  delete sanitized.photo_public_id;
  delete sanitized.photoPreviewUrl;
  delete sanitized.photo_preview_url;
  return sanitized;
};

/**
 * Applies a full or partial student profile payload update within a database transaction.
 * Does NOT alter `is_profile_locked`, `profile_locked_at`, or `profile_locked_by`.
 *
 * @param {object} student - The Sequelize Student model instance
 * @param {object} rawData - Incoming request body
 * @param {object} tx - Active Sequelize transaction
 * @returns {Promise<{ok: boolean, status?: number, error?: string}>}
 */
const applyStudentProfileUpdate = async (student, rawData = {}, tx) => {
  const data = encodeStudentProfilePayload(rawData);
  if (!Object.keys(data).length) {
    return { ok: false, status: 400, error: 'No data provided' };
  }

  if ('full_name' in rawData) {
    const names = splitFullName(rawData.full_name || '');
    student.first_name = names.first_name;
    student.middle_name = names.middle_name;
    student.last_name = names.last_name;
  }
  if ('semester' in data) student.semester = data.semester;
  if ('section' in data) student.section = data.section;
  if ('year_of_admission' in data) student.year_of_admission = data.year_of_admission;

  await student.save({ transaction: tx });

  if (Object.prototype.hasOwnProperty.call(data, 'past_education_records')) {
    const peValidation = validatePastEducationPayload(data.past_education_records || []);
    if (!peValidation.valid) {
      return { ok: false, status: 400, error: peValidation.error };
    }
  }

  if (Object.prototype.hasOwnProperty.call(data, 'post_admission_records')) {
    const paValidation = validatePostAdmissionRecords(
      Number(student.semester || 0),
      data.post_admission_records || [],
    );
    if (!paValidation.valid) {
      return { ok: false, status: 400, error: paValidation.error };
    }
  }

  const modelMappings = {
    personal_info: [StudentPersonalInfo, 'personal_info'],
    past_education_records: [PastEducation, 'past_education_records'],
    post_admission_records: [PostAdmissionAcademicRecord, 'post_admission_records'],
    projects: [Project, 'projects'],
    internships: [Internship, 'internships'],
    cocurricular_participations: [CoCurricularParticipation, 'cocurricular_participations'],
    cocurricular_organizations: [CoCurricularOrganization, 'cocurricular_organizations'],
    career_objective: [CareerObjective, 'career_objective'],
    skills: [Skills, 'skills'],
    swoc: [SWOC, 'swoc'],
  };

  for (const [dataKey, [modelClass, relName]] of Object.entries(modelMappings)) {
    if (!(dataKey in data)) continue;
    let relPayload = data[dataKey];
    if (relPayload == null) continue;

    if (dataKey === 'past_education_records' && Array.isArray(relPayload)) {
      relPayload = relPayload.filter(
        (r) => r.exam_name && r.percentage !== null && r.percentage !== '' && r.year_of_passing !== null,
      );
    }

    if (dataKey === 'personal_info') {
      relPayload = stripManagedPhotoFields(relPayload);
      if (!Object.keys(relPayload || {}).length) continue;
    }

    if (Array.isArray(relPayload)) {
      for (const item of relPayload) parseDatesInPayload(item);
    } else {
      parseDatesInPayload(relPayload);
    }

    if (['personal_info', 'career_objective', 'skills', 'swoc'].includes(relName)) {
      let existing = student[relName];
      if (!existing) {
        existing = await modelClass.findOne({ where: { student_id: student.id }, transaction: tx });
      }

      if (existing) {
        await existing.update(relPayload, { transaction: tx });
      } else {
        await modelClass.create({ ...relPayload, student_id: student.id }, { transaction: tx });
      }
    } else {
      await modelClass.destroy({ where: { student_id: student.id }, transaction: tx });
      if (Array.isArray(relPayload)) {
        for (const item of relPayload) {
          await modelClass.create({ ...item, student_id: student.id }, { transaction: tx });
        }
      }
    }
  }

  return { ok: true };
};

module.exports = {
  applyStudentProfileUpdate,
  parseDatesInPayload,
  stripManagedPhotoFields,
};
