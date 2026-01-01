'use client';

import { Variants } from 'framer-motion';

/**
 * Flow Framework - Declarative Transition Presets
 * Inspired by Reveal.js for cinematic, organic presentations
 */

// Standard durations
export const DURATION = {
    fast: 0.3,
    normal: 0.55,
    slow: 0.8,
    stagger: 0.17,
} as const;

// Easing curves
export const EASING = {
    smooth: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
    spring: [0.34, 1.56, 0.64, 1],    // overshoot
    gentle: [0.4, 0, 0.2, 1],         // easeInOutCubic
} as const;

/**
 * Slide transition variants
 */
export const slideUp: Variants = {
    initial: { y: 40, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
};

export const slideDown: Variants = {
    initial: { y: -40, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
};

export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

export const scaleIn: Variants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
};

export const popIn: Variants = {
    initial: { scale: 0.5, opacity: 0, y: -20 },
    animate: { scale: 1, opacity: 1, y: 0 },
    exit: { scale: 0.8, opacity: 0 },
};

/**
 * Content reveal variants (for staggered children)
 */
export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: DURATION.stagger,
            delayChildren: 0.1,
        },
    },
};

export const staggerItem: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
};

/**
 * Breathing animation for icons/elements
 */
export const breathe: Variants = {
    initial: { scale: 1 },
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 4,
            ease: 'easeInOut',
            repeat: Infinity,
        },
    },
};

/**
 * Glow position keyframes for step transitions
 * Maps step index to glow anchor position (percentage)
 */
export const GLOW_POSITIONS = [
    { x: 85, y: 85 },  // 0: welcome - bottom-right
    { x: 90, y: 60 },  // 1: role - mid-right
    { x: 85, y: 35 },  // 2: goal - upper-right
    { x: 50, y: 20 },  // 3: experience - top-center
    { x: 50, y: 50 },  // 4: reveal - center (radial burst)
    { x: 30, y: 30 },  // 5: guided tour - upper-left (spotlight)
] as const;

/**
 * Get interpolated glow position for smooth transitions
 */
export function getGlowPosition(stepIndex: number): { x: number; y: number } {
    const safeIndex = Math.min(stepIndex, GLOW_POSITIONS.length - 1);
    return GLOW_POSITIONS[safeIndex];
}

/**
 * Parallax offset per step (pixels)
 */
export const PARALLAX_OFFSET_PER_STEP = 100;

/**
 * Transition preset lookup
 */
export const transitionPresets = {
    slideUp,
    slideDown,
    fadeIn,
    scaleIn,
    popIn,
} as const;

export type TransitionPreset = keyof typeof transitionPresets;

/**
 * Get transition configuration for a slide
 */
export function getSlideTransition(preset: TransitionPreset = 'slideUp') {
    return {
        variants: transitionPresets[preset],
        transition: {
            duration: DURATION.normal,
            ease: EASING.smooth,
        },
    };
}
