/**
 * Integration tests: profile-photo-required feature (backend enforcement).
 *
 * Covers:
 *  Test 1:  New student + no photo + declaration_accepted → 422 PHOTO_REQUIRED
 *  Test 2:  New student + photo seeded + declaration_accepted → 200 (accepted)
 *  Test 3:  Existing student (no photo) loads profile → 200 (not blocked by GET)
 *  Test 4:  Existing student (no photo) can still do normal draft/autosave PUT → 200
 *  Test 5:  Existing student + no photo + declaration_accepted → 422 PHOTO_REQUIRED
 *  Test 6:  Existing student + photo already saved → declaration_accepted PUT → 200
 *  Test 7:  Draft PUT without declaration_accepted field → always 200 even without photo
 *  Test 8:  Locked student → still returns 403 PROFILE_LOCKED (lock check wins over photo check)
 *  Test 10: Direct backend final-submission request without photo → rejected 422
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminToken, loginAdmin, request } from './helpers/setup';
import { cleanup, createTestFaculty, createTestStudent, findUserIdByUsername, loginAs } from './helpers/seed';

const { StudentPersonalInfo, User } = require('../../models');

const createdUserIds: number[] = [];

async function track(username: string) {
  const id = await findUserIdByUsername(username);
  if (id) createdUserIds.push(id);
  return id;
}

/** Seed a photo_url directly into the DB for a given student username. */
async function seedPhotoForStudent(username: string): Promise<void> {
  const user = await User.findOne({
    where: { username },
    include: [{ association: 'student_profile' }],
  });
  if (!user?.student_profile?.id) return;

  const studentId = user.student_profile.id;
  const existing = await StudentPersonalInfo.findOne({ where: { student_id: studentId } });

  const photoData = {
    photo_url: 'https://res.cloudinary.com/demo/image/upload/v1/sample.pdf',
    photo_public_id: 'students/sample-photo-test',
    photo_preview_url: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
  };

  if (existing) {
    await existing.update(photoData);
  } else {
    await StudentPersonalInfo.create({ student_id: studentId, ...photoData });
  }
}

/** Clear photo fields from DB for a given student username. */
async function clearPhotoForStudent(username: string): Promise<void> {
  const user = await User.findOne({
    where: { username },
    include: [{ association: 'student_profile' }],
  });
  if (!user?.student_profile?.id) return;

  const studentId = user.student_profile.id;
  const existing = await StudentPersonalInfo.findOne({ where: { student_id: studentId } });
  if (existing) {
    await existing.update({ photo_url: null, photo_public_id: null, photo_preview_url: null });
  }
}

describe('student photo required — backend enforcement', () => {
  let studentToken = '';
  let studentUsername = '';
  let facultyToken = '';
  let studentUid = '';
  let studentDbId: number | null = null;
  let facultyId: number | null = null;

  beforeAll(async () => {
    await loginAdmin();

    const student = await createTestStudent({ semester: 3, section: 'A' });
    expect(student.res.status).toBe(201);
    await track(student.payload.username);
    studentUsername = student.payload.username;
    studentUid = student.payload.uid;
    studentToken = (await loginAs(student.payload.username, student.payload.password)).body.access_token;

    const faculty = await createTestFaculty();
    expect(faculty.res.status).toBe(201);
    await track(faculty.payload.username);
    facultyToken = (await loginAs(faculty.payload.username, faculty.payload.password)).body.access_token;

    const students = await request<any[]>('GET', `/api/students?uid=${studentUid}`, undefined, adminToken);
    const studentList = Array.isArray(students.body) ? students.body : students.body?.data || [];
    studentDbId = studentList[0]?.id ?? null;

    const faculties = await request<any[]>('GET', '/api/admin/faculty', undefined, adminToken);
    const facultyList = Array.isArray(faculties.body) ? faculties.body : faculties.body?.data || [];
    facultyId = facultyList.find((f: any) => f.email === faculty.payload.email)?.id ?? null;

    if (studentDbId && facultyId) {
      await request('PUT', `/api/students/${studentDbId}`, { mentor_id: facultyId }, adminToken);
    }
  });

  afterAll(async () => {
    await cleanup(createdUserIds);
  });

  // ── Test 3 ─────────────────────────────────────────────────────────────────
  it('TEST 3: Existing student without photo can load profile (GET → 200)', async () => {
    await clearPhotoForStudent(studentUsername);
    const res = await request<any>('GET', '/api/student/me', undefined, studentToken);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ── Test 4 ─────────────────────────────────────────────────────────────────
  it('TEST 4: Normal draft/autosave PUT without declaration_accepted and no photo → 200', async () => {
    await clearPhotoForStudent(studentUsername);

    // A typical autosave payload — no declaration_accepted field at all
    const draftPayload = {
      full_name: 'Draft Save Student',
      semester: 3,
      section: 'A',
      personal_info: {
        mobile_no: '9876543210',
        permanent_address: 'Draft Address',
      },
    };

    const res = await request('PUT', '/api/student/me', draftPayload, studentToken);
    expect(res.status).toBe(200);
  });

  // ── Test 7 ─────────────────────────────────────────────────────────────────
  it('TEST 7: Draft PUT with declaration_accepted: false (not completing) and no photo → 200', async () => {
    await clearPhotoForStudent(studentUsername);

    const res = await request('PUT', '/api/student/me', {
      full_name: 'Draft Student',
      declaration_accepted: false,
    }, studentToken);

    // declaration_accepted: false is not a final submission signal — must pass
    expect(res.status).toBe(200);
  });

  // ── Test 1 / Test 10 ───────────────────────────────────────────────────────
  it('TEST 1 & 10: Final submission (declaration_accepted: true) without photo → 422 PHOTO_REQUIRED', async () => {
    await clearPhotoForStudent(studentUsername);

    const res = await request<any>('PUT', '/api/student/me', {
      declaration_accepted: true,
    }, studentToken);

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error?.code).toBe('PHOTO_REQUIRED');
    expect(typeof res.body.error?.message).toBe('string');
    expect(res.body.error.message.length).toBeGreaterThan(0);
  });

  // ── Test 5 ─────────────────────────────────────────────────────────────────
  it('TEST 5: Existing student (no photo) + final submission → 422 PHOTO_REQUIRED', async () => {
    // Simulate an existing student who has filled all other fields but never uploaded a photo
    await clearPhotoForStudent(studentUsername);
    await request('PUT', '/api/student/me', {
      full_name: 'Existing No Photo',
      semester: 3,
      section: 'A',
    }, studentToken);

    const res = await request<any>('PUT', '/api/student/me', {
      declaration_accepted: true,
    }, studentToken);

    expect(res.status).toBe(422);
    expect(res.body.error?.code).toBe('PHOTO_REQUIRED');
  });

  // ── Test 2 / Test 6 ───────────────────────────────────────────────────────
  it('TEST 2 & 6: Student with photo + declaration_accepted: true → 200 (accepted)', async () => {
    await seedPhotoForStudent(studentUsername);

    const res = await request<any>('PUT', '/api/student/me', {
      declaration_accepted: true,
    }, studentToken);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  // ── Verify photo is not overwritten by regular PUT ─────────────────────────
  it('TEST 6b: Photo saved in DB remains intact after a regular draft PUT', async () => {
    await seedPhotoForStudent(studentUsername);

    // A regular profile save (autosave) that includes empty photo fields in personal_info
    // — the stripManagedPhotoFields guard should protect the saved photo
    const res = await request('PUT', '/api/student/me', {
      personal_info: { mobile_no: '9111111111', photo_url: '', photoUrl: '' },
    }, studentToken);
    expect(res.status).toBe(200);

    // Reload and confirm photo_url is still intact
    const user = await User.findOne({
      where: { username: studentUsername },
      include: [{ association: 'student_profile' }],
    });
    const pi = await StudentPersonalInfo.findOne({ where: { student_id: user.student_profile.id } });
    expect(pi?.photo_url).toBeTruthy();
  });

  // ── Test 8 ─────────────────────────────────────────────────────────────────
  it('TEST 8: Locked student → 403 PROFILE_LOCKED (lock check wins, photo check never reached)', async () => {
    // Lock the student
    const lockRes = await request<any>(
      'PUT',
      `/api/faculty/me/mentees/${studentUid}/lock`,
      {},
      facultyToken,
    );
    expect(lockRes.status).toBe(200);
    expect(lockRes.body.data.is_profile_locked).toBe(true);

    // Attempt final submission — should get 403, not 422
    await clearPhotoForStudent(studentUsername);
    const res = await request<any>('PUT', '/api/student/me', {
      declaration_accepted: true,
    }, studentToken);

    expect(res.status).toBe(403);
    expect(res.body.error?.code).toBe('PROFILE_LOCKED');

    // Unlock for cleanup
    await request('PUT', `/api/faculty/me/mentees/${studentUid}/unlock`, {}, facultyToken);
  });
});
