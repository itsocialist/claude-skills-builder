'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Zap, ArrowRight } from 'lucide-react';

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
}

// Category color mapping for visual distinction
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    'Real Estate': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    'Business': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    'Finance': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    'Product': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    'Marketing': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
    'Sales': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
};

const getColorScheme = (category: string) => {
    return categoryColors[category] || { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-border' };
};

/**
 * TemplateCard - Enhanced template card with category colors and hover effects
 */
export function TemplateCard({ template, variant = 'default', className }: TemplateCardProps) {
    const isCompact = variant === 'compact';
    const colors = getColorScheme(template.category);
    const triggerCount = template.triggers?.length || 0;

    return (
        <Card
            className={cn(
                'group relative overflow-hidden transition-all duration-300',
                'hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1',
                'border-l-4',
                colors.border,
                isCompact ? 'p-4' : 'p-6',
                className
            )}
        >
            {/* Category accent line */}
            <div className={cn('absolute left-0 top-0 bottom-0 w-1', colors.bg.replace('/10', '/40'))} />

            {/* Header */}
            <div className={isCompact ? 'mb-2' : 'mb-3'}>
                <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                        'text-xs font-medium px-2 py-0.5 rounded-full',
                        colors.bg,
                        colors.text
                    )}>
                        {template.category}
                    </span>
                    {triggerCount > 0 && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Zap className="w-3 h-3" />
                            {triggerCount} trigger{triggerCount !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>
                <h3 className={cn(
                    'font-semibold text-foreground group-hover:text-primary transition-colors',
                    isCompact ? 'text-base' : 'text-lg'
                )}>
                    {template.name}
                </h3>
            </div>

            {/* Description */}
            <p className={cn(
                'text-muted-foreground leading-relaxed',
                isCompact ? 'text-xs mb-3 line-clamp-2' : 'text-sm mb-4 line-clamp-3'
            )}>
                {template.description}
            </p>

            {/* Tags (default variant only) */}
            {!isCompact && template.tags && template.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {template.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {tag}
                        </span>
                    ))}
                    {template.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{template.tags.length - 3}</span>
                    )}
                </div>
            )}

            {/* Actions */}
            {isCompact ? (
                <Link href={`/app/templates/${template.id}`}>
                    <Button variant="outline" size="sm" className="w-full group-hover:border-primary/50">
                        Use Template
                        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                </Link>
            ) : (
                <div className="flex gap-2 pt-3 border-t border-border">
                    <Link href={`/app/templates/${template.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                            View Details
                        </Button>
                    </Link>
                    <Link href={`/app/builder?template=${template.id}`} className="flex-1">
                        <Button className="w-full">
                            Use Template
                        </Button>
                    </Link>
                </div>
            )}
        </Card>
    );
}

