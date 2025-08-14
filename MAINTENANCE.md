# Maintenance rules

This repo is auto-published via GitHub Pages. To see changes on the live site, every code/content change must be pushed to the `main` branch.

Operational rule:
- After you edit or generate files in this workspace, always stage, commit, and push.
- Prefer small, focused commits. Include a clear message.

Standard flow (performed automatically by the assistant):
1. Stage relevant changes
2. Commit with a descriptive message
3. Push to `origin main`

If the working tree has unrelated untracked content you don't want to publish yet, stage only the files you intend to deploy.

CI/Deploy: GitHub Pages uses the files in this branch; there is no separate build step unless you add one later.
