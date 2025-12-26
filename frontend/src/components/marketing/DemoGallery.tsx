'use client';

import { useState } from 'react';
import Image from 'next/image';

interface DemoStep {
    src: string;
    alt: string;
    step: number;
    title: string;
    description: string;
}

interface DemoGalleryProps {
    steps: DemoStep[];
}

export function DemoGallery({ steps }: DemoGalleryProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Split steps into rows for better distribution (2x2 grid logic if needed, or just CSS grid)

    return (
        <div className="relative">
            {/* Dimmed/blurred background when hovering */}
            <div
                className={`fixed inset-0 bg-black/80 backdrop-blur-md z-40 transition-opacity duration-300 pointer-events-none ${hoveredIndex !== null ? 'opacity-100' : 'opacity-0'
                    }`}
            />

            {/* Grid Layout - 1 col mobile, 2 cols tablet/desktop for larger images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl relative mx-auto">
                {steps.map((step, index) => (
                    <div
                        key={step.step}
                        className={`space-y-4 transition-all duration-500 ${hoveredIndex !== null && hoveredIndex !== index ? 'opacity-30 blur-[2px] scale-95' : 'opacity-100'
                            }`}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {/* Browser Mockup Frame */}
                        <div
                            className={`relative rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ease-out cursor-pointer bg-card ${hoveredIndex === index
                                ? 'scale-[1.1] z-50 border-primary/50 translate-y-[-10px]'
                                : 'border-border/50 hover:border-primary/30 z-10'
                                } border`}
                        >
                            {/* Browser Header Bar */}
                            <div className="bg-[#1e1e1e] px-4 py-3 flex items-center gap-4 border-b border-white/5">
                                {/* Traffic Lights */}
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                                </div>
                                {/* Fake URL Bar */}
                                <div className="flex-1 bg-black/20 h-6 rounded-md flex items-center px-3">
                                    <div className="w-2 h-2 rounded-full border border-white/20 mr-2" />
                                    <div className="h-1.5 w-24 bg-white/10 rounded-full" />
                                </div>
                            </div>

                            {/* Image Container with inner scroll shadow */}
                            <div className="relative aspect-[4/3] w-full bg-[#1a1a1a] group">
                                {/* Step Badge - Floating */}
                                <div className="absolute top-4 right-4 z-20 bg-primary/90 text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-white/10">
                                    Step {step.step}
                                </div>

                                <Image
                                    src={step.src}
                                    alt={step.alt}
                                    fill
                                    className="object-cover object-top p-0 group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                />
                            </div>
                        </div>

                        {/* Labels */}
                        <div className="text-center px-4">
                            <h3 className="text-lg font-bold text-foreground mb-1">{step.title}</h3>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
