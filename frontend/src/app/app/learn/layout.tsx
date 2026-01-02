'use client';

import { Shell } from '@/components/layout/Shell';

export default function LearnLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Shell>
            {children}
        </Shell>
    );
}
