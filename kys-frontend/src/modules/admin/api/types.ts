import type { UserRole } from '../../../shared/auth/session'

export type AdminUserRole = UserRole | 'unknown'

export interface AdminStatistics {
  totalUsers: number
  totalStudents: number
  totalFaculty: number
  activeUsers: number
}

export interface AdminUserSummary {
  id: number
  username: string
  role: AdminUserRole
  name: string
  photoUrl: string | null
  status: string
  createdAt: string
}

export interface AdminFacultySummary {
  id: number
  uid: string
  name: string
  firstName: string
  lastName: string
  email: string
  contact: string
  assignedCount: number
  studentsAssigned: string[]
}

export interface AdminStudentSummary {
  id: number
  uid: string
  name: string
  semester: number | null
  section: string
  yearOfAdmission: number | null
  mentorId: number | null
  mentorName: string
  careerGoal: string
  domainOfInterest: string
}

export interface AdminStudentSummaryFilters {
  search?: string
  semester?: string
  section?: string
  yearOfAdmission?: string
  domain?: string
  careerGoal?: string
}

export interface NormalizedAdminStudentSummaryFilters {
  search: string
  semester: string
  section: string
  yearOfAdmission: string
  domain: string
  careerGoal: string
}

export type JsonRecord = Record<string, unknown>

export interface AdminStudentDetail {
  id: number
  uid: string
  name: string
  semester: number | null
  section: string
  yearOfAdmission: number | null
  mentorId: number | null
  mentorName: string
  careerGoal: string
  domainOfInterest: string
  personalInfo: JsonRecord
  pastEducation: JsonRecord[]
  academicRecords: JsonRecord[]
  projects: JsonRecord[]
  internships: JsonRecord[]
  coCurricularParticipations: JsonRecord[]
  coCurricularOrganizations: JsonRecord[]
  skillPrograms: JsonRecord[]
  skills: JsonRecord
  swoc: JsonRecord
  careerObjective: JsonRecord
}

export interface AdminMenteeSummary {
  id: number
  uid: string
  fullName: string
  semester: number | null
  section: string
  yearOfAdmission: number | null
}

export interface AdminFacultyDetail {
  faculty: AdminFacultySummary
  mentees: AdminMenteeSummary[]
}

export interface AdminAllocationEntry {
  facultyId: number
  facultyName: string
  email: string
  assignedCount: number
  capacity: number
}

export interface AdminAllocationStudent {
  id: number
  uid: string
  name: string
}

export interface AdminAllocationUpdateInput {
  facultyId: number
  studentIds: number[]
}

export interface AdminMutationResult {
  message: string
}

export interface CreateStudentUserInput {
  role: 'student'
  uid: string
  name: string
  password: string
  semester: number
  section: string
  year_of_admission: number
}

export interface CreateFacultyUserInput {
  role: 'faculty'
  email: string
  first_name: string
  last_name: string
  contact_number: string
  password: string
}

export type CreateAdminUserInput = CreateStudentUserInput | CreateFacultyUserInput

export interface ResetPasswordInput {
  role: 'student' | 'faculty'
  username: string
  new_password: string
}

export interface BulkStudentRowInput {
  uid: string
  full_name: string
  semester: number
  section: string
  year_of_admission: number
}

export interface BulkFacultyRowInput {
  email: string
  first_name: string
  last_name: string
  contact_number: string
  password?: string
}

export interface BulkOperationItem {
  identifier: string
  status: 'success' | 'failed'
  error?: string
}

export interface BulkOperationResult {
  rows: BulkOperationItem[]
}

export interface BulkStudentApiItem {
  uid?: unknown
  status?: unknown
  error?: unknown
}

export interface BulkFacultyApiItem {
  email?: unknown
  status?: unknown
  error?: unknown
}

export interface BulkStudentApiResponse {
  result?: unknown
}

export interface BulkFacultyApiResponse {
  result?: unknown
}

export interface AdminStatisticsApiResponse {
  total_users?: unknown
  totalUsers?: unknown
  total_students?: unknown
  totalStudents?: unknown
  total_faculty?: unknown
  totalTeachers?: unknown
  totalFaculty?: unknown
  active_users?: unknown
  activeUsers?: unknown
}

export interface AdminUserApiResponse {
  id?: unknown
  username?: unknown
  role?: unknown
  name?: unknown
  full_name?: unknown
  photoUrl?: unknown
  status?: unknown
  created?: unknown
  created_at?: unknown
  createdAt?: unknown
}

export interface AdminFacultyApiResponse {
  id?: unknown
  uid?: unknown
  name?: unknown
  first_name?: unknown
  firstName?: unknown
  last_name?: unknown
  lastName?: unknown
  email?: unknown
  contact?: unknown
  contact_number?: unknown
  contactNumber?: unknown
  studentsAssigned?: unknown
  assigned_count?: unknown
  assignedCount?: unknown
}

export interface AdminStudentSummaryApiResponse {
  id?: unknown
  uid?: unknown
  name?: unknown
  full_name?: unknown
  semester?: unknown
  section?: unknown
  year_of_admission?: unknown
  yearOfAdmission?: unknown
  mentor_id?: unknown
  mentorId?: unknown
  mentor_name?: unknown
  mentorName?: unknown
  career_goal?: unknown
  careerGoal?: unknown
  domain_of_interest?: unknown
  domainOfInterest?: unknown
}

export interface AdminStudentDetailApiResponse {
  id?: unknown
  uid?: unknown
  name?: unknown
  full_name?: unknown
  semester?: unknown
  section?: unknown
  year_of_admission?: unknown
  yearOfAdmission?: unknown
  mentor_id?: unknown
  mentorId?: unknown
  mentor_name?: unknown
  mentorName?: unknown
  career_goal?: unknown
  careerGoal?: unknown
  domain_of_interest?: unknown
  domainOfInterest?: unknown
  personal_info?: unknown
  past_education?: unknown
  past_education_records?: unknown
  academic_records?: unknown
  post_admission_records?: unknown
  projects?: unknown
  internships?: unknown
  co_curricular_participations?: unknown
  cocurricular_participations?: unknown
  co_curricular_organizations?: unknown
  cocurricular_organizations?: unknown
  skill_programs?: unknown
  skillPrograms?: unknown
  skills?: unknown
  swoc?: unknown
  career_objective?: unknown
}

export interface AdminMenteeApiResponse {
  id?: unknown
  uid?: unknown
  full_name?: unknown
  semester?: unknown
  section?: unknown
  year_of_admission?: unknown
}

export interface AdminAllocationApiResponse {
  faculty_id?: unknown
  faculty_name?: unknown
  email?: unknown
  assigned_count?: unknown
  capacity?: unknown
}

export interface AdminAllocationStudentApiResponse {
  id?: unknown
  uid?: unknown
  name?: unknown
  full_name?: unknown
}

export interface AdminReportStats {
  totalStudents: number
  averageSgpa: number
  withBacklogs: number
  activeSemesters: number
}

export interface AdminTopper {
  rank: number
  name: string
  uid: string
  sgpa: number
  semester: number | null
}

export interface AdminSemesterDistributionRow {
  semester: number
  count: number
}

export interface AdminBacklogEntry {
  studentId: number
  name: string
  uid: string
  subjects: string[]
}

export interface AdminGeneralReportAcademicRow {
  semester: number | null
  sgpa: number | null
  backlogs: number
}

export interface AdminGeneralReportRow {
  id: number
  uid: string
  name: string
  semester: number | null
  section: string
  yearOfAdmission: number | null
  domainOfInterest: string
  careerGoal: string
  academicRecords: AdminGeneralReportAcademicRow[]
}

export interface AdminGeneralReportFilters {
  search: string
  semester: string
  minSgpa: string
  maxSgpa: string
  minBacklogs: string
}

export interface AdminIncompleteProfile {
  id: number
  name: string
  uid: string
  yearOfAdmission: number | null
  missingFields: string[]
}

export interface AdminExportedFile {
  blob: Blob
  filename: string
}

export interface AdminReportStatsApiResponse {
  total_students?: unknown
  avg_sgpa?: unknown
  with_backlogs?: unknown
  active_semesters?: unknown
}

export interface AdminTopperApiResponse {
  rank?: unknown
  name?: unknown
  uid?: unknown
  sgpa?: unknown
  semester?: unknown
}

export interface AdminSemesterDistributionApiResponse {
  semester?: unknown
  count?: unknown
}

export interface AdminBacklogEntryApiResponse {
  student_id?: unknown
  name?: unknown
  uid?: unknown
  subjects?: unknown
}

export interface AdminGeneralReportAcademicApiResponse {
  semester?: unknown
  sgpa?: unknown
  backlogs?: unknown
}

export interface AdminGeneralReportApiResponse {
  id?: unknown
  uid?: unknown
  name?: unknown
  semester?: unknown
  section?: unknown
  year_of_admission?: unknown
  domain_of_interest?: unknown
  career_goal?: unknown
  academic_records?: unknown
}

export interface AdminIncompleteProfileApiResponse {
  id?: unknown
  name?: unknown
  uid?: unknown
  year_of_admission?: unknown
  missing_fields?: unknown
}
