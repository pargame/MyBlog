#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const out = [];
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listMarkdownFiles(p));
    else if (e.isFile() && p.toLowerCase().endsWith('.md')) out.push(p);
  }
  return out;
}

function hasFrontMatter(raw) {
  return raw.startsWith('---');
}

function addEmptyFrontMatter(file, apply) {
  const raw = fs.readFileSync(file, 'utf8');
  if (hasFrontMatter(raw)) return false;
  const newContent = `---\n---\n\n` + raw;
  if (apply) fs.writeFileSync(file, newContent, 'utf8');
  return true;
}

function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const roots = [path.resolve(__dirname, '..', 'posts'), path.resolve(__dirname, '..', 'docs')];
  const files = roots.flatMap(r => listMarkdownFiles(r));
  const modified = [];
  for (const f of files) {
    try {
      const changed = addEmptyFrontMatter(f, apply);
      if (changed) modified.push(f);
    } catch (e) {
      console.error('error', f, e.message);
    }
  }
  if (modified.length === 0) {
    console.log('No files without frontmatter found.');
  } else {
    console.log((apply ? 'Added' : 'Would add') + ' empty frontmatter to ' + modified.length + ' files:');
    for (const m of modified) console.log(' -', m);
  }
  if (!apply) console.log('\nRun with `node scripts/add-empty-frontmatter.js --apply` to apply changes.');
}

if (require.main === module) main();
