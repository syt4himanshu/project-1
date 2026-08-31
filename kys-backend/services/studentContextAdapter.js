/**
 * Normalizes student context from heterogeneous sources into the shape
 * expected by buildUserMessage() in groq.service.js.
 *
 * INPUT (facultyChatbot.model.js — chatbot path):
 *   academics[], career_objective, recent_mentoring_minutes,
 *   skills.{ programming_languages, technologies_frameworks, domains_of_interest, ... }
 *
 * INPUT (may also accept pre-adapted ai-remarks fields):
 *   academicRecords[], careerObjective, recentMinutes,
 *   skills.{ programming, technologies, domains, tools }
 *
 * OUTPUT (prompt-ready student record):
 *   academicRecords[], careerObjective, recentMinutes,
 *   skills.{ programming, technologies, domains, tools }, cgpa, program, ...
 *
 * Data integrity: absent fields remain absent (undefined). No defaults,
 * guesses, or fabricated values (no "N/A", 0, or empty-string placeholders).
 */

const isPresent = (value) => value !== null && value !== undefined && value !== '';

const pickDefined = (entries) =>
  Object.fromEntries(
    Object.entries(entries).filter(([, value]) => isPresent(value)),
  );

const parsePositiveSgpa = (value) => {
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
};

/**
 * Derive CGPA only from recorded SGPA values. Returns undefined when none exist.
 */
const deriveCgpaFromAcademicRecords = (records) => {
  if (!Array.isArray(records) || records.length === 0) {
    return undefined;
  }

  const sgpas = records
    .map((record) => parsePositiveSgpa(record.sgpa))
    .filter((value) => value !== null);

  if (sgpas.length === 0) {
    return undefined;
  }

  const average = sgpas.reduce((sum, value) => sum + value, 0) / sgpas.length;
  return average.toFixed(2);
};

const mapAcademicRecords = (student) => {
  const source = student.academics ?? student.academicRecords ?? [];
  if (!Array.isArray(source) || source.length === 0) {
    return undefined;
  }

  const records = source
    .map((row) =>
      pickDefined({
        semester: row.semester,
        sgpa: row.sgpa,
        backlogs: row.backlog_subjects ?? row.backlogs,
      }),
    )
    .filter((row) => Object.keys(row).length > 0);

  return records.length > 0 ? records : undefined;
};

const mapSkills = (skills) => {
  if (!skills || typeof skills !== 'object') {
    return undefined;
  }

  const mapped = pickDefined({
    programming: skills.programming ?? skills.programming_languages,
    technologies: skills.technologies ?? skills.technologies_frameworks,
    domains: skills.domains ?? skills.domains_of_interest,
    tools: skills.tools ?? skills.familiar_tools_platforms,
  });

  return Object.keys(mapped).length > 0 ? mapped : undefined;
};

const mapCareerObjective = (student) => {
  const source = student.career_objective ?? student.careerObjective;
  if (!source || typeof source !== 'object') {
    return undefined;
  }

  const placementInterest =
    typeof source.interested_in_campus_placement === 'boolean'
      ? source.interested_in_campus_placement
        ? 'Yes'
        : 'No'
      : source.placement_interest;

  const mapped = pickDefined({
    goal: source.career_goal ?? source.goal,
    details: source.specific_details ?? source.details,
    placement_interest: placementInterest,
    clarity_preparedness: source.clarity_preparedness,
  });

  return Object.keys(mapped).length > 0 ? mapped : undefined;
};

const mapSwoc = (swoc) => {
  if (!swoc || typeof swoc !== 'object') {
    return undefined;
  }

  const mapped = pickDefined({
    strengths: swoc.strengths,
    weaknesses: swoc.weaknesses,
    opportunities: swoc.opportunities,
    challenges: swoc.challenges,
  });

  return Object.keys(mapped).length > 0 ? mapped : undefined;
};

const mapProjects = (projects) => {
  if (!Array.isArray(projects) || projects.length === 0) {
    return undefined;
  }

  const mapped = projects
    .map((project) =>
      pickDefined({
        title: project.title,
        description: project.description,
      }),
    )
    .filter((project) => Object.keys(project).length > 0);

  return mapped.length > 0 ? mapped : undefined;
};

const mapInternships = (internships) => {
  if (!Array.isArray(internships) || internships.length === 0) {
    return undefined;
  }

  const mapped = internships
    .map((internship) =>
      pickDefined({
        title: internship.title ?? internship.company_name,
        description: internship.description,
        domain: internship.domain,
        internship_type: internship.internship_type,
        paid_unpaid: internship.paid_unpaid,
      }),
    )
    .filter((internship) => Object.keys(internship).length > 0);

  return mapped.length > 0 ? mapped : undefined;
};

const mapRecentMinutes = (student) => {
  const source = student.recent_mentoring_minutes ?? student.recentMinutes ?? [];
  if (!Array.isArray(source) || source.length === 0) {
    return undefined;
  }

  const mapped = source
    .map((minute) =>
      pickDefined({
        date: minute.date,
        remarks: minute.remarks,
        suggestion: minute.suggestion,
        action: minute.action,
      }),
    )
    .filter((minute) => Object.keys(minute).length > 0);

  return mapped.length > 0 ? mapped : undefined;
};

const resolveCgpa = (student, academicRecords) => {
  if (isPresent(student.cgpa) && student.cgpa !== 'N/A') {
    return student.cgpa;
  }

  return deriveCgpaFromAcademicRecords(academicRecords);
};

/**
 * @param {object} student - Raw or partially adapted student record
 * @returns {object} Prompt-ready student record for buildUserMessage()
 */
const normalizeStudentRecord = (student) => {
  if (!student || typeof student !== 'object') {
    return {};
  }

  const academicRecords = mapAcademicRecords(student);
  const skills = mapSkills(student.skills);
  const careerObjective = mapCareerObjective(student);
  const swoc = mapSwoc(student.swoc);
  const projects = mapProjects(student.projects);
  const internships = mapInternships(student.internships);
  const recentMinutes = mapRecentMinutes(student);
  const cgpa = resolveCgpa(student, academicRecords);

  return pickDefined({
    id: student.id,
    uid: student.uid,
    name: student.name,
    semester: student.semester,
    section: student.section,
    year_of_admission: student.year_of_admission,
    program: student.program,
    cgpa,
    academicRecords,
    skills,
    careerObjective,
    swoc,
    projects,
    internships,
    recentMinutes,
  });
};

/**
 * @param {{ students?: object[], total_students?: number, student_limit?: number }} dataset
 * @returns {{ students: object[], total_students?: number, student_limit?: number }}
 */
const adaptStudentDataset = (dataset) => {
  const students = Array.isArray(dataset?.students)
    ? dataset.students.map(normalizeStudentRecord)
    : [];

  return pickDefined({
    total_students: dataset?.total_students,
    student_limit: dataset?.student_limit,
    students,
  });
};

module.exports = {
  normalizeStudentRecord,
  adaptStudentDataset,
  deriveCgpaFromAcademicRecords,
};
