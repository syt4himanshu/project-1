const { Faculty, Student, MentoringMinute } = require('../models');
const { serializeModel } = require('../utils/helpers');
const { serializeStudent } = require('../utils/serializers');
const {
  MAX_STUDENTS,
  getFacultyByUserId,
  resolveAuthorizedStudentIds,
  getSanitizedStudentDataset,
} = require('../models/facultyChatbot.model');
const { generateFacultyInsights } = require('../services/groq.service');
const { sendResponse } = require('../utils/responseWrapper');
const logger = require('../utils/logger');

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

const cache = new Map();
const CACHE_TTL = 60 * 1000;
const setCache = (key, data) => cache.set(key, { data, expiry: Date.now() + CACHE_TTL });
const getCache = (key) => {
  const item = cache.get(key);
  if (item && item.expiry > Date.now()) return item.data;
  if (item) cache.delete(key);
  return null;
};

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

    const cacheKey = `mentees_${faculty.id}_${limit}_${offset}`;
    const cachedData = getCache(cacheKey);
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
    setCache(cacheKey, data);

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

    const { remarks, suggestion, action } = req.body || {};

    try {
      await MentoringMinute.create({
        student_id: student.id,
        faculty_id: faculty.id,
        semester: student.semester,
        date: new Date(),
        remarks,
        suggestion,
        action,
      });
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
      order: [['date', 'DESC']],
      limit,
      offset
    });
    
    const result = minutes.map((m) => ({
      id: m.id,
      semester: m.semester,
      date: m.date,
      remarks: m.remarks,
      suggestion: m.suggestion,
      action: m.action,
      created_by_faculty: m.faculty_id === faculty.id,
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
    logger.info({ reqId: req.id, message: "Chatbot Request Initiated", queryLength: req.body?.query?.length, studentId: req.body?.studentId });
    const query = sanitizeFacultyQuery(req.body?.query);
    const studentId = typeof req.body?.studentId === 'string' ? req.body.studentId.trim().slice(0, 32) : '';
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

    const response = await generateFacultyInsights({
      facultyQuery: query,
      studentDataset: {
        total_students: sanitizedStudentData.length,
        student_limit: MAX_STUDENTS,
        students: sanitizedStudentData,
      },
    }, req.id);

    return sendResponse(res, { success: true, data: { response } });
  } catch (error) {
    logger.error({ reqId: req.id, message: 'POST /api/faculty/chatbot failed', details: error.message });
    return sendResponse(res, { success: false, status: 500, error: error.message || 'Unknown error' });
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
};
