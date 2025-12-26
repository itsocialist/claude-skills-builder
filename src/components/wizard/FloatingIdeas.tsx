'use client';

import { useEffect, useState } from 'react';
import { Lightbulb, Sparkles, MessageCircle } from 'lucide-react';

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
    { type: 'idea', line1: 'Changelog', line2: 'Generator' },
    { type: 'idea', line1: 'Investor Update', line2: 'Writer' },
    { type: 'idea', line1: 'FAQ Builder', line2: 'Assistant' },
];

const TIPS = [
    { type: 'tip', line1: 'Add 3+ triggers', line2: 'for better activation' },
    { type: 'tip', line1: 'Include examples', line2: 'in your instructions' },
    { type: 'tip', line1: 'Define output format', line2: 'for consistency' },
    { type: 'tip', line1: 'Attach reference files', line2: 'for context' },
    { type: 'tip', line1: 'Use snippets', line2: 'to speed up creation' },
    { type: 'tip', line1: 'Be specific about', line2: 'the tone and style' },
];

// Bubble shape variants
type BubbleShape = 'round' | 'cloud' | 'rect' | 'oval';

interface Bubble {
    id: number;
    content: { type: string; line1: string; line2: string };
    x: number;
    y: number;
    delay: number;
    duration: number;
    shape: BubbleShape;
    tailPosition: 'left' | 'right' | 'bottom';
}

const SHAPES: BubbleShape[] = ['round', 'cloud', 'rect', 'oval'];

export function FloatingIdeas() {
    const [bubbles, setBubbles] = useState<Bubble[]>([]);

    useEffect(() => {
        const allContent = [...SKILL_IDEAS, ...TIPS];

        // Create 8 bubbles spread around the edges
        const positions = [
            { x: 5, y: 15 },   // top-left
            { x: 75, y: 10 },  // top-right
            { x: 3, y: 45 },   // mid-left
            { x: 80, y: 40 },  // mid-right
            { x: 8, y: 75 },   // bottom-left
            { x: 78, y: 70 },  // bottom-right
            { x: 15, y: 88 },  // bottom
            { x: 70, y: 85 },  // bottom
        ];

        const initialBubbles: Bubble[] = positions.map((pos, i) => ({
            id: i,
            content: allContent[Math.floor(Math.random() * allContent.length)],
            x: pos.x,
            y: pos.y,
            delay: i * 0.8, // Faster staggering
            duration: 8 + Math.random() * 4, // 8-12s cycle (faster)
            shape: SHAPES[i % SHAPES.length],
            tailPosition: pos.x < 40 ? 'left' : 'right',
        }));

        setBubbles(initialBubbles);

        // Rotate content every 4 seconds (faster)
        const interval = setInterval(() => {
            setBubbles(prev => prev.map(b => ({
                ...b,
                content: allContent[Math.floor(Math.random() * allContent.length)],
            })));
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const getShapeStyles = (shape: BubbleShape) => {
        switch (shape) {
            case 'cloud':
                return 'rounded-[50%_50%_50%_50%/60%_60%_40%_40%]';
            case 'rect':
                return 'rounded-lg';
            case 'oval':
                return 'rounded-[50%]';
            default:
                return 'rounded-2xl';
        }
    };

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
                    {/* Speech bubble with tail */}
                    <div className="relative">
                        <div className={`
                            relative px-4 py-3 min-w-[120px]
                            ${getShapeStyles(bubble.shape)}
                            ${bubble.content.type === 'idea'
                                ? 'bg-primary/10 border-2 border-primary/30'
                                : 'bg-accent border-2 border-border'
                            }
                            backdrop-blur-sm shadow-lg
                        `}>
                            <div className="flex items-start gap-2">
                                {bubble.content.type === 'idea' ? (
                                    <Lightbulb className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                ) : (
                                    <Sparkles className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                )}
                                <div className="text-sm">
                                    <div className={`font-medium ${bubble.content.type === 'idea' ? 'text-primary' : 'text-foreground'}`}>
                                        {bubble.content.line1}
                                    </div>
                                    <div className="text-muted-foreground text-xs">
                                        {bubble.content.line2}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tail */}
                        <div
                            className={`
                                absolute w-0 h-0 
                                border-[8px] border-transparent
                                ${bubble.tailPosition === 'left'
                                    ? 'left-3 -bottom-4 border-t-primary/30'
                                    : bubble.tailPosition === 'right'
                                        ? 'right-3 -bottom-4 border-t-primary/30'
                                        : 'left-1/2 -translate-x-1/2 -bottom-4 border-t-primary/30'
                                }
                            `}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
