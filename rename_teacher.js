const fs = require('fs');
const path = require('path');

const srcDir = path.join('d:/All projects and Websites/KYS-final/project-1/kys-frontend/src');

function replaceInFile(relativePath, searchStr, replaceStr) {
    const filePath = path.join(srcDir, relativePath);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.split(searchStr).join(replaceStr);
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${relativePath}`);
    }
}

// Faculty Module
replaceInFile('modules/faculty/pages/FacultyChatbotPage.tsx', 'Teacher Insights Chatbot', 'Mentor Insights Chatbot');
replaceInFile('modules/faculty/pages/FacultyDashboardPage.tsx', 'Teacher Dashboard', 'Mentor Dashboard');

// Admin Module (Teachers Management -> Mentors Management)
replaceInFile('modules/admin/pages/AdminDashboardPage.tsx', 'users, teachers, and students.', 'users, mentors, and students.');
replaceInFile('modules/admin/pages/AdminTeachersPage.tsx', 'document.title = \'Teachers Management - KYS\'', 'document.title = \'Mentors Management - KYS\'');
replaceInFile('modules/admin/pages/AdminTeachersPage.tsx', '<h3 className="admin-page__title">Teachers Management</h3>', '<h3 className="admin-page__title">Mentors Management</h3>');
replaceInFile('modules/admin/pages/AdminTeachersPage.tsx', 'title="Unable to load teacher records"', 'title="Unable to load mentor records"');
replaceInFile('modules/admin/pages/AdminTeachersPage.tsx', 'All teachers', 'All mentors');
replaceInFile('modules/admin/pages/AdminTeachersPage.tsx', 'No teachers matched the current search.', 'No mentors matched the current search.');

// Admin Stats
replaceInFile('modules/admin/components/AdminStatsGrid.tsx', "label: 'Teachers'", "label: 'Mentors'");

// Role Selection
replaceInFile('modules/role-selection/routes.tsx', "title: 'Teacher'", "title: 'Mentor'");

// Teacher Detail Modal (Visible texts)
replaceInFile('modules/admin/components/teachers/TeacherDetailModal.tsx', 'Loading teacher profile', 'Loading mentor profile');
replaceInFile('modules/admin/components/teachers/TeacherDetailModal.tsx', 'Unable to load teacher detail', 'Unable to load mentor detail');
replaceInFile('modules/admin/components/teachers/TeacherDetailModal.tsx', 'No students assigned to this teacher.', 'No students assigned to this mentor.');
replaceInFile('modules/admin/components/teachers/TeacherDetailModal.tsx', 'title="Teacher Detail"', 'title="Mentor Detail"');
replaceInFile('modules/admin/components/teachers/TeacherDetailModal.tsx', "Loading teacher details...", "Loading mentor details...");
replaceInFile('modules/admin/components/teachers/TeacherDetailModal.tsx', 'teacher-detail.pdf', 'mentor-detail.pdf');

console.log('Teacher to Mentor renaming completed for visible UI text.');
