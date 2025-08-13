# Build & Versioning

This repo is a static site with a small Node build step to derive data used by the UI.

## Prerequisites
- Node.js 20+

## Install (optional)
Most builds work without extra deps, but CI runs `npm ci`.
```
npm install
```

## Build
- Build all:
```
npm run build
```
- Or run steps:
```
npm run build:graph   # writes public/graph.json
npm run build:meta    # writes public/meta.json (version/commit) and public/site.json (email)
```

Outputs
- public/graph.json: graph data (nodes, edges, archives, topicsByArchive)
- public/meta.json: { version (from package.json), commit (from git) }
- public/site.json: { emailUser, emailDomain } (created if missing)

## Versioning
- Version is read from package.json: "version"
- Commit SHA is resolved at build time (git rev-parse HEAD)
- Footer shows v{version} and short SHA linked to GitHub

## Local preview
- Open index.html directly in a browser. No dev server required.

## CI / Deploy
- GitHub Actions: .github/workflows/pages.yml
  - checkout → configure-pages → (Node 20 + npm ci) → build-graph → build-meta → upload artifact → deploy
- .nojekyll disables Jekyll on Pages so files are served verbatim
