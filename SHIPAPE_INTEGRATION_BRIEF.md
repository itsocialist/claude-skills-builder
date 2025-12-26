# Project Brief: Extend ShipApe to Support Claude Skills Builder

## Executive Summary

We want to evaluate extending ShipApe (our existing Vercel-hosted SaaS) to support a Claude Skills Builder product. Market research shows **zero direct competitors** with a comprehensive skills management platform, despite Claude Skills being adopted by 1000s of organizations.

**Market Opportunity:** Enterprise skills management platform targeting companies with 50+ employees using Claude Team/Enterprise plans.

---

## What Are Claude Skills?

Claude Skills are modular AI workflow packages that organizations deploy to standardize how their teams use Claude AI. Think of them as "reusable prompt templates" that activate automatically based on trigger phrases.

**Technical Format:**
- `SKILL.md` file with YAML frontmatter + markdown instructions
- Optional bundled resources (templates, reference docs, scripts)
- Deployed to Claude.ai Organization Settings as zip files
- Works across Claude.ai, Claude Code, and Claude Agent SDK

**User Experience:**
```
User: "Create a battle card for our competitor Red Hat"
Claude: [Automatically activates battle-card-generator skill]
        [Follows structured instructions]
        [Outputs formatted competitive analysis]
```

**Official Documentation:** https://claude.com/blog/skills

---

## Market Research Findings

### Existing Solutions (All Limited)

| Tool | Type | Limitations |
|------|------|-------------|
| skill-builder (GitHub) | Educational guide | No tooling, manual process |
| Claude Skill Factory (GitHub) | Template generator | No validation, testing, or deployment |
| SkillsMP | Marketplace/directory | Discovery only, no creation tools |
| Anthropic skill-creator | Interactive guide | Manual, no automation |

**Key Finding:** All existing tools are **manual SKILL.md generators**. None provide:
- Build automation (registry → modular packages → deployment zips)
- Trigger phrase validation & optimization
- Performance analysis (context size, SDK best practices)
- Team collaboration features
- Testing framework
- Web-based UI with validation

---

## Reference Implementation: CIQ Facets

We have access to a production-grade implementation called "CIQ Facets" (11,600 lines, 56 skills, enterprise deployment). It demonstrates:

### Key Architecture Patterns

**1. Registry-Driven Configuration** (`registry.py`)
```python
FACET_REGISTRY = {
    "battle-card-generator": {
        "type": "Strict",           # Type system: Simple/Structured/Strict
        "category": "sales",         # Organizational grouping
        "triggers": [                # Natural language matching
            "battle card",
            "competitor vs",
            "competitive analysis"
        ]
    }
}

PACKAGES = {
    "core": ["utilities", "meta"],
    "product": ["product", "engineering"],
    "sales": ["sales", "management"],
    "full": ["product", "engineering", "sales", "management", "utilities", "meta"]
}
```

**2. Automated Build Pipeline** (`build-skill.py`)
- Reads individual skill markdown files from `src/facets/[category]/`
- Generates dynamic trigger index table
- Compiles into single `SKILL.md` with frontmatter
- Creates modular packages (5 different zips from same source)
- Bundles resources (templates, reference docs, brand assets)
- Versions and packages for deployment

**3. Trigger-Based Routing System**
- Master trigger index loaded into Claude's system prompt
- Workflow: User message → Trigger matching → Activate skill → Follow instructions
- Priority rules: Skills take precedence over direct tool use
- 100+ trigger phrases mapped to 56 skills

**4. Progressive Resource Loading**
- SKILL.md contains core instructions (6,500 lines compiled)
- Templates loaded on-demand (`templates/prd.md`, `templates/battle-card.md`)
- Reference data loaded on-demand (`resources/products.md`, `resources/pricing.md`)
- Keeps initial context efficient

**5. Contribution Workflow**
- GitHub issue form for non-technical users
- GitHub Actions auto-generates PR from issue submission
- Creates skill file, updates registry, adds to CODEOWNERS
- Lowers contribution barrier

### Code Quality Assessment
- **Architecture:** 9/10 (clean separation, modular, declarative)
- **Code Quality:** 8/10 (readable, documented, needs type hints & tests)
- **Reusability:** 7/10 (can be genericized, currently CIQ-specific resources)

**Files to Reference:**
- `/home/user/ciq-facets/scripts/registry.py` (286 lines - configuration)
- `/home/user/ciq-facets/scripts/build-skill.py` (237 lines - build pipeline)
- `/home/user/ciq-facets/src/_header_template.md` (trigger routing instructions)
- `/home/user/ciq-facets/src/facets/sales/battle-card-generator.md` (example skill)
- `/home/user/ciq-facets/src/facets/meta/ciq-facet-builder.md` (meta-skill for creating skills)

---

## Product Vision: Claude Skills Builder on ShipApe

### Target Users

**Primary:** Enterprise teams (50-500 employees) using Claude Team/Enterprise
- Sales teams (battle cards, deal briefs, customer journey analysis)
- Product teams (PRDs, release notes, roadmap planning)
- Engineering teams (code review workflows, architecture diagrams)
- Marketing teams (brand guidelines, content generation)

**Secondary:** Agencies & consultants building skills for clients

**Tertiary:** Individual developers & hobbyists (freemium tier)

### Core Value Proposition

**"Build, validate, and deploy Claude Skills in minutes - not hours"**

Replace manual SKILL.md creation with:
1. Visual builder with AI-powered suggestions
2. Real-time validation against Claude Agent SDK best practices
3. Trigger phrase optimization (AI suggests alternatives, checks uniqueness)
4. Performance analysis (context size estimation, trigger coverage)
5. Testing sandbox (simulate skill execution before deployment)
6. One-click export to deployment-ready zip file

### Key Features (MVP)

#### 1. Visual Skill Builder
- Form-based UI for skill metadata (name, description, category, type)
- Rich text editor for instructions with markdown preview
- Drag-drop section builder (inputs, instructions, output format, examples)
- Trigger phrase manager with AI suggestions
- Live validation feedback

#### 2. Resource Manager
- Upload company-specific docs (product sheets, pricing, brand guidelines)
- Link resources to skills (progressive loading pattern)
- Template library (PRD, battle card, customer brief, etc.)
- Version control for resources

#### 3. Build Engine (Backend)
- Python service running build pipeline logic (adapted from ciq-facets)
- Generate SKILL.md with proper frontmatter
- Package resources into correct structure
- Create deployment-ready zip file
- Version management

#### 4. Validation Engine
- YAML frontmatter validation
- Trigger phrase analysis:
  - Uniqueness check (no conflicts with other skills)
  - Coverage analysis (how many ways can this be triggered?)
  - AI suggestions for alternative phrasings
- Context size estimation (warn if >10k tokens)
- Claude Agent SDK best practices checklist:
  - Description clearly states when to use
  - Instructions use imperative language
  - Output format is specified
  - Proper attribution included

#### 5. Testing Sandbox
- Simulate trigger phrase matching
- Preview skill activation workflow
- Test output format rendering
- Mock resource loading

#### 6. Package Builder
- Select categories to include (modular packaging)
- Configure package metadata
- Generate multiple variants (by department/team)
- Download as zip files ready for claude.ai upload

#### 7. Team Collaboration (Post-MVP)
- Shared skill libraries
- Review workflow (draft → review → published)
- Usage analytics (which skills are activated most?)
- A/B testing for trigger phrases

---

## Technical Requirements

### Frontend Needs
- Visual form builder for skills
- Markdown editor with live preview
- File upload (resources, templates)
- Zip file download
- Real-time validation feedback UI

### Backend Needs
- Python service for build pipeline
- File storage for uploaded resources (S3/R2)
- Claude API integration for AI features:
  - Trigger phrase suggestions
  - Skill description optimization
  - Validation feedback
- Job queue for build operations (if async needed)

### Data Model (Approximate)
```typescript
Project {
  id, name, user_id, created_at, updated_at
  categories: string[]       // e.g., ["sales", "product", "utilities"]
  packages: PackageConfig[]  // modular packaging definitions
}

Skill {
  id, project_id, created_at, updated_at
  facet_id: string          // e.g., "battle-card-generator"
  name: string
  description: string
  category: string
  type: "Simple" | "Structured" | "Strict"
  triggers: string[]
  inputs: SkillInput[]
  instructions: string      // Markdown
  output_format: string     // Markdown template
  status: "draft" | "published"
}

Resource {
  id, project_id, created_at, updated_at
  name: string
  type: "template" | "reference" | "asset"
  path: string              // S3 key
  file_size: number
  linked_skills: string[]   // skill IDs that reference this
}

Package {
  id, project_id, created_at, updated_at
  name: string
  categories: string[]
  skills: string[]          // skill IDs included
  version: string
  generated_zip_url: string
}
```

---

## Integration Questions for ShipApe Evaluation

### Architecture Assessment
1. **Tech Stack Compatibility**
   - What is ShipApe's current tech stack? (Framework, hosting, database)
   - Is there existing support for Python backends? (build pipeline is Python)
   - How are file uploads currently handled? (need S3/R2 for resources)
   - Does ShipApe have job queue infrastructure? (for async build operations)

2. **Feature Alignment**
   - Does ShipApe have any existing features that overlap? (form builders, file managers, etc.)
   - Can the current UI framework support rich markdown editing + live preview?
   - Is there existing team collaboration infrastructure? (users, permissions, sharing)

3. **Business Model Fit**
   - What is ShipApe's current pricing model? (freemium, subscription, usage-based?)
   - Would this be a new product vertical or extension of existing offering?
   - Is the target market (B2B SaaS, enterprise teams) aligned with ShipApe's current users?

### Implementation Effort
4. **Build Pipeline Integration**
   - Effort to integrate Python build service with ShipApe backend?
   - Can we reuse ciq-facets code as-is or does it need refactoring?
   - File storage strategy for user uploads (resources, templates)?

5. **Frontend Development**
   - Estimate effort for visual skill builder UI
   - Estimate effort for markdown editor with live preview
   - Estimate effort for validation feedback system
   - Can we leverage existing ShipApe UI components?

6. **AI Integration**
   - Does ShipApe currently integrate with Claude API or other LLMs?
   - Estimated cost per user for AI features (trigger suggestions, validation)?
   - Should AI features be gated behind paid tiers?

### Go-to-Market
7. **Market Position**
   - Does this align with ShipApe's brand and mission?
   - Are there existing ShipApe users who would use this? (quick validation)
   - Competitive advantage: Can we move fast enough to own this category?

8. **Resource Requirements**
   - Development timeline estimate (MVP)?
   - Team size needed (frontend, backend, DevOps)?
   - Ongoing maintenance burden?

### Risk Assessment
9. **Technical Risks**
   - Complexity of build pipeline integration
   - Claude API rate limits / costs
   - Security concerns (user-uploaded files, generated code)

10. **Business Risks**
    - Will Anthropic build this themselves? (competitive threat)
    - Is market demand validated? (we've only done secondary research)
    - Pricing sensitivity - will customers pay $19-99/mo?

---

## Recommended Monetization Model

### Freemium Tiers

**Free Tier:**
- 5 skills per project
- 1 project
- Basic validation
- Community support
- 50MB resource storage

**Pro Tier ($19/month):**
- Unlimited skills
- 3 projects
- AI-powered trigger suggestions
- Advanced validation & performance insights
- Email support
- 5GB resource storage

**Team Tier ($99/month):**
- Everything in Pro
- Unlimited projects
- Team collaboration (up to 10 users)
- Shared skill libraries
- Usage analytics
- Priority support
- 50GB resource storage

**Enterprise Tier ($499/month):**
- Everything in Team
- Unlimited users
- SSO (SAML, OAuth)
- Audit logs
- Dedicated support (Slack)
- Custom training
- Unlimited storage

---

## Success Metrics (If We Build This)

### Phase 1 (Validation - Week 0)
- Landing page: 100 email signups
- Customer interviews: 10 completed
- Waitlist conversion: 20% to beta

### Phase 2 (Beta - Months 1-2)
- Beta users: 50 active
- Skills created: 200+
- User feedback score: 8+/10
- Retention: 60% week-over-week

### Phase 3 (Launch - Months 3-6)
- Paid conversions: 5% free → paid
- MRR: $5,000
- NPS: 40+
- Churn: <10%/month

---

## Key Decisions Needed

1. **Product Strategy**
   - Build as ShipApe feature vs. standalone product?
   - Open source the build pipeline or keep proprietary?
   - Focus on enterprises vs. indie developers first?

2. **Technical Approach**
   - Integrate with existing ShipApe stack or microservice architecture?
   - Adapt ciq-facets code or rewrite from scratch?
   - Self-host build pipeline or serverless functions?

3. **Go-to-Market**
   - Launch to existing ShipApe users first (if applicable)?
   - Pricing: start low ($9/mo) to capture market or price high ($49/mo) for positioning?
   - Open source framework + commercial UI (hybrid model)?

---

## Deliverables Requested

Please evaluate ShipApe and provide:

1. **Feasibility Assessment** (High/Medium/Low for each):
   - Technical integration complexity
   - Timeline to MVP (weeks estimate)
   - Resource requirements (team size, skills needed)
   - Ongoing maintenance burden

2. **Architecture Recommendation**:
   - How would this integrate with ShipApe's existing stack?
   - What new infrastructure is needed?
   - Should this be a monolith extension or separate service?

3. **Development Roadmap**:
   - Phase 1 (MVP): Features + timeline
   - Phase 2 (Growth): Features + timeline
   - Phase 3 (Scale): Features + timeline

4. **Business Case**:
   - Alignment with ShipApe's vision/mission
   - Total addressable market (TAM) estimate
   - Competitive positioning
   - Revenue projections (conservative/realistic/optimistic)

5. **Risk Analysis**:
   - Top 3 technical risks + mitigation
   - Top 3 business risks + mitigation
   - Dependencies on external factors (Anthropic, Claude adoption, etc.)

6. **Go/No-Go Recommendation**:
   - Should we pursue this on ShipApe?
   - If yes: What's the minimal viable approach?
   - If no: Why not? What are better alternatives?

---

## Reference Materials

**Market Research:**
- Claude Skills announcement: https://claude.com/blog/skills
- Skills marketplace (25k+ skills): https://skillsmp.com
- Technical deep dive: https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/

**Reference Implementation:**
- Located at: `/home/user/ciq-facets`
- Key files:
  - `scripts/registry.py` - Configuration model
  - `scripts/build-skill.py` - Build pipeline
  - `src/facets/*/*.md` - 56 example skills
  - `skills/user/ciq-facets/SKILL.md` - Compiled output (6,500 lines)

**Competitive Landscape:**
- skill-builder: https://github.com/metaskills/skill-builder
- Claude Skill Factory: https://github.com/LeoFanKm/claude-skill-generator
- Anthropic official examples: https://github.com/anthropics/skills

---

## Questions to Answer After Evaluation

1. Should we build this on ShipApe? (Yes/No + reasoning)
2. If yes, what's the MVP feature set? (prioritized list)
3. What's the estimated timeline? (weeks to MVP, months to profitable)
4. What's the estimated development cost? (team + infrastructure)
5. What's the expected ROI? (payback period, 12-month revenue projection)

---

**Prepared by:** Claude Code Agent
**Date:** 2025-12-23
**Context:** Market analysis shows zero direct competitors for comprehensive Claude Skills management platform. Reference implementation (ciq-facets) demonstrates production viability with strong architecture (9/10 score). Market opportunity is validated by 25k+ skills in community marketplace and growing enterprise adoption of Claude Team/Enterprise plans.
