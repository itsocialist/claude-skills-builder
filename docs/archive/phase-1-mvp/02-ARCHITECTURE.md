# Architecture - ClaudeSkillsFacet

> **Note:** For complete architecture documentation, query ship-ape memory:  
> `search_context(project_name="claude-skills-builder", query="architecture")`

## Architecture Principles

1. **Modular:** Clear separation of concerns across 5 layers
2. **SaaS-First:** Multi-tenant ready, scalable, maintainable
3. **Not Overengineered:** Simple solutions, YAGNI principle
4. **Documented:** JSDoc, OpenAPI, README files, ADRs
5. **Type-Safe:** TypeScript end-to-end

## Five-Layer Architecture

```
Layer 1: UI Components (presentational, dumb components)
         ↓
Layer 2: Business Logic (hooks, services, state management)
         ↓
Layer 3: API Layer (backend routes, documented with OpenAPI)
         ↓
Layer 4: Database Layer (Supabase queries, migrations)
         ↓
Layer 5: External Services (Python builder, storage)
```

## Directory Structure

```
claude-skills-builder/
├── frontend/                       # Next.js 14 App Router
│   ├── app/
│   │   ├── page.tsx                # Landing page
│   │   ├── builder/
│   │   │   └── page.tsx            # Skill builder form (MVP focus)
│   │   ├── templates/
│   │   │   └── [slug]/page.tsx    # Template detail pages
│   │   └── blog/
│   │       └── [slug]/page.tsx    # Blog posts (MDX)
│   ├── components/
│   │   ├── ui/                     # Layer 1: Presentational Components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Tag.tsx
│   │   │   └── Select.tsx
│   │   └── features/               # Feature-specific components
│   │       ├── builder/
│   │       │   ├── SkillForm.tsx
│   │       │   ├── TriggerEditor.tsx
│   │       │   └── InstructionsEditor.tsx
│   │       ├── marketplace/        # Phase 2
│   │       │   ├── SkillCard.tsx
│   │       │   └── SkillGrid.tsx
│   │       └── packager/           # Phase 2
│   │           └── PackageBuilder.tsx
│   ├── lib/                        # Layer 2: Business Logic
│   │   ├── hooks/
│   │   │   ├── useSkillBuilder.ts
│   │   │   └── useTemplates.ts
│   │   ├── services/               # API clients (Phase 2)
│   │   │   ├── skills.service.ts
│   │   │   └── builder.service.ts
│   │   ├── utils/
│   │   │   ├── skill-generator.ts  # MVP: Core generator logic
│   │   │   ├── validation.ts
│   │   │   └── templates.ts        # MVP: Template definitions
│   │   └── store/                  # State management (Zustand)
│   │       └── skillStore.ts
│   ├── types/
│   │   ├── skill.types.ts
│   │   └── template.types.ts
│   └── public/
│       └── templates/              # MVP: YAML template files
│           ├── real-estate-listing.yaml
│           ├── meeting-notes.yaml
│           └── financial-analysis.yaml
│
├── backend/                        # Phase 2: Python FastAPI service
│   └── services/
│       └── python/
│           ├── builder.py          # SKILL.md generator
│           ├── packager.py         # Zip creation
│           └── validator.py        # YAML validation
│
├── database/                       # Phase 2: Supabase
│   ├── migrations/
│   └── queries/
│
├── docs/                           # Documentation
│   ├── 00-PROJECT-OVERVIEW.md
│   ├── 01-DESIGN-SYSTEM.md
│   ├── 02-ARCHITECTURE.md
│   └── 03-IMPLEMENTATION-GUIDE.md
│
└── specs/                          # Technical specifications
```

## Technology Stack

### Phase 1 (MVP - Weekend Launch)
- **Frontend Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/UI
- **Code Editor:** Monaco Editor
- **State Management:** Zustand (lightweight)
- **File Generation:** js-yaml, jszip
- **Deployment:** Vercel (free tier)

### Phase 2 (Post-Launch)
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Backend Service:** Python FastAPI
- **Authentication:** Supabase Auth
- **API Documentation:** OpenAPI/Swagger
- **Backend Deployment:** Railway or Fly.io

## Data Flow (MVP)

```
User fills form
     ↓
Form state (Zustand)
     ↓
Click "Generate"
     ↓
skill-generator.ts (client-side)
     ↓
Generate YAML frontmatter
     ↓
Combine with markdown instructions
     ↓
Create SKILL.md file
     ↓
Package in .zip (jszip)
     ↓
Trigger browser download
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
}

export interface Example {
  input: string;
  output: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  triggers: string[];
  instructions: string;
  examples?: Example[];
}
```

## Reference Implementation: CIQ Facets

The CIQ Facets codebase serves as our reference implementation:

**Location:** `/Users/briandawson/workspace/ciq-facets`

**Key Files to Reference:**

1. **scripts/build-skill.py** (237 lines)
   - Shows how to generate SKILL.md from structured data
   - YAML frontmatter generation
   - File packaging logic

2. **scripts/registry.py** (286 lines)
   - Registry-driven architecture pattern
   - Metadata management
   - Skill organization

3. **src/facets/meta/ciq-facet-builder.md**
   - Meta skill for building skills
   - Demonstrates SKILL.md structure
   - Shows best practices

**Key Patterns to Adopt:**
- Registry-driven system (database in Phase 2)
- Modular packaging (templates in MVP)
- Progressive resource loading
- YAML frontmatter structure

## Client-Side Generator Logic (MVP)

```typescript
// lib/utils/skill-generator.ts

import JSZip from 'jszip';
import yaml from 'js-yaml';
import type { Skill } from '@/types/skill.types';

export async function generateSkillZip(skill: Skill): Promise<Blob> {
  // 1. Generate YAML frontmatter
  const frontmatter = yaml.dump({
    name: skill.name,
    description: skill.description,
    triggers: skill.triggers,
    category: skill.category,
    tags: skill.tags
  });
  
  // 2. Combine with markdown instructions
  const skillMd = `---\n${frontmatter}---\n\n${skill.instructions}`;
  
  // 3. Create zip file
  const zip = new JSZip();
  zip.file('SKILL.md', skillMd);
  
  // 4. Add README (optional)
  const readme = generateReadme(skill);
  zip.file('README.md', readme);
  
  // 5. Generate blob
  return await zip.generateAsync({ type: 'blob' });
}

function generateReadme(skill: Skill): string {
  return `# ${skill.name}

${skill.description}

## Installation

1. Go to Claude.ai
2. Navigate to Skills
3. Click "Add Skill"
4. Upload this SKILL.md file

## Triggers

${skill.triggers.map(t => `- \`${t}\``).join('\n')}
`;
}
```

## State Management (Zustand)

```typescript
// lib/store/skillStore.ts

import { create } from 'zustand';
import type { Skill } from '@/types/skill.types';

interface SkillStore {
  skill: Skill;
  setSkill: (skill: Skill) => void;
  updateField: (field: keyof Skill, value: any) => void;
  reset: () => void;
}

const emptySkill: Skill = {
  name: '',
  description: '',
  category: '',
  tags: [],
  triggers: [],
  instructions: ''
};

export const useSkillStore = create<SkillStore>((set) => ({
  skill: emptySkill,
  setSkill: (skill) => set({ skill }),
  updateField: (field, value) => 
    set((state) => ({ 
      skill: { ...state.skill, [field]: value } 
    })),
  reset: () => set({ skill: emptySkill })
}));
```

## Deployment Strategy

### MVP (Phase 1)
- **Platform:** Vercel
- **Setup:** Connect GitHub repo → Auto-deploy
- **Environment:** Production only
- **Domain:** claudeskillsfacet.com (custom domain)
- **Cost:** $0 (free tier sufficient for MVP)

### Phase 2
- **Frontend:** Vercel (unchanged)
- **Backend:** Railway or Fly.io
- **Database:** Supabase (free tier → pro as needed)
- **Monitoring:** Vercel Analytics + Sentry

## Security Considerations

### Phase 1 (MVP)
- Client-side only, no backend
- No user data stored
- No authentication required
- XSS protection via Next.js

### Phase 2
- Supabase Row-Level Security (RLS)
- API rate limiting
- CORS configuration
- Input validation and sanitization
- Secure file uploads to Supabase Storage

## Performance Optimization

### Initial Load
- Code splitting via Next.js
- Lazy load Monaco Editor
- Optimize images (next/image)
- Font optimization (next/font)

### Runtime
- Debounced form inputs
- Memoized components (React.memo)
- Optimistic UI updates

## Testing Strategy

### Phase 1 (MVP)
- Manual testing only
- Test all 3 templates
- Cross-browser testing (Chrome, Safari, Firefox)
- Mobile responsive testing

### Phase 2
- Unit tests: Vitest
- E2E tests: Playwright
- Component tests: React Testing Library

## Documentation Requirements

Each component should include:
```typescript
/**
 * Primary button component with multiple variants
 * 
 * @param variant - Button style (primary | secondary | outline | ghost)
 * @param size - Button size (sm | md | lg)
 * @param onClick - Click handler
 * @param children - Button content
 * 
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Generate Skill
 * </Button>
 */
```

## Additional Context

For detailed architectural decisions, strategic rationale, and market context:

```bash
# Query ship-ape for complete architecture documentation
ship-ape search_context \
  --project_name="claude-skills-builder" \
  --query="architecture modular"
```

## Sprint Backlog

> **Architecture recommendations for stability and UX improvements**

### High Priority

- [ ] **Add `ErrorBoundary.tsx`** — Wrap Builder and Package wizard routes to prevent full-page crashes on component errors. Critical for production stability.
- [ ] **localStorage persistence bridge** — Quick win before IndexedDB (Sprint 9). Save `skillStore` and `packageStore` state to localStorage to prevent data loss on refresh.

### Medium Priority

- [ ] **Kill stale test processes** — Long-running Playwright/Vitest processes (4+ hours) indicate zombie browsers. Add `--timeout` flags and cleanup scripts.
- [ ] **Async validation for large packages** — Move validation logic to Web Worker if bundle complexity causes UI blocking.

### Low Priority (Phase 2)

- [ ] **Supabase cloud sync** — Replaces localStorage with authenticated persistence
- [ ] **Error tracking (Sentry)** — Production monitoring for caught errors

---

## Next Steps

1. Create Next.js project in `frontend/` directory
2. Set up Tailwind with design tokens
3. Build component library (Layer 1)
4. Implement skill builder form
5. Add generator logic
6. Create landing page
7. Deploy to Vercel

See: `docs/03-IMPLEMENTATION-GUIDE.md`
