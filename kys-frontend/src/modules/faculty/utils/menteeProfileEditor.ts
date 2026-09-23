import type { MenteePayload } from "../api/types";
import {
  extractStudentPhotoPreviewUrl,
  extractStudentPhotoUrl,
} from "../../../shared/utils/studentPhoto";

export type SectionId =
  | "personal"
  | "parents"
  | "emergency"
  | "past-education"
  | "academics"
  | "projects"
  | "internships"
  | "participation"
  | "organization"
  | "skill-programs"
  | "career"
  | "skills"
  | "swoc";

export const SECTION_ANCHOR_MAP: Record<SectionId, string[]> = {
  personal: [
    "profile-section-personal",
    "profile-section-location",
    "profile-section-photo",
  ],
  parents: ["profile-section-parents"],
  emergency: ["profile-section-emergency"],
  "past-education": ["profile-section-past-education-root"],
  academics: ["profile-section-academics"],
  projects: ["profile-section-projects"],
  internships: ["profile-section-internships"],
  participation: ["profile-section-participation"],
  organization: ["profile-section-organization"],
  "skill-programs": ["profile-section-skill-programs"],
  career: ["profile-section-career"],
  skills: ["profile-section-skills"],
  swoc: ["profile-section-swoc"],
};

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function cloneData<T = unknown>(value: T): T {
  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value ?? null));
  }
}

export function normalizePersonalInfoForDraft(raw: unknown): Record<string, unknown> {
  const pi = isRecord(raw) ? { ...raw } : {};
  const photoUrl =
    extractStudentPhotoUrl({ personal_info: pi }) ??
    (pi.photoUrl as string | null) ??
    (pi.photo_url as string | null) ??
    null;
  const preview =
    extractStudentPhotoPreviewUrl({ personal_info: pi }) ??
    (pi.photoPreviewUrl as string | null) ??
    (pi.photo_preview_url as string | null) ??
    null;
  if (photoUrl) {
    pi.photoUrl = photoUrl;
    pi.photo_url = photoUrl;
  }
  if (preview) {
    pi.photoPreviewUrl = preview;
    pi.photo_preview_url = preview;
  }
  if (typeof pi.dob === "string" && pi.dob.includes("T")) {
    pi.dob = pi.dob.split("T")[0];
  }
  return pi;
}

export function buildDraftFromMentee(mentee: MenteePayload): Record<string, unknown> {
  const projects = Array.isArray(mentee.projects)
    ? (cloneData(mentee.projects) as unknown[])
    : [];
  while (projects.length < 3) projects.push({});

  const internships = Array.isArray(mentee.internships)
    ? (cloneData(mentee.internships) as unknown[])
    : [];
  const organizations = Array.isArray(mentee.cocurricular_organizations)
    ? (cloneData(mentee.cocurricular_organizations) as unknown[])
    : [];
  const skillPrograms = Array.isArray(mentee.skill_programs)
    ? (cloneData(mentee.skill_programs) as unknown[])
    : [];

  const hasUbaProject = Boolean(
    (projects[2] as Record<string, unknown> | undefined)?.title ||
      (projects[2] as Record<string, unknown> | undefined)?.description ||
      (projects[2] as Record<string, unknown> | undefined)?.domain,
  );
  const hasInternshipExperience = internships.some((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return Boolean(
      row.company_name ||
        row.designation ||
        row.domain ||
        row.description ||
        row.internship_type ||
        row.paid_unpaid ||
        row.start_date ||
        row.end_date ||
        row.title,
    );
  });
  const hasOrganizedActivities = organizations.some((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return Boolean(row.name || row.date || row.level || row.remark);
  });
  const hasSkillPrograms = skillPrograms.some((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return Boolean(
      row.course_title ||
        row.platform ||
        row.duration_hours ||
        row.date_from ||
        row.date_to,
    );
  });

  return {
    id: mentee.id,
    uid: mentee.uid,
    full_name: mentee.full_name || "",
    first_name: mentee.first_name,
    middle_name: mentee.middle_name,
    last_name: mentee.last_name,
    semester: mentee.semester ?? null,
    section: mentee.section || "",
    year_of_admission: mentee.year_of_admission ?? null,
    is_profile_locked: Boolean(mentee.is_profile_locked),
    profile_locked_at: mentee.profile_locked_at ?? null,
    profile_locked_by: mentee.profile_locked_by ?? null,
    admission_type: mentee.admission_type || "",
    personal_info: normalizePersonalInfoForDraft(mentee.personal_info),
    past_education_records: cloneData(mentee.past_education_records || []),
    post_admission_records: cloneData(mentee.post_admission_records || []),
    projects,
    internships,
    cocurricular_participations: cloneData(
      mentee.cocurricular_participations || [],
    ),
    cocurricular_organizations: organizations,
    skill_programs: skillPrograms,
    career_objective: cloneData(mentee.career_objective || {}),
    skills: cloneData(mentee.skills || {}),
    swoc: cloneData(mentee.swoc || {}),
    hasUbaProject,
    hasInternshipExperience,
    hasOrganizedActivities,
    hasSkillPrograms,
  };
}

export function buildSavePayload(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const personalInfo = isRecord(data.personal_info)
    ? { ...data.personal_info }
    : {};
  delete personalInfo.photoUrl;
  delete personalInfo.photo_url;
  delete personalInfo.photo_public_id;
  delete personalInfo.photoPreviewUrl;
  delete personalInfo.photo_preview_url;

  return {
    full_name: data.full_name,
    semester: data.semester,
    section: data.section,
    year_of_admission: data.year_of_admission,
    admission_type: data.admission_type,
    personal_info: personalInfo,
    past_education_records: data.past_education_records || [],
    post_admission_records: data.post_admission_records || [],
    projects: data.projects || [],
    internships: data.internships || [],
    cocurricular_participations: data.cocurricular_participations || [],
    cocurricular_organizations: data.cocurricular_organizations || [],
    skill_programs: data.skill_programs || [],
    career_objective: data.career_objective || {},
    skills: data.skills || {},
    swoc: data.swoc || {},
  };
}

export function buildTargetedSavePayload(
  draft: Record<string, unknown>,
  baseline: Record<string, unknown>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  const scalarKeys = [
    "full_name",
    "semester",
    "section",
    "year_of_admission",
    "admission_type",
  ] as const;

  for (const key of scalarKeys) {
    if (draft[key] !== baseline[key]) {
      payload[key] = draft[key];
    }
  }

  const objectSectionKeys = [
    "personal_info",
    "career_objective",
    "skills",
    "swoc",
  ] as const;

  for (const key of objectSectionKeys) {
    const draftObj = isRecord(draft[key])
      ? { ...(draft[key] as Record<string, unknown>) }
      : {};
    const baseObj = isRecord(baseline[key])
      ? { ...(baseline[key] as Record<string, unknown>) }
      : {};

    if (key === "personal_info") {
      delete draftObj.photoUrl;
      delete draftObj.photo_url;
      delete draftObj.photo_public_id;
      delete draftObj.photoPreviewUrl;
      delete draftObj.photo_preview_url;

      delete baseObj.photoUrl;
      delete baseObj.photo_url;
      delete baseObj.photo_public_id;
      delete baseObj.photoPreviewUrl;
      delete baseObj.photo_preview_url;
    }

    if (JSON.stringify(draftObj) !== JSON.stringify(baseObj)) {
      payload[key] = draftObj;
    }
  }

  const arraySectionKeys = [
    "past_education_records",
    "post_admission_records",
    "projects",
    "internships",
    "cocurricular_participations",
    "cocurricular_organizations",
    "skill_programs",
  ] as const;

  for (const key of arraySectionKeys) {
    const draftArr = Array.isArray(draft[key]) ? draft[key] : [];
    const baseArr = Array.isArray(baseline[key]) ? baseline[key] : [];

    if (JSON.stringify(draftArr) !== JSON.stringify(baseArr)) {
      payload[key] = draftArr;
    }
  }

  return payload;
}

export function patchDraft(
  prev: Record<string, unknown>,
  patch: Record<string, unknown>,
): Record<string, unknown> {
  const next: Record<string, unknown> = { ...prev };
  for (const [key, value] of Object.entries(patch)) {
    if (isRecord(value)) {
      next[key] = {
        ...((isRecord(prev[key]) ? prev[key] : {}) as Record<string, unknown>),
        ...value,
      };
    } else {
      next[key] = value;
    }
  }
  return next;
}

export function sectionCounts(data: Record<string, unknown>) {
  const asArray = (value: unknown) => (Array.isArray(value) ? value : []);
  return {
    projects: asArray(data.projects).filter((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      return Boolean(row.title || row.domain || row.description);
    }).length,
    internships: asArray(data.internships).filter((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      return Boolean(row.company_name || row.title || row.domain);
    }).length,
    participation: asArray(data.cocurricular_participations).filter((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      return Boolean(row.name || row.date || row.level || row.awards);
    }).length,
    organization: asArray(data.cocurricular_organizations).filter((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      return Boolean(row.name || row.date || row.level || row.remark);
    }).length,
    "skill-programs": asArray(data.skill_programs).filter((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      return Boolean(row.course_title || row.platform);
    }).length,
    academics: asArray(data.post_admission_records).filter((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      return row.semester != null || row.sgpa != null;
    }).length,
  };
}

export function buildSectionStyles(activeSection: SectionId): string {
  const allAnchors = Object.values(SECTION_ANCHOR_MAP).flat();
  const hideRules =
    allAnchors.map((anchor) => `#${anchor}`).join(", ") +
    " { display: none !important; }";

  const visibleAnchors = SECTION_ANCHOR_MAP[activeSection];
  const showRules =
    visibleAnchors.map((anchor) => `#${anchor}`).join(", ") +
    " { display: block !important; }";

  return `${hideRules}\n${showRules}`;
}
