---
description: "Project Constitution: Anti-Vibe Design, Technical Stack, and Governance Standards"
---

# 1. Anti-Vibe Design Standards (Visual Governance)

> **Mandate:** We actively reject "Vibecoding" (generic, expansive, low-density AI-slop UI).

*   **Density is Quality:** Always prefer high-density, expert-focused interfaces over "clean/minimal" whitespace.
    *   *Rule:* If a component has >40px padding, justify it.
    *   *Rule:* Use compact tables and lists. Avoid "card clouds".
*   **Context Over Content:** Never display data without context (metadata, stats, relationships).
*   **No "Coming Soon":** Never ship placeholder buttons. If it doesn't work, don't show it.
*   **No Unfinished Features:** Do not create UI for unfinished features unless explicitly agreed on with the user and the team. UIs that display placeholder data or non-functional elements are prohibited.
*   **Optimistic UI:** Never use full-screen loading skeletons. Use distinct, localized spinners or optimistic updates.
*   **Color Palette:** Use the "Obsidian" theme (dark mode first). Avoid "Startup Blue" (generic hex codes).

# 2. Technical Standards (The Stack)

*   **Database (Supabase):**
    *   **Client:** ALWAYS use the `supabase-js` client. NEVER use raw `fetch` for DB operations.
    *   **Security:** RLS (Row Level Security) policies are MANDATORY for every new table.
    *   **Procedures:** Use RPCs for complex transactional logic (e.g., `install_skill`).
*   **Frontend (Next.js):**
    *   **Routing:** Use App Router (`/app`).
    *   **State:** Prefer URL state (searchParams) for shareability over local state (useState) for filters/tabs.
    *   **Components:** Use `shadcn/ui` but customize it. Do not leave it default.

# 3. Development Rituals

*   **Sprint Completion:**
    *   NEVER close a sprint without executing the **Sprint Completion Ritual** workflow.
    *   Wait for verified deployment before marking "Done".
*   **Documentation:**
    *   `ADMIN_GUIDE.md` must be updated if new admin features are added.
    *   `task.md` must be kept in sync with reality.

# 4. Critical File Paths
*   **Artifacts:** `/Users/briandawson/.gemini/antigravity/brain/99de8cf2-5430-4084-ab01-8ef319376923/`
*   **Workflows:** `.agent/workflows/`
