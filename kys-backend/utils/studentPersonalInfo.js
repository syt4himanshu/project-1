const { UniqueConstraintError } = require('sequelize');
const { Student, StudentPersonalInfo, User } = require('../models');
const logger = require('./logger');

const INCOMPLETE_PROFILE_MESSAGE = 'Student personal profile incomplete. Please update profile first.';

const REQUIRED_PERSONAL_INFO_FIELDS = [
  'mobile_no',
  'personal_email',
  'college_email',
  'linked_in_id',
  'permanent_address',
  'dob',
  'gender',
  'father_name',
  'father_mobile_no',
  'father_occupation',
  'mother_name',
  'mother_mobile_no',
  'mother_occupation',
  'emergency_contact_name',
  'emergency_contact_number',
];

const createControlledError = ({ message, statusCode, code, details }) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.details = details;
  return error;
};

const isPresent = (value) => value !== null && value !== undefined && String(value).trim() !== '';

const pickFirstPresent = (...values) => values.find(isPresent);

const buildCandidatePersonalInfo = ({ student, user }) => ({
  student_id: student.id,
  mobile_no: pickFirstPresent(student.mobile_no, student.contact_number, user.mobile_no),
  personal_email: pickFirstPresent(student.personal_email, user.email),
  college_email: pickFirstPresent(student.college_email, user.email),
  linked_in_id: pickFirstPresent(student.linked_in_id),
  permanent_address: pickFirstPresent(student.permanent_address, student.present_address),
  dob: pickFirstPresent(student.dob),
  gender: pickFirstPresent(student.gender),
  father_name: pickFirstPresent(student.father_name),
  father_mobile_no: pickFirstPresent(student.father_mobile_no),
  father_occupation: pickFirstPresent(student.father_occupation),
  mother_name: pickFirstPresent(student.mother_name),
  mother_mobile_no: pickFirstPresent(student.mother_mobile_no),
  mother_occupation: pickFirstPresent(student.mother_occupation),
  emergency_contact_name: pickFirstPresent(student.emergency_contact_name, student.father_name, student.mother_name),
  emergency_contact_number: pickFirstPresent(
    student.emergency_contact_number,
    student.father_mobile_no,
    student.mother_mobile_no,
  ),
});

const ensureStudentPersonalInfo = async (studentId) => {
  if (!Number.isInteger(Number(studentId)) || Number(studentId) <= 0) {
    throw createControlledError({
      message: 'Invalid student id',
      statusCode: 400,
      code: 'INVALID_STUDENT_ID',
      details: ['studentId'],
    });
  }

  const existing = await StudentPersonalInfo.findOne({ where: { student_id: Number(studentId) } });
  if (existing) return existing;

  const student = await Student.findByPk(Number(studentId), {
    include: [{ model: User, as: 'user', required: false }],
  });

  if (!student) {
    throw createControlledError({
      message: 'Student profile not found',
      statusCode: 404,
      code: 'STUDENT_NOT_FOUND',
      details: ['student'],
    });
  }

  const payload = buildCandidatePersonalInfo({
    student: student.get({ plain: true }),
    user: student.user ? student.user.get({ plain: true }) : {},
  });
  const missingFields = REQUIRED_PERSONAL_INFO_FIELDS.filter((field) => !isPresent(payload[field]));

  if (missingFields.length > 0) {
    logger.warn({
      message: 'Cannot auto-create student_personal_info due to missing required fields',
      studentId: Number(studentId),
      missingFields,
    });
    throw createControlledError({
      message: INCOMPLETE_PROFILE_MESSAGE,
      statusCode: 400,
      code: 'STUDENT_PERSONAL_INFO_INCOMPLETE',
      details: missingFields,
    });
  }

  try {
    return await StudentPersonalInfo.create(payload);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      const afterRace = await StudentPersonalInfo.findOne({ where: { student_id: Number(studentId) } });
      if (afterRace) return afterRace;
    }

    logger.error({
      message: 'Failed to create student_personal_info',
      studentId: Number(studentId),
      error: error.message,
    });
    throw error;
  }
};

const isControlledProfileError = (error) =>
  Boolean(error?.code) && ['INVALID_STUDENT_ID', 'STUDENT_NOT_FOUND', 'STUDENT_PERSONAL_INFO_INCOMPLETE'].includes(error.code);

module.exports = {
  ensureStudentPersonalInfo,
  isControlledProfileError,
  INCOMPLETE_PROFILE_MESSAGE,
};
