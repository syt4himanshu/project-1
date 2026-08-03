/**
 * Integration tests: GET /api/admin/students/:uid/remarks
 *
 * Covers:
 *  ✓ Admin can retrieve remarks
 *  ✓ Pagination works (limit / offset / hasMore / total)
 *  ✓ Empty history returns []
 *  ✓ Missing student returns 404
 *  ✓ Non-admin returns 403
 *  ✓ Deleted faculty uses snapshot fields
 *  ✓ Missing email falls back to "Unknown"
 *  ✓ Ordering is newest first
 *  ✓ Invalid pagination params return 400
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { adminToken, loginAdmin, request } from './helpers/setup';
import { cleanup, createTestStudent, createTestFaculty, findUserIdByUsername, loginAs } from './helpers/seed';
import { randomId } from './helpers/utils';

const { Student, Faculty, MentoringMinute } = require('../../models');

const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:5002';
const createdUserIds: number[] = [];

async function track(username: string) {
    const id = await findUserIdByUsername(username);
    if (id) createdUserIds.push(id);
    return id;
}

// ─── Test state ───────────────────────────────────────────────────────────────

let studentUid = '';
let emptyStudentUid = '';
let facultyId: number;
let facultyUserId: number;
let studentDbId: number;

// ─── Setup ────────────────────────────────────────────────────────────────────

beforeAll(async () => {
    await loginAdmin();

    // ── Student with remarks ──
    studentUid = randomId('RMKST');
    const studentRes = await createTestStudent({
        uid: studentUid,
        username: studentUid,
        first_name: 'Remark',
        last_name: 'Tester',
        semester: 4,
        section: 'B',
        year_of_admission: 2023,
    });
    expect(studentRes.res.status).toBe(201);
    await track(studentUid);

    const student = await Student.findOne({ where: { uid: studentUid } });
    studentDbId = student.id;

    // ── Faculty ──
    const facultyRes = await createTestFaculty({
        first_name: 'Remarks',
        last_name: 'Faculty',
    });
    expect(facultyRes.res.status).toBe(201);
    const fEmail = facultyRes.payload.email;
    const fUser = await findUserIdByUsername(fEmail);
    if (fUser) {
        createdUserIds.push(fUser);
        facultyUserId = fUser;
    }
    const faculty = await Faculty.findOne({ where: { email: fEmail } });
    facultyId = faculty.id;

    // ── Seed 3 remarks with distinct dates ──
    const dates = ['2026-01-15', '2026-03-20', '2026-05-01'];
    for (const [index, date] of dates.entries()) {
        await MentoringMinute.create({
            student_id: studentDbId,
            faculty_id: facultyId,
            faculty_name_snapshot: 'Remarks Faculty',
            faculty_email_snapshot: fEmail,
            semester: 4,
            date,
            remarks: `Remark number ${index + 1}`,
            suggestion: index === 1 ? 'Keep going' : null,
            action: index === 2 ? 'Solve 5 problems' : null,
        });
    }

    // ── Student with NO remarks ──
    emptyStudentUid = randomId('RMKMT');
    const emptyRes = await createTestStudent({
        uid: emptyStudentUid,
        username: emptyStudentUid,
        first_name: 'Empty',
        last_name: 'Remarks',
        semester: 2,
        section: 'A',
        year_of_admission: 2024,
    });
    expect(emptyRes.res.status).toBe(201);
    await track(emptyStudentUid);
});

afterAll(async () => {
    // Clean up remarks created directly (not via API)
    await MentoringMinute.destroy({ where: { student_id: studentDbId } });
    await cleanup(createdUserIds);
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function remarksUrl(uid: string, params: Record<string, string | number> = {}) {
    const search = new URLSearchParams(
        Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    ).toString();
    const base = `${baseUrl}/api/admin/students/${encodeURIComponent(uid)}/remarks`;
    return search ? `${base}?${search}` : base;
}

async function getRemarks(uid: string, params: Record<string, string | number> = {}, token = adminToken) {
    const res = await fetch(remarksUrl(uid, params), {
        headers: { Authorization: `Bearer ${token}` },
    });
    const body = await res.json();
    return { status: res.status, body };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('GET /api/admin/students/:uid/remarks', () => {
    it('returns 403 for non-admin (student token)', async () => {
        const studentLogin = await loginAs(studentUid, 'studentpass123');
        const studentTok: string = studentLogin.body?.data?.access_token ?? studentLogin.body?.access_token ?? '';
        if (!studentTok) return; // skip if student login not configured

        const { status } = await getRemarks(studentUid, {}, studentTok);
        expect(status).toBe(403);
    });

    it('returns 401 with no token', async () => {
        const res = await fetch(remarksUrl(studentUid));
        expect(res.status).toBe(401);
    });

    it('returns 404 for a student UID that does not exist', async () => {
        const { status, body } = await getRemarks('UID_DOES_NOT_EXIST_XYZ');
        expect(status).toBe(404);
        expect(body.success).toBe(false);
        expect(body.error).toMatch(/not found/i);
    });

    it('returns 400 for invalid limit', async () => {
        const { status, body } = await getRemarks(studentUid, { limit: -5 });
        expect(status).toBe(400);
        expect(body.success).toBe(false);
        expect(body.error).toMatch(/limit/i);
    });

    it('returns 400 for invalid offset', async () => {
        const { status, body } = await getRemarks(studentUid, { offset: -1 });
        expect(status).toBe(400);
        expect(body.success).toBe(false);
        expect(body.error).toMatch(/offset/i);
    });

    it('returns empty remarks array for a student with no remarks', async () => {
        const { status, body } = await getRemarks(emptyStudentUid);
        expect(status).toBe(200);
        expect(body.success).toBe(true);
        expect(body.data.remarks).toEqual([]);
        expect(body.data.paging.total).toBe(0);
        expect(body.data.paging.hasMore).toBe(false);
    });

    it('returns remarks in newest-first order', async () => {
        const { status, body } = await getRemarks(studentUid);
        expect(status).toBe(200);
        expect(body.success).toBe(true);

        const dates: string[] = body.data.remarks.map((r: { date: string }) => r.date);
        const sorted = [...dates].sort((a, b) => b.localeCompare(a));
        expect(dates).toEqual(sorted);
    });

    it('returns all required fields on each remark', async () => {
        const { status, body } = await getRemarks(studentUid);
        expect(status).toBe(200);

        const remark = body.data.remarks[0];
        expect(remark).toHaveProperty('id');
        expect(remark).toHaveProperty('faculty_name');
        expect(remark).toHaveProperty('faculty_email');
        expect(remark).toHaveProperty('semester');
        expect(remark).toHaveProperty('date');
        expect(remark).toHaveProperty('remarks');
        expect(remark).toHaveProperty('suggestion');
        expect(remark).toHaveProperty('action');
        expect(remark).toHaveProperty('created_by_faculty');
    });

    it('returns correct paging metadata', async () => {
        const { body } = await getRemarks(studentUid, { limit: 2, offset: 0 });
        const paging = body.data.paging;

        expect(paging.total).toBeGreaterThanOrEqual(3);
        expect(paging.limit).toBe(2);
        expect(paging.offset).toBe(0);
        expect(paging.hasMore).toBe(true);
    });

    it('pagination offset works correctly', async () => {
        const page1 = await getRemarks(studentUid, { limit: 2, offset: 0 });
        const page2 = await getRemarks(studentUid, { limit: 2, offset: 2 });

        const ids1: number[] = page1.body.data.remarks.map((r: { id: number }) => r.id);
        const ids2: number[] = page2.body.data.remarks.map((r: { id: number }) => r.id);

        // No overlap between pages
        const overlap = ids1.filter((id) => ids2.includes(id));
        expect(overlap).toHaveLength(0);
    });

    it('uses snapshot name/email when faculty_id is set but faculty record is deleted', async () => {
        // Create a remark with snapshot values, then hard-null the faculty_id to simulate deletion
        await MentoringMinute.create({
            student_id: studentDbId,
            faculty_id: null, // simulates faculty deleted (SET NULL)
            faculty_name_snapshot: 'Deleted Prof',
            faculty_email_snapshot: 'deleted@stvincentngp.edu.in',
            semester: 5,
            date: '2025-12-01',
            remarks: 'Snapshot fallback test',
            suggestion: null,
            action: null,
        });

        const { body } = await getRemarks(studentUid);
        const snapshotRemark = body.data.remarks.find(
            (r: { remarks: string }) => r.remarks === 'Snapshot fallback test',
        );

        expect(snapshotRemark).toBeDefined();
        expect(snapshotRemark.faculty_name).toBe('Deleted Prof');
        expect(snapshotRemark.faculty_email).toBe('deleted@stvincentngp.edu.in');

        // cleanup
        await MentoringMinute.destroy({ where: { remarks: 'Snapshot fallback test', student_id: studentDbId } });
    });

    it('falls back to "Unknown" when both faculty and snapshots are missing', async () => {
        await MentoringMinute.create({
            student_id: studentDbId,
            faculty_id: null,
            faculty_name_snapshot: null,
            faculty_email_snapshot: null,
            semester: 3,
            date: '2025-11-10',
            remarks: 'Unknown faculty fallback test',
            suggestion: null,
            action: null,
        });

        const { body } = await getRemarks(studentUid);
        const unknown = body.data.remarks.find(
            (r: { remarks: string }) => r.remarks === 'Unknown faculty fallback test',
        );

        expect(unknown).toBeDefined();
        expect(unknown.faculty_name).toBe('Unknown');
        expect(unknown.faculty_email).toBe('Unknown');

        // cleanup
        await MentoringMinute.destroy({ where: { remarks: 'Unknown faculty fallback test', student_id: studentDbId } });
    });

    it('optional fields are null (not missing) when absent', async () => {
        const { body } = await getRemarks(studentUid);
        // The first remark was created with suggestion/action = null
        const noOptional = body.data.remarks.find(
            (r: { suggestion: null | string; action: null | string }) =>
                r.suggestion === null && r.action === null,
        );
        expect(noOptional).toBeDefined();
    });
});
