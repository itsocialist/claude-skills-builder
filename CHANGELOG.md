# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.14.0] - 2025-12-26
### Added
- **Curated Discovery:** Staff Picks section and badges for high-quality skills (#14.6).
- **Creator Profiles:** Public profile pages at `/creator/[username]` showcasing user skills (#14.1).
- **Skill Ratings:** 5-star rating and review system with average calculation (#14.2).
- **Local Import:** "Import" button in Builder supporting drag-and-drop `.md` import (#14.3).

### Changed
- **Rebranding:** Renamed platform to **GetClaudeSkills** (metadata, config, context) (#14.4).
- **Navigation:** Standardized "My Library" to **"My Skills"** across all menus (#14.5).
- **UI:** Refactored `ImportSkillModal` and `ReviewModal` to use `Sheet` component for better stability.

### Fixed
- Fixed `dialog` component build error by migrating to `Sheet`.
- Fixed hydration mismatch in Marketplace (via environment config updates).

## [0.13.0] - 2025-12-20
### Added
- Marketplace MVP with public gallery.
- One-click install for skills.
- "Publish to Marketplace" flow.
