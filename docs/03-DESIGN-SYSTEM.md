# ClaudeSkillsFacet - Design System (v2)

**Last Updated:** 2025-12-24

> **Note:** This document supersedes the Phase 1 design system. The platform now uses Anthropic's Crail palette with enforced dark mode.

## Brand Identity

- **Name:** ClaudeSkillsFacet
- **Tagline:** "Claude Skills: Find, Build and Bundle"
- **Visual Style:** Native Claude alignment (dark-first, minimal)

## Color Palette

### Primary Colors
| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| `--primary` | `#C15F3C` | `16 53% 50%` | Buttons, accents, CTAs |
| `--primary-foreground` | `#FFFFFF` | `0 0% 100%` | Text on primary |

### Background Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--background` | `#1a1a1a` | Page background |
| `--card` | `#262626` | Cards, panels, modals |
| `--muted` | `#404040` | Secondary surfaces |

### Text Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `--foreground` | `#F5F5F5` | Primary text |
| `--muted-foreground` | `#A3A3A3` | Secondary text, labels |
| `--card-foreground` | `#F5F5F5` | Text on cards |

### Border & Input
| Token | Hex | Usage |
|-------|-----|-------|
| `--border` | `#404040` | Borders, dividers |
| `--input` | `#404040` | Input backgrounds |
| `--ring` | `#C15F3C` | Focus rings |

## Typography

### Font Families
```css
--font-sans: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;
```

### Font Sizes
| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px | Labels, small text |
| `text-sm` | 14px | Body text, inputs |
| `text-base` | 16px | Standard body |
| `text-lg` | 18px | Subheadings |
| `text-xl` | 20px | Section headers |
| `text-2xl` | 24px | Page titles |
| `text-3xl` | 30px | Hero headings |

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight spacing |
| `space-2` | 8px | Element gaps |
| `space-3` | 12px | Section padding |
| `space-4` | 16px | Card padding |
| `space-5` | 20px | Standard padding |
| `space-6` | 24px | Large padding |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 4px | Small elements |
| `rounded-md` | 8px | Buttons, inputs |
| `rounded-lg` | 12px | Cards, modals |
| `rounded-full` | 9999px | Pills, badges |

## Component Patterns

### Buttons
```tsx
// Primary action
<Button className="bg-primary text-primary-foreground">
  Generate Skill
</Button>

// Secondary action
<Button variant="outline">
  Save Draft
</Button>

// Ghost action (navigation)
<Button variant="ghost">
  Cancel
</Button>
```

### Cards
```tsx
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="text-foreground">Title</CardTitle>
  </CardHeader>
  <CardContent className="text-muted-foreground">
    Content
  </CardContent>
</Card>
```

### Inputs
```tsx
<Input 
  className="bg-input border-border text-foreground placeholder:text-muted-foreground/50"
  placeholder="Enter skill name..."
/>
```

### Badges
```tsx
<Badge className="bg-primary/10 text-primary border-primary/20">
  Category
</Badge>
```

## Layout System

### Shell Structure
- **Header:** `h-14`, sticky, `bg-card border-b`
- **Sidebar:** `w-60` (240px), `bg-card`
- **Main:** `flex-1`, scrollable
- **Inspector:** `w-[400px]`, sticky, tabbed

### Responsive Breakpoints
| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 768px | Single column, drawer nav |
| Tablet | 768-1024px | Two columns, collapsed inspector |
| Desktop | > 1024px | Full 3-column layout |

## Dark Mode Implementation

Dark mode is enforced globally via the `dark` class on `<html>`:

```tsx
// layout.tsx
<html lang="en" className="dark">
```

All components use semantic CSS variables that automatically adapt:
```css
/* globals.css */
.dark {
  --background: #1a1a1a;
  --foreground: #F5F5F5;
  --card: #262626;
  /* ... */
}
```

## Monaco Editor Theme

The instructions editor uses `vs-dark` theme:
```tsx
<Editor
  theme="vs-dark"
  defaultLanguage="markdown"
/>
```

## Legacy Colors (Deprecated)

The following colors from Phase 1 MVP have been replaced:

| Old | New | Reason |
|-----|-----|--------|
| `#FF6B35` (Orange) | `#C15F3C` (Crail) | Anthropic brand alignment |
| Light mode default | Dark mode enforced | Claude native experience |
| `text-gray-*` | `text-foreground` | Semantic theming |
| `bg-white` | `bg-card` | Dark mode compatibility |
