#!/usr/bin/env node
/**
 * Markdown wiki-link graph builder
 * - Topic sources: folder names (including archives) + YAML front matter tags
 * - Links: [[FileName]] or [[FileName|Alias]]
 * - Inputs: posts/ (primary) and docs/ (legacy)
 * - Output: public/graph.json (nodes, edges, archives, topicsByArchive)
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

// Extract standard Markdown links: [label](target)
// Returns an array of raw target strings as they appear inside (...)
function parseMarkdownLinks(content) {
  const re = /\[[^\]]*\]\(([^)]+)\)/g;
  const out = new Set();
  let m;
  while ((m = re.exec(content))) {
    const href = (m[1] || '').trim();
    if (!href) continue;
    // Skip external links and anchors
    if (/^(?:[a-z]+:)?\/\//i.test(href)) continue; // http(s)://, mailto:, etc.
    if (href.startsWith('#')) continue;
    out.add(href);
  }
  return [...out];
}

function parseFrontMatterTags(raw) {
  // Quick-parse only the tags inside an initial --- ... --- block
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
        inTags = true; // subsequent lines use "- item"
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

function parseFrontMatterAuthor(raw) {
  if (!raw.startsWith('---')) return null;
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return null;
  const header = raw.slice(3, end).split('\n');
  for (const lineRaw of header) {
    const line = lineRaw.trim();
    const m = /^author\s*:\s*(.+)$/i.exec(line);
    if (m) return m[1].trim();
  }
  return null;
}

function parseFrontMatterTitle(raw) {
  if (!raw.startsWith('---')) return null;
  const end = raw.indexOf('\n---', 3);
  if (end === -1) return null;
  const header = raw.slice(3, end).split('\n');
  for (const lineRaw of header) {
    const line = lineRaw.trim();
    const m = /^title\s*:\s*(.+)$/i.exec(line);
    if (m) {
      let v = m[1].trim();
      // Unwrap quotes if present
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      return v;
    }
  }
  return null;
}

function parseSimpleTags(raw) {
  // Support a simple "tags: [a, b]" pattern within the first ~20 lines
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
  const idToArchive = new Map();

  for (const entry of filesLabeled) {
    const file = entry.file;
    const rootDir = entry.root;
    const rootLabel = entry.label; // 'Posts' | 'Docs'
    const base = path.basename(file, '.md');
    const relFromRepo = path.relative(REPO_ROOT, file); // posts/.../X.md or docs/.../X.md
    const relFromRoot = path.relative(rootDir, file);  // .../X.md
  const segs = relFromRoot.split(path.sep);
  // Extract archive and folder-based topics: include all folder names as topics
  const folders = segs.slice(0, Math.max(0, segs.length - 1));
  const archive = folders.length ? folders[0] : '(default)';
    archives.add(archive);

  const raw = fs.readFileSync(file, 'utf8');
  // Prefer explicit YAML frontmatter title when present; otherwise fall back to the filename (base)
  // NOTE: intentionally do NOT use the first H1 heading as the node label to avoid noisy titles.
  const fmTitle = parseFrontMatterTitle(raw);
  const title = fmTitle || base;
  const stat = fs.statSync(file);
  const mtime = stat.mtimeMs || Date.now();
  const dateStr = parseFrontMatterDate(raw);
  const author = parseFrontMatterAuthor(raw);

  // Parse tags (front matter or simple tags: [..]) + include all folder names as topics
  const tagSet = new Set();
  // Note: to keep topics pure we do not inject root labels (Posts/Docs)
  for (const f of folders) tagSet.add(f);
    for (const t of parseFrontMatterTags(raw)) tagSet.add(t);
    for (const t of parseSimpleTags(raw)) tagSet.add(t);
    for (const t of tagSet) topics.add(t);

    const id = relFromRoot.replace(/\\/g, '/').replace(/\.md$/i, '');
  const node = { id, label: title, base, file: relFromRepo, archive, topics: [...tagSet], mtime, date: dateStr, author };
    nodeIndex.set(id, nodes.length);
  idToArchive.set(id, archive);
    nodes.push(node);

    const arr = byBaseName.get(base) || [];
    arr.push(id);
    byBaseName.set(base, arr);
  }

  // Link resolution helpers
  const toPosix = (p) => p.replace(/\\/g, '/');
  const stripFragment = (s) => s.split('#')[0].split('?')[0];
  const stripMdExt = (s) => s.replace(/\.md$/i, '');
  const dirnamePosix = (p) => toPosix(path.posix.dirname(p));
  const joinPosix = (...segs) => toPosix(path.posix.join(...segs));
  const normalizePosix = (p) => toPosix(path.posix.normalize(p));
  function preferSameArchive(base, srcArchive) {
    const candidates = byBaseName.get(base);
    if (!candidates || !candidates.length) return null;
    const same = candidates.find(id => idToArchive.get(id) === srcArchive);
    return same || candidates[0];
  }

  function resolveTargetIdMarkdown(rawTarget, srcId, srcArchive) {
    // Clean target
    let t = stripFragment(rawTarget.trim());
    // Remove surrounding quotes if present (rare in MD)
    if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
      t = t.slice(1, -1);
    }
    // If it looks like a file path (contains '/' or ends with .md), try relative resolution
    const hasSlash = t.includes('/') || t.includes('\\');
    const hasMd = /\.md$/i.test(t);
    if (hasSlash || hasMd) {
      const srcDir = dirnamePosix(srcId);
      // Normalize against src directory
      const norm = normalizePosix(joinPosix(srcDir, stripMdExt(toPosix(t))));
      if (nodeIndex.has(norm)) return norm;
      // Also try basename preference if exact id not found
      const base = path.posix.basename(norm);
      const byBase = preferSameArchive(base, srcArchive);
      if (byBase) return byBase;
    } else {
      // No slash and no .md: treat as basename
      const base = t;
      const byBase = preferSameArchive(base, srcArchive);
      if (byBase) return byBase;
    }
    return null;
  }

  // Wikilinks + Markdown links -> edges
  for (const entry of filesLabeled) {
    const file = entry.file;
    const rootDir = entry.root;
    const relFromRoot = path.relative(rootDir, file);
    const srcId = relFromRoot.replace(/\\/g, '/').replace(/\.md$/i, '');
    const content = fs.readFileSync(file, 'utf8');
    const srcArchive = idToArchive.get(srcId);
    // 1) Wiki links [[Target]]
    const wikiLinks = parseWikiLinks(content);
    for (const target of wikiLinks) {
      const tgtBase = target.endsWith('.md') ? target.replace(/\.md$/i, '') : target;
      const tgtId = preferSameArchive(tgtBase, srcArchive);
      if (tgtId) edges.push({ source: srcId, target: tgtId });
    }
    // 2) Standard Markdown links [label](target)
    const mdLinks = parseMarkdownLinks(content);
    const isCADoc = srcId.startsWith('Computer Architecture/');
    if (isCADoc) {
      console.error('[graph] MD links in', srcId, '=>', mdLinks);
    }
    for (const rawHref of mdLinks) {
      const tgtId = resolveTargetIdMarkdown(rawHref, srcId, srcArchive);
      if (isCADoc) {
        console.error('  resolve', rawHref, '=>', tgtId);
      }
      if (tgtId) edges.push({ source: srcId, target: tgtId });
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
  // graph written
}

if (require.main === module) {
  main();
}
