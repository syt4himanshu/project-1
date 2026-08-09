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

// 1. studentProfileSchema.ts
let schemaContent = fs.readFileSync(p('modules/student/validation/studentProfileSchema.ts'), 'utf8');
schemaContent = schemaContent.replace(/technologies_frameworks: text500,/g, 'technologies_frameworks: text500,\n    frontend_technologies_frameworks: text500,\n    backend_technologies_databases: text500,');
fs.writeFileSync(p('modules/student/validation/studentProfileSchema.ts'), schemaContent);

// 2. Step8CareerSkills.tsx
let step8Content = fs.readFileSync(p('modules/student/components/wizard/Step8CareerSkills.tsx'), 'utf8');
step8Content = step8Content.replace(
  /{field\('Technologies & Frameworks', \([\s\S]*?className={textareaCls}\s*\/>\s*\)\)}/g,
  `{field('Frontend technologies & frameworks', (
                        <textarea
                            value={(sk.frontend_technologies_frameworks as string) || ''}
                            onChange={e => updSk('frontend_technologies_frameworks', e.target.value)}
                            rows={3}
                            placeholder='e.g. HTML, CSS, ReactJS'
                            className={textareaCls}
                        />
                    ))}

                    {field('Backend technologies & Databases', (
                        <textarea
                            value={(sk.backend_technologies_databases as string) || ''}
                            onChange={e => updSk('backend_technologies_databases', e.target.value)}
                            rows={3}
                            placeholder='e.g. Node.js, Express, MongoDB, MySQL'
                            className={textareaCls}
                        />
                    ))}`
);
fs.writeFileSync(p('modules/student/components/wizard/Step8CareerSkills.tsx'), step8Content);

// 3. Step9CareerSkills.tsx
let step9Content = fs.readFileSync(p('modules/student/components/wizard/Step9CareerSkills.tsx'), 'utf8');
step9Content = step9Content.replace(
  /{field\('Technologies & Frameworks', input\('text', \(sk\.technologies_frameworks as string\) \|\| '', v => updSk\('technologies_frameworks', v\), 'React, Node\.js'\)\)}/g,
  `{field('Frontend technologies & frameworks', input('text', (sk.frontend_technologies_frameworks as string) || '', v => updSk('frontend_technologies_frameworks', v), 'React, Vue, HTML, CSS'))}
                    {field('Backend technologies & Databases', input('text', (sk.backend_technologies_databases as string) || '', v => updSk('backend_technologies_databases', v), 'Node.js, Python, PostgreSQL'))}`
);
fs.writeFileSync(p('modules/student/components/wizard/Step9CareerSkills.tsx'), step9Content);

// 4. Step9ReviewSubmit.tsx
let step9RevContent = fs.readFileSync(p('modules/student/components/wizard/Step9ReviewSubmit.tsx'), 'utf8');
step9RevContent = step9RevContent.replace(
  /<Row label='Technologies & Frameworks' value={sk\.technologies_frameworks} \/>/g,
  `<Row label='Frontend technologies & frameworks' value={sk.frontend_technologies_frameworks} />
                        <Row label='Backend technologies & Databases' value={sk.backend_technologies_databases} />`
);
fs.writeFileSync(p('modules/student/components/wizard/Step9ReviewSubmit.tsx'), step9RevContent);

// 5. StudentDetailModal.tsx
let detailContent = fs.readFileSync(p('modules/admin/components/students/StudentDetailModal.tsx'), 'utf8');
detailContent = detailContent.replace(
  /{ label: 'Technologies & Frameworks', value: showValue\(skills\.technologies \?\? skills\.technologies_frameworks\) },/g,
  `{ label: 'Frontend technologies & frameworks', value: showValue(skills.frontend_technologies_frameworks) },
                { label: 'Backend technologies & Databases', value: showValue(skills.backend_technologies_databases) },`
);
fs.writeFileSync(p('modules/admin/components/students/StudentDetailModal.tsx'), detailContent);

// 6. StudentPreviewModal.tsx
let previewContent = fs.readFileSync(p('modules/faculty/components/StudentPreviewModal.tsx'), 'utf8');
previewContent = previewContent.replace(
  /{ label: 'Technologies & Frameworks', value: showValue\(skills\.technologies \?\? skills\.technologies_frameworks\) },/g,
  `{ label: 'Frontend technologies & frameworks', value: showValue(skills.frontend_technologies_frameworks) },
    { label: 'Backend technologies & Databases', value: showValue(skills.backend_technologies_databases) },`
);
fs.writeFileSync(p('modules/faculty/components/StudentPreviewModal.tsx'), previewContent);

console.log('All frontend files updated.');
