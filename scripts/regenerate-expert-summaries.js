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

function clean(str){
  return (str||'').replace(/\*\*/g,'').replace(/[:：]\s*$/,'').trim();
}

function nextNonEmptyIdx(lines, idx) {
  let j = idx + 1;
  while (j < lines.length && /^\s*$/.test(lines[j])) j++;
  return j < lines.length ? j : -1;
}

function isBlockquote(line){ return /^\s*>/.test(line); }
function isCodeFence(line){ return /^\s*```/.test(line); }
function isList(line){ return /^\s*\*/.test(line); }
function isHeading(line){ return /^\s*#{2,3}\s*/.test(line); }

function extractFirstSentence(text){
  if(!text) return null;
  const m = text.split(/(?<=[\.\!\?\u3002])\s+/);
  return (m[0]||'').trim();
}

function similar(a,b){
  const x = clean(a||'').toLowerCase();
  const y = clean(b||'').toLowerCase();
  if(!x||!y) return false;
  if(x===y) return true;
  if(x.includes(y) || y.includes(x)) return true;
  const xa = x.split(/\s+/).filter(Boolean);
  const ya = y.split(/\s+/).filter(Boolean);
  const inter = xa.filter(w=> ya.includes(w)).length;
  const avg = (xa.length+ya.length)/2;
  return avg>0 && (inter/avg) > 0.6;
}

function expertSuffixFor(headingKey){
  const key = (headingKey||'').toLowerCase();
  if(key.includes('역할') || key.includes('책임')) return '실무 팁: 구현 시 성능과 안정성에 유의하세요.';
  if(key.includes('핵심') && (key.includes('속성')||key.includes('멤버')||key.includes('함수'))) return '실무 팁: 기본값과 런타임 영향부터 확인하세요.';
  if(key.includes('사용') || key.includes('예시') || key.includes('사용법')) return '실무 팁: 프로젝트 요구에 맞는 설정을 우선 검토하세요.';
  if(key.includes('관련')) return '실무 팁: 연관 클래스의 생명주기와 의존도를 반드시 확인하세요.';
  return '실무 팁: 변경 시 성능·안정성·호환성을 먼저 검토하세요.';
}

function symbolFromFilename(file){ return path.basename(file, '.md'); }

function processFile(file){
  const src = fs.readFileSync(file,'utf8');
  const lines = src.split(/\r?\n/);
  let changed = false;

  for(let i=0;i<lines.length;i++){
    const hm = lines[i].match(/^\s*#{2,3}\s*(.*)$/);
    if(!hm) continue;
    const headingRaw = hm[1]||'';
    const heading = clean(headingRaw);
    const j = nextNonEmptyIdx(lines,i);
    if(j===-1) continue;

    // find first paragraph after heading (skip existing blockquote if present)
    let k = j;
    if(isBlockquote(lines[k])) k = nextNonEmptyIdx(lines,k);
    while(k!==-1 && (isCodeFence(lines[k]) || isList(lines[k]) || isHeading(lines[k]))) {
      k = nextNonEmptyIdx(lines,k);
    }
    let first = null;
    if(k!==-1){
      let para = '';
      let p = k;
      while(p<lines.length && !/^\s*$/.test(lines[p]) && !isHeading(lines[p]) && !isList(lines[p]) && !isBlockquote(lines[p]) && !isCodeFence(lines[p])){
        para += (para? ' ' : '') + lines[p].trim();
        p++;
      }
      first = extractFirstSentence(para) || null;
    }

    const sym = symbolFromFilename(file);
    const base = first || heading || sym;
    const suffix = expertSuffixFor(headingRaw);
    const newSummary = `**${base} ${suffix}**`;

    const j2 = nextNonEmptyIdx(lines,i);
    if(j2===-1){ lines.splice(i+1,0,`> ${newSummary}`); changed=true; i++; continue; }
    if(isBlockquote(lines[j2])){
      const ex = lines[j2].replace(/^\s*>\s*/,'').trim();
      if(!similar(ex, newSummary)){
        lines[j2] = `> ${newSummary}`; changed=true;
      }
    } else {
      lines.splice(j2,0,`> ${newSummary}`); changed=true; i=j2; continue;
    }
  }

  if(changed) fs.writeFileSync(file, lines.join('\n'),'utf8');
  return changed;
}

function main(){
  const files = listMd(TARGET).sort();
  let edited=0;
  for(const f of files){ try{ if(processFile(f)) edited++; } catch(e){ console.error('fail',f,e); } }
  console.log(`regenerate-expert-summaries: processed ${files.length} files, edited ${edited}.`);
}

main();
