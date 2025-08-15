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

function meaningfulLines(src){
  return src.split(/\r?\n/).filter(l=>!/^\s*$/.test(l) && l.trim() !== '---' && l.trim() !== '```').length;
}

function symbolFromFilename(file){
  return path.basename(file, '.md');
}

function summaryFor(sym){
  if(/^A[A-Z]/.test(sym)) return `${sym}는 게임 월드에서 동작하는 액터입니다. 주요 책임과 사용법을 정리합니다.`;
  if(/^U[A-Z]/.test(sym)) return `${sym}는 엔진에서 사용되는 클래스/컴포넌트로, 주요 속성 및 사용법을 설명합니다.`;
  if(/^F[A-Z]/.test(sym)) return `${sym}는 데이터 구조(구조체)로, 필드와 용도를 설명합니다.`;
  if(/^I[A-Z]/.test(sym)) return `${sym}는 인터페이스로, 제공하는 기능과 콜백을 설명합니다.`;
  return `${sym}의 개요와 사용법을 정리합니다.`;
}

function templateFor(sym){
  const sum = summaryFor(sym);
  return `---\n---\n\n> **${sum}**\n\n### **1. 주요 역할 및 책임**\n> 주요 역할 및 책임\n* **핵심 역할 1:**\n\t간단한 설명을 여기에 작성합니다.\n* **핵심 역할 2:**\n\t간단한 설명을 여기에 작성합니다.\n\n### **2. 핵심 속성**\n> 핵심 속성\n* **
	` + "PropertyName`:`" + `**\n\t설명...\n\n### **3. 사용 방법**\n> 사용 방법\n간단한 사용 예와 권장 설정을 기술합니다.\n\n### **4. 관련 클래스**\n> 관련 클래스\n* **[[SomeRelatedClass]]:**\n\t관련성 설명.\n\n### **5. 코드 예시**\n\n\n\`\`\`cpp\n// 간단한 예시\n// ${sym} 사용 예시를 추가하세요.\n\`\`\`\n`;
}

function main(){
  if(!fs.existsSync(TARGET)){ console.error('Target not found', TARGET); process.exit(1); }
  const files = listMd(TARGET).sort();
  let filled = 0;
  for(const f of files){
    try{
      const src = fs.readFileSync(f,'utf8');
      const ml = meaningfulLines(src);
      if(ml <= 4){
        const sym = symbolFromFilename(f);
        const tmpl = templateFor(sym);
        fs.writeFileSync(f, tmpl, 'utf8');
        filled++;
      }
    }catch(e){ console.error('fail', f, e); }
  }
  console.log(`fill-empty-unreal: processed ${files.length} files, filled ${filled}.`);
}

main();
