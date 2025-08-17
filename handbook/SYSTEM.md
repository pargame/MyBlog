# System Overview

A static, client-rendered site with a generated knowledge graph derived from Markdown files. No backend services.

## Architecture
- Content source: markdown files under posts/ (and legacy docs/)
- Builder scripts (Node):
```markdown
# System overview

Static, client-rendered site with a generated knowledge graph derived from Markdown files. No backend services.

## Architecture
- Content source: Markdown files under `posts/` (legacy: `docs/`).
- Builder scripts (Node.js):
  - `scripts/build-graph.js` — Parse Markdown and YAML front matter, compute backlinks, topics (folders + `#tags`), archives (YYYY or YYYY-MM), and write `public/graph.json`.
  - `scripts/build-meta.js` — Derive `public/meta.json` (version/commit) and `public/site.json` (contact/email).
- Frontend pages:
  - `index.html` — recent posts and navigation
  - `graph.html` — interactive D3 graph with filters and search
  - `viewer.html` — secure Markdown rendering (Marked + DOMPurify + highlight.js)
- Assets:
  - `assets/css/styles.css` — global styles and components
  - `assets/js/footer.js` — dynamic footer (email, version, commit)
- Deploy: GitHub Pages via Actions

## Data contracts
- `public/graph.json`
  - `nodes`: [{ id, title, path, url, topics: string[], tags: string[], date?: string, mtime: number }]
  - `links`: [{ source: nodeId, target: nodeId, type: 'wiki' | 'mention' }]
  - `archives`: string[] (e.g., ["2023", "2024-05"]) sorted desc
  - `topicsByArchive`: { [archive: string]: string[] }
- `public/meta.json`
  - { version: string, commit: string }
- `public/site.json`
  - { emailUser: string, emailDomain: string, postsCollection?: string | string[] }
    - `postsCollection`: Name(s) of the folder/tag used as the Posts collection (default: "Posts"). The homepage shows only items within these collections.

## UI behavior highlights
- Graph (`graph.html`):
  - D3 force simulation with collision; sizes/positions remain stable on filter changes (container size cached)
  - Hover: highlight node + neighbors; Click: select node with outline
  - Filters/Controls: archive picker, force/size controls; native zoom/pan only
  - Search: clicking a result opens the document overlay and focuses the node
- Viewer (`viewer.html`):
  - Parse Markdown to HTML with Marked, sanitize with DOMPurify, highlight code with highlight.js
  - Show backlinks section and post a one-shot message to the graph to sync selection

## Security
- All Markdown is sanitized with DOMPurify to avoid XSS
- No remote code execution; site is static

## Performance
- Data files are compact JSONs; D3 simulation limits nodes by filter to avoid heavy runtime work

```
