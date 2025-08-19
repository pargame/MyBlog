#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

function parseFrontMatter(raw) {
  if (!raw.startsWith('---')) return { fm: null, rest: raw };
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return { fm: null, rest: raw };
  const header = raw.slice(3, end).split('\n');
  const out = {};
  for (const line of header) {
    const m = /^([^:]+):\s*(.*)$/.exec(line);
    if (m) out[m[1].trim()] = m[2].trim().replace(/^['\"]|['\"]$/g, '');
  }
  const rest = raw.slice(end + 4);
  return { fm: out, rest };
}

function composeFrontMatter(obj) {
  let s = '---\n';
  if (obj.title) s += `title: '${obj.title.replace(/'/g, "\\'")}\n`;
  if (obj.date) s += `date: '${obj.date}'\n`;
  for (const k of Object.keys(obj)) {
    if (k === 'title' || k === 'date') continue;
    s += `${k}: ${obj[k]}\n`;
  }
  s += '---\n\n';
  return s;
}

function titleFromFilename(file) {
  const base = path.basename(file, '.md');
  const name = base.replace(/^\d{4}-\d{2}-\d{2}[-_]?/, '').replace(/[-_]+/g, ' ');
  return name.split(' ').filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function dateFromGit(file) {
  try {
    const out = execSync(`git log -1 --format=%aI -- "${file}"`, { encoding: 'utf8' }).trim();
    return out || null;
  } catch (e) {
    return null;
  }
}

function ensureFrontMatter(file, apply) {
  const raw = fs.readFileSync(file, 'utf8');
  const { fm, rest } = parseFrontMatter(raw);
  let meta = {};
  if (fm === null) {
    meta = {};
  } else {
    meta = Object.assign({}, fm);
  }

  let changed = false;
  if (!meta.title || meta.title === '') {
    const t = titleFromFilename(file);
    if (t) {
      meta.title = t;
      changed = true;
    }
  }
  if (!meta.date || meta.date === '') {
    const d = dateFromGit(file);
    if (d) {
      meta.date = d;
      changed = true;
    }
  }

  if (!changed) return false;

  const newContent = composeFrontMatter(meta) + (fm === null ? raw : rest);
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
      const changed = ensureFrontMatter(f, apply);
      if (changed) modified.push(f);
    } catch (e) {
      console.error('error', f, e.message);
    }
  }

  if (modified.length === 0) {
    console.log('No files need frontmatter filling.');
  } else {
    console.log((apply ? 'Filled' : 'Would fill') + ' frontmatter for ' + modified.length + ' files:');
    for (const m of modified) console.log(' -', m);
  }
  if (!apply) console.log('\nRun with `node scripts/fill-frontmatter.js --apply` to write changes.');
}

if (require.main === module) main();
