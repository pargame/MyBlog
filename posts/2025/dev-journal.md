---
title: Blog Development Journal
date: 2025-08-13
author: Pargame
tags: [devlog, blog]
---

# Blog Development Journal

A running log of building and polishing this blog.

## Highlights
- GitHub Pages deployment and minimal static scaffold
- Knowledge Graph page using D3.js (hover neighbors, select outline)
- Markdown builder: parses frontmatter tags/date, backlinks via [[WikiLinks]]
- Viewer security: DOMPurify + marked + highlight.js
- Collections split: posts/ (home) vs docs/Unreal (graph-only)
- Homepage shows only posts, excludes README/index
- Footer: version/commit + obfuscated email display

## Recent changes (2025-08-13)
- Fixed viewer to load markdown via graph node file path
- Scoped wiki-link resolution by archive/topic context
- Separated Posts from the Graph; added All archive option
- Cleaned Topics: removed root labels; posts filtered by file path
- Homepage now shows author and date for posts

## Next
- Add RSS feed
- Add search across posts
- Improve mobile graph interactions

Back to [[AActor]] or [[APawn]] for Unreal docs.
