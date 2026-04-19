# Photo Field Standardization - Migration Checklist

## ✅ Completed Changes

### Backend Core
- [x] **`kys-backend/utils/helpers.js`**
  - Added `photo_url` → `photoUrl` transformation in `serializeModel()`
  - Transformation is automatic for all serialized models

- [x] **`kys-backend/controllers/admin.controller.js`**
  - Imported `serializeModel` from helpers
  - Changed `profile_photo_url` → `photoUrl` in user list endpoint
  - Uses `serializeModel()` for proper transformation

- [x] **`kys-backend/controllers/student.controller.js`**
  - Updated console logs to reference `photoUrl`
  - Updated sanitization to remove `photoUrl` instead of `photo_url`

- [x] **`kys-backend/utils/studentPhotoUpload.js`**
  - Response returns `photoUrl` instead of `photo_url`
  - Database still writes to `photo_url` (correct)

### Backend Tests
- [x] **`kys-backend/test-photo-flow.js`**
  - Updated to show DB field (`photo_url`) vs API field (`photoUrl`)
  - Demonstrates transformation correctly

- [x] **`kys-backend/test-api-response.js`**
  - Updated to check for `photoUrl` in API responses

### Frontend Core
- [x] **`kys-frontend/src/shared/utils/studentPhoto.ts`**
  - Simplified to only check `photoUrl` fields
  - Removed legacy field name checks

### Frontend Admin Portal
- [x] **`kys-frontend/src/modules/admin/api/types.ts`**
  - Changed `profilePhotoUrl` → `photoUrl`
  - Removed legacy field references

- [x] **`kys-frontend/src/modules/admin/api/normalizers.ts`**
  - Updated to normalize `photoUrl` only

- [x] **`kys-frontend/src/modules/admin/pages/AdminUsersPage.tsx`**
  - Changed all `profilePhotoUrl` → `photoUrl`

- [x] **`kys-frontend/src/modules/admin/components/students/StudentDetailModal.tsx`**
  - Updated console logs and references to `photoUrl`

- [x] **`kys-frontend/src/modules/admin/hooks/useAdminQueries.integration.test.tsx`**
  - Updated test data to use `photoUrl`

### Frontend Student Portal
- [x] **`kys-frontend/src/modules/student/pages/Dashboard.tsx`**
  - Updated `StudentProfile` interface to use `photoUrl`
  - Updated console logs

- [x] **`kys-frontend/src/modules/student/components/wizard/Step1Personal.tsx`**
  - Changed `photo_url` → `photoUrl` in upload handler
  - Changed `photo_url` → `photoUrl` in display logic

- [x] **`kys-frontend/src/modules/student/store/studentProfileSlice.ts`**
  - Updated state management to use `photoUrl`

### Frontend Faculty Portal
- [x] **`kys-frontend/src/modules/faculty/pages/FacultyMenteeDetailPage.tsx`**
  - Updated console logs to reference `photoUrl`

- [x] **`kys-frontend/src/modules/faculty/api/normalizers.test.ts`**
  - Updated test expectations to use `photoUrl`

### Database Layer (No Changes Needed)
- [x] **`kys-backend/models/StudentPersonalInfo.js`**
  - ✅ Correctly uses `photo_url` (snake_case)
  - ✅ No changes needed

- [x] **`kys-backend/migrations/`**
  - ✅ Correctly uses `photo_url` (snake_case)
  - ✅ No changes needed

## 🧪 Testing Checklist

### Manual Testing
- [ ] **Student Portal - Upload Photo**
  1. Login as student
  2. Go to Profile → Edit
  3. Upload a photo
  4. Verify photo displays immediately
  5. Check browser console: Should log `photoUrl`

- [ ] **Student Portal - View Photo**
  1. Login as student
  2. Go to Dashboard
  3. Verify photo displays in header
  4. Check browser console: Should reference `photoUrl`

- [ ] **Faculty Portal - View Student Photo**
  1. Login as faculty
  2. Go to Mentees list
  3. Click on a student with photo
  4. Verify photo displays in detail modal
  5. Check browser console: Should log `photoUrl`

- [ ] **Admin Portal - View Student Photo**
  1. Login as admin
  2. Go to Users list
  3. Verify student photos display in list
  4. Click on a student
  5. Verify photo displays in detail modal
  6. Check browser console: Should log `photoUrl`

- [ ] **Admin Portal - Upload Photo for Student**
  1. Login as admin
  2. Go to Users → Select student
  3. Upload photo for student
  4. Verify photo displays immediately
  5. Verify photo visible in Faculty portal

### API Testing
- [ ] **Student Profile Endpoint**
  ```bash
  curl -H "Authorization: Bearer <student-token>" \
    http://localhost:5000/api/students/profile
  ```
  - Should return `personal_info.photoUrl` (camelCase)
  - Should NOT return `personal_info.photo_url`

- [ ] **Admin Users Endpoint**
  ```bash
  curl -H "Authorization: Bearer <admin-token>" \
    http://localhost:5000/api/admin/users
  ```
  - Should return `photoUrl` for each user (camelCase)
  - Should NOT return `profile_photo_url` or `profilePhotoUrl`

- [ ] **Photo Upload Endpoint**
  ```bash
  curl -X POST \
    -H "Authorization: Bearer <student-token>" \
    -F "photo=@test-image.jpg" \
    http://localhost:5000/api/students/upload-photo
  ```
  - Response should contain `photoUrl` (camelCase)
  - Should NOT contain `photo_url`

### Database Testing
- [ ] **Verify Database Column**
  ```sql
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'student_personal_info' 
  AND column_name = 'photo_url';
  ```
  - Should return `photo_url` (snake_case)

- [ ] **Verify Data Integrity**
  ```sql
  SELECT id, student_id, photo_url, photo_public_id 
  FROM student_personal_info 
  WHERE photo_url IS NOT NULL 
  LIMIT 5;
  ```
  - Should show existing photo URLs are intact
  - URLs should start with `https://res.cloudinary.com/`

### Automated Testing
- [ ] **Run Backend Tests**
  ```bash
  cd kys-backend
  npm test
  ```

- [ ] **Run Frontend Tests**
  ```bash
  cd kys-frontend
  npm test
  ```

- [ ] **Run Type Checking**
  ```bash
  cd kys-frontend
  npm run type-check
  ```

## 🔍 Verification Commands

### Check for Legacy Field Names
```bash
# Should return NO results in application code
grep -r "profile_photo_url" kys-backend/controllers/ kys-backend/utils/
grep -r "profilePhotoUrl" kys-frontend/src/modules/admin/

# Should return results ONLY in database layer
grep -r "photo_url" kys-backend/models/ kys-backend/migrations/
```

### Check API Responses
```bash
# Test all three portals
# Student
curl -s -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/students/profile | \
  jq '.data.personal_info | keys'

# Faculty (mentee detail)
curl -s -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/faculty/mentees/1 | \
  jq '.data.personal_info | keys'

# Admin (users list)
curl -s -H "Authorization: Bearer <token>" \
  http://localhost:5000/api/admin/users | \
  jq '.[0] | keys'
```

## 📊 Success Criteria

### ✅ All checks must pass:
1. No TypeScript errors in frontend
2. No ESLint errors related to photo fields
3. All manual tests pass
4. All automated tests pass
5. API responses use `photoUrl` (camelCase)
6. Database uses `photo_url` (snake_case)
7. Photos display correctly in all three portals
8. Photo upload works in all portals
9. No console errors related to photo fields
10. Browser console logs reference `photoUrl` not `photo_url`

## 🚀 Deployment Steps

1. **Pre-deployment**
   - [ ] Run all tests
   - [ ] Verify no TypeScript errors
   - [ ] Test on local environment

2. **Deployment**
   - [ ] Deploy backend changes
   - [ ] Deploy frontend changes
   - [ ] No database migration needed

3. **Post-deployment**
   - [ ] Smoke test all three portals
   - [ ] Verify photo upload works
   - [ ] Check API responses
   - [ ] Monitor error logs

## 🐛 Rollback Plan

If issues occur:

1. **Backend Rollback**
   ```bash
   git revert <commit-hash>
   # Redeploy backend
   ```

2. **Frontend Rollback**
   ```bash
   git revert <commit-hash>
   # Rebuild and redeploy frontend
   ```

3. **No Database Rollback Needed**
   - Database schema unchanged
   - Data remains intact

## 📝 Notes

- **Zero Downtime**: Changes are backward compatible
- **No Data Migration**: Only field name mapping changes
- **Automatic Transformation**: `serializeModel()` handles conversion
- **Type Safe**: TypeScript interfaces updated

## 🎉 Completion

Once all checklist items are complete:
- [ ] Mark this migration as complete
- [ ] Update team documentation
- [ ] Notify team of new naming convention
- [ ] Archive this checklist

---

**Migration Date**: _____________  
**Completed By**: _____________  
**Verified By**: _____________
