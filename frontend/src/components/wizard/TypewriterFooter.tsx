'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterFooterProps {
    text: string;
    className?: string;
}

export function TypewriterFooter({ text, className = '' }: TypewriterFooterProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        setDisplayedText('');
        setIsTyping(true);
        let currentIndex = 0;

        const intervalId = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(prev => prev + text[currentIndex]);
                currentIndex++;
            } else {
                setIsTyping(false);
                clearInterval(intervalId);
            }
        }, 30); // Typing speed

        return () => clearInterval(intervalId);
    }, [text]);

    return (
        <div className={`h-12 flex items-center px-6 border-t border-white/10 bg-black/20 backdrop-blur-md ${className}`}>
            <div className="flex items-center gap-3 w-full">
                <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-primary animate-pulse' : 'bg-white/20'}`} />
                <div className="font-mono text-xs md:text-sm text-white/70 tracking-wide">
                    {displayedText}
                    <span className="animate-pulse ml-0.5 opacity-50">_</span>
                </div>
            </div>
        </div>
    );
}
