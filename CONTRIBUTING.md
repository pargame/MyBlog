# Contributing / Workflow

This document summarizes the minimum you need to work in this repo.

## Quick start
- Node 20+
- Dependencies (if needed): `npm install`
- Build: `npm run build` → generates `public/graph.json`, `public/meta.json`
- Preview: open `index.html` in a browser (static site)

## Workflow
1. Add/edit documents under `docs/**/*.md`
2. Update graph/meta: `npm run build` (may run automatically via hooks)
3. Commit/push to `main` → GitHub Pages auto-deploy

## Code guide
- Styles: prefer editing CSS variables first in `assets/css/styles.css`
- Graph view logic: in `graph.html`
  - Sliders drive `updateForces` / `updateStyles`
  - Check highlight/selection/collision behavior
- Viewer: `viewer.html` (Marked + DOMPurify + highlight.js)
- Builders: `scripts/build-graph.js`, `scripts/build-meta.js`

## Architecture / pipeline
- See `ARCHITECTURE.md` for an overview, data flow, deploy, and notes.

## Deployment pipeline
- `.github/workflows/pages.yml` (Node setup → build → upload → deploy)

## Issues / enhancements
- For ideas like better label collision, persisting settings, or home summary cards, see “Future work” in `ARCHITECTURE.md`.

## Maintenance policy
- UI language: all pages, labels, buttons, and visible strings must be English.
- Content naming: domain-specific docs (e.g., `AActor.md`) may follow separate naming rules. See `MAINTENANCE.md` for the canonical conventions and keep them updated when rules change.
