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
            className={`relative h-32 flex items-center justify-center overflow-hidden ${className}`}
            style={{ perspective: '1000px' }}
        >
            <div
                className="relative flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {options.map((option, index) => {
                    const isFocused = index === focusIndex;
                    const style = getItemStyle(index);

                    return (
                        <motion.button
                            key={option.id}
                            onClick={() => {
                                setFocusIndex(index);
                                onSelect(option.id);
                            }}
                            className={`absolute whitespace-nowrap px-7 py-3.5 rounded-md text-base font-medium transition-all backdrop-blur-sm border ${isFocused
                                    ? 'bg-primary/85 text-primary-foreground border-primary/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_4px_12px_rgba(193,95,60,0.25)]'
                                    : 'bg-card/30 text-muted-foreground/80 border-border/30 hover:bg-card/50 hover:border-border/50'
                                }`}
                            animate={{
                                x: (index - focusIndex) * 200,
                                z: -Math.abs(index - focusIndex) * 100,
                                scale: Math.max(0.75, 1 - Math.abs(index - focusIndex) * 0.1),
                                opacity: Math.max(0.2, 1 - Math.abs(index - focusIndex) * 0.35),
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 120,
                                damping: 20,
                                mass: 0.8,
                            }}
                            style={{
                                zIndex: style.zIndex,
                                filter: style.filter,
                            }}
                            whileHover={{ scale: isFocused ? 1.02 : 0.78 }}
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
