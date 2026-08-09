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

// ChatInput.tsx
replaceInFile('modules/faculty/chatbot/components/ChatInput.tsx', 'Select a student to begin generating', 'Select a mentee to begin generating');
replaceInFile('modules/faculty/chatbot/components/ChatInput.tsx', 'Select a student to begin...', 'Select a mentee to begin...');

// StudentSelector.tsx
replaceInFile('modules/faculty/chatbot/components/StudentSelector.tsx', '>Student selection<', '>Mentee selection<');
replaceInFile('modules/faculty/chatbot/components/StudentSelector.tsx', 'No student matches your search.', 'No mentee matches your search.');

// chatFormatters.ts
replaceInFile('modules/faculty/chatbot/utils/chatFormatters.ts', 'Student: ${student.full_name}', 'Mentee: ${student.full_name}');
replaceInFile('modules/faculty/chatbot/utils/chatFormatters.ts', "No student selected", "No mentee selected");

// StudentPreviewModal.tsx
replaceInFile('modules/faculty/components/StudentPreviewModal.tsx', 'Loading student profile', 'Loading mentee profile');
replaceInFile('modules/faculty/components/StudentPreviewModal.tsx', 'Fetching latest student record...', 'Fetching latest mentee record...');

// FacultyChatbotPage.tsx
replaceInFile('modules/faculty/pages/FacultyChatbotPage.tsx', '>Student Context<', '>Mentee Context<');
replaceInFile('modules/faculty/pages/FacultyChatbotPage.tsx', 'structured student insights.', 'structured mentee insights.');

// FacultyMenteeDetailPage.tsx
replaceInFile('modules/faculty/pages/FacultyMenteeDetailPage.tsx', 'Fetching student data', 'Fetching mentee data');
replaceInFile('modules/faculty/pages/FacultyMenteeDetailPage.tsx', 'Manage student mentoring records', 'Manage mentee mentoring records');
replaceInFile('modules/faculty/pages/FacultyMenteeDetailPage.tsx', 'Invalid student route', 'Invalid mentee route');
replaceInFile('modules/faculty/pages/FacultyMenteeDetailPage.tsx', 'Student UID is missing.', 'Mentee UID is missing.');

// facultyChatSlice.ts
replaceInFile('modules/faculty/store/facultyChatSlice.ts', "Analyzing student profile...", "Analyzing mentee profile...");

console.log('Second pass of Student to Mentee replacements done.');
