# MyBlog Architecture

This document summarizes the repo structure, data flow, and build/deploy pipeline. Start here to get the big picture.

## Overview
- Static site + D3 knowledge graph + safe Markdown viewer
- Data sources: `posts/**/*.md` (legacy: `docs/**`)
- Outputs: `public/graph.json`, `public/meta.json`, `public/site.json`

# MyBlog architecture

This file summarizes the repository layout, data flow, and the build/deploy pipeline. Read this first for the high-level view.

## Overview
- Static site with a D3 knowledge graph and a secure Markdown viewer
- Content sources: `posts/**/*.md` (legacy: `docs/**`)
- Outputs: `public/graph.json`, `public/meta.json`, `public/site.json`

## Key files and folders
- `index.html` — Home (recent posts)
- `graph.html` — Graph view (archive/topic filters, controls, document overlay)
- `viewer.html` — Markdown viewer (wikilinks/backlinks, safe rendering)
- `assets/css/styles.css` — Global styles
- `assets/js/footer.js` — Footer (email obfuscation, version/commit)
- `scripts/build-graph.js` — Parses docs and builds the graph
- `scripts/build-meta.js` — Writes version/commit and site defaults
- `public/*.json` — Data consumed by the UI

## Data flow
1. Author writes `posts/{archive}/.../*.md` (or legacy `docs/**`).
2. Build graph: `node scripts/build-graph.js`
   - Extract front matter (tags, date) and path → derive topics/archives
   - Resolve wikilinks `[[...]]` → create edges
   - Emit `public/graph.json`
3. Build meta: `node scripts/build-meta.js` → produce `public/meta.json` and `public/site.json`
4. Runtime
   - `graph.html` loads `public/graph.json` and runs filters/simulation
   - `viewer.html` renders the document and backlinks

## Graph
- Uses a D3 force simulation
  - Forces: link (distance), charge (strength), center, collide (radius)
  - Controls: link distance, repulsion, link width, node size (live)
  - Hover: emphasize neighbors, fade others with smooth transitions
  - Selection: selected node shows an outline
  - Zoom: native gestures only (no +/- buttons)
  - Search: clicking a result opens the overlay and focuses the left pane

## Viewer (`viewer.html`)
- Renders Markdown with Marked and sanitizes with DOMPurify
- Uses highlight.js for code highlighting
- Rewrites `[[wikilinks]]` with archive/topic priority before render
- Shows backlinks and syncs selection to the graph via postMessage

## Home (`index.html`)
- Lists up to 20 most recent posts based on node mtime from `public/graph.json`
- Shows only entries from `posts/` (README-like docs excluded). This can be changed via `public/site.json`.

## Build and deploy
- Local build: `npm run build` (graph + meta)
- CI / GitHub Actions: `.github/workflows/pages.yml`
  - Steps: checkout → configure-pages → Node.js 20 + `npm ci` → build → upload → deploy
- `.nojekyll` is included to disable Jekyll on Pages
