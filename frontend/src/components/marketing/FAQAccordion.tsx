'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
    question: string;
    answer: string;
}

const faqItems: FAQItem[] = [
    {
        question: "What is a Claude Skill?",
        answer: "A Claude Skill is a pre-written set of instructions that teaches Claude how to help you with specific tasks. Think of it as a \"brain upgrade\" that turns Claude from a general assistant into a specialized expert for your needs."
    },
    {
        question: "Do I need an account?",
        answer: "No account needed! You can build and download skills completely free without signing up. Only create an account if you want to save your skills in a library for later."
    },
    {
        question: "Is it really free?",
        answer: "Yes, 100% free. We don't store your data, and you own everything you create. Download your skill as a .zip file and use it forever."
    },
    {
        question: "How do I use my skill in Claude?",
        answer: "Just upload the downloaded .zip file to Claude.ai Projects, or extract it and add the SKILL.md file to your conversation. Claude will immediately start using your custom instructions."
    },
    {
        question: "Do I need coding experience?",
        answer: "Not at all! The builder is designed for non-technical users. Just fill in text fields describing what you want, and we generate the proper skill format automatically."
    },
    {
        question: "Will this work with my Claude subscription?",
        answer: "Yes! Skills work with any Claude.ai account — Free, Pro, or Team. As long as you can upload files or create Projects in Claude, you can use skills."
    }
];

export function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                {faqItems.map((item, index) => (
                    <div key={index} className="bg-card">
                        <button
                            onClick={() => toggle(index)}
                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                        >
                            <span className="font-medium text-foreground">{item.question}</span>
                            <ChevronDown
                                className={cn(
                                    "h-5 w-5 text-muted-foreground transition-transform duration-200",
                                    openIndex === index && "rotate-180"
                                )}
                            />
                        </button>
                        <div
                            className={cn(
                                "overflow-hidden transition-all duration-200",
                                openIndex === index ? "max-h-48" : "max-h-0"
                            )}
                        >
                            <p className="px-6 pb-4 text-muted-foreground text-sm leading-relaxed">
                                {item.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
