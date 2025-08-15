# MyBlog

Personal blog + knowledge graph (Obsidian-style). Pushing to the main branch auto-deploys to GitHub Pages.

## Features
- Home (`index.html`): shows the 20 most recent posts from `posts/` (README/Index-like docs excluded automatically)
- Graph (`graph.html`): archive/notes only (excludes blog posts), archive/topic filters, backlinks, immersive doc overlay
- Viewer (`viewer.html`): safe Markdown rendering (DOMPurify), code highlighting, title/date/author meta header
- Artifacts: `public/graph.json` (graph), `public/meta.json` (version/commit; generated at deploy, ignored by git)

## Content model
- `posts/`: blog posts visible on Home
- `docs/`: archives/notes for the graph (legacy compatible)
- Topics: derived from folder name + front matter `tags: [a, b]`

## Writing a post
Create `posts/YYYY/slug.md` with front matter:

```markdown
---
title: Title
date: 2025-08-13
author: YourName
---

# Title
Write in Korean for narrative; code snippets remain English. Use wiki links like [[SomeNote]].
```

After committing and pushing to `main`, the post appears on Home and its meta is shown in the viewer.

## Local build / preview
This is a static site. You can open `index.html` directly. To refresh graph/meta:

```bash
npm install
npm run build
```

Outputs: `public/graph.json`, `public/meta.json`.

## Deployment
Push to `main` → GitHub Pages deploy via `.github/workflows/pages.yml`.

## Handbook
All project docs live under `handbook/`. Root “mini” docs were removed to avoid duplication.

Key docs:
- `handbook/ARCHITECTURE.md`
- `handbook/BUILD.md`
- `handbook/CONTRIBUTING.md`
- `handbook/FILEMAP.md`
- `handbook/MAINTENANCE.md`
- `handbook/REQUIREMENTS.md`
- `handbook/SYSTEM.md`

## File map
See `handbook/FILEMAP.md` for a quick repository overview.
