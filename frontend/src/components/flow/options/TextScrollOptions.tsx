'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TextScrollOptions - Horizontal arc scroll selector
 * Options scroll on arc along Z-axis, fade at ends, full strength at center
 */

interface Option {
    id: string;
    label: string;
    emoji?: string;
}

interface TextScrollOptionsProps {
    options: Option[];
    selectedId?: string;
    onSelect: (id: string) => void;
    className?: string;
}

export function TextScrollOptions({
    options,
    selectedId,
    onSelect,
    className = '',
}: TextScrollOptionsProps) {
    const [focusIndex, setFocusIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusIndex(prev => Math.min(prev + 1, options.length - 1));
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(options[focusIndex].id);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusIndex, options, onSelect]);

    // Calculate position and style for each option based on distance from focus
    const getItemStyle = (index: number) => {
        const distance = index - focusIndex;
        const absDistance = Math.abs(distance);

        // Arc position - items curve away on Z-axis
        const zOffset = -absDistance * 150; // Push back 150px per step
        const xOffset = distance * 200;     // Horizontal spread

        // Opacity fades at edges
        const opacity = Math.max(0, 1 - absDistance * 0.35);

        // Scale decreases with distance
        const scale = Math.max(0.6, 1 - absDistance * 0.15);

        // Blur increases at edges
        const blur = absDistance * 2;

        return {
            transform: `translateX(${xOffset}px) translateZ(${zOffset}px) scale(${scale})`,
            opacity,
            filter: `blur(${blur}px)`,
            zIndex: 10 - absDistance,
        };
    };

    return (
        <div
            ref={containerRef}
            className={`relative h-40 flex items-center justify-center ${className}`}
            style={{ perspective: '1200px' }}
        >
            {/* Gradient mask overlays for smooth fade */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />

            {/* Static glass highlight - stays fixed in center */}
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none px-10 py-5 rounded-md border border-primary/40 shadow-[0_0_30px_rgba(193,95,60,0.2)]"
                style={{ minWidth: '160px', minHeight: '56px', zIndex: 5 }}
            />

            <div
                className="relative flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {options.map((option, index) => {
                    const isFocused = index === focusIndex;
                    const distance = index - focusIndex;
                    const absDistance = Math.abs(distance);

                    // Rotate cards around the arc (negative distance = rotate left, positive = rotate right)
                    const rotateY = distance * 25; // degrees of rotation

                    return (
                        <motion.button
                            key={option.id}
                            onClick={() => {
                                setFocusIndex(index);
                                onSelect(option.id);
                            }}
                            className={`absolute whitespace-nowrap px-4 py-2 text-base font-medium transition-colors ${isFocused
                                    ? 'text-primary-foreground'
                                    : 'text-muted-foreground/60'
                                }`}
                            animate={{
                                x: distance * 180,
                                z: -absDistance * 80,
                                rotateY: rotateY,
                                scale: Math.max(0.8, 1 - absDistance * 0.08),
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 120,
                                damping: 20,
                                mass: 0.8,
                            }}
                            style={{
                                zIndex: 10 - absDistance,
                                transformStyle: 'preserve-3d',
                            }}
                            whileHover={{ scale: isFocused ? 1.02 : 0.82 }}
                        >
                            {option.emoji && <span className="mr-2">{option.emoji}</span>}
                            {option.label}
                        </motion.button>
                    );
                })}
            </div>

            {/* Visual arc separator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

            {/* Navigation hint - below separator, light typography */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] tracking-wide font-light text-muted-foreground/60">
                ← → navigate · enter select
            </div>
        </div>
    );
}

export default TextScrollOptions;

