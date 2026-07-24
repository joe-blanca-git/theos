const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/joeder-blanca/Documents/projetos-joe/git/theos/frontend/landing';
const oldScript = `<script>document.write('<base href="' + (window.location.pathname.startsWith('/theos') ? '/theos/' : '/') + '" />');</script>`;
const newScript = `<script>document.write('<base href="' + (window.location.pathname.startsWith('/theos') ? '/theos/' : './') + '" />');</script>`;

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.html')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes(oldScript)) {
        content = content.replace(oldScript, newScript);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file} with correct local base ./`);
    } else if (!content.includes('window.location.pathname.startsWith')) {
        // Fallback if somehow it doesn't match exactly
        content = content.replace(/<base[^>]*>/i, newScript);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Forced ${file} with correct local base ./`);
    }
  }
});
