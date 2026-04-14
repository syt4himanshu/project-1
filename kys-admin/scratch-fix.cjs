const fs = require('fs');
let code = fs.readFileSync('src/lib/api.ts', 'utf8');

const regex = /if \(res\.status === 401\) \{\s*localStorage\.clear\(\)\s*window\.location\.href = '\/login'\s*throw new Error\('Unauthorized'\)\s*\}/g;

code = code.replace(regex, `if (res.status === 401) {
        if (!path.includes('/login')) {
            localStorage.clear()
            window.location.href = '/login'
        }
        throw new Error('Invalid Credentials')
    }`);

fs.writeFileSync('src/lib/api.ts', code);
console.log('Fixed API api.ts');
