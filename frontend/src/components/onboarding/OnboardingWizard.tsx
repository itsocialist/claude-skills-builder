'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { X, Sparkles, Loader2, Check, Zap, RefreshCw, Save, Download, FileDown, Edit, LayoutGrid, Maximize2 } from 'lucide-react';
import { generateSkillFromDescription, runSkillPreview, refineSkillWithFeedback, runBaselinePreview } from '@/lib/claude-client';
import { generateSkillZip } from '@/lib/utils/skill-generator';
import { EmailCaptureModal } from './EmailCaptureModal';
import ReactMarkdown from 'react-markdown';

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
    },
    {
        title: "Social Media Posts",
        description: "Craft engaging social media content",
        prompt: "Create engaging social media posts from ideas or topics. Optimize for platform (LinkedIn, Twitter, Instagram) with appropriate tone, hashtags, and calls-to-action."
    },
    {
        title: "Blog Articles",
        description: "Write SEO-optimized blog posts",
        prompt: "Generate complete blog articles from topics or outlines. Include SEO-friendly headers, engaging introductions, valuable content, and strong conclusions."
    },
    {
        title: "Code Documentation",
        description: "Document code and functions",
        prompt: "Generate clear technical documentation for code, APIs, or functions. Include purpose, parameters, return values, examples, and edge cases."
    },
    {
        title: "Support Responses",
        description: "Draft customer support replies",
        prompt: "Create helpful customer support responses. Be empathetic, provide clear solutions, include troubleshooting steps, and offer follow-up assistance."
    },
    {
        title: "Sales Proposals",
        description: "Generate persuasive proposals",
        prompt: "Create compelling sales proposals from requirements. Include executive summary, solution overview, pricing, benefits, and next steps."
    },
    {
        title: "Interview Prep",
        description: "Prepare interview questions",
        prompt: "Generate thoughtful interview questions for candidates. Cover technical skills, experience, cultural fit, and behavioral scenarios relevant to the role."
    }
];

export function OnboardingWizard({ onClose, onComplete }: OnboardingWizardProps) {
    const [step, setStep] = useState<'intro' | 'describe' | 'generating' | 'preview'>('intro');
    const [customPrompt, setCustomPrompt] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
    const [generatedSkill, setGeneratedSkill] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [showEmailCapture, setShowEmailCapture] = useState(false);
    const [hasDownloaded, setHasDownloaded] = useState(false);

    // Test console state
    const [testInput, setTestInput] = useState('');
    const [testOutput, setTestOutput] = useState('');
    const [isTestingSkill, setIsTestingSkill] = useState(false);
    const [baselineOutput, setBaselineOutput] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [editedSkill, setEditedSkill] = useState<any>(null);
    const [refineFeedback, setRefineFeedback] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    const [compareView, setCompareView] = useState<'split' | 'skill'>('split');

    // Comparison metrics
    const comparisonMetrics = useMemo(() => {
        if (!testOutput || !baselineOutput) return null;
        const baselineWords = baselineOutput.split(/\s+/).length;
        const skillWords = testOutput.split(/\s+/).length;
        const baselineSections = (baselineOutput.match(/^#/gm) || []).length;
        const skillSections = (testOutput.match(/^#/gm) || []).length;
        return {
            baselineWords,
            skillWords,
            wordDiff: skillWords - baselineWords,
            baselineSections,
            skillSections,
            sectionDiff: skillSections - baselineSections,
        };
    }, [testOutput, baselineOutput]);

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

            // Mark as downloaded and show email capture
            setHasDownloaded(true);
            setShowEmailCapture(true);
        } catch (error) {
            console.error('Failed to generate skill:', error);
            setError('Failed to download skill');
        }
    };

    const handleTestSkill = async () => {
        if (!generatedSkill || !testInput.trim()) return;

        setIsTestingSkill(true);
        setError(null);
        setTestOutput(''); // Clear previous output
        setBaselineOutput(''); // Clear baseline

        try {
            const platformKey = process.env.NEXT_PUBLIC_PLATFORM_CLAUDE_KEY || '';

            if (!platformKey) {
                throw new Error('Platform API key not configured');
            }

            // Run BOTH in parallel for A/B comparison
            await Promise.all([
                // WITH skill (Column B)
                runSkillPreview(
                    platformKey,
                    generatedSkill,
                    testInput,
                    (text) => setTestOutput(text)
                ),
                // WITHOUT skill (Column A)
                runBaselinePreview(
                    platformKey,
                    testInput,
                    (text) => setBaselineOutput(text)
                )
            ]);
        } catch (err) {
            console.error('Skill preview error:', err);
            setTestOutput(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsTestingSkill(false);
        }
    };

    const handleRefine = async () => {
        if (!generatedSkill || !refineFeedback.trim()) return;

        setIsRefining(true);
        setError(null);

        try {
            const platformKey = process.env.NEXT_PUBLIC_PLATFORM_CLAUDE_KEY || '';

            if (!platformKey) {
                throw new Error('Platform API key not configured');
            }

            const result = await refineSkillWithFeedback(
                platformKey,
                generatedSkill,
                refineFeedback
            );

            setGeneratedSkill(result.skill);
            setRefineFeedback('');
            setIsEditMode(false);
        } catch (err) {
            console.error('Refine error:', err);
            setError(err instanceof Error ? err.message : 'Failed to refine skill');
        } finally {
            setIsRefining(false);
        }
    };

    const handleCreateAnother = () => {
        // Reset all state
        setGeneratedSkill(null);
        setCustomPrompt('');
        setSelectedTemplate(null);
        setError(null);
        setHasDownloaded(false);
        setTestInput('');
        setTestOutput('');
        setStep('describe');
    };

    const handleEmailCaptureComplete = () => {
        setShowEmailCapture(false);
        onComplete();
    };

    const handleEmailCaptureSkip = () => {
        setShowEmailCapture(false);
        onComplete();
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
                        <div className="max-h-96 overflow-y-auto mb-6">
                            <div className="grid grid-cols-3 gap-3">
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

                        {/* Skill Details */}
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

                        {/* Test Console */}
                        <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                            <label className="text-sm font-medium text-foreground mb-2 block">
                                Try it out (preview):
                            </label>
                            <div className="space-y-2">
                                <Input
                                    value={testInput}
                                    onChange={(e) => setTestInput(e.target.value)}
                                    placeholder={`Try: "${generatedSkill.triggers[0]}"`}
                                    className="bg-background"
                                    onKeyDown={(e) => e.key === 'Enter' && handleTestSkill()}
                                />
                                {(testOutput || baselineOutput) && (
                                    <div className="mt-3">
                                        {/* Metrics Bar + Toggle */}
                                        <div className="flex items-center justify-between mb-2">
                                            {comparisonMetrics && (
                                                <div className="flex gap-3 text-xs">
                                                    <span className="text-muted-foreground">
                                                        Words: <span className="text-foreground font-medium">{comparisonMetrics.skillWords}</span>
                                                        {comparisonMetrics.wordDiff > 0 && (
                                                            <span className="text-green-500 ml-1">(+{comparisonMetrics.wordDiff})</span>
                                                        )}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        Sections: <span className="text-foreground font-medium">{comparisonMetrics.skillSections}</span>
                                                        {comparisonMetrics.sectionDiff > 0 && (
                                                            <span className="text-green-500 ml-1">(+{comparisonMetrics.sectionDiff})</span>
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setCompareView(compareView === 'split' ? 'skill' : 'split')}
                                                className="text-xs h-7"
                                            >
                                                {compareView === 'split' ? (
                                                    <><Maximize2 className="w-3 h-3 mr-1" />Full View</>
                                                ) : (
                                                    <><LayoutGrid className="w-3 h-3 mr-1" />Compare</>
                                                )}
                                            </Button>
                                        </div>

                                        {/* A/B Comparison Grid */}
                                        <div className={`grid gap-3 ${compareView === 'split' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                            {/* Column A: Without Skill (hidden in full view) */}
                                            {compareView === 'split' && (
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                                                        <span className="text-xs font-medium text-muted-foreground uppercase">Without Skill</span>
                                                    </div>
                                                    <div className="p-3 bg-muted/30 rounded border border-border max-h-60 overflow-y-auto text-sm">
                                                        {baselineOutput ? (
                                                            <div className="text-muted-foreground whitespace-pre-wrap">{baselineOutput}</div>
                                                        ) : (
                                                            <div className="text-muted-foreground italic">Loading...</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {/* Column B: With Skill */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                                    <span className="text-xs font-medium text-primary uppercase">With Skill ✨</span>
                                                </div>
                                                <div className={`p-3 bg-primary/5 rounded border border-primary/30 overflow-y-auto text-sm ${compareView === 'split' ? 'max-h-60' : 'max-h-80'}`}>
                                                    {testOutput ? (
                                                        <ReactMarkdown
                                                            components={{
                                                                h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2 text-foreground" {...props} />,
                                                                h2: ({ node, ...props }) => <h2 className="text-base font-semibold mb-2 text-foreground" {...props} />,
                                                                h3: ({ node, ...props }) => <h3 className="text-sm font-medium mb-1 text-foreground" {...props} />,
                                                                p: ({ node, ...props }) => <p className="mb-2 text-foreground leading-relaxed" {...props} />,
                                                                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1 text-foreground text-sm" {...props} />,
                                                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1 text-foreground text-sm" {...props} />,
                                                                li: ({ node, ...props }) => <li className="ml-2" {...props} />,
                                                                strong: ({ node, ...props }) => <strong className="font-semibold text-foreground" {...props} />,
                                                            }}
                                                        >
                                                            {testOutput}
                                                        </ReactMarkdown>
                                                    ) : (
                                                        <div className="text-muted-foreground italic">Loading...</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Export Button */}
                                        <div className="flex gap-2 mt-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    const combined = `# A/B Comparison\n\n## Without Skill\n${baselineOutput}\n\n## With Skill\n${testOutput}`;
                                                    const blob = new Blob([combined], { type: 'text/markdown' });
                                                    const url = URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    a.href = url;
                                                    a.download = `${generatedSkill.name}-comparison.md`;
                                                    a.click();
                                                    URL.revokeObjectURL(url);
                                                }}
                                                className="text-xs"
                                            >
                                                <FileDown className="w-3 h-3 mr-1" />
                                                Export Comparison
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleTestSkill}
                                    disabled={isTestingSkill || !testInput.trim()}
                                >
                                    {isTestingSkill ? (
                                        <>
                                            <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        'Test Skill'
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Refine Skill Section */}
                        {!isEditMode ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditMode(true)}
                                className="mb-6 w-full"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Refine this skill
                            </Button>
                        ) : (
                            <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-border">
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    How would you like to improve this skill?
                                </label>
                                <Textarea
                                    value={refineFeedback}
                                    onChange={(e) => setRefineFeedback(e.target.value)}
                                    placeholder="Example: Make it more formal, add examples, focus on features for luxury properties..."
                                    className="mb-3 min-h-[80px]"
                                />
                                {error && (
                                    <div className="mb-3 p-2 bg-destructive/10 border border-destructive/30 rounded text-destructive text-sm">
                                        {error}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleRefine}
                                        disabled={isRefining || !refineFeedback.trim()}
                                        className="flex-1"
                                    >
                                        {isRefining ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Refining...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-4 h-4 mr-2" />
                                                Refine Skill
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditMode(false);
                                            setRefineFeedback('');
                                            setError(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <Button onClick={handleDownload} className="w-full">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowEmailCapture(true)}
                                    className="w-full border-primary/50 text-primary hover:bg-primary/10"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save to Account
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={handleCreateAnother}
                                className="w-full"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Create Another Skill
                            </Button>
                        </div>

                        {hasDownloaded && (
                            <p className="text-xs text-center text-muted-foreground mt-4">
                                ✅ Downloaded! Upload the ZIP to Claude.ai to use your skill.
                            </p>
                        )}
                    </div>
                )}
            </Card>

            {/* Email Capture Modal - shown after download */}
            {showEmailCapture && (
                <EmailCaptureModal
                    onClose={() => setShowEmailCapture(false)}
                    onSkip={handleEmailCaptureSkip}
                    onSuccess={handleEmailCaptureComplete}
                />
            )}
        </div>
    );
}
