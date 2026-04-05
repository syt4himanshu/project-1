import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminToken, loginAdmin, request } from './helpers/setup';
import { cleanup, createTestFaculty, createTestStudent, findUserIdByUsername, loginAs } from './helpers/seed';

const createdUserIds: number[] = [];

async function track(username: string) {
  const id = await findUserIdByUsername(username);
  if (id) createdUserIds.push(id);
}

describe('admin statistics API', () => {
  let studentToken = '';

  beforeAll(async () => {
    await loginAdmin();
    const s = await createTestStudent();
    expect(s.res.status).toBe(201);
    await track(s.payload.username);
    studentToken = (await loginAs(s.payload.username, s.payload.password)).body.access_token;
  });

  afterAll(async () => {
    await cleanup(createdUserIds);
  });

  it('admin token -> 200 with expected shape', async () => {
    const res = await request<any>('GET', '/api/admin/statistics', undefined, adminToken);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      totalUsers: expect.any(Number),
      totalStudents: expect.any(Number),
      totalTeachers: expect.any(Number),
      activeUsers: expect.any(Number),
    });
  });

  it('all values non-negative integers and totalUsers >= students+teachers', async () => {
    const res = await request<any>('GET', '/api/admin/statistics', undefined, adminToken);
    expect(res.status).toBe(200);
    for (const k of ['totalUsers', 'totalStudents', 'totalTeachers', 'activeUsers']) {
      expect(Number.isInteger(res.body[k])).toBe(true);
      expect(res.body[k]).toBeGreaterThanOrEqual(0);
    }
    expect(res.body.totalUsers).toBeGreaterThanOrEqual(res.body.totalStudents + res.body.totalTeachers);
  });

  it('creating and deleting student changes totalStudents accordingly', async () => {
    const before = await request<any>('GET', '/api/admin/statistics', undefined, adminToken);
    const seed = await createTestStudent();
    expect(seed.res.status).toBe(201);
    await track(seed.payload.username);

    const afterCreate = await request<any>('GET', '/api/admin/statistics', undefined, adminToken);
    expect(afterCreate.body.totalStudents).toBeGreaterThanOrEqual(before.body.totalStudents + 1);

    const id = await findUserIdByUsername(seed.payload.username);
    if (id) {
      await request('DELETE', `/api/admin/users/${id}`, undefined, adminToken);
      const idx = createdUserIds.indexOf(id);
      if (idx >= 0) createdUserIds.splice(idx, 1);
    }

    const afterDelete = await request<any>('GET', '/api/admin/statistics', undefined, adminToken);
    expect(afterDelete.body.totalStudents).toBeLessThanOrEqual(afterCreate.body.totalStudents);
  });

  it('no token -> 401', async () => {
    const res = await request('GET', '/api/admin/statistics');
    expect(res.status).toBe(401);
  });

  it('non-admin token -> 403', async () => {
    const res = await request('GET', '/api/admin/statistics', undefined, studentToken);
    expect(res.status).toBe(403);
  });
});
