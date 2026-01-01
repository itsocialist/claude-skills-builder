'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
}

/**
 * Shimmer loading skeleton with animation
 */
export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse bg-muted rounded-md',
                className
            )}
        />
    );
}

/**
 * Card loading skeleton
 */
export function SkeletonCard({ className }: SkeletonProps) {
    return (
        <div className={cn('p-4 border border-border rounded-lg space-y-3', className)}>
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-20 w-full" />
        </div>
    );
}

/**
 * List item loading skeleton
 */
export function SkeletonListItem({ className }: SkeletonProps) {
    return (
        <div className={cn('flex items-center gap-3 p-3', className)}>
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
}

/**
 * Text block loading skeleton
 */
export function SkeletonText({ lines = 3, className }: SkeletonProps & { lines?: number }) {
    return (
        <div className={cn('space-y-2', className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn('h-3', i === lines - 1 ? 'w-2/3' : 'w-full')}
                />
            ))}
        </div>
    );
}
