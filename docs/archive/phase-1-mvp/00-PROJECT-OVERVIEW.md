# ClaudeSkillsFacet - Project Overview

**Brand Name:** ClaudeSkillsFacet  
**Tagline:** "Build Claude Skills in minutes, not hours"  
**MVP Goal:** Weekend launch - Simple skill builder SaaS tool

## Quick Links

- **Figma Project:** https://www.figma.com/files/team/1276196716415315936/project/521820865
- **SaaS Dashboard Reference:** https://www.figma.com/design/O22AdQ4cdTA7KaU5RUJJgn
- **Ship-ape Context:** All market research, ICP, architecture decisions stored in ship-ape memory under project "claude-skills-builder"

## What We're Building

A SaaS platform that helps non-technical professionals create Claude Skills through a simple form interface. Users fill out a form, click generate, and download a `.zip` file containing their `SKILL.md` ready to upload to Claude.ai.

## Target User (ICP)

**Primary:** Mid-size business owners (co-owner at CRE firm example)
- Semi-technical (uses Word/Excel, not a developer)
- No support staff (no graphics, IT, or EA)
- Creates same documents repeatedly (listings, memos, proposals)
- Values time over money ($29/mo vs hiring assistant)

## Phase 1 MVP Scope (Weekend Launch)

### ✅ IN SCOPE:
- Single-page skill builder form
- Generate SKILL.md from form inputs
- Download as .zip file
- 3 pre-built templates (Real Estate, Legal, Finance)
- Basic landing page with value prop
- 5 blog posts for SEO

### ❌ OUT OF SCOPE (Later phases):
- User accounts/authentication
- Marketplace
- Testing sandbox
- Payments
- Team collaboration

## Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Components:** Shadcn/UI
- **Editor:** Monaco Editor (for instructions)
- **Backend (Phase 2):** Supabase (PostgreSQL + Auth + Storage)
- **Build Pipeline:** Python FastAPI service (generates SKILL.md)
- **Deployment:** Vercel (frontend), Railway/Fly.io (backend)

## Reference Implementations

### CIQ Facets
Location: `/Users/briandawson/workspace/ciq-facets`
- Registry-driven system (scripts/registry.py - 286 lines)
- Build pipeline (scripts/build-skill.py - 237 lines)
- 54 facets across 6 categories
- Modular packaging (core, product, sales, marketing, full)
- **Key files to reference:**
  - `scripts/build-skill.py` - SKILL.md generation logic
  - `scripts/registry.py` - Registry pattern
  - `src/facets/meta/ciq-facet-builder.md` - Meta skill for building skills

### Shape Studio
Location: `/Users/briandawson/workspace/shape-studio`
- React 18 + TypeScript + Vite
- Supabase patterns
- Marketplace UI patterns

## Directory Structure

```
claude-skills-builder/
├── docs/                    # Project documentation (you are here)
├── specs/                   # Technical specifications
├── design/                  # Design files and assets
├── frontend/                # Next.js application (to be created)
├── backend/                 # Python build service (Phase 2)
└── database/                # Supabase migrations (Phase 2)
```

## Development Workflow

1. **Read Documentation:**
   - Start here: `docs/00-PROJECT-OVERVIEW.md`
   - Design specs: `docs/01-DESIGN-SYSTEM.md`
   - Architecture: `docs/02-ARCHITECTURE.md`
   - Implementation guide: `docs/03-IMPLEMENTATION-GUIDE.md`

2. **Access Additional Context:**
   - All market research, ICP discovery, and strategic decisions are stored in ship-ape
   - Query ship-ape for detailed context when needed

3. **Reference Designs:**
   - Use figmadev MCP to connect to Figma project
   - Extract components from SaaS Dashboard reference
   - Get design tokens (colors, spacing, typography)

4. **Build MVP:**
   - Follow `docs/03-IMPLEMENTATION-GUIDE.md`
   - Reference CIQ Facets for YAML/build patterns
   - Keep it simple - no over-engineering

## Success Criteria

MVP is complete when:
- ✅ User can fill form
- ✅ User can click "Generate"
- ✅ User receives downloadable .zip with SKILL.md
- ✅ 3 templates are clickable and load into form
- ✅ Landing page is live with SEO content
- ✅ 5 blog posts are published

## Sprint Backlog

> See **[02-ARCHITECTURE.md](./02-ARCHITECTURE.md#sprint-backlog)** for full backlog

**High Priority:**
- [ ] `ErrorBoundary.tsx` — Wrap Builder/Package routes for crash protection
- [ ] localStorage persistence — Prevent data loss before IndexedDB (Sprint 9)

**Medium Priority:**
- [ ] Test process cleanup (`--timeout` flags)
- [ ] Async validation for large packages

---

## Timeline

- **Day 1 (Saturday):** Setup + Component library + Form UI (8 hours)
- **Day 2 (Sunday):** Generator logic + Templates + Landing page (8 hours)
- **Day 3 (Monday):** Polish + Deploy (2 hours, optional)

## Next Steps

1. Review all docs in `docs/` folder
2. Connect to Figma using figmadev MCP
3. Create Next.js project in `frontend/` directory
4. Start building according to implementation guide

## Questions?

- Check ship-ape memory for strategic context
- Reference CIQ Facets for build patterns
- Use figmadev MCP for design implementation
- All specifications are in this `docs/` folder
