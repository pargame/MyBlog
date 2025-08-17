# Build & Versioning

This repo is a static site with a small Node build step to derive data used by the UI.

## Prerequisites
- Node.js 20+

- public/site.json: { emailUser, emailDomain, postsCollection? } (created if missing)
# Build and versioning

This repository is a static site with a small Node.js build step that generates data for the UI.

## Prerequisites
- Node.js 20+

## Install (optional)
CI runs `npm ci`. Locally you can install with:

```bash
npm install
```

## Build
- Build everything:

```bash
npm run build
```

- Or run the steps individually:

```bash
npm run build:graph   # writes public/graph.json
npm run build:meta    # writes public/meta.json (version/commit) and public/site.json (email)
```

## Outputs
- `public/graph.json`: Graph data (nodes, edges, archives, topicsByArchive)
- `public/meta.json`: { version (from package.json), commit (from git) }
- `public/site.json`: { emailUser, emailDomain, postsCollection? } (created if missing)
  - `postsCollection` may be a string or array of strings naming the Posts collection(s). Defaults to "Posts" when omitted.

## Versioning
- Version is read from `package.json` (`version`)
- Commit SHA is resolved at build time (via `git rev-parse HEAD`)
- Footer shows `v{version}` and a short SHA linked to GitHub

## Local preview
- Open `index.html` directly in a browser. No dev server is required.

## CI / Deploy
- GitHub Actions workflow: `.github/workflows/pages.yml`
  - Steps: checkout → configure-pages → Node.js 20 + `npm ci` → build-graph → build-meta → upload artifact → deploy

## Troubleshooting
- CI `npm install` fails: if lockfile mismatch occurs, run `npm install` locally and commit the updated lockfile, or realign to `npm ci` usage.
- Graph missing: ensure `npm run build:graph` completes without errors.
- Meta/email not shown: confirm `public/meta.json` and `public/site.json` are generated.
