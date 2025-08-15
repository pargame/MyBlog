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

function firstTwoLines(lines) {
  return [lines[0] ?? '', lines[1] ?? ''];
}

function nextNonEmpty(lines, idx) {
  let j = idx + 1;
  while (j < lines.length && /^\s*$/.test(lines[j])) j++;
  return { idx: j, line: lines[j] ?? null };
}

function analyze(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  const lines = src.split(/\r?\n/);
  const issues = [];

  // front matter: first two lines must be '---' and '---'
  const [l1, l2] = firstTwoLines(lines);
  if (l1.trim() !== '---' || l2.trim() !== '---') {
    issues.push({ type: 'front-matter', msg: 'Missing leading two-line front matter (--- / ---)' });
  }

  // For each H2/H3 section heading, ensure next meaningful line is a blockquote '>' per template
  for (let i = 0; i < lines.length; i++) {
    const h = lines[i].match(/^###\s*/);
    if (h) {
      const { idx, line } = nextNonEmpty(lines, i);
      if (line === null) continue;
      if (!/^\s*>/.test(line)) {
        issues.push({ type: 'missing-blockquote', line: i + 1, msg: `Heading at ${i + 1} not followed by a blockquote` });
      }
    }
  }

  // Bulleted label checks
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // inline label+desc: * **Label:** description  (colon inside or outside bold) -> non-compliant
    if (/^\s*\*\s+\*\*[^*]+?\*\*:\s+\S/.test(line) || /^\s*\*\s+\*\*[^*]+?:\*\*\s+\S/.test(line)) {
      issues.push({ type: 'inline-label', line: i + 1, msg: 'Inline label+description (should break to next tab-indented line)' });
      continue;
    }
    // label-only: * **Label:**  (no inline desc)
    const m = line.match(/^(\s*)\*\s+\*\*([^*]+?)\*\*:\s*$/) || line.match(/^(\s*)\*\s+\*\*([^*]+?):\*\*\s*$/);
    if (m) {
      const leading = m[1] || '';
      const { idx, line: nxt } = nextNonEmpty(lines, i);
      if (nxt === null) {
        issues.push({ type: 'missing-desc', line: i + 1, msg: 'Label has no following description line' });
        continue;
      }
      // next meaningful line must start with leading + tab
      // Accept either a tab-indented description, or a nested bullet list (starts with '*') as valid
      const nxtTrim = (nxt || '').replace(/^\s+/, '');
      if (!(nxt.startsWith(leading + '\t') || nxtTrim.startsWith('*'))) {
        issues.push({ type: 'missing-desc-indent', line: i + 1, msg: `Description after label not tab-indented (line ${idx + 1})` });
      }
    }
  }

  return issues;
}

function main() {
  if (!fs.existsSync(TARGET)) {
    console.error('Target dir not found:', TARGET);
    process.exit(1);
  }
  const files = listMd(TARGET).sort();
  const report = {};
  let totalIssues = 0;
  for (const f of files) {
    try {
      const issues = analyze(f);
      if (issues.length) {
        report[path.relative(ROOT, f)] = issues;
        totalIssues += issues.length;
      }
    } catch (e) {
      console.error('Failed', f, e);
    }
  }

  console.log('Unreal docs check - summary');
  console.log('Files scanned:', files.length);
  console.log('Files with issues:', Object.keys(report).length);
  console.log('Total issues:', totalIssues);
  console.log('');

  for (const [file, issues] of Object.entries(report)) {
    console.log('->', file);
    for (const it of issues) {
      console.log(`   - [${it.type}] ${it.msg} ${it.line ? `(at line ${it.line})` : ''}`);
    }
    console.log('');
  }

  if (totalIssues === 0) console.log('No problems found.');
}

main();
