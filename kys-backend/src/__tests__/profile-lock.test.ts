import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminToken, loginAdmin, request } from './helpers/setup';
import { cleanup, createTestFaculty, createTestStudent, findUserIdByUsername, loginAs } from './helpers/seed';

const createdUserIds: number[] = [];

async function track(username: string) {
  const id = await findUserIdByUsername(username);
  if (id) createdUserIds.push(id);
  return id;
}

const buildValidStudentPayload = (overrides: Record<string, any> = {}) => ({
  full_name: 'Test Student One',
  semester: 3,
  section: 'A',
  year_of_admission: 2023,
  personal_info: {
    mobile_no: '9999999999',
    personal_email: 'student.test@example.com',
    college_email: 'student.test@college.com',
    linked_in_id: 'https://linkedin.com/in/student-test',
    permanent_address: 'Permanent Address',
    dob: '2003-01-10',
    gender: 'M',
    father_name: 'Father Test',
    father_mobile_no: '9999999998',
    father_email: 'father@example.com',
    father_occupation: 'Service',
    mother_name: 'Mother Test',
    mother_mobile_no: '9999999997',
    mother_email: 'mother@example.com',
    mother_occupation: 'Teacher',
    emergency_contact_name: 'Guardian Test',
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
  ...overrides,
});

describe('Profile Lock and Faculty Mentee Editing', () => {
  let facultyAToken = '';
  let facultyBToken = '';
  let student1Token = '';
  let student2Token = '';

  let facultyAId: number | null = null;
  let facultyBId: number | null = null;

  let student1Uid = '';
  let student2Uid = '';
  let student1DbId: number | null = null;
  let student2DbId: number | null = null;

  beforeAll(async () => {
    await loginAdmin();

    // 1. Create Faculty A
    const facA = await createTestFaculty();
    expect(facA.res.status).toBe(201);
    await track(facA.payload.username);
    const loginFacA = await loginAs(facA.payload.username, facA.payload.password);
    facultyAToken = loginFacA.body.access_token;

    // 2. Create Faculty B
    const facB = await createTestFaculty();
    expect(facB.res.status).toBe(201);
    await track(facB.payload.username);
    const loginFacB = await loginAs(facB.payload.username, facB.payload.password);
    facultyBToken = loginFacB.body.access_token;

    // Resolve faculty database IDs
    const facList = await request<any[]>('GET', '/api/admin/faculty', undefined, adminToken);
    const facListData = Array.isArray(facList.body) ? facList.body : facList.body?.data || [];
    facultyAId = facListData.find((f: any) => f.email === facA.payload.email)?.id ?? null;
    facultyBId = facListData.find((f: any) => f.email === facB.payload.email)?.id ?? null;

    // 3. Create Student 1 (assigned to Faculty A)
    const st1 = await createTestStudent({ semester: 3 });
    expect(st1.res.status).toBe(201);
    await track(st1.payload.username);
    student1Uid = st1.payload.uid;
    const loginSt1 = await loginAs(st1.payload.username, st1.payload.password);
    student1Token = loginSt1.body.access_token;

    // 4. Create Student 2 (assigned to Faculty B)
    const st2 = await createTestStudent({ semester: 3 });
    expect(st2.res.status).toBe(201);
    await track(st2.payload.username);
    student2Uid = st2.payload.uid;
    const loginSt2 = await loginAs(st2.payload.username, st2.payload.password);
    student2Token = loginSt2.body.access_token;

    // Initialize Student 1 profile with valid data
    const init1 = await request('PUT', '/api/student/me', buildValidStudentPayload(), student1Token);
    expect([200, 201]).toContain(init1.status);

    // Initialize Student 2 profile with valid data
    const init2 = await request('PUT', '/api/student/me', buildValidStudentPayload({ full_name: 'Student Two' }), student2Token);
    expect([200, 201]).toContain(init2.status);

    // Assign Student 1 -> Faculty A
    const search1 = await request<any>('GET', `/api/students?uid=${student1Uid}`, undefined, adminToken);
    const search1Data = Array.isArray(search1.body) ? search1.body : search1.body?.data || [];
    student1DbId = search1Data[0]?.id;
    if (student1DbId && facultyAId) {
      await request('PUT', `/api/students/${student1DbId}`, { mentor_id: facultyAId }, adminToken);
    }

    // Assign Student 2 -> Faculty B
    const search2 = await request<any>('GET', `/api/students?uid=${student2Uid}`, undefined, adminToken);
    const search2Data = Array.isArray(search2.body) ? search2.body : search2.body?.data || [];
    student2DbId = search2Data[0]?.id;
    if (student2DbId && facultyBId) {
      await request('PUT', `/api/students/${student2DbId}`, { mentor_id: facultyBId }, adminToken);
    }
  });

  afterAll(async () => {
    await cleanup(createdUserIds);
  });

  it('TEST 1: Unlocked student can update their profile (Expected: SUCCESS)', async () => {
    // Check initial unlocked state
    const profileRes = await request<any>('GET', '/api/student/me', undefined, student1Token);
    expect(profileRes.status).toBe(200);
    expect(profileRes.body.data.is_profile_locked).toBe(false);

    // Update profile
    const updateRes = await request<any>(
      'PUT',
      '/api/student/me',
      buildValidStudentPayload({
        full_name: 'Student One Updated',
        section: 'B',
      }),
      student1Token,
    );

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.success).toBe(true);
  });

  it('TEST 4: Assigned faculty can lock their mentee (Expected: SUCCESS, is_profile_locked = true)', async () => {
    const lockRes = await request<any>(
      'PUT',
      `/api/faculty/me/mentees/${student1Uid}/lock`,
      {},
      facultyAToken,
    );

    expect(lockRes.status).toBe(200);
    expect(lockRes.body.success).toBe(true);
    expect(lockRes.body.data.is_profile_locked).toBe(true);
    expect(lockRes.body.data.profile_locked_by).toBe(facultyAId);
    expect(lockRes.body.data.profile_locked_at).toBeDefined();
  });

  it('TEST 13: Lock state is correctly returned by student profile API (GET /api/student/me)', async () => {
    const res = await request<any>('GET', '/api/student/me', undefined, student1Token);
    expect(res.status).toBe(200);
    expect(res.body.data.is_profile_locked).toBe(true);
    expect(res.body.data.profile_locked_by).toBe(facultyAId);
    expect(res.body.data.profile_locked_at).not.toBeNull();
  });

  it('TEST 14: Lock state is correctly returned by faculty mentee API (GET /api/faculty/me/mentees/:uid)', async () => {
    const res = await request<any>(
      'GET',
      `/api/faculty/me/mentees/${student1Uid}`,
      undefined,
      facultyAToken,
    );
    expect(res.status).toBe(200);
    const menteeData = res.body.data || res.body;
    expect(menteeData.is_profile_locked).toBe(true);
    expect(menteeData.profile_locked_by).toBe(facultyAId);
  });

  it('TEST 2 & STEP 14: Locked student cannot update profile directly via API (Expected: 403 PROFILE_LOCKED)', async () => {
    // 1. Direct call to PUT /api/student/me
    const directPut1 = await request<any>(
      'PUT',
      '/api/student/me',
      buildValidStudentPayload({
        full_name: 'Hacked Name Attempt',
        section: 'Z',
      }),
      student1Token,
    );

    expect(directPut1.status).toBe(403);
    expect(directPut1.body.success).toBe(false);
    expect(directPut1.body.error?.code).toBe('PROFILE_LOCKED');

    // 2. Direct call to PUT /api/students/me
    const directPut2 = await request<any>(
      'PUT',
      '/api/students/me',
      buildValidStudentPayload({
        full_name: 'Another Bypass Attempt',
      }),
      student1Token,
    );

    expect(directPut2.status).toBe(403);
    expect(directPut2.body.success).toBe(false);
    expect(directPut2.body.error?.code).toBe('PROFILE_LOCKED');
  });

  it('TEST 3: Locked student cannot upload/change profile photo (Expected: 403 PROFILE_LOCKED)', async () => {
    const uploadRes = await request<any>(
      'POST',
      '/api/student/me/upload-photo',
      {},
      student1Token,
    );

    expect(uploadRes.status).toBe(403);
    expect(uploadRes.body.success).toBe(false);
    expect(uploadRes.body.error?.code).toBe('PROFILE_LOCKED');
  });

  it('TEST 6 & 7: Assigned faculty can edit a locked mentee and profile remains locked', async () => {
    const editRes = await request<any>(
      'PUT',
      `/api/faculty/me/mentees/${student1Uid}/profile`,
      buildValidStudentPayload({
        full_name: 'Student One Faculty Edited',
        section: 'C',
      }),
      facultyAToken,
    );

    expect(editRes.status).toBe(200);
    expect(editRes.body.success).toBe(true);
    expect(editRes.body.data.student.full_name).toContain('Student One Faculty Edited');
    expect(editRes.body.data.student.is_profile_locked).toBe(true);

    // Verify via Student GET API that changes took effect AND profile is STILL locked
    const getRes = await request<any>('GET', '/api/student/me', undefined, student1Token);
    expect(getRes.status).toBe(200);
    expect(getRes.body.data.full_name).toContain('Student One Faculty Edited');
    expect(getRes.body.data.section).toBe('C');
    expect(getRes.body.data.is_profile_locked).toBe(true);
  });

  it("TEST 8: Faculty A cannot lock Faculty B's mentee (Expected: 404)", async () => {
    const res = await request<any>(
      'PUT',
      `/api/faculty/me/mentees/${student2Uid}/lock`,
      {},
      facultyAToken,
    );

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("TEST 9: Faculty A cannot edit Faculty B's mentee (Expected: 404)", async () => {
    const res = await request<any>(
      'PUT',
      `/api/faculty/me/mentees/${student2Uid}/profile`,
      buildValidStudentPayload({
        full_name: 'Malicious Edit By Faculty A',
      }),
      facultyAToken,
    );

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it('TEST 10: Unauthenticated user cannot lock or unlock (Expected: 401)', async () => {
    const lockRes = await request<any>('PUT', `/api/faculty/me/mentees/${student1Uid}/lock`, {});
    expect(lockRes.status).toBe(401);

    const unlockRes = await request<any>('PUT', `/api/faculty/me/mentees/${student1Uid}/unlock`, {});
    expect(unlockRes.status).toBe(401);
  });

  it('TEST 11: Student cannot call faculty lock/unlock/edit endpoints (Expected: 403)', async () => {
    const lockRes = await request<any>(
      'PUT',
      `/api/faculty/me/mentees/${student1Uid}/lock`,
      {},
      student1Token,
    );
    expect(lockRes.status).toBe(403);

    const unlockRes = await request<any>(
      'PUT',
      `/api/faculty/me/mentees/${student1Uid}/unlock`,
      {},
      student1Token,
    );
    expect(unlockRes.status).toBe(403);

    const editRes = await request<any>(
      'PUT',
      `/api/faculty/me/mentees/${student1Uid}/profile`,
      buildValidStudentPayload({ full_name: 'Student Impersonating Faculty' }),
      student1Token,
    );
    expect(editRes.status).toBe(403);
  });

  it('TEST 5: Assigned faculty can unlock their mentee (Expected: SUCCESS, is_profile_locked = false)', async () => {
    const unlockRes = await request<any>(
      'PUT',
      `/api/faculty/me/mentees/${student1Uid}/unlock`,
      {},
      facultyAToken,
    );

    expect(unlockRes.status).toBe(200);
    expect(unlockRes.body.success).toBe(true);
    expect(unlockRes.body.data.is_profile_locked).toBe(false);
    expect(unlockRes.body.data.profile_locked_by).toBeNull();
    expect(unlockRes.body.data.profile_locked_at).toBeNull();

    // Student can now edit again
    const editRes = await request<any>(
      'PUT',
      '/api/student/me',
      buildValidStudentPayload({
        full_name: 'Student One Unlocked Editing',
        section: 'A',
      }),
      student1Token,
    );

    expect(editRes.status).toBe(200);
    expect(editRes.body.success).toBe(true);
  });

  it('TEST 12: Admin behavior remains compatible with existing profile management permissions', async () => {
    // Lock student 1 first
    await request<any>('PUT', `/api/faculty/me/mentees/${student1Uid}/lock`, {}, facultyAToken);

    // Admin updates student 1's mentor assignment
    if (student1DbId && facultyBId) {
      const adminUpdate = await request<any>(
        'PUT',
        `/api/students/${student1DbId}`,
        { mentor_id: facultyBId },
        adminToken,
      );
      expect(adminUpdate.status).toBe(200);
    }

    // Verify student view remains locked and updated mentor
    const profileRes = await request<any>('GET', '/api/student/me', undefined, student1Token);
    expect(profileRes.status).toBe(200);
    expect(profileRes.body.data.is_profile_locked).toBe(true);
  });
});
