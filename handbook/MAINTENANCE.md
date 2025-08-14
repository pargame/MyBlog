# Maintenance Policy

This document captures conventions that are important for consistency and automation.

## UI language
- All user-facing text must be English.

## Content/document naming
- Primary content folder: `posts/**`. Legacy `docs/**` is still read by the builder, but prefer `posts/`.
- Do not auto-translate domain filenames or headings.
- Wiki links `[[...]]` rely on stable basenames.

## Review checklist
- [ ] UI additions are in English
- [ ] Footer/tooltips in English
- [ ] README/docs consistent with policy
- [ ] Domain files (e.g., `AActor.md`) respect their own conventions


## Auto-publish rule (GitHub Pages)

This site is deployed from the `main` branch. To see changes on the live site, every code/content change must be pushed to `main`.

Operational rule:
- After you edit or generate files in this workspace, always stage, commit, and push.
- Prefer small, focused commits with clear messages.

Standard flow:
1. Stage relevant changes
2. Commit with a descriptive message
3. Push to `origin main`

If the working tree has unrelated untracked content you don't want to publish yet, stage only the files you intend to deploy.
