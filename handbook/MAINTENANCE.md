## 2025-08-15 — Docs formatting fix, faster commits, workflow cleanup

Changes made:

- Pre-commit performance: `.git/hooks/pre-commit` now runs a local build only when docs/scripts are staged. You can skip it with `SKIP_PRECOMMIT=1` or `--no-verify`. CI is unaffected.
- GitHub Pages: duplicate workflow `.github/workflows/page.yml` removed to avoid double deploys. Keep `pages.yml` only.
- Markdown formatting fixer added: `scripts/fix-markdown-bold.js` normalizes bullets where bold markers were split across lines (e.g., `* **Label:\n** Body` -> `* **Label:** Body`).

How to use the fixer:

- Run once locally: `npm run fix:md:bold`
- Verify no remaining broken bullets:
	- Search pattern: a bullet line ending with `:` followed by a line starting with `**`.
	- Example grep: `rg -n "^\s*\*\s+\*\*[^\n]*:\s*$\n\*\*\s" docs/Unreal`


Notes:

- The fixer is conservative (bulleted lists only) to avoid unintended changes. Expand if needed.

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

## Unreal Engine Archive Rules(Read docs/Unreal/AActor.md for example)
**Formatting:**
- Every Unreal Archive doc must start with two blank front matter delimiters (`---` on two lines), with nothing between them.
- Bullet label style is strict. After a bold label ending with a colon, break to a new line, then indent the description with a single tab. Example:
```
* **Label(In English if needed):**
	Description starts here, on a new line.
```
- To enforce this, run: `npm run fix:bullets` (skips code fences and preserves existing indentation level for bullets; only adds a tab on the following line).
- **Language**: Narrative in Korean; code/APIs/identifiers in English. Do not translate class/enum/function names.
- **Content Generation**: Maintain a consistent format by referencing other Unreal docs. Prefer concrete, task-focused explanations over theory only.
- **Section template and order** (keep headings as below; omit a section only if truly N/A):
	>인용구 전체 문서에 대한 한 줄 요약
	* 주요 역할 및 책임
	> 인용구 현재 라벨에 대한 한 줄 요약
	* 핵심 속성·함수·구성요소 (문서 주제에 맞게 이름 조정: 속성/함수/컴포넌트/서브클래스 등)
	> 인용구 현재 라벨에 대한 한 줄 요약
	* 사용 패턴 및 워크플로우
	> 인용구 현재 라벨에 대한 한 줄 요약
	* 코드 예시  ← C++ fenced block로 마무리
	> 인용구 현재 라벨에 대한 한 줄 요약
- **Linking**:
	- Unreal terms (U/A/F/I… prefixes, subsystems, common nouns like Event) link via `[[Term]]`.
	- Do not link inside code blocks.
	- Self-reference uses backticks (e.g., `AActor` within `AActor.md`).
- **New File Creation**: If a linked document is missing, create an empty stub file with just front matter for now.
- **Code Examples**: Add one focused C++ example at the end (compile-realistic, safe defaults). No extra text after the fence.
- **Review checks for every doc**:
	- Headings follow the template and numbering is continuous.
	- No dangling TODOs; related links resolve (create stubs if needed).
	- No wiki links in code; no images or assets that aren’t in repo.
	- Code fence is the last content in the file.

Convenience
- VS Code task “Commit & Push (deploy)” or `npm run deploy` performs stage-all + commit + push.

Troubleshooting
- Deploy fails: check npm install/build logs in Actions
- Post missing on Home: ensure node in `public/graph.json` has file under `posts/` and valid front matter (date/author)
- Empty graph: run `scripts/build-graph.js` and ensure `public/graph.json` exists
- One workflow: keep only `.github/workflows/pages.yml`

## Docs automation: Unreal formatting & summaries

To keep `docs/Unreal` consistent and review-ready we've added a small suite of Node.js helpers in `scripts/` that audit and (optionally) fix common formatting issues and generate concise, expert-style summaries.

Files (scripts) and purpose
- `scripts/check-unreal-docs.js` — audit-only checker. Reports: missing blockquotes after H2/H3, inline-label cases, and description-indent problems. Exit code is 0 and prints a summary; treat any reported issues as actionable.
- `scripts/fix-unreal-blockquotes.js` — inserts blockquote lines after H2/H3 when missing (skips when a blockquote already exists). Safe to run repeatedly.
- `scripts/fix-unreal-descriptions-indent.js` — normalizes bulleted label/description pairs: converts inline label+desc to label + tab-indented description and indents multi-line description paragraphs.
- `scripts/fix-markdown-bullets-break.js` — normalizes split bold/label bullets (existing checker/fixer kept for backward-compatibility).
- `scripts/apply-rep-summaries.js` — (one-shot) apply a representative summary (heading-based) after section headings across the archive.
- `scripts/regen-summaries-from-section.js` — replace heading-duplicate summaries by extracting the first sentence of the section as the summary.
- `scripts/regenerate-expert-summaries.js` — produce a short, expert-style summary (first sentence + practical tip) and write it as the section blockquote.
- `scripts/fill-empty-unreal.js` — create a maintenance-style template for empty or near-empty Unreal docs (keeps required front-matter and sections).

How to run (local)
- Audit only (safe):

```bash
node scripts/check-unreal-docs.js
```

- Fix missing summaries/formatting (idempotent-ish, safe to run locally):

```bash
node scripts/fix-unreal-blockquotes.js
node scripts/fix-unreal-descriptions-indent.js
node scripts/fix-markdown-bullets-break.js
```

- Generate or refresh summaries (review before commit):

```bash
# Representative summaries (heading-based)
node scripts/apply-rep-summaries.js

# Replace with section-first-sentence (better context)
node scripts/regen-summaries-from-section.js

# Or generate expert-style summaries (first sentence + practical tip)
node scripts/regenerate-expert-summaries.js
```

- Create stubs for empty docs (if you add new links):

```bash
node scripts/fill-empty-unreal.js
```

Verification & quality gate
- After any fixer or summary generation, run `node scripts/check-unreal-docs.js` to verify no style regressions. The checker prints a per-file report; aim for `Files with issues: 0` before committing.
- Quick manual spot-check: open a handful of `docs/Unreal/*.md` pages and confirm the inserted blockquote reads naturally — scripts try to be conservative but automatic text can need a human pass.

Recommended CI (example)
- Add a lightweight GitHub Action step on PRs that runs the checker and fails the job when issues are found. Pseudocode:

```yaml
# run only on PRs
- name: Check Unreal docs
	run: node scripts/check-unreal-docs.js
```

- Optionally provide an automated fixer step in a separate job that creates a branch/PR with suggested fixes (advanced).

Commit guidance
- Run the check locally, run whichever fixers you want, review diffs, then commit. Example commit msg: `chore(docs): normalize Unreal doc formatting and regenerate summaries`.

Notes and safety
- These scripts are designed to be low-risk: they preserve code fences and avoid editing code blocks. They may still make content changes (summary replacement) — review those before committing. Keep a human review step for any large automated rewrite.
- The handbook remains the canonical source for formatting rules; update this section if the scripts' behavior changes.
