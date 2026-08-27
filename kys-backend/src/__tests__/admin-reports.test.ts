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

  // TEST 6: CSV export contains the required_fields_not_filled column
  it('export incomplete CSV contains required_fields_not_filled column header', async () => {
    const res = await fetch(`${baseUrl}/api/admin/reports/export/incomplete`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const body = await res.text();
    // Column header must be present (toCsv wraps headers in double-quotes)
    expect(body).toContain('"required_fields_not_filled"');
  });

  // TEST 6: count in CSV equals the number of missing_fields entries for the same row
  it('export incomplete CSV required_fields_not_filled count is consistent with missing_fields', async () => {
    const res = await fetch(`${baseUrl}/api/admin/reports/export/incomplete`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const csvText = await res.text();

    // Parse the CSV manually: split into lines, extract headers, find seeded student row
    const lines = csvText.trim().split('\n');
    expect(lines.length).toBeGreaterThan(1);

    // Un-quote a CSV cell
    const unquote = (cell: string) => cell.replace(/^"|"$/g, '').replace(/""/g, '"');
    const headers = lines[0].split(',').map(unquote);

    const missingFieldsIdx = headers.indexOf('missing_fields');
    const countIdx = headers.indexOf('required_fields_not_filled');
    const uidIdx = headers.indexOf('uid');

    expect(missingFieldsIdx).toBeGreaterThan(-1);
    expect(countIdx).toBeGreaterThan(-1);
    expect(uidIdx).toBeGreaterThan(-1);

    // Find the row for our seeded student
    const seededRow = lines.slice(1).find((line) => line.includes(seededUid));
    expect(seededRow).toBeTruthy();

    const cells = seededRow!.split(',').map(unquote);
    const missingFieldsValue = cells[missingFieldsIdx];
    const countValue = Number(cells[countIdx]);

    // Count must equal the number of semicolon-separated missing field entries
    const fieldCount = missingFieldsValue
      .split(';')
      .map((f) => f.trim())
      .filter(Boolean).length;

    expect(countValue).toBe(fieldCount);
    expect(countValue).toBeGreaterThan(0);
  });

  // TEST 2: student without a photo appears in the JSON incomplete report with "Profile Photo" missing
  it('incomplete report JSON includes Profile Photo as a missing field for students without a photo', async () => {
    const res = await fetch(`${baseUrl}/api/admin/reports/incomplete`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const body = await res.json();

    // The seeded student has no photo_url — Profile Photo must appear in missing_fields
    const seededRow = body.find((row: { uid: string }) => row.uid === seededUid);
    expect(seededRow).toBeTruthy();
    expect(seededRow.missing_fields).toContain('Profile Photo');
  });

  // TEST 7: JSON incomplete report returns missing_field_count equal to missing_fields.length
  it('incomplete report JSON missing_field_count equals missing_fields array length', async () => {
    const res = await fetch(`${baseUrl}/api/admin/reports/incomplete`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const body = await res.json();

    const seededRow = body.find((row: { uid: string }) => row.uid === seededUid);
    expect(seededRow).toBeTruthy();
    // The single source of truth: count must always equal the array length
    expect(seededRow.missing_field_count).toBe(seededRow.missing_fields.length);
  });

  // TEST 2 (CSV): Profile Photo appears in the CSV export for a student without a photo
  it('export incomplete CSV contains Profile Photo for student without a photo', async () => {
    const res = await fetch(`${baseUrl}/api/admin/reports/export/incomplete`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });

    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain('Profile Photo');
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
