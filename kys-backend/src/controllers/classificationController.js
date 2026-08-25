const { Student, SupportPlan, PostAdmissionAcademicRecord } = require('../../models');
const { classifyStudents } = require('../services/classificationService');
const { Op } = require('sequelize');
const { sequelize } = require('../../models');
const logger = require('../../utils/logger');

const formatStudent = (s) => {
  const plain = s.toJSON ? s.toJSON() : s;
  
  let cgpa = 0;
  let backlogs = 0;
  let mseMarks = null;

  if (plain.post_admission_records && plain.post_admission_records.length > 0) {
    const validRecords = plain.post_admission_records.filter(r => r.sgpa != null && r.sgpa !== "");
    if (validRecords.length > 0) {
      cgpa = validRecords.reduce((sum, r) => sum + parseFloat(r.sgpa || 0), 0) / validRecords.length;
    }
    backlogs = plain.post_admission_records.reduce((sum, r) => {
      if (r.backlog_count) return sum + parseInt(r.backlog_count, 10);
      
      let subjects = r.backlog_subjects || '';
      if (subjects.includes('[[KYS_META]]')) {
        subjects = subjects.split('[[KYS_META]]')[0];
      }
      subjects = subjects.trim();

      if (subjects && subjects.toUpperCase() !== 'N/A' && subjects.toUpperCase() !== 'NONE') {
        const count = subjects.split(',').filter(s => s.trim().length > 0).length;
        return sum + (count > 0 ? count : 1);
      }
      return sum;
    }, 0);
    
    // Get latest semester's MSE marks (or max semester)
    const latestRecord = [...plain.post_admission_records].sort((a, b) => b.semester - a.semester)[0];
    if (latestRecord && latestRecord.mse_marks != null) {
      mseMarks = parseFloat(latestRecord.mse_marks);
    }
  }

  return {
    id: plain.id,
    name: `${plain.first_name || ''} ${plain.last_name || ''}`.trim() || 'Unknown Student',
    rollNo: plain.uid,
    department: 'CE',
    semester: plain.semester || 1,
    cgpa,
    backlogs,
    mseMarks,
    achievements: [],
    projects: [],
    publications: []
  };
};

exports.getClassifications = async (req, res, next) => {
  try {
    const { department, semester, type, page = 1, limit = 20, search } = req.query;
    
    const cohortWhere = {};
    if (semester) cohortWhere.semester = semester;

    const rawStudents = await Student.findAll({ 
      where: cohortWhere,
      include: [{ model: PostAdmissionAcademicRecord, as: 'post_admission_records' }]
    });
    
    const allStudents = rawStudents.map(formatStudent);
    
    // Run classification pure business logic
    let classified = classifyStudents(allStudents);
    logger.info(`Classification run for ${classified.length} students`);

    // Apply specific query filters post-classification
    if (search) {
      const searchLower = search.toLowerCase();
      classified = classified.filter(s => 
        (s.name && s.name.toLowerCase().includes(searchLower)) || 
        (s.rollNo && s.rollNo.toLowerCase().includes(searchLower))
      );
    }

    if (type === 'slow') {
      classified = classified.filter(s => s.classification.isSlowLearner);
    } else if (type === 'advanced') {
      classified = classified.filter(s => s.classification.isAdvancedLearner);
    } else if (type === 'general') {
      classified = classified.filter(s => !s.classification.isSlowLearner && !s.classification.isAdvancedLearner);
    }

    const total = classified.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginated = classified.slice(startIndex, endIndex);

    res.json({
      students: paginated,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    next(error);
  }
};

exports.getSummary = async (req, res, next) => {
  try {
    const rawStudents = await Student.findAll({ 
      include: [{ model: PostAdmissionAcademicRecord, as: 'post_admission_records' }] 
    });
    const students = rawStudents.map(formatStudent);
    const classified = classifyStudents(students);
    
    let slowLearners = 0;
    let advancedLearners = 0;
    let both = 0;
    let general = 0;

    const byDepartmentMap = {};

    classified.forEach(s => {
      const isSlow = s.classification.isSlowLearner;
      const isAdv = s.classification.isAdvancedLearner;
      
      if (isSlow && isAdv) both++;
      else if (isSlow) slowLearners++;
      else if (isAdv) advancedLearners++;
      else general++;

      const dept = s.department || 'Unknown';
      if (!byDepartmentMap[dept]) {
        byDepartmentMap[dept] = { department: dept, slow: 0, advanced: 0, total: 0 };
      }
      byDepartmentMap[dept].total++;
      if (isSlow) byDepartmentMap[dept].slow++;
      if (isAdv) byDepartmentMap[dept].advanced++;
    });

    res.json({
      total: classified.length,
      slowLearners: slowLearners + both,
      advancedLearners: advancedLearners + both,
      both,
      general,
      byDepartment: Object.values(byDepartmentMap)
    });
  } catch (error) {
    next(error);
  }
};

exports.createSupportPlan = async (req, res, next) => {
  try {
    const { studentId, type, mechanism, scheduledAt, notes } = req.body;
    
    const plan = await SupportPlan.create({
      studentId,
      type,
      mechanism,
      scheduledAt,
      notes,
      createdBy: req.currentUser.id
    });

    res.status(201).json(plan);
  } catch (error) {
    next(error);
  }
};

exports.getSupportPlans = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const plans = await SupportPlan.findAll({
      where: { studentId },
      order: [['createdAt', 'DESC']]
    });
    res.json(plans);
  } catch (error) {
    next(error);
  }
};

exports.updateSupportPlan = async (req, res, next) => {
  try {
    const { planId } = req.params;
    const { status, notes } = req.body;
    
    const plan = await SupportPlan.findByPk(planId);
    if (!plan) {
      const error = new Error('Support plan not found');
      error.status = 404;
      throw error;
    }

    if (status) plan.status = status;
    if (notes !== undefined) plan.notes = notes;
    await plan.save();

    res.json(plan);
  } catch (error) {
    next(error);
  }
};

exports.importMseMarks = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { data } = req.body;
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }

    let updated = 0;
    for (const row of data) {
      if (!row.rollNo || !row.semester || row.mseMarks == null) continue;
      
      const student = await Student.findOne({ where: { uid: row.rollNo } });
      if (!student) continue;

      const [record] = await PostAdmissionAcademicRecord.findOrCreate({
        where: { student_id: student.id, semester: row.semester },
        defaults: { sgpa: 0, backlog_count: 0 },
        transaction
      });
      
      record.mse_marks = parseFloat(row.mseMarks);
      await record.save({ transaction });
      updated++;
    }

    await transaction.commit();
    res.json({ success: true, updated });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};


