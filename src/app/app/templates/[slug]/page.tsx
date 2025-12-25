'use client';

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getTemplateById } from '@/lib/api/templateApi';
import { useSkillStore } from '@/lib/store/skillStore';
import { Template } from '@/types/skill.types';
import { Zap, CheckCircle, ChevronDown, ChevronUp, Download, ArrowLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Category colors for accent matching
const categoryColors: Record<string, { bg: string; text: string }> = {
    'Real Estate': { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
    'Business': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
    'Finance': { bg: 'bg-amber-500/10', text: 'text-amber-400' },
    'Product': { bg: 'bg-purple-500/10', text: 'text-purple-400' },
    'Marketing': { bg: 'bg-pink-500/10', text: 'text-pink-400' },
    'Sales': { bg: 'bg-orange-500/10', text: 'text-orange-400' },
};

const getColorScheme = (category: string) => {
    return categoryColors[category] || { bg: 'bg-primary/10', text: 'text-primary' };
};

// Generate "What You Get" based on template content
function generateBenefits(template: Template): string[] {
    const benefits: string[] = [];
    if (template.triggers.length > 0) {
        benefits.push(`${template.triggers.length} activation trigger${template.triggers.length > 1 ? 's' : ''}`);
    }
    if (template.instructions.includes('structure') || template.instructions.includes('format')) {
        benefits.push('Structured output format');
    }
    if (template.instructions.includes('professional') || template.instructions.includes('quality')) {
        benefits.push('Professional quality content');
    }
    if (template.instructions.includes('SEO') || template.instructions.includes('optimized')) {
        benefits.push('Optimized for best results');
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
    const [showInstructions, setShowInstructions] = useState(false);

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
            <div className="container max-w-6xl mx-auto py-12 px-4 min-h-screen bg-background">
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
        );
    }

    if (!template) {
        return (
            <div className="container mx-auto py-20 text-center text-foreground">
                <h1 className="text-2xl font-bold mb-4">Template not found</h1>
                <Button onClick={() => router.push('/app/templates')}>Back to Templates</Button>
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

    const colors = getColorScheme(template.category);
    const benefits = generateBenefits(template);

    return (
        <div className="container max-w-6xl mx-auto py-8 px-4 bg-background min-h-screen">
            {/* Breadcrumb */}
            <Button
                variant="ghost"
                onClick={() => router.push('/app/templates')}
                className="mb-6 hover:bg-muted"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Templates
            </Button>

            {/* Two-Column Layout */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header */}
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className={cn(
                                'text-sm font-medium px-3 py-1 rounded-full',
                                colors.bg,
                                colors.text
                            )}>
                                {template.category}
                            </span>
                            {template.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-3xl font-bold text-foreground mb-3">{template.name}</h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {template.description}
                        </p>
                    </div>

                    {/* What You Get */}
                    <Card className="p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
                            <Sparkles className="w-5 h-5 text-primary" />
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

                    {/* Instructions (Collapsible) */}
                    <Card className="p-6">
                        <button
                            onClick={() => setShowInstructions(!showInstructions)}
                            className="w-full flex items-center justify-between text-left"
                        >
                            <h3 className="font-semibold text-lg flex items-center gap-2 text-foreground">
                                📝 Full Instructions
                            </h3>
                            {showInstructions ? (
                                <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                        </button>
                        {showInstructions ? (
                            <div className="mt-4 bg-slate-900 text-slate-100 p-6 rounded-lg font-mono text-sm overflow-x-auto max-h-[500px]">
                                <pre className="whitespace-pre-wrap">{template.instructions}</pre>
                            </div>
                        ) : (
                            <p className="mt-3 text-sm text-muted-foreground">
                                Click to view the complete skill instructions...
                            </p>
                        )}
                    </Card>
                </div>

                {/* Sidebar - Right Column */}
                <div className="space-y-6">
                    {/* Primary CTA */}
                    <Card className="p-6 border-primary/20">
                        <Button onClick={handleUseTemplate} size="lg" className="w-full mb-4">
                            Use This Template
                        </Button>
                        <p className="text-sm text-muted-foreground text-center">
                            Opens in Builder for customization
                        </p>
                    </Card>

                    {/* Template Info */}
                    <Card className="p-6">
                        <h4 className="font-semibold mb-4 text-foreground">Template Info</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Category</span>
                                <span className={cn('font-medium', colors.text)}>{template.category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Triggers</span>
                                <span className="text-foreground">{template.triggers.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Difficulty</span>
                                <span className="text-foreground">Beginner</span>
                            </div>
                        </div>
                    </Card>

                    {/* Triggers */}
                    <Card className="p-6">
                        <h4 className="font-semibold mb-4 flex items-center gap-2 text-foreground">
                            <Zap className="w-4 h-4 text-primary" />
                            Activation Triggers
                        </h4>
                        <div className="space-y-2">
                            {template.triggers.map((trigger, i) => (
                                <div key={i} className="text-sm bg-muted px-3 py-2 rounded-lg text-foreground">
                                    "{trigger}"
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="p-6">
                        <h4 className="font-semibold mb-4 text-foreground">Quick Actions</h4>
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full justify-start" onClick={handleUseTemplate}>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Preview in Builder
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground" disabled>
                                <Download className="w-4 h-4 mr-2" />
                                Download ZIP (Coming Soon)
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
