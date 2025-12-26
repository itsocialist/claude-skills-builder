# Design System - ClaudeSkillsFacet

> **Note:** For complete design specifications, query ship-ape memory:  
> `search_context(project_name="claude-skills-builder", query="design system")`

## Brand Identity

- **Name:** ClaudeSkillsFacet
- **Tagline:** "Build Claude Skills in minutes, not hours"
- **Personality:** Professional, efficient, accessible

## Color Palette

### Primary Colors
```css
--color-primary-500: #FF6B35;  /* Orange - CTAs, active states */
--color-primary-600: #E55A2B;  /* Orange dark - hover states */
--color-secondary-500: #5B4CFF; /* Purple - secondary actions */
```

### Neutral Scale
```css
--color-gray-50: #F9FAFB;   /* Backgrounds */
--color-gray-100: #F3F4F6;  /* Subtle backgrounds */
--color-gray-200: #E5E7EB;  /* Borders, dividers */
--color-gray-300: #D1D5DB;  /* Disabled states */
--color-gray-600: #4B5563;  /* Secondary text */
--color-gray-900: #111827;  /* Primary text */
```

### Status Colors
```css
--color-success: #10B981;
--color-warning: #F59E0B;
--color-error: #EF4444;
--color-info: #3B82F6;
```

## Typography

**Font Families:**
- Sans: Inter (fallback: system-ui, -apple-system, "Segoe UI")
- Mono: JetBrains Mono

**Type Scale:**
```css
/* Headings */
h1: 30px / 36px line-height, font-weight: 600-700
h2: 24px / 32px, font-weight: 600
h3: 20px / 28px, font-weight: 600
h4: 18px / 26px, font-weight: 600

/* Body */
body: 16px / 24px, font-weight: 400
small: 14px / 20px
tiny: 12px / 18px
```

## Spacing Scale

Based on 8px grid:
```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
```

## Layout

### Three-Column Layout
```
┌────────────────────────────────────────────────────────────┐
│ Header (64px height)                                       │
├────────────┬───────────────────────┬───────────────────────┤
│ Sidebar    │ Main Content          │ Inspector Panel       │
│ 240px      │ Flexible              │ 320px (collapsible)   │
│            │                       │                       │
└────────────┴───────────────────────┴───────────────────────┘
```

### Responsive Breakpoints
- Desktop: 1280px+ (3-column layout)
- Tablet: 768px-1279px (2-column, hide inspector)
- Mobile: <768px (1-column, drawer navigation)

## Component Tokens

### Borders
```css
--border-radius-sm: 4px;
--border-radius-md: 8px;
--border-radius-lg: 12px;
--border-width: 1px;
--border-width-focus: 2px;
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.07);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.10);
```

## Key Components

### Button
**Variants:** primary, secondary, outline, ghost  
**Sizes:** sm (32px), md (40px), lg (48px)

**Primary Button:**
```css
background: var(--color-primary-500);
color: white;
border-radius: 8px;
padding: 12px 24px;

&:hover {
  background: var(--color-primary-600);
}
```

### Card
```css
background: white;
border: 1px solid var(--color-gray-200);
border-radius: 12px;
padding: 24px;
box-shadow: var(--shadow-sm);
```

### Input
```css
height: 40px;
border: 1px solid var(--color-gray-300);
border-radius: 8px;
padding: 10px 14px;

&:focus {
  border: 2px solid var(--color-primary-500);
  outline: none;
}

&:error {
  border: 2px solid var(--color-error);
}
```

### Tag/Badge
```css
background: var(--color-gray-100);
color: var(--color-gray-900);
border-radius: 16px; /* pill shape */
padding: 4px 12px;
height: 28px;
font-size: 14px;
```

## Figma Integration

Use figmadev MCP to extract exact values:

```bash
# Connect to project
figmadev connect 521820865

# Extract color styles
figmadev get-colors

# Extract text styles  
figmadev get-typography

# Export specific components
figmadev export-component "Button/Primary"
figmadev export-component "Card"
figmadev export-component "Input"
```

## Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#FF6B35',
          600: '#E55A2B'
        },
        secondary: {
          500: '#5B4CFF'
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          600: '#4B5563',
          900: '#111827'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px'
      }
    }
  }
};
```

## Accessibility

- **WCAG 2.1 AA Compliant**
- **Keyboard Navigation:** All interactive elements accessible via keyboard
- **Focus Indicators:** 2px orange outline on all focusable elements
- **Color Contrast:** 4.5:1 minimum ratio for text
- **ARIA Labels:** Required on all interactive elements without visible labels

## Reference

For detailed component specifications, interaction patterns, and complete screen layouts:

```bash
# Query ship-ape for full design specifications
ship-ape search_context \
  --project_name="claude-skills-builder" \
  --query="UI/UX specification"
```

See also:
- Figma Project: https://www.figma.com/files/team/1276196716415315936/project/521820865
- SaaS Dashboard Reference: https://www.figma.com/design/O22AdQ4cdTA7KaU5RUJJgn
