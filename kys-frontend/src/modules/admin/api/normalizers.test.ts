import { describe, expect, it } from 'vitest'
import {
  normalizeAdminStatistics,
  normalizeBacklogEntry,
  normalizeGeneralReportFilters,
  normalizeGeneralReportRow,
  normalizeIncompleteProfile,
  normalizeStudentSummaryFilters,
} from './normalizers'

describe('admin normalizers', () => {
  it('normalizes mixed snake_case and camelCase statistics payloads', () => {
    const result = normalizeAdminStatistics({
      total_users: '40',
      totalStudents: 30,
      totalTeachers: '8',
      active_users: '35',
    })

    expect(result).toEqual({
      totalUsers: 40,
      totalStudents: 30,
      totalFaculty: 8,
      activeUsers: 35,
    })
  })

  it('normalizes backlog subjects from delimited strings', () => {
    const result = normalizeBacklogEntry({
      student_id: '11',
      name: 'Alex',
      uid: 'U11',
      subjects: 'Math II, Operating Systems;DBMS\nTOC',
    })

    expect(result).toEqual({
      studentId: 11,
      name: 'Alex',
      uid: 'U11',
      subjects: ['Math II', 'Operating Systems', 'DBMS', 'TOC'],
    })
  })

  it('normalizes general report rows with academic records', () => {
    const row = normalizeGeneralReportRow({
      id: '3',
      uid: 'U003',
      name: 'Chris',
      semester: '6',
      section: 'A',
      year_of_admission: '2023',
      domain_of_interest: 'AI',
      career_goal: 'Placement',
      academic_records: [
        { semester: '5', sgpa: '8.3', backlogs: '1' },
        { semester: 6, sgpa: 8.8, backlogs: 0 },
      ],
    })

    expect(row.uid).toBe('U003')
    expect(row.academicRecords).toEqual([
      { semester: 5, sgpa: 8.3, backlogs: 1 },
      { semester: 6, sgpa: 8.8, backlogs: 0 },
    ])
  })

  it('normalizes incomplete profile missing_fields list from string', () => {
    const row = normalizeIncompleteProfile({
      id: '4',
      name: 'Sam',
      uid: 'U004',
      year_of_admission: '2022',
      missing_fields: 'phone,email,address',
    })

    expect(row).toEqual({
      id: 4,
      name: 'Sam',
      uid: 'U004',
      yearOfAdmission: 2022,
      missingFields: ['phone', 'email', 'address'],
    })
  })

  it('trims and preserves report filter values', () => {
    const studentFilters = normalizeStudentSummaryFilters({
      search: '  alice  ',
      semester: ' 6 ',
      section: ' A ',
      yearOfAdmission: ' 2024 ',
      domain: ' AI ',
      careerGoal: ' Placement ',
    })

    const generalFilters = normalizeGeneralReportFilters({
      search: '  bob ',
      semester: ' 4 ',
      minSgpa: ' 7.5 ',
      maxSgpa: ' 9 ',
      minBacklogs: ' 1 ',
    })

    expect(studentFilters).toEqual({
      search: 'alice',
      semester: '6',
      section: 'A',
      yearOfAdmission: '2024',
      domain: 'AI',
      careerGoal: 'Placement',
    })

    expect(generalFilters).toEqual({
      search: 'bob',
      semester: '4',
      minSgpa: '7.5',
      maxSgpa: '9',
      minBacklogs: '1',
    })
  })
})
