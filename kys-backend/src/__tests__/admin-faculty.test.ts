import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminToken, loginAdmin, request } from './helpers/setup';
import { cleanup, createTestFaculty, createTestStudent, findUserIdByUsername, loginAs } from './helpers/seed';

const createdUserIds: number[] = [];

async function track(username: string) {
  const id = await findUserIdByUsername(username);
  if (id) createdUserIds.push(id);
  return id;
}

describe('admin faculty APIs', () => {
  let facultyToken = '';
  let studentToken = '';
  let facultyId: number | null = null;

  beforeAll(async () => {
    await loginAdmin();
    const fac = await createTestFaculty();
    expect(fac.res.status).toBe(201);
    await track(fac.payload.username);

    const st = await createTestStudent();
    expect(st.res.status).toBe(201);
    await track(st.payload.username);

    facultyToken = (await loginAs(fac.payload.username, fac.payload.password)).body.access_token;
    studentToken = (await loginAs(st.payload.username, st.payload.password)).body.access_token;

    const all = await request<any[]>('GET', '/api/admin/faculty', undefined, adminToken);
    const found = all.body.find((f: any) => f.email === fac.payload.email);
    facultyId = found?.id ?? null;
  });

  afterAll(async () => {
    await cleanup(createdUserIds);
  });

  it('GET /api/admin/faculty admin -> 200 with expected fields', async () => {
    const res = await request<any[]>('GET', '/api/admin/faculty', undefined, adminToken);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const first = res.body[0];
    expect(first).toBeTruthy();
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('email');
    expect(first).toHaveProperty('studentsAssigned');
  });

  it('GET /api/admin/faculty no token -> 401', async () => {
    const res = await request('GET', '/api/admin/faculty');
    expect(res.status).toBe(401);
  });

  it('GET /api/admin/faculty student token -> 403', async () => {
    const res = await request('GET', '/api/admin/faculty', undefined, studentToken);
    expect(res.status).toBe(403);
  });

  it('GET /api/admin/faculty/basic shape and access checks', async () => {
    const adminRes = await request<any[]>('GET', '/api/admin/faculty/basic', undefined, adminToken);
    expect(adminRes.status).toBe(200);
    expect(Array.isArray(adminRes.body)).toBe(true);

    if (adminRes.body.length > 0) {
      const row = adminRes.body[0];
      expect(row).toHaveProperty('id');
      expect(row).toHaveProperty('first_name');
      expect(row).toHaveProperty('last_name');
      expect(row).toHaveProperty('email');
    }

    const facultyRes = await request('GET', '/api/admin/faculty/basic', undefined, facultyToken);
    expect([200, 403]).toContain(facultyRes.status);

    const noToken = await request('GET', '/api/admin/faculty/basic');
    expect(noToken.status).toBe(401);
  });

  it('GET /api/admin/faculty/:id/mentees for valid faculty id', async () => {
    if (!facultyId) return;
    const res = await request<any[]>('GET', `/api/admin/faculty/${facultyId}/mentees`, undefined, adminToken);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      const m = res.body[0];
      expect(m).toHaveProperty('id');
      expect(m).toHaveProperty('uid');
      expect(m).toHaveProperty('semester');
      expect(m).toHaveProperty('section');
    }
  });

  it('GET /api/admin/faculty/:id/mentees non-existent -> 404', async () => {
    const res = await request('GET', '/api/admin/faculty/99999999/mentees', undefined, adminToken);
    expect(res.status).toBe(404);
  });

  it('GET /api/admin/faculty/:id/mentees non-admin -> 403', async () => {
    const res = await request('GET', '/api/admin/faculty/1/mentees', undefined, studentToken);
    expect(res.status).toBe(403);
  });
});
