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

## Unreal Engine Archive Rules
- Scope: Applies to all Markdown under `docs/Unreal/**`.

- Content structure (section template)
	1. Overview: one-line Korean summary in a blockquote describing the concept.
	2. Roles & Responsibilities: what it is for; keep bullets concise.
	3. Core API: key properties/components/functions with a short explanation.
	4. Usage patterns: common scenarios, do/don'ts, and small tips.
	5. Related: link to closely related classes/types.
	6. 코드 예시: one focused C++ snippet that compiles in-context; no wiki links inside code.

- Linking conventions
	- Use wiki links `[[Name]]` for Unreal terms (classes U*/A*/F*, systems, keywords).
	- Do NOT use links inside fenced code blocks.
	- Self-references must be backticks, not links (e.g., `AActor` in `AActor.md`).
	- If a linked page doesnt exist, create an empty stub `docs/Unreal/Name.md` (title later).

- Language & style
	- Narrative/explanations: Korean. Code, identifiers, APIs, and keywords: English.
	- Keep bullets short; prefer examples over theory. Avoid duplication across pages.

- Code example rules
	- Always end the page with a fenced C++ example when applicable (```cpp ... ```).
	- No trailing text after the final code block.
	- Show realistic includes and minimal surrounding context; avoid pseudo-code.

- Validation checklist (per file)
	- [ ] Overview exists and is Korean, concise, and accurate.
	- [ ] Sections present (2-5) with meaningful bullets; no empty headings.
	- [ ] All Unreal terms linked via `[[ ]]`; self-reference uses backticks.
	- [ ] Final section is "코드 예시" with C++ code; no links inside code.
	- [ ] No orphan links (create missing stubs if needed).
	- [ ] No code block preceding content (example appears at the very end).

Convenience
- VS Code task “Commit & Push (deploy)” or `npm run deploy` performs stage-all + commit + push.

Troubleshooting
- Deploy fails: check npm install/build logs in Actions
- Post missing on Home: ensure node in `public/graph.json` has file under `posts/` and valid front matter (date/author)
- Empty graph: run `scripts/build-graph.js` and ensure `public/graph.json` exists
- One workflow: keep only `.github/workflows/pages.yml`
