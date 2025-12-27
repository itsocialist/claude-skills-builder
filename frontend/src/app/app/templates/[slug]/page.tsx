'use client';

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getTemplateById } from '@/lib/api/templateApi';
import { useSkillStore } from '@/lib/store/skillStore';
import { Template } from '@/types/skill.types';
import { CheckCircle, ChevronDown, ChevronUp, ArrowLeft, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Shell } from '@/components/layout/Shell';

// Generate "What You Get" based on template content
function generateBenefits(template: Template): string[] {
    const benefits: string[] = [];
    if (template.triggers.length > 0) {
        benefits.push('Example prompts to get started');
    }
    if (template.instructions.includes('structure') || template.instructions.includes('format')) {
        benefits.push('Structured output format');
    }
    if (template.instructions.includes('professional') || template.instructions.includes('quality')) {
        benefits.push('Professional quality content');
    }
    benefits.push('Fully customizable in Builder');
    return benefits.slice(0, 4);
}

export default function TemplatePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { setSkill } = useSkillStore();
    const [template, setTemplate] = useState<Template | null>(null);
    const [loading, setLoading] = useState(true);
    const [showInstructions, setShowInstructions] = useState(true);
    const [showSampleOutput, setShowSampleOutput] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getTemplateById(resolvedParams.slug);
                setTemplate(data);
            } catch (error) {
                console.error('Error loading template:', error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [resolvedParams.slug]);

    if (loading) {
        return (
            <Shell title="Loading...">
                <div className="container max-w-6xl mx-auto py-12 px-4">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-muted rounded w-40" />
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                <div className="h-10 bg-muted rounded w-3/4" />
                                <div className="h-6 bg-muted rounded w-full" />
                                <div className="h-40 bg-card rounded-lg border border-border" />
                            </div>
                            <div className="h-64 bg-card rounded-lg border border-border" />
                        </div>
                    </div>
                </div>
            </Shell>
        );
    }

    if (!template) {
        return (
            <Shell title="Template Not Found">
                <div className="container mx-auto py-20 text-center text-foreground">
                    <h1 className="text-2xl font-bold mb-4">Template not found</h1>
                    <Button onClick={() => router.push('/app/templates')}>Back to Templates</Button>
                </div>
            </Shell>
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

    const handleDownloadZip = async () => {
        const zip = new JSZip();

        // Create SKILL.md content
        const skillContent = `---
name: ${template.name}
description: ${template.description}
category: ${template.category}
tags: [${template.tags.map(t => `"${t}"`).join(', ')}]
---

# ${template.name}

${template.description}

## Triggers

${template.triggers.map(t => `- "${t}"`).join('\n')}

## Instructions

${template.instructions}
`;

        zip.file('SKILL.md', skillContent);

        // Generate and download
        const blob = await zip.generateAsync({ type: 'blob' });
        const safeName = template.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        saveAs(blob, `${safeName}.zip`);
    };

    const benefits = generateBenefits(template);

    // Inspector panel content (sidebar)
    const inspectorContent = (
        <div className="p-4 space-y-4 h-full overflow-y-auto">
            {/* Primary CTA */}
            <div className="space-y-3">
                <Button onClick={handleUseTemplate} size="lg" className="w-full">
                    Use This Template
                </Button>
                <Button variant="outline" className="w-full" onClick={handleDownloadZip}>
                    <Download className="w-4 h-4 mr-2" />
                    Download ZIP
                </Button>
            </div>

            {/* Template Info */}
            <Card className="p-4">
                <h4 className="font-semibold mb-3 text-foreground text-sm">Template Info</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Category</span>
                        <Badge variant="secondary">{template.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Prompts</span>
                        <span className="text-foreground">{template.triggers.length}</span>
                    </div>
                    {template.tags.length > 0 && (
                        <div>
                            <span className="text-muted-foreground block mb-2">Tags</span>
                            <div className="flex flex-wrap gap-1">
                                {template.tags.map((tag, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Example Prompts */}
            {template.triggers.length > 0 && (
                <Card className="p-4">
                    <h4 className="font-semibold mb-3 text-foreground text-sm">
                        Example Prompts
                    </h4>
                    <div className="space-y-2">
                        {template.triggers.map((trigger, i) => (
                            <div key={i} className="text-xs bg-muted px-2 py-1.5 rounded text-foreground">
                                "{trigger}"
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );

    return (
        <Shell title={template?.name || 'Template Details'} inspector={inspectorContent}>
            <div className="max-w-3xl">
                {/* Breadcrumb */}
                <Button
                    variant="ghost"
                    onClick={() => router.push('/app/templates')}
                    className="mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Templates
                </Button>

                {/* Main Content */}
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">{template.category}</p>
                        <h1 className="text-3xl font-bold text-foreground mb-3">{template.name}</h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {template.description}
                        </p>
                    </div>

                    {/* What You Get */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-lg mb-4 text-foreground">
                            What You Get
                        </h3>
                        <ul className="space-y-3">
                            {benefits.map((benefit, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-foreground">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Sample Output (if available) */}
                    {template.sampleOutput && (
                        <Card className="p-6">
                            <button
                                onClick={() => setShowSampleOutput(!showSampleOutput)}
                                className="w-full flex items-center justify-between text-left"
                            >
                                <h3 className="font-semibold text-lg text-foreground">
                                    Sample Output
                                </h3>
                                {showSampleOutput ? (
                                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                )}
                            </button>
                            {showSampleOutput && (
                                <div className="mt-4 prose prose-sm prose-invert max-w-none">
                                    <ReactMarkdown>{template.sampleOutput}</ReactMarkdown>
                                </div>
                            )}
                        </Card>
                    )}

                    {/* Instructions (Collapsible) - Code Editor Format */}
                    <Card className="p-6">
                        <button
                            onClick={() => setShowInstructions(!showInstructions)}
                            className="w-full flex items-center justify-between text-left"
                        >
                            <h3 className="font-semibold text-lg text-foreground">
                                Full Instructions
                            </h3>
                            {showInstructions ? (
                                <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                        </button>
                        {showInstructions && (
                            <div className="mt-4 bg-zinc-900 border border-zinc-700 rounded-lg p-4 overflow-x-auto max-h-[500px] overflow-y-auto">
                                <pre className="text-sm font-mono text-zinc-300 whitespace-pre-wrap">{template.instructions}</pre>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </Shell>
    );
}
