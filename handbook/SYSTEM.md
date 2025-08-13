# System Overview

A static, client-rendered site with a generated knowledge graph derived from Markdown files. No backend services.

## Architecture
- Content source: markdown files under posts/ (and legacy docs/)
- Builder scripts (Node):
  - scripts/build-graph.js → parse markdown, YAML frontmatter, compute backlinks, topics (folders + #tags), archives (YYYY or YYYY-MM), write public/graph.json
  - scripts/build-meta.js → derive meta.json (version/commit), site.json (contact/email)
- Frontend pages:
  - index.html → recent posts, navigation
  - graph.html → interactive D3 graph + filters + doc list
  - viewer.html → secure markdown rendering (Marked + DOMPurify + Highlight.js)
- Assets:
  - assets/css/styles.css → global + components
  - assets/js/footer.js → dynamic footer (email, version, commit)
- Deploy: GitHub Pages via actions

## Data contracts
- public/graph.json
  - nodes: [{ id, title, path, url, topics: string[], tags: string[], date?: string, mtime: number }]
  - links: [{ source: nodeId, target: nodeId, type: 'wiki' | 'mention' }]
  - archives: string[] (e.g., ["2023", "2024-05"]) sorted desc
  - topicsByArchive: { [archive: string]: string[] }
- public/meta.json
  - { version: string, commit: string }
- public/site.json
  - { emailUser: string, emailDomain: string, postsCollection?: string | string[] }
    - postsCollection: Name(s) of the folder/tag used as the Posts collection (default: "Posts"). The homepage shows only items within these collections.

## UI behavior highlights
- Graph (graph.html):
  - D3 force simulation with collision; sizes/positions stable on filter changes (container size cached)
  - Hover: highlight node + neighbors; Click: select node with outline
  - Filters: multi-select topics, archive picker; doc list syncs with current filter
- Viewer (viewer.html):
  - Parses markdown to HTML with Marked, sanitizes with DOMPurify, highlights code with highlight.js
  - Shows backlinks section

## Security
- All markdown rendered through DOMPurify to avoid XSS
- No remote code execution; site is static

## Performance
- Data files are small JSONs; D3 sim limited nodes by filter; no heavy runtime deps
