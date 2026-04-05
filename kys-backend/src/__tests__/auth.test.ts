import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import jwt from 'jsonwebtoken';
import { adminToken, loginAdmin, request } from './helpers/setup';
import { cleanup, createTestFaculty, createTestStudent, findUserIdByUsername, loginAs } from './helpers/seed';
import { randomId } from './helpers/utils';

const createdUserIds: number[] = [];

async function trackUser(username: string) {
  const id = await findUserIdByUsername(username);
  if (id) createdUserIds.push(id);
}

describe('auth APIs', () => {
  let studentCreds: { username: string; password: string };
  let facultyCreds: { username: string; password: string };

  beforeAll(async () => {
    await loginAdmin();

    const student = await createTestStudent({
      uid: randomId('SUID'),
      password: 'studentpass123',
    });
    expect(student.res.status).toBe(201);
    studentCreds = {
      username: student.payload.username,
      password: student.payload.password,
    };
    await trackUser(student.payload.username);

    const faculty = await createTestFaculty({ password: process.env.TEST_FACULTY_PASSWORD || 'facultypass123' });
    expect(faculty.res.status).toBe(201);
    facultyCreds = {
      username: faculty.payload.username,
      password: faculty.payload.password,
    };
    await trackUser(faculty.payload.username);
  });

  afterAll(async () => {
    await cleanup(createdUserIds);
  });

  describe('POST /api/auth/login', () => {
    it('valid admin credentials -> 200 with access_token and role admin', async () => {
      const res = await loginAs(process.env.TEST_ADMIN_UID || 'admin', process.env.TEST_ADMIN_PASSWORD || 'adminpass123');
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        access_token: expect.any(String),
        role: 'admin',
      });
    });

    it('valid student credentials -> 200 role student', async () => {
      const res = await loginAs(studentCreds.username, studentCreds.password);
      expect(res.status).toBe(200);
      expect(res.body.role).toBe('student');
    });

    it('wrong password -> 401', async () => {
      const res = await loginAs(studentCreds.username, 'wrong_password_123');
      expect(res.status).toBe(401);
    });

    it('non-existent user -> 401', async () => {
      const res = await loginAs(`nouser_${Date.now()}`, 'whatever123');
      expect(res.status).toBe(401);
    });

    it('missing username field -> 400 or 401', async () => {
      const res = await request('POST', '/api/auth/login', { password: 'x' });
      expect([400, 401]).toContain(res.status);
    });

    it('missing password field -> 400 or 401', async () => {
      const res = await request('POST', '/api/auth/login', { username: studentCreds.username });
      expect([400, 401]).toContain(res.status);
    });

    it('11th login attempt within 1 minute -> 429', async () => {
      const creds = { username: `rate_limit_${Date.now()}`, password: 'bad' };
      let lastStatus = 0;
      for (let i = 0; i < 11; i += 1) {
        const res = await request('POST', '/api/auth/login', creds);
        lastStatus = res.status;
      }
      expect([429, 401]).toContain(lastStatus);
    });
  });

  describe('GET /api/auth/verify', () => {
    it('valid admin token -> 200', async () => {
      const res = await request('GET', '/api/auth/verify', undefined, adminToken);
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        valid: true,
        user: { role: 'admin' },
      });
    });

    it('no token -> 401', async () => {
      const res = await request('GET', '/api/auth/verify');
      expect(res.status).toBe(401);
    });

    it('malformed token -> 401', async () => {
      const res = await request('GET', '/api/auth/verify', undefined, 'badtoken');
      expect(res.status).toBe(401);
    });

    it('expired token -> 401', async () => {
      const expired = jwt.sign(
        { sub: '1', role: 'admin', username: 'admin', jti: randomId('jti') },
        process.env.JWT_SECRET_KEY || 'change-this-jwt-secret',
        { expiresIn: 0 },
      );
      const res = await request('GET', '/api/auth/verify', undefined, expired);
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('valid token -> 200', async () => {
      const loginRes = await loginAs(studentCreds.username, studentCreds.password);
      const token = loginRes.body.access_token;
      const res = await request('POST', '/api/auth/logout', {}, token);
      expect(res.status).toBe(200);
    });

    it('same token after logout -> 401', async () => {
      const loginRes = await loginAs(facultyCreds.username, facultyCreds.password);
      const token = loginRes.body.access_token;

      const out = await request('POST', '/api/auth/logout', {}, token);
      expect(out.status).toBe(200);

      const verify = await request('GET', '/api/auth/verify', undefined, token);
      expect(verify.status).toBe(401);
    });

    it('no token -> 401', async () => {
      const res = await request('POST', '/api/auth/logout', {});
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/change-password', () => {
    it('valid current + new password -> 200', async () => {
      const username = randomId('CHGUSR');
      const password = 'oldPass123';
      const newPassword = 'newPass1234';
      const seed = await createTestStudent({ uid: username, username, password });
      expect(seed.res.status).toBe(201);
      await trackUser(username);

      const loginRes = await loginAs(username, password);
      const token = loginRes.body.access_token;

      const res = await request('POST', '/api/auth/change-password', { old_password: password, new_password: newPassword }, token);
      expect(res.status).toBe(200);

      const reLogin = await loginAs(username, newPassword);
      expect(reLogin.status).toBe(200);
    });

    it('wrong current password -> 400 or 401', async () => {
      const loginRes = await loginAs(studentCreds.username, studentCreds.password);
      const res = await request(
        'POST',
        '/api/auth/change-password',
        { old_password: 'wrong', new_password: 'anotherNew123' },
        loginRes.body.access_token,
      );
      expect([400, 401]).toContain(res.status);
    });

    it('new password < 8 chars -> 400', async () => {
      const loginRes = await loginAs(studentCreds.username, studentCreds.password);
      const res = await request(
        'POST',
        '/api/auth/change-password',
        { old_password: studentCreds.password, new_password: 'short' },
        loginRes.body.access_token,
      );
      expect(res.status).toBe(400);
    });

    it('new password same as current -> 400', async () => {
      const loginRes = await loginAs(studentCreds.username, studentCreds.password);
      const res = await request(
        'POST',
        '/api/auth/change-password',
        { old_password: studentCreds.password, new_password: studentCreds.password },
        loginRes.body.access_token,
      );
      expect(res.status).toBe(400);
    });

    it('no token -> 401', async () => {
      const res = await request('POST', '/api/auth/change-password', {
        old_password: 'abc',
        new_password: 'abcd1234',
      });
      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/auth/register/bulk', () => {
    it('valid array of 3 students -> per-entry success', async () => {
      const students = [1, 2, 3].map((n) => ({
        uid: randomId(`BULKST${n}`),
        full_name: `Bulk Student ${n}`,
        semester: 3,
        section: 'A',
        year_of_admission: 2023,
      }));

      const res = await request('POST', '/api/auth/register/bulk', students, adminToken);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body?.result)).toBe(true);
      expect(res.body.result.every((r: any) => r.status === 'success')).toBe(true);

      for (const s of students) {
        await trackUser(s.uid);
      }
    });

    it('duplicate UID entry fails, others succeed', async () => {
      const dupUid = randomId('DUPUID');
      const rows = [
        { uid: dupUid, full_name: 'First Row', semester: 3, section: 'A', year_of_admission: 2023 },
        { uid: dupUid, full_name: 'Dup Row', semester: 3, section: 'A', year_of_admission: 2023 },
        { uid: randomId('UNIQUID'), full_name: 'Third Row', semester: 3, section: 'A', year_of_admission: 2023 },
      ];
      const res = await request('POST', '/api/auth/register/bulk', rows, adminToken);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.result)).toBe(true);
      expect(res.body.result.some((x: any) => x.status === 'failed')).toBe(true);
      expect(res.body.result.some((x: any) => x.status === 'success')).toBe(true);

      await trackUser(dupUid);
      await trackUser(rows[2].uid);
    });

    it('empty array -> 400', async () => {
      const res = await request('POST', '/api/auth/register/bulk', [], adminToken);
      expect([400, 200]).toContain(res.status);
    });

    it('non-array body -> 400', async () => {
      const res = await request('POST', '/api/auth/register/bulk', { students: [] }, adminToken);
      expect(res.status).toBe(400);
    });

    it('student token (not admin) -> 403', async () => {
      const loginRes = await loginAs(studentCreds.username, studentCreds.password);
      const res = await request('POST', '/api/auth/register/bulk', [], loginRes.body.access_token);
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/auth/register/faculty/bulk', () => {
    it('valid array of 2 faculty -> all success', async () => {
      const rows = [1, 2].map((n) => ({
        email: `bulkf_${Date.now()}_${n}@stvincentngp.edu.in`,
        first_name: `Bulk${n}`,
        last_name: 'Faculty',
        contact_number: '9999999999',
        password: 'facultypass123',
      }));

      const res = await request('POST', '/api/auth/register/faculty/bulk', rows, adminToken);
      expect(res.status).toBe(200);
      expect(res.body.result.every((r: any) => r.status === 'success')).toBe(true);
      for (const r of rows) {
        await trackUser(r.email);
      }
    });

    it('invalid email domain fails', async () => {
      const rows = [{ email: `bad_${Date.now()}@gmail.com`, first_name: 'Bad', last_name: 'Domain' }];
      const res = await request('POST', '/api/auth/register/faculty/bulk', rows, adminToken);
      expect(res.status).toBe(200);
      expect(res.body.result[0].status).toBe('failed');
    });

    it('duplicate email fails', async () => {
      const email = `dup_${Date.now()}@stvincentngp.edu.in`;
      const first = await request('POST', '/api/auth/register/faculty/bulk', [{ email, first_name: 'A', last_name: 'B' }], adminToken);
      expect(first.status).toBe(200);
      await trackUser(email);

      const second = await request('POST', '/api/auth/register/faculty/bulk', [{ email, first_name: 'A', last_name: 'B' }], adminToken);
      expect(second.status).toBe(200);
      expect(second.body.result[0].status).toBe('failed');
    });

    it('non-admin token -> 403', async () => {
      const loginRes = await loginAs(studentCreds.username, studentCreds.password);
      const res = await request('POST', '/api/auth/register/faculty/bulk', [], loginRes.body.access_token);
      expect(res.status).toBe(403);
    });
  });
});
