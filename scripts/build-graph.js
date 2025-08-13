#!/usr/bin/env node
/**
 * 마크다운 위키 링크 그래프 생성기
 * - 주제 소스: 상위 폴더명(보관함 포함) + 문서 상단 YAML 프론트매터 tags
 * - 링크: [[FileName]] 또는 [[FileName|Alias]]
 * - 입력: docs 폴더
 * - 출력: public/graph.json (nodes, edges, archives, topicsByArchive)
 */
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.resolve(REPO_ROOT, 'posts');
const DOCS_DIR = path.resolve(REPO_ROOT, 'docs'); // legacy
const OUT_DIR = path.resolve(REPO_ROOT, 'public');
const OUT_FILE = path.join(OUT_DIR, 'graph.json');

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
  // --- ... --- 블록 안의 tags만 간단 파싱
  if (!raw.startsWith('---')) return [];
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return [];
  const header = raw.slice(3, end).split('\n');
  const tags = [];
  let inTags = false;
  for (const lineRaw of header) {
    const line = lineRaw.trim();
    const m = /^tags\s*:\s*(.*)$/i.exec(line);
    if (m) {
      const rest = m[1].trim();
      if (rest.startsWith('[')) {
        const inner = rest.replace(/^\[/, '').replace(/\]$/, '');
        inner.split(',').forEach(v => { const t = v.trim(); if (t) tags.push(t); });
        inTags = false;
      } else if (rest) {
        rest.split(/[;,]/).forEach(v => { const t = v.trim(); if (t) tags.push(t); });
        inTags = false;
      } else {
        inTags = true; // 다음 라인들에서 - item
      }
      continue;
    }
    if (inTags) {
      const m2 = /^-\s*(.+)$/.exec(line);
      if (m2) {
        const t = m2[1].trim();
        if (t) tags.push(t);
      } else if (line === '' || /^\w+\s*:/.test(line)) {
        inTags = false;
      }
    }
  }
  return tags;
}

function parseFrontMatterDate(raw) {
  if (!raw.startsWith('---')) return null;
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return null;
  const header = raw.slice(3, end).split('\n');
  for (const lineRaw of header) {
    const line = lineRaw.trim();
    const m = /^date\s*:\s*(.+)$/i.exec(line);
    if (m) return m[1].trim();
  }
  return null;
}

function parseSimpleTags(raw) {
  // 파일 상단 20줄 내 "tags: [a, b]" 패턴 지원
  const head = raw.split('\n').slice(0, 20).join('\n');
  const m = /^\s*tags\s*:\s*\[(.*?)\].*$/mi.exec(head);
  if (!m) return [];
  return m[1].split(',').map(s => s.trim()).filter(Boolean);
}

function main() {
  // Collect content roots: posts (primary) and docs (legacy)
  const roots = [];
  if (fs.existsSync(POSTS_DIR)) roots.push({ dir: POSTS_DIR, label: 'Posts' });
  if (fs.existsSync(DOCS_DIR)) roots.push({ dir: DOCS_DIR, label: 'Docs' });
  if (!roots.length) {
    console.error('No content roots found. Create a posts/ folder with Markdown files.');
    process.exit(0);
  }
  const filesLabeled = [];
  for (const r of roots) {
    for (const f of listMarkdownFiles(r.dir)) filesLabeled.push({ file: f, root: r.dir, label: r.label });
  }

  const nodes = [];
  const nodeIndex = new Map();
  const edges = [];
  const topics = new Set();
  const archives = new Set();
  const byBaseName = new Map(); // basename -> [ids]

  for (const entry of filesLabeled) {
    const file = entry.file;
    const rootDir = entry.root;
    const rootLabel = entry.label; // 'Posts' | 'Docs'
    const base = path.basename(file, '.md');
    const relFromRepo = path.relative(REPO_ROOT, file); // posts/.../X.md or docs/.../X.md
    const relFromRoot = path.relative(rootDir, file);  // .../X.md
  const segs = relFromRoot.split(path.sep);
  // 아카이브 및 폴더 기반 토픽 추출: 모든 폴더명을 토픽으로 포함
  const folders = segs.slice(0, Math.max(0, segs.length - 1));
  const archive = folders.length ? folders[0] : '(default)';
    archives.add(archive);

  const raw = fs.readFileSync(file, 'utf8');
    const firstHeading = /^\s*#\s+(.+)$/m.exec(raw)?.[1]?.trim();
    const title = firstHeading || base;
  const stat = fs.statSync(file);
  const mtime = stat.mtimeMs || Date.now();
  const dateStr = parseFrontMatterDate(raw);

  // 문서 상단 태그 파싱(front matter 또는 간단 tags: [..]) + 모든 폴더명을 토픽으로
  const tagSet = new Set();
  // Include source root label as a topic so collections can be filtered (e.g., 'Posts')
  if (rootLabel) tagSet.add(rootLabel);
  for (const f of folders) tagSet.add(f);
    for (const t of parseFrontMatterTags(raw)) tagSet.add(t);
    for (const t of parseSimpleTags(raw)) tagSet.add(t);
    for (const t of tagSet) topics.add(t);

    const id = relFromRoot.replace(/\\/g, '/').replace(/\.md$/i, '');
  const node = { id, label: title, base, file: relFromRepo, archive, topics: [...tagSet], mtime, date: dateStr };
    nodeIndex.set(id, nodes.length);
    nodes.push(node);

    const arr = byBaseName.get(base) || [];
    arr.push(id);
    byBaseName.set(base, arr);
  }

  // 위키링크 -> edges
  for (const entry of filesLabeled) {
    const file = entry.file;
    const rootDir = entry.root;
    const relFromRoot = path.relative(rootDir, file);
    const srcId = relFromRoot.replace(/\\/g, '/').replace(/\.md$/i, '');
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
