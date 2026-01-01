'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getGlowPosition, PARALLAX_OFFSET_PER_STEP } from './primitives/transitions';

/**
 * Flow Framework - Animated Background
 * Organic particles with mouse interaction + animated glow that moves with steps
 */

interface FlowBackgroundProps {
    stepIndex?: number;
    particleCount?: number;
    connectionDistance?: number;
    particleSpeed?: number;
    colorHue?: number;
    opacity?: number;
    className?: string;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    originalX: number;
    originalY: number;
}

export function FlowBackground({
    stepIndex = 0,
    particleCount = 60,
    connectionDistance = 120,
    particleSpeed = 0.3,
    colorHue = 17, // Warm terracotta
    opacity = 0.2,
    className,
}: FlowBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const panOffsetRef = useRef(0);
    const targetPanRef = useRef(0);
    const glowPosRef = useRef({ x: 85, y: 85 });
    const targetGlowRef = useRef({ x: 85, y: 85 });

    // Update targets when step changes
    useEffect(() => {
        targetPanRef.current = stepIndex * PARALLAX_OFFSET_PER_STEP;
        const newGlow = getGlowPosition(stepIndex);
        targetGlowRef.current = { x: newGlow.x, y: newGlow.y };
    }, [stepIndex]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        handleResize();

        // Initialize particles
        const initParticles = () => {
            particlesRef.current = [];
            for (let i = 0; i < particleCount; i++) {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                particlesRef.current.push({
                    x,
                    y,
                    vx: (Math.random() - 0.5) * particleSpeed,
                    vy: (Math.random() - 0.5) * particleSpeed,
                    radius: Math.random() * 2 + 1,
                    originalX: x,
                    originalY: y,
                });
            }
        };

        initParticles();

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: -1000, y: -1000 };
        };

        const animate = () => {
            const { width, height } = canvas;
            ctx.clearRect(0, 0, width, height);

            // Lerp parallax pan
            panOffsetRef.current += (targetPanRef.current - panOffsetRef.current) * 0.08;
            const currentPan = panOffsetRef.current;

            // Lerp glow position - slower for smoother transitions
            glowPosRef.current.x += (targetGlowRef.current.x - glowPosRef.current.x) * 0.02;
            glowPosRef.current.y += (targetGlowRef.current.y - glowPosRef.current.y) * 0.02;

            const mouse = mouseRef.current;

            // Update and draw particles
            particlesRef.current.forEach((particle) => {
                // Mouse attraction
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150 && dist > 0) {
                    const force = (150 - dist) / 150;
                    particle.vx += (dx / dist) * force * 0.02;
                    particle.vy += (dy / dist) * force * 0.02;
                }

                // Apply velocity with damping
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vx *= 0.99;
                particle.vy *= 0.99;

                // Return to original position gently
                particle.vx += (particle.originalX - particle.x) * 0.001;
                particle.vy += (particle.originalY - particle.y) * 0.001;

                // Wrap around edges relative to camera (infinite scroll)
                if (particle.x < 0) particle.x = width;
                if (particle.x > width) particle.x = 0;

                if (particle.y < currentPan) particle.y += height;
                if (particle.y > currentPan + height) particle.y -= height;

                // Draw with parallax offset
                const drawY = particle.y - currentPan;
                if (drawY > -50 && drawY < height + 50) {
                    ctx.beginPath();
                    ctx.arc(particle.x, drawY, particle.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${colorHue}, 70%, 50%, ${opacity})`;
                    ctx.shadowColor = `hsla(${colorHue}, 80%, 60%, 0.5)`;
                    ctx.shadowBlur = 8;
                    ctx.fill();
                }
            });

            // Draw connections
            ctx.shadowBlur = 0;
            for (let i = 0; i < particlesRef.current.length; i++) {
                for (let j = i + 1; j < particlesRef.current.length; j++) {
                    const p1 = particlesRef.current[i];
                    const p2 = particlesRef.current[j];
                    const drawY1 = p1.y - currentPan;
                    const drawY2 = p2.y - currentPan;

                    const dx = p1.x - p2.x;
                    const dy = drawY1 - drawY2;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        if ((drawY1 > -50 && drawY1 < height + 50) || (drawY2 > -50 && drawY2 < height + 50)) {
                            const lineOpacity = (1 - dist / connectionDistance) * opacity * 0.5;
                            ctx.beginPath();
                            ctx.moveTo(p1.x, drawY1);
                            ctx.lineTo(p2.x, drawY2);
                            ctx.strokeStyle = `hsla(${colorHue}, 60%, 45%, ${lineOpacity})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        animationRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [particleCount, connectionDistance, particleSpeed, colorHue, opacity]);

    return (
        <>
            <canvas
                ref={canvasRef}
                className={cn('absolute inset-0 w-full h-full', className)}
            />
            {/* Animated glow - CSS animation for smooth continuous sine wave */}
            <div
                className="absolute inset-0 pointer-events-none animate-[glow-pulse_8s_ease-in-out_infinite]"
                style={{
                    background: `radial-gradient(ellipse 80% 60% at ${glowPosRef.current.x}% ${glowPosRef.current.y}%, rgba(193, 95, 60, 0.35) 0%, rgba(193, 95, 60, 0.15) 40%, transparent 70%)`,
                }}
            />
            <style jsx>{`
                @keyframes glow-pulse {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.06); }
                }
            `}</style>
        </>
    );
}
