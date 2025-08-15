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
  // split by Korean and English sentence enders (.!? and Korean  。) and line breaks
  const m = text.split(/(?<=[\.\!\?\u3002])\s+/);
  return (m[0]||'').trim();
}

function similar(a,b){
  const x = clean(a||'').toLowerCase();
  const y = clean(b||'').toLowerCase();
  if(!x||!y) return false;
  if(x===y) return true;
  // consider substrings
  if(x.includes(y) || y.includes(x)) return true;
  // short strings: consider similar if levenshtein ratio high - but keep simple: compare word overlap
  const xa = x.split(/\s+/).filter(Boolean);
  const ya = y.split(/\s+/).filter(Boolean);
  const inter = xa.filter(w=> ya.includes(w)).length;
  const avg = (xa.length+ya.length)/2;
  return avg>0 && (inter/avg) > 0.6;
}

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

    // if next is blockquote, check if it's too similar to heading
    if(isBlockquote(lines[j])){
      const ex = clean(lines[j].replace(/^\s*>\s*/,''));
      if(!ex) continue; // empty
      if(!similar(ex,heading) && ex.length>40) continue; // likely good
      // else we should try to replace with first sentence from section
    }

    // find first paragraph after heading (skip blockquote if present)
    let k = j;
    if(isBlockquote(lines[k])) k = nextNonEmptyIdx(lines,k);
    // skip code fences and lists until a paragraph
    while(k!==-1 && (isCodeFence(lines[k]) || isList(lines[k]) || isHeading(lines[k]))) {
      k = nextNonEmptyIdx(lines,k);
    }
    if(k===-1) continue;

    // gather paragraph lines until blank or another structural element
    let para = '';
    let p = k;
    while(p<lines.length && !/^\s*$/.test(lines[p]) && !isHeading(lines[p]) && !isList(lines[p]) && !isBlockquote(lines[p]) && !isCodeFence(lines[p])){
      para += (para? ' ' : '') + lines[p].trim();
      p++;
    }
    const first = extractFirstSentence(para) || '';
    let newSummary = first ? `**${first}**` : `**${heading}에 대한 요약입니다.**`;

    // If next non-empty was blockquote, replace it; else insert
    const j2 = nextNonEmptyIdx(lines,i);
    if(j2===-1){ lines.splice(i+1,0,`> ${newSummary}`); changed=true; i++; continue; }
    if(isBlockquote(lines[j2])){
      const ex = lines[j2].replace(/^\s*>\s*/,'').trim();
      if(similar(ex, newSummary) || similar(ex, heading)){
        lines[j2] = `> ${newSummary}`;
        changed = true;
      } else {
        // replace anyway if existing is very short
        if(ex.length<40){ lines[j2] = `> ${newSummary}`; changed=true; }
      }
    } else {
      lines.splice(j2,0,`> ${newSummary}`); changed=true; i = j2; continue;
    }
  }

  if(changed) fs.writeFileSync(file, lines.join('\n'),'utf8');
  return changed;
}

function main(){
  const files = listMd(TARGET).sort();
  let edited =0;
  for(const f of files){
    try{ if(processFile(f)) edited++; }
    catch(e){ console.error('fail',f,e); }
  }
  console.log(`regen-summaries-from-section: processed ${files.length} files, edited ${edited}.`);
}

main();
