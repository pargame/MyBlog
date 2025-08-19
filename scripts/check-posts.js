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

function getFrontMatter(raw) {
  if (!raw.startsWith('---')) return null;
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return null;
  const header = raw.slice(3, end).split('\n');
  const out = {};
  for (const line of header) {
    const m = /^([^:]+):\s*(.*)$/.exec(line);
    if (m) out[m[1].trim()] = m[2].trim().replace(/^['\"]|['\"]$/g, '');
  }
  return out;
}

function checkFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const fm = getFrontMatter(raw);
  if (!fm) return { file, ok: false, reason: 'no-frontmatter' };
  if (!fm.title) return { file, ok: false, reason: 'missing-title' };
  // date is recommended but allow missing for drafts
  return { file, ok: true };
}

function main() {
  const roots = [path.resolve(__dirname, '..', 'posts'), path.resolve(__dirname, '..', 'docs')];
  const files = roots.flatMap(r => listMarkdownFiles(r));
  const failing = [];
  for (const f of files) {
    const res = checkFile(f);
    if (!res.ok) failing.push(res);
  }
  if (failing.length) {
    console.error('Frontmatter checks failed for files:');
    for (const f of failing) console.error(f.file, f.reason);
    process.exit(2);
  }
  console.log('Frontmatter checks passed for', files.length, 'files');
}

if (require.main === module) main();
