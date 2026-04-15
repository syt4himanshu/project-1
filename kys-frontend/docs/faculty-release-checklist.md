# Faculty Module — Release Checklist

Parity signoff against admin module. All items must be ✅ before merging to main.

---

## Phase 1 — File Structure

- [x] `src/modules/faculty/api/` — client, types, queryKeys, normalizers, index
- [x] `src/modules/faculty/hooks/` — useFacultyQueries, useFacultyChat, index
- [x] `src/modules/faculty/pages/` — Dashboard, Mentees, MenteeDetail, Profile, Chatbot
- [x] `src/modules/faculty/components/` — StatsCards, MenteesTable, MentoringMinuteForm, MentoringHistoryPanel, FacultyProfileForm, ChangePasswordModal, DataPanel
- [x] `src/modules/faculty/chatbot/` — components, constants, types, utils (chatFormatters, chatErrorMapper)
- [x] `src/app/router/faculty.routes.tsx` — all 5 routes wired
- [x] `src/app/layouts/FacultyLayout.tsx` — nav links for all 4 sections

---

## Phase 2 — Core Workflows

- [x] Dashboard shows live assigned-mentee count with loading/error states
- [x] Mentees list uses backend pagination (`limit`/`offset`) with Prev/Next controls
- [x] Mentee detail renders full KYS profile (personal info, education, projects, internships, co-curricular, SWOC, skills, career objective)
- [x] Add Mentoring Minute form with required `remarks`, optional `suggestion`/`action`
- [x] Mentoring history paginated with Newer/Older controls
- [x] `useAddMentoringMinute` invalidates `facultyKeys.menteeMinutes(uid)` on success
- [x] Profile edit form with toast feedback on save
- [x] Change Password modal with client-side validation (min 8 chars, confirm match) and toast feedback
- [x] All snake_case normalization in `normalizers.ts` — zero inline field mapping in components

---

## Phase 3 — Chatbot + Hardening

- [x] Chatbot scope toggle: "All assigned" vs "Single student"
- [x] Student search + select in sidebar
- [x] Prompt input with 2000-char limit
- [x] Structured response cards (Summary, Key Observations, Concerns, Suggestions)
- [x] Abort (Stop button) cancels in-flight request
- [x] Regenerate replays last payload
- [x] `chatErrorMapper.ts` maps backend errors to user-safe messages:
  - 403 → "You can only query students assigned to you."
  - 404 → "Not enough academic or profile data to generate insights."
  - 429 → "Rate limit reached (10 requests/min). Please wait a moment."
  - 401 → "Your session has expired. Please sign in again."
  - 500 → "The AI service encountered an error."
  - Timeout pattern → "The request timed out. Try again or narrow to one student."
- [x] Chatbot route lazy-loaded (`FacultyChatbotPage` + sub-components via `lazy()`)
- [x] Loading skeleton shown while chatbot chunk loads

---

## Tests

- [x] `src/testing/unit/chatFormatters.test.ts` — 18 cases covering parseStructuredResponse, toErrorMessage, formatContextLabel
- [x] `src/testing/unit/normalizers.test.ts` — 22 cases covering all normalizer functions
- [x] `src/testing/unit/chatErrorMapper.test.ts` — 10 cases covering all HTTP status codes and message patterns
- [x] `src/testing/integration/useFacultyChat.test.tsx` — 13 cases covering mentee load, scope, filtering, submit, error mapping, abort
- [x] `src/app/router/facultyRoutes.smoke.test.tsx` — 7 smoke tests covering all routes + nav visibility

---

## CI Gates

- [x] `npm run test` — 90/90 passing
- [x] `npm run lint` — 0 errors
- [x] `npm run build` — clean production bundle, chatbot in separate chunk

---

## Manual Verification (pre-deploy)

- [ ] Login as faculty user, verify redirect to `/faculty/dashboard`
- [ ] Dashboard mentee count matches backend
- [ ] Mentees list paginates correctly (Next/Prev)
- [ ] Mentee detail loads full KYS profile for an assigned student
- [ ] Add mentoring minute → appears in history immediately
- [ ] Profile edit saves and reflects updated name
- [ ] Change password with wrong current password shows error toast
- [ ] Chatbot: "All assigned" scope returns multi-student insights
- [ ] Chatbot: "Single student" scope returns single-student insights
- [ ] Chatbot: selecting unassigned student UID returns 403 → user-safe message
- [ ] Chatbot: Stop button cancels in-flight request
- [ ] Chatbot: Regenerate replays last query
- [ ] Session expiry (delete token in DevTools) → 401 redirects to login
- [ ] Rate limit: 11 rapid requests → 429 message shown in chat
- [ ] Non-faculty role attempting `/faculty/*` → redirected away
