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
                            className={`absolute whitespace-nowrap px-5 py-2.5 rounded-md text-sm font-medium transition-all backdrop-blur-sm border ${isFocused
                                    ? 'bg-primary/90 text-primary-foreground border-primary/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2)]'
                                    : 'bg-card/40 text-muted-foreground border-border/50 hover:bg-card/60 hover:border-border'
                                }`}
                            animate={{
                                x: (index - focusIndex) * 180,
                                z: -Math.abs(index - focusIndex) * 120,
                                scale: Math.max(0.7, 1 - Math.abs(index - focusIndex) * 0.12),
                                opacity: Math.max(0.15, 1 - Math.abs(index - focusIndex) * 0.4),
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 30,
                            }}
                            style={{
                                zIndex: style.zIndex,
                                filter: style.filter,
                            }}
                            whileHover={{ scale: isFocused ? 1.03 : 0.75 }}
                        >
                            {option.emoji && <span className="mr-2 opacity-80">{option.emoji}</span>}
                            {option.label}
                        </motion.button>
                    );
                })}
            </div>

            {/* Visual arc indicator */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {/* Navigation hints */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                ← → to navigate • Enter to select
            </div>
        </div>
    );
}

export default TextScrollOptions;
