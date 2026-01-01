'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface MotionCardProps extends HTMLMotionProps<'div'> {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

/**
 * A Card wrapper with entrance animation
 */
export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
    ({ children, className, delay = 0, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.3,
                    delay,
                    ease: [0.4, 0, 0.2, 1]
                }}
                className={cn(
                    'rounded-lg border border-border bg-card text-card-foreground shadow-sm',
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

MotionCard.displayName = 'MotionCard';

/**
 * A staggered list container that animates children sequentially
 */
export const MotionList = forwardRef<HTMLDivElement, HTMLMotionProps<'div'> & {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
}>(
    ({ children, className, staggerDelay = 0.05, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: staggerDelay,
                        },
                    },
                }}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

MotionList.displayName = 'MotionList';

/**
 * A list item that works with MotionList
 */
export const MotionListItem = forwardRef<HTMLDivElement, HTMLMotionProps<'div'> & {
    children: React.ReactNode;
    className?: string;
}>(
    ({ children, className, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

MotionListItem.displayName = 'MotionListItem';

/**
 * A fade-in wrapper for page sections
 */
export const FadeIn = forwardRef<HTMLDivElement, HTMLMotionProps<'div'> & {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}>(
    ({ children, className, delay = 0, ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay, ease: 'easeOut' }}
                className={className}
                {...props}
            >
                {children}
            </motion.div>
        );
    }
);

FadeIn.displayName = 'FadeIn';
