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

Examples

## Content and files

## Review checklist
### Final compliance check (pre-PR workflow)

Before opening a PR that modifies documentation or archive content, run this short, repeatable workflow to ensure the change complies with handbook rules and repository tooling.

Checklist (run all steps locally in the repo root):

- [ ] Lint and quick fixes
	- Run the built-in markdown fixers:
		- `npm run fix:md:bold`
		- `npm run fix:bullets`

- [ ] Build metadata and graph
	- Ensure graph/meta are regenerated so link checks pick up new files:
		- `npm run build` (this runs `build-graph` and `build-meta`)

- [ ] Frontmatter and language rules
	- Verify frontmatter follows archive rules:
		- `docs/Unreal/` files must keep an empty YAML frontmatter header (two `---` lines with nothing between).
		- Other archives (e.g., `docs/Computer Architecture/`) should include a `title` field in YAML frontmatter.
	- Quick check: search for files missing `title` where they shouldn't be:
		- `rg "^---\n(?!title:)" -n docs/Computer\ Architecture || true`

- [ ] Links and missing stubs
	- Confirm all relative and wiki links resolve. If a link points to a missing file, create a stub with frontmatter only.
	- Helpful command to find unresolved markdown links (heuristic):
		- `node scripts/build-graph.js && rg "\[.*\]\([^)]*\.md\)" -n | while read -r l; do file=$(echo "$l" | sed -E 's/.*\(([^)]*\.md)\).*/\1/'); [ -f "$file" ] || echo "MISSING: $file"; done`

- [ ] Quick content checks
	- Confirm narrative language follows archive-specific rules (Korean vs English guidance) and that technical terms remain in English.
	- Ensure no TODO markers remain that indicate unfinished work.

- [ ] Commit message and final push
	- Use the commit format: `docs(arch): <short description>`.
	- If the change is only stubs or minor fixes, mention it in the PR description and link to the maintenance checklist.

If any of the checks fail, fix locally and repeat the steps until all boxes pass.

Notes:
- This workflow is intentionally minimal and fast; CI runs a fuller validation on PRs. The goal is to reduce obvious, avoidable churn (broken links, wrong frontmatter, or missed metadata updates) before creating a PR.
- If you need to exempt a change (for example, intentionally adding an English file to a Korean archive for a specific reason), note the exception in the PR description and mention the reviewer.
## Computer Architecture archive rules
Guidelines for documents inside `docs/Computer Architecture/`:

- Document language: write narrative text in Korean; keep code, API names, identifiers and technical keywords in English (e.g., RAID, DRAM, LRU, cache line, ISR).
- File location and naming: place Markdown files under `docs/Computer Architecture/` and use a numeric prefix with a concise slug, e.g. `01_overview.md`, `03_cpu_interrupts.md`.
- Section structure: include a short quoted summary and clear sections for role, attributes/components, usage patterns, and examples; omit sections only if truly N/A.
- Linking and references: use relative or wiki-style links (`[title](03_cpu.md)` or `[[Term]]`). Do not add links inside code fences.
- Code and diagrams: pseudo-code, short C/C++ examples, and ASCII diagrams are allowed. Store images under `assets/images/architecture/` and reference them by relative path.
-- Frontmatter: if using YAML frontmatter, include at least `title` (optional `date`, `tags` recommended).
	- Exception: the `docs/Unreal/` archive requires an empty YAML frontmatter header (two `---` lines with nothing between) to satisfy legacy tooling; do not add `title` to Unreal docs unless a maintainer explicitly changes the Unreal formatting rules.
	- Recommendation: other archives (including `docs/Computer Architecture/`) should include `title` in frontmatter to improve search, meta generation, and consistency.
- Pre-PR checklist: verify Korean grammar/spelling, English technical terms retained, links resolve or stubs created, code blocks correctly fenced, and remove TODOs.
- Commit message convention: `docs(arch): <short description>`.
- Missing linked files: create a stub file containing only frontmatter for the missing document.
*** End Patch
- [ ] Build artifacts (`public/graph.json`, `public/meta.json`) are current

### Publishing & graph checklist

When a change affects documentation structure (new archive folder, new files, renamed files, or frontmatter changes), follow these extra steps to ensure the visual graph and GitHub Pages reflect the change:

- Regenerate graph and metadata locally
	- `npm run build` (this runs `build-graph` and `build-meta`) — this rewrites `public/graph.json` and `public/meta.json` in your working copy.

- Verify the generated graph contains the expected archive and nodes
	- Open `public/graph.json` and search for the archive name (e.g., `"Computer Architecture"`) or the new document `id`.
	- Confirm `nodes` include entries with `archive` set correctly and `file` paths pointing to the intended docs.

- Understand `public/` artifacts are ignored by default
	- The repository intentionally ignores `public/graph.json` and `public/meta.json` to avoid committing build artifacts.
	- Because of this, pushing a content-only commit may not update the published site immediately if the Pages workflow expects new artifacts. Options to trigger a Pages deploy:
		- Re-run the Pages workflow in GitHub Actions (Actions → select run → Re-run jobs). This is the preferred method.
		- Create an empty commit to the branch to force a workflow trigger: `git commit --allow-empty -m "ci: trigger GitHub Pages redeploy" && git push origin main`.
		- (Not recommended) Commit `public/*` artifacts if you have a maintained workflow that tracks them.

- Check GitHub Actions / Pages logs when the site doesn't refresh
	- Visit Actions → "Deploy to GitHub Pages" and inspect the latest run; check the `Build` and `Deploy` steps for errors and for the `page_url` output.
	- Common failures: dependency installation error, script exception during `build-graph`/`build-meta`, permission issues for Pages (check repository settings and workflow permissions).

- Graph UI notes
	- The graph builder derives `archive` from the first folder under `docs/` or `posts/`. Ensure folder names are correct (no leading/trailing spaces) and files are placed under `docs/<ArchiveName>/`.
	- If an archive is present in `public/graph.json` but not visible in the graph UI, check `graph.html` archive selector logic — by default the UI may prefer a specific archive (e.g., `Unreal`); modify the selector to show all archives if you want every archive visible in the overlay.

- Quick troubleshooting flow
	1. Locally: `npm run build` → inspect `public/graph.json` for nodes/archives. If missing, check document frontmatter and file paths. Ensure title/frontmatter rules are followed.
 2. If graph is correct locally, re-run Pages workflow or push an empty commit to retrigger deployment.
 3. If deployment fails, copy the Actions failure log and attach it to the PR or send it to a maintainer for analysis.

