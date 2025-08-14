# MyBlog Architecture

This document summarizes the repo structure, data flow, and build/deploy pipeline. Start here to get the big picture.

## Overview
- Static site + D3 knowledge graph + safe Markdown viewer
- Data sources: `posts/**/*.md` (legacy: `docs/**`)
- Outputs: `public/graph.json`, `public/meta.json`, `public/site.json`

## Key files/folders
- `index.html`: Home (recent posts)
- `graph.html`: Graph view (archive/topic filters, controls, immersive doc overlay)
- `viewer.html`: Markdown viewer (wikilinks/backlinks, safe rendering)
- `assets/css/styles.css`: global styles
- `assets/js/footer.js`: footer (email obfuscation, version/commit)
- `scripts/build-graph.js`: parses docs → builds graph
- `scripts/build-meta.js`: writes version/commit/site defaults
- `public/*.json`: data consumed by the UI

## Data flow
1) Author writes `posts/{archive}/.../*.md` (or legacy `docs/**`)
2) Build: `node scripts/build-graph.js`
   - front matter (tags/date) + path → topics/archive
   - wikilinks [[...]] → edges
   - emits `public/graph.json`
3) Meta: `node scripts/build-meta.js` → `public/meta.json`, `public/site.json`
4) Runtime:
   - `graph.html` loads `graph.json` → filters/simulation
   - `viewer.html` renders the document + backlinks

## Graph
- D3 force simulation
  - forces: link(distance), charge(strength), center, collide(radius)
  - controls: link distance, repulsion, link width, node size (live)
  - hover: neighbor emphasis, others fade (with smooth transitions)
  - selection: selected node outline
  - zoom: only native gestures (± buttons removed)
  - search: click result → open overlay → focus left pane (offsetX ≈ -0.225)
- Filters
  - archive selection → filter nodes/links
  - single topic selection → filter nodes by topic
- Document overlay
  - node click/search result opens right-side iframe (viewer)

## Viewer (viewer.html)
- marked + DOMPurify for safe render
- highlight.js for code
- pre-rewrite [[wikilinks]] with same archive/topic priority
- backlinks list
- compact header when embedded inside graph overlay; one-shot postMessage sync for selection

## Home (index.html)
- lists up to 20 most recent posts by node mtime from `public/graph.json`
- shows only `posts/` entries (README-like docs excluded). Can be adjusted later with `public/site.json`.

## Build/Deploy
- Local build: `npm run build` (graph + meta)
- GitHub Actions: `.github/workflows/pages.yml`
  - checkout → configure-pages → Node 20 + npm ci → build → upload → deploy
- `.nojekyll` disables Jekyll
