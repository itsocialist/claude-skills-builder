'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CategoryBadge } from '@/components/ui/category-badge';
import { cn } from '@/lib/utils';
import { spacing, card } from '@/lib/theme';

interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
}

interface TemplateCardProps {
    template: Template;
    /** Compact variant for landing page showcase */
    variant?: 'default' | 'compact';
    className?: string;
}

/**
 * TemplateCard - Consistent template card styling
 * Use this component on both landing page and templates page for consistency
 */
export function TemplateCard({ template, variant = 'default', className }: TemplateCardProps) {
    const isCompact = variant === 'compact';

    return (
        <Card
            className={cn(
                spacing.card,
                card.template,
                className
            )}
        >
            <div className={isCompact ? 'mb-1' : 'mb-2'}>
                <CategoryBadge className="mb-1">{template.category}</CategoryBadge>
                <h3 className={cn(
                    'font-bold text-foreground',
                    isCompact ? 'text-lg' : 'text-xl'
                )}>
                    {template.name}
                </h3>
            </div>

            <p className={cn(
                'text-muted-foreground',
                isCompact ? 'text-xs mb-3 line-clamp-2' : 'text-sm mb-4 flex-grow'
            )}>
                {template.description}
            </p>

            {isCompact ? (
                <Link href={`/app/templates/${template.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                        Use Template
                    </Button>
                </Link>
            ) : (
                <div className="pt-3 border-t border-border mt-auto">
                    <Link href={`/app/templates/${template.id}`} className="block w-full">
                        <Button variant="outline" className="w-full">
                            View Details
                        </Button>
                    </Link>
                    <Link href={`/app/builder?template=${template.id}`} className="block w-full mt-2">
                        <Button className="w-full">
                            Use Template
                        </Button>
                    </Link>
                </div>
            )}
        </Card>
    );
}
