'use client';

import { useEffect, useState } from 'react';
import { Lightbulb, Sparkles } from 'lucide-react';

// Two-line skill ideas
const SKILL_IDEAS = [
    { type: 'idea', line1: 'Email Newsletter', line2: 'Writer' },
    { type: 'idea', line1: 'Meeting Notes', line2: 'Summarizer' },
    { type: 'idea', line1: 'Code Review', line2: 'Assistant' },
    { type: 'idea', line1: 'Customer Support', line2: 'Responder' },
    { type: 'idea', line1: 'Product Description', line2: 'Generator' },
    { type: 'idea', line1: 'Social Media', line2: 'Post Creator' },
    { type: 'idea', line1: 'Contract', line2: 'Analyzer' },
    { type: 'idea', line1: 'Interview Question', line2: 'Generator' },
    { type: 'idea', line1: 'Bug Report', line2: 'Formatter' },
    { type: 'idea', line1: 'Sales Pitch', line2: 'Optimizer' },
    { type: 'idea', line1: 'Blog Post', line2: 'Outliner' },
    { type: 'idea', line1: 'API Documentation', line2: 'Writer' },
    { type: 'idea', line1: 'Legal Brief', line2: 'Summarizer' },
    { type: 'idea', line1: 'Job Description', line2: 'Creator' },
    { type: 'idea', line1: 'Project Proposal', line2: 'Drafter' },
    { type: 'idea', line1: 'FAQ Builder', line2: 'Assistant' },
];

const TIPS = [
    { type: 'tip', line1: 'Add 3+ triggers', line2: 'for better activation' },
    { type: 'tip', line1: 'Include examples', line2: 'in your instructions' },
    { type: 'tip', line1: 'Define output format', line2: 'for consistency' },
    { type: 'tip', line1: 'Attach reference files', line2: 'for context' },
    { type: 'tip', line1: 'Use snippets', line2: 'to speed up creation' },
];

interface Bubble {
    id: number;
    content: { type: string; line1: string; line2: string };
    side: 'left' | 'right';
    top: number;
    left: number;
    delay: number;
}

export function FloatingIdeas() {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);

    useEffect(() => {
        const allContent = [...SKILL_IDEAS, ...TIPS];

        // Create 8 bubbles spread around the darker areas (avoiding center card)
        const positions = [
            // Top area
            { side: 'left' as const, top: 2, left: 15 },
            { side: 'right' as const, top: 5, left: 75 },
            // Left side
            { side: 'left' as const, top: 25, left: 3 },
            { side: 'left' as const, top: 55, left: 8 },
            // Right side
            { side: 'right' as const, top: 30, left: 85 },
            { side: 'right' as const, top: 60, left: 82 },
            // Bottom area
            { side: 'left' as const, top: 85, left: 20 },
            { side: 'right' as const, top: 88, left: 70 },
        ];

        const initialBubbles: Bubble[] = positions.map((pos, i) => ({
            id: i,
            side: pos.side,
            top: pos.top,
            left: pos.left,
            delay: i * 0.6,
            content: allContent[Math.floor(Math.random() * allContent.length)],
        }));

        setBubbles(initialBubbles);

        // Rotate content every 5 seconds
        const interval = setInterval(() => {
            setBubbles(prev => prev.map(b => ({
                ...b,
                content: allContent[Math.floor(Math.random() * allContent.length)],
            })));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {bubbles.map((bubble) => (
                <div
                    key={bubble.id}
                    className="absolute animate-float opacity-0"
                    style={{
                        left: `${bubble.left}%`,
                        top: `${bubble.top}%`,
                        animationDelay: `${bubble.delay}s`,
                    }}
                >
                    {/* Simple speech bubble */}
                    <div className={`
                        relative px-3 py-2 max-w-[140px]
                        rounded-xl border-2
                        ${bubble.content.type === 'idea'
                            ? 'bg-primary/5 border-primary/20'
                            : 'bg-muted/50 border-border'
                        }
                    `}>
                        {/* Tail */}
                        <div
                            className={`
                                absolute top-3 w-2 h-2 rotate-45 border-2
                                ${bubble.content.type === 'idea'
                                    ? 'bg-primary/5 border-primary/20'
                                    : 'bg-muted/50 border-border'
                                }
                                ${bubble.side === 'left'
                                    ? '-right-1 border-l-0 border-b-0'
                                    : '-left-1 border-r-0 border-t-0'
                                }
                            `}
                        />
                        <div className="flex items-start gap-1.5">
                            {bubble.content.type === 'idea' ? (
                                <Lightbulb className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                            ) : (
                                <Sparkles className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                            )}
                            <div className="text-xs leading-tight">
                                <div className={bubble.content.type === 'idea' ? 'text-primary font-medium' : 'text-foreground'}>
                                    {bubble.content.line1}
                                </div>
                                <div className="text-muted-foreground">
                                    {bubble.content.line2}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
