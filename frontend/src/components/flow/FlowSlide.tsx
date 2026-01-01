'use client';

import { useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlow } from './FlowProvider';
import { transitionPresets, TransitionPreset, DURATION, EASING } from './primitives/transitions';

/**
 * Flow Framework - Individual Slide Component
 * Wraps content with declarative transition animations
 */

interface FlowSlideProps {
    id: string;
    children: ReactNode;
    transition?: TransitionPreset;
    onEnter?: () => void;
    onExit?: () => void;
    className?: string;
}

export function FlowSlide({
    id,
    children,
    transition = 'slideUp',
    onEnter,
    onExit,
    className = '',
}: FlowSlideProps) {
    const { currentSlideId, registerSlide } = useFlow();

    // Register this slide on mount
    useEffect(() => {
        registerSlide({ id, transition, onEnter, onExit });
    }, [id, transition, onEnter, onExit, registerSlide]);

    const isActive = currentSlideId === id;
    const variants = transitionPresets[transition];

    return (
        <AnimatePresence mode="wait">
            {isActive && (
                <motion.div
                    key={id}
                    className={className}
                    variants={variants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{
                        duration: DURATION.normal,
                        ease: EASING.smooth,
                    }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/**
 * Flow Action Button - Triggers navigation
 */
interface FlowButtonProps {
    children: ReactNode;
    action?: 'next' | 'prev' | 'complete';
    onClick?: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
}

export function FlowButton({
    children,
    action = 'next',
    onClick,
    className = '',
    variant = 'primary',
}: FlowButtonProps) {
    const { next, prev, onComplete } = useFlow();

    const handleClick = () => {
        onClick?.();

        switch (action) {
            case 'next':
                next();
                break;
            case 'prev':
                prev();
                break;
            case 'complete':
                onComplete?.();
                break;
        }
    };

    const baseStyles = 'px-8 py-4 rounded-2xl text-lg font-medium transition-all';
    const variantStyles = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary: 'bg-muted text-muted-foreground hover:bg-muted/80',
        ghost: 'bg-transparent text-foreground hover:bg-muted/20',
    };

    return (
        <motion.button
            onClick={handleClick}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
        >
            {children}
        </motion.button>
    );
}

/**
 * Flow Question - Typewriter-style question display
 */
interface FlowQuestionProps {
    text: string;
    highlight?: string;
    className?: string;
}

export function FlowQuestion({ text, highlight, className = '' }: FlowQuestionProps) {
    // Dynamic import would be used here for TypewriterText
    // For now, render with highlight styling
    const renderText = () => {
        if (!highlight) return text;

        const parts = text.split(highlight);
        return (
            <>
                {parts[0]}
                <span className="text-primary">{highlight}</span>
                {parts[1]}
            </>
        );
    };

    return (
        <h1 className={`text-4xl md:text-5xl font-light text-foreground ${className}`}>
            {renderText()}
        </h1>
    );
}
