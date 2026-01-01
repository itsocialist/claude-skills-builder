# Flow Framework API (v2.1: Liquid Glass)

A declarative, cinematic presentation system for guided user experiences, featuring the "Liquid Glass" / "Minority Report" aesthetic.

**Sprint 25 Updates**: FlowTransition, FlowButlerOverlay, slower glow lerp, adaptive step filtering.

## Quick Start

```tsx
import { 
  FlowProvider, FlowSlide, FlowBackground,
  FlowTransition, FlowButlerOverlay,
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

## Option Presentation Types (Liquid Glass)

### TextScrollOptions
Horizontal arc scroll with "Liquid Focus Lens" and Z-depth fading.

```tsx
<TextScrollOptions
  options={[
    { id: 'dev', label: 'Developer' },
    { id: 'mkt', label: 'Marketer' },
  ]}
  selectedId={selected}
  onSelect={(id) => setSelected(id)}
/>
```

**Architecture (Dream State):**
- **Liquid Focus Lens**: A static `div` at `z-index: 0` with `backdrop-filter: blur(8px)` and gradient borders.
- **Floating Text**: Options render in a `preserve-3d` context at `z-index: 10`.
- **Visibility**: Focused text (`z-50`) sits physically *in front* of the lens to prevent blurring. Unfocused text (`z-30`) gets ethereal blur filters.
- **Physics**: Softer spring config (`stiffness: 80`, `damping: 18`) for "floating" sensation.

### VisualOrbOptions
3D orbs with ethereal particle connections.

```tsx
<VisualOrbOptions
  options={[
    { id: 'content', label: 'Create content' },
    { id: 'research', label: 'Research' },
    { id: 'automate', label: 'Automate' },
    { id: 'learn', label: 'Learn AI' },
  ]}
  selectedId={selected}
  onSelect={(id) => setSelected(id)}
/>
```

**Features:**
- **Liquid Orbs**: Backdrop blur containers with gradient fills.
- **Living Connections**: Canvas-drawn lines that "breathe" (pulse opacity) with time.
- **Holographic Focus**: Focused element casts a radioactive/holographic radial glow.

---

## Transition & Overlay Components

### FlowTransition
Animate between different mode states (analyze, plan, wizard) with seamless morphing.

```tsx
import { FlowTransition } from '@/components/flow';

<FlowTransition mode={currentMode}>
  {mode === 'analyze' && <AnalyzeView />}
  {mode === 'plan' && <PlanView />}
  {mode === 'wizard' && <WizardView />}
</FlowTransition>
```

### FlowButlerOverlay
Persistent communication layer with contextual typewriter guidance.

```tsx
import { FlowButlerOverlay } from '@/components/flow';

<FlowButlerOverlay 
  stage="wizard" 
  message="Building your skill step by step."
>
  <WizardContent />
</FlowButlerOverlay>
```

**Stage Options**: `analyze` | `plan` | `wizard` | `complete`

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
Get personalized bundle recommendations based on user inputs.

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

## Styling Standards

### Liquid Glass Buttons
Buttons should appear as translucent glass shards with distinct borders.
**Class Pattern**:
```css
backdrop-blur-sm 
bg-primary/85 
border 
border-primary/50 
shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]
```

### Universal Translucency
All major UI containers (cards, options, buttons) MUST use `backdrop-filter` and `bg-opacity` < 1.0 to maintain the ethereal aesthetic.

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

// Glow follows step progression moving toward center
// Lerp factor: 0.02 (slower for smoother transitions)
```

**Tuning**: The glow lerp was reduced from `0.05` to `0.02` for smoother, less "jumpy" transitions between steps.

---

## Adaptive Step Filtering

The wizard supports experience-based step filtering. Beginners see fewer steps.

```tsx
// In wizard/page.tsx
const ALL_STEPS = [
  { id: 'what', title: 'What', minExperience: 0 },   // Always shown
  { id: 'when', title: 'When', minExperience: 50 },  // Skip for beginners
  { id: 'how', title: 'How', minExperience: 0 },     // Always shown
  { id: 'files', title: 'Files', minExperience: 75 }, // Advanced only
];

function getVisibleSteps(experience: number = 50) {
  return ALL_STEPS.filter(step => step.minExperience <= experience);
}
```

| Experience | Visible Steps |
|------------|---------------|
| 0-49 | What, How (2 steps) |
| 50-74 | What, When, How (3 steps) |
| 75+ | All 4 steps |

---

## Type Definitions

```tsx
type OptionPresentationType = 
  | 'visual-card'   // Standard grid (default)
  | 'visual-orb'    // 3D orbs
  | 'text-scroll'   // Arc scroll (Liquid Lens)
  | 'text-3space';  // 3D floating text (Planned)

interface Option {
  id: string;
  label: string;
  // emoji removed in v2
}
```

---

## AI Agent Context

**Directives for Code Generation:**

1.  **Component Selection**:
    - **Single Choice (2-6 items)**: Use `<TextScrollOptions />`.
    - **Categorical Choice (4 items)**: Use `<VisualOrbOptions />` (Best for quadrant-style choices).
    - **Range/Slider**: Do **NOT** use `<input type="range">`. Use mapped `<TextScrollOptions />` (e.g., Low/Med/High).

2.  **Slide Structure**:
    - Always wrap step content in `<FlowSlide>`.
    - Use `<TypewriterText />` for the main question heading.

3.  **Styling Enforcement**:
    - Never use solid background buttons. Apply the **Liquid Glass** classes to all primary actions.
    - Ensure all containers use `backdrop-blur`.

4.  **Z-Index Handling**:
    - `TextScrollOptions` handles its own Z-indexing. Do not manually override `z-index` on its parent unless creating a modal overlay.

