import { describe, expect, it } from 'vitest';
import {
  adaptStudentDataset,
  normalizeStudentRecord,
} from '../../services/studentContextAdapter';
import { buildUserMessage } from '../../services/groq.service';

const fullModelFixture = {
  id: 42,
  uid: 'STU-042',
  name: 'Asha Patel',
  semester: 6,
  section: 'A',
  year_of_admission: 2022,
  academics: [
    { semester: 5, sgpa: '8.40', backlog_subjects: 'Mathematics III' },
    { semester: 6, sgpa: '8.80', backlog_subjects: null },
  ],
  skills: {
    programming_languages: 'Python, Java',
    technologies_frameworks: 'React, Node.js',
    domains_of_interest: 'Cloud, AI',
    familiar_tools_platforms: 'Git, Docker',
  },
  swoc: {
    strengths: 'Problem solving',
    weaknesses: 'Public speaking',
    opportunities: 'Internship pipeline',
    challenges: 'Time management',
  },
  career_objective: {
    career_goal: 'Software Engineer',
    specific_details: 'Backend development',
    clarity_preparedness: 'High',
    interested_in_campus_placement: true,
  },
  projects: [{ title: 'Campus Portal', description: 'Student management app' }],
  internships: [{ company_name: 'TechCorp', domain: 'Web', internship_type: 'Summer' }],
  recent_mentoring_minutes: [
    { date: '2026-07-01', remarks: 'Strong progress', suggestion: 'Apply for internships', action: 'Resume update' },
  ],
};

const sparseModelFixture = {
  id: 7,
  uid: 'STU-007',
  name: 'Ravi Kumar',
  semester: 4,
  academics: [],
  skills: null,
  career_objective: null,
  projects: [],
  internships: [],
  recent_mentoring_minutes: [],
};

describe('studentContextAdapter', () => {
  it('maps a full chatbot model record into buildUserMessage shape', () => {
    const normalized = normalizeStudentRecord(fullModelFixture);

    expect(normalized).toEqual({
      id: 42,
      uid: 'STU-042',
      name: 'Asha Patel',
      semester: 6,
      section: 'A',
      year_of_admission: 2022,
      cgpa: '8.60',
      academicRecords: [
        { semester: 5, sgpa: '8.40', backlogs: 'Mathematics III' },
        { semester: 6, sgpa: '8.80' },
      ],
      skills: {
        programming: 'Python, Java',
        technologies: 'React, Node.js',
        domains: 'Cloud, AI',
        tools: 'Git, Docker',
      },
      swoc: {
        strengths: 'Problem solving',
        weaknesses: 'Public speaking',
        opportunities: 'Internship pipeline',
        challenges: 'Time management',
      },
      careerObjective: {
        goal: 'Software Engineer',
        details: 'Backend development',
        clarity_preparedness: 'High',
        placement_interest: 'Yes',
      },
      projects: [{ title: 'Campus Portal', description: 'Student management app' }],
      internships: [{ title: 'TechCorp', domain: 'Web', internship_type: 'Summer' }],
      recentMinutes: [
        {
          date: '2026-07-01',
          remarks: 'Strong progress',
          suggestion: 'Apply for internships',
          action: 'Resume update',
        },
      ],
    });
  });

  it('leaves sparse fields absent instead of defaulting them', () => {
    const normalized = normalizeStudentRecord(sparseModelFixture);

    expect(normalized).toEqual({
      id: 7,
      uid: 'STU-007',
      name: 'Ravi Kumar',
      semester: 4,
    });
    expect(normalized).not.toHaveProperty('cgpa');
    expect(normalized).not.toHaveProperty('academicRecords');
    expect(normalized).not.toHaveProperty('skills');
    expect(normalized).not.toHaveProperty('careerObjective');
    expect(normalized).not.toHaveProperty('recentMinutes');
  });

  it('does not invent placement interest when campus placement preference is unknown', () => {
    const normalized = normalizeStudentRecord({
      ...fullModelFixture,
      career_objective: {
        ...fullModelFixture.career_objective,
        interested_in_campus_placement: null,
      },
    });

    expect(normalized.careerObjective).toEqual({
      goal: 'Software Engineer',
      details: 'Backend development',
      clarity_preparedness: 'High',
    });
    expect(normalized.careerObjective).not.toHaveProperty('placement_interest');
  });

  it('adapts an entire dataset for generateFacultyInsights', () => {
    const adapted = adaptStudentDataset({
      total_students: 1,
      student_limit: 20,
      students: [fullModelFixture],
    });

    expect(adapted.students).toHaveLength(1);
    expect(adapted.students[0].academicRecords).toHaveLength(2);
    expect(adapted.total_students).toBe(1);
    expect(adapted.student_limit).toBe(20);
  });

  it('snapshots prompt profile text for a known fixture student', () => {
    const adapted = adaptStudentDataset({ students: [fullModelFixture] });
    const { currentUserMessage } = buildUserMessage({
      facultyQuery: 'How is this student performing academically?',
      studentDataset: adapted,
      conversationHistory: [],
    });

    expect(currentUserMessage).toMatchInlineSnapshot(`
      "Faculty Request: How is this student performing academically?

      Student Profile:
      Student Name: Asha Patel
      Semester: 6
      CGPA: 8.60
      Semester-wise SGPA: Sem 5: 8.40 (backlogs: Mathematics III), Sem 6: 8.80
      Skills: Programming — Python, Java; Technologies — React, Node.js; Domains — Cloud, AI
      Projects: Campus Portal
      Internships: TechCorp
      Career Goal: Software Engineer; Placement Interest: Yes
      Strengths: Problem solving; Weaknesses: Public speaking; Opportunities: Internship pipeline; Challenges: Time management
      Recent Mentoring Notes: Strong progress"
    `);
  });
});
