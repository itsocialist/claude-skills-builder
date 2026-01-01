'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { FlowButler } from '@/components/butler/FlowButler';
import { Shell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function FlowButlerPage() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);

    const handleComplete = (preferences: any) => {
        console.log('Flow completed with preferences:', preferences);
        // Navigate to wizard with preferences
        const params = new URLSearchParams({
            role: preferences.role || '',
            goal: preferences.goal || '',
            experience: String(preferences.experience || 50),
        });
        router.push(`/app/wizard?${params.toString()}`);
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <FlowButler
                        onClose={() => setIsOpen(false)}
                        onComplete={handleComplete}
                    />
                )}
            </AnimatePresence>

            {!isOpen && (
                <Shell title="Skills Butler">
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                        <Sparkles className="h-16 w-16 text-primary mb-6" />
                        <h1 className="text-3xl font-bold mb-4">Flow Complete!</h1>
                        <p className="text-muted-foreground mb-8">
                            Your personalized recommendations have been saved.
                        </p>
                        <Button onClick={() => setIsOpen(true)}>
                            Start Again
                        </Button>
                    </div>
                </Shell>
            )}
        </>
    );
}
