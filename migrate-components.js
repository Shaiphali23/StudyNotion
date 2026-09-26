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

  // Add "use client" if it has hooks or interactive elements
  if (!content.includes('"use client"') && !content.includes("'use client'")) {
    if (content.match(/use(State|Effect|Context|Ref|Reducer|Memo|Callback|Selector|Dispatch|Location|Navigate|Pathname|Router)/) || content.includes('onClick') || content.includes('onChange') || content.includes('onSubmit')) {
      content = '"use client";\n' + content;
      changed = true;
    }
  }

  // Replace react-router-dom Link with next/link
  if (content.includes('react-router-dom')) {
    content = content.replace(/import\s+{([^}]*)}\s+from\s+['"]react-router-dom['"];?/g, (match, imports) => {
      let newImports = [];
      if (imports.includes('Link')) {
        newImports.push(`import Link from "next/link";`);
      }
      if (imports.includes('useLocation')) {
        newImports.push(`import { usePathname } from "next/navigation";`);
      }
      if (imports.includes('useNavigate')) {
        newImports.push(`import { useRouter } from "next/navigation";`);
      }
      return newImports.join('\n');
    });

    // Replace to= with href= for Links
    content = content.replace(/<Link\s+([^>]*?)to=/g, '<Link $1href=');

    // Replace useLocation() with usePathname()
    content = content.replace(/const\s+(\w+)\s*=\s*useLocation\(\)/g, 'const $1 = usePathname()');
    content = content.replace(/useLocation\(\)/g, 'usePathname()');
    
    // Replace useNavigate() with useRouter()
    content = content.replace(/const\s+(\w+)\s*=\s*useNavigate\(\)/g, 'const $1 = useRouter()');
    content = content.replace(/useNavigate\(\)/g, 'useRouter()');

    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
