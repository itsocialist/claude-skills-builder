'use client';

/**
 * Flow Framework - Module Exports
 * Declarative, cinematic presentation system for guided experiences
 */

// Core Provider & Context
export { FlowProvider, useFlow, useFlowProgress } from './FlowProvider';
export type { FlowContextType, FlowSlideConfig, FlowProviderProps } from './FlowProvider';

// Slide Components
export { FlowSlide, FlowButton, FlowQuestion } from './FlowSlide';

// Background & Atmosphere
export { FlowBackground } from './FlowBackground';

// Transitions
export { FlowTransition } from './FlowTransition';

// Butler Overlay
export { FlowButlerOverlay } from './FlowButlerOverlay';

// AI Recommendations
export { useAIRecommendations } from './primitives/useAIRecommendations';

// Option Presentation Types
export { TextScrollOptions, VisualOrbOptions } from './options';
export type { OptionPresentationType } from './options';

// Animation Primitives
export {
    // Transition presets
    slideUp,
    slideDown,
    fadeIn,
    scaleIn,
    popIn,
    staggerContainer,
    staggerItem,
    breathe,

    // Glow & parallax
    GLOW_POSITIONS,
    getGlowPosition,
    PARALLAX_OFFSET_PER_STEP,

    // Config
    DURATION,
    EASING,
    transitionPresets,
    getSlideTransition,
} from './primitives/transitions';

export type { TransitionPreset } from './primitives/transitions';
