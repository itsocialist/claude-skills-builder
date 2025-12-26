import * as React from 'react';
import { cn } from '@/lib/utils';
import { badge } from '@/lib/theme';

interface CategoryBadgeProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * CategoryBadge - Consistent badge styling for template categories
 * Use this component for all category indicators across the application
 */
export function CategoryBadge({ children, className }: CategoryBadgeProps) {
    return (
        <span className={cn(badge.category, className)}>
            {children}
        </span>
    );
}
