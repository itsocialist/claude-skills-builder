'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { TypewriterFooter } from './TypewriterFooter';

interface GlassTerminalProps {
    children: ReactNode;
    className?: string;
    title?: string;
    helpText?: string;
}

export function GlassTerminal({ children, className = '', title, helpText }: GlassTerminalProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`
                relative w-full max-w-5xl mx-auto my-12
                rounded-2xl overflow-hidden
                backdrop-blur-2xl bg-black/20
                border border-white/10
                shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]
                flex flex-col
                ${className}
            `}
        >
            {/* Terminal Header */}
            <div className="h-14 border-b border-white/5 flex items-center px-6 justify-between bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                    </div>
                </div>

                {title && (
                    <div className="absolute left-1/2 -translate-x-1/2 text-sm font-medium tracking-widest text-white/40 uppercase">
                        {title}
                    </div>
                )}

                <div className="text-xs text-white/20 font-mono">
                    FLOATING_PLANE_V1
                </div>
            </div>

            {/* Content Area */}
            <div className="relative p-8 md:p-12 min-h-[600px] flex flex-col">
                {/* Internal Reflection Highlight */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                {children}
            </div>

            {/* Contextual Help Footer - Moved Outside */}
            <AnimatePresence mode="wait">
                {helpText && (
                    <div className="absolute -bottom-24 left-0 right-0 flex justify-center">
                        <TypewriterFooter text={helpText} />
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
