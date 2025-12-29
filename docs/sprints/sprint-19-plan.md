# Sprint 19 Plan

**Sprint Theme:** Growth & Marketing Infrastructure  
**Start Date:** 2025-12-29  
**Status:** 📋 Ready

---

## Sprint Goals
1. Improve organic discoverability (SEO)
2. Enable viral growth (Social Sharing)
3. Activate captured users (Email Sequence)
4. Measure funnel performance (Analytics)
5. Protect platform resources (Rate Limiting)
6. Populate marketplace with starter content (15+ Skills)
7. Educate non-Claude users (Educational Content)
8. Showcase bundled value (Power Bundles)

---

## User Stories

### US-1: SEO Optimization [S] — Issue #49

**As a** potential user searching for AI skill tools,  
**I want** GetClaudeSkills to appear in search results,  
**So that** I can discover and use the platform.

**Acceptance Criteria:**
- [ ] Each page has unique `<title>` and `<meta description>` tags
- [ ] `/sitemap.xml` is generated dynamically with all marketplace skills
- [ ] Skills have JSON-LD structured data (`SoftwareApplication` schema)
- [ ] Canonical URLs are set on all pages
- [ ] `robots.txt` allows search engine crawling
- [ ] Lighthouse SEO audit score ≥ 90

**Technical Notes:**
- Files: `layout.tsx`, `marketplace/[slug]/page.tsx`, `sitemap.ts`
- Use Next.js metadata API

---

### US-2: Social Sharing [S] — Issue #50

**As a** skill creator,  
**I want** my shared skills to display attractive previews on social media,  
**So that** I can attract more users to view my skills.

**Acceptance Criteria:**
- [ ] Dynamic OG images generated per skill (skill name, description, branding)
- [ ] Twitter card meta tags render correctly in Twitter Card Validator
- [ ] LinkedIn previews show skill title, description, and image
- [ ] Share buttons (Twitter, LinkedIn, Copy Link) on skill detail pages
- [ ] OG image includes GetClaudeSkills branding

**Technical Notes:**
- Use Vercel OG (`@vercel/og`) for dynamic image generation
- Files: `marketplace/[slug]/opengraph-image.tsx`

---

### US-3: Email Onboarding Sequence [M] — Issue #51

**As a** new user who downloaded a skill,  
**I want** to receive helpful follow-up emails,  
**So that** I learn how to get more value from the platform.

**Acceptance Criteria:**
- [ ] Email provider (Resend) integrated
- [ ] Welcome email sent immediately after skill download
- [ ] Tutorial email ("Get more from your skill") sent Day 1
- [ ] Share prompt email ("Share your skill") sent Day 3
- [ ] Email templates have GetClaudeSkills branding
- [ ] Open and click rates are tracked
- [ ] Unsubscribe link works correctly

**Technical Notes:**
- Provider: Resend (API key required)
- Use Supabase scheduled functions or edge functions for delays

---

### US-4: Analytics Dashboard Enhancements [M] — Issue #52

**As an** admin or product manager,  
**I want** to see marketing funnel metrics,  
**So that** I can measure conversion and optimize the user journey.

**Acceptance Criteria:**
- [ ] Onboarding funnel visualization (Visit → Start → Generate → Download)
- [ ] Historical trend chart (last 30 days) for key metrics
- [ ] CSV export of analytics data
- [ ] Email capture conversion rate displayed
- [ ] Skill creation → download rate displayed

**Technical Notes:**
- Files: `app/admin/page.tsx`, `lib/analytics/`
- Consider Recharts for visualizations

---

### US-5: API Rate Limiting [S] — Issue #53

**As a** platform operator,  
**I want** to limit API abuse,  
**So that** the platform Claude API key is protected from misuse.

**Acceptance Criteria:**
- [ ] Unauthenticated users: 10 requests/minute per IP
- [ ] Authenticated users: 30 requests/minute
- [ ] 429 response returned with `Retry-After` header when limit exceeded
- [ ] Rate limit state stored in-memory (Map)
- [ ] Rate limiting applied to `/api/claude/*` routes

**Technical Notes:**
- Middleware implementation
- Consider Redis for future scalability (not required for MVP)

---

### US-6: Marketplace Skill Seeding [M] — Issue #54

**As a** new visitor browsing the marketplace,  
**I want** to see a variety of useful skills,  
**So that** I understand the platform's value and get inspired.

**Acceptance Criteria:**
- [ ] 15+ skills published to marketplace
- [ ] Skills span 5+ categories (Code, Writing, Data, Business, Creative)
- [ ] Each skill has description, triggers, and examples
- [ ] Skills are functional and tested
- [ ] Skills include diverse use cases (templates from onboarding + new ones)

**Technical Notes:**
- Leverage existing 10 onboarding templates as base
- Add 5+ additional high-value skills
- Use builder to create and publish programmatically or manually

---

### US-7: Educational Content [S] — Issue #59

**As a** first-time visitor unfamiliar with Claude,  
**I want** to understand what Claude Skills are and how to install them,  
**So that** I can confidently use the platform without prior Claude experience.

**Acceptance Criteria:**
- [ ] "What is a Claude Skill?" explainer on landing page or /learn page
- [ ] Step-by-step installation guide with screenshots
- [ ] Quick video or animation showing installation process
- [ ] FAQ addressing: Do I need an account? Is it free? How do I use it?

**Technical Notes:**
- Consider inline section on landing page vs. dedicated /learn route
- May integrate with onboarding wizard as optional tooltip

---

### US-8: Power Bundle Product Concept [M] — Issue #60

**As a** new user exploring the platform,  
**I want** to see curated skill bundles organized by outcome,  
**So that** I understand the depth of value and can get started faster.

**Acceptance Criteria:**
- [ ] Define 4 Power Bundles: Research Studio, Content Engine, Data Analyst, Project Kickstart
- [ ] Bundle landing page or marketplace section
- [ ] Each bundle shows final OUTPUT (the "cake"), not just skill list
- [ ] "Get This Bundle" CTA downloads all skills as single package

**Technical Notes:**
- Reference: Notion Templates, Figma Community bundles
- Could be premium/upsell feature in future

---

## Definition of Done
- [ ] Code reviewed and merged to `main`
- [ ] Deployed to production
- [ ] Acceptance criteria verified
- [ ] Documentation updated if needed

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Lighthouse SEO Score | ≥ 90 |
| Social shares/week | > 10 |
| Email open rate | > 40% |
| Onboarding completion | > 60% |
| Rate limit violations blocked | 100% |

---

## Sprint 18 Retrospective

### What Went Well
- A/B comparison exceeded expectations
- Parallel streaming worked flawlessly
- 10 quick-start templates (2x planned)
- Deployment workflow formalized

### Lessons Learned
- Always test on correct production URL
- Browser testing more efficient on lighter model
- Marketing input early = better prioritization
