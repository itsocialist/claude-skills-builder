# GetClaudeSkills Style Guide

> **Status**: Working Document for STORY-017 & STORY-018  
> **Owner**: Jordan Rivera (Marketing)  
> **Last Updated**: December 27, 2025

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Primary** | `#C15F3C` | CTAs, buttons, focus rings, brand accent |
| **Primary 600** | `#E55A2B` | Hover states |

### Secondary / Accent

| Mode | Hex | Color | Usage |
|------|-----|-------|-------|
| Light Mode | `#5B4CFF` | 🟣 Purple | Links, secondary actions |
| **Dark Mode** | `#14B8A6` | 🩵 Teal | Accent buttons, secondary actions |

> ✅ **Updated**: Dark mode now uses teal `#14B8A6` as a vibrant accent that complements the orange primary.

### Accent / Muted

| Name | Hex | Usage |
|------|-----|-------|
| **Accent** | `#F3F4F6` (light) / `#3f3f3f` (dark) | Hover states, selected nav items |
| **Muted** | `#F3F4F6` (light) / `#3f3f3f` (dark) | Subtle backgrounds |
| **Muted Foreground** | `#6B7280` (light) / `#a3a3a3` (dark) | Secondary text |

### Gray Scale

| Name | Hex | Purpose |
|------|-----|---------|
| Gray 50 | `#F9FAFB` | Light mode background |
| Gray 100 | `#F3F4F6` | Accent/muted surfaces |
| Gray 200 | `#E5E7EB` | Borders, inputs |
| Gray 300 | `#D1D5DB` | Disabled states |
| Gray 600 | `#4B5563` | Muted text |
| Gray 900 | `#111827` | Light mode foreground |

### Dark Mode (Current Default)

| Element | Value |
|---------|-------|
| Background | `#1a1a1a` |
| Card | `#262626` |
| Foreground | `#e5e5e5` |
| Border | `#3f3f3f` |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Destructive | `#EF4444` | Errors, delete actions |
| Valid | `green-500` | Success states |
| Warning | `yellow-500` | Warning states |

---

## Typography

### Font Families

| Type | Font | Variable | Source |
|------|------|----------|--------|
| **Sans (Body)** | Inter | `--font-sans` | Google Fonts |
| **Mono (Code)** | JetBrains Mono | `--font-mono` | Google Fonts |

---

## Layout Guidelines

### Shell Layout (App Pages)

| Element | Width | Notes |
|---------|-------|-------|
| **Sidebar** | `w-64` (256px) | Left navigation |
| **Inspector** | `w-[300px]` | Right panel when present |
| **Main Content** | `flex-1` | Centered to `max-w-4xl` when no inspector |
| **Header** | `h-14` | Sticky, border-b-2 border-primary |
| **Footer/Status** | `h-10` | Fixed bottom |

### Content Width Patterns

| Context | Class | Width |
|---------|-------|-------|
| Marketplace | `max-w-7xl` | 1280px |
| Admin | `max-w-6xl` | 1152px |
| Content pages | `max-w-4xl` | 896px |
| Builder | `max-w-3xl` | 768px |
| Wizard | `max-w-2xl` | 672px |
| Modals | `max-w-md` | 448px |

### Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| `lg:` (1024px+) | Full sidebar + inspector visible |
| Below `lg:` | Mobile sheet navigation, bottom inspector |

---

## Spacing Tokens

| Token | Class | Usage |
|-------|-------|-------|
| Card Padding | `p-5` | Standard card padding |
| Card Compact | `p-4` | Dense layouts |
| Section | `py-10` | Vertical section padding |
| Section Large | `py-16` | Feature sections |
| Mobile Padding | `p-4` | Mobile content |
| Desktop Padding | `p-8` | Desktop content (md:p-8) |

---

## Border Radius

| Token | Value |
|-------|-------|
| Base | `0.5rem` (8px) |
| SM | `calc(var(--radius) - 4px)` |
| MD | `calc(var(--radius) - 2px)` |
| LG | `var(--radius)` |
| XL+ | Increments of 4px |

---

## Image Assets

### Hero Images

| File | Dimensions | Usage |
|------|------------|-------|
| `hero-banner.png` | Standard | Homepage hero |
| `hero-banner-wide.png` | 1200x600 | Open Graph / social share |

### Social Assets

| File | Usage |
|------|-------|
| `social/linkedin-banner.png` | LinkedIn company banner |
| `social/linkedin-profile.png` | LinkedIn profile image |

### Screenshots (Demo Journey)

| Step | File |
|------|------|
| 1 | `screenshots/journey-1-landing.png` |
| 2 | `screenshots/journey-2-templates[-cropped].png` |
| 3 | `screenshots/journey-3-wizard[-cropped].png` |
| 4 | `screenshots/journey-4-builder[-cropped].png` |
| 5 | `screenshots/journey-5-export[-cropped].png` |

### Mock Images

| File | Usage |
|------|-------|
| `screenshots/mock-builder.png` | Builder mockup |
| `screenshots/mock-templates.png` | Templates mockup |
| `screenshots/mock-wizard.png` | Wizard mockup |
| `screenshots/mock-export.png` | Export mockup |

---

## Component Patterns

### Badges
```css
/* Category badge */
inline-block px-2 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full
```

### Cards
```css
/* Standard card */
hover:shadow-lg transition-shadow border-border

/* Template card */
flex flex-col hover:shadow-lg transition-shadow border-border
```

### Navigation Items
```css
/* Active state */
text-foreground bg-accent

/* Inactive state */
text-muted-foreground hover:bg-accent hover:text-foreground
```

---

## Brand Personality

| Attribute | Description |
|-----------|-------------|
| Professional | Business tool feel, not playful |
| Approachable | Not intimidating, welcoming |
| Modern | Clean, minimal, contemporary |
| Trustworthy | Reliable, established |
| Innovative | AI-powered, forward-thinking |

---

## Logo Requirements (Pending #25)

### Deliverables Needed
- [ ] Primary horizontal logo
- [ ] Stacked logo variant
- [ ] Icon mark (standalone)
- [ ] Dark and light mode versions
- [ ] Favicon set (16, 32, 180, 512px)
- [ ] Open Graph image (1200x630)

### Color Context
- **Primary brand color**: `#C15F3C` (burnt orange)
- **Dark background**: `#1a1a1a`
- **Light background**: `#F9FAFB`
- Logo must be legible on both

---

## File References

| File | Purpose |
|------|---------|
| [globals.css](file:///Users/briandawson/workspace/claude-skills-builder/frontend/src/app/globals.css) | CSS variables and colors |
| [layout.tsx](file:///Users/briandawson/workspace/claude-skills-builder/frontend/src/app/layout.tsx) | Font configuration |
| [theme.ts](file:///Users/briandawson/workspace/claude-skills-builder/frontend/src/lib/theme.ts) | Spacing and component tokens |
| [Shell.tsx](file:///Users/briandawson/workspace/claude-skills-builder/frontend/src/components/layout/Shell.tsx) | App shell layout |
