'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Flow Framework - Transition Component
 * Animates between different mode states (analyze, plan, wizard)
 * with seamless morph effects
 */

interface FlowTransitionProps {
    mode: string;
    children: ReactNode;
    className?: string;
}

const transitionVariants = {
    initial: {
        opacity: 0,
        scale: 0.96,
        y: 20,
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1], // Custom easing for smooth feel
        },
    },
    exit: {
        opacity: 0,
        scale: 0.98,
        y: -10,
        transition: {
            duration: 0.3,
            ease: 'easeInOut',
        },
    },
};

export function FlowTransition({ mode, children, className = '' }: FlowTransitionProps) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={mode}
                variants={transitionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

export default FlowTransition;
