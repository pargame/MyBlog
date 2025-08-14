# Maintenance Policy

Operating rules to keep the repo consistent and automated.

## Language policy
- Default: English for everything unless explicitly noted below.
- Chat (this assistant): Korean.
- Blog-facing content (posts under `posts/**` and public docs under `docs/**` that are published): the narrative/explanations are in Korean, but code, APIs, identifiers, commands, and technical keywords stay in English.
- Internal docs (handbook like ARCHITECTURE, MAINTENANCE, BUILD): English.
- Never auto-translate filenames, directories, or data schemas.

Examples
- Commit: `feat(graph): improve search overlay animation` (English)
- PR description/discussion: can explain in Korean, but code and identifiers remain English
- Blog post: paragraphs in Korean, fenced code blocks and inline code/keywords in English

## Content and files
- Primary folder: `posts/**` (recommended). Legacy `docs/**` is still read, but create new content in `posts/`.
- Wiki links `[[...]]` resolve by basename — keep filenames stable.

## Review checklist
- [ ] README/handbook/FILEMAP are up to date
- [ ] Footer (version/commit/email) shows correctly
- [ ] Graph/viewer work (search, focus, overlay)
- [ ] Build artifacts (`public/graph.json`, `public/meta.json`) are current

## Auto deploy (GitHub Pages)
- Pushing to `main` triggers `.github/workflows/pages.yml`.
- Workflow: checkout → configure-pages → Node 20 + npm ci → build-graph → build-meta → upload → deploy

Recommended flow
1) Make changes → 2) optional `npm run build` locally → 3) commit/push → 4) check Actions logs if needed

## Git rules (important)
- Default: stage everything (add -A) → commit → push.
- Aggressively use `.gitignore` to exclude noise; don’t cherry-pick staging to “hide” leftovers.
- Must-ignore generated or personal files, e.g.:
	- `public/meta.json` (generated at deploy)
	- `node_modules/`, `dist/`, `.out/`, `.next/`
	- Logs/cache: `npm-debug.log*`, `yarn-error.log*`, `pnpm-debug.log*`, `.cache/`, `tmp/`, `.temp/`
	- Local/OS/IDE: `.DS_Store`, `.Spotlight-V100`, `.Trashes`, `.idea/`, `.vscode/*` (allow only required exceptions)

Convenience
- VS Code task “Commit & Push (deploy)” or `npm run deploy` performs stage-all + commit + push.

Troubleshooting
- Deploy fails: check npm install/build logs in Actions
- Post missing on Home: ensure node in `public/graph.json` has file under `posts/` and valid front matter (date/author)
- Empty graph: run `scripts/build-graph.js` and ensure `public/graph.json` exists
- One workflow: keep only `.github/workflows/pages.yml`
