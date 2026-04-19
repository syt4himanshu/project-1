# Photo Field Architecture - Standardization

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PHOTO FIELD FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  1. DATABASE LAYER (PostgreSQL)                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                       │
│  Table: student_personal_info                                        │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ Column Name: photo_url (snake_case)                     │       │
│  │ Data Type: TEXT                                          │       │
│  │ Example: "https://res.cloudinary.com/demo/stu123.jpg"   │       │
│  └─────────────────────────────────────────────────────────┘       │
│                                                                       │
│  ✅ Convention: PostgreSQL standard (snake_case)                    │
│  ✅ No changes needed                                               │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Sequelize ORM
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. SEQUELIZE MODEL LAYER                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                       │
│  Model: StudentPersonalInfo                                          │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ photo_url: { type: DataTypes.TEXT, allowNull: true }    │       │
│  └─────────────────────────────────────────────────────────┘       │
│                                                                       │
│  Instance:                                                           │
│  {                                                                   │
│    id: 1,                                                            │
│    student_id: 123,                                                  │
│    photo_url: "https://res.cloudinary.com/...",                     │
│    photo_public_id: "students/abc123"                               │
│  }                                                                   │
│                                                                       │
│  ✅ Convention: Matches database (snake_case)                       │
│  ✅ No changes needed                                               │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ serializeModel()
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. TRANSFORMATION LAYER                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                       │
│  File: kys-backend/utils/helpers.js                                 │
│  Function: serializeModel()                                          │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ const serializeModel = (obj) => {                       │       │
│  │   const data = obj.get({ plain: true });               │       │
│  │                                                          │       │
│  │   // 🔄 TRANSFORMATION HAPPENS HERE                     │       │
│  │   if ('photo_url' in data) {                            │       │
│  │     data.photoUrl = data.photo_url;  // Create camelCase│       │
│  │     delete data.photo_url;           // Remove snake_case│      │
│  │   }                                                      │       │
│  │                                                          │       │
│  │   return data;                                           │       │
│  │ }                                                        │       │
│  └─────────────────────────────────────────────────────────┘       │
│                                                                       │
│  Input:  { photo_url: "https://..." }                               │
│  Output: { photoUrl: "https://..." }                                │
│                                                                       │
│  ✅ Automatic transformation                                        │
│  ✅ Single point of conversion                                      │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ API Response
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  4. API RESPONSE LAYER (Express.js)                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                       │
│  Endpoints:                                                          │
│  • GET /api/students/profile                                        │
│  • GET /api/faculty/mentees/:id                                     │
│  • GET /api/admin/users                                             │
│                                                                       │
│  Response Format:                                                    │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ {                                                        │       │
│  │   "success": true,                                       │       │
│  │   "data": {                                              │       │
│  │     "full_name": "John Doe",                             │       │
│  │     "personal_info": {                                   │       │
│  │       "photoUrl": "https://res.cloudinary.com/...",     │       │
│  │       "photo_public_id": "students/abc123",             │       │
│  │       "mobile_no": "9876543210"                          │       │
│  │     }                                                     │       │
│  │   }                                                       │       │
│  │ }                                                         │       │
│  └─────────────────────────────────────────────────────────┘       │
│                                                                       │
│  ✅ Convention: JavaScript standard (camelCase)                     │
│  ✅ Consistent across all endpoints                                 │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/JSON
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  5. FRONTEND LAYER (React/TypeScript)                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                       │
│  TypeScript Interface:                                               │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ interface StudentPersonalInfo {                          │       │
│  │   photoUrl?: string;        // ✅ camelCase              │       │
│  │   photo_public_id?: string;                              │       │
│  │   mobile_no?: string;                                    │       │
│  │ }                                                         │       │
│  └─────────────────────────────────────────────────────────┘       │
│                                                                       │
│  Usage:                                                              │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ const photoUrl = student.personal_info?.photoUrl;        │       │
│  │                                                           │       │
│  │ <PhotoAvatar                                             │       │
│  │   url={photoUrl}                                         │       │
│  │   alt="Student Photo"                                    │       │
│  │ />                                                        │       │
│  └─────────────────────────────────────────────────────────┘       │
│                                                                       │
│  Utility Function:                                                   │
│  ┌─────────────────────────────────────────────────────────┐       │
│  │ // src/shared/utils/studentPhoto.ts                      │       │
│  │ export function extractStudentPhotoUrl(value: unknown) { │       │
│  │   const record = asRecord(value);                        │       │
│  │   const personalInfo = asRecord(record.personal_info);   │       │
│  │                                                           │       │
│  │   return firstNonEmptyString(                            │       │
│  │     personalInfo.photoUrl,  // ✅ Check camelCase only   │       │
│  │     record.photoUrl         // ✅ Fallback               │       │
│  │   );                                                      │       │
│  │ }                                                         │       │
│  └─────────────────────────────────────────────────────────┘       │
│                                                                       │
│  ✅ Convention: TypeScript/React standard (camelCase)               │
│  ✅ Type-safe access                                                │
└─────────────────────────────────────────────────────────────────────┘
```

## Portal-Specific Usage

### Student Portal
```typescript
// Dashboard.tsx
interface StudentProfile {
  full_name?: string;
  personal_info?: {
    photoUrl?: string;  // ✅ camelCase
  };
}

const photoUrl = extractStudentPhotoUrl(profile);
<PhotoAvatar url={photoUrl} alt="Profile" />
```

### Faculty Portal
```typescript
// FacultyMenteeDetailPage.tsx
const studentPhotoUrl = useMemo(
  () => extractStudentPhotoUrl(student),
  [student]
);

<PhotoAvatar url={studentPhotoUrl} alt={`${student.name} profile`} />
```

### Admin Portal
```typescript
// AdminUsersPage.tsx
interface AdminUser {
  photoUrl: string | null;  // ✅ camelCase (not profilePhotoUrl)
}

<PhotoAvatar url={resolveImageUrl(row.photoUrl)} alt={`${row.name} profile`} />
```

## Data Flow Diagram

```
┌──────────────┐
│   Upload     │
│   Photo      │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────────────┐
│ POST /api/students/upload-photo                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │ 1. Receive file                                  │ │
│ │ 2. Upload to Cloudinary                          │ │
│ │ 3. Get secure_url                                │ │
│ │ 4. Save to DB: photo_url (snake_case)            │ │
│ │ 5. Return response: photoUrl (camelCase)         │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│ Database Write                                       │
│ ┌──────────────────────────────────────────────────┐ │
│ │ UPDATE student_personal_info                     │ │
│ │ SET photo_url = 'https://res.cloudinary.com/...' │ │
│ │ WHERE student_id = 123;                          │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│ API Response                                         │
│ ┌──────────────────────────────────────────────────┐ │
│ │ {                                                │ │
│ │   "success": true,                               │ │
│ │   "data": {                                      │ │
│ │     "photoUrl": "https://res.cloudinary.com/..." │ │
│ │   }                                              │ │
│ │ }                                                │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│ Frontend Update                                      │
│ ┌──────────────────────────────────────────────────┐ │
│ │ setState({ photoUrl: response.data.photoUrl })   │ │
│ │ <img src={photoUrl} />                           │ │
│ └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

## Comparison: Before vs After

### ❌ BEFORE (Inconsistent)

```
Database:     photo_url
Model:        photo_url
API:          photo_url, profile_photo_url, profilePhotoUrl  ❌ INCONSISTENT
Frontend:     photo_url, profile_photo_url, profilePhotoUrl  ❌ INCONSISTENT
```

### ✅ AFTER (Standardized)

```
Database:     photo_url          (snake_case - PostgreSQL convention)
Model:        photo_url          (snake_case - matches database)
Transform:    photo_url → photoUrl  (automatic in serializeModel)
API:          photoUrl            (camelCase - JavaScript convention)
Frontend:     photoUrl            (camelCase - TypeScript convention)
```

## Key Benefits

1. **Single Source of Truth**
   - Database: `photo_url`
   - API/Frontend: `photoUrl`
   - Clear boundary at transformation layer

2. **Automatic Conversion**
   - No manual mapping needed
   - `serializeModel()` handles everything
   - Consistent across all endpoints

3. **Type Safety**
   - TypeScript interfaces enforce `photoUrl`
   - Compile-time errors for wrong field names
   - IDE autocomplete works correctly

4. **Maintainability**
   - One place to change: `serializeModel()`
   - Easy to understand data flow
   - Clear documentation

5. **Convention Compliance**
   - Database follows PostgreSQL standards
   - API follows JavaScript standards
   - Frontend follows TypeScript/React standards

## Testing Strategy

```
┌─────────────────────────────────────────────────────┐
│ Test Layer 1: Database                              │
│ ✓ Column name is photo_url (snake_case)            │
│ ✓ Data type is TEXT                                │
│ ✓ Can store Cloudinary URLs                        │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│ Test Layer 2: Transformation                        │
│ ✓ serializeModel converts photo_url → photoUrl     │
│ ✓ Original photo_url is removed                    │
│ ✓ photoUrl contains correct value                  │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│ Test Layer 3: API Response                          │
│ ✓ Response contains photoUrl (camelCase)           │
│ ✓ Response does NOT contain photo_url              │
│ ✓ All endpoints return consistent format           │
└─────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│ Test Layer 4: Frontend                              │
│ ✓ TypeScript compiles without errors               │
│ ✓ extractStudentPhotoUrl returns correct value     │
│ ✓ Photos display in all portals                    │
└─────────────────────────────────────────────────────┘
```

## Rollout Strategy

```
Phase 1: Backend Changes
├── Update serializeModel() transformation
├── Update controllers to use photoUrl
└── Update test files

Phase 2: Frontend Changes
├── Update TypeScript interfaces
├── Update utility functions
├── Update components
└── Update tests

Phase 3: Verification
├── Run automated tests
├── Manual testing in all portals
├── API response validation
└── Database integrity check

Phase 4: Deployment
├── Deploy backend
├── Deploy frontend
└── Monitor for issues
```

## Success Metrics

- ✅ Zero TypeScript errors
- ✅ Zero runtime errors
- ✅ All tests passing
- ✅ Photos display correctly in all portals
- ✅ API responses use consistent field names
- ✅ Database integrity maintained
- ✅ No performance degradation
