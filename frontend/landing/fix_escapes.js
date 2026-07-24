const fs = require('fs');

function fixFile(file) {
    let s = fs.readFileSync(file, 'utf8');
    s = s.replace(/\\`/g, '`');
    s = s.replace(/\\\$/g, '$');
    fs.writeFileSync(file, s);
    console.log('Fixed', file);
}

fixFile('js/blog.js');
fixFile('js/blog-artigo.js');
