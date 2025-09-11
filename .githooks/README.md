Repository Git hooks path: .githooks

This folder contains recommended local Git hooks and instructions to enable them.

Why use local hooks?

- They help automate checks (lint, tests) before commits or pushes without enforcing on the server.
- Keeping hooks in the repository makes it easy for contributors to opt-in.

How to enable

1. Ensure git config core.hooksPath is set to .githooks (already configured locally in this repo).
2. Make hooks executable:
   chmod +x .githooks/\*

Included sample hooks

- pre-commit: runs ESLint and Prettier on staged files
- pre-push: runs a quick build (vite) to catch obvious issues before pushing

Customization

- Edit the scripts to adapt to your workflow. If CI enforces checks, keep local hooks lightweight to avoid friction.

Notes

- Hooks in .githooks are not automatically shared as enforced rules. Team members must enable core.hooksPath in their local clone or set it globally if desired.
- For stronger enforcement, consider adding GitHub Actions for PR checks.
