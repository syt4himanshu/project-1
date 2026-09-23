/**
 * Admission-type-dependent academic semester range helpers.
 *
 * - HSC / 12th students enter B.Tech from Semester 1.
 * - Diploma / Direct-Second-Year students enter B.Tech at Semester 3.
 *   Semesters 1 and 2 are their pre-admission diploma years and must
 *   never appear as B.Tech post-admission academic records.
 *
 * These helpers are the single source of truth for every place in the
 * frontend that needs to know which semesters are valid for a student.
 */

/** Semester number where the student's B.Tech records begin. */
export function getStartSemester(admissionType: string | null | undefined): number {
  return admissionType === 'diploma' ? 3 : 1;
}

/**
 * Returns the ordered array of completed semester numbers for the given
 * student.  "Completed" means the semester is strictly before the
 * student's current semester (they have a result for it).
 *
 * @param admissionType - 'hsc' | 'diploma' | '' | null | undefined
 * @param currentSemester - The student's current (ongoing) semester
 *
 * Examples
 *   HSC,    currentSem=5  → [1, 2, 3, 4]
 *   Diploma, currentSem=5 → [3, 4]
 *   Diploma, currentSem=3 → [3]     ← first record is sem 3 itself
 *   Diploma, currentSem=4 → [3]     ← only sem 3 completed
 *
 * Note: for a diploma student in their very first B.Tech semester (sem 3)
 * the array is [3] because the system records sem 3 as the first entry
 * even while it is in progress — matching how currentSem-1 maps to
 * HSC students.  If currentSem < startSemester the array is empty.
 */
export function getAcademicSemesterRange(
  admissionType: string | null | undefined,
  currentSemester: number,
): number[] {
  const start = getStartSemester(admissionType);
  // endSemester is the last completed semester (currentSem - 1 for HSC,
  // but for diploma the first "completed" record is semester 3 when
  // currentSemester >= 3, so we use max(start, currentSem - 1).
  // For parity with the existing HSC behaviour (which always shows
  // currentSem-1 semesters), for diploma we want the range
  // [start .. currentSem-1] clamped so it never goes below start.
  const end = currentSemester - 1;
  if (end < start) return [];
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Given the current list of post-admission records and the semester range,
 * returns the initial `activeSem` index (1-based position within the
 * `semesters` array) to pre-expand all cards that already have data.
 *
 * For example:
 *   Diploma student, semesters=[3,4,5], existing records for sem 3 & 4
 *   → activeSem = 2 (cards 0 and 1 shown, i.e. semesters 3 and 4)
 *
 * Always at least 1 so the first card is visible.
 */
export function getInitialActiveSem(
  semesters: number[],
  postAdmissionRecords: Array<Record<string, unknown>>,
): number {
  if (semesters.length === 0) return 1;

  // Count how many semesters in the range already have both semester and sgpa.
  let filledCount = 0;
  for (const sem of semesters) {
    const rec = postAdmissionRecords.find((r) => Number(r.semester) === sem);
    if (rec && rec.semester != null && rec.sgpa != null) {
      filledCount++;
    } else {
      // Stop at the first gap — we only want to pre-expand the leading filled run.
      break;
    }
  }

  return Math.max(filledCount, 1);
}
