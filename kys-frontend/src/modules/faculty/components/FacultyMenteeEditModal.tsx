import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  BookOpen,
  Briefcase,
  Eye,
  FolderKanban,
  GraduationCap,
  Lock,
  Phone,
  Target,
  User,
  Users,
  X,
  Award,
  Sparkles,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Modal } from "../../../shared/ui";
import { useToast } from "../../../app/providers/toast-context";
import { toApiErrorMessage } from "../../../shared/api/errorMapper";
import {
  extractStudentPhotoPreviewUrl,
  extractStudentPhotoUrl,
} from "../../../shared/utils/studentPhoto";
import { ProfileDraftProvider } from "../../student/context/ProfileDraftContext";
import type { ProfilePhotoUploadResult } from "../../student/context/ProfileDraftContext";
import { validateStudentProfileData } from "../../student/validation/studentProfileSchema";
import Step1Personal from "../../student/components/wizard/Step1Personal";
import Step3AcademicBefore from "../../student/components/wizard/Step3AcademicBefore";
import Step5ProjectsInternships from "../../student/components/wizard/Step5ProjectsInternships";
import Step7SWOC from "../../student/components/wizard/Step7SWOC";
import { useUpdateMenteeProfile, useUploadMenteePhoto } from "../hooks";
import type { MenteePayload } from "../api/types";

interface FacultyMenteeEditModalProps {
  uid: string;
  open: boolean;
  mentee: MenteePayload;
  onClose: () => void;
}

type SectionId =
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

const SECTIONS: Array<{
  id: SectionId;
  label: string;
  description: string;
  anchor: string;
  icon: typeof User;
  countKey?:
    | "projects"
    | "internships"
    | "participation"
    | "organization"
    | "skill-programs"
    | "academics";
}> = [
  {
    id: "personal",
    label: "Personal Details",
    description: "Basic info, contact, address and photo",
    anchor: "profile-section-personal",
    icon: User,
  },
  {
    id: "parents",
    label: "Parents & Guardian",
    description: "Father, mother and local guardian details",
    anchor: "profile-section-parents",
    icon: Users,
  },
  {
    id: "emergency",
    label: "Emergency Contact",
    description: "Emergency contact person and number",
    anchor: "profile-section-emergency",
    icon: Phone,
  },
  {
    id: "past-education",
    label: "Past Education",
    description: "SSC, HSC / Diploma, entrance exam records",
    anchor: "profile-section-past-education-root",
    icon: BookOpen,
  },
  {
    id: "academics",
    label: "Academic Records",
    description: "Semester-wise SGPA, backlogs and awards",
    anchor: "profile-section-academics",
    icon: GraduationCap,
    countKey: "academics",
  },
  {
    id: "projects",
    label: "Projects",
    description: "Mini, major and collaborative projects",
    anchor: "profile-section-projects",
    icon: FolderKanban,
    countKey: "projects",
  },
  {
    id: "internships",
    label: "Internships",
    description: "Internship experience with company and role details",
    anchor: "profile-section-internships",
    icon: Briefcase,
    countKey: "internships",
  },
  {
    id: "participation",
    label: "Co-Curricular Activities",
    description: "Competition and hackathon participation",
    anchor: "profile-section-participation",
    icon: Award,
    countKey: "participation",
  },
  {
    id: "organization",
    label: "Co-Curricular Organization",
    description: "Events organised or co-ordinated",
    anchor: "profile-section-organization",
    icon: Users,
    countKey: "organization",
  },
  {
    id: "skill-programs",
    label: "Skill Programs",
    description: "SDP, MOOC, training and certification courses",
    anchor: "profile-section-skill-programs",
    icon: Sparkles,
    countKey: "skill-programs",
  },
  {
    id: "career",
    label: "Career Objective",
    description: "Career goals, placement interest and expectations",
    anchor: "profile-section-career",
    icon: Target,
  },
  {
    id: "skills",
    label: "Skills",
    description: "Technical and soft skills, tools and frameworks",
    anchor: "profile-section-skills",
    icon: Sparkles,
  },
  {
    id: "swoc",
    label: "SWOC",
    description: "Strengths, weaknesses, opportunities and challenges",
    anchor: "profile-section-swoc",
    icon: Target,
  },
];

// ── Section-id → DOM anchor mapping for CSS visibility ───────────────────────
// Each section id maps to the anchor ids that should be VISIBLE when it is active.
// All other anchors are hidden via CSS.
const SECTION_ANCHOR_MAP: Record<SectionId, string[]> = {
  personal: [
    "profile-section-personal",
    "profile-section-location",
    "profile-section-photo",
  ],
  parents: ["profile-section-parents"],
  emergency: ["profile-section-emergency"],
  "past-education": ["profile-section-past-education-root"],
  academics: [
    "profile-section-past-education-root",
    "profile-section-academics",
  ],
  projects: ["profile-section-projects"],
  internships: [
    "profile-section-projects",
    "profile-section-internships",
    "profile-section-cocurricular-participation",
  ],
  participation: ["profile-section-projects", "profile-section-participation"],
  organization: ["profile-section-projects", "profile-section-organization"],
  "skill-programs": [
    "profile-section-projects",
    "profile-section-skill-programs",
  ],
  career: ["profile-section-career", "profile-section-career-fields"],
  skills: ["profile-section-skills"],
  swoc: ["profile-section-swoc"],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function cloneData(value: unknown): unknown {
  try {
    return structuredClone(value);
  } catch {
    return JSON.parse(JSON.stringify(value ?? null));
  }
}

function normalizePersonalInfoForDraft(raw: unknown): Record<string, unknown> {
  const pi = isRecord(raw) ? { ...raw } : {};
  const photoUrl =
    extractStudentPhotoUrl({ personal_info: pi }) ??
    pi.photoUrl ??
    pi.photo_url ??
    null;
  const preview =
    extractStudentPhotoPreviewUrl({ personal_info: pi }) ??
    pi.photoPreviewUrl ??
    pi.photo_preview_url ??
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

function buildDraftFromMentee(mentee: MenteePayload): Record<string, unknown> {
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
    internships: hasInternshipExperience ? internships : [],
    cocurricular_participations: cloneData(
      mentee.cocurricular_participations || [{}],
    ),
    cocurricular_organizations: hasOrganizedActivities ? organizations : [],
    skill_programs: hasSkillPrograms ? skillPrograms : [],
    career_objective: cloneData(mentee.career_objective || {}),
    skills: cloneData(mentee.skills || {}),
    swoc: cloneData(mentee.swoc || {}),
    hasUbaProject,
    hasInternshipExperience,
    hasOrganizedActivities,
    hasSkillPrograms,
  };
}

function buildSavePayload(
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

function patchDraft(
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

function sectionCounts(data: Record<string, unknown>) {
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

// ── Build an inline <style> block that hides/shows sections based on active section ──
function buildSectionStyles(activeSection: SectionId): string {
  // First hide ALL known section anchors
  const allAnchors = Object.values(SECTION_ANCHOR_MAP).flat();
  const hideRules =
    allAnchors.map((anchor) => `#${anchor}`).join(", ") +
    " { display: none !important; }";

  // Then show only the anchors for the active section
  const visibleAnchors = SECTION_ANCHOR_MAP[activeSection];
  const showRules =
    visibleAnchors.map((anchor) => `#${anchor}`).join(", ") +
    " { display: block !important; }";

  return `${hideRules}\n${showRules}`;
}

type ProfileDraftMap = Record<string, unknown>;

function PreviewPanel({ data }: { data: ProfileDraftMap }) {
  const pi = isRecord(data.personal_info) ? data.personal_info : {};
  const swoc = isRecord(data.swoc) ? data.swoc : {};
  const co = isRecord(data.career_objective) ? data.career_objective : {};
  const skills = isRecord(data.skills) ? data.skills : {};
  const projects = Array.isArray(data.projects) ? data.projects : [];
  const internships = Array.isArray(data.internships) ? data.internships : [];

  const row = (label: string, value: unknown) => (
    <div key={label} className="faculty-profile-editor__preview-row">
      <dt>{label}</dt>
      <dd>
        {value == null || String(value).trim() === "" ? "N/A" : String(value)}
      </dd>
    </div>
  );

  return (
    <div className="faculty-profile-editor__preview">
      <p className="faculty-profile-editor__preview-note">
        Read-only preview of the current draft. Nothing is saved until you click
        Save Profile Changes.
      </p>
      <section>
        <h4>Personal</h4>
        <dl>
          {row("Full Name", data.full_name)}
          {row("UID", data.uid)}
          {row("Semester", data.semester)}
          {row("Section", data.section)}
          {row("Year of Admission", data.year_of_admission)}
          {row("Mobile", pi.mobile_no)}
          {row("Personal Email", pi.personal_email)}
          {row("College Email", pi.college_email)}
          {row("Gender", pi.gender)}
          {row("DOB", pi.dob)}
          {row("Blood Group", pi.blood_group)}
          {row("Category", pi.category)}
          {row("MIS UID", pi.mis_uid)}
          {row("Aadhaar", pi.aadhar_number)}
          {row("LinkedIn", pi.linked_in_id)}
          {row("GitHub", pi.github_id)}
          {row("Permanent Address", pi.permanent_address)}
          {row("Present Address", pi.present_address)}
        </dl>
      </section>
      <section>
        <h4>Parents & Emergency</h4>
        <dl>
          {row("Father's Name", pi.father_name)}
          {row("Mother's Name", pi.mother_name)}
          {row("Guardian", pi.guardian_name)}
          {row("Emergency Contact", pi.emergency_contact_name)}
          {row("Emergency Mobile", pi.emergency_contact_number)}
        </dl>
      </section>
      <section>
        <h4>Projects ({projects.length})</h4>
        <ul>
          {projects.map((item, index) => {
            const p = (item ?? {}) as Record<string, unknown>;
            return (
              <li key={`preview-project-${index}`}>
                {String(p.title || `Project ${index + 1}`)} —{" "}
                {String(p.domain || "N/A")}
              </li>
            );
          })}
        </ul>
      </section>
      <section>
        <h4>Internships ({internships.length})</h4>
        <ul>
          {internships.map((item, index) => {
            const intern = (item ?? {}) as Record<string, unknown>;
            return (
              <li key={`preview-internship-${index}`}>
                {String(
                  intern.company_name ||
                    intern.title ||
                    `Internship ${index + 1}`,
                )}
              </li>
            );
          })}
        </ul>
      </section>
      <section>
        <h4>Career & Skills</h4>
        <dl>
          {row("Career Goal", co.career_goal)}
          {row("Programming Languages", skills.programming_languages)}
          {row("Domains", skills.domains_of_interest)}
        </dl>
      </section>
      <section>
        <h4>SWOC</h4>
        <dl>
          {row("Strengths", swoc.strengths)}
          {row("Weaknesses", swoc.weaknesses)}
          {row("Opportunities", swoc.opportunities)}
          {row("Challenges", swoc.challenges)}
        </dl>
      </section>
    </div>
  );
}

function FacultyMenteeEditForm({
  uid,
  mentee,
  onClose,
}: {
  uid: string;
  mentee: MenteePayload;
  onClose: () => void;
}) {
  const toast = useToast();
  const updateMutation = useUpdateMenteeProfile(uid);
  const uploadMutation = useUploadMenteePhoto(uid, mentee.id);

  const [draft, setDraft] = useState(() => buildDraftFromMentee(mentee));
  const [baselineSignature, setBaselineSignature] = useState(() =>
    JSON.stringify(buildDraftFromMentee(mentee)),
  );
  const [activeSection, setActiveSection] = useState<SectionId>("personal");
  const [formError, setFormError] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const isDirty = JSON.stringify(draft) !== baselineSignature;
  const counts = useMemo(() => sectionCounts(draft), [draft]);
  const activeSectionMeta = SECTIONS.find((s) => s.id === activeSection)!;
  const activeSectionIndex = SECTIONS.findIndex((s) => s.id === activeSection);

  const update = useCallback((patch: Record<string, unknown>) => {
    setDraft((prev) => patchDraft(prev, patch));
  }, []);

  const markFieldTouched = useCallback((path: string) => {
    setTouchedFields((prev) => {
      if (prev.has(path)) return prev;
      const next = new Set(prev);
      next.add(path);
      return next;
    });
  }, []);

  const getFieldValidation = useCallback(
    (path: string) => {
      const match = validationErrors.find((message) =>
        message.toLowerCase().includes(path.replace(/\./g, " ").toLowerCase()),
      );
      return {
        error: match,
        touched: Boolean(match) || touchedFields.has(path),
        markTouched: () => markFieldTouched(path),
      };
    },
    [markFieldTouched, touchedFields, validationErrors],
  );

  const uploadPhoto = useCallback(
    async (file: File): Promise<ProfilePhotoUploadResult> => {
      const response = (await uploadMutation.mutateAsync(
        file,
      )) as unknown as Record<string, unknown>;
      return {
        photoUrl:
          (response.photoUrl as string) ??
          (response.photo_url as string) ??
          null,
        photo_public_id: (response.photo_public_id as string) ?? null,
        photo_preview_url:
          (response.photo_preview_url as string) ??
          (response.photoPreviewUrl as string) ??
          null,
        photoPreviewUrl:
          (response.photoPreviewUrl as string) ??
          (response.photo_preview_url as string) ??
          null,
      };
    },
    [uploadMutation],
  );

  const draftContextValue = useMemo(
    () => ({
      data: draft,
      update,
      getFieldValidation,
      error: formError || (validationErrors.length ? validationErrors[0] : ""),
      markFieldTouched,
      uploadPhoto,
      editorRole: "faculty" as const,
    }),
    [
      draft,
      formError,
      getFieldValidation,
      markFieldTouched,
      update,
      uploadPhoto,
      validationErrors,
    ],
  );

  const navigateSection = (id: SectionId) => {
    setActiveSection(id);
    // Scroll the content pane to top when switching sections
    const contentEl = document.querySelector(
      ".faculty-profile-editor__content",
    );
    if (contentEl) contentEl.scrollTop = 0;
  };

  const goToPrevSection = () => {
    if (activeSectionIndex > 0)
      navigateSection(SECTIONS[activeSectionIndex - 1].id);
  };

  const goToNextSection = () => {
    if (activeSectionIndex < SECTIONS.length - 1)
      navigateSection(SECTIONS[activeSectionIndex + 1].id);
  };

  const requestClose = () => {
    if (updateMutation.isPending) return;
    if (isDirty) {
      setDiscardOpen(true);
      return;
    }
    onClose();
  };

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0)
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (previewOpen) {
        setPreviewOpen(false);
        return;
      }
      if (discardOpen) {
        setDiscardOpen(false);
        return;
      }
      if (updateMutation.isPending) return;
      if (isDirty) {
        setDiscardOpen(true);
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [discardOpen, previewOpen, isDirty, updateMutation.isPending, onClose]);

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();
    setFormError("");
    setValidationErrors([]);
    const payload = buildSavePayload(draft);
    const validation = validateStudentProfileData(payload);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setFormError(
        validation.errors[0] || "Please fix validation errors before saving.",
      );
      return;
    }
    try {
      await updateMutation.mutateAsync(payload);
      setBaselineSignature(JSON.stringify(draft));
      toast.success("Profile updated successfully.");
      onClose();
    } catch (error) {
      setFormError(
        toApiErrorMessage(error, "Failed to update mentee profile."),
      );
    }
  };

  const pi = isRecord(draft.personal_info) ? draft.personal_info : {};
  // Use the shared extractor which already returns a non-empty string or null.
  // This avoids accidentally passing an empty string into an <img src="" />.
  const photoPreview =
    extractStudentPhotoPreviewUrl({ personal_info: pi }) ?? null;

  const sectionStyles = buildSectionStyles(activeSection);

  return (
    <ProfileDraftProvider value={draftContextValue}>
      {/* Inline style that shows only the active section's DOM nodes */}
      <style dangerouslySetInnerHTML={{ __html: sectionStyles }} />

      <div
        className="faculty-profile-editor"
        role="dialog"
        aria-modal="true"
        aria-label="Edit Mentee Profile"
      >
        <div
          className="faculty-profile-editor__backdrop"
          onClick={requestClose}
        />

        <div className="faculty-profile-editor__panel">
          {/* ── Header ── */}
          <header className="faculty-profile-editor__header">
            <div className="faculty-profile-editor__identity">
              <div
                className="faculty-profile-editor__avatar"
                aria-hidden="true"
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="" />
                ) : (
                  <span>
                    {String(draft.full_name || "ST")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                )}
              </div>
              <div className="faculty-profile-editor__identity-text">
                <div className="faculty-profile-editor__title-row">
                  <h2>Edit Mentee Profile</h2>
                  <button
                    type="button"
                    className="faculty-profile-editor__icon-btn"
                    onClick={requestClose}
                    aria-label="Close editor"
                  >
                    <X size={18} />
                  </button>
                </div>
                <p className="faculty-profile-editor__name">
                  {String(draft.full_name || "Unnamed Student")}
                </p>
                <div className="faculty-profile-editor__meta">
                  <span>UID: {uid}</span>
                  <span>Semester: {String(draft.semester ?? "—")}</span>
                  <span>Section: {String(draft.section || "—")}</span>
                  <span>Batch: {String(draft.year_of_admission || "—")}</span>
                </div>
                <div
                  className={`faculty-profile-editor__lock ${
                    draft.is_profile_locked
                      ? "faculty-profile-editor__lock--locked"
                      : "faculty-profile-editor__lock--open"
                  }`}
                >
                  <Lock size={14} aria-hidden="true" />
                  <div>
                    <strong>
                      {draft.is_profile_locked
                        ? "Profile Locked"
                        : "Editable by Student"}
                    </strong>
                    <p>
                      {draft.is_profile_locked
                        ? "Locked for student editing. Faculty can still make changes."
                        : "Student can currently edit this profile."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* ── Body: sidebar + content ── */}
          <div className="faculty-profile-editor__body">
            {/* Sidebar navigation */}
            <nav
              className="faculty-profile-editor__sidebar"
              aria-label="Profile sections"
            >
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const count = section.countKey
                  ? counts[section.countKey]
                  : null;
                return (
                  <button
                    key={section.id}
                    type="button"
                    className={`faculty-profile-editor__nav-item ${
                      activeSection === section.id ? "is-active" : ""
                    }`}
                    onClick={() => navigateSection(section.id)}
                  >
                    <Icon size={16} aria-hidden="true" />
                    <span className="faculty-profile-editor__nav-label">
                      {section.label}
                    </span>
                    {count != null && count > 0 ? (
                      <span className="faculty-profile-editor__nav-count">
                        {count}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>

            {/* Main content area */}
            <div
              className="faculty-profile-editor__content"
              aria-live="polite"
              aria-atomic="false"
            >
              {/* Section heading */}
              <div className="faculty-profile-editor__section-heading">
                <div className="faculty-profile-editor__section-heading-text">
                  <h3>{activeSectionMeta.label}</h3>
                  <p>{activeSectionMeta.description}</p>
                </div>
                <div className="faculty-profile-editor__section-nav">
                  <button
                    type="button"
                    className="faculty-profile-editor__section-nav-btn"
                    onClick={goToPrevSection}
                    disabled={activeSectionIndex === 0}
                    aria-label="Previous section"
                  >
                    <ChevronLeft size={16} />
                    <span>Prev</span>
                  </button>
                  <span className="faculty-profile-editor__section-progress">
                    {activeSectionIndex + 1} / {SECTIONS.length}
                  </span>
                  <button
                    type="button"
                    className="faculty-profile-editor__section-nav-btn"
                    onClick={goToNextSection}
                    disabled={activeSectionIndex === SECTIONS.length - 1}
                    aria-label="Next section"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Form — all steps always mounted; CSS hides irrelevant section anchors */}
              <form
                id="faculty-mentee-profile-form"
                onSubmit={(e) => void handleSubmit(e)}
              >
                <div className="faculty-profile-editor__stack">
                  <Step1Personal />
                  <Step3AcademicBefore />
                  <Step5ProjectsInternships />
                  <Step7SWOC />
                </div>
              </form>
            </div>
          </div>

          {/* Validation error banner */}
          {(formError || validationErrors.length > 0) && (
            <div className="faculty-profile-editor__errors" role="alert">
              <AlertTriangle size={16} aria-hidden="true" />
              <div>
                <p>
                  {formError || "Please fix the highlighted validation issues."}
                </p>
                {validationErrors.length > 1 ? (
                  <ul>
                    {validationErrors.slice(0, 6).map((err) => (
                      <li key={err}>{err}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          )}

          {/* Footer action bar */}
          <footer className="faculty-profile-editor__footer">
            <button
              type="button"
              className="button button--soft"
              onClick={requestClose}
              disabled={updateMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              className="button button--soft"
              onClick={() => setPreviewOpen(true)}
              disabled={updateMutation.isPending}
            >
              <Eye size={16} style={{ marginRight: 6 }} aria-hidden="true" />
              Preview
            </button>
            <button
              type="submit"
              form="faculty-mentee-profile-form"
              className="button button--primary"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Profile Changes"}
            </button>
          </footer>
        </div>
      </div>

      {/* Discard changes dialog */}
      <Modal
        open={discardOpen}
        title="Unsaved changes"
        subtitle="You have unsaved changes. Are you sure you want to leave?"
        onClose={() => setDiscardOpen(false)}
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="button button--soft"
              onClick={() => setDiscardOpen(false)}
            >
              Stay
            </button>
            <button
              type="button"
              className="button button--danger"
              onClick={() => {
                setDiscardOpen(false);
                onClose();
              }}
            >
              Discard Changes
            </button>
          </div>
        }
      >
        <p style={{ margin: 0 }}>
          Closing now will discard edits you made to this mentee profile.
        </p>
      </Modal>

      {/* Read-only preview modal */}
      <Modal
        open={previewOpen}
        title="Preview Profile"
        subtitle="Read-only review of the current draft"
        onClose={() => setPreviewOpen(false)}
        size="xl"
        footer={
          <button
            type="button"
            className="button button--soft"
            onClick={() => setPreviewOpen(false)}
          >
            Close Preview
          </button>
        }
      >
        <PreviewPanel data={draft} />
      </Modal>
    </ProfileDraftProvider>
  );
}

export function FacultyMenteeEditModal({
  uid,
  open,
  mentee,
  onClose,
}: FacultyMenteeEditModalProps) {
  if (!open || !mentee) return null;
  return <FacultyMenteeEditForm uid={uid} mentee={mentee} onClose={onClose} />;
}
