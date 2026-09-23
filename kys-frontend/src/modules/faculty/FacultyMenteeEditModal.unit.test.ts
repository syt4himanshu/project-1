import { describe, expect, it } from "vitest";
import type { MenteePayload } from "./api/types";
import {
  buildDraftFromMentee,
  buildSavePayload,
  buildSectionStyles,
  buildTargetedSavePayload,
  cloneData,
  patchDraft,
} from "./utils/menteeProfileEditor";
import { validateMenteeProfileData } from "./validation/menteeProfileValidation";

const mockMentee: MenteePayload = {
  id: 101,
  uid: "STU_101",
  full_name: "Rahul Sharma",
  first_name: "Rahul",
  middle_name: "",
  last_name: "Sharma",
  semester: 5,
  section: "A",
  year_of_admission: 2023,
  is_profile_locked: true,
  profile_locked_at: "2026-08-01T10:00:00.000Z",
  profile_locked_by: 2,
  admission_type: "hsc",
  personal_info: {
    mobile_no: "9876543210",
    personal_email: "rahul@example.com",
    college_email: "rahul@college.edu",
    photoUrl: "https://example.com/photo.jpg",
    photoPreviewUrl: "https://example.com/photo_preview.jpg",
    dob: "2003-05-20T00:00:00.000Z",
  },
  past_education_records: [
    { exam_name: "SSC", board: "State", percentage: 85, year_of_passing: 2021 },
    { exam_name: "HSSC", board: "State", percentage: 82, year_of_passing: 2023 },
  ],
  post_admission_records: [
    { semester: 1, sgpa: 8.2, backlog_subjects: "", season: "Winter", year_of_passing: 2023 },
    { semester: 2, sgpa: 8.4, backlog_subjects: "", season: "Summer", year_of_passing: 2024 },
  ],
  projects: [
    { title: "Project Alpha", domain: "Web", description: "Alpha description" },
    { title: "Project Beta", domain: "Mobile", description: "Beta description" },
  ],
  internships: [
    {
      title: "Backend Intern",
      company_name: "Tech Corp",
      domain: "Backend",
      internship_type: "Offline",
      paid_unpaid: "Paid",
      start_date: "2024-06-01",
      end_date: "2024-08-01",
      designation: "Software Intern",
      description: "Node.js development",
    },
  ],
  cocurricular_participations: [
    { name: "CodeFest", date: "2024-03-15", level: "State", awards: "First Place" },
  ],
  cocurricular_organizations: [
    { name: "Tech Club", date: "2024-04-01", level: "College", remark: "Lead Organizer" },
  ],
  skill_programs: [
    {
      course_title: "React Masterclass",
      platform: "Udemy",
      domain: "Web Development",
      duration_hours: 30,
      date_from: "2024-01-10",
      date_to: "2024-02-10",
    },
  ],
  career_objective: {
    career_goal: "Software Engineer",
    specific_details: "Looking for full-stack role in a tier 1 tech company",
    clarity_preparedness: "High",
    interested_in_campus_placement: true,
  },
  skills: {
    programming_languages: "TypeScript, Python",
    technologies_frameworks: "React, Node.js, Express",
  },
  swoc: {
    strengths: "Problem solving, teamwork",
    weaknesses: "Public speaking",
    opportunities: "Open source contributions",
    challenges: "Time allocation",
  },
};

describe("FacultyMenteeEditModal pure logic (Phase 2A & 2B & 2C)", () => {
  it("UNIT-01 — Complete mentee -> draft preserves all sections and fields", () => {
    const draft = buildDraftFromMentee(mockMentee);

    expect(draft.id).toBe(101);
    expect(draft.uid).toBe("STU_101");
    expect(draft.full_name).toBe("Rahul Sharma");
    expect(draft.semester).toBe(5);
    expect(draft.section).toBe("A");
    expect(draft.year_of_admission).toBe(2023);
    expect(draft.admission_type).toBe("hsc");

    expect(draft.personal_info).toEqual(
      expect.objectContaining({
        mobile_no: "9876543210",
        personal_email: "rahul@example.com",
        college_email: "rahul@college.edu",
        dob: "2003-05-20",
      }),
    );

    expect(draft.past_education_records).toHaveLength(2);
    expect(draft.post_admission_records).toHaveLength(2);
    expect(draft.projects).toHaveLength(3); // padded to 3
    expect(draft.internships).toHaveLength(1);
    expect(draft.cocurricular_participations).toHaveLength(1);
    expect(draft.cocurricular_organizations).toHaveLength(1);
    expect(draft.skill_programs).toHaveLength(1);
    expect(draft.career_objective).toEqual(mockMentee.career_objective);
    expect(draft.skills).toEqual(mockMentee.skills);
    expect(draft.swoc).toEqual(mockMentee.swoc);
  });

  it("UNIT-02 — Empty optional objects handle null values safely", () => {
    const menteeWithNulls: MenteePayload = {
      ...mockMentee,
      career_objective: undefined,
      skills: undefined,
      swoc: undefined,
      personal_info: {},
    };

    expect(() => buildDraftFromMentee(menteeWithNulls)).not.toThrow();

    const draft = buildDraftFromMentee(menteeWithNulls);
    expect(draft.career_objective).toEqual({});
    expect(draft.skills).toEqual({});
    expect(draft.swoc).toEqual({});
  });

  it("UNIT-03 — Empty internships array is preserved as empty array", () => {
    const menteeNoInternships: MenteePayload = {
      ...mockMentee,
      internships: [],
    };

    const draft = buildDraftFromMentee(menteeNoInternships);
    expect(Array.isArray(draft.internships)).toBe(true);
    expect(draft.internships).toHaveLength(0);

    const savePayload = buildSavePayload(draft);
    expect(savePayload.internships).toEqual([]);
  });

  it("UNIT-04 — Empty organizations array remains valid", () => {
    const menteeNoOrgs: MenteePayload = {
      ...mockMentee,
      cocurricular_organizations: [],
    };

    const draft = buildDraftFromMentee(menteeNoOrgs);
    expect(Array.isArray(draft.cocurricular_organizations)).toBe(true);
    expect(draft.cocurricular_organizations).toHaveLength(0);

    const savePayload = buildSavePayload(draft);
    expect(savePayload.cocurricular_organizations).toEqual([]);
  });

  it("UNIT-05 — Empty skill programs array remains valid", () => {
    const menteeNoPrograms: MenteePayload = {
      ...mockMentee,
      skill_programs: [],
    };

    const draft = buildDraftFromMentee(menteeNoPrograms);
    expect(Array.isArray(draft.skill_programs)).toBe(true);
    expect(draft.skill_programs).toHaveLength(0);

    const savePayload = buildSavePayload(draft);
    expect(savePayload.skill_programs).toEqual([]);
  });

  it("UNIT-06 — Existing non-empty arrays are preserved completely", () => {
    const draft = buildDraftFromMentee(mockMentee);

    expect(draft.projects).toHaveLength(3);
    expect(draft.internships).toHaveLength(1);
    expect(draft.cocurricular_participations).toHaveLength(1);
    expect(draft.cocurricular_organizations).toHaveLength(1);
    expect(draft.skill_programs).toHaveLength(1);
    expect(draft.past_education_records).toHaveLength(2);
    expect(draft.post_admission_records).toHaveLength(2);
  });

  it("UNIT-07 — Save payload contains all required top-level keys", () => {
    const draft = buildDraftFromMentee(mockMentee);
    const payload = buildSavePayload(draft);

    const expectedKeys = [
      "full_name",
      "semester",
      "section",
      "year_of_admission",
      "admission_type",
      "personal_info",
      "past_education_records",
      "post_admission_records",
      "projects",
      "internships",
      "cocurricular_participations",
      "cocurricular_organizations",
      "skill_programs",
      "career_objective",
      "skills",
      "swoc",
    ];

    for (const key of expectedKeys) {
      expect(payload).toHaveProperty(key);
    }
  });

  it("UNIT-08 — Save payload must NOT contain lock-management fields", () => {
    const draft = buildDraftFromMentee(mockMentee);
    const payload = buildSavePayload(draft);

    expect(payload).not.toHaveProperty("is_profile_locked");
    expect(payload).not.toHaveProperty("profile_locked_at");
    expect(payload).not.toHaveProperty("profile_locked_by");
  });

  it("UNIT-09 — Photo-only draft metadata is excluded from save payload", () => {
    const draft = buildDraftFromMentee(mockMentee);
    const payload = buildSavePayload(draft);
    const pi = payload.personal_info as Record<string, unknown>;

    expect(pi).not.toHaveProperty("photoUrl");
    expect(pi).not.toHaveProperty("photo_url");
    expect(pi).not.toHaveProperty("photo_public_id");
    expect(pi).not.toHaveProperty("photoPreviewUrl");
    expect(pi).not.toHaveProperty("photo_preview_url");
  });

  it("UNIT-10 — Existing legacy long text survives unchanged", () => {
    const legacyText = "A".repeat(250); // exceeds 200 chars
    const legacyMentee: MenteePayload = {
      ...mockMentee,
      career_objective: {
        ...(mockMentee.career_objective || {}),
        specific_details: legacyText,
      },
    };

    const draft = buildDraftFromMentee(legacyMentee);
    const coDraft = draft.career_objective as Record<string, unknown>;
    expect(coDraft.specific_details).toBe(legacyText);

    const payload = buildSavePayload(draft);
    const coPayload = payload.career_objective as Record<string, unknown>;
    expect(coPayload.specific_details).toBe(legacyText);
  });

  it("UNIT-11 — Validation distinguishes legacy uncapped text vs invalid field edits", () => {
    const legacyText = "B".repeat(250);
    const legacyDraft = buildDraftFromMentee({
      ...mockMentee,
      career_objective: { specific_details: legacyText },
    });

    const payload = buildSavePayload(legacyDraft);

    // Unchanged legacy long text passes mentor validation
    const validRes = validateMenteeProfileData(payload);
    expect(validRes.isValid).toBe(true);

    // Explicit invalid phone edit fails validation
    const invalidPayload = {
      ...payload,
      personal_info: {
        ...(payload.personal_info as Record<string, unknown>),
        mobile_no: "1234", // invalid length
      },
    };

    const invalidRes = validateMenteeProfileData(invalidPayload);
    expect(invalidRes.isValid).toBe(false);
    expect(invalidRes.errors.length).toBeGreaterThan(0);
  });

  it("UNIT-12 — Dirty-state comparison / patch helper shallow-merges objects", () => {
    const draft = buildDraftFromMentee(mockMentee);
    const patched = patchDraft(draft, {
      personal_info: { mobile_no: "9999999999" },
    });

    const pi = patched.personal_info as Record<string, unknown>;
    expect(pi.mobile_no).toBe("9999999999");
    expect(pi.personal_email).toBe("rahul@example.com"); // sibling preserved

    expect(JSON.stringify(draft)).not.toEqual(JSON.stringify(patched));
  });

  it("UNIT-13 — Pure helpers do not mutate input objects", () => {
    const frozenMentee = Object.freeze({
      ...mockMentee,
      personal_info: Object.freeze({ ...(mockMentee.personal_info || {}) }),
      career_objective: Object.freeze({ ...(mockMentee.career_objective || {}) }),
    });

    expect(() => buildDraftFromMentee(frozenMentee as MenteePayload)).not.toThrow();

    const draft = buildDraftFromMentee(frozenMentee as MenteePayload);
    const frozenDraft = Object.freeze({ ...draft });

    expect(() => buildSavePayload(frozenDraft)).not.toThrow();
  });

  it("UNIT-14 — Referential safety: modifying draft does not mutate mentee payload", () => {
    const menteeCopy = cloneData(mockMentee);
    const draft = buildDraftFromMentee(menteeCopy);

    (draft.personal_info as Record<string, unknown>).mobile_no = "0000000000";
    (draft.career_objective as Record<string, unknown>).specific_details = "Changed";

    const pi = menteeCopy.personal_info as Record<string, unknown> | undefined;
    const co = menteeCopy.career_objective as Record<string, unknown> | undefined;

    expect(pi?.mobile_no).toBe("9876543210");
    expect(co?.specific_details).toBe(
      "Looking for full-stack role in a tier 1 tech company",
    );
  });

  it("Phase 2B — validateMenteeProfileData rules", () => {
    const validPayload = buildSavePayload(buildDraftFromMentee(mockMentee));
    expect(validateMenteeProfileData(validPayload).isValid).toBe(true);

    // Invalid semester > 8
    const invalidSem = { ...validPayload, semester: 9 };
    expect(validateMenteeProfileData(invalidSem).isValid).toBe(false);

    // Admission type mismatch: HSC with DIPLOMA past record
    const mismatchPayload = {
      ...validPayload,
      admission_type: "hsc",
      past_education_records: [
        { exam_name: "DIPLOMA", percentage: 80, year_of_passing: 2022 },
      ],
    };
    const res = validateMenteeProfileData(mismatchPayload);
    expect(res.isValid).toBe(false);
    expect(res.errors[0]).toContain("Diploma details are not allowed for HSC");
  });

  it("Phase 2C — Data preservation when editing isolated fields", () => {
    const initialDraft = buildDraftFromMentee(mockMentee);
    const initialSave = buildSavePayload(initialDraft);

    // Edit only personal mobile_no
    const patchedDraft = patchDraft(initialDraft, {
      personal_info: { mobile_no: "9111111111" },
    });
    const saveAfterPersonalEdit = buildSavePayload(patchedDraft);

    expect(saveAfterPersonalEdit.projects).toEqual(initialSave.projects);
    expect(saveAfterPersonalEdit.internships).toEqual(initialSave.internships);
    expect(saveAfterPersonalEdit.skill_programs).toEqual(initialSave.skill_programs);
    expect(saveAfterPersonalEdit.cocurricular_participations).toEqual(
      initialSave.cocurricular_participations,
    );
    expect(saveAfterPersonalEdit.cocurricular_organizations).toEqual(
      initialSave.cocurricular_organizations,
    );
    expect(saveAfterPersonalEdit.career_objective).toEqual(initialSave.career_objective);
    expect(saveAfterPersonalEdit.skills).toEqual(initialSave.skills);
    expect(saveAfterPersonalEdit.swoc).toEqual(initialSave.swoc);
  });

  it("Phase 2D — buildSectionStyles generates isolated rules for each section anchor", () => {
    const internshipsStyle = buildSectionStyles("internships");
    expect(internshipsStyle).toContain("#profile-section-internships { display: block !important; }");
    expect(internshipsStyle).not.toContain("#profile-section-projects { display: block !important; }");

    const participationStyle = buildSectionStyles("participation");
    expect(participationStyle).toContain("#profile-section-participation { display: block !important; }");
    expect(participationStyle).not.toContain("#profile-section-projects { display: block !important; }");

    const academicsStyle = buildSectionStyles("academics");
    expect(academicsStyle).toContain("#profile-section-academics { display: block !important; }");
    expect(academicsStyle).not.toContain("#profile-section-past-education-root { display: block !important; }");

    const emergencyStyle = buildSectionStyles("emergency");
    expect(emergencyStyle).toContain("#profile-section-emergency { display: block !important; }");
    expect(emergencyStyle).not.toContain("#profile-section-parents { display: block !important; }");
  });

  it("Phase 3A — buildTargetedSavePayload includes only changed fields and omits untouched sections", () => {
    const baseline = buildDraftFromMentee(mockMentee);
    const draft = patchDraft(baseline, {
      personal_info: { father_mobile_no: "9988776655" },
    });

    const payload = buildTargetedSavePayload(draft, baseline);

    expect(payload).toHaveProperty("personal_info");
    expect(payload.personal_info).toEqual(
      expect.objectContaining({ father_mobile_no: "9988776655" }),
    );
    expect(payload).not.toHaveProperty("projects");
    expect(payload).not.toHaveProperty("internships");
    expect(payload).not.toHaveProperty("career_objective");
    expect(payload).not.toHaveProperty("skills");
    expect(payload).not.toHaveProperty("swoc");
  });

  it("Phase 3B — buildTargetedSavePayload handles multi-section changes cleanly", () => {
    const baseline = buildDraftFromMentee(mockMentee);
    const draft = patchDraft(baseline, {
      personal_info: { father_mobile_no: "9988776655" },
      career_objective: { career_goal: "Placement" },
    });

    const payload = buildTargetedSavePayload(draft, baseline);

    expect(payload).toHaveProperty("personal_info");
    expect(payload).toHaveProperty("career_objective");
    expect(payload).not.toHaveProperty("projects");
    expect(payload).not.toHaveProperty("internships");
  });

  it("Phase 3C — buildTargetedSavePayload returns empty object when nothing changed", () => {
    const baseline = buildDraftFromMentee(mockMentee);
    const draft = buildDraftFromMentee(mockMentee);

    const payload = buildTargetedSavePayload(draft, baseline);
    expect(Object.keys(payload)).toHaveLength(0);
  });
});
