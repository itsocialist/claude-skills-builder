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

*Tool Usage:* You MUST use `ship-ape` to `switch_role` and `execute_as_role` for each stakeholder to get their explicit sign-off. Do not skip this.

## 2. Admin Guide & Documentation Update (CRITICAL)
**Goal:** Operational documentation must match code.
-   **Update `docs/ADMIN_GUIDE.md:`** Document new admin features, config changes, or troubleshooting steps.
-   **Readme/Status:** Update `README.md` and `00-CURRENT-STATUS.md`.
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

## 4. GitHub Issues Update
**Goal:** Keep project management in sync with reality.
-   Close completed issues with a comment summarizing work done.
-   Update in-progress issues with current status.
-   Create new issues for bugs discovered or deferred work.
-   Link related PRs to issues.

*Command:* `gh issue list --state open` to view open issues.
*Command:* `gh issue close <number> --comment "Completed in Sprint X"`

## 5. Supabase Migration Sync
**Goal:** Ensure database schema matches codebase expectations.
-   Verify all migrations in `supabase/migrations/` are applied to production.
-   Check for missing tables or columns required by new features.
-   Confirm RLS policies are properly configured.
-   Validate env vars (`SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`) are set in Vercel.

*Command:* `npx supabase db diff` to check for schema drift.
*Command:* `npx supabase db push` to apply pending migrations (if needed).

## 6. End-to-End (E2E) Testing
**Goal:** Verify system stability.
-   Run unit tests: `npm run test`
-   Run build check: `npm run build`
-   (If available) Run Playwright/E2E suite.

## 7. Final Commit & Push
**Goal:** Persist changes.
-   Stage changes: `git add .`
-   Commit with conventional message: `git commit -m "chore: complete Sprint X - [Summary]"`
-   Push to remote: `git push`
