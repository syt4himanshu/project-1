const fs = require('fs');
const path = require('path');

const p = (fp) => path.join('d:/All projects and Websites/KYS-final/project-1/kys-frontend/src', fp);

function replaceInFile(fp, searchValue, replaceValue) {
  const fullPath = p(fp);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(searchValue, replaceValue);
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${fp}`);
  } else {
    console.log(`Not found ${fp}`);
  }
}

// 1. Step8CareerSkills.tsx
let step8Content = fs.readFileSync(p('modules/student/components/wizard/Step8CareerSkills.tsx'), 'utf8');
step8Content = step8Content.replace(/'Additional Technical Skills'/g, "'Additional Technical Skills You Want To Acquire'");
step8Content = step8Content.replace(/'Additional Soft Skills'/g, "'Additional Soft Skills You Want To Acquire'");
fs.writeFileSync(p('modules/student/components/wizard/Step8CareerSkills.tsx'), step8Content);

// 2. StudentDetailModal.tsx
let detailContent = fs.readFileSync(p('modules/admin/components/students/StudentDetailModal.tsx'), 'utf8');
detailContent = detailContent.replace(/'Additional Technical Skills'/g, "'Additional Technical Skills You Want To Acquire'");
detailContent = detailContent.replace(/'Additional Soft Skills'/g, "'Additional Soft Skills You Want To Acquire'");
fs.writeFileSync(p('modules/admin/components/students/StudentDetailModal.tsx'), detailContent);

// 3. StudentPreviewModal.tsx
let previewContent = fs.readFileSync(p('modules/faculty/components/StudentPreviewModal.tsx'), 'utf8');
previewContent = previewContent.replace(/'Additional Technical Skills'/g, "'Additional Technical Skills You Want To Acquire'");
previewContent = previewContent.replace(/'Additional Soft Skills'/g, "'Additional Soft Skills You Want To Acquire'");
fs.writeFileSync(p('modules/faculty/components/StudentPreviewModal.tsx'), previewContent);

console.log('Labels updated.');
