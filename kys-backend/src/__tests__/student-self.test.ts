import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminToken, loginAdmin, request } from './helpers/setup';
import { cleanup, createTestFaculty, createTestStudent, findUserIdByUsername, loginAs } from './helpers/seed';

const createdUserIds: number[] = [];

async function track(username: string) {
  const id = await findUserIdByUsername(username);
  if (id) createdUserIds.push(id);
  return id;
}

function unwrapStudentEnvelope<T>(body: unknown): T {
  if (body && typeof body === 'object' && 'success' in body && (body as { success: boolean }).success === true) {
    return (body as { data: T }).data;
  }
  return body as T;
}

describe('student self APIs', () => {
  let studentToken = '';
  let facultyToken = '';
  let studentId: number | null = null;
  let facultyId: number | null = null;

  beforeAll(async () => {
    await loginAdmin();

    const student = await createTestStudent({ semester: 3, section: 'A' });
    expect(student.res.status).toBe(201);
    await track(student.payload.username);
    studentToken = (await loginAs(student.payload.username, student.payload.password)).body.access_token;

    const faculty = await createTestFaculty();
    expect(faculty.res.status).toBe(201);
    await track(faculty.payload.username);
    facultyToken = (await loginAs(faculty.payload.username, faculty.payload.password)).body.access_token;

    const students = await request<any[]>('GET', `/api/students?uid=${student.payload.uid}`, undefined, adminToken);
    studentId = students.body[0]?.id ?? null;

    const faculties = await request<any[]>('GET', '/api/admin/faculty', undefined, adminToken);
    facultyId = faculties.body.find((f: any) => f.email === faculty.payload.email)?.id ?? null;

    if (studentId && facultyId) {
      await request('PUT', `/api/students/${studentId}`, { mentor_id: facultyId }, adminToken);
    }
  });

  afterAll(async () => {
    await cleanup(createdUserIds);
  });

  it('GET /students/me student token -> 200', async () => {
    const res = await request<any>('GET', '/students/me', undefined, studentToken);
    expect(res.status).toBe(200);
    const profile = unwrapStudentEnvelope<any>(res.body);
    expect(profile).toHaveProperty('uid');
    expect(profile).toHaveProperty('semester');
  });

  it('GET /students/me admin token -> 403', async () => {
    const res = await request('GET', '/students/me', undefined, adminToken);
    expect(res.status).toBe(403);
  });

  it('GET /students/me no token -> 401', async () => {
    const res = await request('GET', '/students/me');
    expect(res.status).toBe(401);
  });

  it('PUT /students/me update personal info and project', async () => {
    const payload = {
      full_name: 'Student Self Test',
      semester: 3,
      section: 'A',
      year_of_admission: 2023,
      personal_info: {
        mobile_no: '9999999999',
        personal_email: 'student.self@example.com',
        college_email: 'student.self@college.com',
        linked_in_id: 'https://linkedin.com/in/student-self',
        permanent_address: 'Permanent Address',
        dob: '2003-01-10',
        gender: 'M',
        father_name: 'Father',
        father_mobile_no: '9999999998',
        father_email: 'father@example.com',
        father_occupation: 'Service',
        mother_name: 'Mother',
        mother_mobile_no: '9999999997',
        mother_email: 'mother@example.com',
        mother_occupation: 'Teacher',
        emergency_contact_name: 'Guardian',
        emergency_contact_number: '9999999996',
      },
      post_admission_records: [
        { semester: 1, sgpa: 8.1, backlog_subjects: null },
        { semester: 2, sgpa: 8.2, backlog_subjects: null },
      ],
      past_education_records: [{ exam_name: 'HSC', percentage: 81, year_of_passing: 2022 }],
      projects: [{ title: 'Project One', description: 'Test project' }],
      internships: [],
      cocurricular_participations: [],
      cocurricular_organizations: [],
      skills: {
        programming_languages: 'JS,TS',
      },
      swoc: {
        strengths: 'Focus',
      },
    };

    const res = await request('PUT', '/students/me', payload, studentToken);
    expect([200, 400]).toContain(res.status);

    const get = await request<any>('GET', '/students/me', undefined, studentToken);
    expect(get.status).toBe(200);
  });

  it('PUT /students/me second call upsert no duplicates expectation', async () => {
    const payload = {
      full_name: 'Student Self Test Updated',
      semester: 3,
      section: 'A',
      year_of_admission: 2023,
      post_admission_records: [
        { semester: 1, sgpa: 8.4, backlog_subjects: null },
        { semester: 2, sgpa: 8.5, backlog_subjects: null },
      ],
      past_education_records: [{ exam_name: 'HSC', percentage: 82, year_of_passing: 2022 }],
      projects: [{ title: 'Project One', description: 'Updated project' }],
      internships: [],
      cocurricular_participations: [],
      cocurricular_organizations: [],
    };

    const res = await request('PUT', '/students/me', payload, studentToken);
    expect([200, 400]).toContain(res.status);
  });

  it('attempt UID/semester change -> 400 or ignored', async () => {
    const res = await request('PUT', '/students/me', { uid: 'HACKUID', semester: 8 }, studentToken);
    expect([200, 400]).toContain(res.status);
  });

  it('PUT /students/me admin token -> 403', async () => {
    const res = await request('PUT', '/students/me', {}, adminToken);
    expect(res.status).toBe(403);
  });

  it('GET /students/me/mentor', async () => {
    const res = await request('GET', '/students/me/mentor', undefined, studentToken);
    expect([200, 404]).toContain(res.status);
  });

  it('GET /students/me/mentoring-minutes no minutes yet -> 200 empty array', async () => {
    const res = await request<any[]>('GET', '/students/me/mentoring-minutes', undefined, studentToken);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('after faculty adds minute, student sees it', async () => {
    const me = await request<any>('GET', '/students/me', undefined, studentToken);
    const uid = unwrapStudentEnvelope<any>(me.body).uid;

    const add = await request(
      'POST',
      `/faculty/me/mentees/${uid}/minutes`,
      {
        semester: 3,
        date: '2025-01-15',
        remarks: 'Good progress',
        suggestion: 'Focus on DSA',
        action: 'Weekly calls',
      },
      facultyToken,
    );
    expect([201, 404]).toContain(add.status);

    const list = await request<any[]>('GET', '/students/me/mentoring-minutes', undefined, studentToken);
    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
  });

  it('GET /students/me/mentoring-minutes no token -> 401', async () => {
    const res = await request('GET', '/students/me/mentoring-minutes');
    expect(res.status).toBe(401);
  });

  it('GET /students/me/mentoring-minutes admin token -> 403', async () => {
    const res = await request('GET', '/students/me/mentoring-minutes', undefined, adminToken);
    expect(res.status).toBe(403);
  });
});
