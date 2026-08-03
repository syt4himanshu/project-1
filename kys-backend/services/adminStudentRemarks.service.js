'use strict';

const { Student, MentoringMinute, Faculty } = require('../models');

/**
 * Validates and parses pagination parameters from raw query input.
 * Returns null for any field that is invalid.
 *
 * @param {unknown} rawLimit
 * @param {unknown} rawOffset
 * @returns {{ limit: number, offset: number } | { error: string }}
 */
function parsePagination(rawLimit, rawOffset) {
    const limit = rawLimit !== undefined ? Number(rawLimit) : 20;
    const offset = rawOffset !== undefined ? Number(rawOffset) : 0;

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
        return { error: 'limit must be an integer between 1 and 100' };
    }

    if (!Number.isInteger(offset) || offset < 0) {
        return { error: 'offset must be a non-negative integer' };
    }

    return { limit, offset };
}

/**
 * Maps a raw MentoringMinute Sequelize row into a clean API-safe remark object.
 * Applies snapshot fallback and email fallback per the spec.
 *
 * @param {import('../models/MentoringMinute')} minute
 * @returns {object}
 */
function mapRemarkRow(minute) {
    const plain = typeof minute.get === 'function' ? minute.get({ plain: true }) : minute;

    // Resolve faculty name: prefer live Faculty join → snapshot → 'Unknown'
    const liveName =
        plain.faculty
            ? [plain.faculty.first_name, plain.faculty.last_name].filter(Boolean).join(' ').trim()
            : '';

    const facultyName =
        liveName ||
        (plain.faculty_name_snapshot && plain.faculty_name_snapshot.trim()) ||
        'Unknown';

    // Resolve faculty email: prefer live Faculty join → snapshot → 'Unknown'
    const liveEmail = plain.faculty?.email?.trim() || '';
    const facultyEmail =
        liveEmail ||
        (plain.faculty_email_snapshot && plain.faculty_email_snapshot.trim()) ||
        'Unknown';

    return {
        id: plain.id,
        student_id: plain.student_id,
        faculty_id: plain.faculty_id ?? null,
        faculty_name: facultyName,
        faculty_email: facultyEmail,
        semester: plain.semester,
        date: plain.date ?? null,
        remarks: plain.remarks ?? null,
        suggestion: plain.suggestion ?? null,
        action: plain.action ?? null,
        created_by_faculty: plain.faculty_id !== null,
    };
}

/**
 * Fetches paginated mentoring remarks for a student identified by UID.
 *
 * @param {object} options
 * @param {string} options.uid         - Student UID from route param
 * @param {unknown} options.rawLimit   - Raw query param (unparsed)
 * @param {unknown} options.rawOffset  - Raw query param (unparsed)
 * @returns {Promise<
 *   | { ok: true,  data: { remarks: object[], paging: object } }
 *   | { ok: false, status: number, error: string }
 * >}
 */
async function getStudentRemarks({ uid, rawLimit, rawOffset }) {
    // 1. Validate UID
    if (!uid || typeof uid !== 'string' || !uid.trim()) {
        return { ok: false, status: 400, error: 'Invalid student UID' };
    }

    // 2. Validate pagination
    const pagination = parsePagination(rawLimit, rawOffset);
    if ('error' in pagination) {
        return { ok: false, status: 400, error: pagination.error };
    }

    const { limit, offset } = pagination;

    // 3. Resolve student
    const student = await Student.findOne({ where: { uid: uid.trim() } });
    if (!student) {
        return { ok: false, status: 404, error: `Student with UID '${uid}' not found` };
    }

    // 4. Single optimised query: count + paginated rows in one round trip
    const { count, rows } = await MentoringMinute.findAndCountAll({
        where: { student_id: student.id },
        include: [
            {
                model: Faculty,
                as: 'faculty',
                attributes: ['id', 'first_name', 'last_name', 'email'],
                required: false, // LEFT JOIN — keep rows where faculty was deleted
            },
        ],
        order: [
            ['date', 'DESC'],
            ['id', 'DESC'], // stable secondary sort when dates are equal
        ],
        limit,
        offset,
    });

    // 5. Map rows to API shape
    const remarks = rows.map(mapRemarkRow);

    return {
        ok: true,
        data: {
            remarks,
            paging: {
                total: count,
                limit,
                offset,
                hasMore: offset + rows.length < count,
            },
        },
    };
}

module.exports = { getStudentRemarks };
