# Product Requirements Document: ClaudeSkillsFacet Visual Skill Builder

**Document Version:** 1.0  
**Date:** December 24, 2025  
**Product Manager:** Brian Dawson  
**Status:** Ready for Development Team Specification  

---

## Executive Summary

ClaudeSkillsFacet Visual Skill Builder is a no-code platform that enables professional creators, teams, educators, and enterprises to build, manage, and monetize Claude Skills through an intuitive drag-and-drop interface. This PRD defines the MVP (Phase 1) and provides a roadmap for subsequent phases.

**Core Differentiator:** Only visual skill builder in the market. All competitors require GitHub and manual SKILL.md editing.

---

## 1. Problem Statement

### Current State (Pain Points)

**Professional Creators:**
- Creating Claude Skills requires technical knowledge of YAML, Markdown, and file structure
- Manual SKILL.md editing is error-prone and time-consuming
- No way to preview skill behavior before deployment
- Difficult to maintain consistency across multiple skills
- No collaboration tools for team-based skill development

**Teams/Organizations:**
- Each team member creates skills differently (inconsistent quality)
- No centralized repository for organizational skills
- No version control or rollback capability
- Can't enforce skill standards or approval workflows
- No analytics on which skills are actually used

**The Market Gap:**
- GetClaudeSkills: Has hidden form but no visual builder
- SkillsMP: GitHub aggregator only, no creation tools
- ClaudeSkills.ai: Waitlist vaporware, no product
- ClaudeSkills.org: Educational content, no builder

### Desired State

A Figma-like visual builder where anyone can create professional Claude Skills in 5 minutes without writing code, with team collaboration features and enterprise-grade quality controls.

---

## 2. Goals & Success Metrics

### Business Goals

**Phase 1 (MVP - Week 6):**
- Launch visual skill builder to 100 beta users
- 50+ skills created using the platform
- 20% conversion from free to Pro ($19/mo)
- Establish "easiest way to create Claude Skills" positioning

**Phase 2 (Week 10):**
- 500+ registered users
- 10 paying teams ($75/mo avg)
- $15K MRR
- 5-star average rating from creators

**Phase 3 (Week 20):**
- 2,000+ registered users
- 50 paying teams
- $50K MRR
- Top 3 Google ranking for "claude skills builder"

### User Goals

**Creators Want To:**
- Create professional skills in <10 minutes without coding
- Preview skills before publishing
- Reuse components across multiple skills
- Monetize their expertise through skill sales
- Build reputation as quality skill creator

**Teams Want To:**
- Centralize organizational skill library
- Enforce quality standards through review workflows
- Track which skills are used most
- Collaborate on skill improvements
- Deploy skills consistently across team members

### Key Performance Indicators (KPIs)

**Product Metrics:**
- Time to first skill created: <10 minutes (vs 60+ minutes manual)
- Skill creation completion rate: >80%
- Skills created per user: 3+ in first month
- Preview usage rate: >90% of creators use before publishing

**Business Metrics:**
- User signup to skill creation: <24 hours
- Free to Pro conversion: 20%
- Team plan adoption: 30% of Pro users upgrade within 3 months
- Monthly active creators: 40% of registered users
- Creator retention (Month 2): >60%

**Quality Metrics:**
- Skill error rate: <5% (syntax, validation issues)
- User satisfaction (NPS): >50
- Support ticket rate: <10% of users
- Published skill approval rate: >85%

---

## 3. Target User Personas

### Persona 1: "Agency Alex" - Professional Creator
**Profile:**
- Role: Freelance consultant / Agency owner
- Age: 32-45
- Tech Skills: Intermediate (uses Notion, Figma, basic coding)
- Budget: $50-200/mo for productivity tools
- Pain: Manually creates similar client deliverables repeatedly

**Goals:**
- Create custom Claude Skills for clients
- Build portfolio of reusable skills
- Monetize skills through marketplace
- Save 10+ hours/week on repetitive work

**Success Criteria:**
- Can create skill in <10 minutes
- Skills look professional (no coding mistakes)
- Can customize templates for client branding
- Earns $500+/mo from skill sales

### Persona 2: "Team Lead Taylor" - Enterprise Manager
**Profile:**
- Role: Director of Operations / VP Engineering
- Age: 35-50
- Team Size: 10-50 people
- Budget: $1,000-5,000/mo for team tools
- Pain: Team creates skills inconsistently, no standardization

**Goals:**
- Centralize team's Claude Skills
- Enforce quality/compliance standards
- Track skill usage and ROI
- Enable non-technical team members to create skills

**Success Criteria:**
- Team shares 20+ skills in first month
- 80% skill reuse rate (not recreating)
- Reduces onboarding time by 50%
- Proves ROI to leadership ($10K+ value)

### Persona 3: "Educator Emma" - Course Creator
**Profile:**
- Role: Technical educator / Content creator
- Age: 28-40
- Tech Skills: High (developer background)
- Budget: $20-100/mo for tools
- Pain: Creating educational skills for students is tedious

**Goals:**
- Create skill templates for students
- Package skills as course content
- Enable students to customize without breaking
- Monetize through educational skill packages

**Success Criteria:**
- Creates 10+ educational skills/month
- Students successfully customize without errors
- Sells skill bundles for $50-200 each
- Gets 5-star reviews from students

---

## 4. Functional Requirements (MVP - Phase 1)

### 4.1 Visual Skill Builder Core

#### 4.1.1 Component Library
**User Story:** As a creator, I want to drag-and-drop pre-built components so that I can quickly assemble skills without coding.

**Requirements:**
- [ ] Component palette with 10+ common patterns:
  - Text generation templates
  - Data analysis workflows
  - Document creation patterns
  - API integration templates
  - Code generation scaffolds
- [ ] Search/filter components by category
- [ ] Preview component behavior on hover
- [ ] Drag component to canvas to add
- [ ] Click to configure component parameters

**Acceptance Criteria:**
- User can find component in <10 seconds
- Drag-and-drop works smoothly (<100ms lag)
- Component preview shows realistic output
- Configuration form validates inputs

#### 4.1.2 Canvas Editor
**User Story:** As a creator, I want a visual canvas where I can see my skill structure so that I understand what I'm building.

**Requirements:**
- [ ] Drag-and-drop canvas area
- [ ] Component connections (data flow visualization)
- [ ] Zoom in/out capability (50%-200%)
- [ ] Auto-layout for component arrangement
- [ ] Undo/redo functionality (10 levels)
- [ ] Component deletion with confirmation

**Acceptance Criteria:**
- Canvas renders <1 second
- Zoom works smoothly without lag
- Undo/redo works reliably
- Components snap to grid for alignment
- Delete requires confirmation for safety

#### 4.1.3 Property Panel
**User Story:** As a creator, I want to configure each component's properties so that I can customize behavior without code.

**Requirements:**
- [ ] Context-sensitive property editor (shows only relevant fields)
- [ ] Form validation for each field type:
  - Text inputs (min/max length, regex patterns)
  - Select dropdowns (predefined options)
  - Toggle switches (boolean values)
  - Textarea with markdown preview
- [ ] Help tooltips for each property
- [ ] Example values for guidance
- [ ] Required field indicators

**Acceptance Criteria:**
- Property panel updates instantly when component selected
- Validation prevents invalid configurations
- Help text appears on hover
- Required fields clearly marked
- Example values populate on "use example" click

#### 4.1.4 Live Preview
**User Story:** As a creator, I want to preview how my skill behaves so that I can test before publishing.

**Requirements:**
- [ ] Preview pane showing skill execution
- [ ] Test input field (user can provide sample input)
- [ ] Real-time execution with Claude API
- [ ] Output display with formatting preserved
- [ ] Error display with helpful messages
- [ ] Loading states during execution
- [ ] Preview history (last 5 runs)

**Acceptance Criteria:**
- Preview renders <2 seconds after input
- Errors show exact line/field causing issue
- Output formatting matches production
- Loading indicator shows during execution
- Preview history scrollable

### 4.2 Skill Metadata Management

#### 4.2.1 Basic Information Form
**User Story:** As a creator, I want to define my skill's metadata so that users can discover and understand it.

**Requirements:**
- [ ] Skill name (required, 3-50 chars, unique check)
- [ ] Description (required, 10-500 chars, markdown supported)
- [ ] Category selection (dropdown, required):
  - Content Creation
  - Data Analysis
  - Coding & Development
  - Business & Productivity
  - Creative & Design
  - Research & Learning
  - Other (free text)
- [ ] Tags (optional, up to 5, autocomplete from existing)
- [ ] Version number (auto-generated, semver)
- [ ] Author attribution (auto-filled from account)

**Acceptance Criteria:**
- Form validation prevents submission with missing required fields
- Duplicate name check runs on blur
- Description supports markdown preview
- Category dropdown loads <500ms
- Tag autocomplete shows relevant suggestions
- Version auto-increments on publish

#### 4.2.2 Triggers Configuration
**User Story:** As a creator, I want to define when my skill activates so that Claude uses it at the right time.

**Requirements:**
- [ ] Trigger phrase management:
  - Add/remove trigger phrases
  - Phrase validation (2-50 chars)
  - Duplicate detection across all skills
  - Recommendation engine (suggests similar triggers)
- [ ] Trigger type selection:
  - Explicit (user types trigger phrase)
  - Contextual (Claude infers from conversation)
  - Always active (skill always loaded)
- [ ] Priority setting (1-10, default 5):
  - Higher priority skills activate first
  - Explanation of how priority works
- [ ] Scope configuration:
  - Global (all chats)
  - Project-specific (certain Projects only)

**Acceptance Criteria:**
- Can add up to 10 trigger phrases
- Duplicate detection prevents conflicts
- Trigger recommendations appear in <1 second
- Priority slider updates immediately
- Scope selection saves correctly

### 4.3 Template System

#### 4.3.1 Template Library
**User Story:** As a creator, I want to start from templates so that I can create skills faster.

**Requirements:**
- [ ] Template gallery with 10 starter templates:
  1. Property Listing Generator (Real Estate)
  2. Meeting Notes & Action Items (Business)
  3. Financial Analysis Report (Finance)
  4. Blog Post Writer (Content)
  5. Code Review Checklist (Development)
  6. Customer Email Response (Support)
  7. Social Media Post Generator (Marketing)
  8. Product Requirements Doc (Product)
  9. Research Summary (Academic)
  10. Contract Clause Generator (Legal)
- [ ] Template preview (screenshot + description)
- [ ] Template categories/filtering
- [ ] "Use Template" creates copy (doesn't modify original)
- [ ] Template popularity indicator (uses count)

**Acceptance Criteria:**
- Gallery loads <1 second
- Template preview shows realistic example
- Filter by category works instantly
- "Use Template" creates editable copy
- Popularity indicator updates weekly

#### 4.3.2 Template Customization
**User Story:** As a creator, I want to customize templates so that I can adapt them to my needs.

**Requirements:**
- [ ] All template components fully editable
- [ ] "Fork Template" workflow:
  1. User clicks "Use Template"
  2. Copy created with "{Template Name} - Copy"
  3. User redirected to editor with copy loaded
  4. All customizations saved to copy, not original
- [ ] Template metadata preserved (credits original creator)
- [ ] Ability to save customized template as new template

**Acceptance Criteria:**
- Template fork creates independent copy
- Original template unaffected by edits
- Creator attribution preserved
- Can save custom template for reuse

### 4.4 Export & Deployment

#### 4.4.1 Download as ZIP
**User Story:** As a creator, I want to download my skill so that I can deploy it locally or share it.

**Requirements:**
- [ ] Generate SKILL.md with proper YAML frontmatter:
  ```yaml
  ---
  name: skill-name
  description: Skill description
  triggers: [trigger1, trigger2]
  category: category-name
  tags: [tag1, tag2]
  version: 1.0.0
  author: creator-name
  ---
  ```
- [ ] Include README.md with:
  - Installation instructions
  - Usage examples
  - Troubleshooting tips
  - Creator contact info
- [ ] Package scripts/ folder (if skill has Python/JS code)
- [ ] Package templates/ folder (if skill uses templates)
- [ ] Create proper ZIP structure:
  ```
  skill-name/
  ├── SKILL.md
  ├── README.md
  ├── scripts/ (optional)
  └── templates/ (optional)
  ```
- [ ] Download initiates instantly (<100ms)
- [ ] ZIP filename: `{skill-name}-v{version}.zip`

**Acceptance Criteria:**
- SKILL.md validates against Claude Skills spec
- README includes all required sections
- ZIP structure matches Anthropic standard
- Download works on all browsers
- Filename clearly indicates version

#### 4.4.2 Direct Deploy to Claude
**User Story:** As a creator, I want to deploy directly to Claude.ai so that I can test immediately.

**Requirements:**
- [ ] "Deploy to Claude" button
- [ ] OAuth authentication with Claude.ai
- [ ] Skill upload via Claude API
- [ ] Deployment status indicator:
  - Uploading...
  - Validating...
  - Deployed successfully!
  - Error: {specific message}
- [ ] Success message with link to Claude.ai
- [ ] Error handling with retry option

**Acceptance Criteria:**
- OAuth flow completes in <30 seconds
- Upload completes in <5 seconds
- Validation errors show specific issues
- Success state shows clickable link
- Errors allow retry without re-auth

### 4.5 Browse & Discover

#### 4.5.1 My Skills Dashboard
**User Story:** As a creator, I want to see all my skills so that I can manage them.

**Requirements:**
- [ ] Grid/list view toggle
- [ ] Skills displayed as cards showing:
  - Skill name
  - Category icon
  - Last modified date
  - Version number
  - Status (Draft / Published)
  - Quick actions (Edit, Delete, Duplicate)
- [ ] Sorting options:
  - Name (A-Z)
  - Date modified (newest first)
  - Date created (newest first)
  - Category
- [ ] Search by name/description
- [ ] Filter by category, status, tags
- [ ] Bulk actions (select multiple, delete/archive)

**Acceptance Criteria:**
- Dashboard loads <1 second
- View toggle works instantly
- Search filters as user types
- Sort updates in <500ms
- Bulk actions require confirmation

#### 4.5.2 Skill Detail View
**User Story:** As a creator, I want to view skill details so that I can understand what it does.

**Requirements:**
- [ ] Skill overview showing:
  - Name, description, category
  - Author, version, last updated
  - Tags
  - Trigger phrases
  - Download count (if published)
- [ ] Markdown description rendered
- [ ] "Edit" button (if owner)
- [ ] "Duplicate" button (creates copy)
- [ ] "Download" button
- [ ] "Deploy to Claude" button
- [ ] Version history timeline

**Acceptance Criteria:**
- Detail view loads <1 second
- Markdown renders correctly
- Edit button only shows for owner
- Duplicate creates independent copy
- Version history shows last 10 versions

---

## 5. Non-Functional Requirements

### 5.1 Performance

**Requirements:**
- [ ] Page load time: <2 seconds (initial load)
- [ ] Component drag-and-drop latency: <100ms
- [ ] Live preview execution: <3 seconds
- [ ] Save operation: <1 second
- [ ] Search/filter response: <500ms
- [ ] Export/download: <2 seconds for ZIP generation

**Rationale:** Users expect instant feedback in visual editors. Lag breaks the creative flow and causes abandonment.

### 5.2 Security

**Requirements:**
- [ ] All API calls over HTTPS only
- [ ] JWT-based authentication with 24-hour expiration
- [ ] Input sanitization on all form fields
- [ ] XSS protection for user-generated content
- [ ] CSRF tokens on all state-changing operations
- [ ] Rate limiting: 10 skills created per hour per user
- [ ] File upload validation (SKILL.md format only)
- [ ] No arbitrary code execution in preview environment

**Rationale:** Platform handles user-generated content that executes in Claude. Security is critical to prevent malicious skills.

### 5.3 Scalability

**Requirements:**
- [ ] Support 10,000+ concurrent users
- [ ] Handle 100+ skill creations per minute
- [ ] Store 1M+ skills in database
- [ ] Serve 10K+ assets (images, templates) efficiently
- [ ] Database query optimization (<100ms for dashboard)
- [ ] CDN for static assets (templates, images)
- [ ] Horizontal scaling capability (add servers as needed)

**Rationale:** Must scale to support thousands of creators and millions of skills over time.

### 5.4 Reliability

**Requirements:**
- [ ] 99.9% uptime (max 43 minutes downtime/month)
- [ ] Automated backups every 6 hours
- [ ] Disaster recovery plan (restore <4 hours)
- [ ] Graceful degradation (if preview fails, core builder still works)
- [ ] Error tracking and alerting (Sentry integration)
- [ ] Health check endpoints for monitoring
- [ ] Auto-save every 30 seconds (prevent data loss)

**Rationale:** Creators rely on platform for their livelihood. Downtime = lost revenue.

### 5.5 Usability

**Requirements:**
- [ ] Mobile-responsive (works on tablets, not required on phones)
- [ ] Keyboard shortcuts for power users:
  - Cmd/Ctrl + S: Save
  - Cmd/Ctrl + Z: Undo
  - Cmd/Ctrl + Shift + Z: Redo
  - Cmd/Ctrl + D: Duplicate component
  - Delete: Remove selected component
- [ ] Accessibility (WCAG 2.1 AA compliance):
  - Screen reader support
  - Keyboard navigation
  - High contrast mode
  - Focus indicators
- [ ] Browser support:
  - Chrome 90+ (primary)
  - Firefox 88+ (secondary)
  - Safari 14+ (secondary)
  - Edge 90+ (secondary)
- [ ] In-app help documentation
- [ ] Onboarding tutorial (first-time users)
- [ ] Contextual tooltips

**Rationale:** Visual builder must be intuitive and accessible to non-technical users.

### 5.6 Data & Privacy

**Requirements:**
- [ ] GDPR compliant (EU users)
- [ ] CCPA compliant (California users)
- [ ] User data export capability (JSON format)
- [ ] Account deletion (hard delete within 30 days)
- [ ] Skills owned by creator (not platform)
- [ ] Privacy policy visible during signup
- [ ] Terms of service acceptance required
- [ ] Cookie consent banner (EU users)
- [ ] No selling of user data
- [ ] Encrypted at rest (database encryption)

**Rationale:** User trust is critical for adoption. Must respect privacy and comply with regulations.

---

## 6. User Experience (UX) Flow

### 6.1 New User Onboarding Flow

```
1. User lands on homepage
   ↓
2. Clicks "Build Your First Skill Free"
   ↓
3. Signup modal appears (email + password)
   ↓
4. Email verification sent
   ↓
5. User clicks verification link
   ↓
6. Redirected to onboarding tutorial
   ↓
7. Interactive walkthrough (5 steps):
   - Step 1: Choose a template
   - Step 2: Drag component to canvas
   - Step 3: Configure properties
   - Step 4: Preview skill
   - Step 5: Download or deploy
   ↓
8. Tutorial completion → Dashboard with sample skill created
```

### 6.2 Skill Creation Flow (Template-Based)

```
1. User clicks "Create New Skill" from dashboard
   ↓
2. Template selection screen appears
   ↓
3. User browses templates, clicks "Use Template"
   ↓
4. Editor loads with template pre-populated
   ↓
5. User customizes:
   - Edits skill name/description
   - Modifies components
   - Adjusts properties
   - Adds/removes triggers
   ↓
6. User clicks "Preview" to test
   ↓
7. Preview shows execution (success or errors)
   ↓
8. User iterates (edit → preview) until satisfied
   ↓
9. User clicks "Save as Draft" or "Publish"
   ↓
10. If Publish:
    - Validation runs (all required fields filled?)
    - Success → "Published!" confirmation
    - Error → Specific validation messages, return to editor
```

### 6.3 Skill Creation Flow (Blank Canvas)

```
1. User clicks "Create from Scratch" from template selection
   ↓
2. Blank canvas loads with empty state message
   ↓
3. User fills basic metadata (name, description, category)
   ↓
4. User drags first component from library to canvas
   ↓
5. Property panel opens automatically for configuration
   ↓
6. User adds more components, connects them
   ↓
7. User adds trigger phrases
   ↓
8. User previews → iterates
   ↓
9. User saves/publishes
```

### 6.4 Error Handling Flow

```
Scenario: User tries to publish skill with invalid configuration

1. User clicks "Publish"
   ↓
2. Validation runs
   ↓
3. Errors detected (e.g., missing required field, invalid trigger)
   ↓
4. Modal appears showing:
   - Error count badge
   - List of specific errors with line numbers
   - "Fix Errors" button
   ↓
5. User clicks "Fix Errors"
   ↓
6. Editor highlights components with errors in red
   ↓
7. User clicks errored component
   ↓
8. Property panel opens with error messages inline
   ↓
9. User fixes errors
   ↓
10. Auto-validation shows green checkmark when fixed
    ↓
11. User clicks "Publish" again → Success!
```

---

## 7. Technical Architecture (High-Level)

### 7.1 Frontend Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS + Shadcn/UI components
- **Drag-and-Drop:** React DnD or React Flow
- **Code Editor:** Monaco Editor (for advanced users)
- **State Management:** Zustand
- **API Client:** tRPC or React Query

### 7.2 Backend Stack
- **Runtime:** Node.js (Vercel serverless functions)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (JWT)
- **Storage:** Supabase Storage (for templates, assets)
- **File Generation:** js-yaml (YAML), jszip (ZIP packaging)

### 7.3 Data Models (Simplified)

```typescript
// User
interface User {
  id: string;
  email: string;
  name: string;
  created_at: timestamp;
  plan: 'free' | 'pro' | 'team' | 'enterprise';
}

// Skill
interface Skill {
  id: string;
  user_id: string; // foreign key
  name: string;
  description: string;
  category: string;
  tags: string[];
  triggers: string[];
  version: string;
  status: 'draft' | 'published';
  components: SkillComponent[]; // JSON blob
  created_at: timestamp;
  updated_at: timestamp;
}

// SkillComponent (stored as JSON in Skill.components)
interface SkillComponent {
  id: string;
  type: 'text-gen' | 'data-analysis' | 'code-gen' | etc;
  position: { x: number, y: number };
  properties: Record<string, any>; // component-specific config
  connections: string[]; // IDs of connected components
}

// Template
interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  preview_image_url: string;
  use_count: number;
  skill_data: Skill; // full skill configuration
  created_at: timestamp;
}
```

---

## 8. Success Metrics & Analytics

### 8.1 Product Analytics to Track

**User Acquisition:**
- Signups per day/week/month
- Signup source (organic, referral, ads)
- Email verification completion rate

**Activation:**
- % users who create first skill within 24 hours
- % users who complete onboarding tutorial
- Time to first skill creation (median)

**Engagement:**
- Monthly active creators (created or edited skill)
- Skills created per user (median, p90)
- Template usage rate (% using templates vs blank)
- Preview usage rate (% who preview before publish)
- Most popular templates (by use count)
- Most used components (by drag count)

**Retention:**
- Day 1, Day 7, Day 30 retention
- Churn rate by plan tier
- Resurrection rate (inactive users who return)

**Monetization:**
- Free to Pro conversion rate
- Pro to Team upgrade rate
- Average time to first payment (days)
- Monthly recurring revenue (MRR)
- Customer lifetime value (LTV)

**Quality:**
- Skill error rate (% published skills with errors)
- Support ticket rate (tickets per 100 users)
- Net Promoter Score (NPS)
- Feature usage (which features used most)

### 8.2 A/B Testing Plan

**Tests to Run Post-Launch:**
1. Onboarding tutorial (5-step vs 3-step vs none)
2. Template gallery layout (grid vs list vs carousel)
3. CTA button text ("Build Skill" vs "Create Skill" vs "Start Building")
4. Pricing page (monthly vs annual default)
5. Live preview position (right sidebar vs bottom panel)

---

## 9. Go-to-Market Strategy (Brief)

### 9.1 Launch Plan

**Pre-Launch (2 weeks before):**
- Recruit 100 beta testers (agencies, educators, teams)
- Email sequence: 3 emails warming up launch
- Social media teasers (Twitter, LinkedIn)
- Prepare press kit (screenshots, demo video, talking points)

**Launch Day:**
- ProductHunt launch (aim for Product of the Day)
- Reddit post in r/ClaudeAI (show-and-tell)
- Twitter thread with demo GIF
- Email beta testers: "We're live!"
- Post in Claude Discord/communities

**Post-Launch (Week 1):**
- Daily monitoring of support channels
- Rapid bug fixes (hot fixes within 24 hours)
- Collect feedback from first 100 users
- Iterate based on feedback

### 9.2 Positioning & Messaging

**Tagline:** "Build Claude Skills Visually. No Code Required."

**Value Props:**
- **For Creators:** "Create professional Claude Skills in 5 minutes"
- **For Teams:** "Centralize and standardize your team's Claude workflows"
- **For Educators:** "Package your expertise into reusable skill templates"

**Competitive Positioning:**
- vs Manual SKILL.md: "10x faster with visual builder"
- vs GetClaudeSkills: "Only platform with no-code builder"
- vs SkillsMP: "Create skills, don't just browse them"

---

## 10. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|---------|------------|
| Visual builder too complex to build in 6 weeks | Medium | High | Start with form-based builder, iterate to drag-drop in Phase 2 |
| Users prefer manual SKILL.md editing | Low | High | Target non-technical users who can't code; offer code editor for advanced users |
| Claude API rate limits/costs too high | Medium | Medium | Implement preview caching, rate limit per user, optimize API calls |
| Competitors copy visual builder quickly | High | Medium | Speed to market + quality moat; file for design patents |
| Not enough templates to cover use cases | Medium | Medium | Community contribution system; professional services to create custom templates |
| Performance issues with complex skills | Low | Medium | Optimize rendering, virtualize large canvases, progressive loading |

---

## 11. Open Questions for Team Discussion

1. **Drag-Drop Library:** React DnD vs React Flow vs custom? (Performance trade-offs?)
2. **Preview Environment:** How to safely execute untrusted code? Sandboxing strategy?
3. **Component Library:** Start with 10 templates or build dynamic component system from day 1?
4. **Monetization:** Enable marketplace in Phase 1 or wait for Phase 2?
5. **Multi-tenancy:** Support Teams in Phase 1 MVP or delay to Phase 2?
6. **API Costs:** What's acceptable cost per preview execution? Need to set per-user limits?
7. **Mobile:** Build responsive from day 1 or desktop-only MVP?
8. **Onboarding:** Interactive tutorial or video walkthrough? Resource investment?

---

## 12. Appendix: User Stories (Detailed)

### Epic 1: Visual Skill Builder

**US-001:** As a creator, I want to drag components from a library onto a canvas so that I can visually assemble my skill.  
**Priority:** P0 (Must-Have)  
**Effort:** 5 points  

**US-002:** As a creator, I want to connect components together so that I can define data flow between them.  
**Priority:** P1 (Should-Have)  
**Effort:** 8 points  

**US-003:** As a creator, I want to configure each component's properties in a side panel so that I can customize behavior without code.  
**Priority:** P0 (Must-Have)  
**Effort:** 5 points  

**US-004:** As a creator, I want to preview my skill's execution so that I can test before publishing.  
**Priority:** P0 (Must-Have)  
**Effort:** 8 points  

**US-005:** As a creator, I want to save my work as a draft so that I can return later to finish.  
**Priority:** P0 (Must-Have)  
**Effort:** 3 points  

### Epic 2: Template System

**US-006:** As a creator, I want to browse a library of templates so that I can start from a proven foundation.  
**Priority:** P0 (Must-Have)  
**Effort:** 5 points  

**US-007:** As a creator, I want to use a template as a starting point so that I can customize it for my needs.  
**Priority:** P0 (Must-Have)  
**Effort:** 3 points  

**US-008:** As a creator, I want to save my custom skill as a new template so that I can reuse it.  
**Priority:** P2 (Nice-to-Have)  
**Effort:** 5 points  

### Epic 3: Skill Management

**US-009:** As a creator, I want to see all my skills in a dashboard so that I can manage them.  
**Priority:** P0 (Must-Have)  
**Effort:** 5 points  

**US-010:** As a creator, I want to search and filter my skills so that I can find them quickly.  
**Priority:** P1 (Should-Have)  
**Effort:** 3 points  

**US-011:** As a creator, I want to duplicate an existing skill so that I can create variations.  
**Priority:** P1 (Should-Have)  
**Effort:** 2 points  

**US-012:** As a creator, I want to delete skills I no longer need so that I can keep my workspace clean.  
**Priority:** P1 (Should-Have)  
**Effort:** 2 points  

### Epic 4: Export & Deploy

**US-013:** As a creator, I want to download my skill as a ZIP file so that I can deploy it locally.  
**Priority:** P0 (Must-Have)  
**Effort:** 5 points  

**US-014:** As a creator, I want to deploy directly to Claude.ai so that I can test immediately.  
**Priority:** P1 (Should-Have)  
**Effort:** 8 points  

**US-015:** As a creator, I want to see deployment status so that I know if it succeeded.  
**Priority:** P1 (Should-Have)  
**Effort:** 3 points  

---

## 13. Next Steps for Development Team

### Immediate Actions (This Week)

1. **Technical Spike:** Research drag-and-drop libraries (React DnD vs React Flow)
   - Owner: Lead Frontend Engineer
   - Deliverable: Recommendation document with pros/cons
   - Due: Friday EOD

2. **Database Schema Design:** Create detailed schema for Skills, Users, Templates
   - Owner: Backend Lead
   - Deliverable: Entity-relationship diagram + migration scripts
   - Due: Friday EOD

3. **UI Component Audit:** Review Shadcn/UI for needed components
   - Owner: Frontend Team
   - Deliverable: List of components to build vs use from library
   - Due: Thursday EOD

4. **Preview Environment Design:** Spec out sandboxing approach for executing untrusted skills
   - Owner: DevOps + Backend
   - Deliverable: Architecture diagram + security review
   - Due: Friday EOD

5. **Template Creation:** Build 10 initial templates with full SKILL.md content
   - Owner: Product + Content
   - Deliverable: 10 complete template files in repo
   - Due: Monday of Week 2

### Week 1 Sprint Planning (Dec 30 - Jan 5)

**Goal:** Build foundational architecture + basic form-based builder

**Stories to Complete:**
- US-001: Drag components (basic version, no connections)
- US-003: Property configuration panel
- US-006: Template browsing
- US-007: Use template
- US-009: Skills dashboard
- US-013: Download as ZIP

**Deliverables:**
- Working prototype: User can select template → customize in form → download ZIP
- No visual canvas yet (phase 2), just forms
- Dashboard shows created skills
- Basic templates functional

### Definition of Done

A feature is "Done" when:
- [ ] Code written and reviewed (PR approved by 2 engineers)
- [ ] Unit tests written (>80% coverage)
- [ ] Integration tests passing
- [ ] UI matches design specs (Figma mockups)
- [ ] Accessible (keyboard navigation, screen reader support)
- [ ] Responsive (works on desktop + tablet)
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Documentation updated (API docs, component library)
- [ ] Product Manager sign-off

---

## Document Change Log

| Version | Date | Author | Changes |
|---------|------|---------|---------|
| 1.0 | Dec 24, 2025 | Brian Dawson | Initial PRD created |

---

**Questions or feedback?** Contact Product Manager: brian@claudeskillsfacet.com

**Document Location:** `/docs/PRD-VISUAL-SKILL-BUILDER.md`  
**Related Docs:** See `/docs/02-ARCHITECTURE.md` for technical implementation details
