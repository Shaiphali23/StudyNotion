const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'components'));
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace import Name from "...assets/Path" with const Name = "/assets/Path"
  const regex = /import\s+([a-zA-Z0-9_]+)\s+from\s+["'].*?\/assets\/(.*?)["'];?/g;
  if (content.match(regex)) {
    content = content.replace(regex, 'const $1 = "/assets/$2";');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated assets in ${file}`);
  }
});
