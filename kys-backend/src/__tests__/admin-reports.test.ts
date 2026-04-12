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
  let noBacklogUid = '';

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

    noBacklogUid = randomId('RPTNB');
    const noBacklogStudent = await createTestStudent({
      uid: noBacklogUid,
      username: noBacklogUid,
      first_name: 'No',
      last_name: 'Backlog',
      semester: 3,
      section: 'A',
      year_of_admission: 2023,
    });
    expect(noBacklogStudent.res.status).toBe(201);
    await track(noBacklogUid);

    const noBacklog = await Student.findOne({ where: { uid: noBacklogUid } });
    expect(noBacklog?.id).toBeTruthy();

    await PostAdmissionAcademicRecord.create({
      student_id: noBacklog.id,
      semester: 3,
      sgpa: 7.5,
      backlog_subjects: 'N/A, NA',
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

  it('backlog list excludes placeholder-only backlog subjects', async () => {
    const res = await fetch(`${baseUrl}/api/admin/reports/backlogs`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const body = await res.json();

    const studentWithBacklog = body.find((row: { uid: string }) => row.uid === seededUid);
    const studentWithoutBacklog = body.find((row: { uid: string }) => row.uid === noBacklogUid);

    expect(studentWithBacklog).toBeTruthy();
    expect(studentWithBacklog.subjects).toContain('Mathematics III');
    expect(studentWithoutBacklog).toBeFalsy();
  });

  it('general report backlog count is zero for placeholder-only values', async () => {
    const res = await fetch(`${baseUrl}/api/admin/reports/general`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const body = await res.json();

    const placeholderStudent = body.find((row: { uid: string }) => row.uid === noBacklogUid);
    expect(placeholderStudent).toBeTruthy();
    expect(placeholderStudent.academic_records).toBeTruthy();
    expect(placeholderStudent.academic_records[0]?.backlogs).toBe(0);
  });
});
