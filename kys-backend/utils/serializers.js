const { serializeModel, buildFullName } = require('./helpers');

const serializeStudent = (student, { includeIds = false } = {}) => {
  const payload = {
    uid: student.uid,
    full_name: buildFullName(student.first_name, student.middle_name, student.last_name),
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
  };

  if (includeIds) {
    payload.id = student.id;
    payload.first_name = student.first_name;
    payload.middle_name = student.middle_name;
    payload.last_name = student.last_name;
  }

  return payload;
};

module.exports = {
  serializeStudent,
};
