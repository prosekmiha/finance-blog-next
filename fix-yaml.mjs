import fs from 'fs';
import path from 'path';

const dir = 'd:/Projects/finance-blog-next/content/articles';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

let fixed = 0;
const errors = [];

for (const file of files) {
  const fp = path.join(dir, file);
  const raw = fs.readFileSync(fp, 'utf-8');

  // Normalize CRLF to LF first
  const normalized = raw.replace(/\r\n/g, '\n');

  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) { errors.push(file); continue; }

  let fm = match[1];
  const content = match[2];
  let changed = false;

  function fixField(fieldName) {
    const re = new RegExp(`^(${fieldName}: )(.+)$`, 'm');
    fm = fm.replace(re, (line, prefix, val) => {
      val = val.trim();
      // already quoted
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) return line;
      // needs quoting if contains em-dash or colon-space (yaml special)
      if (val.includes('\u2014') || val.includes(': ') || val.includes('"')) {
        const cleaned = val.replace(/\u2014/g, '-').replace(/"/g, '\\"');
        changed = true;
        return `${prefix}"${cleaned}"`;
      }
      return line;
    });
  }

  fixField('title');
  fixField('description');

  // Fix invalid category Real Estate
  if (fm.includes('category: Real Estate')) {
    const filename = file;
    if (filename.includes('mortgage') || filename.includes('renting') || filename.includes('house') || filename.includes('home-equity')) {
      fm = fm.replace('category: Real Estate', 'category: Housing');
    } else {
      fm = fm.replace('category: Real Estate', 'category: Investing');
    }
    changed = true;
  }

  if (changed) {
    // Write back with LF (not CRLF)
    fs.writeFileSync(fp, '---\n' + fm + '\n---\n' + content);
    fixed++;
  }
}

console.log(`Fixed: ${fixed} files`);
if (errors.length) console.log('Parse errors:', errors.length, errors.slice(0, 5));
