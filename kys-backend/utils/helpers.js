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

    const percentage = record.percentage;
    const yearOfPassing = record.year_of_passing;
    const hasPercentage = percentage !== null && percentage !== undefined && String(percentage).trim() !== '';
    const hasYearOfPassing = yearOfPassing !== null && yearOfPassing !== undefined && String(yearOfPassing).trim() !== '';

    if (!hasPercentage) {
      return { valid: false, error: `Percentage / Grade is required for ${examName}.` };
    }

    if (!hasYearOfPassing) {
      return { valid: false, error: `Year of Passing is required for ${examName}.` };
    }

    if (examName === 'ENTRANCE_EXAM') {
      const examType = String(record.exam_type || '').trim();
      if (!examType) {
        return { valid: false, error: 'Entrance Exam Type is required for ENTRANCE_EXAM.' };
      }
    }
  }

  return { valid: true, error: '' };
};

const validatePostAdmissionRecords = (studentSemester, records = []) => {
  if (studentSemester < 1) return { valid: false, error: 'Invalid student semester.' };
  if (studentSemester === 1 && records.length) {
    return { valid: false, error: 'No post admission academic records should be present for students in semester 1.' };
  }

  const expectedCount = studentSemester - 1;
  if (records.length !== expectedCount) {
    return { valid: false, error: `Expected exactly ${expectedCount} post admission academic records.` };
  }

  const semesters = records.map((r) => Number(r.semester));
  if (semesters.length !== new Set(semesters).size) {
    return { valid: false, error: 'Duplicate semester entries found.' };
  }

  if (semesters.some((s) => s < 1 || s >= studentSemester)) {
    return { valid: false, error: `All semester values must be between 1 and ${studentSemester - 1}.` };
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
