const { QueryTypes } = require('sequelize');
const { sequelize, Faculty } = require('./index');

const MAX_STUDENTS = 20;
const MAX_TEXT_FIELD_LENGTH = 240;
const MAX_LIST_ITEMS = 5;

const sanitizeText = (value, maxLength = MAX_TEXT_FIELD_LENGTH) => {
  if (!value) return null;
  const cleaned = String(value).replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return null;
  return cleaned.slice(0, maxLength);
};

const safeList = (rows, mapper, maxItems = MAX_LIST_ITEMS) => (rows || []).slice(0, maxItems).map(mapper);

const groupByStudentId = (rows) =>
  rows.reduce((acc, row) => {
    const key = Number(row.student_id);
    if (!acc.has(key)) acc.set(key, []);
    acc.get(key).push(row);
    return acc;
  }, new Map());

const getFacultyByUserId = async (userId) => Faculty.findOne({ where: { user_id: userId }, attributes: ['id', 'first_name', 'last_name'] });

const resolveAuthorizedStudentIds = async ({ facultyId, studentId }) => {
  const trimmedId = typeof studentId === 'string' ? studentId.trim() : '';

  if (!trimmedId) {
    const rows = await sequelize.query(
      `
      SELECT s.id
      FROM student s
      WHERE s.mentor_id = :facultyId
      ORDER BY s.id ASC
      LIMIT :maxStudents
      `,
      {
        type: QueryTypes.SELECT,
        replacements: {
          facultyId,
          maxStudents: MAX_STUDENTS,
        },
      },
    );
    return rows.map((row) => Number(row.id));
  }

  const studentNumericId = Number(trimmedId);
  const rows = await sequelize.query(
    `
    SELECT s.id
    FROM student s
    WHERE s.mentor_id = :facultyId
      AND (
        (:studentNumericId IS NOT NULL AND s.id = :studentNumericId)
        OR s.uid = :studentUid
      )
    LIMIT 1
    `,
    {
      type: QueryTypes.SELECT,
      replacements: {
        facultyId,
        studentUid: trimmedId,
        studentNumericId: Number.isFinite(studentNumericId) ? studentNumericId : null,
      },
    },
  );

  return rows.map((row) => Number(row.id));
};

const getSanitizedStudentDataset = async (studentIds) => {
  if (!Array.isArray(studentIds) || !studentIds.length) return [];

  const students = await sequelize.query(
    `
    SELECT s.id, s.uid, s.first_name, s.middle_name, s.last_name, s.semester, s.section, s.year_of_admission
    FROM student s
    WHERE s.id IN (:studentIds)
    ORDER BY s.id ASC
    LIMIT :maxStudents
    `,
    {
      type: QueryTypes.SELECT,
      replacements: { studentIds, maxStudents: MAX_STUDENTS },
    },
  );

  const personalInfos = await sequelize.query(
    `
    SELECT spi.student_id, spi.gender, spi.blood_group, spi.category
    FROM student_personal_info spi
    WHERE spi.student_id IN (:studentIds)
    `,
    {
      type: QueryTypes.SELECT,
      replacements: { studentIds },
    },
  );

  const skills = await sequelize.query(
    `
    SELECT sk.student_id, sk.programming_languages, sk.technologies_frameworks, sk.domains_of_interest, sk.familiar_tools_platforms
    FROM skills sk
    WHERE sk.student_id IN (:studentIds)
    `,
    {
      type: QueryTypes.SELECT,
      replacements: { studentIds },
    },
  );

  const swoc = await sequelize.query(
    `
    SELECT sw.student_id, sw.strengths, sw.weaknesses, sw.opportunities, sw.challenges
    FROM swoc sw
    WHERE sw.student_id IN (:studentIds)
    `,
    {
      type: QueryTypes.SELECT,
      replacements: { studentIds },
    },
  );

  const careerObjectives = await sequelize.query(
    `
    SELECT co.student_id, co.career_goal, co.specific_details, co.clarity_preparedness
    FROM career_objective co
    WHERE co.student_id IN (:studentIds)
    `,
    {
      type: QueryTypes.SELECT,
      replacements: { studentIds },
    },
  );

  const academicRecords = await sequelize.query(
    `
    SELECT pa.student_id, pa.semester, pa.sgpa, pa.backlog_subjects
    FROM post_admission_academic_record pa
    WHERE pa.student_id IN (:studentIds)
    ORDER BY pa.student_id ASC, pa.semester DESC
    `,
    {
      type: QueryTypes.SELECT,
      replacements: { studentIds },
    },
  );

  const internships = await sequelize.query(
    `
    SELECT i.student_id, i.company_name, i.domain, i.internship_type, i.paid_unpaid
    FROM internship i
    WHERE i.student_id IN (:studentIds)
    ORDER BY i.student_id ASC, i.id DESC
    `,
    {
      type: QueryTypes.SELECT,
      replacements: { studentIds },
    },
  );

  const projects = await sequelize.query(
    `
    SELECT p.student_id, p.title, p.description
    FROM project p
    WHERE p.student_id IN (:studentIds)
    ORDER BY p.student_id ASC, p.id DESC
    `,
    {
      type: QueryTypes.SELECT,
      replacements: { studentIds },
    },
  );

  const mentoringMinutes = await sequelize.query(
    `
    SELECT mm.student_id, mm.date, mm.remarks, mm.suggestion, mm.action
    FROM mentoring_minute mm
    WHERE mm.student_id IN (:studentIds)
    ORDER BY mm.student_id ASC, mm.date DESC, mm.id DESC
    `,
    {
      type: QueryTypes.SELECT,
      replacements: { studentIds },
    },
  );

  const infoById = new Map(personalInfos.map((row) => [Number(row.student_id), row]));
  const skillsById = new Map(skills.map((row) => [Number(row.student_id), row]));
  const swocById = new Map(swoc.map((row) => [Number(row.student_id), row]));
  const careerById = new Map(careerObjectives.map((row) => [Number(row.student_id), row]));
  const academicsById = groupByStudentId(academicRecords);
  const internshipsById = groupByStudentId(internships);
  const projectsById = groupByStudentId(projects);
  const minutesById = groupByStudentId(mentoringMinutes);

  return students.map((student) => {
    const id = Number(student.id);
    const studentInfo = infoById.get(id);
    const studentSkills = skillsById.get(id);
    const studentSwoc = swocById.get(id);
    const studentCareer = careerById.get(id);

    return {
      id,
      uid: student.uid,
      name: [student.first_name, student.middle_name, student.last_name].filter(Boolean).join(' '),
      semester: student.semester,
      section: student.section,
      year_of_admission: student.year_of_admission,
      profile: studentInfo
        ? {
            gender: studentInfo.gender || null,
            blood_group: studentInfo.blood_group || null,
            category: studentInfo.category || null,
          }
        : null,
      academics: safeList(
        academicsById.get(id),
        (row) => ({
          semester: row.semester,
          sgpa: row.sgpa,
          backlog_subjects: sanitizeText(row.backlog_subjects, 160),
        }),
        8,
      ),
      skills: studentSkills
        ? {
            programming_languages: sanitizeText(studentSkills.programming_languages),
            technologies_frameworks: sanitizeText(studentSkills.technologies_frameworks),
            domains_of_interest: sanitizeText(studentSkills.domains_of_interest),
            familiar_tools_platforms: sanitizeText(studentSkills.familiar_tools_platforms),
          }
        : null,
      swoc: studentSwoc
        ? {
            strengths: sanitizeText(studentSwoc.strengths),
            weaknesses: sanitizeText(studentSwoc.weaknesses),
            opportunities: sanitizeText(studentSwoc.opportunities),
            challenges: sanitizeText(studentSwoc.challenges),
          }
        : null,
      career_objective: studentCareer
        ? {
            career_goal: sanitizeText(studentCareer.career_goal, 80),
            specific_details: sanitizeText(studentCareer.specific_details),
            clarity_preparedness: sanitizeText(studentCareer.clarity_preparedness, 80),
          }
        : null,
      projects: safeList(projectsById.get(id), (row) => ({
        title: sanitizeText(row.title, 120),
        description: sanitizeText(row.description),
      })),
      internships: safeList(internshipsById.get(id), (row) => ({
        company_name: sanitizeText(row.company_name, 120),
        domain: sanitizeText(row.domain, 120),
        internship_type: sanitizeText(row.internship_type, 40),
        paid_unpaid: sanitizeText(row.paid_unpaid, 20),
      })),
      recent_mentoring_minutes: safeList(minutesById.get(id), (row) => ({
        date: row.date,
        remarks: sanitizeText(row.remarks),
        suggestion: sanitizeText(row.suggestion),
        action: sanitizeText(row.action),
      })),
    };
  });
};

module.exports = {
  MAX_STUDENTS,
  getFacultyByUserId,
  resolveAuthorizedStudentIds,
  getSanitizedStudentDataset,
};
