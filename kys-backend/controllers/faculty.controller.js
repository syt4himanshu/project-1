const { Faculty, Student, MentoringMinute } = require('../models');
const { serializeModel } = require('../utils/helpers');
const { serializeStudent } = require('../utils/serializers');

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
    if (!faculty) return res.status(404).json({ error: 'Faculty profile not found' });

    return res.json({
      first_name: faculty.first_name,
      last_name: faculty.last_name,
      email: faculty.email,
      contact_number: faculty.contact_number,
    });
  } catch (error) {
    return next(error);
  }
};

const updateMyFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });
    if (!faculty) return res.status(404).json({ error: 'Faculty profile not found' });

    const data = req.body || {};
    ['first_name', 'last_name', 'contact_number'].forEach((field) => {
      if (field in data) faculty[field] = data[field];
    });

    await faculty.save();
    return res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    return next(error);
  }
};

const getMyMentees = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });
    if (!faculty) return res.status(404).json({ error: 'Faculty profile not found' });

    const mentees = await Student.findAll({ where: { mentor_id: faculty.id }, include: includeAll, order: [['id', 'ASC']] });
    return res.status(200).json(mentees.map((s) => ({ id: s.id, first_name: s.first_name, middle_name: s.middle_name, last_name: s.last_name, ...serializeStudent(s) })));
  } catch (error) {
    return next(error);
  }
};

const addMentoringMinute = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });
    if (!faculty) return res.status(404).json({ error: 'Faculty profile not found' });

    const student = await Student.findOne({ where: { uid: req.params.uid, mentor_id: faculty.id } });
    if (!student) return res.status(404).json({ error: 'Mentee not found or not assigned to this faculty' });

    const { remarks, suggestion, action } = req.body || {};
    if (!remarks) return res.status(400).json({ error: 'Missing required field: remarks' });

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
      return res.status(201).json({ message: 'Mentoring minute added successfully.' });
    } catch (_error) {
      return res.status(500).json({ error: 'Database error while saving mentoring minute' });
    }
  } catch (error) {
    return next(error);
  }
};

const getMenteeMentoringMinutes = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });
    if (!faculty) return res.status(404).json({ error: 'Faculty profile not found' });

    const student = await Student.findOne({ where: { uid: req.params.uid, mentor_id: faculty.id } });
    if (!student) return res.status(404).json({ error: 'Mentee not found or not assigned to this faculty' });

    const minutes = await MentoringMinute.findAll({ where: { student_id: student.id }, order: [['date', 'DESC']] });
    const result = minutes.map((m) => ({
      id: m.id,
      semester: m.semester,
      date: m.date,
      remarks: m.remarks,
      suggestion: m.suggestion,
      action: m.action,
      created_by_faculty: m.faculty_id === faculty.id,
    }));

    return res.status(200).json({
      student: {
        uid: student.uid,
        full_name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
        semester: student.semester,
        section: student.section,
        year_of_admission: student.year_of_admission,
      },
      mentoring_minutes: result,
    });
  } catch (error) {
    return next(error);
  }
};

const getMenteeByUid = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ where: { user_id: req.currentUser.id } });
    if (!faculty) return res.status(404).json({ error: 'Faculty profile not found' });

    const student = await Student.findOne({ where: { uid: req.params.uid, mentor_id: faculty.id }, include: includeAll });
    if (!student) return res.status(404).json({ error: 'Mentee not found or not assigned to this faculty' });

    return res.status(200).json({
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
    });
  } catch (error) {
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
};
