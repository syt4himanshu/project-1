import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminToken, loginAdmin } from './helpers/setup';
import { cleanup, createTestStudent, findUserIdByUsername } from './helpers/seed';
import { randomId } from './helpers/utils';

const { Student, PostAdmissionAcademicRecord } = require('../../models');

const createdUserIds: number[] = [];
const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:5002';

async function track(username: string) {
  const id = await findUserIdByUsername(username);
  if (id) createdUserIds.push(id);
  return id;
}

describe('admin report exports', () => {
  let seededUid = '';

  beforeAll(async () => {
    await loginAdmin();

    seededUid = randomId('RPTST');
    const seededStudent = await createTestStudent({
      uid: seededUid,
      username: seededUid,
      first_name: 'Report',
      last_name: 'Student',
      semester: 3,
      section: 'A',
      year_of_admission: 2023,
    });
    expect(seededStudent.res.status).toBe(201);
    await track(seededUid);

    const student = await Student.findOne({ where: { uid: seededUid } });
    expect(student?.id).toBeTruthy();

    await PostAdmissionAcademicRecord.create({
      student_id: student.id,
      semester: 3,
      sgpa: 8.4,
      backlog_subjects: 'Mathematics III',
    });
  });

  afterAll(async () => {
    await cleanup(createdUserIds);
  });

  it('export all returns csv attachment', async () => {
    const res = await fetch(`${baseUrl}/api/admin/reports/export/all`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/csv');
    const body = await res.text();
    expect(body).toContain('"uid"');
    expect(body).toContain(seededUid);
  });

  it('export backlog returns seeded backlog rows', async () => {
    const res = await fetch(`${baseUrl}/api/admin/reports/export/backlogs`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain(seededUid);
    expect(body).toContain('Mathematics III');
  });

  it('export incomplete returns seeded incomplete profile rows', async () => {
    const res = await fetch(`${baseUrl}/api/admin/reports/export/incomplete`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain(seededUid);
    expect(body).toContain('personal_info');
  });
});
