'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
    generateSkillFromDescription,
    refineSkillWithFeedback,
    INDUSTRY_PRESETS,
    IndustryPreset
} from '@/lib/claude-client';
import {
    Sparkles,
    Loader2,
    Zap,
    Building2,
    Scale,
    DollarSign,
    ShoppingCart,
    Briefcase,
    X,
    Check,
    AlertCircle,
    RefreshCw,
    MessageSquare
} from 'lucide-react';

interface AISkillGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: (skill: {
        name: string;
        description: string;
        category: string;
        triggers: string[];
        instructions: string;
    }) => void;
}

const industryIcons: Record<IndustryPreset, React.ReactNode> = {
    'real-estate': <Building2 className="w-5 h-5" />,
    'legal': <Scale className="w-5 h-5" />,
    'financial': <DollarSign className="w-5 h-5" />,
    'e-commerce': <ShoppingCart className="w-5 h-5" />,
    'professional-services': <Briefcase className="w-5 h-5" />,
};

export function AISkillGenerator({ isOpen, onClose, onAccept }: AISkillGeneratorProps) {
    const [description, setDescription] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState<IndustryPreset | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedSkill, setGeneratedSkill] = useState<{
        name: string;
        description: string;
        category: string;
        triggers: string[];
        instructions: string;
    } | null>(null);
    const [tokensUsed, setTokensUsed] = useState(0);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [refineFeedback, setRefineFeedback] = useState('');
    const [isRefining, setIsRefining] = useState(false);
    const [showRefineInput, setShowRefineInput] = useState(false);

    // Load API key from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedKey = localStorage.getItem('claude-api-key');
            setApiKey(storedKey);
        }
    }, []);

    const handleGenerate = async () => {
        if (!apiKey) {
            setError('Please configure your Claude API key in the Test tab first.');
            return;
        }

        if (!description.trim()) {
            setError('Please describe what you want your skill to do.');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setGeneratedSkill(null);

        try {
            const result = await generateSkillFromDescription(
                apiKey,
                description,
                selectedIndustry || undefined
            );
            setGeneratedSkill(result.skill);
            setTokensUsed(result.tokensUsed);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate skill');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAccept = () => {
        if (generatedSkill) {
            onAccept(generatedSkill);
            onClose();
            // Reset state
            setDescription('');
            setSelectedIndustry(null);
            setGeneratedSkill(null);
        }
    };

    const handleRegenerate = () => {
        setGeneratedSkill(null);
        setShowRefineInput(false);
        setRefineFeedback('');
        handleGenerate();
    };

    const handleRefine = async () => {
        if (!apiKey || !generatedSkill || !refineFeedback.trim()) return;

        setIsRefining(true);
        setError(null);
        try {
            const result = await refineSkillWithFeedback(
                apiKey,
                generatedSkill,
                refineFeedback
            );
            setGeneratedSkill(result.skill);
            setTokensUsed(prev => prev + result.tokensUsed);
            setRefineFeedback('');
            setShowRefineInput(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to refine skill');
        } finally {
            setIsRefining(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-card border-border shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Create with AI</h2>
                            <p className="text-sm text-muted-foreground">Describe your task and let Claude generate a skill</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {!generatedSkill ? (
                        <>
                            {/* Industry Selector */}
                            <div>
                                <label className="block text-sm font-medium mb-3 text-muted-foreground">
                                    Select Industry (optional)
                                </label>
                                <div className="grid grid-cols-5 gap-2">
                                    {(Object.keys(INDUSTRY_PRESETS) as IndustryPreset[]).map((key) => (
                                        <button
                                            key={key}
                                            onClick={() => setSelectedIndustry(selectedIndustry === key ? null : key)}
                                            className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${selectedIndustry === key
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'
                                                }`}
                                        >
                                            {industryIcons[key]}
                                            <span className="text-xs font-medium text-center">
                                                {INDUSTRY_PRESETS[key].name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description Input */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                                    What do you want your skill to do?
                                </label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Example: I need to create professional property listings from rough notes. The listing should include a catchy headline, feature highlights, and a compelling description that emphasizes the property's best features."
                                    className="min-h-[120px] resize-none"
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    Be specific about input requirements, output format, and any constraints.
                                </p>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* API Key Warning */}
                            {!apiKey && (
                                <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-500 text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    Configure your Claude API key in the Test tab to use this feature.
                                </div>
                            )}
                        </>
                    ) : (
                        /* Generated Skill Preview */
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-green-500 mb-4">
                                <Check className="w-5 h-5" />
                                <span className="font-medium">Skill Generated!</span>
                                <span className="text-xs text-muted-foreground ml-auto">
                                    {tokensUsed} tokens used
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</label>
                                    <p className="text-foreground font-medium mt-1">{generatedSkill.name}</p>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</label>
                                    <p className="text-foreground mt-1">{generatedSkill.description}</p>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
                                    <p className="text-foreground mt-1">{generatedSkill.category}</p>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Triggers</label>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {generatedSkill.triggers.map((trigger, i) => (
                                            <span key={i} className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-md">
                                                {trigger}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Instructions Preview</label>
                                    <div className="mt-2 p-3 bg-background border border-border rounded-lg max-h-[200px] overflow-y-auto">
                                        <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
                                            {generatedSkill.instructions.slice(0, 500)}
                                            {generatedSkill.instructions.length > 500 && '...'}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-card">
                    {!generatedSkill ? (
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating || !apiKey || !description.trim()}
                            className="w-full"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-4 h-4 mr-2" />
                                    Generate Skill
                                </>
                            )}
                        </Button>
                    ) : (
                        <div className="space-y-3">
                            {/* Refine Feedback Input */}
                            {showRefineInput && (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={refineFeedback}
                                        onChange={(e) => setRefineFeedback(e.target.value)}
                                        placeholder="e.g., Make triggers shorter, add more examples..."
                                        className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground"
                                        onKeyDown={(e) => e.key === 'Enter' && refineFeedback.trim() && handleRefine()}
                                    />
                                    <Button
                                        onClick={handleRefine}
                                        disabled={isRefining || !refineFeedback.trim()}
                                        size="sm"
                                    >
                                        {isRefining ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Check className="w-4 h-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => { setShowRefineInput(false); setRefineFeedback(''); }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={handleRegenerate}
                                    disabled={isGenerating || isRefining}
                                    className="flex-1"
                                >
                                    {isGenerating ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                    )}
                                    Regenerate
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowRefineInput(true)}
                                    disabled={isRefining || showRefineInput}
                                    className="flex-1 border-[#C15F3C]/50 text-[#C15F3C] hover:bg-[#C15F3C]/10"
                                >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Refine
                                </Button>
                                <Button onClick={handleAccept} disabled={isRefining} className="flex-1">
                                    <Check className="w-4 h-4 mr-2" />
                                    Use This Skill
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
