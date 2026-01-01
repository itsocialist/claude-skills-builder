'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Sparkles, ChevronRight, CircleDashed } from 'lucide-react';

interface FlowProgressOverviewProps {
    steps: {
        id: string;
        label: string;
        isCompleted: boolean;
        isActive: boolean;
    }[];
    currentStepIndex: number;
}

export function FlowProgressOverview({ steps, currentStepIndex }: FlowProgressOverviewProps) {
    return (
        <motion.div
            className="fixed top-24 right-8 z-30 hidden xl:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
            <div className="relative backdrop-blur-xl bg-background/20 border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] w-72">
                {/* Glossy overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                <div className="relative mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                        Lesson Plan
                    </h3>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                        <Sparkles className="w-4 h-4 text-primary/60" />
                    </motion.div>
                </div>

                <div className="space-y-3">
                    {steps.map((step, index) => {
                        // Calculate relative position for "3D" text effect
                        const isPast = index < currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <motion.div
                                key={step.id}
                                className={cn(
                                    "flex items-center gap-3 text-sm transition-all duration-500",
                                    isCurrent ? "ml-2" : "ml-0"
                                )}
                                animate={{
                                    opacity: isCurrent ? 1 : isPast ? 0.5 : 0.3,
                                    scale: isCurrent ? 1.05 : 1,
                                    x: isCurrent ? 8 : 0,
                                }}
                            >
                                <div className={cn(
                                    "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-colors duration-500",
                                    isPast ? "bg-primary border-primary text-primary-foreground" :
                                        isCurrent ? "border-primary text-primary bg-primary/10 shadow-[0_0_10px_rgba(193,95,60,0.3)]" :
                                            "border-muted-foreground/30 text-muted-foreground/30"
                                )}>
                                    {isPast ? <Check className="w-3.5 h-3.5" /> :
                                        isCurrent ? <div className="w-2 h-2 rounded-full bg-current animate-pulse" /> :
                                            <CircleDashed className="w-3.5 h-3.5" />}
                                </div>
                                <span className={cn(
                                    "font-medium tracking-tight",
                                    isCurrent ? "text-foreground" :
                                        isPast ? "text-muted-foreground line-through decoration-primary/30" :
                                            "text-muted-foreground/50"
                                )}>
                                    {step.label}
                                </span>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Progress bar line */}
                <div className="absolute left-8 top-12 bottom-6 w-px bg-muted-foreground/10 -z-10" />
            </div>
        </motion.div>
    );
}
