'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    baseVx: number;
    baseVy: number;
    radius: number;
    opacity: number;
    hue: number;
}

interface OrganicBackgroundProps {
    className?: string;
    particleCount?: number;
    connectionDistance?: number;
    particleSpeed?: number;
    colorHue?: number;
    opacity?: number;
    /** Vertical pan offset for parallax effect (positive = moved down in world space) */
    panOffset?: number;
}

export function OrganicBackground({
    className,
    particleCount = 50,
    connectionDistance = 150,
    particleSpeed = 0.8,
    colorHue = 17,
    opacity = 0.25,
    panOffset = 0,
}: OrganicBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0, active: false });
    const panOffsetRef = useRef(0);
    const targetPanRef = useRef(0);

    // Smoothly animate pan offset
    useEffect(() => {
        targetPanRef.current = panOffset;
    }, [panOffset]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Initialize particles
        const initParticles = (width: number, height: number) => {
            const particles: Particle[] = [];
            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = particleSpeed * (0.5 + Math.random() * 0.5);
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    baseVx: Math.cos(angle) * speed * 0.3,
                    baseVy: Math.sin(angle) * speed * 0.3,
                    radius: Math.random() * 2.5 + 1.5,
                    opacity: Math.random() * 0.4 + 0.4,
                    hue: colorHue + (Math.random() - 0.5) * 30,
                });
            }
            return particles;
        };

        // Resize handler
        const handleResize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            particlesRef.current = initParticles(canvas.width, canvas.height);
        };

        // Mouse handlers
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                active: true,
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current.active = false;
        };

        // Animation loop
        const animate = () => {
            const { width, height } = canvas;
            const particles = particlesRef.current;

            // Smoothly lerp pan offset for fluid motion
            panOffsetRef.current += (targetPanRef.current - panOffsetRef.current) * 0.08;
            const currentPan = panOffsetRef.current;

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                const particle = particles[i];

                // Apply base velocity (constant drift)
                particle.vx += particle.baseVx * 0.01;
                particle.vy += particle.baseVy * 0.01;

                // Add slight random movement for organic feel
                particle.vx += (Math.random() - 0.5) * 0.05;
                particle.vy += (Math.random() - 0.5) * 0.05;

                // Mouse attraction
                if (mouseRef.current.active) {
                    const dx = mouseRef.current.x - particle.x;
                    const dy = mouseRef.current.y - particle.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 200 && dist > 0) {
                        const force = (200 - dist) / 200;
                        particle.vx += (dx / dist) * force * 0.15;
                        particle.vy += (dy / dist) * force * 0.15;
                    }
                }

                // Apply velocity
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Damping
                particle.vx *= 0.98;
                particle.vy *= 0.98;

                // Speed limit
                const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                if (speed > 3) {
                    particle.vx = (particle.vx / speed) * 3;
                    particle.vy = (particle.vy / speed) * 3;
                }

                // Minimum speed to keep moving
                if (speed < 0.2) {
                    const angle = Math.random() * Math.PI * 2;
                    particle.vx += Math.cos(angle) * 0.1;
                    particle.vy += Math.sin(angle) * 0.1;
                }

                // Wrap around edges
                if (particle.x < -10) particle.x = width + 10;
                if (particle.x > width + 10) particle.x = -10;
                if (particle.y < -10) particle.y = height + 10;
                if (particle.y > height + 10) particle.y = -10;

                // Draw particle with glow (apply pan offset for parallax)
                const drawY = particle.y - currentPan;

                // Only draw if visible (with margin for connections)
                if (drawY > -50 && drawY < height + 50) {
                    ctx.beginPath();
                    ctx.arc(particle.x, drawY, particle.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity * opacity})`;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = `hsla(${particle.hue}, 70%, 50%, ${particle.opacity * opacity * 0.5})`;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }

                // Draw connections (with parallax)
                for (let j = i + 1; j < particles.length; j++) {
                    const other = particles[j];
                    const otherDrawY = other.y - currentPan;
                    const dx = particle.x - other.x;
                    const dy = drawY - otherDrawY;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        // Only draw if at least one endpoint is visible
                        if ((drawY > -50 && drawY < height + 50) || (otherDrawY > -50 && otherDrawY < height + 50)) {
                            const lineOpacity = (1 - dist / connectionDistance) * opacity * 0.4;
                            ctx.beginPath();
                            ctx.moveTo(particle.x, drawY);
                            ctx.lineTo(other.x, otherDrawY);
                            ctx.strokeStyle = `hsla(${colorHue}, 60%, 55%, ${lineOpacity})`;
                            ctx.lineWidth = 0.8;
                            ctx.stroke();
                        }
                    }
                }
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        // Setup
        handleResize();
        window.addEventListener('resize', handleResize);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        animationRef.current = requestAnimationFrame(animate);

        // Cleanup
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
                className={cn(
                    'absolute inset-0 w-full h-full',
                    className
                )}
            />
            {/* Warm light glow in lower left corner */}
            <div
                className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, hsla(25, 80%, 50%, 0.15) 0%, hsla(17, 70%, 45%, 0.08) 30%, transparent 70%)',
                    transform: 'translate(-30%, 30%)',
                }}
            />
        </>
    );
}

export default OrganicBackground;
