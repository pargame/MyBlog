# Contributing / Workflow

This document summarizes the minimum you need to work in this repo.

## Quick start
- Node 20+
- Dependencies (if needed): `npm install`
- Build: `npm run build` → generates `public/graph.json`, `public/meta.json`
- Preview: open `index.html` in a browser (static site)

## Workflow
1. Add/edit documents under `posts/**/*.md` (preferred) or `docs/**/*.md` (legacy)
2. Update graph/meta: `npm run build`
3. Commit/push to `main` → GitHub Pages auto-deploy

## Code guide
- Styles: edit CSS variables first in `assets/css/styles.css`
- Graph view logic: in `graph.html` (controls update forces and styles)
- Viewer: `viewer.html` (Marked + DOMPurify + highlight.js)
- Builders: `scripts/build-graph.js`, `scripts/build-meta.js`

## Architecture / pipeline
- See files in `handbook/` for overview, data flow, deploy, and notes.

## Deployment pipeline
- `.github/workflows/pages.yml` (Node setup → build → upload → deploy)

## Issues / enhancements
- Ideas: better label collision, persisting settings, home summary cards — see “Future work” in `handbook/ARCHITECTURE.md`.

## Maintenance policy
- UI language: English only.
- Documentation language: all work/maintenance docs are in English only.
- Homepage scope: Posts collection via `public/site.json` → `postsCollection`; default "Posts" when omitted.

## Commit & Push rules
- Use a simple workflow for commits: stage all changes, create a single commit, then push to `main`.
- Specifically: `git add -A` → `git commit -m "<concise message>"` → `git push origin HEAD`.
- Files that should not be committed must be listed in the repository's `.gitignore` and managed there; do not create ad-hoc local excludes or per-commit omissions.

This keeps the workflow straightforward and ensures ignore patterns are centrally managed.
