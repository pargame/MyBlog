#!/usr/bin/env node
/**
 * 간단한 마크다운 위키 링크 그래프 생성기
 * - [[FileName]] 패턴을 찾아 파일 간 연결을 추출합니다.
 * - 입력: docs 폴더
 * - 출력: public/graph.json (노드/엣지)
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const DOCS_DIR = path.resolve(REPO_ROOT, 'docs');
const OUT_DIR = path.resolve(REPO_ROOT, 'public');
const OUT_FILE = path.join(OUT_DIR, 'graph.json');

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(e => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return listMarkdownFiles(p);
    return e.isFile() && p.endsWith('.md') ? [p] : [];
  });
}

function parseWikiLinks(content) {
  // [[FileName]] 또는 [[FileName|Alias]] 지원
  const re = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const targets = new Set();
  let m;
  while ((m = re.exec(content))) {
    const target = m[1].trim();
    if (target) targets.add(target);
  }
  return [...targets];
}

function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error('docs 폴더가 없습니다.');
    process.exit(0);
  }
  const files = listMarkdownFiles(DOCS_DIR);

  const nodes = [];
  const nodeIndex = new Map();
  const edges = [];
  const topics = new Set();

  // 파일명(확장자 제거)를 id로 사용
  for (const file of files) {
    const id = path.basename(file, '.md');
    const relFromRepo = path.relative(REPO_ROOT, file); // e.g., docs/foo/bar.md
    const relFromDocs = path.relative(DOCS_DIR, file);  // e.g., foo/bar.md
    const topic = relFromDocs.includes(path.sep) ? relFromDocs.split(path.sep)[0] : '(root)';
    topics.add(topic);
    // title: first markdown heading or id fallback
    const raw = fs.readFileSync(file, 'utf8');
    const firstHeading = /^\s*#\s+(.+)$/m.exec(raw)?.[1]?.trim();
    const title = firstHeading || id;
    nodeIndex.set(id, nodes.length);
    nodes.push({ id, title, file: relFromRepo, topic });
  }

  for (const file of files) {
    const srcId = path.basename(file, '.md');
    const content = fs.readFileSync(file, 'utf8');
    const links = parseWikiLinks(content);
    for (const target of links) {
      const tgtId = target.endsWith('.md') ? target.replace(/\.md$/, '') : target;
      if (!nodeIndex.has(tgtId)) continue; // 대상 문서가 없으면 스킵
      edges.push({ source: srcId, target: tgtId });
    }
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify({ nodes, edges, topics: [...topics].sort() }, null, 2));
  console.log(`graph written: ${OUT_FILE}`);
}

if (require.main === module) {
  main();
}
