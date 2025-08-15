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
  let t = h.replace(/^#+\s*/, '').trim();
  t = t.replace(/\*\*/g, '').trim();
  t = t.replace(/^\d+\.?\s*-?\s*/, '');
  t = t.replace(/[:：]\s*$/, '');
  return t;
}

function nextNonEmptyIdx(lines, idx) {
  let j = idx + 1;
  while (j < lines.length && /^\s*$/.test(lines[j])) j++;
  return j < lines.length ? j : -1;
}

function existingBlockquoteText(line) {
  const m = line.match(/^\s*>\s*(.*)$/);
  return m ? m[1].trim() : null;
}

function generateSummary(symbol, headingKey) {
  const sym = symbol;
  const key = headingKey.toLowerCase();
  if (key.includes('주요 역할') || key.includes('역할') || key.includes('책임')) {
    return `**${sym}의 주요 역할과 책임을 설명합니다.**`;
  }
  if (key.includes('핵심') && (key.includes('속성') || key.includes('멤버') || key.includes('함수'))) {
    return `**${sym}의 핵심 속성 및 주요 멤버/함수를 요약합니다.**`;
  }
  if (key.includes('핵심 속성') || key.includes('핵심')) {
    return `**${sym}의 핵심 속성과 설정 항목을 정리합니다.**`;
  }
  if (key.includes('사용 방법') || key.includes('사용 예') || key.includes('사용')) {
    return `**${sym}의 사용 방법과 간단한 예시를 제공합니다.**`;
  }
  if (key.includes('관련 클래스') || key.includes('관련')) {
    return `**${sym}와 관련된 클래스·구조체 및 연관 관계를 정리합니다.**`;
  }
  if (key.includes('코드 예') || key.includes('코드')) {
    return `**${sym}의 코드 예시(사용법)를 보여줍니다.**`;
  }
  if (key.includes('사용법') || key.includes('사용')) {
    return `**${sym}의 사용법 및 일반적인 활용 예시입니다.**`;
  }
  // default
  return `**${sym}에 대한 요약입니다.**`;
}

function symbolFromFilename(file) {
  const base = path.basename(file, '.md');
  // Keep capitalization/names like AActor, UCameraComponent, etc.
  return base;
}

function shouldReplaceExisting(existingText, headingText) {
  if (!existingText) return true; // nothing -> insert
  const ex = existingText.replace(/\*\*/g, '').trim();
  const hd = headingText.replace(/\*\*/g, '').trim();
  // Replace if it's identical to heading or very short/generic
  if (ex === hd) return true;
  if (ex.length < 40) return true; // short summary likely generic
  return false;
}

function processFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split(/\r?\n/);
  let changed = false;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s*#{2,3}\s*(.*)$/); // H2 or H3
    if (m) {
      const headingRaw = m[1] || '';
      const heading = cleanHeadingText(headingRaw);
      const sym = symbolFromFilename(file);
      const j = nextNonEmptyIdx(lines, i);
      const summary = generateSummary(sym, heading);
      if (j === -1) {
        // append
        lines.splice(i + 1, 0, `> ${summary}`);
        changed = true;
        i++;
        continue;
      }
      const nxt = lines[j];
      const ex = existingBlockquoteText(nxt);
      if (ex !== null) {
        if (shouldReplaceExisting(ex, heading)) {
          lines[j] = `> ${summary}`;
          changed = true;
        }
      } else {
        // insert before next meaningful line
        lines.splice(j, 0, `> ${summary}`);
        changed = true;
        i = j; // advance
      }
    }
  }
  if (changed) fs.writeFileSync(file, lines.join('\n'), 'utf8');
  return changed;
}

function main() {
  if (!fs.existsSync(TARGET)) {
    console.error('Target not found', TARGET);
    process.exit(1);
  }
  const files = listMd(TARGET).sort();
  let edited = 0;
  for (const f of files) {
    try {
      if (processFile(f)) edited++;
    } catch (e) {
      console.error('fail', f, e);
    }
  }
  console.log(`apply-rep-summaries: processed ${files.length} files, edited ${edited}.`);
}

main();
