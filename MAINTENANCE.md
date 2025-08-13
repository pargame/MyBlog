# Maintenance Policy

This document captures conventions that are important for consistency and automation.

## UI language
- All user-facing text must be English.
- Applies to: page titles, headers, button labels, captions, helper text, tooltips, footer metadata.
- When adding new UI, review strings for English-only naming.

## Content/document naming
- Project content under `docs/**` may follow domain-specific naming rules.
- Example: Unreal-related docs like `AActor.md` retain engine naming semantics (prefixes, casing, etc.).
- Do not auto-translate such filenames or headings.
- When linking with wiki links `[[...]]`, keep the canonical basename stable to avoid broken links.

## Internationalization (future)
- If multi-language UI is desired later, introduce i18n string tables and per-locale builds. For now, English-only is the policy.

## Review checklist
- [ ] UI additions are in English
- [ ] Footer/tooltips in English
- [ ] README/docs consistent with policy
- [ ] Domain files (e.g., `AActor.md`) respect their own conventions
