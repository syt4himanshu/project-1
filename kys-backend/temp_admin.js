const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { sequelize, User, Student, Faculty, StudentPersonalInfo, MentoringMinute } = require('../models');
const { splitFullName, buildFullName, serializeModel } = require('../utils/helpers');
const { serializeStudent } = require('../utils/serializers');
const { unpackText } = require('../utils/profileCodec');

const verifyPassword = (password, hash) => {
  if (hash.startsWith('$2b$') || hash.startsWith('$2a$')) {
    return bcrypt.compare(password, hash);
  }
  if (hash.startsWith('scrypt:')) {
    return new Promise((resolve) => {
      try {
        const parts = hash.split('$');
        const params = parts[0].split(':');
        const N = parseInt(params[1]);
        const r = parseInt(params[2]);
        const p = parseInt(params[3]);
        const salt = Buffer.from(parts[1], 'utf8');
        const storedKey = parts[2];
        const keylen = storedKey.length / 2;
        crypto.scrypt(password, salt, keylen, { N, r, p, maxmem: 256 * 1024 * 1024 }, (err, derived) => {
          if (err) return resolve(false);
          resolve(derived.toString('hex') === storedKey);
        });
      } catch (_) {
        resolve(false);
      }
    });
  }
  return Promise.resolve(false);
};

const fullStudentIncludes = [
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

const KYS_PLACEHOLDER_VALUES = new Set(['n/a', 'na', 'none', 'nil', '-', '--', 'no backlog', 'no backlogs']);

const stripKysArtifacts = (value) => {
  const text = value == null ? '' : String(value);
  return text
    .replace(/\[\[KYS[_A-Z]*\]\]\s*[\[\{][^)\]]*[\]\}]/g, '')
    .replace(/\[\[KYS[_A-Z]*\]\]/g, '')
    .replace(/\{"season":[^}]+\}/g, '')
    .trim();
};

const normalizeText = (value) => stripKysArtifacts(value);

const isBacklogPlaceholder = (value) => {
  const token = normalizeText(value).toLowerCase();
  return (
    !token ||
    KYS_PLACEHOLDER_VALUES.has(token)
  );
};

const extractBacklogTokens = (rawValue) => {
  const source = normalizeText(rawValue);
  if (!source) return [];

  // Handle saved JSON arrays gracefully when malformed payloads reach reports.
  if (source.startsWith('[')) {
    try {
      const parsed = JSON.parse(source);
      if (Array.isArray(parsed)) {
        return parsed
          .map((entry) => normalizeText(entry))
          .filter((entry) => entry && !isBacklogPlaceholder(entry));
      }
    } catch (_) {
      // Fall back to delimiter parsing below.
    }
  }

  return source
    .split(/[,\n;]+/)
    .map((entry) => normalizeText(entry))
    .map((entry) => entry.replace(/^['"\[]+|['"\]]+$/g, '').trim())
    .filter((entry) => entry && !isBacklogPlaceholder(entry));
};

const parseBacklogInfo = (value) => {
  if (!value) return { subjects: [], count: 0 };

  const asText = Array.isArray(value) ? value.join(',') : String(value);
  const decoded = unpackText(asText);
  const tokens = extractBacklogTokens(decoded?.base || asText);

  let numericCount = 0;
  const uniqueByLowerCase = new Map();
  tokens.forEach((token) => {
    const numberMatch = token.match(/^(\d+)(?:\s*(?:subjects?|backlogs?))?$/i);
    if (numberMatch) {
      numericCount = Math.max(numericCount, Number(numberMatch[1]));
      return;
    }

    const subject = token;
    const key = subject.toLowerCase();
    if (!uniqueByLowerCase.has(key)) uniqueByLowerCase.set(key, subject);
  });

  const subjects = Array.from(uniqueByLowerCase.values());
  const count = Math.max(subjects.length, numericCount);

  return { subjects, count };
};

const parseBacklogSubjects = (value) => parseBacklogInfo(value).subjects;
const parseBacklogCount = (value) => parseBacklogInfo(value).count;

const isMeaningfulValue = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (typeof value === 'string') {
    const text = normalizeText(value).toLowerCase();
    return text.length > 0 && !KYS_PLACEHOLDER_VALUES.has(text);
  }
  if (Array.isArray(value)) return value.some((entry) => isMeaningfulValue(entry));
  if (typeof value === 'object') {
    return Object.values(value).some((entry) => isMeaningfulValue(entry));
  }
  return false;
};

const toPlain = (value) => {
  if (!value) return null;
  if (typeof value.get === 'function') return value.get({ plain: true });
  return value;
};

const REQUIRED_PERSONAL_INFO_FIELDS = [
  'mis_uid',
  'dob',
  'gender',
  'mobile_no',
  'personal_email',
  'college_email',
  'state',
  'city',
  'pincode',
  'permanent_address',
  'father_name',
  'father_mobile_no',
  'father_occupation',
  'mother_name',
  'mother_mobile_no',
  'mother_occupation',
];

const REQUIRED_CAREER_OBJECTIVE_FIELDS = [
  'career_goal',
  'clarity_preparedness',
];

const REQUIRED_SWOC_FIELDS = ['strengths', 'weaknesses', 'opportunities', 'challenges'];

const REQUIRED_MINI_PROJECT_FIELDS = ['title', 'domain'];
const REQUIRED_MAJOR_PROJECT_FIELDS = ['title', 'domain'];

const collectMissingObjectFields = (missingFields, prefix, data, requiredFields) => {
  const plainData = toPlain(data) || {};
  requiredFields.forEach((field) => {
    if (!isMeaningfulValue(plainData[field])) {
      missingFields.push(`${prefix}.${field}`);
    }
  });
};

const REPORT_MISSING_FIELD_LABELS = {
  full_name: 'Full Name',
  'personal_info.mis_uid': 'MIS UID',
  'personal_info.dob': 'Date of Birth',
  'personal_info.gender': 'Gender',
  'personal_info.mobile_no': 'WhatsApp Mobile No.',
  'personal_info.personal_email': 'Personal Email',
  'personal_info.college_email': 'College Email (Professional)',
  'personal_info.state': 'State',
  'personal_info.city': 'City',
  'personal_info.pincode': 'Pincode',
  'personal_info.permanent_address': 'Permanent Address',
  'personal_info.father_name': "Father's Name",
  'personal_info.father_mobile_no': "Father's WhatsApp Mobile No.",
  'personal_info.father_occupation': "Father's Occupation",
  'personal_info.mother_name': "Mother's Name",
  'personal_info.mother_mobile_no': "Mother's WhatsApp Mobile No.",
  'personal_info.mother_occupation': "Mother's Occupation",
  'past_education_records.ssc.board': 'SSC Board',
  'past_education_records.ssc.percentage': 'SSC Percentage / Grade',
  'past_education_records.ssc.year_of_passing': 'SSC Year of Passing',
  admission_type: 'Admission Type (after 10th)',
  'past_education_records.hssc.board': 'HSC Board',
  'past_education_records.hssc.percentage': 'HSC Percentage / Grade',
  'past_education_records.hssc.year_of_passing': 'HSC Year of Passing',
  'past_education_records.entrance.exam_type': 'Entrance Exam Type',
  'past_education_records.entrance.percentage': 'Entrance Percentile',
  'past_education_records.entrance.year_of_passing': 'Entrance Exam Year of Passing',
  'past_education_records.diploma.board': 'Diploma Board',
  'past_education_records.diploma.percentage': 'Diploma Percentage / Grade',
  'past_education_records.diploma.year_of_passing': 'Diploma Year of Passing',
  'projects.mini.title': 'Mini Project Title',
  'projects.mini.domain': 'Mini Project Domain',
  'projects.major.title': 'Major Project Title',
  'projects.major.domain': 'Major Project Domain',
  'swoc.strengths': 'Strengths',
  'swoc.weaknesses': 'Weaknesses / Areas of Improvement',
  'swoc.opportunities': 'Opportunities',
  'swoc.challenges': 'Challenges',
  'career_objective.career_goal': 'Career Goal',
  'career_objective.clarity_preparedness': 'Clarity and Preparedness Level',
  'career_objective.interested_in_campus_placement': 'Interested in Campus Placement?',
  'skills.domains_of_interest': 'Domains of Interest',
};

const mapMissingFieldLabel = (fieldKey) => REPORT_MISSING_FIELD_LABELS[fieldKey] || fieldKey;

const getPastRecord = (student, examName) => {
  const records = Array.isArray(student?.past_education_records) ? student.past_education_records : [];
  return records.map((record) => toPlain(record) || {}).find((record) => record.exam_name === examName) || {};
};

const inferAdmissionType = (student) => {
  const raw = normalizeText(student?.admission_type).toLowerCase();
  if (raw === 'hsc' || raw === 'diploma') return raw;

  const records = Array.isArray(student?.past_education_records) ? student.past_education_records : [];
  const plainRecords = records.map((record) => toPlain(record) || {});
  if (plainRecords.some((record) => record.exam_name === 'DIPLOMA')) return 'diploma';
  if (plainRecords.some((record) => record.exam_name === 'HSSC' || record.exam_name === 'ENTRANCE_EXAM')) return 'hsc';
  return '';
};

const getMissingRequiredFields = (student) => {
  const missingFields = [];

  const fullName = [student?.first_name, student?.middle_name, student?.last_name]
    .map((entry) => normalizeText(entry))
    .filter(Boolean)
    .join(' ');
  if (!fullName) {
    missingFields.push('full_name');
  }

  collectMissingObjectFields(missingFields, 'personal_info', student.personal_info, REQUIRED_PERSONAL_INFO_FIELDS);
  collectMissingObjectFields(missingFields, 'career_objective', student.career_objective, REQUIRED_CAREER_OBJECTIVE_FIELDS);
  collectMissingObjectFields(missingFields, 'swoc', student.swoc, REQUIRED_SWOC_FIELDS);

  const skills = toPlain(student.skills) || {};
  if (!isMeaningfulValue(skills.domains_of_interest)) {
    missingFields.push('skills.domains_of_interest');
  }

  const career = toPlain(student.career_objective) || {};
  if (typeof career.interested_in_campus_placement !== 'boolean') {
    missingFields.push('career_objective.interested_in_campus_placement');
  }

  const ssc = getPastRecord(student, 'SSC');
  if (!isMeaningfulValue(ssc.board)) missingFields.push('past_education_records.ssc.board');
  if (!isMeaningfulValue(ssc.percentage)) missingFields.push('past_education_records.ssc.percentage');
  if (!isMeaningfulValue(ssc.year_of_passing)) missingFields.push('past_education_records.ssc.year_of_passing');

  const admissionType = inferAdmissionType(student);
  if (!admissionType) {
    missingFields.push('admission_type');
  } else if (admissionType === 'hsc') {
    const hssc = getPastRecord(student, 'HSSC');
    const entrance = getPastRecord(student, 'ENTRANCE_EXAM');
    if (!isMeaningfulValue(hssc.board)) missingFields.push('past_education_records.hssc.board');
    if (!isMeaningfulValue(hssc.percentage)) missingFields.push('past_education_records.hssc.percentage');
    if (!isMeaningfulValue(hssc.year_of_passing)) missingFields.push('past_education_records.hssc.year_of_passing');
    if (!isMeaningfulValue(entrance.exam_type)) missingFields.push('past_education_records.entrance.exam_type');
    if (!isMeaningfulValue(entrance.percentage)) missingFields.push('past_education_records.entrance.percentage');
    if (!isMeaningfulValue(entrance.year_of_passing)) missingFields.push('past_education_records.entrance.year_of_passing');
  } else if (admissionType === 'diploma') {
    const diploma = getPastRecord(student, 'DIPLOMA');
    if (!isMeaningfulValue(diploma.board)) missingFields.push('past_education_records.diploma.board');
    if (!isMeaningfulValue(diploma.percentage)) missingFields.push('past_education_records.diploma.percentage');
    if (!isMeaningfulValue(diploma.year_of_passing)) missingFields.push('past_education_records.diploma.year_of_passing');
  }
  
  const currentSem = Number(student.semester || 8);
  const postAdmissionRecords = Array.isArray(student.post_admission_records) ? student.post_admission_records : [];
  for (let sem = 1; sem < currentSem; sem++) {
    const rec = postAdmissionRecords.find((r) => Number(r.semester) === sem) || {};
    if (!isMeaningfulValue(rec.sgpa)) {
      missingFields.push(`Semester ${sem} SGPA / Percentage`);
    }
  }

  const projects = Array.isArray(student.projects) ? student.projects : [];
  const miniProject = projects[0] || {};
  const majorProject = projects[1] || {};

  if (!isMeaningfulValue(miniProject.title)) missingFields.push('projects.mini.title');
  if (!isMeaningfulValue(miniProject.domain) || miniProject.domain === 'Other') missingFields.push('projects.mini.domain');
  if (!isMeaningfulValue(majorProject.title)) missingFields.push('projects.major.title');
  if (!isMeaningfulValue(majorProject.domain) || majorProject.domain === 'Other') missingFields.push('projects.major.domain');

  return Array.from(new Set(missingFields)).map(mapMissingFieldLabel);
};

const toCsv = (rows) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    const str = v == null ? '' : String(v);
    return `"${str.replace(/"/g, '""')}"`;
  };
  const lines = [headers.map(escape).join(',')];
  rows.forEach((row) => {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  });
  return lines.join('\n');
};

const parseBoundedInteger = (value, min, max) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) return null;
  return parsed;
};

const hasMinimumPasswordLength = (value, minLength = 6) =>
  typeof value === 'string' && value.length >= minLength;

const isValidFacultyEmail = (value) => normalizeText(value).endsWith('@stvincentngp.edu.in');

const hasValidContactNumber = (value) => String(value || '').replace(/\D/g, '').length >= 10;

const reportsStats = async (_req, res, next) => {
  try {
    const students = await Student.findAll({
      include: ['post_admission_records'],
      order: [['id', 'ASC']],
    });

    let sgpaSum = 0;
    let sgpaCount = 0;
    const activeSemesters = new Set();
    let withBacklogs = 0;

    students.forEach((student) => {
      const records = student.post_admission_records || [];
      let hasBacklog = false;

      records.forEach((record) => {
        const sgpa = Number(record.sgpa);
        if (Number.isFinite(sgpa)) {
          sgpaSum += sgpa;
          sgpaCount += 1;
        }
        const semester = Number(record.semester);
        if (Number.isFinite(semester) && semester > 0) activeSemesters.add(semester);
        if (parseBacklogCount(record.backlog_subjects) > 0) hasBacklog = true;
      });

      if (hasBacklog) withBacklogs += 1;
    });

    return res.status(200).json({
      total_students: students.length,
      avg_sgpa: sgpaCount ? Number((sgpaSum / sgpaCount).toFixed(2)) : 0,
      with_backlogs: withBacklogs,
      active_semesters: activeSemesters.size,
    });
  } catch (error) {
    return next(error);
  }
};

const reportsToppers = async (req, res, next) => {
  try {
    const semTab = req.query.semester ? Number(req.query.semester) : 1;

    // 1. Determine Current Cycle from Student Distribution
    const allStudentSemesters = await Student.findAll({ attributes: ['semester'] });
    let oddCount = 0;
    let evenCount = 0;
    allStudentSemesters.forEach((s) => {
      const sem = Number(s.semester);
      if (sem) {
        if (sem % 2 === 0) evenCount++;
        else oddCount++;
      }
    });

    const currentCycle = evenCount > oddCount ? 'even' : 'odd';

    // 2. Determine if the requested semester tab is currently in progress
    const isTabInCycle = (currentCycle === 'odd' && semTab % 2 !== 0) ||
      (currentCycle === 'even' && semTab % 2 === 0);

    if (isTabInCycle) {
      return res.status(200).json({
        semester: semTab,
        is_in_progress: true,
        current_cycle: currentCycle,
        toppers: [],
      });
    }

    // 3. Resolve target batch: students who have COMPLETED semTab
    const expectedCurrentSem = semTab + 1;

    // 4. Fetch students and records
    const students = await Student.findAll({
      where: { semester: expectedCurrentSem },
      include: ['post_admission_records'],
      order: [['id', 'ASC']],
    });

    const rows = [];
    students.forEach((student) => {
      const records = student.post_admission_records || [];
      const match = records.find((r) => Number(r.semester) === semTab);

      if (match) {
        const parsedSgpa = Number(match.sgpa);
        if (Number.isFinite(parsedSgpa)) {
          rows.push({
            name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
            uid: student.uid,
            sgpa: Number(parsedSgpa.toFixed(2)),
            semester: semTab,
            enrollment_year: student.year_of_admission,
          });
        }
      }
    });

    // 5. Sort & Rank with tie handling
    rows.sort((a, b) => {
      if (b.sgpa !== a.sgpa) return b.sgpa - a.sgpa;
      return a.name.localeCompare(b.name);
    });

    const toppers = [];
    let lastSgpa = -1;
    let currentRank = 0;

    for (let i = 0; i < rows.length && toppers.length < 10; i++) {
      const row = rows[i];
      if (row.sgpa !== lastSgpa) {
        currentRank = i + 1;
      }
      toppers.push({ ...row, rank: currentRank });
      lastSgpa = row.sgpa;
    }

    return res.status(200).json({
      semester: semTab,
      batch_current_sem: expectedCurrentSem,
      is_in_progress: false,
      current_cycle: currentCycle,
      toppers,
    });
  } catch (error) {
    return next(error);
  }
};

const reportsSemesterDistribution = async (_req, res, next) => {
  try {
    const students = await Student.findAll({ order: [['id', 'ASC']] });
    const map = new Map();
    students.forEach((s) => {
      const sem = Number(s.semester || 0);
      if (!sem) return;
      map.set(sem, (map.get(sem) || 0) + 1);
    });
    const rows = Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([semester, count]) => ({ semester, count }));
    return res.status(200).json(rows);
  } catch (error) {
    return next(error);
  }
};

const reportsBacklogs = async (_req, res, next) => {
  try {
    const students = await Student.findAll({
      include: ['post_admission_records'],
      order: [['id', 'ASC']],
    });

    const rows = [];
    students.forEach((student) => {
      const subjects = [];
      let inferredCount = 0;
      (student.post_admission_records || []).forEach((r) => {
        const backlogInfo = parseBacklogInfo(r.backlog_subjects);
        inferredCount = Math.max(inferredCount, backlogInfo.count);
        backlogInfo.subjects.forEach((sub) => {
          if (!subjects.includes(sub)) subjects.push(sub);
        });
      });
      const backlogCount = Math.max(inferredCount, subjects.length);
      if (backlogCount > 0) {
        rows.push({
          student_id: student.id,
          name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
          uid: student.uid,
          subjects: subjects.length > 0 ? subjects : [`${backlogCount} subjects`],
          backlog_count: backlogCount,
        });
      }
    });

    return res.status(200).json(rows);
  } catch (error) {
    return next(error);
  }
};

const buildGeneralReportRows = async (query = {}) => {
  const where = {};
  if (query.semester) where.semester = Number(query.semester);
  if (query.section) where.section = query.section;
  if (query.year_of_admission) where.year_of_admission = Number(query.year_of_admission);
  if (query.uid) where.uid = query.uid;
  if (query.name) {
    where[Op.or] = [
      { first_name: { [Op.iLike]: `%${query.name}%` } },
      { last_name: { [Op.iLike]: `%${query.name}%` } },
    ];
  }

  const students = await Student.findAll({
    where,
    include: ['post_admission_records', 'skills', 'career_objective'],
    order: [['id', 'ASC']],
  });

  return students.map((s) => ({
    id: s.id,
    uid: s.uid,
    name: [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(' '),
    semester: s.semester,
    section: s.section,
    year_of_admission: s.year_of_admission,
    domain_of_interest: s.skills?.domains_of_interest || '',
    career_goal: s.career_objective?.career_goal || '',
    academic_records: (s.post_admission_records || []).map((r) => ({
      semester: r.semester,
      sgpa: r.sgpa,
      backlogs: parseBacklogCount(r.backlog_subjects),
    })),
  }));
};

const reportsGeneral = async (req, res, next) => {
  try {
    const rows = await buildGeneralReportRows(req.query);
    return res.status(200).json(rows);
  } catch (error) {
    return next(error);
  }
};

const reportsIncomplete = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.year) where.year_of_admission = Number(req.query.year);

    const students = await Student.findAll({
      where,
      include: ['personal_info', 'past_education_records', 'post_admission_records', 'skills', 'career_objective', 'swoc', 'projects'],
      order: [['id', 'ASC']],
    });

    const rows = students
      .map((s) => {
        const missingFields = getMissingRequiredFields(s);

        return {
          id: s.id,
          name: [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(' '),
          uid: s.uid,
          year_of_admission: s.year_of_admission,
          missing_fields: missingFields,
        };
      })
      .filter((r) => r.missing_fields.length > 0);

    return res.status(200).json(rows);
  } catch (error) {
    return next(error);
  }
};

const exportAllStudents = async (_req, res, next) => {
  try {
    const rows = await buildGeneralReportRows({});
    const csvRows = (rows || []).map((r) => ({
      id: r.id,
      uid: r.uid,
      name: r.name,
      semester: r.semester,
      section: r.section,
      year_of_admission: r.year_of_admission,
      domain_of_interest: r.domain_of_interest,
      career_goal: r.career_goal,
    }));
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="all-students.csv"');
    return res.status(200).send(toCsv(csvRows));
  } catch (error) {
    return next(error);
  }
};

const exportBacklogs = async (_req, res, next) => {
  try {
    const students = await Student.findAll({
      include: ['post_admission_records'],
      order: [['id', 'ASC']],
    });
    const rows = [];
    students.forEach((student) => {
      const subjects = [];
      let inferredCount = 0;
      (student.post_admission_records || []).forEach((r) => {
        const backlogInfo = parseBacklogInfo(r.backlog_subjects);
        inferredCount = Math.max(inferredCount, backlogInfo.count);
        backlogInfo.subjects.forEach((sub) => {
          if (!subjects.includes(sub)) subjects.push(sub);
        });
      });
      const backlogCount = Math.max(inferredCount, subjects.length);
      if (backlogCount > 0) {
        rows.push({
          student_id: student.id,
          uid: student.uid,
          name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
          subjects: subjects.length > 0 ? subjects.join('; ') : `${backlogCount} subjects`,
          backlog_count: backlogCount,
        });
      }
    });
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="backlog-report.csv"');
    return res.status(200).send(toCsv(rows));
  } catch (error) {
    return next(error);
  }
};

const exportIncomplete = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.year) where.year_of_admission = Number(req.query.year);

    const students = await Student.findAll({
      where,
      include: ['personal_info', 'past_education_records', 'post_admission_records', 'skills', 'career_objective', 'swoc', 'projects'],
      order: [['id', 'ASC']],
    });

    const rows = students
      .map((s) => {
        const missingFields = getMissingRequiredFields(s);
        if (!missingFields.length) return null;
        return {
          id: s.id,
          uid: s.uid,
          name: [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(' '),
          year_of_admission: s.year_of_admission,
          missing_fields: missingFields.join('; '),
        };
      })
      .filter(Boolean);

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="incomplete-profiles.csv"');
    return res.status(200).send(toCsv(rows));
  } catch (error) {
    return next(error);
  }
};

const statistics = async (_req, res, next) => {
  try {
    const [totalUsers, totalStudents, totalTeachers, activeUsers] = await Promise.all([
      User.count(),
      Student.count(),
      Faculty.count(),
      User.count(),
    ]);

    return res.status(200).json({
      total_users: totalUsers,
      total_students: totalStudents,
      total_faculty: totalTeachers,
      active_users: activeUsers,
    });
  } catch (error) {
    return next(error);
  }
};

const listUsers = async (_req, res, next) => {
  try {
    const users = await User.findAll({
      order: [['id', 'ASC']],
      include: [
        {
          model: Student,
          as: 'student_profile',
          attributes: ['id', 'uid', 'first_name', 'middle_name', 'last_name'],
          include: [{ model: StudentPersonalInfo, as: 'personal_info', attributes: ['photo_url'], required: false }],
          required: false,
        },
        {
          model: Faculty,
          as: 'faculty_profile',
          attributes: ['id', 'first_name', 'last_name', 'email'],
          required: false,
        },
      ],
    });
    const result = users.map((u) => ({
      id: u.id,
      username: u.username,
      role: u.role,
      name:
        u.role === 'student'
          ? buildFullName(
            u.student_profile?.first_name,
            u.student_profile?.middle_name,
            u.student_profile?.last_name,
          ) || u.student_profile?.uid || u.username
          : u.role === 'faculty'
            ? buildFullName(u.faculty_profile?.first_name, '', u.faculty_profile?.last_name) ||
            u.faculty_profile?.email ||
            u.username
            : u.username,
      photoUrl: serializeModel(u.student_profile?.personal_info)?.photoUrl || null,
      status: 'Active',
      created: '2024-01-01',
    }));

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const data = req.body || {};
    if (!Object.keys(data).length) return res.status(400).json({ error: 'No data provided' });

    const role = normalizeText(data.role);
    const password = typeof data.password === 'string' ? data.password : '';

    if (!role) return res.status(400).json({ error: 'Missing field: role' });
    if (!['admin', 'faculty', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin, faculty, or student' });
    }
    if (!hasMinimumPasswordLength(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    let username = normalizeText(data.username);
    let studentPayload = null;
    let facultyPayload = null;

    if (role === 'student') {
      const uid = normalizeText(data.uid);
      const fullName = normalizeText(data.name || data.full_name);
      const semester = parseBoundedInteger(data.semester, 1, 8);
      const section = normalizeText(data.section);
      const yearOfAdmission = parseBoundedInteger(data.year_of_admission, 2000, 2100);

      if (!uid) return res.status(400).json({ error: 'Missing student field: uid' });
      if (!fullName && !normalizeText(data.first_name)) {
        return res.status(400).json({ error: 'Missing student name (first_name or name)' });
      }
      if (semester == null) {
        return res.status(400).json({ error: 'semester must be an integer between 1 and 8' });
      }
      if (!section) return res.status(400).json({ error: 'Missing student field: section' });
      if (yearOfAdmission == null) {
        return res.status(400).json({ error: 'year_of_admission must be between 2000 and 2100' });
      }

      username = uid;
      studentPayload = {
        uid,
        semester,
        section,
        year_of_admission: yearOfAdmission,
        first_name: normalizeText(data.first_name),
        middle_name: normalizeText(data.middle_name),
        last_name: normalizeText(data.last_name),
        name: fullName,
      };
    }

    if (role === 'faculty') {
      const email = normalizeText(data.email);
      const firstName = normalizeText(data.first_name);
      const lastName = normalizeText(data.last_name);
      const fallbackName = normalizeText(data.name);
      const contactNumber = normalizeText(data.contact_number);

      if (!email) return res.status(400).json({ error: 'Missing faculty field: email' });
      if (!isValidFacultyEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format, must end with @stvincentngp.edu.in' });
      }
      if (!firstName && !fallbackName) {
        return res.status(400).json({ error: 'Missing faculty name (first_name or name)' });
      }
      if (!hasValidContactNumber(contactNumber)) {
        return res.status(400).json({ error: 'contact_number must contain at least 10 digits' });
      }

      username = email;
      facultyPayload = {
        email,
        first_name: firstName,
        last_name: lastName,
        contact_number: contactNumber,
        name: fallbackName,
      };
    }

    if (role === 'admin' && !username) {
      return res.status(400).json({ error: 'Missing field: username' });
    }

    if (await User.findOne({ where: { username } })) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    if (studentPayload && (await Student.findOne({ where: { uid: studentPayload.uid } }))) {
      return res.status(400).json({ error: 'Student UID already exists' });
    }

    if (facultyPayload && (await Faculty.findOne({ where: { email: facultyPayload.email } }))) {
      return res.status(400).json({ error: 'Faculty email already exists' });
    }

    const tx = await sequelize.transaction();
    try {
      const user = await User.create(
        { username, password_hash: await bcrypt.hash(password, 10), role },
        { transaction: tx },
      );

      let response = {
        message: 'User created successfully',
        user: { id: user.id, username: user.username, role: user.role },
      };

      if (studentPayload) {
        const studentNames = studentPayload.first_name
          ? {
            first: studentPayload.first_name,
            middle: studentPayload.middle_name || '',
            last: studentPayload.last_name || '',
          }
          : splitFullName(studentPayload.name || '');

        const student = await Student.create(
          {
            uid: studentPayload.uid,
            first_name: studentNames.first_name || studentNames.first || '',
            middle_name: studentNames.middle_name || studentNames.middle || '',
            last_name: studentNames.last_name || studentNames.last || '',
            semester: studentPayload.semester,
            section: studentPayload.section,
            year_of_admission: studentPayload.year_of_admission,
            user_id: user.id,
          },
          { transaction: tx },
        );

        response = {
          ...response,
          message: 'User created successfully with student profile',
          student_profile: {
            uid: student.uid,
            first_name: student.first_name,
            middle_name: student.middle_name,
            last_name: student.last_name,
            semester: student.semester,
            section: student.section,
            year_of_admission: student.year_of_admission,
          },
        };
      }

      if (facultyPayload) {
        const facultyNames = facultyPayload.first_name
          ? { first: facultyPayload.first_name, last: facultyPayload.last_name || '' }
          : splitFullName(facultyPayload.name || '');

        const faculty = await Faculty.create(
          {
            email: facultyPayload.email,
            first_name: facultyNames.first_name || facultyNames.first || '',
            last_name: facultyNames.last_name || facultyNames.last || '',
            contact_number: facultyPayload.contact_number,
            user_id: user.id,
          },
          { transaction: tx },
        );

        response = {
          ...response,
          message: 'User created successfully with faculty profile',
          faculty_profile: {
            email: faculty.email,
            first_name: faculty.first_name,
            last_name: faculty.last_name,
            contact_number: faculty.contact_number,
          },
        };
      }

      await tx.commit();
      return res.status(201).json(response);
    } catch (error) {
      await tx.rollback();
      return res.status(500).json({ error: 'Database error while creating user' });
    }
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const user = await User.findByPk(userId, { include: ['student_profile', 'faculty_profile'] });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const data = req.body || {};
    if (!Object.keys(data).length) return res.status(400).json({ error: 'No data provided' });

    if ('role' in data && data.role !== user.role) {
      return res
        .status(400)
        .json({ error: 'Changing user role is not allowed. Delete and recreate the user with the new role.' });
    }

    if (user.role === 'student') {
      const student = user.student_profile;
      if (!student) return res.status(404).json({ error: 'Student profile not found' });

      if ('uid' in data) {
        if (await User.findOne({ where: { username: data.uid, id: { [Op.ne]: userId } } })) {
          return res.status(400).json({ error: 'UID already exists' });
        }
        user.username = data.uid;
        student.uid = data.uid;
      }

      if ('full_name' in data) {
        const names = splitFullName(data.full_name || '');
        student.first_name = names.first_name;
        student.middle_name = names.middle_name;
        student.last_name = names.last_name;
      }

      ['semester', 'section', 'year_of_admission'].forEach((field) => {
        if (field in data) student[field] = data[field] === '' ? null : data[field];
      });

      await user.save();
      await student.save();

      return res.status(200).json({
        message: 'Student updated successfully',
        student_profile: 'updated',
        user: {
          uid: student.uid,
          full_name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
          first_name: student.first_name,
          middle_name: student.middle_name,
          last_name: student.last_name,
          semester: student.semester,
          section: student.section,
          year_of_admission: student.year_of_admission,
        },
      });
    }

    if (user.role === 'faculty') {
      const faculty = user.faculty_profile;
      if (!faculty) return res.status(404).json({ error: 'Faculty profile not found' });

      if ('email' in data) {
        if (!String(data.email).endsWith('@stvincentngp.edu.in')) {
          return res.status(400).json({ error: 'Invalid email format, must end with @stvincentngp.edu.in' });
        }
        if (await User.findOne({ where: { username: data.email, id: { [Op.ne]: userId } } })) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        user.username = data.email;
        faculty.email = data.email;
      }

      ['first_name', 'last_name', 'contact_number'].forEach((field) => {
        if (field in data) faculty[field] = data[field] === '' ? null : data[field];
      });

      if (data.password) {
        user.password_hash = await bcrypt.hash(data.password, 10);
      }

      await user.save();
      await faculty.save();

      return res.status(200).json({
        message: 'Faculty updated successfully',
        faculty_profile: 'updated',
        user: {
          email: faculty.email,
          first_name: faculty.first_name,
          last_name: faculty.last_name,
          contact_number: faculty.contact_number,
        },
      });
    }

    return res.status(400).json({ error: 'Invalid user role' });
  } catch (error) {
    return res.status(500).json({ error: 'Database error' });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(Number(req.params.id), {
      include: ['student_profile', 'faculty_profile'],
    });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.id === req.currentUser.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const tx = await sequelize.transaction();
    try {
      // Nullify mentor references before deleting a faculty user so that
      // student.mentor_id is set to NULL (FK: ON DELETE SET NULL handles this
      // at the DB level, but we do it explicitly for clarity and safety).
      if (user.role === 'faculty' && user.faculty_profile) {
        await Student.update(
          { mentor_id: null },
          { where: { mentor_id: user.faculty_profile.id }, transaction: tx },
        );
        await user.faculty_profile.destroy({ transaction: tx });
      }

      if (user.role === 'student' && user.student_profile) {
        await user.student_profile.destroy({ transaction: tx });
      }

      await user.destroy({ transaction: tx });
      await tx.commit();
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (deleteError) {
      await tx.rollback();
      return res.status(500).json({ error: 'Database error', detail: deleteError.message });
    }
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { role, username, new_password } = req.body || {};

    if (!role || !['student', 'faculty'].includes(role)) {
      return res.status(400).json({ error: "Invalid or missing role. Must be 'student' or 'faculty'" });
    }
    if (!username) return res.status(400).json({ error: 'username is required' });

    const user = await User.findOne({ where: { username, role } });
    if (!user) return res.status(404).json({ error: `${role.charAt(0).toUpperCase() + role.slice(1)} with given username not found` });

    if (await verifyPassword(new_password || '', user.password_hash)) {
      return res.status(400).json({ error: 'New password cannot be the same as the old password' });
    }

    if ((new_password || '').length < 8) {
      return res.status(400).json({ error: 'The password must be of minimum 8 characters' });
    }

    user.password_hash = await bcrypt.hash(new_password, 10);
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    return next(error);
  }
};

const listFaculty = async (_req, res, next) => {
  try {
    const faculties = await Faculty.findAll({ include: [{ model: Student, as: 'mentees' }], order: [['id', 'ASC']] });

    const result = faculties.map((faculty) => ({
      id: faculty.id,
      uid: `FAC${String(faculty.id).padStart(3, '0')}`,
      name:
        `${faculty.first_name || ''} ${faculty.last_name || ''}`.trim() ||
        String(faculty.email).split('@')[0],
      firstName: faculty.first_name || String(faculty.email).split('@')[0],
      lastName: faculty.last_name || '',
      email: faculty.email,
      contact: faculty.contact_number || '+91 9876543210',
      studentsAssigned: (faculty.mentees || []).map((s) => s.uid),
    }));

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const listFacultyBasic = async (_req, res, next) => {
  try {
    const faculties = await Faculty.findAll({ order: [['id', 'ASC']] });
    return res.status(200).json(
      faculties.map((f) => ({
        id: f.id,
        email: f.email,
        first_name: f.first_name,
        last_name: f.last_name,
        contact_number: f.contact_number,
      })),
    );
  } catch (error) {
    return next(error);
  }
};

const listFacultyMentees = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByPk(Number(req.params.id));
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

    const mentees = await Student.findAll({ where: { mentor_id: faculty.id }, order: [['id', 'ASC']] });

    // Fetch ALL remarks dates for each mentee, sorted newest first
    const menteeIds = mentees.map((s) => s.id);
    const remarksDatesMap = {};
    if (menteeIds.length > 0) {
      const allMinutes = await MentoringMinute.findAll({
        where: {
          student_id: { [Op.in]: menteeIds },
          date: { [Op.ne]: null },
        },
        attributes: ['student_id', 'date'],
        order: [['date', 'DESC']],
      });
      for (const minute of allMinutes) {
        if (!remarksDatesMap[minute.student_id]) {
          remarksDatesMap[minute.student_id] = [];
        }
        remarksDatesMap[minute.student_id].push(minute.date);
      }
    }

    return res.status(200).json(
      mentees.map((s) => ({
        id: s.id,
        uid: s.uid,
        full_name: [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(' '),
        semester: s.semester,
        section: s.section,
        year_of_admission: s.year_of_admission,
        remarks_dates: remarksDatesMap[s.id] || [],
      })),
    );
  } catch (_error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const generateMentees = async (req, res, next) => {
  try {
    const facultyId = Number(req.params.id);
    const faculty = await Faculty.findByPk(facultyId);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

    const facultiesWithoutMentees = await Faculty.findAll({
      include: [{ model: Student, as: 'mentees', required: false }],
    });

    const zeroMentees = facultiesWithoutMentees.filter((f) => !(f.mentees || []).length);
    const n = zeroMentees.length;
    if (n === 0) return res.status(400).json({ error: 'No faculties without mentees to assign' });

    const unassigned = await Student.findAll({ where: { mentor_id: null } });
    const groups = unassigned.reduce((acc, s) => {
      const key = `${s.semester}::${s.section}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {});

    const result = [];
    Object.values(groups).forEach((students) => {
      const m = students.length;
      const k = Math.floor(m / n);
      if (k === 0) return;

      const shuffled = [...students];
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      shuffled.slice(0, k).forEach((student) => {
        result.push({
          id: student.id,
          uid: student.uid,
          full_name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
          semester: student.semester,
          section: student.section,
          year_of_admission: student.year_of_admission,
        });
      });
    });

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const confirmMentees = async (req, res, next) => {
  try {
    const facultyId = Number(req.params.id);
    const faculty = await Faculty.findByPk(facultyId);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

    const data = req.body || {};
    if (!('student_ids' in data)) return res.status(400).json({ error: 'Missing student_ids list' });
    if (!Array.isArray(data.student_ids)) return res.status(400).json({ error: 'student_ids must be a list' });

    const students = await Student.findAll({ where: { id: { [Op.in]: data.student_ids } } });
    if (students.length !== data.student_ids.length) {
      return res.status(404).json({ error: 'One or more student IDs not found' });
    }

    const tx = await sequelize.transaction();
    try {
      await Student.update({ mentor_id: facultyId }, { where: { id: { [Op.in]: data.student_ids } }, transaction: tx });
      await tx.commit();
    } catch (_error) {
      await tx.rollback();
      return res.status(500).json({ error: 'Database error during assignment' });
    }

    return res.status(200).json({ message: `Assigned ${students.length} mentees to faculty ${facultyId} successfully.` });
  } catch (error) {
    return next(error);
  }
};

const removeMentees = async (req, res, next) => {
  try {
    const facultyId = Number(req.params.id);
    const faculty = await Faculty.findByPk(facultyId);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

    const data = req.body || {};
    if (!('student_ids' in data)) return res.status(400).json({ error: 'Missing student_ids list' });
    if (!Array.isArray(data.student_ids)) return res.status(400).json({ error: 'student_ids must be a list' });

    const idsAreNumeric = data.student_ids.every((x) => Number.isFinite(Number(x)));
    const whereClause = idsAreNumeric
      ? { id: { [Op.in]: data.student_ids.map(Number) }, mentor_id: facultyId }
      : { uid: { [Op.in]: data.student_ids }, mentor_id: facultyId };

    const students = await Student.findAll({ where: whereClause });
    if (students.length !== data.student_ids.length) {
      return res.status(404).json({ error: 'One or more student IDs not found' });
    }

    try {
      await Student.update({ mentor_id: null }, { where: whereClause });
      return res.status(200).json({
        message: `Removed ${students.length} mentee assignments from faculty ${facultyId} successfully.`,
        removed_student_ids: data.student_ids,
      });
    } catch (_error) {
      return res.status(500).json({ error: 'Database error during removal' });
    }
  } catch (error) {
    return next(error);
  }
};

const listAllocation = async (_req, res, next) => {
  try {
    const faculties = await Faculty.findAll({
      include: [{ model: Student, as: 'mentees', attributes: ['id'], required: false }],
      order: [['id', 'ASC']],
    });

    const result = faculties.map((f) => ({
      faculty_id: f.id,
      faculty_name:
        `${f.first_name || ''} ${f.last_name || ''}`.trim() || String(f.email).split('@')[0],
      email: f.email,
      assigned_count: (f.mentees || []).length,
      capacity: 30,
    }));

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
};

const generateAllocation = async (req, res, next) => {
  try {
    const facultyId = Number(req.body?.faculty_id);
    if (!facultyId) return res.status(400).json({ error: 'faculty_id is required' });

    const faculty = await Faculty.findByPk(facultyId);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

    const faculties = await Faculty.findAll({
      include: [{ model: Student, as: 'mentees', attributes: ['id'], required: false }],
      order: [['id', 'ASC']],
    });
    const selectedFaculty = faculties.find((f) => f.id === facultyId) || faculty;
    const assignedCount = (selectedFaculty.mentees || []).length;
    const capacity = 30;
    const remainingCapacity = Math.max(0, capacity - assignedCount);

    if (remainingCapacity === 0) {
      return res.status(400).json({ error: 'Selected faculty has no remaining capacity' });
    }

    const unassigned = await Student.findAll({
      where: { mentor_id: null },
      order: [['id', 'ASC']],
    });

    if (!unassigned.length) {
      return res.status(404).json({ error: 'No unassigned students available' });
    }

    // Group by semester + section and spread suggestions across the remaining seats.
    const grouped = unassigned.reduce((acc, s) => {
      const key = `${s.semester ?? 'NA'}::${s.section ?? 'NA'}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {});

    const suggestions = [];
    const buckets = Object.values(grouped).map((students) => {
      const shuffled = [...students];
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      return shuffled;
    });

    let bucketIndex = 0;
    while (suggestions.length < remainingCapacity && buckets.some((bucket) => bucket.length > 0)) {
      const bucket = buckets[bucketIndex % buckets.length];
      bucketIndex += 1;

      const student = bucket.shift();
      if (!student) continue;

      suggestions.push({
        id: student.id,
        uid: student.uid,
        name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
      });
    }

    return res.status(200).json(suggestions);
  } catch (error) {
    return next(error);
  }
};

const autoAllocateUnassigned = async (req, res, next) => {
  try {
    const preview = req.body?.preview === true;

    // Fetch all unassigned students
    const unassigned = await Student.findAll({
      where: { mentor_id: null },
      order: [['semester', 'ASC'], ['section', 'ASC'], ['id', 'ASC']],
    });

    if (!unassigned.length) {
      return res.status(200).json({
        message: 'All students are already assigned to mentors.',
        unassigned_count: 0,
        distributed_count: 0,
        allocations: [],
      });
    }

    // Fetch all faculty members with current assigned mentees
    const faculties = await Faculty.findAll({
      include: [{ model: Student, as: 'mentees', attributes: ['id'], required: false }],
      order: [['id', 'ASC']],
    });

    if (!faculties.length) {
      return res.status(400).json({ error: 'No faculty records available for allocation' });
    }

    const CAPACITY = 30;

    const facultyState = faculties.map((f) => ({
      faculty_id: f.id,
      faculty_name: `${f.first_name || ''} ${f.last_name || ''}`.trim() || String(f.email).split('@')[0],
      email: f.email,
      initial_count: (f.mentees || []).length,
      current_count: (f.mentees || []).length,
      capacity: CAPACITY,
      assigned_students: [],
    }));

    const eligibleFaculty = facultyState.filter((f) => f.current_count < CAPACITY);
    if (!eligibleFaculty.length) {
      return res.status(400).json({ error: 'All faculty members have reached maximum capacity (30).' });
    }

    // Group unassigned students by semester + section to maintain balanced section mix
    const grouped = unassigned.reduce((acc, s) => {
      const key = `${s.semester ?? 'NA'}::${s.section ?? 'NA'}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    }, {});

    const buckets = Object.values(grouped).map((students) => {
      const shuffled = [...students];
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });

    const orderedStudents = [];
    let bIndex = 0;
    while (buckets.some((b) => b.length > 0)) {
      const b = buckets[bIndex % buckets.length];
      bIndex += 1;
      const st = b.shift();
      if (st) orderedStudents.push(st);
    }

    for (const student of orderedStudents) {
      const available = facultyState.filter((f) => f.current_count < CAPACITY);
      if (!available.length) break;

      available.sort((a, b) => a.current_count - b.current_count);
      const minCount = available[0].current_count;

      const tiedCandidates = available.filter((f) => f.current_count === minCount);
      const targetFaculty = tiedCandidates[Math.floor(Math.random() * tiedCandidates.length)];

      targetFaculty.current_count += 1;
      targetFaculty.assigned_students.push({
        id: student.id,
        uid: student.uid,
        name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
      });
    }

    const summaryAllocations = facultyState.map((f) => ({
      faculty_id: f.faculty_id,
      faculty_name: f.faculty_name,
      email: f.email,
      initial_count: f.initial_count,
      new_assigned_count: f.assigned_students.length,
      final_count: f.current_count,
      capacity: f.capacity,
      student_ids: f.assigned_students.map((s) => s.id),
      students: f.assigned_students,
    }));

    const totalAssigned = summaryAllocations.reduce((sum, item) => sum + item.new_assigned_count, 0);

    if (preview) {
      return res.status(200).json({
        message: `Preview: Distributed ${totalAssigned} unassigned students across faculty.`,
        unassigned_count: unassigned.length,
        distributed_count: totalAssigned,
        allocations: summaryAllocations.filter((a) => a.new_assigned_count > 0),
        all_faculty: summaryAllocations,
      });
    }

    await sequelize.transaction(async (tx) => {
      for (const f of summaryAllocations) {
        if (f.student_ids.length > 0) {
          await Student.update(
            { mentor_id: f.faculty_id },
            { where: { id: { [Op.in]: f.student_ids } }, transaction: tx },
          );
        }
      }
    });

    return res.status(200).json({
      message: `Successfully distributed ${totalAssigned} unassigned students among faculty.`,
      unassigned_count: unassigned.length,
      distributed_count: totalAssigned,
      allocations: summaryAllocations.filter((a) => a.new_assigned_count > 0),
    });
  } catch (error) {
    return next(error);
  }
};

const confirmAllocation = async (req, res, next) => {
  try {
    const facultyId = Number(req.body?.faculty_id);
    const studentIds = req.body?.student_ids;

    if (!facultyId) return res.status(400).json({ error: 'faculty_id is required' });
    if (!Array.isArray(studentIds)) return res.status(400).json({ error: 'student_ids must be a list' });
    if (!studentIds.length) return res.status(400).json({ error: 'student_ids cannot be empty' });

    const faculty = await Faculty.findByPk(facultyId);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

    const students = await Student.findAll({ where: { id: { [Op.in]: studentIds } } });
    if (students.length !== studentIds.length) {
      return res.status(404).json({ error: 'One or more student IDs not found' });
    }

    await sequelize.transaction(async (tx) => {
      await Student.update(
        { mentor_id: facultyId },
        { where: { id: { [Op.in]: studentIds } }, transaction: tx },
      );
    });

    return res.status(200).json({ message: `Assigned ${studentIds.length} students to faculty ${facultyId}` });
  } catch (error) {
    return next(error);
  }
};

const removeAllocation = async (req, res, next) => {
  try {
    const facultyId = Number(req.body?.faculty_id);
    const studentIds = req.body?.student_ids;

    if (!facultyId) return res.status(400).json({ error: 'faculty_id is required' });
    if (!Array.isArray(studentIds)) return res.status(400).json({ error: 'student_ids must be a list' });
    if (!studentIds.length) return res.status(400).json({ error: 'student_ids cannot be empty' });

    const faculty = await Faculty.findByPk(facultyId);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

    const students = await Student.findAll({
      where: { id: { [Op.in]: studentIds }, mentor_id: facultyId },
    });
    if (students.length !== studentIds.length) {
      return res.status(404).json({ error: 'One or more student IDs not assigned to this faculty' });
    }

    await sequelize.transaction(async (tx) => {
      await Student.update(
        { mentor_id: null },
        { where: { id: { [Op.in]: studentIds }, mentor_id: facultyId }, transaction: tx },
      );
    });

    return res.status(200).json({ message: `Removed ${studentIds.length} students from faculty ${facultyId}` });
  } catch (error) {
    return next(error);
  }
};

const listAllocationAssignedStudents = async (req, res, next) => {
  try {
    const facultyId = Number(req.params.faculty_id);
    if (!facultyId) return res.status(400).json({ error: 'Invalid faculty_id' });

    const faculty = await Faculty.findByPk(facultyId);
    if (!faculty) return res.status(404).json({ error: 'Faculty not found' });

    const students = await Student.findAll({
      where: { mentor_id: facultyId },
      order: [['id', 'ASC']],
    });

    return res.status(200).json(
      students.map((s) => ({
        id: s.id,
        uid: s.uid,
        name: [s.first_name, s.middle_name, s.last_name].filter(Boolean).join(' '),
      })),
    );
  } catch (error) {
    return next(error);
  }
};

const deleteStudentByUid = async (req, res, next) => {
  try {
    const student = await Student.findOne({ where: { uid: req.params.uid }, include: ['user'] });
    if (!student) return res.status(404).json({ error: 'Not found' });

    if (student.user) await student.user.destroy();
    await student.destroy();

    return res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

const deleteFacultyById = async (req, res, next) => {
  try {
    const faculty = await Faculty.findByPk(Number(req.params.id), { include: ['user'] });
    if (!faculty) return res.status(404).json({ error: 'Not found' });

    if (faculty.user) await faculty.user.destroy();
    await faculty.destroy();

    return res.json({ message: 'Faculty deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

// ─── Admin: Student Remarks Timeline ─────────────────────────────────────────
const { getStudentRemarks } = require('../services/adminStudentRemarks.service');
const logger = require('../utils/logger');
const { sendResponse } = require('../utils/responseWrapper');

/**
 * GET /api/admin/students/:uid/remarks
 *
 * Returns all mentoring-minute records for a student, newest first, with
 * pagination.  Faculty metadata falls back to snapshot fields when the
 * faculty account has been deleted.
 */
const getAdminStudentRemarks = async (req, res, next) => {
  try {
    const result = await getStudentRemarks({
      uid: req.params.uid,
      rawLimit: req.query.limit,
      rawOffset: req.query.offset,
    });

    if (!result.ok) {
      return sendResponse(res, { success: false, status: result.status, error: result.error });
    }

    return sendResponse(res, { success: true, data: result.data });
  } catch (error) {
    logger.error({ reqId: req.id, message: 'GET /admin/students/:uid/remarks failed', details: error.message });
    return next(error);
  }
};



module.exports = { getMissingRequiredFields };