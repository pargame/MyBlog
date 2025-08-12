#!/usr/bin/env node
/**
 * 마크다운 위키 링크 그래프 생성기
 * - [[FileName]] 또는 [[FileName|Alias]] 링크를 추출
 * - 주제 소스: 폴더명 + 문서 상단 태그(front matter 또는 단순 tags: [..])
 * - 입력: docs/
 * - 출력: public/graph.json (nodes, edges, archives, topicsByArchive)
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
    return e.isFile() && p.toLowerCase().endsWith('.md') ? [p] : [];
  });
}

function parseWikiLinks(content) {
  const re = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const targets = new Set();
  let m;
  while ((m = re.exec(content))) {
    const target = (m[1] || '').trim();
    if (target) targets.add(target);
  }
  return [...targets];
}

function parseFrontMatterTags(raw) {
  if (!raw.startsWith('---')) return [];
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return [];
  const header = raw.slice(3, end).split('\n');
  const tags = [];
  let inTagsBlock = false;
  for (const lineRaw of header) {
    const line = lineRaw.trim();
    const m = /^tags\s*:\s*(.*)$/i.exec(line);
    if (m) {
      const rest = m[1].trim();
      if (rest.startsWith('[')) {
        const inner = rest.replace(/^\[/, '').replace(/\]$/, '');
        inner.split(',').forEach(v => { const t = v.trim(); if (t) tags.push(t); });
        inTagsBlock = false;
      } else if (rest) {
        rest.split(',').forEach(v => { const t = v.trim(); if (t) tags.push(t); });
        inTagsBlock = false;
      } else {
        inTagsBlock = true;
      }
      continue;
    }
    if (inTagsBlock) {
      const m2 = /^-\s*(.+)$/.exec(line);
      if (m2) {
        const t = m2[1].trim();
        if (t) tags.push(t);
      } else if (line === '' || /^\w+\s*:/.test(line)) {
        inTagsBlock = false;
      }
    }
  }
  return tags;
}

function parseSimpleTags(raw) {
  const head = raw.split('\n').slice(0, 20).join('\n');
  const m = /^\s*tags\s*:\s*\[(.*?)\].*$/mi.exec(head);
  if (!m) return [];
  return m[1].split(',').map(s => s.trim()).filter(Boolean);
}

function main() {
  if (!fs.existsSync(DOCS_DIR)) {
    console.error('docs 폴더가 없습니다.');
    process.exit(0);
  }
  const files = listMarkdownFiles(DOCS_DIR);

  const nodes = [];
  const edges = [];
  const topics = new Set();
  const archives = new Set();
  const byBaseName = new Map(); // basename -> array of node ids

  for (const file of files) {
    const base = path.basename(file, '.md');
    const relFromRepo = path.relative(REPO_ROOT, file);
    const relFromDocs = path.relative(DOCS_DIR, file);
    const segs = relFromDocs.split(path.sep);

    let archive = '(default)';
    let folderTopic = '(root)';
    if (segs.length === 1) {
      // docs/Name.md -> default archive, root topic
    } else if (segs.length === 2) {
      archive = segs[0];
      folderTopic = segs[0];
    } else if (segs.length >= 3) {
      archive = segs[0];
      folderTopic = segs[1];
    }
    archives.add(archive);

    const raw = fs.readFileSync(file, 'utf8');
    const firstHeading = /^\s*#\s+(.+)$/m.exec(raw)?.[1]?.trim();
    const title = firstHeading || base;

    const tagSet = new Set();
    if (folderTopic && folderTopic !== '(root)') tagSet.add(folderTopic);
    for (const t of parseFrontMatterTags(raw)) tagSet.add(t);
    for (const t of parseSimpleTags(raw)) tagSet.add(t);
    for (const t of tagSet) topics.add(t);

    const id = relFromDocs.replace(/\\/g, '/').replace(/\.md$/i, '');
    const node = { id, label: title, base, file: relFromRepo, archive, topics: [...tagSet] };
    nodes.push(node);

    const arr = byBaseName.get(base) || [];
    arr.push(id);
    byBaseName.set(base, arr);
  }

  // 링크 추출
  for (const file of files) {
    const relFromDocs = path.relative(DOCS_DIR, file);
    const srcId = relFromDocs.replace(/\\/g, '/').replace(/\.md$/i, '');
    const content = fs.readFileSync(file, 'utf8');
    const links = parseWikiLinks(content);
    for (const target of links) {
      const tgtBase = target.endsWith('.md') ? target.replace(/\.md$/i, '') : target;
      const candidates = byBaseName.get(tgtBase);
      if (!candidates || candidates.length === 0) continue;
      const tgtId = candidates[0];
      edges.push({ source: srcId, target: tgtId });
    }
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  // topicsByArchive 계산
  const topicsByArchive = {};
  for (const n of nodes) {
    if (!topicsByArchive[n.archive]) topicsByArchive[n.archive] = new Set();
    for (const t of (n.topics || [])) topicsByArchive[n.archive].add(t);
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
