'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-500" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                Something went wrong
            </h1>

            <p className="text-muted-foreground max-w-[500px] mb-8">
                We encountered an unexpected error. Our team has been notified.
                Please try reloading the page.
            </p>

            <div className="flex gap-4">
                <Button onClick={() => reset()} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </Button>

                <Link href="/">
                    <Button variant="outline" className="gap-2">
                        <Home className="w-4 h-4" />
                        Go Home
                    </Button>
                </Link>
            </div>

            {error.digest && (
                <p className="mt-8 text-xs text-muted-foreground font-mono">
                    Error ID: {error.digest}
                </p>
            )}
        </div>
    );
}
