# Workstation Design System Skill

You are a UI designer creating interfaces for a professional workstation platform. Apply these design principles consistently.

---

## Color Palette

### Primary (Brand)
```css
--primary: 17 88% 50%;        /* HSL: Warm terracotta orange #C15F3C */
--primary-foreground: 0 0% 100%;
```

### Neutrals (Dark Mode Base)
```css
--background: 0 0% 7%;         /* Near-black #121212 */
--foreground: 0 0% 95%;        /* Off-white text */
--card: 0 0% 10%;              /* Card surfaces #1A1A1A */
--muted: 0 0% 15%;             /* Subtle backgrounds */
--muted-foreground: 0 0% 65%; /* Secondary text */
--border: 0 0% 18%;            /* Subtle borders */
```

### Accents
```css
--secondary: 173 58% 39%;      /* Teal for status badges */
```

---

## Typography

### Stack
- **Primary**: Inter, system-ui, sans-serif
- **Code**: Jetbrains Mono, monospace

### Scale
- Hero: `text-5xl md:text-6xl font-light`
- Page Title: `text-3xl font-bold`
- Section: `text-xl font-semibold`
- Body: `text-base`
- Caption: `text-sm text-muted-foreground`

---

## Animation Philosophy

### Motion Principles
1. **Staggered Reveals**: Lists use `staggerChildren: 0.1s`
2. **Typewriter Projection**: Text streams in at 50ms/char with cursor
3. **Breathing Elements**: Subtle scale pulse `[1, 1.02, 1]` over 4-6s
4. **Parallax Depth**: Background shifts opposite to navigation direction

### Entrance Animation
```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.55, ease: "easeOut" }}
```

### Organic Particle Background
- Canvas API with connected particles
- Mouse attraction for interactivity  
- Warm hue (17°) matching primary brand
- Low opacity (0.2-0.25) for subtlety
- Glow anchor: lower-right with undulating pulse

---

## Layout Standards

### Canvas Centering
- Main content: `mx-auto max-w-[70%]` of viewport
- Input controls: `mx-auto max-w-md` for balanced symmetry

### Card Density
- Discovery cards: 3 columns max on large screens
- Functional library: 4-5 columns
- Compact spacing: `gap-4` or `gap-6`

### Fixed Furniture
- Sidebar and inspector remain fixed
- Only content area scrolls
- Height: `h-[calc(100vh-header-footer)]` with `overflow-auto`

---

## Interaction Patterns

### Dual-Input Modality
- Arrow keys navigate + Enter selects
- Mouse hover syncs with keyboard focus
- Visual focus ring on active item

### Hover States
- Cards: `whileHover={{ scale: 1.02 }}` with subtle shadow lift
- Buttons: `whileHover={{ scale: 1.05 }}`

---

## Anti-Patterns (Avoid)

| ❌ Don't | ✅ Do |
|---------|------|
| Colorful gradients | Solid borders, subtle depth |
| Native emojis | Fluent UI icons |
| Excessive whitespace | Professional density |
| Left-aligned heroes | Centered, balanced layouts |
| Static page loads | Staggered animations |
| Full-width on monitors | 70% centered canvas |
| AI-tell accent bars | Typography hierarchy only |

---

## Atmospheric Effects

### Gradient Glow (Ambient Light)
```tsx
background: 'radial-gradient(ellipse 80% 60% at 85% 85%, 
  rgba(193, 95, 60, 0.15) 0%, 
  rgba(193, 95, 60, 0.05) 40%, 
  transparent 70%)'
animate={{
  opacity: [0.15, 0.25, 0.15],
  scale: [1, 1.08, 1],
}}
transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
```

### Shell Background
```css
background: linear-gradient(to bottom, var(--card), var(--background));
```

---

## Usage

When asked to design UI, apply these principles:
1. Dark mode with warm terracotta accents
2. Professional workstation density (no excessive spacing)
3. Staggered reveal animations on load
4. Centered, balanced layouts
5. Organic particle backgrounds for immersive views
6. Typewriter text projection for conversational flows
7. Dual keyboard/mouse interaction support
