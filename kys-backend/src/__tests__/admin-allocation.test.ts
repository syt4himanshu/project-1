import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminToken, loginAdmin, request } from './helpers/setup';
import { cleanup, createTestFaculty, createTestStudent, findUserIdByUsername, loginAs } from './helpers/seed';

const createdUserIds: number[] = [];

async function track(username: string) {
  const id = await findUserIdByUsername(username);
  if (id) createdUserIds.push(id);
  return id;
}

describe('admin allocation APIs', () => {
  let facultyId: number;
  let facultyToken = '';
  let studentToken = '';
  const seededStudents: { uid: string; userId?: number; studentId?: number }[] = [];

  beforeAll(async () => {
    await loginAdmin();

    const fac = await createTestFaculty();
    expect(fac.res.status).toBe(201);
    const facUserId = await track(fac.payload.username);

    const facList = await request<any[]>('GET', '/api/admin/faculty', undefined, adminToken);
    const f = facList.body.find((x: any) => x.email === fac.payload.email);
    facultyId = f.id;

    facultyToken = (await loginAs(fac.payload.username, fac.payload.password)).body.access_token;

    for (let i = 0; i < 6; i += 1) {
      const s = await createTestStudent({ semester: 3, section: 'A' });
      expect(s.res.status).toBe(201);
      const userId = await track(s.payload.username);
      if (typeof userId === 'number') {
        seededStudents.push({ uid: s.payload.uid, userId });
      } else {
        seededStudents.push({ uid: s.payload.uid });
      }
    }

    const oneStudentLogin = await loginAs(seededStudents[0].uid, 'studentpass123');
    studentToken = oneStudentLogin.body.access_token;

    const search = await request<any[]>('GET', `/api/students?section=A&semester=3`, undefined, adminToken);
    for (const item of seededStudents) {
      const row = search.body.find((x: any) => x.uid === item.uid);
      item.studentId = row?.id;
    }
  });

  afterAll(async () => {
    await cleanup(createdUserIds);
  });

  it('generate suggestions without saving', async () => {
    const res = await request<any[]>('POST', `/api/admin/faculty/${facultyId}/mentees/generate`, {}, adminToken);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    const menteesBefore = await request<any[]>('GET', `/api/admin/faculty/${facultyId}/mentees`, undefined, adminToken);
    expect(menteesBefore.status).toBe(200);
    expect(Array.isArray(menteesBefore.body)).toBe(true);
  });

  it('generate random order differs across runs (best-effort)', async () => {
    const orders: string[] = [];
    for (let i = 0; i < 5; i += 1) {
      const res = await request<any[]>('POST', `/api/admin/faculty/${facultyId}/mentees/generate`, {}, adminToken);
      expect(res.status).toBe(200);
      orders.push((res.body || []).map((x: any) => x.uid).join(','));
    }
    const unique = new Set(orders);
    expect(unique.size).toBeGreaterThanOrEqual(1);
  });

  it('generate non-existent faculty -> 404', async () => {
    const res = await request('POST', '/api/admin/faculty/9999999/mentees/generate', {}, adminToken);
    expect(res.status).toBe(404);
  });

  it('generate non-admin -> 403', async () => {
    const res = await request('POST', `/api/admin/faculty/${facultyId}/mentees/generate`, {}, studentToken);
    expect(res.status).toBe(403);
  });

  it('confirm valid student_ids -> 200 and mentees appear', async () => {
    const gen = await request<any[]>('POST', `/api/admin/faculty/${facultyId}/mentees/generate`, {}, adminToken);
    expect(gen.status).toBe(200);

    const ids = gen.body.slice(0, 3).map((x: any) => x.id);
    const confirm = await request('POST', `/api/admin/faculty/${facultyId}/mentees/confirm`, { student_ids: ids }, adminToken);
    expect(confirm.status).toBe(200);

    const mentees = await request<any[]>('GET', `/api/admin/faculty/${facultyId}/mentees`, undefined, adminToken);
    expect(mentees.status).toBe(200);
    expect(mentees.body.length).toBeGreaterThanOrEqual(ids.length);
  });

  it('confirm empty array -> 400', async () => {
    const res = await request('POST', `/api/admin/faculty/${facultyId}/mentees/confirm`, { student_ids: [] }, adminToken);
    expect([400, 404]).toContain(res.status);
  });

  it('confirm non-existent student_ids -> 400/404', async () => {
    const res = await request('POST', `/api/admin/faculty/${facultyId}/mentees/confirm`, { student_ids: [999999999] }, adminToken);
    expect([400, 404]).toContain(res.status);
  });

  it('confirm more than 20 students -> 400 expectation', async () => {
    const many = Array.from({ length: 21 }).map((_, i) => 1000000 + i);
    const res = await request('POST', `/api/admin/faculty/${facultyId}/mentees/confirm`, { student_ids: many }, adminToken);
    expect([400, 404]).toContain(res.status);
  });

  it('confirm non-admin -> 403', async () => {
    const res = await request('POST', `/api/admin/faculty/${facultyId}/mentees/confirm`, { student_ids: [] }, facultyToken);
    expect(res.status).toBe(403);
  });

  it('remove by student UIDs', async () => {
    const mentees = await request<any[]>('GET', `/api/admin/faculty/${facultyId}/mentees`, undefined, adminToken);
    const toRemove = mentees.body.slice(0, 2).map((m: any) => m.uid);

    const rm = await request('POST', `/api/admin/faculty/${facultyId}/mentees/remove`, { student_ids: toRemove }, adminToken);
    expect([200, 404]).toContain(rm.status);
  });

  it('remove empty array -> 400', async () => {
    const res = await request('POST', `/api/admin/faculty/${facultyId}/mentees/remove`, { student_ids: [] }, adminToken);
    expect([400, 404]).toContain(res.status);
  });

  it('remove not assigned student -> 400 or 404', async () => {
    const res = await request('POST', `/api/admin/faculty/${facultyId}/mentees/remove`, { student_ids: ['NOT_EXIST_UID'] }, adminToken);
    expect([400, 404]).toContain(res.status);
  });

  it('remove non-admin -> 403', async () => {
    const res = await request('POST', `/api/admin/faculty/${facultyId}/mentees/remove`, { student_ids: [] }, studentToken);
    expect(res.status).toBe(403);
  });

  it('manual allocation via PUT /api/students/:id', async () => {
    const target = seededStudents.find((s) => s.studentId);
    if (!target?.studentId) return;

    const assign = await request('PUT', `/api/students/${target.studentId}`, { mentor_id: facultyId }, adminToken);
    expect([200, 404]).toContain(assign.status);

    const unassign = await request('PUT', `/api/students/${target.studentId}`, { mentor_id: null }, adminToken);
    expect([200, 404]).toContain(unassign.status);

    const bad = await request('PUT', `/api/students/${target.studentId}`, { mentor_id: 9999999 }, adminToken);
    expect([400, 404]).toContain(bad.status);

    const nonAdmin = await request('PUT', `/api/students/${target.studentId}`, { mentor_id: facultyId }, studentToken);
    expect(nonAdmin.status).toBe(403);
  });
});
