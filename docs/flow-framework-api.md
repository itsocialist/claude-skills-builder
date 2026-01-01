# Flow Framework API

A declarative, cinematic presentation system for guided user experiences.

## Quick Start

```tsx
import { 
  FlowProvider, FlowSlide, FlowBackground,
  TextScrollOptions, VisualOrbOptions,
  useFlow, useAIRecommendations
} from '@/components/flow';
```

---

## Core Components

### FlowProvider
Context provider for step state and navigation.

```tsx
<FlowProvider 
  initialSlide={0}
  onComplete={() => console.log('Done')}
  onStepChange={(index) => console.log(index)}
>
  {children}
</FlowProvider>
```

### FlowSlide
Animated slide wrapper with transition presets.

```tsx
<FlowSlide 
  id="welcome" 
  transition="slideUp"  // slideUp | fadeIn | scaleIn | popIn
>
  <h1>Welcome</h1>
</FlowSlide>
```

### FlowBackground
Animated particles + glow that follows step.

```tsx
<FlowBackground 
  stepIndex={currentStep}
  particleCount={60}
  colorHue={17}  // Terracotta orange
/>
```

---

## Option Presentation Types

### TextScrollOptions
Horizontal arc scroll with Z-depth fading.

```tsx
<TextScrollOptions
  options={[
    { id: 'dev', label: 'Developer', emoji: '💻' },
    { id: 'mkt', label: 'Marketer', emoji: '📣' },
  ]}
  selectedId={selected}
  onSelect={(id) => setSelected(id)}
/>
```

**Behavior:**
- Options scroll on arc along Z-axis
- Fade at edges, full opacity at center
- Arrow keys navigate, Enter selects

### VisualOrbOptions
3D orbs with particle connections.

```tsx
<VisualOrbOptions
  options={[
    { id: 'content', label: 'Create content', emoji: '✍️' },
    { id: 'research', label: 'Research', emoji: '🔍' },
    { id: 'automate', label: 'Automate', emoji: '⚡' },
    { id: 'learn', label: 'Learn AI', emoji: '🧠' },
  ]}
  selectedId={selected}
  onSelect={(id) => setSelected(id)}
/>
```

**Behavior:**
- 4 orbs connected like particles
- Focused orb moves forward on Z-axis
- Canvas draws particle connections
- Arrow keys navigate in 2D grid

---

## Hooks

### useFlow
Access flow context from any child component.

```tsx
const { 
  currentIndex,    // Current step number
  currentSlideId,  // Current slide ID
  next,            // Go to next slide
  prev,            // Go to previous slide
  goTo,            // Jump to specific slide
  isAnimating,     // Animation in progress
} = useFlow();
```

### useAIRecommendations
Get personalized bundle recommendations.

```tsx
const { bundles, getRecommendations, isLoading } = useAIRecommendations();

await getRecommendations({
  role: 'developer',
  goal: 'automate',
  experience: 75
});
// bundles now contains ranked recommendations
```

---

## Animation Presets

```tsx
import { slideUp, fadeIn, scaleIn, popIn, breathe } from '@/components/flow';
```

| Preset | Description |
|--------|-------------|
| `slideUp` | Slide from bottom with fade |
| `fadeIn` | Simple opacity transition |
| `scaleIn` | Scale from 0.9 with fade |
| `popIn` | Bouncy scale entrance |
| `breathe` | Continuous subtle pulse |

---

## Glow Configuration

```tsx
import { GLOW_POSITIONS, getGlowPosition } from '@/components/flow';

// Glow follows step progression
// Step 0: bottom-right (95%, 95%)
// Step 1: mid-right (95%, 55%)
// Step 2: upper-right (95%, 25%)
// ...moves toward center
```

---

## Type Definitions

```tsx
type OptionPresentationType = 
  | 'visual-card'   // Standard grid (default)
  | 'visual-orb'    // 3D orbs
  | 'text-scroll'   // Arc scroll
  | 'text-3space';  // 3D floating text

interface Option {
  id: string;
  label: string;
  emoji?: string;
}
```
