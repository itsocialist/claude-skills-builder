'use client';

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getTemplateById } from '@/lib/templates';
import { useSkillStore } from '@/lib/store/skillStore';

export default function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
    // In Next.js 15+ params is a Promise
    const resolvedParams = use(params);
    const router = useRouter();
    const { setSkill } = useSkillStore();
    const template = getTemplateById(resolvedParams.slug);

    if (!template) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold mb-4 text-foreground">Template not found</h1>
                <Button onClick={() => router.push('/app')}>Return Home</Button>
            </div>
        );
    }

    const handleUseTemplate = () => {
        setSkill({
            name: template.name,
            description: template.description,
            category: template.category,
            tags: template.tags,
            triggers: template.triggers,
            instructions: template.instructions,
        });
        router.push('/app/builder');
    };

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4 bg-background min-h-screen">
            <div className="mb-8">
                <Button variant="ghost" onClick={() => router.push('/app/templates')} className="pl-0 hover:pl-2 transition-all">
                    ← Back to Templates
                </Button>
            </div>

            <Card className="p-8 shadow-lg">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-foreground">{template.name}</h1>
                        <div className="flex gap-2 mb-4 flex-wrap">
                            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                                {template.category}
                            </span>
                            {template.tags.map(tag => (
                                <span key={tag} className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <Button onClick={handleUseTemplate} size="lg">
                        Use This Template
                    </Button>
                </div>

                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                    {template.description}
                </p>

                <div className="space-y-8">
                    <div>
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                            <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">⚡</span>
                            Activation Triggers
                        </h3>
                        <div className="bg-card p-4 rounded-lg border border-border">
                            <ul className="list-disc list-inside space-y-2 text-foreground">
                                {template.triggers.map((trigger, i) => (
                                    <li key={i}>{trigger}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                            <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">📝</span>
                            Preview Instructions
                        </h3>
                        <div className="bg-slate-900 text-slate-100 p-6 rounded-lg font-mono text-sm overflow-x-auto max-h-[400px]">
                            <pre className="whitespace-pre-wrap">{template.instructions}</pre>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="mt-8 text-center">
                <p className="text-muted-foreground mb-4">Ready to customize this skill?</p>
                <Button onClick={handleUseTemplate} size="lg" className="w-full md:w-auto px-8">
                    Customize in Builder
                </Button>
            </div>
        </div>
    );
}

