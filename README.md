# MyBlog

Personal blog repository. Deployed automatically to GitHub Pages.

## Docs
- [BUILD.md](BUILD.md) — build steps, outputs, versioning
- [SYSTEM.md](SYSTEM.md) — architecture, data contracts, behavior
- [FILEMAP.md](FILEMAP.md) — file roles overview
- [REQUIREMENTS.md](REQUIREMENTS.md) — user requirements snapshot
- [ARCHITECTURE.md](ARCHITECTURE.md) — background and decisions
- [CONTRIBUTING.md](CONTRIBUTING.md) — contribution workflow
 - [MAINTENANCE.md](MAINTENANCE.md) — UI language and content naming policy

## Local preview
It is a static site; simply open `index.html` in a browser.
If you need build outputs (`public/graph.json`, `public/meta.json`):

```
npm install  # if needed
npm run build
```

## Deploy
Pushing to `main` triggers GitHub Actions to deploy to Pages automatically.
