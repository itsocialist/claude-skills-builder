'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypewriterText } from '@/components/ui/typewriter-text';

/**
 * Flow Framework - Butler Overlay
 * Persistent communication layer that provides contextual guidance
 * throughout all Flow stages (analyze, plan, wizard)
 */

interface FlowButlerOverlayProps {
    stage: 'analyze' | 'plan' | 'wizard' | 'complete';
    message?: string;
    children: ReactNode;
    className?: string;
}

// Stage-specific default messages
const STAGE_MESSAGES: Record<string, string> = {
    analyze: 'Analyzing your preferences...',
    plan: 'Your path is ready. Select a module to begin.',
    wizard: 'Building your skill step by step.',
    complete: 'Your skill is ready for action.',
};

export function FlowButlerOverlay({
    stage,
    message,
    children,
    className = '',
}: FlowButlerOverlayProps) {
    const [displayMessage, setDisplayMessage] = useState('');

    useEffect(() => {
        setDisplayMessage(message || STAGE_MESSAGES[stage] || '');
    }, [stage, message]);

    return (
        <div className={`relative ${className}`}>
            {/* Main Content */}
            {children}

            {/* Butler Footer - Persistent Typewriter */}
            <AnimatePresence mode="wait">
                {displayMessage && (
                    <motion.div
                        key={stage}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none z-50"
                    >
                        <div className="px-6 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-lg">
                            <TypewriterText
                                text={displayMessage}
                                className="text-white/60 text-sm font-light tracking-wide"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ambient Breathing Effect */}
            <motion.div
                className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                    background: 'linear-gradient(to top, rgba(193, 95, 60, 0.05) 0%, transparent 100%)',
                }}
            />
        </div>
    );
}

export default FlowButlerOverlay;
