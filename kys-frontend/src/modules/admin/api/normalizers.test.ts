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
      backlogCount: 4,
    })
  })

  it('uses explicit backlog_count for numeric backlog-only input', () => {
    const result = normalizeBacklogEntry({
      student_id: '12',
      name: 'Blair',
      uid: 'U12',
      subjects: '3 subjects',
      backlog_count: '3',
    })

    expect(result.backlogCount).toBe(3)
    expect(result.subjects).toEqual(['3 subjects'])
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
      missing_field_count: '3',
    })

    expect(row).toEqual({
      id: 4,
      name: 'Sam',
      uid: 'U004',
      yearOfAdmission: 2022,
      missingFields: ['phone', 'email', 'address'],
      missingFieldCount: 3,
    })
  })

  it('normalizes incomplete profile with missing_field_count from backend', () => {
    const row = normalizeIncompleteProfile({
      id: '5',
      name: 'Priya',
      uid: 'U005',
      year_of_admission: '2023',
      missing_fields: ['Profile Photo', 'WhatsApp Mobile No.'],
      missing_field_count: 2,
    })

    expect(row.missingFields).toEqual(['Profile Photo', 'WhatsApp Mobile No.'])
    expect(row.missingFieldCount).toBe(2)
  })

  it('falls back to missingFields.length when missing_field_count is absent (backward compat)', () => {
    const row = normalizeIncompleteProfile({
      id: '6',
      name: 'Raj',
      uid: 'U006',
      year_of_admission: '2022',
      missing_fields: ['Profile Photo', 'MIS UID', 'Career Goal'],
      // missing_field_count intentionally absent
    })

    // Count must equal the number of fields in the array — never computed separately
    expect(row.missingFieldCount).toBe(row.missingFields.length)
    expect(row.missingFieldCount).toBe(3)
  })

  it('missingFieldCount is 0 when no fields are missing', () => {
    const row = normalizeIncompleteProfile({
      id: '7',
      name: 'Deepa',
      uid: 'U007',
      year_of_admission: '2024',
      missing_fields: [],
      missing_field_count: 0,
    })

    expect(row.missingFields).toEqual([])
    expect(row.missingFieldCount).toBe(0)
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
      careerGoal: '',
    })
  })
})
