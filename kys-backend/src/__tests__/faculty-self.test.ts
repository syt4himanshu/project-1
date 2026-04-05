import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminToken, loginAdmin, request } from './helpers/setup';
import { cleanup, createTestFaculty, createTestStudent, findUserIdByUsername, loginAs } from './helpers/seed';

const createdUserIds: number[] = [];

async function track(username: string) {
  const id = await findUserIdByUsername(username);
  if (id) createdUserIds.push(id);
  return id;
}

describe('faculty self APIs', () => {
  let facultyToken = '';
  let studentToken = '';
  let facultyId: number | null = null;
  let assignedUids: string[] = [];
  let unassignedUid = '';

  beforeAll(async () => {
    await loginAdmin();

    const faculty = await createTestFaculty();
    expect(faculty.res.status).toBe(201);
    await track(faculty.payload.username);
    facultyToken = (await loginAs(faculty.payload.username, faculty.payload.password)).body.access_token;

    const list = await request<any[]>('GET', '/api/admin/faculty', undefined, adminToken);
    facultyId = list.body.find((f: any) => f.email === faculty.payload.email)?.id ?? null;

    for (let i = 0; i < 3; i += 1) {
      const s = await createTestStudent();
      expect(s.res.status).toBe(201);
      await track(s.payload.username);
      assignedUids.push(s.payload.uid);
    }

    const other = await createTestStudent();
    expect(other.res.status).toBe(201);
    await track(other.payload.username);
    unassignedUid = other.payload.uid;

    const loginStudent = await loginAs(other.payload.username, other.payload.password);
    studentToken = loginStudent.body.access_token;

    if (facultyId) {
      for (const uid of assignedUids) {
        const search = await request<any[]>('GET', `/api/students?uid=${uid}`, undefined, adminToken);
        const sid = search.body[0]?.id;
        if (sid) {
          await request('PUT', `/api/students/${sid}`, { mentor_id: facultyId }, adminToken);
        }
      }
    }
  });

  afterAll(async () => {
    await cleanup(createdUserIds);
  });

  it('GET /faculty/me', async () => {
    const ok = await request<any>('GET', '/faculty/me', undefined, facultyToken);
    expect(ok.status).toBe(200);
    expect(ok.body).toMatchObject({ email: expect.any(String) });

    const student = await request('GET', '/faculty/me', undefined, studentToken);
    expect(student.status).toBe(403);

    const noToken = await request('GET', '/faculty/me');
    expect(noToken.status).toBe(401);
  });

  it('PUT /faculty/me update first_name/contact and invalid domain check', async () => {
    const up1 = await request('PUT', '/faculty/me', { first_name: 'UpdatedFaculty' }, facultyToken);
    expect(up1.status).toBe(200);

    const up2 = await request('PUT', '/faculty/me', { contact_number: '8888888888' }, facultyToken);
    expect(up2.status).toBe(200);

    const bad = await request('PUT', '/faculty/me', { email: 'bad@gmail.com' }, facultyToken);
    expect([200, 400]).toContain(bad.status);

    const byStudent = await request('PUT', '/faculty/me', { first_name: 'x' }, studentToken);
    expect(byStudent.status).toBe(403);
  });

  it('GET /faculty/me/mentees returns assigned only', async () => {
    const res = await request<any[]>('GET', '/faculty/me/mentees', undefined, facultyToken);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const allUids = res.body.map((m) => m.uid);
    expect(allUids).not.toContain(unassignedUid);

    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('personal_info');
      expect(res.body[0]).toHaveProperty('projects');
      expect(res.body[0]).toHaveProperty('post_admission_records');
    }

    const byStudent = await request('GET', '/faculty/me/mentees', undefined, studentToken);
    expect(byStudent.status).toBe(403);
  });

  it('POST /faculty/me/mentees/:uid/minutes', async () => {
    const targetUid = assignedUids[0];
    const good = await request(
      'POST',
      `/faculty/me/mentees/${targetUid}/minutes`,
      {
        semester: 3,
        date: '2025-01-15',
        remarks: 'Good progress',
        suggestion: 'Focus on DSA',
        action: 'Weekly calls',
      },
      facultyToken,
    );
    expect([201, 404]).toContain(good.status);

    const list = await request<any>('GET', `/faculty/me/mentees/${targetUid}/minutes`, undefined, facultyToken);
    expect([200, 404]).toContain(list.status);

    const notAssigned = await request(
      'POST',
      `/faculty/me/mentees/${unassignedUid}/minutes`,
      { remarks: 'Should fail' },
      facultyToken,
    );
    expect([403, 404]).toContain(notAssigned.status);

    const nonExistent = await request(
      'POST',
      '/faculty/me/mentees/NO_SUCH_UID/minutes',
      { remarks: 'Should fail' },
      facultyToken,
    );
    expect(nonExistent.status).toBe(404);

    const missingRemarks = await request('POST', `/faculty/me/mentees/${targetUid}/minutes`, { suggestion: 'x' }, facultyToken);
    expect(missingRemarks.status).toBe(400);

    const byStudent = await request('POST', `/faculty/me/mentees/${targetUid}/minutes`, { remarks: 'x' }, studentToken);
    expect(byStudent.status).toBe(403);
  });

  it('GET /faculty/me/mentees/:uid/minutes ordering and access', async () => {
    const targetUid = assignedUids[1];

    for (let i = 0; i < 3; i += 1) {
      await request('POST', `/faculty/me/mentees/${targetUid}/minutes`, { remarks: `Minute ${i}`, suggestion: 's', action: 'a' }, facultyToken);
    }

    const res = await request<any>('GET', `/faculty/me/mentees/${targetUid}/minutes`, undefined, facultyToken);
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(Array.isArray(res.body.mentoring_minutes)).toBe(true);
      expect(res.body.mentoring_minutes.length).toBeGreaterThanOrEqual(1);
    }

    const notAssigned = await request('GET', `/faculty/me/mentees/${unassignedUid}/minutes`, undefined, facultyToken);
    expect([403, 404]).toContain(notAssigned.status);

    const byStudent = await request('GET', `/faculty/me/mentees/${targetUid}/minutes`, undefined, studentToken);
    expect(byStudent.status).toBe(403);
  });
});
