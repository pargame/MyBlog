# Requirements (Snapshot)

User goals
- Personal blog hosted on GitHub Pages
- Knowledge graph view like Obsidian (separate page)
- Homepage shows recent posts, not the graph
	- Only list items within the Posts collection (configurable via site.json `postsCollection`, default "Posts")
- Consistent header/footer; footer shows email + version + commit
- Topic filter: multi-select from folder hierarchy + #tags
- Archive filter: years and months, human-friendly labels
- Graph UX: neighbor highlight on hover, outline on select, stable container height
	- Zoom via native gestures only (no ± buttons)
- Document list synced with filters; clean labels (no stray chars)
- Secure markdown viewer with code highlighting and backlinks
- Git automation that “just works” in VS Code terminal

Non-functional
- Static site (no server)
- Safe content rendering (sanitization)
- Simple build and CI deploy to GitHub Pages

Status
- Implemented and deployed with CI
- Bugs fixed: edge filtering after D3 mutation; graph height jump; archive label polish; doc list label cleanup; topic reset stability

Out of scope for now
- Full-text search
- Dark mode toggle (can be added later)
- Mobile drag physics tuning beyond defaults
