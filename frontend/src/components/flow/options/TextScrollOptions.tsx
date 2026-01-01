'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * TextScrollOptions - Liquid Glass Typeform-inspired selector
 * Dream-state floating text with ethereal blur and glow effects
 */

interface Option {
    id: string;
    label: string;
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
    const [isMobile, setIsMobile] = useState(false);

    // Responsive check
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const itemSpacing = isMobile ? 280 : 400;

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

    return (
        <div
            ref={containerRef}
            className={`relative h-96 flex items-center justify-center overflow-hidden ${className}`}
            style={{ perspective: '1500px' }}
        >
            {/* Liquid glass focus lens - minority report style */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none">
                <motion.div
                    className="w-[85vw] md:w-72 h-24 rounded-2xl"
                    style={{
                        background: 'linear-gradient(135deg, rgba(193,95,60,0.08) 0%, rgba(193,95,60,0.02) 50%, rgba(193,95,60,0.06) 100%)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(193,95,60,0.25)',
                        boxShadow: `
                            0 0 60px rgba(193,95,60,0.15),
                            inset 0 1px 0 rgba(255,255,255,0.1),
                            inset 0 -1px 0 rgba(0,0,0,0.1)
                        `,
                    }}
                    animate={{
                        boxShadow: [
                            '0 0 60px rgba(193,95,60,0.15), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.1)',
                            '0 0 80px rgba(193,95,60,0.2), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.1)',
                            '0 0 60px rgba(193,95,60,0.15), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.1)',
                        ],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </div>

            {/* Floating options - dream state */}
            <div
                className="relative flex items-center justify-center z-10"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {options.map((option, index) => {
                    const isFocused = index === focusIndex;
                    const distance = index - focusIndex;
                    const absDistance = Math.abs(distance);

                    return (
                        <motion.button
                            key={option.id}
                            onClick={() => {
                                setFocusIndex(index);
                                onSelect(option.id);
                            }}
                            className="absolute whitespace-nowrap cursor-pointer select-none"
                            animate={{
                                x: distance * itemSpacing,
                                z: -absDistance * 100,
                                rotateY: distance * 20,
                                scale: isFocused ? 1 : Math.max(0.7, 1 - absDistance * 0.15),
                                opacity: isFocused ? 1 : Math.max(0.3, 1 - absDistance * 0.35),
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 80,
                                damping: 18,
                                mass: 1,
                            }}
                            style={{
                                zIndex: isFocused ? 50 : 30 - absDistance,
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            <motion.span
                                className={`
                                    inline-block px-8 py-5 rounded-xl text-2xl font-medium
                                    transition-all duration-300
                                    ${isFocused
                                        ? 'text-primary-foreground'
                                        : 'text-muted-foreground/50'
                                    }
                                `}
                                style={{
                                    textShadow: isFocused
                                        ? '0 0 30px rgba(193,95,60,0.5), 0 0 60px rgba(193,95,60,0.3)'
                                        : 'none',
                                    filter: isFocused ? 'none' : `blur(${absDistance * 0.5}px)`,
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    textShadow: '0 0 40px rgba(193,95,60,0.6), 0 0 80px rgba(193,95,60,0.4)',
                                }}
                            >
                                {option.label}
                            </motion.span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Subtle navigation hint - whisper typography */}
            <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase font-light text-muted-foreground/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                ← → select
            </motion.div>
        </div>
    );
}

export default TextScrollOptions;
