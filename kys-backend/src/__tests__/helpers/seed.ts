import { adminToken, loginAdmin, request } from './setup';

type StudentOverrides = Partial<{
  username: string;
  password: string;
  uid: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  semester: number;
  section: string;
  year_of_admission: number;
}>;

type FacultyOverrides = Partial<{
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  contact_number: string;
}>;

const rand = () => Math.random().toString(36).slice(2, 10);

const token = async () => adminToken || (await loginAdmin());

export async function createTestStudent(overrides: StudentOverrides = {}) {
  const now = Date.now();
  const uid = overrides.uid || `ST${now}${rand().slice(0, 3)}`;

  const payload = {
    username: overrides.username || uid,
    password: overrides.password || 'studentpass123',
    role: 'student',
    uid,
    first_name: overrides.first_name || 'Test',
    middle_name: overrides.middle_name || 'S',
    last_name: overrides.last_name || `Student${rand().slice(0, 3)}`,
    semester: overrides.semester ?? 3,
    section: overrides.section || 'A',
    year_of_admission: overrides.year_of_admission ?? 2023,
  };

  const res = await request<any>('POST', '/api/admin/users', payload, await token());
  return { res, payload };
}

export async function createTestFaculty(overrides: FacultyOverrides = {}) {
  const now = Date.now();
  const email = overrides.email || `faculty_${now}_${rand().slice(0, 3)}@stvincentngp.edu.in`;

  const payload = {
    username: overrides.username || email,
    password: overrides.password || 'facultypass123',
    role: 'faculty',
    email,
    first_name: overrides.first_name || 'Test',
    last_name: overrides.last_name || `Faculty${rand().slice(0, 3)}`,
    contact_number: overrides.contact_number || '9999999999',
  };

  const res = await request<any>('POST', '/api/admin/users', payload, await token());
  return { res, payload };
}

export async function cleanup(userIds: number[]) {
  const auth = await token();
  for (const userId of userIds) {
    await request('DELETE', `/api/admin/users/${userId}`, undefined, auth);
  }
}

export async function findUserIdByUsername(username: string): Promise<number | null> {
  const res = await request<any[]>('GET', '/api/admin/users', undefined, await token());
  if (res.status !== 200 || !Array.isArray(res.body)) {
    return null;
  }

  const found = res.body.find((u: any) => u.username === username);
  return found?.id ?? null;
}

export async function loginAs(username: string, password: string) {
  return request<any>('POST', '/api/auth/login', { username, password });
}
