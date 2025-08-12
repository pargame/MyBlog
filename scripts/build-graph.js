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
  const nodeIndex = new Map(); // id (unique key) -> index
  const edges = [];
  const topics = new Set();
  const archives = new Set();
  const byBaseName = new Map(); // basename -> array of node ids (prefer first)

  // 파일명(확장자 제거)를 id로 사용
  for (const file of files) {
    const base = path.basename(file, '.md');
    const relFromRepo = path.relative(REPO_ROOT, file); // e.g., docs/foo/bar.md
    const relFromDocs = path.relative(DOCS_DIR, file);  // e.g., foo/bar.md
    const segs = relFromDocs.split(path.sep);
    let archive = '(default)';
    let topic = '(root)';
    if (segs.length === 2) {
      topic = segs[0];
    } else if (segs.length >= 3) {
      archive = segs[0];
      topic = segs[1];
    }
    topics.add(topic);
    archives.add(archive);
    const raw = fs.readFileSync(file, 'utf8');
    const firstHeading = /^\s*#\s+(.+)$/m.exec(raw)?.[1]?.trim();
    const title = firstHeading || base;
    const id = relFromDocs.replace(/\\/g, '/').replace(/\.md$/i, ''); // unique id per file path
    const node = { id, label: title, base, file: relFromRepo, archive, topic };
    nodeIndex.set(id, nodes.length);
    nodes.push(node);
    const arr = byBaseName.get(base) || [];
    arr.push(id);
    byBaseName.set(base, arr);
  }

  for (const file of files) {
    const relFromDocs = path.relative(DOCS_DIR, file);
    const srcId = relFromDocs.replace(/\\/g, '/').replace(/\.md$/i, '');
    const content = fs.readFileSync(file, 'utf8');
    const links = parseWikiLinks(content);
    for (const target of links) {
      const tgtBase = target.endsWith('.md') ? target.replace(/\.md$/i, '') : target;
      const candidates = byBaseName.get(tgtBase);
      if (!candidates || candidates.length === 0) continue;
      const tgtId = candidates[0]; // 우선 첫번째 후보로 연결
      edges.push({ source: srcId, target: tgtId });
    }
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  // topicsByArchive 계산
  const topicsByArchive = {};
  for (const n of nodes) {
    if (!topicsByArchive[n.archive]) topicsByArchive[n.archive] = new Set();
    topicsByArchive[n.archive].add(n.topic);
  }
  const topicsByArchiveSorted = Object.fromEntries(
    Object.entries(topicsByArchive).map(([k, v]) => [k, [...v].sort()])
  );
  fs.writeFileSync(OUT_FILE, JSON.stringify({
    nodes,
    edges,
    archives: [...archives].sort(),
    topics: [...topics].sort(),
    topicsByArchive: topicsByArchiveSorted,
  }, null, 2));
  console.log(`graph written: ${OUT_FILE}`);
}

if (require.main === module) {
  main();
}
