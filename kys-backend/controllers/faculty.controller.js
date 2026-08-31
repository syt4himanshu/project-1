const { sequelize, Faculty, Student, MentoringMinute } = require('../models');
const { serializeModel } = require('../utils/helpers');
const { serializeStudent } = require('../utils/serializers');
const {
  MAX_STUDENTS,
  getFacultyByUserId,
  resolveAuthorizedStudentIds,
  getSanitizedStudentDataset,
} = require('../models/facultyChatbot.model');
const { generateFacultyInsights, groqCircuitBreaker } = require('../services/groq.service');
const { sendResponse } = require('../utils/responseWrapper');
const logger = require('../utils/logger');
const {
  logFacultyChatbotControllerStart,
  logFacultyChatbotControllerSuccess,
  logFacultyChatbotControllerError,
} = require('../utils/aiRequestLogger');
const { getMenteesCache, setMenteesCache, invalidateMenteesCache } = require('../utils/facultyMenteesCache');
const { applyStudentProfileUpdate } = require('../utils/studentProfileUpdate');

const includeAll = [
  'personal_info',
  'past_education_records',
  'post_admission_records',
  'projects',
  'internships',
  'cocurricular_participations',
  'cocurricular_organizations',
  'career_objective',
  'skills',
  'swoc',
];

const getMyFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });
    if (!faculty) return sendResponse(res, { success: false, status: 404, error: 'Faculty profile not found' });

    return sendResponse(res, {
      success: true,
      data: {
        first_name: faculty.first_name,
        last_name: faculty.last_name,
        email: faculty.email,
        contact_number: faculty.contact_number,
      }
    });
  } catch (error) {
    logger.error({ reqId: req.id, message: error.message, stack: error.stack });
    return next(error);
  }
};

const updateMyFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });
    if (!faculty) return sendResponse(res, { success: false, status: 404, error: 'Faculty profile not found' });

    const data = req.body || {};
    ['first_name', 'last_name', 'contact_number'].forEach((field) => {
      if (field in data) faculty[field] = data[field];
    });

    await faculty.save();
    return sendResponse(res, { success: true, data: { message: 'Profile updated successfully' } });
  } catch (error) {
    logger.error({ reqId: req.id, message: error.message, stack: error.stack });
    return next(error);
  }
};

const getMyMentees = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });

    if (!faculty) return sendResponse(res, { success: false, status: 404, error: 'Faculty profile not found' });

    const cachedData = getMenteesCache(faculty.id, limit, offset);
    if (cachedData) {
      logger.info({ reqId: req.id, message: 'Serving mentees from cache', facultyId: faculty.id });
      return sendResponse(res, { success: true, data: cachedData });
    }

    const mentees = await Student.findAll({
      where: { mentor_id: faculty.id },
      include: includeAll,
      order: [['id', 'ASC']],
      limit,
      offset
    });

    const data = mentees.map((s) => ({ id: s.id, first_name: s.first_name, middle_name: s.middle_name, last_name: s.last_name, ...serializeStudent(s) }));
    setMenteesCache(faculty.id, limit, offset, data);

    return sendResponse(res, { success: true, data });
  } catch (error) {
    logger.error({ reqId: req.id, message: error.message, stack: error.stack });
    return next(error);
  }
};

const addMentoringMinute = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });
    if (!faculty) return sendResponse(res, { success: false, status: 404, error: 'Faculty profile not found' });

    const student = await Student.findOne({ where: { uid: req.params.uid, mentor_id: faculty.id } });
    if (!student) return sendResponse(res, { success: false, status: 404, error: 'Mentee not found or not assigned to this faculty' });

    const { remarks, mentor_remarks, issues, suggestion, action } = req.body || {};

    try {
      const payload = {
        student_id: student.id,
        faculty_id: faculty.id,
        faculty_name_snapshot: [faculty.first_name, faculty.last_name].filter(Boolean).join(' ').trim() || null,
        faculty_email_snapshot: faculty.email || null,
        semester: student.semester,
        date: new Date(),
        remarks,
        mentor_remarks,
        issues,
        suggestion,
        action,
      };

      try {
        await MentoringMinute.create(payload);
      } catch (createError) {
        const message = String(createError?.message || '');
        if (/faculty_name_snapshot|faculty_email_snapshot|column .* does not exist/i.test(message)) {
          const legacyPayload = { ...payload };
          delete legacyPayload.faculty_name_snapshot;
          delete legacyPayload.faculty_email_snapshot;
          await MentoringMinute.create(legacyPayload);
        } else {
          throw createError;
        }
      }
      return sendResponse(res, { success: true, status: 201, data: { message: 'Mentoring minute added successfully.' } });
    } catch (_error) {
      return sendResponse(res, { success: false, status: 500, error: 'Database error while saving mentoring minute' });
    }
  } catch (error) {
    logger.error({ reqId: req.id, message: error.message, stack: error.stack });
    return next(error);
  }
};

const getMenteeMentoringMinutes = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;

    const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });
    if (!faculty) return sendResponse(res, { success: false, status: 404, error: 'Faculty profile not found' });

    const student = await Student.findOne({ where: { uid: req.params.uid, mentor_id: faculty.id } });
    if (!student) return sendResponse(res, { success: false, status: 404, error: 'Mentee not found or not assigned to this faculty' });

    const minutes = await MentoringMinute.findAll({
      where: { student_id: student.id },
      attributes: ['id', 'student_id', 'faculty_id', 'semester', 'date', 'remarks', 'mentor_remarks', 'issues', 'suggestion', 'action'],
      order: [['date', 'DESC']],
      limit,
      offset
    });

    const result = minutes.map((m) => ({
      id: m.id,
      semester: m.semester,
      date: m.date,
      remarks: m.remarks,
      mentor_remarks: m.mentor_remarks,
      issues: m.issues,
      suggestion: m.suggestion,
      action: m.action,
      created_by_faculty: Number(m.faculty_id) === Number(faculty.id),
    }));

    return sendResponse(res, {
      success: true,
      data: {
        student: {
          uid: student.uid,
          full_name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
          semester: student.semester,
          section: student.section,
          year_of_admission: student.year_of_admission,
        },
        mentoring_minutes: result,
      }
    });
  } catch (error) {
    logger.error({ reqId: req.id, message: error.message, stack: error.stack });
    return next(error);
  }
};

const getMenteeByUid = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });
    if (!faculty) return sendResponse(res, { success: false, status: 404, error: 'Faculty profile not found' });

    const student = await Student.findOne({ where: { uid: req.params.uid, mentor_id: faculty.id }, include: includeAll });
    if (!student) return sendResponse(res, { success: false, status: 404, error: 'Mentee not found or not assigned to this faculty' });

    return sendResponse(res, {
      success: true,
      data: {
        id: student.id,
        uid: student.uid,
        first_name: student.first_name,
        middle_name: student.middle_name,
        last_name: student.last_name,
        full_name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
        semester: student.semester,
        section: student.section,
        year_of_admission: student.year_of_admission,
        mentor_id: student.mentor_id,
        ...serializeStudent(student),
      }
    });
  } catch (error) {
    logger.error({ reqId: req.id, message: error.message, stack: error.stack });
    return next(error);
  }
};

const sanitizeFacultyQuery = (input) => {
  if (typeof input !== 'string') return '';
  return input.replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 2000);
};

const facultyChatbot = async (req, res) => {
  try {
    const query = sanitizeFacultyQuery(req.body?.query);
    const studentId = typeof req.body?.studentId === 'string' ? req.body.studentId.trim().slice(0, 32) : '';

    // Sanitize conversation history — accept an array of {role, content} turns
    const rawHistory = Array.isArray(req.body?.conversationHistory) ? req.body.conversationHistory : [];
    const conversationHistory = rawHistory
      .filter(turn => (turn.role === 'user' || turn.role === 'assistant') && typeof turn.content === 'string' && turn.content.trim())
      .map(turn => ({ role: turn.role, content: String(turn.content).slice(0, 4000) }))
      .slice(-12); // max 6 exchanges

    if (!query) {
      return sendResponse(res, { success: false, status: 400, error: 'Query must contain visible text' });
    }

    const faculty = await getFacultyByUserId(req.currentUser.id);
    if (!faculty) return sendResponse(res, { success: false, status: 404, error: 'Faculty profile not found' });

    const authorizedStudentIds = await resolveAuthorizedStudentIds({ facultyId: faculty.id, studentId });

    if (studentId && !authorizedStudentIds.length) {
      return sendResponse(res, { success: false, status: 403, error: 'Forbidden: Student is not assigned to this faculty' });
    }

    if (!authorizedStudentIds.length) {
      return sendResponse(res, { success: false, status: 404, error: 'No assigned students found for this faculty' });
    }

    const sanitizedStudentData = await getSanitizedStudentDataset(authorizedStudentIds);

    if (!sanitizedStudentData.length) {
      return sendResponse(res, { success: false, status: 404, error: 'No student data found for chatbot insights' });
    }

    const studentDataset = {
      total_students: sanitizedStudentData.length,
      student_limit: MAX_STUDENTS,
      students: sanitizedStudentData,
    };

    logFacultyChatbotControllerStart(req.id, {
      queryLength: query.length,
      studentIdPresent: Boolean(studentId),
      conversationHistoryTurns: conversationHistory.length,
      studentDataset,
    });

    const response = await generateFacultyInsights({
      facultyQuery: query,
      studentDataset,
      mode: 'insights',
      conversationHistory,
    }, req.id);

    logFacultyChatbotControllerSuccess(req.id, {
      responseLength: response?.length ?? 0,
      circuitBreaker: groqCircuitBreaker,
    });

    return sendResponse(res, { success: true, data: { response } });
  } catch (error) {
    logFacultyChatbotControllerError(req.id, error, groqCircuitBreaker);
    return sendResponse(res, { success: false, status: 500, error: error.message || 'Unknown error' });
  }
};

const lockMenteeProfile = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });
    if (!faculty) return sendResponse(res, { success: false, status: 404, error: 'Faculty profile not found' });

    const student = await Student.findOne({ where: { uid: req.params.uid, mentor_id: faculty.id } });
    if (!student) return sendResponse(res, { success: false, status: 404, error: 'Mentee not found or not assigned to this faculty' });

    student.is_profile_locked = true;
    student.profile_locked_at = new Date();
    student.profile_locked_by = faculty.id;
    await student.save();

    invalidateMenteesCache(faculty.id);

    return sendResponse(res, {
      success: true,
      data: {
        uid: student.uid,
        is_profile_locked: student.is_profile_locked,
        profile_locked_at: student.profile_locked_at,
        profile_locked_by: student.profile_locked_by,
        message: 'Mentee profile locked successfully.',
      },
    });
  } catch (error) {
    logger.error({ reqId: req.id, message: error.message, stack: error.stack });
    return next(error);
  }
};

const unlockMenteeProfile = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });
    if (!faculty) return sendResponse(res, { success: false, status: 404, error: 'Faculty profile not found' });

    const student = await Student.findOne({ where: { uid: req.params.uid, mentor_id: faculty.id } });
    if (!student) return sendResponse(res, { success: false, status: 404, error: 'Mentee not found or not assigned to this faculty' });

    student.is_profile_locked = false;
    student.profile_locked_at = null;
    student.profile_locked_by = null;
    await student.save();

    invalidateMenteesCache(faculty.id);

    return sendResponse(res, {
      success: true,
      data: {
        uid: student.uid,
        is_profile_locked: student.is_profile_locked,
        profile_locked_at: student.profile_locked_at,
        profile_locked_by: student.profile_locked_by,
        message: 'Mentee profile unlocked successfully.',
      },
    });
  } catch (error) {
    logger.error({ reqId: req.id, message: error.message, stack: error.stack });
    return next(error);
  }
};

const updateMenteeProfileByFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });
    if (!faculty) return sendResponse(res, { success: false, status: 404, error: 'Faculty profile not found' });

    const student = await Student.findOne({ where: { uid: req.params.uid, mentor_id: faculty.id }, include: includeAll });
    if (!student) return sendResponse(res, { success: false, status: 404, error: 'Mentee not found or not assigned to this faculty' });

    const tx = await sequelize.transaction();
    try {
      const updateResult = await applyStudentProfileUpdate(student, req.body || {}, tx);
      if (!updateResult.ok) {
        await tx.rollback();
        return sendResponse(res, { success: false, status: updateResult.status || 400, error: updateResult.error });
      }

      await tx.commit();
      invalidateMenteesCache(faculty.id);

      const updatedStudent = await Student.findOne({ where: { id: student.id }, include: includeAll });
      return sendResponse(res, {
        success: true,
        data: {
          message: 'Mentee profile updated successfully.',
          student: serializeStudent(updatedStudent, { includeIds: true }),
        },
      });
    } catch (_error) {
      await tx.rollback();
      const status = _error?.statusCode && Number.isInteger(_error.statusCode) ? _error.statusCode : 500;
      const errorMessage = typeof _error?.message === 'string' && _error.message.trim()
        ? _error.message
        : 'Failed to update mentee profile';
      return sendResponse(res, { success: false, status, error: errorMessage });
    }
  } catch (error) {
    logger.error({ reqId: req.id, message: error.message, stack: error.stack });
    return next(error);
  }
};

module.exports = {
  getMyFaculty,
  updateMyFaculty,
  getMyMentees,
  getMenteeByUid,
  addMentoringMinute,
  getMenteeMentoringMinutes,
  facultyChatbot,
  lockMenteeProfile,
  unlockMenteeProfile,
  updateMenteeProfileByFaculty,
};
