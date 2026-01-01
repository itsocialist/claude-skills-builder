'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterTextProps {
    text: string;
    highlightWord?: string;
    highlightClassName?: string;
    className?: string;
    speed?: number; // ms per character - default 46 (15% slower than original 40)
    onComplete?: () => void;
}

export function TypewriterText({
    text,
    highlightWord,
    highlightClassName = 'text-primary',
    className = '',
    speed = 51, // 25% slower than original 40ms
    onComplete,
}: TypewriterTextProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setDisplayedText('');
        setIsComplete(false);
        let i = 0;

        const interval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(interval);
                setIsComplete(true);
                onComplete?.();
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed, onComplete]);

    // Render with highlight word if specified
    const renderText = () => {
        if (!highlightWord || !displayedText.includes(highlightWord)) {
            return displayedText;
        }

        const parts = displayedText.split(highlightWord);
        const highlightVisible = displayedText.includes(highlightWord);

        return (
            <>
                {parts[0]}
                {highlightVisible && (
                    <span className={highlightClassName}>{highlightWord}</span>
                )}
                {parts[1] || ''}
            </>
        );
    };

    return (
        <motion.span
            className={`whitespace-pre-wrap ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {renderText()}
            {!isComplete && (
                <motion.span
                    className="inline-block w-0.5 h-[1em] bg-primary ml-1 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                />
            )}
        </motion.span>
    );
}

export default TypewriterText;
