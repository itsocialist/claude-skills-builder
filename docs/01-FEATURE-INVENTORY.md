# ClaudeSkillsFacet - Feature Inventory

**Last Updated:** 2025-12-24

## Core Features

### 1. Individual Skill Builder (`/app/builder`)

| Feature | Status | Description |
|---------|--------|-------------|
| Basic Info Form | ✅ | Name, description, category inputs |
| Trigger Editor | ✅ | Add/remove trigger phrases with badges |
| Instructions Editor | ✅ | Monaco markdown editor with dark theme |
| Markdown Preview | ✅ | Real-time preview with split view toggle |
| Skill Snippets | ✅ | Pre-built markdown sections (one-click insert) |
| Export Preview | ✅ | Tabbed inspector showing SKILL.md output |
| Validation Engine | ✅ | Real-time spec compliance checking |
| Download Generation | ✅ | ZIP with SKILL.md and README.md |
| Template Pre-fill | ✅ | Deep-link support via `?template=` param |
| Resource Manager | ✅ | Add resources, examples, templates, scripts |
| **Create with AI** | ✅ | Prompt-to-Skill generation via Claude API |
| **Save to Library** | ✅ | Persist skills to user's cloud library |

### 2. Template Library (`/app/templates`)

| Feature | Status | Description |
|---------|--------|-------------|
| Template Grid | ✅ | Responsive card layout |
| Keyword Search | ✅ | Real-time filtering by name/description/tags |
| Category Filters | ✅ | Interactive pills (6 categories) |
| Template Details | ✅ | Preview page with full instructions |
| Use Template | ✅ | One-click pre-fill to builder |

### 3. Package Builder (`/app/packages/new`)

| Feature | Status | Description |
|---------|--------|-------------|
| Multi-step Wizard | ✅ | Guided package creation flow |
| Skill Selection | ✅ | Choose multiple skills to bundle |
| Package Metadata | ✅ | Name, description, version |
| Trigger Index | ✅ | Auto-generated routing table |
| Bundle Generation | ✅ | Single SKILL.md with all skills |
| Resource Bundling | ✅ | Include folders from all skills |

### 4. Landing Page (`/`)

| Feature | Status | Description |
|---------|--------|-------------|
| Hero Section | ✅ | Custom banner with gradient overlay |
| Feature Cards | ✅ | Lucide icons, value propositions |
| Template Showcase | ✅ | Top templates with "Use Template" CTAs |
| High-Density Layout | ✅ | Optimized above-the-fold content |

### 5. User Library (`/library`)

| Feature | Status | Description |
|---------|--------|-------------|
| Skill Cards | ✅ | Grid layout with skill metadata |
| Search & Filter | ✅ | By name, category, triggers |
| CRUD Operations | ✅ | Create, read, update, delete skills |
| Cloud Persistence | ✅ | Supabase-backed storage |

### 6. AI-Powered Skill Generation

| Feature | Status | Description |
|---------|--------|-------------|
| Create with AI Button | ✅ | Opens AI generator modal |
| Industry Presets | ✅ | 5 industries: Real Estate, Legal, Financial, E-Commerce, Professional Services |
| Task Description | ✅ | Natural language skill description |
| Claude API Integration | ✅ | Uses BYOK key for generation |
| Skill Preview | ✅ | Preview generated name, triggers, instructions |
| One-Click Accept | ✅ | Load generated skill into builder |

### 7. Global UI/UX

| Feature | Status | Description |
|---------|--------|-------------|
| Dark Mode | ✅ | Enforced globally via `html.dark` |
| 3-Column Shell | ✅ | Sidebar, Main, Inspector layout |
| Sticky Header | ✅ | Persistent with inline title editing |
| Status Bar | ✅ | Validation feedback at bottom |
| Crail Branding | ✅ | Anthropic orange (#C15F3C) |
| Semantic Theming | ✅ | CSS variables for easy reskinning |
| Authentication | ✅ | Sign In/Sign Up via Supabase |
| User Menu | ✅ | Profile, Library, Sign Out |

## Templates Available

| Template ID | Name | Category |
|-------------|------|----------|
| `property-listing` | Property Listing Generator | Real Estate |
| `meeting-notes` | Meeting Notes & Action Items | Business |
| `financial-analysis` | Financial Statement Analysis | Finance |
| `prd-generator` | PRD Generator | Product |
| `brand-identity` | Brand Identity Builder | Marketing |
| `professional-email` | Professional Email Drafter | Business |

## Validation Rules

| Field | Rule | Severity |
|-------|------|----------|
| Name | Required, max 64 chars (slugified) | Error |
| Description | 1-1024 chars | Error |
| Description | < 20 chars | Warning |
| Instructions | Required | Error |
| Instructions | < 50 chars | Warning |
| Token Count | > 10,000 tokens | Warning |
