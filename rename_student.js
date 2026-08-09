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

// FacultyDashboardPage.tsx
replaceInFile('modules/faculty/pages/FacultyDashboardPage.tsx', 'TOTAL STUDENTS', 'TOTAL MENTEES');
replaceInFile('modules/faculty/pages/FacultyDashboardPage.tsx', 'Search & Filter Students', 'Search & Filter Mentees');
replaceInFile('modules/faculty/pages/FacultyDashboardPage.tsx', '>Search students<', '>Search mentees<');
replaceInFile('modules/faculty/pages/FacultyDashboardPage.tsx', 'Search students by name', 'Search mentees by name');
replaceInFile('modules/faculty/pages/FacultyDashboardPage.tsx', 'Students ({', 'Mentees ({');
replaceInFile('modules/faculty/pages/FacultyDashboardPage.tsx', 'STUDENT DETAILS', 'MENTEE DETAILS');
replaceInFile('modules/faculty/pages/FacultyDashboardPage.tsx', 'Student Details', 'Mentee Details');

// FacultyChatbotPage.tsx
replaceInFile('modules/faculty/pages/FacultyChatbotPage.tsx', 'Select Student Context', 'Select Mentee Context');
replaceInFile('modules/faculty/pages/FacultyChatbotPage.tsx', 'Choose a student to', 'Choose a mentee to');
replaceInFile('modules/faculty/pages/FacultyChatbotPage.tsx', 'Search students...', 'Search mentees...');
replaceInFile('modules/faculty/pages/FacultyChatbotPage.tsx', 'No students found', 'No mentees found');

// StudentPreviewModal.tsx
replaceInFile('modules/faculty/components/StudentPreviewModal.tsx', 'title="Student Detail"', 'title="Mentee Detail"');
replaceInFile('modules/faculty/components/StudentPreviewModal.tsx', 'Loading student details...', 'Loading mentee details...');
replaceInFile('modules/faculty/components/StudentPreviewModal.tsx', 'Unable to load student details', 'Unable to load mentee details');
replaceInFile('modules/faculty/components/StudentPreviewModal.tsx', 'Student Detail</title>', 'Mentee Detail</title>');

// FacultyMenteesPage.tsx
replaceInFile('modules/faculty/pages/FacultyMenteesPage.tsx', 'Students assigned to you as mentor', 'Mentees assigned to you as mentor');

// FacultyMenteeDetailPage.tsx
replaceInFile('modules/faculty/pages/FacultyMenteeDetailPage.tsx', 'records found for this student yet', 'records found for this mentee yet');
replaceInFile('modules/faculty/pages/FacultyMenteeDetailPage.tsx', 'comments about the student', 'comments about the mentee');

// Routes
replaceInFile('app/router/faculty.routes.tsx', 'Loading student details...', 'Loading mentee details...');

console.log('Student to Mentee replacements done.');
