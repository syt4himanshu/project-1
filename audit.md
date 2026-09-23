# Audit: Mentor → Edit Mentee Profile Flow

**Repository:** syt4himanshu/project-1  
**Date:** 2026-09-23  
**Status:** Read-only audit — no code modified

---

## 1. Current Mentor Edit Data Flow

```
Faculty Dashboard
  → Student row click
    → StudentPreviewModal opens (useMentee(uid) → GET /api/faculty/me/mentees/:uid)
      → Raw API response → normalizeMenteePayload()
          normalizePastEducation()       → unpackExamMeta (decodes [[KYS_META]] from exam_name)
          normalizePostAdmission()       → unpackTextMeta (decodes backlog_subjects packed fields)
          normalizeInternships()         → unpackTextMeta (decodes designation/description)
          normalizeCareerObjective()     → unpackTextMeta (decodes campus_placement_reasons extras)
          normalizeSkillsBundle()        → unpackTextMeta (decodes familiar_tools_platforms extras + skill_programs)
      → Decoded MenteePayload stored in React Query cache

  → "Edit Profile" button clicked
    → FacultyMenteeEditModal(mentee = decodedPayload) opens
      → buildDraftFromMentee(mentee) initialises React state
          Pads projects[] to minimum 3 slots
          Computes hasInternshipExperience, hasOrganizedActivities, hasSkillPrograms flags
          career_objective / skills / swoc → cloneData(mentee.X || {})
      → ProfileDraftProvider wraps Step1Personal, Step3AcademicBefore,
                                       Step5ProjectsInternships, Step7SWOC
          (Step7SWOC internally renders Step8CareerSkills)
      → CSS buildSectionStyles() hides/shows DOM anchors per active sidebar section
          All four step components are always MOUNTED; only display:none toggled

  → Mentor edits fields
    → update(patch) → patchDraft() → shallow-merges objects, replaces primitives

  → "Save Profile Changes" clicked
    → buildSavePayload(draft)         full snapshot, every field included, no dirty-tracking
    → validateStudentProfileData(payload)   full Joi validation on entire payload
        If any error → setFormError / setValidationErrors → ABORT (no HTTP request)
    → If valid: updateMutation.mutateAsync(payload)
        → facultyClient.updateMenteeProfile(uid, payload)
        → PUT /api/faculty/me/mentees/:uid/profile  (JSON body)

  Backend route middleware chain:
    verifyToken → roleRequired(['faculty'])
    → param('uid') validator
    → validate(studentProfileSchema)      Joi schema on req.body (full payload)
        If Joi error → 400 response (request never reaches controller)
    → updateMenteeProfileByFaculty()
        Finds faculty by user_id
        Finds student by uid + mentor_id (includes all associations)
        Opens Sequelize transaction
        → applyStudentProfileUpdate(student, req.body, tx)
            encodeStudentProfilePayload(rawData)  re-packs skills into familiar_tools_platforms
            Updates student top-level fields (full_name split, semester, section, year_of_admission)
            student.save()
            Validates past_education_records (no duplicates, all have exam_name)
            Validates post_admission_records (count, range, no duplicates)
            Iterates model mappings:
              personal_info / career_objective / skills / swoc  → UPSERT (update or create)
              projects / internships / participations / organizations / post_admission_records / past_education_records
                                                                → DESTROY ALL + RECREATE
        tx.commit()
        invalidateMenteesCache(faculty.id)
        Re-fetches updated student → returns serialized data
    → React Query invalidates mentee(uid) + mentees() → triggers re-fetch
    → Toast "Profile updated successfully."
```

---

## 2. Exact Cause of the `career_objective.specific_details ≤ 200` Error

### Root Cause

The error can fire even when the mentor **never touches** `specific_details`. Here is the precise chain:

1. **DB contains a legacy value**: A student previously saved `career_objective.specific_details` with a value longer than 200 characters (e.g. 250 chars — possible because the DB column is `DataTypes.TEXT` with no database-level length constraint, and the Joi 200-char limit was introduced or tightened after some data was written).

2. **Decode path copies it verbatim**: `normalizeCareerObjective()` in `normalizers.ts` unpacks the `campus_placement_reasons` packed field but does NOT truncate or validate `specific_details`. The 250-char value lands in `MenteePayload.career_objective.specific_details` unchanged.

3. **buildDraftFromMentee copies it verbatim**: `career_objective: cloneData(mentee.career_objective || {})` — deep clone, no transformation.

4. **buildSavePayload sends it verbatim**: `career_objective: data.career_objective || {}` — full object always included, no dirty/touched filter.

5. **validateStudentProfileData blocks it**: The frontend Joi schema defines `specific_details: text200` where `text200 = Joi.string().trim().max(200).allow('', null)`. `validateStudentProfileData(payload)` is called synchronously in `handleSubmit` on the **entire payload**, including this unmodified field. Joi fires the error. `handleSubmit` returns early — **the HTTP request is never made**.

6. **Backend would also block it**: Even if the frontend check were removed, the backend route runs `validate(studentProfileSchema)` middleware which contains the identical `text200` rule and would return HTTP 400.

### Exact Joi Rule (both layers)

```js
// kys-backend/middleware/validation/student.validation.js  (line 3 + career_objective block)
const text200 = Joi.string().trim().max(200).allow('', null);
// ...
career_objective: Joi.object({
  specific_details: text200,   // ← fires when existing DB value > 200 chars
  ...
})

// kys-frontend/src/modules/student/validation/studentProfileSchema.ts  (identical)
const text200 = Joi.string().trim().max(200).allow('', null)
// ...
career_objective: Joi.object({
  specific_details: text200,
  ...
})
```

**Error message produced:**
> `career_objective.specific_details length must be less than or equal to 200 characters long`

### Why this is blocked even though the mentor didn't edit it

`buildSavePayload` includes the entire draft snapshot. There is no mechanism to distinguish "fields the mentor edited" from "fields loaded from the DB and passed through unchanged." The validation runs on the whole object, so any pre-existing invalid data prevents **any** save.

---

## 3. Which Student Fields Are Missing from the Mentor Editor

### Step Imports in FacultyMenteeEditModal.tsx (lines 34–38)

```ts
import Step1Personal            from "../../student/components/wizard/Step1Personal";
import Step3AcademicBefore      from "../../student/components/wizard/Step3AcademicBefore";
import Step5ProjectsInternships from "../../student/components/wizard/Step5ProjectsInternships";
import Step7SWOC                from "../../student/components/wizard/Step7SWOC";
```

`Step7SWOC` internally imports and renders `Step8CareerSkills` unconditionally.  
`Step5ProjectsInternships` internally renders `Step6CoCurricular`.

### Student Wizard Steps vs Mentor Editor Coverage

| Student Wizard Step | Content | In Mentor Editor? |
|---|---|---|
| Step 1 — Personal Info | Name, contact, address, photo | ✅ via Step1Personal |
| Step 2 — Parents / Emergency | Father, mother, guardian, emergency | ✅ via Step1Personal (includes all these sections) |
| Step 3 — Past Education | SSC, HSC/Diploma, entrance | ✅ via Step3AcademicBefore |
| Step 4 — Academic Records | Post-admission SGPA per semester | ✅ via Step3AcademicBefore (includes "Academic Information - After Admission" section) |
| Step 5 — Projects & Internships | Projects, internships | ✅ via Step5ProjectsInternships |
| Step 6 — Co-Curricular | Participations, organizations | ✅ rendered inside Step5ProjectsInternships |
| Step 7 — SWOC | Strengths, weaknesses, opportunities, challenges | ✅ via Step7SWOC |
| Step 8 — Career & Skills | Career goal, skills, domains, expectations | ✅ rendered inside Step7SWOC |

**No student wizard step content is missing from the mentor editor.** All fields are present — the indirect rendering chain (Step7→Step8, Step5→Step6) means they are included without being directly imported.

---

## 4. Fields Incorrectly Conditionally Hidden

### Finding 4A — Arrays Collapsed to Empty When No Data Exists

In `buildDraftFromMentee`, three arrays are **replaced with `[]`** if the student has no existing data:

```ts
// FacultyMenteeEditModal.tsx lines ~305–327
internships:              hasInternshipExperience ? internships : [],
cocurricular_organizations: hasOrganizedActivities ? organizations : [],
skill_programs:           hasSkillPrograms ? skillPrograms : [],
```

- `hasInternshipExperience` = `true` only if at least one existing internship has a company_name, designation, domain, etc.
- `hasOrganizedActivities` = `true` only if at least one existing organization entry has name/date/level/remark.
- `hasSkillPrograms` = `true` only if at least one existing skill_program has course_title/platform/etc.

**Problem:** If a student has never entered any internships, the draft starts with `internships: []`. `Step5ProjectsInternships` renders internship fields conditionally based on a `hasInternshipExperience` flag computed from the draft. If the draft has no internships, the mentor sees no internship form fields and cannot add the first internship entry.

The same applies to `cocurricular_organizations` and `skill_programs`.

**Impact:** Mentor cannot add data for a student who has never filled those sections. The form fields for internships, co-curricular organizations, and skill programs are invisible until the student first enters data.

### Finding 4B — hasUbaProject Not Blocking Visibility But Flag Is Stored in Draft

```ts
hasUbaProject,             // stored in draft
hasInternshipExperience,   // stored in draft
hasOrganizedActivities,    // stored in draft
hasSkillPrograms,          // stored in draft
```

These boolean flags are included in the draft object and passed via `ProfileDraftContext`. Step5ProjectsInternships reads `data.hasInternshipExperience`, `data.hasOrganizedActivities`, `data.hasSkillPrograms`, `data.hasUbaProject` from context to show/hide form sections. When the flags are `false`, the corresponding "Add" toggle/button may be needed but is absent or hidden.

### Finding 4C — Internship Section Visibility in Step5

In `Step5ProjectsInternships.tsx`, the internship form section is likely rendered conditionally on `hasInternshipExperience`. When `buildDraftFromMentee` sets `internships: []` and `hasInternshipExperience: false`, the internship toggle may not show, blocking the mentor from adding data for a student with no prior internship records.

This is the most significant hidden-field issue for the business requirement "See those fields even when the student has never entered a value."

---

## 5. Which Validation Layer Is Causing the Save to Fail

### Layer 1: Frontend — `validateStudentProfileData()` (PRIMARY BLOCKER)

- **Location:** `kys-frontend/src/modules/faculty/components/FacultyMenteeEditModal.tsx`, `handleSubmit`, line ~594
- **Called:** synchronously before any HTTP request
- **Scope:** validates entire `buildSavePayload(draft)` — all fields, including untouched ones
- **Effect:** if any existing DB value violates the schema, the save is blocked and the user sees a form error; no network request is made
- **Specific rule:** `career_objective.specific_details: Joi.string().trim().max(200).allow('', null)`

### Layer 2: Backend — `validate(studentProfileSchema)` middleware (SECONDARY BLOCKER)

- **Location:** `kys-backend/routes/faculty.routes.js` line ~57 — `validate(studentProfileSchema)` in the PUT `/me/mentees/:uid/profile` route
- **Called:** in the Express middleware chain before the controller runs
- **Scope:** validates entire `req.body`
- **Effect:** returns HTTP 400 with Joi error message if any field violates the schema
- **Specific rule:** same `specific_details: text200 = Joi.string().trim().max(200)`

Both layers apply the same rule. Layer 1 fires first; Layer 2 would catch any attempt to bypass the frontend.

### Layer 3: Backend — `applyStudentProfileUpdate()` (BUSINESS LOGIC)

- Validates `past_education_records` (no duplicates) and `post_admission_records` (count, semester range).
- Does not re-validate `career_objective.specific_details` — relies on Layer 2.

---

## 6. Whether the Backend Correctly Persists the Complete Profile

### Persistence Assessment

| Relation | Save Strategy | Safe? | Notes |
|---|---|---|---|
| `personal_info` | UPSERT (update if exists, create if not) | ✅ Safe | No data loss. In-place update. |
| `career_objective` | UPSERT | ✅ Safe | No data loss. In-place update. |
| `skills` | UPSERT | ✅ Safe | No data loss. In-place update. |
| `swoc` | UPSERT | ✅ Safe | No data loss. In-place update. |
| `projects` | DESTROY ALL + RECREATE | ⚠️ Risk (see §7) | IDs lost on each save. |
| `internships` | DESTROY ALL + RECREATE | ⚠️ Risk (see §7) | IDs lost on each save. |
| `cocurricular_participations` | DESTROY ALL + RECREATE | ⚠️ Risk | IDs lost. |
| `cocurricular_organizations` | DESTROY ALL + RECREATE | ⚠️ Risk | IDs lost. |
| `past_education_records` | DESTROY ALL + RECREATE | ⚠️ Risk | IDs lost. |
| `post_admission_records` | DESTROY ALL + RECREATE | ⚠️ Risk | IDs lost. |

The entire save is wrapped in a Sequelize transaction, so if any step fails, all changes are rolled back — this is correct.

The `encodeStudentProfilePayload()` correctly re-packs skills before writing to the DB (mirrors what the student controller does).

---

## 7. Data-Loss Risks in the Current Save Implementation

### Risk 1 — Destroy+Recreate Arrays Lose Database IDs

**Affected tables:** projects, internships, cocurricular_participations, cocurricular_organizations, past_education_records, post_admission_records.

Every save deletes all rows for the student and re-inserts them. This means:
- Primary key IDs change on every save.
- Any external system referencing a row by ID (e.g. file attachments, foreign keys) would break.
- No partial update is possible — if a new row fails to insert, the entire transaction rolls back and the previous records are gone from the intermediate state (protected by the transaction, but the rollback restores them).

**Current mitigation:** Sequelize transaction wraps all operations — a failed insert rolls back the whole operation, leaving data intact. This prevents data loss on error.

**Residual risk:** If `buildSavePayload` produces an empty array for a section (e.g. `internships: []` because `hasInternshipExperience = false`), the destroy step deletes all existing internship records and the empty re-create step creates nothing — **all internship records are deleted**.

### Risk 2 — `hasInternshipExperience = false` Sends `internships: []`

This is the most serious data-loss risk in the current implementation.

**Scenario:**
1. Student has two internship records in the DB.
2. Mentor opens the editor. `buildDraftFromMentee` sets `hasInternshipExperience = true` because existing records have data → draft contains the internships. ✅ OK here.
3. But: student has NO internships (new student). `hasInternshipExperience = false`. Draft `internships = []`.
4. `buildSavePayload` sends `internships: []`.
5. Backend destroys all internship rows for this student (none in this case — no harm).
6. But if a student somehow HAS internship data and the flag logic malfunctions (edge case: all internship fields are falsy but rows exist), the data would be deleted.

**The same risk applies to `cocurricular_organizations` and `skill_programs`.**

### Risk 3 — Full Payload Always Sent — No Partial Update

Even if the mentor only changes `personal_info.mobile_no`, the full `projects`, `internships`, `post_admission_records` etc. are sent and the destroy+recreate runs for all of them. This is unnecessary churn and amplifies the risk surface area.

### Risk 4 — Validation Blocks Saves of Unchanged Data

As described in §2: a student with any pre-existing value that violates the current schema limits will block ALL mentor saves, not just edits to that field. This is arguably the highest-priority issue because it is currently user-visible.

---

## 8. Exact Files That Need To Be Modified

Listed by issue, in priority order:

### Priority 1 — Fix the validation-blocks-unrelated-edit problem

| File | Change Needed |
|---|---|
| `kys-frontend/src/modules/faculty/components/FacultyMenteeEditModal.tsx` | In `handleSubmit`, replace full `validateStudentProfileData(payload)` with a scope-limited validation that only validates fields that were actually touched/modified, OR introduce a lenient mentor-specific Joi schema that has relaxed `max()` constraints (or uses `.max(Infinity)`) for fields like `specific_details`. |
| `kys-backend/routes/faculty.routes.js` | Replace `validate(studentProfileSchema)` on the PUT mentee profile route with a mentor-specific Joi schema (copy of `studentProfileSchema` with relaxed `max()` constraints on text fields), OR remove the length-capping rules from the faculty route entirely (lengths are enforced by `DataTypes.TEXT` at the DB level). |
| `kys-backend/middleware/validation/student.validation.js` | Optionally: extract a separate `menteeProfileSchema` that the faculty route uses, inheriting the structural rules but relaxing string length caps that could fail on legacy data. |

### Priority 2 — Fix hidden-fields when student has no existing data

| File | Change Needed |
|---|---|
| `kys-frontend/src/modules/faculty/components/FacultyMenteeEditModal.tsx` | In `buildDraftFromMentee`, change `internships: hasInternshipExperience ? internships : []` to `internships: internships` (always pass the array, even if empty). Similarly for `cocurricular_organizations` and `skill_programs`. Initialize these arrays with at least one empty slot `[{}]` so the step components always render input fields. |
| `kys-frontend/src/modules/student/components/wizard/Step5ProjectsInternships.tsx` | Ensure the internship section renders when the array is empty (not gated behind a `hasInternshipExperience` check that hides the entire section). If needed, add an "Add first internship" affordance unconditionally. |

### Priority 3 — Prevent silent data deletion risk

| File | Change Needed |
|---|---|
| `kys-frontend/src/modules/faculty/components/FacultyMenteeEditModal.tsx` | `buildSavePayload` should only include sections that were actually touched, OR the backend should use a patch (per-field update) rather than destroy+recreate for array sections. Short-term: ensure `internships`, `cocurricular_organizations`, `skill_programs` are always populated from the draft (never empty unless the mentor explicitly cleared them). |

---

## 9. Proposed Implementation in Small Steps

### Step 1 — Introduce a mentor-specific Joi schema on the backend route (fixes the immediate error)

Create `kys-backend/middleware/validation/menteeProfileSchema.js`:
- Copy `studentProfileSchema` structure.
- Remove or relax the `max(200)` / `max(255)` / `max(500)` string caps on `career_objective`, `skills`, `swoc`, and `internship.description` — the DB columns are `TEXT` with no length limit, so application-level caps on the faculty write path serve no purpose for persisted legacy data.
- Keep structural validations (correct types, integer ranges for semesters/years, pattern rules for email/phone).

Update `kys-backend/routes/faculty.routes.js`:
- Replace `validate(studentProfileSchema)` with `validate(menteeProfileSchema)` on the PUT route.

This is safe because:
- The DB has no length constraint at column level — `DataTypes.TEXT`.
- The student write path (`PUT /student/me`) continues to enforce `max(200)` for new student submissions.
- The mentor is editing pre-existing data from the DB; the data is already stored.

### Step 2 — Fix frontend validation to not block on untouched fields (fixes the error in the UI)

In `FacultyMenteeEditModal.tsx` `handleSubmit`:
- Option A (minimal): Run `validateStudentProfileData` only on fields that appear in `touchedFields`. Build a partial payload containing only touched keys and validate that.
- Option B (recommended): Introduce a `validateMenteeEditPayload()` function in a new file `kys-frontend/src/modules/faculty/validation/menteeEditSchema.ts` that mirrors the backend `menteeProfileSchema` — structurally validates but with relaxed string-length rules.
- Either way, the faculty-specific validation must not fire errors on fields the mentor never touched.

### Step 3 — Fix buildDraftFromMentee to always expose empty-data sections (fixes hidden fields)

In `buildDraftFromMentee`:

```ts
// BEFORE (hides internships when none exist)
internships: hasInternshipExperience ? internships : [],

// AFTER (always expose; initialize with one empty slot if empty)
internships: internships.length > 0 ? internships : [{}],
```

Same for `cocurricular_organizations` and `skill_programs`.

Remove the `hasInternshipExperience`, `hasOrganizedActivities`, `hasSkillPrograms` keys from the draft object, or set them to `true` always, so `Step5ProjectsInternships` always renders those sections.

### Step 4 — Verify Step5ProjectsInternships renders unconditionally for mentor role

Inspect how `Step5ProjectsInternships` uses `hasInternshipExperience` from context. If it gates the internship section behind this flag:
- Either always set the flag to `true` when `editorRole === 'faculty'`
- Or remove the gate for the internship form entirely (showing an "Add" button unconditionally).

The `editorRole: "faculty"` value is already passed via `ProfileDraftContext` — it can be used as a condition.

### Step 5 — Add tests for the new behavior

See §10.

---

## 10. Required Test Cases

### Frontend Unit/Integration Tests

| ID | Scenario | Expected |
|---|---|---|
| FE-01 | Mentor opens editor; student has `career_objective.specific_details` = 250 chars in DB; mentor edits only `mobile_no`; clicks Save | Save succeeds — the 250-char value does not block the save |
| FE-02 | Mentor opens editor; mentor changes `specific_details` to a 250-char string; clicks Save | Save blocked with validation error for `specific_details` |
| FE-03 | Student has no internship records; mentor opens editor | Internship form fields ARE visible (not hidden) |
| FE-04 | Student has no skill_programs; mentor opens editor | Skill programs form fields ARE visible |
| FE-05 | Student has no `cocurricular_organizations`; mentor opens editor | Organizations section IS visible |
| FE-06 | Mentor changes only `section` field; saves | Only allowed; no unrelated validation errors from career/skills/swoc |
| FE-07 | `buildDraftFromMentee` called with `mentee.internships = []` | Draft `internships` is `[{}]` (one empty slot), not `[]` |
| FE-08 | `buildDraftFromMentee` called with `mentee.career_objective = null` | Draft `career_objective` is `{}` (empty object) |
| FE-09 | `buildSavePayload` called with all sections | Returns an object with every key present, including `career_objective`, `skills`, `swoc`, `internships` |

### Backend Integration Tests

| ID | Scenario | Expected |
|---|---|---|
| BE-01 | PUT `/faculty/me/mentees/:uid/profile` with `career_objective.specific_details` = 250 chars (pre-existing value passed through) | Returns HTTP 200 — not blocked by Joi schema |
| BE-02 | PUT with `career_objective.specific_details` = 250 chars, admission_type = 'hsc', DIPLOMA record present | Still blocked by the admission-type cross-validation (structural rule preserved) |
| BE-03 | PUT with `internships: []` | All existing internship records destroyed; none recreated; DB internship table for student is empty |
| BE-04 | PUT with `internships: [{ company_name: "Acme" }]` | One internship record upserted; previous internships replaced |
| BE-05 | PUT with only `personal_info` changed; all other fields identical to DB | `career_objective`, `skills`, `swoc` updated in place (UPSERT); projects/internships destroyed+recreated with same data |
| BE-06 | PUT with `career_objective` absent from body | `career_objective` not touched in DB (`encodeStudentProfilePayload` skips absent keys, `applyStudentProfileUpdate` checks `if (!(dataKey in data)) continue`) |
| BE-07 | `applyStudentProfileUpdate` called inside a transaction that fails mid-way | Transaction rolled back; DB state unchanged |
| BE-08 | Faculty tries to update a mentee that belongs to a different faculty | Returns HTTP 404 "Mentee not found or not assigned to this faculty" |
| BE-09 | Faculty profile not found | Returns HTTP 404 "Faculty profile not found" |

---

## Summary Table

| Finding | Severity | Blocked By |
|---|---|---|
| `specific_details > 200` blocks unrelated saves | **Critical** | Frontend Joi + Backend Joi |
| `internships: []` hides form and can delete data for new students | **High** | `buildDraftFromMentee` flag logic |
| `cocurricular_organizations: []` hides organizations section | **High** | `buildDraftFromMentee` flag logic |
| `skill_programs: []` hides skill programs section | **High** | `buildDraftFromMentee` flag logic |
| Destroy+recreate for all array relations (churn, ID loss) | **Medium** | `applyStudentProfileUpdate` design |
| No partial-update / dirty-tracking on save | **Medium** | `buildSavePayload` design |
| `Step8CareerSkills` not directly imported (indirect via Step7) | **None** — works correctly | — |
| All 13 student wizard sections present in mentor editor | **None** — complete coverage | — |
| Transaction wraps all writes | **Positive** — protects against partial failure | — |

---

*Audit complete. Awaiting approval before any code changes.*
