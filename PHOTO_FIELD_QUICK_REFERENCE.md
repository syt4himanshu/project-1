# Photo Field Quick Reference

## ✅ STANDARDIZED NAMING

| Layer | Field Name | Convention | Example |
|-------|-----------|------------|---------|
| **Database** | `photo_url` | snake_case | `SELECT photo_url FROM student_personal_info` |
| **Backend API** | `photoUrl` | camelCase | `{ photoUrl: "https://..." }` |
| **Frontend** | `photoUrl` | camelCase | `personal_info.photoUrl` |

## 🔄 Automatic Transformation

The transformation happens automatically in `kys-backend/utils/helpers.js`:

```javascript
const serializeModel = (obj) => {
  // ... existing code ...
  
  // Transform photo_url to photoUrl for API consistency
  if ('photo_url' in data) {
    data.photoUrl = data.photo_url;
    delete data.photo_url;
  }
  
  return data;
};
```

## 📝 Usage Examples

### Backend - Reading from Database
```javascript
// Database returns snake_case
const student = await Student.findOne({
  include: [{ model: StudentPersonalInfo, as: 'personal_info' }]
});

console.log(student.personal_info.photo_url); // ✅ Direct DB access: photo_url

// Serialize for API response (automatic transformation)
const serialized = serializeModel(student.personal_info);
console.log(serialized.photoUrl); // ✅ API response: photoUrl
```

### Backend - Saving to Database
```javascript
// Always use snake_case when writing to DB
student.personal_info.photo_url = uploadResult.secure_url;
await student.personal_info.save();
```

### Backend - API Response
```javascript
// serializeModel automatically converts to camelCase
return sendResponse(res, {
  success: true,
  data: {
    personal_info: serializeModel(student.personal_info) // Contains photoUrl
  }
});
```

### Frontend - Accessing Photo URL
```javascript
// Always use camelCase
import { extractStudentPhotoUrl } from '@/shared/utils/studentPhoto';

// Option 1: Direct access
const photoUrl = student.personal_info?.photoUrl;

// Option 2: Using utility (recommended)
const photoUrl = extractStudentPhotoUrl(student);

// Option 3: Rendering
<PhotoAvatar url={photoUrl} alt="Student" />
```

### Frontend - TypeScript Types
```typescript
interface StudentPersonalInfo {
  photoUrl?: string;  // ✅ Use camelCase
  photo_public_id?: string;
  // ... other fields
}

interface AdminUser {
  photoUrl: string | null;  // ✅ Use camelCase (not profilePhotoUrl)
  // ... other fields
}
```

## ❌ DON'T USE (Legacy Names)

These field names are **deprecated** and should not be used:

- ❌ `profile_photo_url`
- ❌ `profilePhotoUrl` (in admin context - use `photoUrl` instead)
- ❌ `profile_photo`

## 🔍 Finding Photo URLs in Code

### Backend
```javascript
// ✅ Correct
const photoUrl = serializeModel(personalInfo).photoUrl;

// ❌ Wrong
const photoUrl = personalInfo.photo_url; // Don't use in API responses
```

### Frontend
```typescript
// ✅ Correct
const photoUrl = student.personal_info?.photoUrl;

// ❌ Wrong
const photoUrl = student.personal_info?.photo_url;
const photoUrl = student.profilePhotoUrl;
```

## 🧪 Testing

### Check API Response
```bash
# Should return photoUrl (camelCase)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/students/profile | jq '.data.personal_info.photoUrl'
```

### Check Database
```sql
-- Should use photo_url (snake_case)
SELECT photo_url FROM student_personal_info WHERE student_id = 1;
```

## 🐛 Troubleshooting

### Photo not displaying?
1. Check API response: `console.log(student.personal_info?.photoUrl)`
2. Check if URL is valid: Should start with `https://res.cloudinary.com/`
3. Check browser console for errors
4. Verify `extractStudentPhotoUrl()` is used correctly

### Getting undefined?
```javascript
// ❌ Wrong field name
student.personal_info?.photo_url  // undefined

// ✅ Correct field name
student.personal_info?.photoUrl   // "https://..."
```

### TypeScript errors?
Make sure your interfaces use `photoUrl` (camelCase):
```typescript
interface PersonalInfo {
  photoUrl?: string;  // ✅ Correct
  // photo_url?: string;  // ❌ Wrong
}
```

## 📚 Related Files

- **Transformation Logic**: `kys-backend/utils/helpers.js` → `serializeModel()`
- **Utility Function**: `kys-frontend/src/shared/utils/studentPhoto.ts` → `extractStudentPhotoUrl()`
- **Database Model**: `kys-backend/models/StudentPersonalInfo.js`
- **Upload Handler**: `kys-backend/utils/studentPhotoUpload.js`

## 🎯 Key Takeaway

**One simple rule:**
- Database layer: `photo_url` (snake_case)
- Everything else: `photoUrl` (camelCase)

The transformation happens automatically in `serializeModel()` - you don't need to do anything special!
