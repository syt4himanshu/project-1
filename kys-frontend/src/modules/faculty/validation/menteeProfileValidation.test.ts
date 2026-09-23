/**
 * Unit tests for validateMenteeProfileData.
 *
 * These tests are pure-function tests — no DOM, no React, no worker pool.
 * They verify the Phase 1 validation fix: legacy DB values that exceed the
 * student-form character limits must not block unrelated mentor edits.
 */
import { describe, expect, it } from 'vitest'
import { validateMenteeProfileData } from './menteeProfileValidation'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function minimalPayload(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    full_name: 'Test Student',
    semester: 4,
    section: 'A',
    year_of_admission: 2022,
    admission_type: 'hsc',
    personal_info: { mobile_no: '9876543210' },
    past_education_records: [],
    post_admission_records: [],
    projects: [],
    internships: [],
    cocurricular_participations: [],
    cocurricular_organizations: [],
    skill_programs: [],
    career_objective: {},
    skills: {},
    swoc: {},
    ...overrides,
  }
}

// ---------------------------------------------------------------------------
// TEST 5 — Legacy specific_details > 200 chars must NOT block an unrelated edit
// ---------------------------------------------------------------------------
describe('validateMenteeProfileData — legacy long values', () => {
  it('accepts a career_objective.specific_details value longer than 200 characters', () => {
    const longValue = 'x'.repeat(250)
    const payload = minimalPayload({
      career_objective: { specific_details: longValue },
    })
    const result = validateMenteeProfileData(payload)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('accepts internship.description longer than 200 characters', () => {
    const longDesc = 'y'.repeat(300)
    const payload = minimalPayload({
      internships: [{ company_name: 'Acme', description: longDesc }],
    })
    const result = validateMenteeProfileData(payload)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('accepts swoc.strengths longer than 500 characters', () => {
    const longStrengths = 'z'.repeat(600)
    const payload = minimalPayload({
      swoc: { strengths: longStrengths },
    })
    const result = validateMenteeProfileData(payload)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('accepts campus_placement_reasons longer than 200 characters', () => {
    const payload = minimalPayload({
      career_objective: { campus_placement_reasons: 'a'.repeat(201) },
    })
    const result = validateMenteeProfileData(payload)
    expect(result.isValid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
})

// ---------------------------------------------------------------------------
// TEST 6 — Structural validations still fire (schema not gutted)
// ---------------------------------------------------------------------------
describe('validateMenteeProfileData — structural rules preserved', () => {
  it('rejects a semester value outside 1–8', () => {
    const payload = minimalPayload({ semester: 9 })
    const result = validateMenteeProfileData(payload)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.toLowerCase().includes('semester'))).toBe(true)
  })

  it('rejects a year_of_admission below 1990', () => {
    const payload = minimalPayload({ year_of_admission: 1989 })
    const result = validateMenteeProfileData(payload)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.toLowerCase().includes('year_of_admission'))).toBe(true)
  })

  it('rejects an invalid email in personal_info', () => {
    const payload = minimalPayload({
      personal_info: { personal_email: 'not-an-email' },
    })
    const result = validateMenteeProfileData(payload)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.toLowerCase().includes('email'))).toBe(true)
  })

  it('rejects a phone number that is not 10 digits', () => {
    const payload = minimalPayload({
      personal_info: { mobile_no: '12345' },
    })
    const result = validateMenteeProfileData(payload)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.toLowerCase().includes('phone'))).toBe(true)
  })

  it('rejects invalid admission_type value', () => {
    const payload = minimalPayload({ admission_type: 'unknown' })
    const result = validateMenteeProfileData(payload)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.toLowerCase().includes('admission_type'))).toBe(true)
  })

  it('rejects a sgpa value outside 0–10', () => {
    const payload = minimalPayload({
      post_admission_records: [{ semester: 1, sgpa: 11 }],
    })
    const result = validateMenteeProfileData(payload)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => e.toLowerCase().includes('sgpa'))).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Admission-type cross-validation preserved
// ---------------------------------------------------------------------------
describe('validateMenteeProfileData — admission type cross-validation', () => {
  it('rejects hsc admission_type with DIPLOMA past record', () => {
    const payload = minimalPayload({
      admission_type: 'hsc',
      past_education_records: [{ exam_name: 'DIPLOMA', percentage: 70, year_of_passing: 2020 }],
    })
    const result = validateMenteeProfileData(payload)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => /diploma.*hsc|hsc.*diploma/i.test(e))).toBe(true)
  })

  it('rejects diploma admission_type with HSSC past record', () => {
    const payload = minimalPayload({
      admission_type: 'diploma',
      past_education_records: [{ exam_name: 'HSSC', percentage: 70, year_of_passing: 2020 }],
    })
    const result = validateMenteeProfileData(payload)
    expect(result.isValid).toBe(false)
    expect(result.errors.some((e) => /hsc.*diploma|diploma.*hsc/i.test(e))).toBe(true)
  })

  it('accepts hsc admission_type with HSSC past record', () => {
    const payload = minimalPayload({
      admission_type: 'hsc',
      past_education_records: [
        { exam_name: 'SSC', percentage: 80, year_of_passing: 2018 },
        { exam_name: 'HSSC', percentage: 75, year_of_passing: 2020 },
      ],
    })
    expect(validateMenteeProfileData(payload).isValid).toBe(true)
  })

  it('accepts diploma admission_type with DIPLOMA past record', () => {
    const payload = minimalPayload({
      admission_type: 'diploma',
      past_education_records: [
        { exam_name: 'SSC', percentage: 80, year_of_passing: 2018 },
        { exam_name: 'DIPLOMA', percentage: 72, year_of_passing: 2021 },
      ],
    })
    expect(validateMenteeProfileData(payload).isValid).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Valid complete payload passes
// ---------------------------------------------------------------------------
describe('validateMenteeProfileData — valid complete payload', () => {
  it('accepts a fully populated valid payload', () => {
    const payload = minimalPayload({
      full_name: 'Priya Verma',
      semester: 6,
      section: 'B',
      year_of_admission: 2022,
      admission_type: 'hsc',
      personal_info: {
        mobile_no: '9123456789',
        personal_email: 'priya@example.com',
        college_email: 'priya@stvincentngp.edu.in',
        father_mobile_no: '9876543210',
        mother_mobile_no: '9876543211',
        emergency_contact_number: '9876543212',
      },
      past_education_records: [
        { exam_name: 'SSC', percentage: 90, year_of_passing: 2020, board: 'CBSE' },
        { exam_name: 'HSSC', percentage: 88, year_of_passing: 2022, board: 'CBSE' },
      ],
      post_admission_records: [
        { semester: 1, sgpa: 8.5, season: 'Winter', year_of_passing: 2023 },
      ],
      projects: [
        { title: 'Mini App', domain: 'Web', description: 'A guide' },
        { title: 'Major App', domain: 'AI', description: 'A guide' },
      ],
      internships: [
        {
          company_name: 'Acme',
          domain: 'Web',
          description: 'Worked on APIs',
          start_date: '2024-05-01',
          end_date: '2024-07-01',
        },
      ],
      career_objective: {
        career_goal: 'Placement',
        specific_details: 'IT',
        interested_in_campus_placement: true,
        clarity_preparedness: 'Good',
      },
      skills: { programming_languages: 'Python, JS' },
      swoc: { strengths: 'Teamwork', weaknesses: 'Time management' },
    })
    expect(validateMenteeProfileData(payload).isValid).toBe(true)
  })
})
