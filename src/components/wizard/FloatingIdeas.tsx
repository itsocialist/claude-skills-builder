'use client';

import { useEffect, useState } from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';

// Pre-defined skill ideas and tips that rotate
const SKILL_IDEAS = [
    { type: 'idea', text: 'Email newsletter writer' },
    { type: 'idea', text: 'Meeting notes summarizer' },
    { type: 'idea', text: 'Code review assistant' },
    { type: 'idea', text: 'Customer support responder' },
    { type: 'idea', text: 'Product description generator' },
    { type: 'idea', text: 'Social media post creator' },
    { type: 'idea', text: 'Contract analyzer' },
    { type: 'idea', text: 'Interview question generator' },
    { type: 'idea', text: 'Bug report formatter' },
    { type: 'idea', text: 'Sales pitch optimizer' },
];

const TIPS = [
    { type: 'tip', text: 'Add 3+ trigger phrases for better activation' },
    { type: 'tip', text: 'Include examples in your instructions' },
    { type: 'tip', text: 'Define the output format clearly' },
    { type: 'tip', text: 'Attach reference files for context' },
    { type: 'tip', text: 'Use snippets to speed up creation' },
];

interface Bubble {
    id: number;
    content: { type: string; text: string };
    x: number;
    y: number;
    delay: number;
    duration: number;
}

export function FloatingIdeas() {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);

    useEffect(() => {
        // Create initial bubbles
        const allContent = [...SKILL_IDEAS, ...TIPS];
        const initialBubbles = Array.from({ length: 5 }, (_, i) => ({
            id: i,
            content: allContent[Math.floor(Math.random() * allContent.length)],
            x: 10 + Math.random() * 80, // 10-90% from left
            y: 10 + Math.random() * 80, // 10-90% from top
            delay: i * 2, // Stagger animations
            duration: 15 + Math.random() * 10, // 15-25s cycle
        }));
        setBubbles(initialBubbles);

        // Rotate content periodically
        const interval = setInterval(() => {
            setBubbles(prev => prev.map(b => ({
                ...b,
                content: allContent[Math.floor(Math.random() * allContent.length)],
            })));
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {bubbles.map((bubble) => (
                <div
                    key={bubble.id}
                    className="absolute animate-float opacity-0"
                    style={{
                        left: `${bubble.x}%`,
                        top: `${bubble.y}%`,
                        animationDelay: `${bubble.delay}s`,
                        animationDuration: `${bubble.duration}s`,
                    }}
                >
                    <div className={`
                        flex items-center gap-2 px-4 py-2 rounded-full 
                        ${bubble.content.type === 'idea'
                            ? 'bg-primary/10 border border-primary/20'
                            : 'bg-accent/50 border border-border'
                        }
                        text-sm text-muted-foreground whitespace-nowrap
                        backdrop-blur-sm shadow-sm
                        transition-all duration-500
                    `}>
                        {bubble.content.type === 'idea' ? (
                            <Lightbulb className="w-4 h-4 text-primary" />
                        ) : (
                            <Sparkles className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span>{bubble.content.text}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
