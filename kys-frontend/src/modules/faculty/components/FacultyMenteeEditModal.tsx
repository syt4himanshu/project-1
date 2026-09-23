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
import { extractStudentPhotoPreviewUrl } from "../../../shared/utils/studentPhoto";
import { ProfileDraftProvider } from "../../student/context/ProfileDraftContext";
import type { ProfilePhotoUploadResult } from "../../student/context/ProfileDraftContext";
import { validateMenteeProfileData } from "../validation/menteeProfileValidation";
import Step1Personal from "../../student/components/wizard/Step1Personal";
import Step3AcademicBefore from "../../student/components/wizard/Step3AcademicBefore";
import Step5ProjectsInternships from "../../student/components/wizard/Step5ProjectsInternships";
import Step7SWOC from "../../student/components/wizard/Step7SWOC";
import { useUpdateMenteeProfile, useUploadMenteePhoto } from "../hooks";
import type { MenteePayload } from "../api/types";
import {
  buildDraftFromMentee,
  buildTargetedSavePayload,
  buildSectionStyles,
  cloneData,
  isRecord,
  patchDraft,
  sectionCounts,
  type SectionId,
} from "../utils/menteeProfileEditor";

interface FacultyMenteeEditModalProps {
  uid: string;
  open: boolean;
  mentee: MenteePayload;
  onClose: () => void;
}


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

  // Build the initial draft once and derive the baseline signature from the
  // same value so both are guaranteed to be in sync on first render.
  const [draft, setDraft] = useState(() => buildDraftFromMentee(mentee));
  const [baselineDraft, setBaselineDraft] = useState(() =>
    buildDraftFromMentee(mentee),
  );
  const [baselineSignature, setBaselineSignature] = useState(
    () => JSON.stringify(buildDraftFromMentee(mentee)),
  );
  const [activeSection, setActiveSection] = useState<SectionId>("personal");
  const [formError, setFormError] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [discardOpen, setDiscardOpen] = useState(false);
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
  }, [discardOpen, isDirty, updateMutation.isPending, onClose]);

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();
    setFormError("");
    setValidationErrors([]);

    const payload = buildTargetedSavePayload(draft, baselineDraft);
    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    const validation = validateMenteeProfileData(payload, draft);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setFormError(
        validation.errors[0] || "Please fix validation errors before saving.",
      );
      return;
    }
    try {
      await updateMutation.mutateAsync(payload);
      setBaselineDraft(cloneData(draft));
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
                  <img
                    src={photoPreview}
                    alt=""
                    // Hide silently if the Cloudinary asset returns 404 (stale URL).
                    // The avatar will fall back to the initials span below.
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
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
                  className={`faculty-profile-editor__lock ${draft.is_profile_locked
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
                    className={`faculty-profile-editor__nav-item ${activeSection === section.id ? "is-active" : ""
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
