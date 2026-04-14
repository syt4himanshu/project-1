# Admin Module Release Checklist

## 1. Parity Verification
- [ ] Dashboard metrics load from `/api/admin/statistics` with correct number formatting.
- [ ] Users tab supports create, delete, reset password, and bulk uploads with result reporting.
- [ ] Teachers tab loads faculty rows and opens teacher detail modal with mentees.
- [ ] Students tab loads summary rows, applies filters, and opens student detail modal.
- [ ] Allocation tab supports generate, confirm, remove, and assigned-student removal flows.
- [ ] Reports tab covers stats, toppers, semester distribution, backlog list, general report filters, and incomplete profiles.
- [ ] Export actions succeed for `/api/admin/reports/export/all`, `/backlogs`, and `/incomplete`.

## 2. Auth and Access
- [ ] Non-authenticated access to `/admin/*` redirects to login with preserved `next` path.
- [ ] Non-admin role access to `/admin/*` redirects to role-appropriate dashboard.
- [ ] Token expiry (`401`) triggers session clear and prevents stale privileged UI.

## 3. Mutation Safety
- [ ] Dangerous operations (delete user, allocation removal) require confirmation.
- [ ] React Query invalidation updates related tabs after successful mutation.
- [ ] Optimistic paths recover correctly on API failure.
- [ ] Error states surface user-safe messages and leave UI actionable.

## 4. Data Contract and Edge Cases
- [ ] Mixed snake_case/camelCase payloads are normalized consistently.
- [ ] Empty/null payload fields render graceful fallbacks (`N/A`, empty table states).
- [ ] Delimited list fields (backlog subjects, missing profile fields) parse correctly.

## 5. Performance and Accessibility
- [ ] Reports route is lazy-loaded and does not block initial admin navigation.
- [ ] Loading, empty, and error states are visible for all major query widgets.
- [ ] Interactive controls have visible labels and keyboard-accessible actions.

## 6. Test Gates
- [ ] Unit tests cover normalization and report filter behavior.
- [ ] Integration tests cover auth provider, role guards, and critical mutations.
- [ ] Smoke route tests validate all admin tab routes.
- [ ] `npm run test` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.

## 7. Release Readiness Signoff
- [ ] Frontend and backend API contracts reviewed against current deployment.
- [ ] Product acceptance walkthrough completed for admin workflows.
- [ ] Rollback plan confirmed (previous frontend artifact + cache bust strategy).
