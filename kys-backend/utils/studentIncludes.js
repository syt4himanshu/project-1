const {
  User,
  Faculty,
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
} = require('../models');

const fullStudentIncludes = () => [
  { model: User, attributes: ['id', 'username', 'role', 'active'] },
  { model: Faculty, as: 'mentor', attributes: ['id', 'first_name', 'last_name', 'email'] },
  { model: StudentPersonalInfo },
  { model: PastEducation },
  { model: PostAdmissionAcademicRecord },
  { model: Project },
  { model: Internship },
  { model: CoCurricularParticipation },
  { model: CoCurricularOrganization },
  { model: CareerObjective },
  { model: Skills },
  { model: SWOC },
  { model: MentoringMinute, include: [{ model: Faculty, attributes: ['id', 'first_name', 'last_name'] }] },
];

module.exports = { fullStudentIncludes };
