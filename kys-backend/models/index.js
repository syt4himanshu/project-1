const sequelize = require('../config/database');

const User = require('./User');
const Student = require('./Student');
const Faculty = require('./Faculty');
const StudentPersonalInfo = require('./StudentPersonalInfo');
const PastEducation = require('./PastEducation');
const PostAdmissionAcademicRecord = require('./PostAdmissionAcademicRecord');
const Project = require('./Project');
const Internship = require('./Internship');
const CoCurricularParticipation = require('./CoCurricularParticipation');
const CoCurricularOrganization = require('./CoCurricularOrganization');
const CareerObjective = require('./CareerObjective');
const Skills = require('./Skills');
const SWOC = require('./SWOC');
const MentoringMinute = require('./MentoringMinute');
const CareerActivity = require('./CareerActivity');
const CareerDevActivity = require('./CareerDevActivity');
const PasswordResetToken = require('./PasswordResetToken');
const SupportPlan = require('./SupportPlan');
const IdempotencyKey = require('./IdempotencyKey');

[
  User,
  Faculty,
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
  CareerActivity,
  CareerDevActivity,
  PasswordResetToken,
  SupportPlan,
  IdempotencyKey,
].forEach((model) => model.initModel(sequelize));

User.hasOne(Student, { foreignKey: 'user_id', as: 'student_profile', onDelete: 'CASCADE' });
Student.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(Faculty, { foreignKey: 'user_id', as: 'faculty_profile', onDelete: 'CASCADE' });
Faculty.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Faculty.hasMany(Student, { foreignKey: 'mentor_id', as: 'mentees' });
Student.belongsTo(Faculty, { foreignKey: 'mentor_id', as: 'mentor' });
Student.belongsTo(Faculty, { foreignKey: 'profile_locked_by', as: 'locked_by_faculty', onDelete: 'SET NULL' });

Student.hasOne(StudentPersonalInfo, { foreignKey: 'student_id', as: 'personal_info', onDelete: 'CASCADE' });
StudentPersonalInfo.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Student.hasMany(PastEducation, { foreignKey: 'student_id', as: 'past_education_records', onDelete: 'CASCADE' });
PastEducation.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Student.hasMany(PostAdmissionAcademicRecord, {
  foreignKey: 'student_id',
  as: 'post_admission_records',
  onDelete: 'CASCADE',
});
PostAdmissionAcademicRecord.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Student.hasMany(Project, { foreignKey: 'student_id', as: 'projects', onDelete: 'CASCADE' });
Project.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Student.hasMany(Internship, { foreignKey: 'student_id', as: 'internships', onDelete: 'CASCADE' });
Internship.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Student.hasMany(CoCurricularParticipation, {
  foreignKey: 'student_id',
  as: 'cocurricular_participations',
  onDelete: 'CASCADE',
});
CoCurricularParticipation.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Student.hasMany(CoCurricularOrganization, {
  foreignKey: 'student_id',
  as: 'cocurricular_organizations',
  onDelete: 'CASCADE',
});
CoCurricularOrganization.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Student.hasOne(CareerObjective, { foreignKey: 'student_id', as: 'career_objective', onDelete: 'CASCADE' });
CareerObjective.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Student.hasOne(Skills, { foreignKey: 'student_id', as: 'skills', onDelete: 'CASCADE' });
Skills.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Student.hasOne(SWOC, { foreignKey: 'student_id', as: 'swoc', onDelete: 'CASCADE' });
SWOC.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Student.hasMany(MentoringMinute, { foreignKey: 'student_id', as: 'mentoring_minutes', onDelete: 'CASCADE' });
MentoringMinute.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Faculty.hasMany(MentoringMinute, { foreignKey: 'faculty_id', as: 'mentoring_minutes_written', onDelete: 'SET NULL' });
MentoringMinute.belongsTo(Faculty, { foreignKey: 'faculty_id', as: 'faculty', onDelete: 'SET NULL' });

Student.hasMany(CareerActivity, { foreignKey: 'student_id', as: 'career_activities', onDelete: 'CASCADE' });
CareerActivity.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

Student.hasMany(CareerDevActivity, { foreignKey: 'student_id', as: 'career_dev_activities', onDelete: 'CASCADE' });
CareerDevActivity.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

User.hasMany(PasswordResetToken, { foreignKey: 'user_id', as: 'password_reset_tokens', onDelete: 'CASCADE' });
PasswordResetToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Student.hasMany(SupportPlan, { foreignKey: 'student_id', as: 'support_plans', onDelete: 'CASCADE' });
SupportPlan.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

User.hasMany(SupportPlan, { foreignKey: 'created_by', as: 'created_support_plans', onDelete: 'CASCADE' });
SupportPlan.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

module.exports = {
  sequelize,
  User,
  Student,
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
  CareerActivity,
  CareerDevActivity,
  PasswordResetToken,
  SupportPlan,
  IdempotencyKey,
};