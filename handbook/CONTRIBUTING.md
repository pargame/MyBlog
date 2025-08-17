
# Contributing & workflow

This document lists the minimum steps to contribute and work with this repository.

## Quick start
- Node.js 20+
- (Optional) Install dependencies:

```bash
npm install
```
- Build: `npm run build` → generates `public/graph.json` and `public/meta.json`
- Preview: open `index.html` in a browser (static site)

## Workflow
1. Add or edit documents under `posts/**/*.md` (preferred) or `docs/**/*.md` (legacy).
2. Rebuild graph/meta: `npm run build`.
3. Commit and push to `main` → GitHub Pages will auto-deploy.

## Code guide
- Styles: update CSS variables first in `assets/css/styles.css`.
- Graph view logic: `graph.html` (controls, forces, styles).
- Viewer: `viewer.html` uses Marked + DOMPurify + highlight.js.
- Builders: `scripts/build-graph.js`, `scripts/build-meta.js`.

## Architecture / pipeline
- See handbook files for the overview, data flow, build, and deploy notes.

## Deployment pipeline
- GitHub Actions workflow: `.github/workflows/pages.yml` (Node setup → build → upload → deploy)

## Issues / enhancements
- Ideas: improve label collision handling, persist settings, add home summary cards — see "Future work" in `handbook/ARCHITECTURE.md`.

## Maintenance policy
- UI language: English.
- Maintenance/handbook documents: English.
- Homepage scope: Posts collection via `public/site.json` → `postsCollection`; default is "Posts" when omitted.

## Commit & push rules
- Recommended flow: stage all changes, create a single commit, then push to `main`.
- Example: `git add -A` → `git commit -m "<concise message>"` → `git push origin HEAD`.
- Generated or personal files must be listed in `.gitignore`; do not use ad-hoc local excludes to hide files.

This keeps the workflow simple and ensures ignore patterns are centrally managed.
