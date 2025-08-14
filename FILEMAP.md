# File Role Map

Top-level
- index.html — Home (recent posts)
- graph.html — Knowledge graph UI (D3), filters, doc list
- viewer.html — Markdown viewer (secure). Shows title · date · author header
- .nojekyll — Disable Jekyll on Pages
- README.md — Project overview and quickstart
- handbook/** — Canonical project docs (root files are stubs pointing here)

Public data
- public/graph.json — Built graph data
- public/meta.json — Version + commit (for footer)
- public/site.json — Email parts for footer

Scripts
- scripts/build-graph.js — Parse markdown, compute graph, archives/topics
- scripts/build-meta.js — Produce meta/site JSON

Assets
- assets/css/styles.css — Global styles
- assets/js/footer.js — Footer wiring

Automation
- .github/workflows/pages.yml — GitHub Pages deploy pipeline
- .vscode/settings.json — Terminal auto-approve for git/npm/node prompts

Content
- posts/** — Primary blog posts. Folders contribute topics; #tags/front matter become topics
- docs/** — Legacy archives/notes (still supported)
