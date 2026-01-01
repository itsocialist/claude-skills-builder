'use client';

import { motion, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef, ButtonHTMLAttributes } from 'react';

/**
 * Flow Framework - FlowButton
 * Standardized button component with glass variants
 * 
 * Variants:
 * - primary: Solid terracotta for enabled/active states
 * - glass: Translucent frosted glass for default/idle states
 * - ghost: Minimal styling for secondary actions
 */

export interface FlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'glass' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isAnimated?: boolean;
    className?: string;
    children: React.ReactNode;
}

const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
};

const variantClasses = {
    primary: 'bg-primary/85 text-primary-foreground border-primary/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_4px_12px_rgba(193,95,60,0.25)]',
    glass: 'bg-white/10 text-white/70 border-white/20 hover:bg-white/15 hover:text-white hover:border-white/30',
    ghost: 'bg-transparent text-white/50 border-transparent hover:text-white hover:bg-white/5',
};

const disabledClasses = 'bg-white/10 text-white/40 border-white/10 cursor-not-allowed';

export const FlowButton = forwardRef<HTMLButtonElement, FlowButtonProps & MotionProps>(({
    variant = 'glass',
    size = 'lg',
    isAnimated = true,
    className,
    disabled,
    children,
    ...props
}, ref) => {
    const baseClasses = 'rounded-full font-medium backdrop-blur-sm border transition-all duration-200';

    const classes = cn(
        baseClasses,
        sizeClasses[size],
        disabled ? disabledClasses : variantClasses[variant],
        className
    );

    if (isAnimated) {
        return (
            <motion.button
                ref={ref as any}
                className={classes}
                disabled={disabled}
                whileHover={disabled ? undefined : { scale: 1.05 }}
                whileTap={disabled ? undefined : { scale: 0.95 }}
                {...(props as MotionProps)}
            >
                {children}
            </motion.button>
        );
    }

    return (
        <button
            ref={ref}
            className={classes}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
});

FlowButton.displayName = 'FlowButton';

export default FlowButton;
