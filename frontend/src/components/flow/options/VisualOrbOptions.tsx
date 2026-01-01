'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * VisualOrbOptions - Liquid Glass 3D orb selector
 * Ethereal floating orbs with canvas particle connections
 * Minority Report / dream-state inspired aesthetics
 */

interface Option {
    id: string;
    label: string;
}

interface VisualOrbOptionsProps {
    options: Option[];
    selectedId?: string;
    onSelect: (id: string) => void;
    className?: string;
}

// Orb positions in normalized space (-1 to 1)
const ORB_POSITIONS = [
    { x: -0.55, y: -0.35 },  // Top-left
    { x: 0.55, y: -0.35 },   // Top-right
    { x: -0.55, y: 0.45 },   // Bottom-left
    { x: 0.55, y: 0.45 },    // Bottom-right
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
    const timeRef = useRef(0);

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

    // Draw ethereal particle connections on canvas
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
            timeRef.current += 0.01;

            const centerX = width / 2;
            const centerY = height / 2;
            const scale = Math.min(width, height) * 0.38;

            // Update Z positions with smooth interpolation
            orbPositionsRef.current.forEach((pos, i) => {
                const targetZ = i === focusIndex ? 1 : -0.3;
                pos.z += (targetZ - pos.z) * 0.08;
            });

            // Draw ethereal connections between orbs
            for (let i = 0; i < orbPositionsRef.current.length; i++) {
                for (let j = i + 1; j < orbPositionsRef.current.length; j++) {
                    const p1 = orbPositionsRef.current[i];
                    const p2 = orbPositionsRef.current[j];

                    const x1 = centerX + p1.x * scale;
                    const y1 = centerY + p1.y * scale;
                    const x2 = centerX + p2.x * scale;
                    const y2 = centerY + p2.y * scale;

                    // Pulsing opacity based on focus and time
                    const baseFocus = (i === focusIndex || j === focusIndex) ? 0.25 : 0.08;
                    const pulse = Math.sin(timeRef.current * 2 + i + j) * 0.05;
                    const opacity = baseFocus + pulse;

                    // Create gradient line for liquid effect
                    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
                    gradient.addColorStop(0, `rgba(193, 95, 60, ${opacity})`);
                    gradient.addColorStop(0.5, `rgba(193, 95, 60, ${opacity * 1.5})`);
                    gradient.addColorStop(1, `rgba(193, 95, 60, ${opacity})`);

                    ctx.beginPath();
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = (i === focusIndex || j === focusIndex) ? 1.5 : 0.8;
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
            }

            // Draw subtle glow particles along connections
            orbPositionsRef.current.forEach((pos, i) => {
                if (i === focusIndex) {
                    const x = centerX + pos.x * scale;
                    const y = centerY + pos.y * scale;

                    // Ambient glow around focused orb
                    const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 60);
                    glowGradient.addColorStop(0, 'rgba(193, 95, 60, 0.15)');
                    glowGradient.addColorStop(0.5, 'rgba(193, 95, 60, 0.05)');
                    glowGradient.addColorStop(1, 'rgba(193, 95, 60, 0)');

                    ctx.fillStyle = glowGradient;
                    ctx.fillRect(x - 60, y - 60, 120, 120);
                }
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', resize);
        };
    }, [focusIndex]);

    return (
        <div
            ref={containerRef}
            className={`relative h-[450px] w-full ${className}`}
            style={{ perspective: '1000px' }}
        >
            {/* Ethereal connection lines canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Liquid glass orbs */}
            <div
                className="absolute inset-0"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {options.slice(0, 4).map((option, index) => {
                    const isFocused = index === focusIndex;
                    const pos = ORB_POSITIONS[index] || { x: 0, y: 0 };

                    return (
                        <motion.button
                            key={option.id}
                            onClick={() => {
                                setFocusIndex(index);
                                onSelect(option.id);
                            }}
                            className="absolute flex flex-col items-center justify-center cursor-pointer"
                            animate={{
                                scale: isFocused ? 1 : 0.85,
                                z: isFocused ? 80 : -20,
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 80,
                                damping: 18,
                                mass: 1,
                            }}
                            style={{
                                left: `${50 + pos.x * 38}%`,
                                top: `${50 + pos.y * 38}%`,
                                transform: 'translate(-50%, -50%)',
                                zIndex: isFocused ? 10 : 5,
                            }}
                            whileHover={{ scale: isFocused ? 1.05 : 0.9 }}
                        >
                            {/* Liquid glass orb container */}
                            <motion.div
                                className="w-28 h-28 rounded-2xl flex flex-col items-center justify-center"
                                animate={{
                                    opacity: isFocused ? 1 : 0.5,
                                }}
                                style={{
                                    background: isFocused
                                        ? 'linear-gradient(135deg, rgba(193,95,60,0.2) 0%, rgba(193,95,60,0.08) 50%, rgba(193,95,60,0.15) 100%)'
                                        : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 50%, rgba(255,255,255,0.03) 100%)',
                                    backdropFilter: 'blur(12px)',
                                    border: isFocused
                                        ? '1px solid rgba(193,95,60,0.4)'
                                        : '1px solid rgba(255,255,255,0.08)',
                                    boxShadow: isFocused
                                        ? `
                                            0 0 40px rgba(193,95,60,0.2),
                                            0 0 80px rgba(193,95,60,0.1),
                                            inset 0 1px 0 rgba(255,255,255,0.15),
                                            inset 0 -1px 0 rgba(0,0,0,0.1)
                                        `
                                        : `
                                            0 4px 20px rgba(0,0,0,0.1),
                                            inset 0 1px 0 rgba(255,255,255,0.05)
                                        `,
                                }}
                            >
                                <motion.span
                                    className={`text-xs font-medium text-center px-2 transition-colors ${isFocused ? 'text-primary-foreground' : 'text-muted-foreground/60'
                                        }`}
                                    style={{
                                        textShadow: isFocused ? '0 0 20px rgba(193,95,60,0.4)' : 'none',
                                    }}
                                >
                                    {option.label}
                                </motion.span>
                            </motion.div>
                        </motion.button>
                    );
                })}
            </div>

            {/* Whisper navigation hint */}
            <motion.div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase font-light text-muted-foreground/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                arrows select
            </motion.div>
        </div>
    );
}

export default VisualOrbOptions;
