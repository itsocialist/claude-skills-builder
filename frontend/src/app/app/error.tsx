'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, LayoutDashboard } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log to observability service
        console.error('Dashboard Error:', error);
    }, [error]);

    return (
        <div className="h-full flex items-center justify-center p-8 bg-background/50 backdrop-blur-sm">
            <Card className="max-w-md w-full p-8 text-center border-border shadow-lg">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-500" />
                </div>

                <h2 className="text-xl font-bold text-foreground mb-2">
                    Application Error
                </h2>

                <p className="text-sm text-muted-foreground mb-6">
                    {error.message || 'The application encountered a problem. Please try again.'}
                </p>

                <div className="flex flex-col gap-3">
                    <Button onClick={() => reset()} className="w-full gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Reload Component
                    </Button>

                    <Button
                        variant="ghost"
                        onClick={() => window.location.href = '/app'}
                        className="w-full gap-2"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Return to Dashboard
                    </Button>
                </div>
            </Card>
        </div>
    );
}
