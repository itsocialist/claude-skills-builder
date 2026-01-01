'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FileText, Sparkles, ArrowRight } from 'lucide-react';


interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    triggers?: string[];
    tags?: string[];
}

interface TemplateCardProps {
    template: Template;
    /** Compact variant for landing page showcase */
    variant?: 'default' | 'compact';
    className?: string;
    /** Optional click handler - if provided, opens sheet instead of navigating */
    onClick?: () => void;
}

/**
 * TemplateCard - Clean, minimal template card
 * Simplified to reduce AI-vibe patterns: no color bars, no trigger counts, single CTA
 */
export function TemplateCard({ template, variant = 'default', className, onClick }: TemplateCardProps) {
    const isCompact = variant === 'compact';
    const hasPreview = !!template.preview_image_url;

    // Use a simpler design for compact version, but still premium
    if (isCompact) {
        return (
            <Card
                className={cn(
                    'group flex flex-col transition-all duration-300',
                    'hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5',
                    'p-5 border-border cursor-pointer',
                    className
                )}
                onClick={onClick}
            >
                <div className="mb-2">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {template.category}
                    </span>
                </div>
                <h3 className="font-semibold text-base text-foreground mb-2">
                    {template.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                </p>
            </Card>
        );
    }

    return (
        <Card
            className={cn(
                'group relative flex flex-col transition-all duration-500',
                'hover:border-primary/50 border-border bg-card overflow-hidden',
                'cursor-pointer h-full',
                // Taller hover lift for that premium float
                'hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5',
                className
            )}
            onClick={onClick}
        >
            {/* Preview Section - Modern Floating Paper Effect */}
            <div className="relative w-full h-48 bg-muted/30 overflow-hidden border-b border-border/50 group-hover:bg-muted/50 transition-colors duration-500">
                {hasPreview ? (
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                        {/* Floating Paper Shadow & Container */}
                        <div
                            className="relative w-full h-full transform transition-all duration-700 ease-out group-hover:scale-105 group-hover:-rotate-2 origin-bottom-left"
                            style={{
                                boxShadow: '-12px 12px 30px rgba(0, 0, 0, 0.15), -4px 4px 10px rgba(0, 0, 0, 0.05)',
                            }}
                        >
                            <Image
                                src={template.preview_image_url!}
                                alt={`Preview of ${template.name}`}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover object-top rounded-sm ring-1 ring-black/5"
                            />

                            {/* Subtle shine effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-sm pointer-events-none" />
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30">
                        <FileText className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-xs font-medium uppercase tracking-widest opacity-60">No Preview</span>
                    </div>
                )}

                {/* Categories Badge - Floating over content */}
                <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-background/90 backdrop-blur-sm shadow-sm border border-black/5 text-foreground">
                        {template.category}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow relative z-10 bg-card">
                <div className="mb-auto">
                    <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                        {template.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
                        {template.description}
                    </p>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-2">
                        {template.tags && template.tags.length > 0 && (
                            <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-primary/70" />
                                {template.tags[0]}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300 text-primary font-medium">
                        Use Template <ArrowRight className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </Card>
    );
}
