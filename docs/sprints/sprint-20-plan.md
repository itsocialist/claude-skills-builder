# Sprint 20 Plan

**Sprint Theme:** UX Polish, Branding & User Engagement  
**Start Date:** 2025-12-30  
**Status:** 📋 Planning

---

## Sprint Goals
1. Complete brand consistency (logo, favicon, naming)
2. Fix critical UX bugs (clipboard, markdown)
3. Improve bundles discoverability and management
4. Prepare for user feedback collection

---

## Review Process

> [!IMPORTANT]
> **Marketing Review Required**: All user-facing changes must be reviewed for brand consistency before merge.

| Role | Responsibilities |
|------|-----------------|
| **Developer** | Implementation, code review |
| **Marketing** | Brand compliance, copy review, visual consistency |
| **Product** | Acceptance criteria verification |

---

## User Stories

### US-1: Brand Consistency [S] — Issue #61

**As a** visitor to GetClaudeSkills,  
**I want** consistent branding across all pages,  
**So that** I have a professional, trustworthy experience.

**Acceptance Criteria:**
- [ ] All instances of "ClaudeSkilsFacets" replaced with "GetClaudeSkills"
- [ ] All instances of "ClaudeSkillsFacet" replaced with "GetClaudeSkills"
- [ ] Header displays wordmark logo (not text)
- [ ] Favicon updated to match brand
- [ ] Marketing reviews and approves all changes

**Technical Notes:**
- Run grep for legacy brand names
- Logo files: `marketing/assets/logos/`
- Update: layout.tsx, Head component, metadata

---

### US-2: Clipboard Notification [S] — Issue #62

**As a** user copying a link to share,  
**I want** confirmation that the copy succeeded,  
**So that** I know I can paste the link.

**Acceptance Criteria:**
- [ ] Toast notification appears when link is copied
- [ ] Applies to: social share buttons, skill copy links
- [ ] Consistent styling with design system
- [ ] Notification auto-dismisses after 2-3 seconds

**Technical Notes:**
- Use Sonner or existing toast component
- Audit all `navigator.clipboard.writeText` calls

---

### US-3: Bundles Navigation & Discovery [S] — Issue #63

**As a** user exploring the platform,  
**I want** easy access to Power Bundles,  
**So that** I can quickly find curated skill collections.

**Acceptance Criteria:**
- [ ] "Bundles" link in shell navigation menu
- [ ] Featured bundles section on homepage
- [ ] Link from marketplace page to bundles
- [ ] Mobile-responsive navigation

**Technical Notes:**
- Add to Shell component navigation
- Create homepage FeaturedBundles section
- Marketing reviews placement and copy

---

### US-4: Bundles Feature Flag [S] — Issue #64

**As an** admin,  
**I want** to control bundles visibility,  
**So that** I can launch/hide the feature as needed.

**Acceptance Criteria:**
- [ ] `FEATURE_BUNDLES` flag in lib/flags.ts
- [ ] Toggle in admin settings screen
- [ ] Navigation and homepage sections conditionally rendered
- [ ] Flag defaults to ON for launch

**Technical Notes:**
- Mirror existing feature flag patterns
- Add to admin/settings UI

---

### US-5: Bundle Admin CRUD [M] — Issue #65

**As an** admin,  
**I want** to create and edit bundles,  
**So that** I don't need code changes to update bundles.

**Acceptance Criteria:**
- [ ] Admin page at `/app/admin/bundles`
- [ ] List all bundles with edit/delete actions
- [ ] Create bundle form: name, tagline, icon, color, skills
- [ ] Markdown editor for output example
- [ ] Bundles stored in Supabase `bundles` table
- [ ] Migration creates `bundles` table

**Technical Notes:**
- New Supabase migration
- UI mirrors admin/users pattern
- Marketing approves default bundle content

---

### US-6: Markdown Rendering Fix [S] — Issue #66

**As a** user viewing generated output,  
**I want** properly formatted content,  
**So that** I can read the output clearly.

**Acceptance Criteria:**
- [ ] Bold, italics, lists render correctly in builder preview
- [ ] Tables render with proper styling
- [ ] Consistent with Power Bundles rendering
- [ ] Applied to: Builder preview, Test Skill output

**Technical Notes:**
- Install react-markdown + remark-gfm if not present
- Apply same component mapping as bundles

---

### US-7: Inspector Menu Improvements [S] — Issue #67

**As a** user inspecting skills,  
**I want** a wider, resizable sidebar,  
**So that** I can see more content without scrolling.

**Acceptance Criteria:**
- [ ] Default sidebar width increased (400px → 500px+)
- [ ] Drag handle for manual resizing
- [ ] Minimum and maximum width constraints
- [ ] Applied to all inspector uses

**Technical Notes:**
- CSS variable for default width
- react-resizable or custom implementation

---

### US-8: Mobile Optimization [M] — Issue #68

**As a** mobile user,  
**I want** a fully functional experience,  
**So that** I can use GetClaudeSkills on my phone.

**Acceptance Criteria:**
- [ ] All pages reviewed at 375px viewport
- [ ] No horizontal scroll issues
- [ ] Touch targets min 44px
- [ ] Navigation works on mobile
- [ ] Marketing reviews mobile appearance

**Technical Notes:**
- Chrome DevTools device testing
- Focus on: homepage, marketplace, bundles, builder

---

### US-9: Marketplace Skill Testing [M] — Issue #70

**As a** user downloading a skill,  
**I want** confidence it works well,  
**So that** I get valuable output.

**Acceptance Criteria:**
- [ ] All 16 seeded skills tested with Claude
- [ ] Each produces quality, relevant output
- [ ] Underperforming skills improved or removed
- [ ] Power Bundle skills linked to real marketplace skills

**Technical Notes:**
- Manual testing with Claude.ai
- Document test results

---

### US-10: Contact & Feedback System [M] — Issue #69

**As a** user with questions,  
**I want** an easy way to contact support,  
**So that** I can get help when needed.

**Acceptance Criteria:**
- [ ] Contact page at `/contact`
- [ ] Form: Name, Email, Type, Message
- [ ] Email sent to team via Resend
- [ ] Confirmation message shown
- [ ] Feedback stored in Supabase
- [ ] Admin can view submissions

**Technical Notes:**
- Reuse Resend from Sprint 19
- New migration: `feedback` table

---

## Sprint Capacity

| Priority | Size | Story Count |
|----------|------|-------------|
| 🔴 Required | S | 4 |
| 🐛 Bug | S | 2 |
| 📋 Proposed | S-M | 4 |
| **Total** | | **10** |

Estimated duration: 1 week

---

## Definition of Done
- [ ] Code reviewed and merged to `main`
- [ ] Marketing reviewed user-facing changes
- [ ] Deployed to production
- [ ] Acceptance criteria verified
- [ ] Documentation updated

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Brand consistency audit | 100% compliant |
| Clipboard feedback | All copy actions confirmed |
| Mobile usability | No critical issues |
| Bundle visibility | Accessible from 3+ entry points |
