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
-   **Technical Writer:** Review documentation accuracy, update guides, ensure status docs reflect current state.

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

## 6. Staged Deployment Pipeline
**Goal:** Verify in a production-like environment BEFORE merging to main.

### 6.1 Local Validation
-   Run the app locally: `npm run dev`
-   Verify changes in browser (`localhost:3000`).
-   Navigate to related pages (Regression Check).
-   **Gate:** Do not proceed if local validation fails.

### 6.2 Create Release Candidate & Preview
-   Create release branch: `git checkout -b release/sprint-X`
-   Push to remote: `git push origin release/sprint-X`
-   **Action:** Triggers Vercel **Preview Deployment**.

### 6.3 Automated Verification
-   Wait for Vercel Preview URL.
-   Run E2E tests against Preview: `NEXT_PUBLIC_APP_URL=<preview-url> npm run test:e2e`

### 6.4 User Acceptance (UAT)
### 6.4 User Acceptance (UAT)
-   **Action:** Share Preview URL with User/Stakeholders.
-   **Requirement:** Provide a **"User Validation Guide"** in the sprint walkthrough with exact steps/commands for the user to verify features themselves.
-   **Gate:** **STOP.** Wait for explicit User Approval.
-   *User must confirm:* "Preview looks good, approve for Prod."

### 6.5 Production Promotion
-   Merge Pull Request to `main` (only after UAT sign-off).
-   **Verify:** Check `getclaudeskills.ai` (Production) post-deployment.

## 7. GitHub Issues Sync
**Goal:** Keep GitHub Issues as single source of truth for backlog.
-   **Sprint Kickoff:** Create issues for new stories (`gh issue create`)
-   **Sprint Completion:** Close completed issues (`gh issue close #N`)
-   **Labels:** Use `sprint-N`, `priority: high/medium/low`, `enhancement/bug`
-   **Verify:** `gh issue list --state open --label sprint-N` shows only in-progress work

## 8. Architecture & Strategy Sync (CRITICAL)
**Goal:** Ensure technical documentation evolves with the codebase.
-   **Architecture Diagrams:** Update `docs/ARCHITECTURE.md` to represent:
    1.  **Current State:** The actual architecture after sprint changes.
    2.  **Target State:** The planned architecture for the next sprint/phase.
-   **Review:** Ensure diagrams match the implementation in `src/`.
-   **Verify:** Check that no "ghost components" (planned but likely abandoned) remain in diagrams.

