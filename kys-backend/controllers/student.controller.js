const cloudinary = require('cloudinary').v2;
const { Op } = require('sequelize');
const {
  sequelize,
  Student,
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
  MentoringMinute,
  Faculty,
} = require('../models');
const {
  splitFullName,
  parseDate,
  serializeModel,
  validatePastEducationPayload,
  validatePostAdmissionRecords,
} = require('../utils/helpers');
const { serializeStudent, serializeStudentSummary } = require('../utils/serializers');
const { sendResponse } = require('../utils/responseWrapper');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

const buildStudentSearchWhere = (query = {}) => {
  const where = {};
  if (query.semester) where.semester = query.semester;
  if (query.section) where.section = query.section;
  if (query.year_of_admission) where.year_of_admission = query.year_of_admission;
  if (query.uid) where.uid = query.uid;

  const search = String(query.search || query.name || '').trim();
  if (search) {
    where[Op.or] = [
      { uid: { [Op.iLike]: `%${search}%` } },
      { first_name: { [Op.iLike]: `%${search}%` } },
      { middle_name: { [Op.iLike]: `%${search}%` } },
      { last_name: { [Op.iLike]: `%${search}%` } },
    ];
  }

  return where;
};

const buildStudentIncludes = ({ summary = false, domain = '', careerGoal = '' } = {}) => {
  const trimmedDomain = String(domain || '').trim();
  const trimmedCareerGoal = String(careerGoal || '').trim();

  return [
    { model: Faculty, as: 'mentor', attributes: ['id', 'first_name', 'last_name', 'email'], required: false },
    !summary ? { model: StudentPersonalInfo, as: 'personal_info', required: false } : null,
    !summary ? { model: PastEducation, as: 'past_education_records', required: false } : null,
    !summary ? { model: PostAdmissionAcademicRecord, as: 'post_admission_records', required: false } : null,
    !summary ? { model: Project, as: 'projects', required: false } : null,
    !summary ? { model: Internship, as: 'internships', required: false } : null,
    !summary ? { model: CoCurricularParticipation, as: 'cocurricular_participations', required: false } : null,
    !summary ? { model: CoCurricularOrganization, as: 'cocurricular_organizations', required: false } : null,
    {
      model: CareerObjective,
      as: 'career_objective',
      required: Boolean(trimmedCareerGoal),
      ...(trimmedCareerGoal ? { where: { career_goal: trimmedCareerGoal } } : {}),
    },
    {
      model: Skills,
      as: 'skills',
      required: Boolean(trimmedDomain),
      ...(trimmedDomain
        ? {
            where: {
              domains_of_interest: { [Op.iLike]: `%${trimmedDomain}%` },
            },
          }
        : {}),
    },
    !summary ? { model: SWOC, as: 'swoc', required: false } : null,
  ].filter(Boolean);
};

const parseDatesInPayload = (payload) => {
  if (!payload || typeof payload !== 'object') return payload;
  Object.entries(payload).forEach(([key, value]) => {
    if ((key.includes('date') || key.includes('dob')) && !['year_of_passing', 'year_of_admission'].includes(key)) {
      payload[key] = parseDate(value);
    }
  });
  return payload;
};

const syncRelatedRecords = async (model, studentId, currentRecords, incoming, tx) => {
  const existingById = new Map((currentRecords || []).map((r) => [r.id, r]));
  const incomingIds = new Set((incoming || []).map((r) => r.id).filter(Boolean));

  for (const record of currentRecords || []) {
    if (!incomingIds.has(record.id)) {
      await record.destroy({ transaction: tx });
    }
  }

  for (const recordDataRaw of incoming || []) {
    const recordData = parseDatesInPayload({ ...recordDataRaw });
    if (recordData.id && existingById.has(recordData.id)) {
      const existing = existingById.get(recordData.id);
      delete recordData.id;
      delete recordData.student_id;
      await existing.update(recordData, { transaction: tx });
    } else {
      delete recordData.id;
      delete recordData.student_id;
      await model.create({ ...recordData, student_id: studentId }, { transaction: tx });
    }
  }
};

const getStudentsMe = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.currentUser.id }, include: includeAll });
    if (!student) {
      return sendResponse(res, { success: false, status: 404, error: 'Profile not found' });
    }

    return sendResponse(res, {
      success: true,
      data: {
        id: student.id,
        uid: student.uid,
        full_name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
        semester: student.semester,
        section: student.section,
        year_of_admission: student.year_of_admission,
        personal_info: student.personal_info ? serializeModel(student.personal_info) : null,
        past_education_records: (student.past_education_records || []).map(serializeModel),
        post_admission_records: (student.post_admission_records || []).map(serializeModel),
        projects: (student.projects || []).map(serializeModel),
        internships: (student.internships || []).map(serializeModel),
        cocurricular_participations: (student.cocurricular_participations || []).map(serializeModel),
        cocurricular_organizations: (student.cocurricular_organizations || []).map(serializeModel),
        career_objective: student.career_objective ? serializeModel(student.career_objective) : null,
        skills: student.skills ? serializeModel(student.skills) : null,
        swoc: student.swoc ? serializeModel(student.swoc) : null,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const putStudentsMe = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.currentUser.id }, include: includeAll });
    if (!student) {
      return sendResponse(res, { success: false, status: 404, error: 'Profile not found' });
    }

    const data = req.body || {};

    const names = splitFullName(data.full_name || '');
    student.first_name = names.first_name;
    student.middle_name = names.middle_name;
    student.last_name = names.last_name;

    ['semester', 'section', 'year_of_admission'].forEach((field) => {
      if (field in data) student[field] = data[field];
    });

    const tx = await sequelize.transaction();
    try {
      await student.save({ transaction: tx });

      if (data.personal_info) {
        const payload = parseDatesInPayload({ ...data.personal_info });
        delete payload.id;
        delete payload.student_id;

        if (student.personal_info) {
          await student.personal_info.update(payload, { transaction: tx });
        } else {
          await StudentPersonalInfo.create({ ...payload, student_id: student.id }, { transaction: tx });
        }
      }

      const peValidation = validatePastEducationPayload(data.past_education_records || []);
      if (!peValidation.valid) {
        await tx.rollback();
        return sendResponse(res, { success: false, status: 400, error: peValidation.error });
      }

      const paValidation = validatePostAdmissionRecords(Number(student.semester || 0), data.post_admission_records || []);
      if (!paValidation.valid) {
        await tx.rollback();
        return sendResponse(res, { success: false, status: 400, error: paValidation.error });
      }

      await syncRelatedRecords(
        PastEducation,
        student.id,
        student.past_education_records,
        data.past_education_records || [],
        tx,
      );
      await syncRelatedRecords(
        PostAdmissionAcademicRecord,
        student.id,
        student.post_admission_records,
        data.post_admission_records || [],
        tx,
      );
      await syncRelatedRecords(Project, student.id, student.projects, data.projects || [], tx);
      await syncRelatedRecords(Internship, student.id, student.internships, data.internships || [], tx);
      await syncRelatedRecords(
        CoCurricularParticipation,
        student.id,
        student.cocurricular_participations,
        data.cocurricular_participations || [],
        tx,
      );
      await syncRelatedRecords(
        CoCurricularOrganization,
        student.id,
        student.cocurricular_organizations,
        data.cocurricular_organizations || [],
        tx,
      );

      const singleRels = [
        ['career_objective', CareerObjective],
        ['skills', Skills],
        ['swoc', SWOC],
      ];

      for (const [key, model] of singleRels) {
        const payload = data[key];
        if (!payload) continue;
        const clean = { ...payload };
        delete clean.id;
        delete clean.student_id;

        if (student[key]) {
          await student[key].update(clean, { transaction: tx });
        } else {
          await model.create({ ...clean, student_id: student.id }, { transaction: tx });
        }
      }

      await tx.commit();
      return sendResponse(res, {
        success: true,
        data: { message: 'Profile updated successfully.' },
      });
    } catch (_error) {
      await tx.rollback();
      return sendResponse(res, { success: false, status: 500, error: 'Failed to update profile' });
    }
  } catch (error) {
    return next(error);
  }
};

const getStudentMe = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.currentUser.id }, include: includeAll });
    if (!student) {
      return sendResponse(res, { success: false, status: 404, error: 'Student profile not found' });
    }

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
        personal_info: student.personal_info ? serializeModel(student.personal_info) : null,
        past_education_records: (student.past_education_records || []).map(serializeModel),
        post_admission_records: (student.post_admission_records || []).map(serializeModel),
        projects: (student.projects || []).map(serializeModel),
        internships: (student.internships || []).map(serializeModel),
        cocurricular_participations: (student.cocurricular_participations || []).map(serializeModel),
        cocurricular_organizations: (student.cocurricular_organizations || []).map(serializeModel),
        career_objective: student.career_objective ? serializeModel(student.career_objective) : null,
        skills: student.skills ? serializeModel(student.skills) : null,
        swoc: student.swoc ? serializeModel(student.swoc) : null,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const putStudentMe = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.currentUser.id }, include: includeAll });
    if (!student) {
      return sendResponse(res, { success: false, status: 404, error: 'Student profile not found' });
    }

    const data = req.body || {};
    if (!Object.keys(data).length) {
      return sendResponse(res, { success: false, status: 400, error: 'No data provided' });
    }

    const tx = await sequelize.transaction();
    try {
      if ('full_name' in data) {
        const names = splitFullName(data.full_name || '');
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
          await tx.rollback();
          return sendResponse(res, { success: false, status: 400, error: peValidation.error });
        }
      }

      if (Object.prototype.hasOwnProperty.call(data, 'post_admission_records')) {
        const paValidation = validatePostAdmissionRecords(Number(student.semester || 0), data.post_admission_records || []);
        if (!paValidation.valid) {
          await tx.rollback();
          return sendResponse(res, { success: false, status: 400, error: paValidation.error });
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
        const relPayload = data[dataKey];
        if (relPayload == null) continue;

        if (Array.isArray(relPayload)) {
          for (const item of relPayload) parseDatesInPayload(item);
        } else {
          parseDatesInPayload(relPayload);
        }

        if (['personal_info', 'career_objective', 'skills', 'swoc'].includes(relName)) {
          const existing = student[relName];
          if (existing) {
            await existing.update(relPayload, { transaction: tx });
          } else {
            await modelClass.create({ ...relPayload, student_id: student.id }, { transaction: tx });
          }
        } else {
          for (const existing of student[relName] || []) {
            await existing.destroy({ transaction: tx });
          }
          if (Array.isArray(relPayload)) {
            for (const item of relPayload) {
              await modelClass.create({ ...item, student_id: student.id }, { transaction: tx });
            }
          }
        }
      }

      await tx.commit();
      return sendResponse(res, {
        success: true,
        data: { message: 'Student profile updated successfully' },
      });
    } catch (_error) {
      await tx.rollback();
      return sendResponse(res, { success: false, status: 500, error: 'Failed to update profile' });
    }
  } catch (error) {
    return next(error);
  }
};

const uploadStudentPhoto = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.currentUser.id }, include: ['personal_info'] });
    if (!student) {
      return sendResponse(res, { success: false, status: 404, error: 'Student profile not found' });
    }
    if (!student.personal_info) {
      return sendResponse(res, {
        success: false,
        status: 400,
        error: 'Please save personal information first, then upload photo.',
      });
    }

    if (!req.file) return sendResponse(res, { success: false, status: 400, error: 'No file provided' });
    if (!req.file.mimetype || !req.file.mimetype.startsWith('image/')) {
      return sendResponse(res, { success: false, status: 400, error: 'Invalid file type' });
    }

    if (req.file.size > 2 * 1024 * 1024) {
      return sendResponse(res, { success: false, status: 400, error: 'File too large. Max size is 2MB' });
    }

    if (!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)) {
      return sendResponse(res, {
        success: false,
        status: 500,
        error: 'Cloudinary credentials are missing on the server',
      });
    }

    try {
      if (student.personal_info.photo_public_id) {
        await cloudinary.uploader.destroy(student.personal_info.photo_public_id, { invalidate: true });
      }

      const uploadResult = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        { folder: 'students', resource_type: 'image' },
      );

      student.personal_info.photo_url = uploadResult.secure_url;
      student.personal_info.photo_public_id = uploadResult.public_id;
      await student.personal_info.save();

      return sendResponse(res, {
        success: true,
        data: {
          message: 'Upload successful',
          photo_url: student.personal_info.photo_url,
          photo_public_id: student.personal_info.photo_public_id,
        },
      });
    } catch (_error) {
      return sendResponse(res, { success: false, status: 500, error: 'Upload failed' });
    }
  } catch (error) {
    return next(error);
  }
};

const getStudentMentor = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.currentUser.id } });
    if (!student) return res.status(404).json({ error: 'Student profile not found' });
    if (!student.mentor_id) return res.status(404).json({ error: 'No mentor assigned to this student' });

    const mentor = await Faculty.findByPk(student.mentor_id);
    if (!mentor) return res.status(404).json({ error: 'Mentor not found' });

    return res.status(200).json({
      id: mentor.id,
      email: mentor.email,
      first_name: mentor.first_name,
      last_name: mentor.last_name,
      full_name:
        mentor.first_name && mentor.last_name
          ? `${mentor.first_name} ${mentor.last_name}`
          : 'Unknown',
      contact_number: mentor.contact_number,
    });
  } catch (error) {
    return next(error);
  }
};

const getStudentMentoringMinutes = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { user_id: req.currentUser.id } });
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const minutes = await MentoringMinute.findAll({
      where: { student_id: student.id },
      order: [['date', 'DESC']],
    });

    const result = [];
    for (const m of minutes) {
      const faculty = await Faculty.findByPk(m.faculty_id);
      result.push({
        id: m.id,
        faculty_email: faculty ? faculty.email : null,
        faculty_name: faculty ? `${faculty.first_name} ${faculty.last_name}` : null,
        semester: m.semester,
        date: m.date,
        remarks: m.remarks,
        suggestion: m.suggestion,
        action: m.action,
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const searchStudents = async (req, res, next) => {
  try {
    const where = buildStudentSearchWhere(req.query);
    const summary = String(req.query.view || '').toLowerCase() === 'summary';

    if (req.currentUser.role === 'faculty') {
      const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });
      if (!faculty) return res.status(404).json({ error: 'Faculty profile not found' });
      where.mentor_id = faculty.id;
    }

    const students = await Student.findAll({
      where,
      include: buildStudentIncludes({
        summary,
        domain: req.query.domain,
        careerGoal: req.query.careerGoal,
      }),
      order: [['id', 'ASC']],
    });
    const includeIds = req.currentUser.role === 'admin';
    return res
      .status(200)
      .json(students.map((s) => (summary ? serializeStudentSummary(s) : serializeStudent(s, { includeIds }))));
  } catch (error) {
    return next(error);
  }
};

const getStudentById = async (req, res, next) => {
  try {
    const studentId = Number(req.params.id);
    if (!studentId) return res.status(400).json({ error: 'Invalid student id' });

    const where = { id: studentId };
    if (req.currentUser.role === 'faculty') {
      const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });
      if (!faculty) return res.status(404).json({ error: 'Faculty profile not found' });
      where.mentor_id = faculty.id;
    }

    const student = await Student.findOne({
      where,
      include: buildStudentIncludes({ summary: false }),
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    return res.status(200).json(serializeStudent(student, { includeIds: true }));
  } catch (error) {
    return next(error);
  }
};

const updateStudentMentorByAdmin = async (req, res, next) => {
  try {
    const student = await Student.findByPk(Number(req.params.id));
    if (!student) {
      return sendResponse(res, { success: false, status: 404, error: 'Student not found' });
    }

    const data = req.body || {};

    if (data.mentor_id === null) {
      student.mentor_id = null;
    } else {
      const faculty = await Faculty.findByPk(Number(data.mentor_id));
      if (!faculty) {
        return sendResponse(res, { success: false, status: 404, error: 'Faculty not found' });
      }
      student.mentor_id = Number(data.mentor_id);
    }

    try {
      await student.save();
      return sendResponse(res, {
        success: true,
        data: { message: 'Student updated successfully' },
      });
    } catch (_error) {
      return sendResponse(res, { success: false, status: 500, error: 'Database error' });
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getStudentsMe,
  putStudentsMe,
  getStudentMe,
  putStudentMe,
  uploadStudentPhoto,
  getStudentMentor,
  getStudentMentoringMinutes,
  searchStudents,
  getStudentById,
  updateStudentMentorByAdmin,
};
