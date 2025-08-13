# MyBlog

Personal blog repository. Deployed automatically to GitHub Pages.

## Docs (handbook)
- See all project docs under `handbook/`.
	- BUILD.md — build steps, outputs, versioning
	- SYSTEM.md — architecture, data contracts, behavior
	- FILEMAP.md — file roles overview
	- REQUIREMENTS.md — user requirements snapshot
	- ARCHITECTURE.md — background and decisions
	- CONTRIBUTING.md — contribution workflow
	- MAINTENANCE.md — UI language and content naming policy

## Local preview
It is a static site; simply open `index.html` in a browser.
If you need build outputs (`public/graph.json`, `public/meta.json`):

```
npm install  # if needed
npm run build
```

## Deploy
## Writing posts
- Put Markdown files in the root-level `posts/` folder. Example:
	- `posts/2025/hello-world.md`
	- `posts/notes/some-topic.md`
- The homepage treats items under the Posts collection (by default, everything from `posts/`).
- Legacy content in `docs/` is still supported; prefer `posts/` going forward.
Pushing to `main` triggers GitHub Actions to deploy to Pages automatically.
