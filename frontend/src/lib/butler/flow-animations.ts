import { Variants } from 'framer-motion';

// Breathing animation - subtle scale pulse for focused elements
export const breathe: Variants = {
    initial: { scale: 1 },
    animate: {
        scale: [1, 1.02, 1],
        transition: {
            duration: 4,
            ease: 'easeInOut',
            repeat: Infinity,
        },
    },
};

// Slide up entrance for flow steps
export const slideUp: Variants = {
    initial: {
        y: 80,
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad
        },
    },
    exit: {
        y: -60,
        opacity: 0,
        transition: {
            duration: 0.4,
            ease: [0.55, 0.06, 0.68, 0.19], // easeInQuad
        },
    },
};

// Fade reveal for staggered children
export const fadeReveal: Variants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

export const fadeRevealChild: Variants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    },
};

// Pulse glow for interactive elements
export const pulseGlow: Variants = {
    initial: {
        boxShadow: '0 0 0 0 rgba(193, 95, 60, 0)',
    },
    animate: {
        boxShadow: [
            '0 0 0 0 rgba(193, 95, 60, 0.4)',
            '0 0 20px 10px rgba(193, 95, 60, 0)',
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1,
        },
    },
};

// Option selection animation
export const optionSelect: Variants = {
    initial: {
        scale: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    hover: {
        scale: 1.02,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        transition: { duration: 0.2 },
    },
    tap: {
        scale: 0.98,
    },
    selected: {
        scale: 1,
        backgroundColor: 'rgba(193, 95, 60, 0.2)',
        borderColor: 'rgba(193, 95, 60, 1)',
    },
};

// Continue hint animation
export const continueHint: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: {
        opacity: [0.3, 0.7, 0.3],
        y: [0, 5, 0],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    },
};

// Progress bar animation
export const progressBar: Variants = {
    initial: { scaleX: 0 },
    animate: {
        scaleX: 1,
        transition: {
            duration: 0.6,
            ease: 'easeOut',
        },
    },
};

// Cinematic reveal for final recommendations
export const cinematicReveal: Variants = {
    initial: {
        opacity: 0,
        scale: 0.9,
        filter: 'blur(10px)',
    },
    animate: {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};
