'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterFooterProps {
    text: string;
    className?: string;
}

export function TypewriterFooter({ text, className = '' }: TypewriterFooterProps) {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        if (!text) return;

        setDisplayedText('');
        let currentIndex = 0;

        const intervalId = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(prev => prev + text[currentIndex]);
                currentIndex++;
            } else {
                clearInterval(intervalId);
            }
        }, 20); // Slightly faster

        return () => clearInterval(intervalId);
    }, [text]);

    if (!text) return null;

    return (
        <div className={`py-6 text-center ${className}`}>
            <div className="inline-flex items-center justify-center gap-2">
                <span className="text-lg md:text-xl font-light text-white/50 tracking-wide">
                    {displayedText}
                    <span className="animate-pulse ml-0.5 text-primary">_</span>
                </span>
            </div>
        </div>
    );
}
