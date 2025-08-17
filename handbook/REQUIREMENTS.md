## Requirements (snapshot)

User goals
- Personal blog hosted on GitHub Pages
- Knowledge graph view (separate page) similar to Obsidian
- Homepage shows recent posts (not the graph)
	- Only include items from the Posts collection (configurable via `public/site.json` → `postsCollection`, default "Posts")
- Consistent header and footer; footer shows email, version, and commit
- Topic filter: multi-select from folder hierarchy plus `#tags`
- Archive filter: years and months with human-friendly labels
- Graph UX: neighbor highlight on hover, outline on select, stable container height
	- Zoom via native gestures only (no ± buttons)
- Document list synchronizes with filters; labels should be clean (no stray chars)
- Secure Markdown viewer with code highlighting and backlinks
- Git automation that works smoothly in the VS Code terminal

Non-functional requirements
- Static site (no server)
- Safe content rendering (sanitization)
- Simple build and CI deploy to GitHub Pages

Status
- Implemented and deployed with CI
- Recent fixes: edge filtering after D3 mutation, graph height jump, archive label polish, doc list label cleanup, topic reset stability

Out of scope for now
- Full-text search
- Dark mode toggle (can be added later)
- Mobile drag physics tuning beyond defaults
