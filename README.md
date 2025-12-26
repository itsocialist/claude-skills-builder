# ClaudeSkillsFacet

**Claude Skills: Find, Build and Bundle**

An enterprise skill management platform for creating, validating, and bundling Claude Skills with real-time spec compliance.

## 🚀 Current Status

| Sprint | Status |
|--------|--------|
| Sprint 1: Builder Polish | ✅ Complete |
| Sprint 2: Templates & Editor | ✅ Complete |
| Sprint 3: Bundling & Package Builder | ✅ Complete |
| Sprint 3.5: Full Skills Spec Support | ✅ Complete |
| Sprint 4+: SDK Testing & Beyond | 🔜 Planned |

## 📁 Project Structure

```
claude-skills-builder/
├── docs/                           # Current documentation
│   ├── 00-CURRENT-STATUS.md        # Sprint status & overview
│   ├── 01-FEATURE-INVENTORY.md     # All delivered features
│   ├── 02-ARCHITECTURE.md          # System design
│   ├── 03-DESIGN-SYSTEM.md         # Colors, fonts, tokens
│   └── archive/phase-1-mvp/        # Legacy MVP docs
│
├── frontend/                        # Next.js 14 application
│   ├── src/app/                    # App Router pages
│   ├── src/components/             # UI components
│   └── src/lib/                    # Stores & utilities
│
├── DEVELOPER-HANDOFF.md            # Quick-start guide
└── SHIPAPE_INTEGRATION_BRIEF.md    # Market research
```

## 🎯 Key Features

### Individual Skill Builder (`/builder`)
- Monaco markdown editor with dark theme
- Real-time validation engine
- Markdown preview with split view
- Skill snippets library
- Resource Manager (resources/, examples/, config.yaml)

### Template Library (`/templates`)
- 6 industry-specific templates
- Keyword search and category filters
- One-click "Use Template" pre-fill

### Package Builder (`/packages/new`)
- Multi-skill bundling wizard
- Auto-generated trigger index
- Modular ZIP packaging

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Dark Mode |
| Components | Shadcn/UI |
| State | Zustand |
| Editor | Monaco Editor |
| Testing | Vitest + Playwright |
| Orchestration | Ship-ape MCP (Shape Core) |

## 🎨 Design System

- **Primary:** Anthropic Crail `#C15F3C`
- **Background:** Dark mode `#1a1a1a`
- **Fonts:** Inter (sans), JetBrains Mono (mono)
- **Theme:** Dark mode enforced globally

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [00-CURRENT-STATUS.md](docs/00-CURRENT-STATUS.md) | Sprint status & roadmap |
| [01-FEATURE-INVENTORY.md](docs/01-FEATURE-INVENTORY.md) | Complete feature list |
| [02-ARCHITECTURE.md](docs/02-ARCHITECTURE.md) | System architecture |
| [REFERENCE-CLAUDE-SKILLS-ARCHITECTURE.md](docs/REFERENCE-CLAUDE-SKILLS-ARCHITECTURE.md) | Deep Dive: Agent Skills Architecture |
| [03-DESIGN-SYSTEM.md](docs/03-DESIGN-SYSTEM.md) | Design tokens & patterns |

## 🚦 Quick Start

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test        # Unit tests (Vitest)
npx playwright test # E2E tests
```

## 📊 Project Context

All context stored in Ship-ape under project `claude-skills-builder`:

```bash
# Get current status
ship-ape get_project_context --project_name="claude-skills-builder"

# Search for specific topics
ship-ape search_context \
  --project_name="claude-skills-builder" \
  --query="sprint roadmap"
```

## 🔗 Resources

- **GitHub:** https://github.com/itsocialist/claude-skills-builder
- **Local:** `/Users/briandawson/workspace/claude-skills-builder`
- **Reference:** CIQ Facets at `/Users/briandawson/workspace/ciq-facets`

## 📋 Sprint Roadmap

See [00-CURRENT-STATUS.md](docs/00-CURRENT-STATUS.md#current-sprint-status) for the full 13-sprint roadmap including:
- Sprint 4: SDK Testing & Validation
- Sprint 5: Authentication & User Library
- Sprint 6-8: Claude Code, MCP Tools, Chaining
- Sprint 9-13: Enterprise features, Legal, Analytics

---

**Next Steps:** Run `npm run dev` in `frontend/` and open http://localhost:3000
