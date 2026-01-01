'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

    const cardContent = (
        <Card
            className={cn(
                'group flex flex-col transition-all duration-200',
                'hover:border-primary/30',
                isCompact ? 'p-4' : 'p-5',
                onClick && 'cursor-pointer',
                className
            )}
            onClick={onClick}
        >
            {/* Header */}
            <div className={isCompact ? 'mb-2' : 'mb-3'}>
                <span className="text-xs text-muted-foreground mb-1.5 block">
                    {template.category}
                </span>
                <h3 className={cn(
                    'font-semibold text-foreground',
                    isCompact ? 'text-base' : 'text-lg'
                )}>
                    {template.name}
                </h3>
            </div>

            {/* Description */}
            <p className={cn(
                'text-muted-foreground leading-relaxed flex-grow',
                isCompact ? 'text-xs mb-4 line-clamp-2' : 'text-sm mb-5 line-clamp-3'
            )}>
                {template.description}
            </p>

            {/* Single Action */}
            {onClick ? (
                <Button
                    variant={isCompact ? 'outline' : 'default'}
                    size={isCompact ? 'sm' : 'default'}
                    className="max-w-[70%] w-full mx-auto"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                    }}
                >
                    View Template
                </Button>
            ) : (
                <Link href={`/app/templates/${template.id}`} className="block">
                    <Button
                        variant={isCompact ? 'outline' : 'default'}
                        size={isCompact ? 'sm' : 'default'}
                        className="max-w-[70%] w-full mx-auto"
                    >
                        View Template
                    </Button>
                </Link>
            )}
        </Card>
    );

    return cardContent;
}
