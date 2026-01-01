'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * VisualOrbOptions - 3D orb selector with particle connections
 * 4 options as labeled orbs connected like particles
 * Focused option moves forward on Z-axis, others animate to back
 */

interface Option {
    id: string;
    label: string;
    emoji?: string;
}

interface VisualOrbOptionsProps {
    options: Option[];
    selectedId?: string;
    onSelect: (id: string) => void;
    className?: string;
}

// Orb positions in normalized space (-1 to 1)
const ORB_POSITIONS = [
    { x: -0.6, y: -0.4 },  // Top-left
    { x: 0.6, y: -0.4 },   // Top-right
    { x: -0.6, y: 0.5 },   // Bottom-left
    { x: 0.6, y: 0.5 },    // Bottom-right
];

export function VisualOrbOptions({
    options,
    selectedId,
    onSelect,
    className = '',
}: VisualOrbOptionsProps) {
    const [focusIndex, setFocusIndex] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const orbPositionsRef = useRef<{ x: number; y: number; z: number }[]>([]);
    const animationRef = useRef<number>(0);

    // Initialize orb positions
    useEffect(() => {
        orbPositionsRef.current = options.slice(0, 4).map((_, i) => ({
            x: ORB_POSITIONS[i]?.x || 0,
            y: ORB_POSITIONS[i]?.y || 0,
            z: 0,
        }));
    }, [options]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const maxIndex = Math.min(options.length - 1, 3);
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setFocusIndex(prev => prev === 0 ? maxIndex : prev - 1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setFocusIndex(prev => prev === maxIndex ? 0 : prev + 1);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusIndex(prev => prev <= 1 ? prev + 2 : prev - 2);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusIndex(prev => prev >= 2 ? prev - 2 : prev + 2);
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(options[focusIndex].id);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusIndex, options, onSelect]);

    // Draw particle connections on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        };
        resize();

        const animate = () => {
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;
            const scale = Math.min(width, height) * 0.35;

            // Update Z positions based on focus
            orbPositionsRef.current.forEach((pos, i) => {
                const targetZ = i === focusIndex ? 1 : -0.5;
                pos.z += (targetZ - pos.z) * 0.1;
            });

            // Draw connections between orbs
            ctx.strokeStyle = 'rgba(193, 95, 60, 0.15)';
            ctx.lineWidth = 1;

            for (let i = 0; i < orbPositionsRef.current.length; i++) {
                for (let j = i + 1; j < orbPositionsRef.current.length; j++) {
                    const p1 = orbPositionsRef.current[i];
                    const p2 = orbPositionsRef.current[j];

                    const x1 = centerX + p1.x * scale;
                    const y1 = centerY + p1.y * scale;
                    const x2 = centerX + p2.x * scale;
                    const y2 = centerY + p2.y * scale;

                    // Fade based on Z distance
                    const avgZ = (p1.z + p2.z) / 2;
                    const opacity = 0.1 + avgZ * 0.1;

                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(193, 95, 60, ${opacity})`;
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', resize);
        };
    }, [focusIndex]);

    // Calculate orb visual properties
    const getOrbStyle = (index: number) => {
        const pos = ORB_POSITIONS[index] || { x: 0, y: 0 };
        const isFocused = index === focusIndex;

        // Z-depth affects scale and brightness
        const zScale = isFocused ? 1.15 : 0.85;
        const zOffset = isFocused ? 50 : -30;

        return {
            left: `${50 + pos.x * 35}%`,
            top: `${50 + pos.y * 35}%`,
            transform: `translate(-50%, -50%) translateZ(${zOffset}px) scale(${zScale})`,
            zIndex: isFocused ? 10 : 5,
        };
    };

    return (
        <div
            ref={containerRef}
            className={`relative h-80 w-full ${className}`}
            style={{ perspective: '800px' }}
        >
            {/* Connection lines canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Orbs */}
            <div
                className="absolute inset-0"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {options.slice(0, 4).map((option, index) => {
                    const isFocused = index === focusIndex;
                    const style = getOrbStyle(index);

                    return (
                        <motion.button
                            key={option.id}
                            onClick={() => {
                                setFocusIndex(index);
                                onSelect(option.id);
                            }}
                            className={`absolute flex flex-col items-center justify-center w-24 h-24 rounded-lg transition-all backdrop-blur-sm border ${isFocused
                                    ? 'bg-primary/85 text-primary-foreground border-primary/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_4px_12px_rgba(193,95,60,0.25)]'
                                    : 'bg-card/40 text-muted-foreground border-border/40 hover:bg-card/60 hover:border-border/70'
                                }`}
                            animate={{
                                scale: isFocused ? 1.1 : 0.88,
                                opacity: isFocused ? 1 : 0.65,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 25,
                            }}
                            style={{
                                left: style.left,
                                top: style.top,
                                transform: 'translate(-50%, -50%)',
                                zIndex: style.zIndex,
                            }}
                            whileHover={{ scale: isFocused ? 1.12 : 0.92 }}
                        >
                            {option.emoji && (
                                <span className="text-xl mb-1 opacity-85">{option.emoji}</span>
                            )}
                            <span className="text-xs font-medium text-center px-2">
                                {option.label}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Navigation hint */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                Arrow keys to navigate • Enter to select
            </div>
        </div>
    );
}

export default VisualOrbOptions;
