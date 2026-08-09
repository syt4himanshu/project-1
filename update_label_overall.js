const fs = require('fs');
const path = require('path');

const p = (fp) => path.join('d:/All projects and Websites/KYS-final/project-1/kys-frontend/src', fp);

// 1. Step8CareerSkills.tsx
let step8Content = fs.readFileSync(p('modules/student/components/wizard/Step8CareerSkills.tsx'), 'utf8');
step8Content = step8Content.replace(/'Technical & Soft Skills \(Overall\)'/g, "'List Your Technical & Soft Skills'");
fs.writeFileSync(p('modules/student/components/wizard/Step8CareerSkills.tsx'), step8Content);

// 2. StudentDetailModal.tsx
let detailContent = fs.readFileSync(p('modules/admin/components/students/StudentDetailModal.tsx'), 'utf8');
detailContent = detailContent.replace(/'Technical & Soft Skills \(Overall\)'/g, "'List Your Technical & Soft Skills'");
fs.writeFileSync(p('modules/admin/components/students/StudentDetailModal.tsx'), detailContent);

// 3. StudentPreviewModal.tsx
let previewContent = fs.readFileSync(p('modules/faculty/components/StudentPreviewModal.tsx'), 'utf8');
previewContent = previewContent.replace(/'Technical & Soft Skills \(Overall\)'/g, "'List Your Technical & Soft Skills'");
fs.writeFileSync(p('modules/faculty/components/StudentPreviewModal.tsx'), previewContent);

console.log('Overall Skills label updated.');
