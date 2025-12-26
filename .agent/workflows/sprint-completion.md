---
description: Process for completing a sprint, ensuring quality, consistency, and clean handoff.
---
# Sprint Completion Ritual

This workflow defines the standard procedure for closing a sprint or major feature block.

## 1. Team-Based Architecture & Quality Review
**Goal:** Ensure changes meet the standards of all stakeholders.
-   **Product Manager (PM):** Review feature against requirements.
-   **Frontend Engineer:** Check code quality, component usage, and performance.
-   **UX Designer:** Verify UI consistency, layout (e.g., Shell usage), and "Anti-Vibe" compliance.
-   **DevOps Engineer:** Review build configuration, env vars, and deployment scripts.

*Tool Usage:* Use `ship-ape` to `switch_role` and `execute_as_role` for each stakeholder.

## 2. Directory Structure & Hygiene Review
**Goal:** Maintain a clean project workspace.
-   Audit top-level directories and `docs/`.
-   Identify temporary files, unused scripts, or empty folders.
-   Request user approval before deleting any file.
-   Standardize naming conventions if deviations are found.

## 3. Documentation Consistency Update
**Goal:** Ensure all documentation reflects the "Truth" of the code.
-   **README.md:** Update feature lists and status.
-   **docs/USER_GUIDE.md:** Add instructions for new features.
-   **docs/ADMIN_GUIDE.md:** Update configuration or troubleshooting steps.
-   **docs/00-CURRENT-STATUS.md:** Mark current sprint as Complete and update "Last Updated".

## 4. End-to-End (E2E) Testing
**Goal:** Verify system stability.
-   Run unit tests: `npm run test`
-   Run build check: `npm run build`
-   (If available) Run Playwright/E2E suite.

## 5. Final Commit & Push
**Goal:** Persist changes.
-   Stage changes: `git add .`
-   Commit with conventional message: `git commit -m "chore: complete Sprint X - [Summary]"`
-   Push to remote: `git push`
