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
- **Language**: Narrative in Korean; code/APIs/identifiers in English. Do not translate class/enum/function names.
- **Content Generation**: Maintain a consistent format by referencing other Unreal docs. Prefer concrete, task-focused explanations over theory only.
- **Section template and order** (keep headings as below; omit a section only if truly N/A):
	1) 개요/정의 (한 줄 요약 포함)
	2) 주요 역할 및 책임
	3) 핵심 속성·함수·구성요소 (문서 주제에 맞게 이름 조정: 속성/함수/컴포넌트/서브클래스 등)
	4) 사용 방법·패턴 (또는 “사용 예시”)
	5) 관련 클래스
	6) 코드 예시  ← 반드시 마지막 섹션이며, C++ fenced block로 마무리
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
