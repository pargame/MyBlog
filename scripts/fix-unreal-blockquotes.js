#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const TARGET = path.join(ROOT, 'docs', 'Unreal');

function listMd(dir) {
  const res = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const s = fs.statSync(p);
    if (s.isDirectory()) res.push(...listMd(p));
    else if (name.toLowerCase().endsWith('.md')) res.push(p);
  }
  return res;
}

function cleanHeadingText(h) {
  // remove leading hashes and surrounding spaces
  let t = h.replace(/^#+\s*/, '').trim();
  // remove bold markers **...**
  t = t.replace(/\*\*/g, '').trim();
  // remove numbering like '1.' or '1)'
  t = t.replace(/^\d+\.?\s*-?\s*/, '');
  // remove trailing colons
  t = t.replace(/[:：]\s*$/, '');
  return t;
}

function nextNonEmptyIdx(lines, idx) {
  let j = idx + 1;
  while (j < lines.length && /^\s*$/.test(lines[j])) j++;
  return j < lines.length ? j : -1;
}

function shouldInsert(lines, headingIdx) {
  const j = nextNonEmptyIdx(lines, headingIdx);
  if (j === -1) return true; // EOF -> insert
  const nxt = lines[j];
  if (/^\s*>/.test(nxt)) return false; // already blockquote
  return true;
}

function fixFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split(/\r?\n/);
  let changed = false;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s*#{2,3}\s*(.*)$/); // H2 or H3
    if (m) {
      if (shouldInsert(lines, i)) {
        const summary = cleanHeadingText(lines[i]);
        const insert = `> ${summary || '한 줄 요약을 추가하세요.'}`;
        const insertPos = nextNonEmptyIdx(lines, i);
        // If nextNonEmptyIdx returns -1, append after heading
        const idxToInsert = insertPos === -1 ? i + 1 : insertPos;
        // Insert line at idxToInsert (before the next meaningful line)
        lines.splice(idxToInsert, 0, insert);
        changed = true;
        // advance i past inserted line
        i = idxToInsert;
      }
    }
  }
  if (changed) {
    fs.writeFileSync(file, lines.join('\n'), 'utf8');
  }
  return changed;
}

function main() {
  if (!fs.existsSync(TARGET)) {
    console.error('Target not found', TARGET);
    process.exit(1);
  }
  const files = listMd(TARGET);
  let edited = 0;
  for (const f of files) {
    try {
      if (fixFile(f)) edited++;
    } catch (e) {
      console.error('fail', f, e);
    }
  }
  console.log(`fix-unreal-blockquotes: processed ${files.length} files, edited ${edited}.`);
}

main();
