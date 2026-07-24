const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/joeder-blanca/Documents/projetos-joe/git/theos/frontend/landing';

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.html')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace <base href="/theos/"> with <base href="./">
    if (content.includes('<base href="/theos/">')) {
      content = content.replace(/<base href="\/theos\/">/g, '<base href="./">');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
});
