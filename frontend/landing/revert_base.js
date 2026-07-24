const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/joeder-blanca/Documents/projetos-joe/git/theos/frontend/landing';

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.html')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace <base href="./"> with <base href="/theos/">
    if (content.includes('<base href="./">')) {
      content = content.replace(/<base href="\.\/">/g, '<base href="/theos/">');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Reverted ${file}`);
    }
  }
});
