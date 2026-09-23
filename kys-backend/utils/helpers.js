const { DateTime } = require('luxon');

const generatePassword = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
};

const splitFullName = (fullName = '') => {
  const parts = String(fullName).trim().split(/\s+/).filter(Boolean);
  return {
    first_name: parts[0] || '',
    middle_name: parts.length > 2 ? parts.slice(1, -1).join(' ') : '',
    last_name: parts.length > 1 ? parts[parts.length - 1] : '',
  };
};

const buildFullName = (first, middle, last) => [first, middle, last].filter((v) => v && String(v).trim()).join(' ');

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;

  const asDateOnly = DateTime.fromFormat(String(dateStr), 'yyyy-MM-dd', { zone: 'utc' });
  if (asDateOnly.isValid) return asDateOnly.toJSDate();

  const asIso = DateTime.fromISO(String(dateStr).replace('Z', ''), { zone: 'utc' });
  if (asIso.isValid) return asIso.toJSDate();

  return null;
};

const serializeModel = (obj) => {
  if (!obj) return null;
  const data = obj.get ? obj.get({ plain: true }) : { ...obj };

  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value instanceof Date) data[key] = value.toISOString().split('T')[0];
  });

  // Transform photo_url to photoUrl for API consistency
  if ('photo_url' in data) {
    data.photoUrl = data.photo_url;
    delete data.photo_url;
  }
  if ('photo_preview_url' in data) {
    data.photoPreviewUrl = data.photo_preview_url;
    delete data.photo_preview_url;
  }

  return data;
};

const validatePastEducationPayload = (records = []) => {
  const examNames = records.map((r) => r.exam_name);
  if (examNames.length !== new Set(examNames).size) {
    return { valid: false, error: 'Duplicate exam_name entries are not allowed.' };
  }

  for (const record of records) {
    if (!record || typeof record !== 'object') {
      return { valid: false, error: 'Each past education record must be a valid object.' };
    }

    const examName = String(record.exam_name || '').trim();
    if (!examName) {
      return { valid: false, error: 'Each past education record must include exam_name.' };
    }
  }

  return { valid: true, error: '' };
};

/**
 * Validates the post-admission academic records for a student.
 *
 * @param {number} studentSemester - The student's current (ongoing) semester.
 * @param {Array}  records         - The post_admission_records payload to validate.
 * @param {string} [admissionType] - 'diploma' | 'hsc' | '' (default: 'hsc').
 *                                   Diploma students enter B.Tech at Semester 3, so
 *                                   Semesters 1 and 2 are not valid B.Tech records
 *                                   and the expected record count is adjusted accordingly.
 *
 * Backwards-compatible: existing callers that omit admissionType continue to work
 * as before (HSC semantics, start = 1).
 */
const validatePostAdmissionRecords = (studentSemester, records = [], admissionType = '') => {
  if (studentSemester < 1) return { valid: false, error: 'Invalid student semester.' };

  // Semester at which B.Tech academic records begin.
  // HSC / unset → 1   |   Diploma (direct second year) → 3
  const startSemester = admissionType === 'diploma' ? 3 : 1;

  // A student currently in their start semester has no completed records yet.
  if (studentSemester <= startSemester && records.length) {
    return {
      valid: false,
      error: `No post admission academic records should be present for students in semester ${studentSemester}.`,
    };
  }

  // Diploma: records for semesters [3 .. studentSemester-1], so count = studentSemester - 3.
  // HSC:     records for semesters [1 .. studentSemester-1], so count = studentSemester - 1.
  const expectedCount = Math.max(studentSemester - startSemester, 0);
  if (records.length !== expectedCount) {
    return { valid: false, error: `Expected exactly ${expectedCount} post admission academic records.` };
  }

  const semesters = records.map((r) => Number(r.semester));
  if (semesters.length !== new Set(semesters).size) {
    return { valid: false, error: 'Duplicate semester entries found.' };
  }

  // Enforce that diploma students cannot submit records for semesters 1 or 2,
  // and that no record falls at or beyond the student's current semester.
  if (semesters.some((s) => s < startSemester || s >= studentSemester)) {
    return {
      valid: false,
      error: `All semester values must be between ${startSemester} and ${studentSemester - 1}.`,
    };
  }

  return { valid: true, error: '' };
};

module.exports = {
  generatePassword,
  splitFullName,
  buildFullName,
  parseDate,
  serializeModel,
  validatePastEducationPayload,
  validatePostAdmissionRecords,
};
