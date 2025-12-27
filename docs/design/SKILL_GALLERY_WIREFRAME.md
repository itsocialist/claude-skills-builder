# design: Skill Gallery Wireframe (Cake-First)

**Status**: Draft Design
**Related Issue**: #34
**Strategy**: [Show the Cake](../MARKETING-PRODUCT-DISCOVERY.md)

## Visual Concept
The core pivot is shifting the user's mental model from "choosing a tool" to "choosing an outcome".

![Skill Gallery Mockup](gallery_mockup_v1.png)

## Component Breakdown

### 1. Hero Section
*   **Headline**: "What do you want to make today?"
*   **Subtext**: "Choose a starting point. We'll handle the rest."
*   **Visual**: Clean, centered, ample whitespace. No technical jargon.

### 2. Gallery Grid
*   **Layout**: 3-column grid (desktop), responsive to 1-column (mobile).
*   **Card Design**:
    *   **Hero Image**: A high-fidelity preview of the *output*.
        *   *Example*: A PDF document with visible charts (not a generic file icon).
        *   *Example*: A spreadsheet with data bars and conditional formatting.
    *   **Title**: The name of the *artifact* (e.g., "Growth Strategy Plan"), not the skill.
    *   **Metadata**: File type (PDF, XLSX, JPG) and size estimate.
    *   **Action**: "Clone" or "Make this".

### 3. Interaction Model
*   **Hover State**:
    *   The card lifts slightly.
    *   A tooltip or overlay reveals the "recipe" (e.g., "Powered by Web Search + Deepseek").
    *   This satisfies curiosity without cluttering the primary view.
*   **Click Action**:
    *   Opens the "Interactive Onboarding" flow (see Issue #36).
    *   Does *not* dump the user into a code editor.

## Copy Strategy
| Old Way (Technocentric) | New Way (Outcome-Centric) |
| :--- | :--- |
| "Financial Analyst Agent" | "Q3 Project Timeline" |
| "Web Scraper Skill" | "Competitor Analysis Report" |
| "Image Gen MCP" | "Ad Campaign Assets" |
