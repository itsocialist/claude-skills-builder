# ClaudeSkillsFacet - Architecture (v2)

**Last Updated:** 2025-12-24

> **Note:** This document supersedes the Phase 1 MVP architecture. Legacy documentation archived in `docs/archive/phase-1-mvp/`.

## Architecture Principles

1. **Modular:** Clear separation of concerns across UI, state, and generation layers
2. **Dark-First:** Global dark theme enforced for Claude brand alignment
3. **Semantic Theming:** CSS variables enable rapid reskinning
4. **Spec-Compliant:** All outputs follow Claude Agent Skills specification
5. **Type-Safe:** TypeScript end-to-end

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js 14 (App Router)                  │
├─────────────────────────────────────────────────────────────┤
│  Routes                                                      │
│  ├── /              → Landing Page                          │
│  ├── /builder       → Skill Builder (single skill)          │
│  ├── /templates     → Template Library (search/filter)      │
│  ├── /templates/[slug] → Template Detail                    │
│  └── /packages/new  → Package Wizard (multi-skill)          │
├─────────────────────────────────────────────────────────────┤
│  Components                                                  │
│  ├── Layout: Shell.tsx (3-column responsive)                │
│  ├── UI: Shadcn/UI (dark mode enforced)                     │
│  ├── Builder: TriggerEditor, InstructionsEditor, Preview    │
│  └── Package: Wizard steps, SkillSelector, ResourceManager  │
├─────────────────────────────────────────────────────────────┤
│  State Management (Zustand)                                  │
│  ├── skillStore     → Individual skill state                │
│  └── packageStore   → Multi-skill package state             │
├─────────────────────────────────────────────────────────────┤
│  Generation Logic (Client-side)                              │
│  ├── skill-generator.ts   → SKILL.md + ZIP creation         │
│  ├── package-generator.ts → Multi-skill bundle              │
│  └── validation.ts        → Spec compliance checking        │
├─────────────────────────────────────────────────────────────┤
│  External Orchestration                                      │
│  └── Ship-ape MCP (Shape Core v0.3.0)                       │
│      ├── Team role management                                │
│      ├── Project context persistence                         │
│      └── Switch → Execute → Handoff workflow                │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
claude-skills-builder/
├── docs/                           # Current documentation
│   ├── 00-CURRENT-STATUS.md        # Sprint status & overview
│   ├── 01-FEATURE-INVENTORY.md     # Complete feature list
│   ├── 02-ARCHITECTURE.md          # This file
│   ├── 03-DESIGN-SYSTEM.md         # Colors, fonts, tokens
│   ├── REFERENCE-CLAUDE-SKILLS-ARCHITECTURE.md # Deep dive into Skills internals
│   └── archive/phase-1-mvp/        # Legacy MVP docs
│
├── frontend/                        # Next.js 14 application
│   ├── src/
│   │   ├── app/                    # App Router pages
│   │   │   ├── page.tsx            # Landing page
│   │   │   ├── builder/page.tsx    # Skill builder
│   │   │   ├── templates/          # Template routes
│   │   │   └── packages/new/       # Package wizard
│   │   ├── components/
│   │   │   ├── ui/                 # Shadcn/UI components
│   │   │   ├── layout/             # Shell.tsx
│   │   │   ├── builder/            # Builder-specific
│   │   │   └── package/            # Package-specific
│   │   ├── lib/
│   │   │   ├── store/              # Zustand stores
│   │   │   ├── utils/              # Generators, validation
│   │   │   └── templates.ts        # Template registry
│   │   └── types/                  # TypeScript interfaces
│   └── public/                     # Static assets
│
├── DEVELOPER-HANDOFF.md            # Quick-start for devs
├── SHIPAPE_INTEGRATION_BRIEF.md    # Market research
└── README.md                       # Repository overview
```

## Key TypeScript Types

```typescript
// types/skill.types.ts

export interface Skill {
  name: string;
  description: string;
  category: string;
  tags: string[];
  triggers: string[];
  instructions: string;
  examples?: Example[];
  resources?: Resource[];
}

export interface Resource {
  name: string;
  type: 'resource' | 'example' | 'template' | 'script';
  content: string;
}

export interface Package {
  name: string;
  description: string;
  version: string;
  skills: Skill[];
  triggerIndex: TriggerEntry[];
}
```

## Data Flow

### Individual Skill Generation
```
User fills form
      ↓
skillStore (Zustand reactive state)
      ↓
validation.ts (real-time feedback)
      ↓
Click "Generate Skill"
      ↓
skill-generator.ts
  ├── slugifySkillName()
  ├── generateFrontmatter()
  ├── combineWithInstructions()
  └── createZip() with folders
      ↓
Browser download (.zip)
```

### Package Bundle Generation
```
Select skills in wizard
      ↓
packageStore (Zustand)
      ↓
Configure package metadata
      ↓
Click "Generate Package"
      ↓
package-generator.ts
  ├── generateTriggerIndex()
  ├── compileSingleSKILLmd()
  └── bundleAllResources()
      ↓
Browser download (.zip)
```

## Shell Layout (3-Column)

```
┌──────────────────────────────────────────────────────────────┐
│ Header (sticky, h-14)                                        │
│ [Logo] [Editable Title] [Saved ✓] │ [Actions]                │
├────────────┬─────────────────────────────────┬───────────────┤
│ Sidebar    │ Main Content                    │ Inspector     │
│ (240px)    │ (flex-1)                        │ (400px)       │
│            │                                 │               │
│ • Home     │ [Route Content]                 │ [Tabs]        │
│ • Builder  │                                 │ • Export      │
│ • Templates│                                 │ • Config      │
│ • Packages │                                 │               │
│            │                                 │ [Preview]     │
│            │                                 │               │
│            │                                 │ [Actions]     │
├────────────┴─────────────────────────────────┴───────────────┤
│ Status Bar (h-10) - Validation feedback                      │
└──────────────────────────────────────────────────────────────┘
```

## Testing Strategy

### Unit Tests (Vitest)
- `skill-generator.test.ts` - SKILL.md generation
- `validation.test.ts` - Spec compliance rules
- `Home.test.tsx` - Landing page rendering

### E2E Tests (Playwright)
- Complete user flow: Landing → Template → Builder → Download
- Template pre-fill verification
- Package wizard completion

### Configuration
```typescript
// vitest.config.mts
exclude: ['**/node_modules/**', '**/e2e/**']
```

## Deployment

### Current State
- **Frontend:** Vercel (auto-deploy from GitHub)
- **Backend:** Client-side only (no server)
- **Database:** None (future: Supabase in Sprint 5)

### CI/CD
- GitHub Actions for test automation
- Commit policy: "Push after every Sprint"

## Orchestration (Ship-ape)

The project uses Ship-ape MCP for team coordination:

### Active Roles
| Role ID | Name | Focus Areas |
|---------|------|-------------|
| `frontend-engineer` | Frontend Engineer | React, TypeScript, UI |
| `ux-designer` | UX Designer | Design specs, layouts |
| `docs-expert` | Documentation Expert | Docs, guides |
| `devops` | DevOps Engineer | CI/CD, deployment |
| `product` | Product Manager | Roadmap, features |

### Workflow Pattern
```
switch_role(project, role_id)
      ↓
execute_as_role(task)
      ↓
create_role_handoff(to_role, summary)
```

## References

- [Claude Agent Skills: A First Principles Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)
