'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { X, Sparkles, Loader2, Check, Zap } from 'lucide-react';
import { generateSkillFromDescription } from '@/lib/claude-client';
import { generateSkillZip } from '@/lib/utils/skill-generator';

interface OnboardingWizardProps {
    onClose: () => void;
    onComplete: () => void;
}

const QUICK_START_PROMPTS = [
    {
        title: "Property Listings",
        description: "Generate professional real estate listings",
        prompt: "Create professional property listings from rough notes. Include catchy headlines, feature highlights, and compelling descriptions."
    },
    {
        title: "Email Drafting",
        description: "Write professional business emails",
        prompt: "Draft professional business emails based on context. Include appropriate greetings, clear messaging, and proper sign-offs."
    },
    {
        title: "Meeting Notes",
        description: "Summarize meeting discussions",
        prompt: "Summarize meeting discussions into actionable notes with clear action items, decisions, and next steps."
    },
    {
        title: "Content Outlines",
        description: "Create structured content outlines",
        prompt: "Generate detailed content outlines for blog posts or articles with sections, key points, and research suggestions."
    }
];

export function OnboardingWizard({ onClose, onComplete }: OnboardingWizardProps) {
    const [step, setStep] = useState<'intro' | 'describe' | 'generating' | 'preview'>('intro');
    const [customPrompt, setCustomPrompt] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
    const [generatedSkill, setGeneratedSkill] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleStart = () => {
        setStep('describe');
    };

    const handleGenerate = async () => {
        const prompt = selectedTemplate !== null
            ? QUICK_START_PROMPTS[selectedTemplate].prompt
            : customPrompt;

        if (!prompt.trim()) {
            setError('Please describe what you want or select a template');
            return;
        }

        setStep('generating');
        setError(null);

        try {
            // Use platform API key from environment variable
            const platformKey = process.env.NEXT_PUBLIC_PLATFORM_CLAUDE_KEY || '';

            if (!platformKey) {
                throw new Error('Platform API key not configured');
            }

            const result = await generateSkillFromDescription(platformKey, prompt);
            setGeneratedSkill(result.skill);
            setStep('preview');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate skill');
            setStep('describe');
        }
    };

    const handleDownload = async () => {
        if (!generatedSkill) return;

        try {
            const blob = await generateSkillZip(generatedSkill);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${generatedSkill.name.toLowerCase().replace(/\s+/g, '-')}.zip`;
            a.click();
            URL.revokeObjectURL(url);
            onComplete();
        } catch (error) {
            console.error('Failed to generate skill:', error);
            setError('Failed to download skill');
        }
    };

    const handleSkip = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-3xl bg-card border-border shadow-2xl">
                {/* Intro Step */}
                {step === 'intro' && (
                    <div className="p-8 text-center">
                        <div className="flex justify-end mb-4">
                            <Button variant="ghost" size="icon" onClick={handleSkip}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="mb-6">
                            <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                                <Sparkles className="w-12 h-12 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-3">
                                Create Your First AI Skill
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                                In just 2 minutes, you'll have a working AI skill that transforms how Claude helps you work.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                            <div className="text-center">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 font-bold">1</div>
                                <p className="text-sm text-muted-foreground">Describe what you need</p>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 font-bold">2</div>
                                <p className="text-sm text-muted-foreground">AI builds it for you</p>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-2 font-bold">3</div>
                                <p className="text-sm text-muted-foreground">Download & use</p>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <Button size="lg" onClick={handleStart}>
                                <Zap className="w-4 h-4 mr-2" />
                                Get Started
                            </Button>
                            <Button variant="outline" size="lg" onClick={handleSkip}>
                                Skip for now
                            </Button>
                        </div>
                    </div>
                )}

                {/* Describe Step */}
                {step === 'describe' && (
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-foreground mb-2">
                                    What do you want Claude to help you with?
                                </h2>
                                <p className="text-muted-foreground">
                                    Pick a template or describe your own
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleSkip}>
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Quick Start Templates */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            {QUICK_START_PROMPTS.map((template, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setSelectedTemplate(i);
                                        setCustomPrompt('');
                                    }}
                                    className={`p-4 text-left rounded-lg border transition-all ${selectedTemplate === i
                                            ? 'border-primary bg-primary/10'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <div className="font-medium text-foreground mb-1">{template.title}</div>
                                    <div className="text-sm text-muted-foreground">{template.description}</div>
                                </button>
                            ))}
                        </div>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-border"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">Or describe your own</span>
                            </div>
                        </div>

                        <Textarea
                            value={customPrompt}
                            onChange={(e) => {
                                setCustomPrompt(e.target.value);
                                setSelectedTemplate(null);
                            }}
                            placeholder="Example: I need to analyze customer feedback and identify common themes..."
                            className="min-h-[100px] mb-4"
                        />

                        {error && (
                            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button
                                onClick={handleGenerate}
                                disabled={!customPrompt.trim() && selectedTemplate === null}
                                className="flex-1"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate Skill
                            </Button>
                            <Button variant="outline" onClick={handleSkip}>
                                Skip
                            </Button>
                        </div>
                    </div>
                )}

                {/* Generating Step */}
                {step === 'generating' && (
                    <div className="p-12 text-center">
                        <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            Creating your skill...
                        </h3>
                        <p className="text-muted-foreground">
                            AI is analyzing your request and building a custom skill
                        </p>
                    </div>
                )}

                {/* Preview Step */}
                {step === 'preview' && generatedSkill && (
                    <div className="p-8">
                        <div className="flex items-center gap-2 text-green-500 mb-6">
                            <Check className="w-6 h-6" />
                            <span className="text-lg font-semibold">Your skill is ready!</span>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground uppercase">Name</label>
                                <p className="text-foreground font-medium mt-1">{generatedSkill.name}</p>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-muted-foreground uppercase">Description</label>
                                <p className="text-foreground mt-1">{generatedSkill.description}</p>
                            </div>

                            <div>
                                <label className="text-xs font-medium text-muted-foreground uppercase">How to use</label>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {generatedSkill.triggers.slice(0, 3).map((trigger: string, i: number) => (
                                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-md">
                                            "{trigger}"
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button onClick={handleDownload} className="flex-1">
                                Download & Use
                            </Button>
                            <Button variant="outline" onClick={() => setStep('describe')}>
                                Start Over
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
