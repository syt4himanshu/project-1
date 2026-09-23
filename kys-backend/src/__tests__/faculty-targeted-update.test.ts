import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminToken, loginAdmin, request } from './helpers/setup';
import { cleanup, createTestFaculty, createTestStudent, findUserIdByUsername, loginAs } from './helpers/seed';

const createdUserIds: number[] = [];

async function track(username: string) {
  const id = await findUserIdByUsername(username);
  if (id) createdUserIds.push(id);
  return id;
}

describe('Faculty Targeted Update & Relaxed Validation API', () => {
  let facultyToken = '';
  let unauthorizedFacultyToken = '';
  let menteeUid = '';

  beforeAll(async () => {
    await loginAdmin();

    const faculty = await createTestFaculty();
    expect(faculty.res.status).toBe(201);
    await track(faculty.payload.username);
    facultyToken = (await loginAs(faculty.payload.username, faculty.payload.password)).body.access_token;

    const otherFaculty = await createTestFaculty();
    expect(otherFaculty.res.status).toBe(201);
    await track(otherFaculty.payload.username);
    unauthorizedFacultyToken = (await loginAs(otherFaculty.payload.username, otherFaculty.payload.password)).body.access_token;

    const facultyList = await request<any[]>('GET', '/api/admin/faculty', undefined, adminToken);
    const facultyId = facultyList.body.find((f: any) => f.email === faculty.payload.email)?.id;

    const student = await createTestStudent();
    expect(student.res.status).toBe(201);
    await track(student.payload.username);
    menteeUid = student.payload.uid;

    const search = await request<any[]>('GET', `/api/students?uid=${menteeUid}`, undefined, adminToken);
    const sid = search.body[0]?.id;
    if (sid && facultyId) {
      await request('PUT', `/api/students/${sid}`, { mentor_id: facultyId }, adminToken);
    }
  });

  afterAll(async () => {
    await cleanup(createdUserIds);
  });

  it('TEST 1 — Targeted update of personal_info.father_mobile_no updates only personal_info', async () => {
    const patch = {
      personal_info: {
        father_mobile_no: '9876543210',
      },
    };

    const res = await request<any>('PUT', `/api/faculty/me/mentees/${menteeUid}/profile`, patch, facultyToken);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.student.personal_info.father_mobile_no).toBe('9876543210');
  });

  it('TEST 2 — Targeted update of two unrelated fields (mobile and career_goal) updates both', async () => {
    const patch = {
      personal_info: {
        mobile_no: '9123456789',
      },
      career_objective: {
        career_goal: 'Higher Studies',
      },
    };

    const res = await request<any>('PUT', `/api/faculty/me/mentees/${menteeUid}/profile`, patch, facultyToken);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.student.personal_info.mobile_no).toBe('9123456789');
    expect(res.body.data.student.career_objective.career_goal).toBe('Higher Studies');
  });

  it('TEST 3 — Over-length legacy career_objective.specific_details in DB does not block unrelated mobile update', async () => {
    const legacyLongText = 'L'.repeat(250);
    const seedLegacy = {
      career_objective: {
        specific_details: legacyLongText,
      },
    };
    await request('PUT', `/api/faculty/me/mentees/${menteeUid}/profile`, seedLegacy, facultyToken);

    const patch = {
      personal_info: {
        father_mobile_no: '9988776655',
      },
    };

    const res = await request<any>('PUT', `/api/faculty/me/mentees/${menteeUid}/profile`, patch, facultyToken);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.student.personal_info.father_mobile_no).toBe('9988776655');
    expect(res.body.data.student.career_objective.specific_details).toBe(legacyLongText);
  });

  it('TEST 4 — Explicit edit of legacy career_objective text succeeds under mentor-relaxed rules', async () => {
    const longText = 'M'.repeat(300);
    const patch = {
      career_objective: {
        specific_details: longText,
      },
    };

    const res = await request<any>('PUT', `/api/faculty/me/mentees/${menteeUid}/profile`, patch, facultyToken);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.student.career_objective.specific_details).toBe(longText);
  });

  it('TEST 5 — Unrelated collections remain intact when saving targeted personal info', async () => {
    const seedProject = {
      projects: [
        { title: 'Preserved Project', domain: 'Web', description: 'Description' },
      ],
    };
    await request('PUT', `/api/faculty/me/mentees/${menteeUid}/profile`, seedProject, facultyToken);

    const patch = {
      personal_info: {
        mother_name: 'Sunita',
      },
    };

    const res = await request<any>('PUT', `/api/faculty/me/mentees/${menteeUid}/profile`, patch, facultyToken);
    expect(res.status).toBe(200);
    expect(res.body.data.student.personal_info.mother_name).toBe('Sunita');
    expect(res.body.data.student.projects.length).toBeGreaterThan(0);
    expect(res.body.data.student.projects[0].title).toBe('Preserved Project');
  });

  it('TEST 12 — Unauthorized faculty request to update unassigned mentee is rejected', async () => {
    const patch = {
      personal_info: { father_mobile_no: '9999999999' },
    };

    const res = await request('PUT', `/api/faculty/me/mentees/${menteeUid}/profile`, patch, unauthorizedFacultyToken);
    expect(res.status).toBe(404);
  });
});
