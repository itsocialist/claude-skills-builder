# Claude Agent Skills: Architecture Deep Dive

**Source:** [Claude Agent Skills: A First Principles Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/) (Oct 26, 2025)

This document captures key architectural insights into how Claude Agent Skills operate internally, distinct from standard MCP tools.

## 1. Core Concept: Skills as Meta-Tools

Skills are **not** standard executable tools (like `Read` or `Bash`). They are **meta-tools** that inject domain-specific instructions (prompts) into the conversation context.

-   **No Hidden Runtime:** Skills do not run Python/JS code on a hidden server.
-   **Prompt-Based Routing:** Skill selection is performed entirely by Claude's LLM reasoning based on descriptions in the `Skill` tool definition. There is no external "intent classifier" or ML router.
-   **Function:** When invoked, a skill modifies the *conversation context* (injecting prompts) and *execution context* (changing available tools/model).

## 2. The `Skill` Tool (The Meta-Tool)

-   **Skill Tool (Capital S):** The actual tool exposed to Claude's model. It contains the descriptions of all available "skills" (lowercase s).
-   **skills (lowercase s):** The prompt templates (SKILL.md) that the `Skill` tool loads.

## 3. Internal Architecture & Context Injection

### The "Two-Message Pattern" (`isMeta`)
Skills solve the trade-off between user transparency and prompt verbosity using a dual-message system:

1.  **Visible Message (`isMeta: false`):** A concise status update for the user (e.g., "Claude used the Skill tool").
2.  **Hidden Message (`isMeta: true`):** The full, detailed prompt injection from `SKILL.md`. This is sent to the model but hidden from the user's transcript to prevent clutter.

**Flow:**
```
[User Request] -> [Claude Invokes Skill] -> [System Injects Two Messages] -> [Claude Context Updated]
```

### Context Scoping
-   Skills use `role: "user"` with `isMeta: true` rather than `role: "system"`.
-   **Reason:** System messages are global and persistent. Skill instructions should be **temporary** and scoped to the specific task. Using "user" messages allows the context to "fade" or be less easier to override if needed, but primarily it keeps the skill focused.

## 4. Execution Lifecycle Case Study

1.  **Phase 1: Discovery:** Application loads `SKILL.md` files and generates the `Skill` tool description.
2.  **Phase 2: Turn 1 (Routing):** User makes a request. Claude analyzes `Skill` tool description and emits a tool use call (e.g., `command: "internal-comms"`).
3.  **Phase 3: Tool Execution:**
    -   System matches command to `internal-comms/SKILL.md`.
    -   System expands the markdown content.
    -   System injects the **Two-Message** payload.
4.  **Phase 4: Context Update:** Claude receives the new context (with the hidden detailed instructions).
5.  **Phase 5: Task Execution:** Claude executes the task (e.g., using `Bash` or `Write`) guided by the injected skill instructions.

## 5. SKILL.md Structure

Confirms our standard structure:
-   **Frontmatter (YAML):** Configuration (Permissions, Tools, Model).
-   **Content (Markdown):** The prompt instructions for Claude.
