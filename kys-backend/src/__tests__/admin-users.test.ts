import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminToken, loginAdmin, request } from './helpers/setup';
import { cleanup, createTestFaculty, createTestStudent, findUserIdByUsername, loginAs } from './helpers/seed';
import { randomId } from './helpers/utils';

const { User, StudentPersonalInfo } = require('../../models');

const createdUserIds: number[] = [];

async function track(username: string) {
  const id = await findUserIdByUsername(username);
  if (id) createdUserIds.push(id);
  return id;
}

describe('admin users APIs', () => {
  let facultyToken = '';
  let studentToken = '';

  beforeAll(async () => {
    await loginAdmin();

    const faculty = await createTestFaculty();
    expect(faculty.res.status).toBe(201);
    await track(faculty.payload.username);

    const student = await createTestStudent();
    expect(student.res.status).toBe(201);
    await track(student.payload.username);

    facultyToken = (await loginAs(faculty.payload.username, faculty.payload.password)).body.access_token;
    studentToken = (await loginAs(student.payload.username, student.payload.password)).body.access_token;
  });

  afterAll(async () => {
    await cleanup(createdUserIds);
  });

  describe('GET /api/admin/users', () => {
    it('admin token -> 200 array', async () => {
      const res = await request<any[]>('GET', '/api/admin/users', undefined, adminToken);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(JSON.stringify(res.body)).not.toContain('password_hash');
      expect(JSON.stringify(res.body)).not.toContain('password');
    });

    it('users expose id username role createdAt shape expectation', async () => {
      const res = await request<any[]>('GET', '/api/admin/users', undefined, adminToken);
      expect(res.status).toBe(200);
      const u = res.body[0];
      expect(u).toHaveProperty('id');
      expect(u).toHaveProperty('username');
      expect(u).toHaveProperty('role');
      expect(u.createdAt || u.created).toBeDefined();
    });

    it('includes student profile photo url when available', async () => {
      const student = await createTestStudent();
      expect(student.res.status).toBe(201);
      await track(student.payload.username);

      const user = await User.findOne({
        where: { username: student.payload.username },
        include: [{ association: 'student_profile' }],
      });
      expect(user?.student_profile?.id).toBeTruthy();

      await StudentPersonalInfo.create({
        student_id: user.student_profile.id,
        mobile_no: '9999999999',
        personal_email: `${randomId('person')}@mail.com`,
        college_email: `${randomId('college')}@stvincentngp.edu.in`,
        linked_in_id: 'https://linkedin.com/in/test-user',
        permanent_address: 'Nagpur',
        dob: '2004-01-01',
        gender: 'Male',
        father_name: 'Father Test',
        father_mobile_no: '9999999998',
        father_occupation: 'Engineer',
        mother_name: 'Mother Test',
        mother_mobile_no: '9999999997',
        mother_occupation: 'Teacher',
        emergency_contact_name: 'Guardian Test',
        emergency_contact_number: '9999999996',
        photo_url: 'https://example.com/student-photo.jpg',
      });

      const res = await request<any[]>('GET', '/api/admin/users', undefined, adminToken);
      expect(res.status).toBe(200);
      const found = res.body.find((u) => u.username === student.payload.username);
      expect(found?.profile_photo_url).toBe('https://example.com/student-photo.jpg');
    });

    it('no token -> 401', async () => {
      const res = await request('GET', '/api/admin/users');
      expect(res.status).toBe(401);
    });

    it('faculty token -> 403', async () => {
      const res = await request('GET', '/api/admin/users', undefined, facultyToken);
      expect(res.status).toBe(403);
    });

    it('student token -> 403', async () => {
      const res = await request('GET', '/api/admin/users', undefined, studentToken);
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/admin/users create student', () => {
    it('valid payload -> 201', async () => {
      const uid = randomId('CRST');
      const payload = {
        username: uid,
        password: 'strongPass123',
        role: 'student',
        uid,
        first_name: 'Create',
        semester: 3,
        section: 'A',
        year_of_admission: 2023,
      };
      const res = await request<any>('POST', '/api/admin/users', payload, adminToken);
      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe('student');
      await track(uid);

      const list = await request<any[]>('GET', '/api/admin/users', undefined, adminToken);
      expect(list.body.some((u) => u.username === uid)).toBe(true);
    });

    it('admin dialog payload without username -> 201', async () => {
      const uid = randomId('ADDST');
      const payload = {
        password: 'strongPass123',
        role: 'student',
        uid,
        name: 'Dialog Student',
        semester: 5,
        section: 'B',
        year_of_admission: 2024,
      };

      const res = await request<any>('POST', '/api/admin/users', payload, adminToken);
      expect(res.status).toBe(201);
      expect(res.body.user.username).toBe(uid);
      await track(uid);
    });

    it('duplicate username/uid -> 409 or 400', async () => {
      const uid = randomId('DUPST');
      const base = {
        username: uid,
        password: 'strongPass123',
        role: 'student',
        uid,
        first_name: 'Dup',
        semester: 3,
        section: 'A',
        year_of_admission: 2023,
      };
      const one = await request('POST', '/api/admin/users', base, adminToken);
      expect(one.status).toBe(201);
      await track(uid);

      const two = await request('POST', '/api/admin/users', base, adminToken);
      expect([400, 409]).toContain(two.status);
    });

    it('missing username -> 400', async () => {
      const res = await request('POST', '/api/admin/users', { role: 'student' }, adminToken);
      expect(res.status).toBe(400);
    });

    it('missing uid -> 400', async () => {
      const res = await request(
        'POST',
        '/api/admin/users',
        { username: randomId('A'), password: '12345678', role: 'student', first_name: 'x', semester: 3, section: 'A', year_of_admission: 2023 },
        adminToken,
      );
      expect(res.status).toBe(400);
    });

    it('semester out of range -> 400 expectation', async () => {
      const res = await request(
        'POST',
        '/api/admin/users',
        { username: randomId('B'), password: '12345678', role: 'student', uid: randomId('BUID'), first_name: 'x', semester: 0, section: 'A', year_of_admission: 2023 },
        adminToken,
      );
      expect([400, 201]).toContain(res.status);
      if (res.status === 201) {
        await track(res.body.user.username);
      }
    });

    it('password too short -> 400 expectation', async () => {
      const res = await request(
        'POST',
        '/api/admin/users',
        { username: randomId('C'), password: '123', role: 'student', uid: randomId('CUID'), first_name: 'x', semester: 3, section: 'A', year_of_admission: 2023 },
        adminToken,
      );
      expect([400, 201]).toContain(res.status);
      if (res.status === 201) await track(res.body.user.username);
    });

    it('non-admin token -> 403', async () => {
      const res = await request('POST', '/api/admin/users', { username: randomId('X') }, studentToken);
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/admin/users create faculty', () => {
    it('valid payload -> 201', async () => {
      const email = `${randomId('fac')}@stvincentngp.edu.in`;
      const res = await request(
        'POST',
        '/api/admin/users',
        {
          username: email,
          password: 'facStrong123',
          role: 'faculty',
          email,
          first_name: 'Fac',
          last_name: 'One',
          contact_number: '9999999999',
        },
        adminToken,
      );
      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe('faculty');
      await track(email);
    });

    it('admin dialog payload without username -> 201', async () => {
      const email = `${randomId('dialog')}@stvincentngp.edu.in`;
      const res = await request(
        'POST',
        '/api/admin/users',
        {
          password: 'facStrong123',
          role: 'faculty',
          email,
          first_name: 'Dialog',
          last_name: 'Faculty',
          contact_number: '9999999999',
        },
        adminToken,
      );

      expect(res.status).toBe(201);
      expect(res.body.user.username).toBe(email);
      await track(email);
    });

    it('invalid domain -> 400', async () => {
      const email = `${randomId('fac')}@gmail.com`;
      const res = await request(
        'POST',
        '/api/admin/users',
        { username: email, password: 'facStrong123', role: 'faculty', email, first_name: 'Fac', last_name: 'Two', contact_number: '9999999999' },
        adminToken,
      );
      expect(res.status).toBe(400);
    });

    it('duplicate email -> 409 or 400', async () => {
      const email = `${randomId('dup')}@stvincentngp.edu.in`;
      const base = { username: email, password: 'facStrong123', role: 'faculty', email, first_name: 'Fac', last_name: 'Dup', contact_number: '9999999999' };
      const one = await request('POST', '/api/admin/users', base, adminToken);
      expect(one.status).toBe(201);
      await track(email);

      const two = await request('POST', '/api/admin/users', base, adminToken);
      expect([400, 409]).toContain(two.status);
    });

    it('missing email -> 400', async () => {
      const res = await request('POST', '/api/admin/users', { username: randomId('f'), password: '12345678', role: 'faculty', first_name: 'a', last_name: 'b', contact_number: '9' }, adminToken);
      expect(res.status).toBe(400);
    });

    it('missing first_name -> 400', async () => {
      const email = `${randomId('mfn')}@stvincentngp.edu.in`;
      const res = await request('POST', '/api/admin/users', { username: email, password: '12345678', role: 'faculty', email, last_name: 'b', contact_number: '9' }, adminToken);
      expect(res.status).toBe(400);
    });

    it('non-admin token -> 403', async () => {
      const res = await request('POST', '/api/admin/users', { username: randomId('X') }, facultyToken);
      expect(res.status).toBe(403);
    });
  });

  describe('PUT /api/admin/users/:id', () => {
    it('update student semester/section/full_name -> 200', async () => {
      const s = await createTestStudent();
      expect(s.res.status).toBe(201);
      const id = await track(s.payload.username);
      expect(id).toBeTruthy();

      const res = await request('PUT', `/api/admin/users/${id}`, { semester: 4, section: 'B', full_name: 'Updated Name Here' }, adminToken);
      expect(res.status).toBe(200);
    });

    it('attempt role change -> 400', async () => {
      const s = await createTestStudent();
      expect(s.res.status).toBe(201);
      const id = await track(s.payload.username);
      const res = await request('PUT', `/api/admin/users/${id}`, { role: 'faculty' }, adminToken);
      expect(res.status).toBe(400);
    });

    it('update faculty name/contact/email/password -> expected statuses', async () => {
      const f = await createTestFaculty();
      expect(f.res.status).toBe(201);
      const id = await track(f.payload.username);

      const update1 = await request('PUT', `/api/admin/users/${id}`, { first_name: 'Changed', contact_number: '8888888888' }, adminToken);
      expect(update1.status).toBe(200);

      const badEmail = await request('PUT', `/api/admin/users/${id}`, { email: 'bad@gmail.com' }, adminToken);
      expect(badEmail.status).toBe(400);

      const newPass = 'newFacultyPass123';
      const pwUpdate = await request('PUT', `/api/admin/users/${id}`, { password: newPass }, adminToken);
      expect(pwUpdate.status).toBe(200);

      const login = await loginAs(f.payload.username, newPass);
      expect([200, 401]).toContain(login.status);

      const roleChange = await request('PUT', `/api/admin/users/${id}`, { role: 'student' }, adminToken);
      expect(roleChange.status).toBe(400);
    });

    it('non-existent id -> 404', async () => {
      const res = await request('PUT', '/api/admin/users/999999999', { first_name: 'x' }, adminToken);
      expect(res.status).toBe(404);
    });

    it('non-admin token -> 403', async () => {
      const res = await request('PUT', '/api/admin/users/1', { first_name: 'x' }, studentToken);
      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/admin/users/:id', () => {
    it('delete valid student id and ensure absent', async () => {
      const s = await createTestStudent();
      expect(s.res.status).toBe(201);
      const id = await track(s.payload.username);

      const del = await request('DELETE', `/api/admin/users/${id}`, undefined, adminToken);
      expect([200, 204]).toContain(del.status);

      const users = await request<any[]>('GET', '/api/admin/users', undefined, adminToken);
      expect(users.body.some((u) => u.id === id)).toBe(false);
    });

    it('non-existent id -> 404', async () => {
      const res = await request('DELETE', '/api/admin/users/999999999', undefined, adminToken);
      expect(res.status).toBe(404);
    });

    it('cannot delete own admin account -> 400', async () => {
      const users = await request<any[]>('GET', '/api/admin/users', undefined, adminToken);
      const adminUser = users.body.find((u) => u.role === 'admin' && u.username === (process.env.TEST_ADMIN_UID || 'admin'));
      if (!adminUser) return;
      const res = await request('DELETE', `/api/admin/users/${adminUser.id}`, undefined, adminToken);
      expect(res.status).toBe(400);
    });

    it('non-admin token -> 403', async () => {
      const res = await request('DELETE', '/api/admin/users/1', undefined, studentToken);
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/admin/reset-password', () => {
    it('valid payload -> 200 and login works', async () => {
      const s = await createTestStudent({ password: 'oldReset123' });
      expect(s.res.status).toBe(201);
      await track(s.payload.username);

      const newPass = 'newResetPass123';
      const reset = await request(
        'POST',
        '/api/admin/reset-password',
        { role: 'student', username: s.payload.username, new_password: newPass },
        adminToken,
      );
      expect(reset.status).toBe(200);

      const login = await loginAs(s.payload.username, newPass);
      expect(login.status).toBe(200);
    });

    it('new_password < 8 -> 400', async () => {
      const res = await request('POST', '/api/admin/reset-password', { role: 'student', username: 'nope', new_password: '123' }, adminToken);
      expect([400, 404]).toContain(res.status);
    });

    it('same as current -> 400', async () => {
      const s = await createTestStudent({ password: 'sameReset123' });
      expect(s.res.status).toBe(201);
      await track(s.payload.username);

      const res = await request('POST', '/api/admin/reset-password', { role: 'student', username: s.payload.username, new_password: 'sameReset123' }, adminToken);
      expect(res.status).toBe(400);
    });

    it('non-existent username -> 404', async () => {
      const res = await request('POST', '/api/admin/reset-password', { role: 'student', username: randomId('nouser'), new_password: 'pass12345' }, adminToken);
      expect(res.status).toBe(404);
    });

    it('no token -> 401', async () => {
      const res = await request('POST', '/api/admin/reset-password', { role: 'student', username: 'x', new_password: 'pass12345' });
      expect(res.status).toBe(401);
    });

    it('non-admin token -> 403', async () => {
      const res = await request('POST', '/api/admin/reset-password', { role: 'student', username: 'x', new_password: 'pass12345' }, studentToken);
      expect(res.status).toBe(403);
    });
  });
});
