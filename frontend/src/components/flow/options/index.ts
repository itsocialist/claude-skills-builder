'use client';

/**
 * Flow Framework - Option Presentation Types
 */

export { TextScrollOptions } from './TextScrollOptions';
export { VisualOrbOptions } from './VisualOrbOptions';

// Option type enum for declarative configuration
export type OptionPresentationType =
    | 'visual-card'     // Standard card grid (default)
    | 'visual-orb'      // 3D orbs with particle connections
    | 'text-scroll'     // Horizontal arc scroll
    | 'text-3space';    // Floating text in 3D (future)
