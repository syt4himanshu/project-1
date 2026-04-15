const { serializeModel, buildFullName } = require('./helpers');
const { decodeStudentProfilePayload } = require('./profileCodec');

const normalizeText = (value) => (typeof value === 'string' ? value.trim() : '');

const isPlaceholder = (value) => {
  const text = normalizeText(value).toLowerCase();
  return !text || text === 'n/a' || text === 'na' || text === 'none' || text === '-' || text === '--';
};

const facultyFallbackName = (mentor) => {
  const email = normalizeText(mentor?.email);
  if (email.includes('@')) return email.split('@')[0];
  return '';
};

const mentorName = (student) => {
  if (!student?.mentor) return '';
  const fullName = buildFullName(student.mentor.first_name, '', student.mentor.last_name);
  if (!isPlaceholder(fullName)) return fullName;
  return facultyFallbackName(student.mentor);
};

const domainOfInterest = (student) =>
  normalizeText(student?.skills?.domains_of_interest) ||
  normalizeText(student?.skills?.domain_of_interest) ||
  '';

const careerGoal = (student) => normalizeText(student?.career_objective?.career_goal);

const studentDisplayName = (student) =>
  buildFullName(student?.first_name, student?.middle_name, student?.last_name) ||
  normalizeText(student?.uid) ||
  '';

const serializeStudent = (student, { includeIds = false } = {}) => {
  const payload = {
    uid: student.uid,
    full_name: studentDisplayName(student),
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
    mentor_id: student.mentor_id,
    mentor_name: mentorName(student),
    career_goal: careerGoal(student),
    domain_of_interest: domainOfInterest(student),
  };

  if (includeIds) {
    payload.id = student.id;
    payload.first_name = student.first_name;
    payload.middle_name = student.middle_name;
    payload.last_name = student.last_name;
  }

  return decodeStudentProfilePayload(payload);
};

const serializeStudentSummary = (student) => ({
  id: student.id,
  uid: student.uid,
  full_name: studentDisplayName(student),
  name: studentDisplayName(student),
  semester: student.semester,
  section: student.section,
  year_of_admission: student.year_of_admission,
  mentor_id: student.mentor_id,
  mentor_name: mentorName(student),
  career_goal: careerGoal(student),
  domain_of_interest: domainOfInterest(student),
});

module.exports = {
  serializeStudent,
  serializeStudentSummary,
};
