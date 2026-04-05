import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminToken, loginAdmin, request } from './helpers/setup';
import { cleanup, createTestFaculty, createTestStudent, findUserIdByUsername, loginAs } from './helpers/seed';

const createdUserIds: number[] = [];

async function track(username: string) {
  const id = await findUserIdByUsername(username);
  if (id) createdUserIds.push(id);
}

describe('students search API', () => {
  let facultyToken = '';
  let studentToken = '';

  beforeAll(async () => {
    await loginAdmin();

    const fac = await createTestFaculty();
    expect(fac.res.status).toBe(201);
    await track(fac.payload.username);
    facultyToken = (await loginAs(fac.payload.username, fac.payload.password)).body.access_token;

    const st = await createTestStudent({ semester: 4, section: 'B' });
    expect(st.res.status).toBe(201);
    await track(st.payload.username);
    studentToken = (await loginAs(st.payload.username, st.payload.password)).body.access_token;

    const rows = [
      { semester: 3, section: 'A', year_of_admission: 2022, first_name: 'John' },
      { semester: 3, section: 'B', year_of_admission: 2023, first_name: 'Alice' },
      { semester: 4, section: 'A', year_of_admission: 2022, first_name: 'JOHN' },
      { semester: 5, section: 'B', year_of_admission: 2023, first_name: 'Bob' },
      { semester: 5, section: 'A', year_of_admission: 2022, first_name: 'johnny' },
      { semester: 4, section: 'B', year_of_admission: 2023, first_name: 'Daisy' },
      { semester: 3, section: 'A', year_of_admission: 2022, first_name: 'Eve' },
      { semester: 4, section: 'A', year_of_admission: 2023, first_name: 'Frank' },
      { semester: 5, section: 'B', year_of_admission: 2022, first_name: 'Grace' },
      { semester: 3, section: 'B', year_of_admission: 2023, first_name: 'Heidi' },
    ];

    for (const r of rows) {
      const seed = await createTestStudent({
        semester: r.semester,
        section: r.section,
        year_of_admission: r.year_of_admission,
        first_name: r.first_name,
      });
      expect(seed.res.status).toBe(201);
      await track(seed.payload.username);
    }
  });

  afterAll(async () => {
    await cleanup(createdUserIds);
  });

  it('admin token -> 200 array', async () => {
    const res = await request<any[]>('GET', '/api/students', undefined, adminToken);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('faculty token -> 200', async () => {
    const res = await request<any[]>('GET', '/api/students', undefined, facultyToken);
    expect(res.status).toBe(200);
  });

  it('student token -> 403', async () => {
    const res = await request('GET', '/api/students', undefined, studentToken);
    expect(res.status).toBe(403);
  });

  it('no token -> 401', async () => {
    const res = await request('GET', '/api/students');
    expect(res.status).toBe(401);
  });

  it('filter semester', async () => {
    const res = await request<any[]>('GET', '/api/students?semester=3', undefined, adminToken);
    expect(res.status).toBe(200);
    expect(res.body.every((s) => Number(s.semester) === 3)).toBe(true);
  });

  it('filter section', async () => {
    const res = await request<any[]>('GET', '/api/students?section=A', undefined, adminToken);
    expect(res.status).toBe(200);
    expect(res.body.every((s) => s.section === 'A')).toBe(true);
  });

  it('filter year_of_admission', async () => {
    const res = await request<any[]>('GET', '/api/students?year_of_admission=2022', undefined, adminToken);
    expect(res.status).toBe(200);
    expect(res.body.every((s) => Number(s.year_of_admission) === 2022)).toBe(true);
  });

  it('filter exact uid', async () => {
    const all = await request<any[]>('GET', '/api/students', undefined, adminToken);
    const uid = all.body[0]?.uid;
    const res = await request<any[]>('GET', `/api/students?uid=${uid}`, undefined, adminToken);
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].uid).toBe(uid);

    const none = await request<any[]>('GET', '/api/students?uid=NO_SUCH_UID', undefined, adminToken);
    expect(none.status).toBe(200);
    expect(Array.isArray(none.body)).toBe(true);
  });

  it('name search case-insensitive partial', async () => {
    const a = await request<any[]>('GET', '/api/students?name=john', undefined, adminToken);
    const b = await request<any[]>('GET', '/api/students?name=JOHN', undefined, adminToken);
    const c = await request<any[]>('GET', '/api/students?name=John', undefined, adminToken);
    expect(a.status).toBe(200);
    expect(b.status).toBe(200);
    expect(c.status).toBe(200);
    expect(a.body.length).toBe(b.body.length);
    expect(a.body.length).toBe(c.body.length);
  });

  it('combined filters AND semantics', async () => {
    const res = await request<any[]>('GET', '/api/students?semester=3&section=A', undefined, adminToken);
    expect(res.status).toBe(200);
    expect(res.body.every((s) => Number(s.semester) === 3 && s.section === 'A')).toBe(true);
  });

  it('no matches returns empty array', async () => {
    const res = await request<any[]>('GET', '/api/students?semester=8&section=Z', undefined, adminToken);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('response shape and no password leaks', async () => {
    const res = await request<any[]>('GET', '/api/students', undefined, adminToken);
    expect(res.status).toBe(200);
    const sample = res.body[0];
    expect(sample).toHaveProperty('uid');
    expect(sample).toHaveProperty('semester');
    expect(sample).toHaveProperty('section');
    expect(sample).toHaveProperty('year_of_admission');
    expect(sample).toHaveProperty('personal_info');
    expect(sample).toHaveProperty('post_admission_records');
    expect(sample).toHaveProperty('projects');
    expect(JSON.stringify(sample)).not.toContain('password_hash');
    expect(JSON.stringify(sample)).not.toContain('password');
  });
});
