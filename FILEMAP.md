# File Role Map

Top-level
- index.html — Home (recent posts)
- graph.html — Knowledge graph UI (D3), filters, doc list
- viewer.html — Markdown viewer (secure)
- .nojekyll — Disable Jekyll on Pages
- README.md — Project overview and quickstart
- BUILD.md — Build and versioning guide
- SYSTEM.md — System architecture and data contracts
- FILEMAP.md — This file
- ARCHITECTURE.md — Narrative architecture & decisions
- CONTRIBUTING.md — Contrib workflow and conventions

Public data
- public/graph.json — Built graph data
- public/meta.json — Version + commit (for footer)
- public/site.json — Email parts for footer

Scripts
- scripts/build-graph.js — Parse docs, compute graph, archives/topics
- scripts/build-meta.js — Produce meta/site JSON

Assets
- assets/css/styles.css — Global styles
- assets/js/footer.js — Footer wiring

Automation
- .github/workflows/pages.yml — GitHub Pages deploy pipeline
- .vscode/settings.json — Terminal auto-approve for git/npm/node prompts

Content
- docs/** — Source markdown content. Folders contribute topics; #tags inside docs also become topics.
