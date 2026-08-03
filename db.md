# Database Schema — KYS (Know Your Student)

> Interview-ready explanation of the complete database design, models, associations, and performance indexes.

---

## Overview

यह एक **PostgreSQL** database है जिसे **Sequelize ORM** से manage किया जाता है। Schema एक college mentoring system के लिए design की गई है जहाँ Students और Faculty दोनों एक common `user` table से authenticate होते हैं।

Database में कुल **17 tables** हैं जो student का academic, personal, career, और co-curricular data store करती हैं।

---

## 1. User — Common Authentication Table

**Table:** `user`

यह सबसे central table है। हर person — चाहे Student हो या Faculty — पहले यहाँ register होता है।

| Column          | Type         | Notes                        |
|-----------------|--------------|------------------------------|
| `id`            | INTEGER (PK) | Auto-increment               |
| `username`      | STRING(120)  | Unique, login credential     |
| `email`         | STRING(120)  | Optional                     |
| `password_hash` | STRING(255)  | Bcrypt hashed password       |
| `role`          | STRING(20)   | `'student'` या `'faculty'`  |

**Design Decision:** Role-based single auth table इसलिए use की क्योंकि login logic common है — सिर्फ role अलग है। `role` field से differentiate करते हैं।

---

## 2. Student — Core Student Record

**Table:** `student`

User authenticate होने के बाद student का academic profile यहाँ store होता है।

| Column             | Type         | Notes                              |
|--------------------|--------------|------------------------------------|
| `id`               | INTEGER (PK) | Auto-increment                     |
| `uid`              | STRING(20)   | Unique Student ID (e.g., roll no.) |
| `first_name`       | STRING(120)  |                                    |
| `middle_name`      | STRING(120)  |                                    |
| `last_name`        | STRING(120)  |                                    |
| `semester`         | INTEGER      | Current semester                   |
| `section`          | STRING(10)   | Class section                      |
| `year_of_admission`| INTEGER      |                                    |
| `current_year`     | INTEGER      |                                    |
| `passout_year`     | INTEGER      |                                    |
| `admission_type`   | STRING(20)   | e.g., Direct, Regular              |
| `user_id`          | INTEGER (FK) | → `user.id` — UNIQUE               |
| `mentor_id`        | INTEGER (FK) | → `faculty.id` — assigned mentor   |

**Virtual getter:** `full_name` — `first_name + middle_name + last_name` को combine करता है, DB में store नहीं होता।

---

## 3. StudentPersonalInfo — Personal & Family Details

**Table:** `student_personal_info`

Student का personal information एक separate table में रखा है ताकि `student` table lightweight रहे।

**Key fields:**
- Contact: `mobile_no`, `personal_email`, `college_email`
- Social: `linked_in_id`, `github_id`
- Address: `permanent_address`, `present_address`
- Family: `father_name`, `father_mobile_no`, `father_occupation`, `mother_name`, etc.
- Emergency: `emergency_contact_name`, `emergency_contact_number`
- Identity: `aadhar_number`, `blood_group`, `category`, `dob`, `gender`
- Guardian: `guardian_name`, `guardian_mobile`, `guardian_email`
- MIS: `mis_uid` — college MIS system का ID

### 📸 Photo Fields (Migration se add हुए)

| Column           | Type    | Notes                                    |
|------------------|---------|------------------------------------------|
| `photo_url`      | TEXT    | Cloudinary/S3 public URL of student photo|
| `photo_public_id`| STRING  | Cloud storage का public ID for deletion  |

Photo fields `student_personal_info` table में हैं (student table में नहीं) क्योंकि photo personal data का हिस्सा है। Migration `20260419000000` में `addColumnIfMissing` pattern use किया — idempotent migration है।

---

## 4. Faculty — Faculty Profile

**Table:** `faculty`

| Column           | Type         | Notes          |
|------------------|--------------|----------------|
| `id`             | INTEGER (PK) |                |
| `email`          | STRING(120)  | Unique         |
| `first_name`     | STRING(120)  |                |
| `last_name`      | STRING(120)  |                |
| `contact_number` | STRING(20)   |                |
| `user_id`        | INTEGER (FK) | → `user.id`    |

---

## 5. MentoringMinute — Faculty-Student Meeting Records

**Table:** `mentoring_minute`

Faculty जब किसी student से meeting करता है तो उसके notes यहाँ store होते हैं।

| Column                  | Type         | Notes                                          |
|-------------------------|--------------|------------------------------------------------|
| `id`                    | INTEGER (PK) |                                                |
| `student_id`            | INTEGER (FK) | → `student.id`                                 |
| `faculty_id`            | INTEGER (FK) | → `faculty.id` — nullable (SET NULL on delete) |
| `faculty_name_snapshot` | STRING(255)  | Faculty का naam preserve करता है              |
| `faculty_email_snapshot`| STRING(255)  | Faculty का email preserve करता है             |
| `semester`              | INTEGER      | किस semester की meeting थी                   |
| `date`                  | DATEONLY     |                                                |
| `remarks`               | TEXT         |                                                |
| `suggestion`            | TEXT         |                                                |
| `action`                | TEXT         |                                                |

**Important Design Pattern — Snapshot Fields:**
अगर faculty delete हो जाए, तो `faculty_id` → `NULL` हो जाता है (`SET NULL`) लेकिन `faculty_name_snapshot` और `faculty_email_snapshot` से historical records preserve रहते हैं। यह data integrity का एक smart pattern है।

---

## 6. Profile Sub-Tables (1:1 with Student)

ये tables हर student के लिए एक ही record रखती हैं:

### Skills (`skills`)
- `programming_languages` — TEXT (comma-separated)
- `technologies_frameworks` — TEXT
- `domains_of_interest` — TEXT
- `familiar_tools_platforms` — TEXT

### CareerObjective (`career_objective`)
- `career_goal` — e.g., "Placement", "Higher Studies"
- `specific_details` — TEXT
- `clarity_preparedness` — e.g., "Clear", "Confused"
- `interested_in_campus_placement` — BOOLEAN
- `placement_type`, `higher_studies_type`, `higher_studies_location`
- `non_technical_areas`, `student_mentor_interest`, `expectations_from_institute`

### SWOC (`swoc`)
- `strengths`, `weaknesses`, `opportunities`, `challenges` — सभी TEXT

---

## 7. Academic Records

### PastEducation (`past_education`) — 1:Many
Student के college-से-पहले के records (10th, 12th, Diploma, etc.)
- `exam_name`, `percentage`, `year_of_passing`, `board`, `exam_type`, `exam_score`, `exam_date`

### PostAdmissionAcademicRecord (`post_admission_academic_record`) — 1:Many
College के बाद हर semester का record:
- `semester`, `sgpa`, `backlog_subjects` (TEXT), `backlog_count`, `season`, `year_of_passing`
- `college_rank`, `academic_awards`

---

## 8. Experience & Activities

### Project (`project`) — 1:Many
- `title`, `description`, `project_guide`

### Internship (`internship`) — 1:Many
- `company_name`, `domain`, `internship_type`, `paid_unpaid`
- `start_date`, `end_date`, `designation`, `description`

### CareerActivity (`career_activity`) — 1:Many
Competitive exams, certifications, etc.:
- `activity_name`, `score_rank`, `exam_date`

### CareerDevActivity (`career_dev_activity`) — 1:Many
Career development activities (workshops, seminars):
- `activity`, `score`, `test_date`

---

## 9. Co-Curricular Tables

### CoCurricularParticipation (`co_curricular_participation`) — 1:Many
Events में participation:
- `name`, `date`, `level` (College/State/National), `awards`

### CoCurricularOrganization (`co_curricular_organization`) — 1:Many
Organizations में membership/role:
- `name`, `date`, `level`, `remark`

---

## 10. PasswordResetToken (`password_reset_token`)

Password reset flow के लिए:
- `user_id` (FK), `token`, `created_at`, `expires_at`, `used` (BOOLEAN)

---

## Relationships (Sequelize Associations)

```
user (1) ─────────────────── (1) student          [hasOne / belongsTo]
user (1) ─────────────────── (1) faculty          [hasOne / belongsTo]
user (1) ─────────────────── (N) password_reset_token [hasMany / belongsTo]

faculty (1) ──────────────── (N) student          [hasMany / belongsTo]  ← Mentorship
faculty (1) ──────────────── (N) mentoring_minute [hasMany / belongsTo]

student (1) ─────────────── (1) student_personal_info  [hasOne / belongsTo]
student (1) ─────────────── (1) skills                 [hasOne / belongsTo]
student (1) ─────────────── (1) career_objective       [hasOne / belongsTo]
student (1) ─────────────── (1) swoc                   [hasOne / belongsTo]

student (1) ─────────────── (N) past_education              [hasMany / belongsTo]
student (1) ─────────────── (N) post_admission_academic_record [hasMany / belongsTo]
student (1) ─────────────── (N) project                     [hasMany / belongsTo]
student (1) ─────────────── (N) internship                  [hasMany / belongsTo]
student (1) ─────────────── (N) mentoring_minute            [hasMany / belongsTo]
student (1) ─────────────── (N) career_activity             [hasMany / belongsTo]
student (1) ─────────────── (N) career_dev_activity         [hasMany / belongsTo]
student (1) ─────────────── (N) co_curricular_participation [hasMany / belongsTo]
student (1) ─────────────── (N) co_curricular_organization  [hasMany / belongsTo]
```

### onDelete Behavior

| Relationship                         | onDelete    | Reason                                         |
|--------------------------------------|-------------|------------------------------------------------|
| user → student                       | CASCADE     | User delete हो तो student profile भी जाए      |
| user → faculty                       | CASCADE     | Same reason                                    |
| student → सभी sub-tables             | CASCADE     | Student delete हो तो सारा data clean हो       |
| faculty → mentoring_minute           | SET NULL    | Faculty delete हो तो meeting records बचें     |
| user → password_reset_token          | CASCADE     | User जाए तो tokens भी जाएं                   |

---

## Performance Indexes

### Migration `20260411212813` — Faculty Indexes (Early)

```sql
idx_students_id            ON student(id)
idx_students_mentor_id     ON student(mentor_id)
idx_mentoring_minutes_student_date  ON mentoring_minute(student_id, date)
```

### Migration `20260418000000` — Comprehensive Performance Indexes

| Index Name                          | Table             | Column(s)               | Type          |
|-------------------------------------|-------------------|-------------------------|---------------|
| `idx_student_mentor_id`             | student           | mentor_id               | Partial (NOT NULL) |
| `idx_student_user_id`               | student           | user_id                 | Unique        |
| `idx_faculty_user_id`               | faculty           | user_id                 | Unique        |
| `idx_mentoring_minute_student_date` | mentoring_minute  | (student_id, date)      | Composite     |
| `idx_mentoring_minute_faculty_id`   | mentoring_minute  | faculty_id              | Regular       |
| `idx_student_semester_section`      | student           | (semester, section)     | Composite     |
| `idx_student_year_of_admission`     | student           | year_of_admission       | Regular       |
| `idx_user_username`                 | user              | username                | Regular       |
| `idx_user_role`                     | user              | role                    | Regular       |

**Partial Index Note:** `idx_student_mentor_id` sirf `mentor_id IS NOT NULL` rows index करता है — यह space efficient है क्योंकि unassigned students को index में include नहीं करना।

**Composite Index Note:** `(semester, section)` और `(student_id, date)` composite indexes इसलिए बनाए क्योंकि ये दोनों columns अक्सर साथ WHERE clause में आते हैं।

---

## Interview Summary (Quick Recap)

**Q: Overall schema design क्या है?**

"हमने एक role-based single `user` table बनाई जो authentication handle करती है। Student और Faculty दोनों इससे `user_id` के through link हैं। Student का data multiple tables में split है — academic, personal, career, co-curricular — सब `student_id` FK से जुड़े हैं।"

**Q: 1:1 vs 1:Many कैसे decide किया?**

"जहाँ student के multiple records हो सकते हैं (projects, internships, semesters) वहाँ `hasMany` use किया। जहाँ एक ही record होगा (skills, SWOC, career_objective, personal_info) वहाँ `hasOne` use किया — और उस FK column पर `UNIQUE` constraint लगाया।"

**Q: MentoringMinute में snapshot fields क्यों?**

"अगर कोई faculty resign करे और उसकी entry delete हो, तो `faculty_id → NULL` हो जाएगा (`SET NULL`), लेकिन `faculty_name_snapshot` और `faculty_email_snapshot` के through meeting का historical record preserve रहता है। यह auditing के लिए important है।"

**Q: Photo fields कहाँ हैं और क्यों?**

"`photo_url` और `photo_public_id` — `student_personal_info` table में हैं। `photo_url` Cloudinary/S3 का URL है, `photo_public_id` deletion के लिए cloud reference है। ये personal data के हिस्से हैं इसलिए `student_personal_info` में रखे।"

**Q: Performance के लिए क्या किया?**

"9 targeted indexes add किए — login queries के लिए `username` पर, role filtering के लिए `role` पर, mentorship queries के लिए `mentor_id` पर partial index, और frequently filtered fields `(semester, section)` और `(student_id, date)` पर composite indexes।"
