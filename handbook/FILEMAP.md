# File Role Map

Top-level
- index.html — Home (recent posts)
- graph.html — Knowledge graph UI (D3), filters, doc list
- viewer.html — Markdown viewer (secure)
 - viewer.html — Markdown viewer (secure). Shows title · date · author header
- .nojekyll — Disable Jekyll on Pages
- README.md — Project overview and quickstart
- MAINTENANCE.md — 운영/정책 요약(자세한 단일 출처는 handbook/MAINTENANCE.md)
- handbook/** — All project docs (root duplicates removed)

Public data
- public/graph.json — Built graph data
- public/meta.json — Version + commit (for footer)
- public/site.json — Email parts for footer

Scripts
- scripts/build-graph.js — Parse posts/docs, compute graph, archives/topics
- scripts/build-meta.js — Produce meta/site JSON

Assets
- assets/css/styles.css — Global styles
- assets/js/footer.js — Footer wiring

Automation
- .github/workflows/pages.yml — GitHub Pages deploy pipeline
- .vscode/settings.json — Terminal auto-approve for git/npm/node prompts
	(Duplicate workflows removed; only pages.yml is used)

 Content
- posts/** — Primary blog posts. Folders contribute topics; #tags/front matter become topics.
- docs/** — Legacy archives/notes (still supported)
