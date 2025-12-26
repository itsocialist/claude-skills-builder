'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/layout/Shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useSkillStore } from '@/lib/store/skillStore';
import { generateSkillZip } from '@/lib/utils/skill-generator';
import { SkillSnippets } from '@/components/builder/SkillSnippets';
import { ResourceManager } from '@/components/builder/ResourceManager';
import {
    Check, ChevronLeft, ChevronRight, Download,
    Lightbulb, MessageSquare, FileText, Paperclip, Rocket,
    Plus, X
} from 'lucide-react';

const STEPS = [
    { id: 'what', title: 'What', icon: Lightbulb, question: 'What does your skill do?' },
    { id: 'when', title: 'When', icon: MessageSquare, question: 'When should Claude use it?' },
    { id: 'how', title: 'How', icon: FileText, question: 'How should Claude respond?' },
    { id: 'files', title: 'Files', icon: Paperclip, question: 'Attach reference files' },
];

const TRIGGER_EXAMPLES = [
    'Create a property listing for...',
    'Analyze this document...',
    'Draft an email to...',
    'Generate a report on...',
];

export default function WizardPage() {
    const router = useRouter();
    const { skill, updateField, addTrigger, removeTrigger, addResource, removeResource, reset } = useSkillStore();
    const [step, setStep] = useState(0);
    const [triggerInput, setTriggerInput] = useState('');

    const handleAddTrigger = () => {
        if (triggerInput.trim()) {
            addTrigger(triggerInput.trim());
            setTriggerInput('');
        }
    };

    const handleInsertSnippet = (content: string) => {
        updateField('instructions', skill.instructions + '\n\n' + content);
    };

    const handleDownload = async () => {
        try {
            const blob = await generateSkillZip(skill);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${skill.name || 'my-skill'}.zip`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to generate skill:', error);
        }
    };

    const handleContinueInBuilder = () => {
        // Skill is already in store, just navigate
        router.push('/app/builder');
    };

    const canProceed = () => {
        switch (step) {
            case 0: return skill.name && skill.description;
            case 1: return skill.triggers.length > 0;
            default: return true; // Steps 2+ are always navigable
        }
    };

    const currentStep = STEPS[step];
    const isLastStep = step === STEPS.length - 1;

    return (
        <Shell title="Quick Start Wizard">
            <div className="container mx-auto py-8 max-w-2xl">
                {/* Progress */}
                <div className="flex items-center justify-center mb-8 gap-1">
                    {STEPS.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <div key={s.id} className="flex items-center">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full ${i < step ? 'bg-primary text-white' :
                                        i === step ? 'bg-primary/20 text-primary border-2 border-primary' :
                                            'bg-muted text-muted-foreground'
                                        }`}
                                >
                                    {i < step ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                </div>
                                {i < STEPS.length - 1 && <div className="w-8 h-px bg-border mx-1" />}
                            </div>
                        );
                    })}
                </div>

                <Card className="p-6 border-border">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{currentStep.question}</h2>

                    {/* Step 1: What */}
                    {step === 0 && (
                        <div className="space-y-4 mt-6">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1 block">
                                    Skill Name
                                </label>
                                <Input
                                    value={skill.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder="Property Listing Generator"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1 block">
                                    Description
                                </label>
                                <Textarea
                                    value={skill.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    placeholder="Generate professional real estate listings with compelling descriptions."
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1 block">
                                    Category
                                </label>
                                <select
                                    value={skill.category}
                                    onChange={(e) => updateField('category', e.target.value)}
                                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                                >
                                    <option value="">Select a category...</option>
                                    <option value="Business">Business</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Real Estate">Real Estate</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Product">Product</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 2: When */}
                    {step === 1 && (
                        <div className="space-y-4 mt-6">
                            <p className="text-sm text-muted-foreground">
                                Add phrases that activate this skill.
                            </p>

                            <div className="flex gap-2">
                                <Input
                                    value={triggerInput}
                                    onChange={(e) => setTriggerInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTrigger()}
                                    placeholder="Type a trigger phrase..."
                                />
                                <Button onClick={handleAddTrigger} disabled={!triggerInput.trim()}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {skill.triggers.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {skill.triggers.map((trigger, i) => (
                                        <Badge key={i} variant="secondary" className="pr-1">
                                            {trigger}
                                            <button
                                                onClick={() => removeTrigger(i)}
                                                className="ml-1 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            <div className="pt-4 border-t border-border">
                                <p className="text-xs text-muted-foreground mb-2">Quick add:</p>
                                <div className="flex flex-wrap gap-2">
                                    {TRIGGER_EXAMPLES.map((example, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                if (!skill.triggers.includes(example)) {
                                                    addTrigger(example);
                                                }
                                            }}
                                            className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 text-muted-foreground"
                                        >
                                            {example}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: How (with Snippets) */}
                    {step === 2 && (
                        <div className="space-y-4 mt-6">
                            <SkillSnippets onInsert={handleInsertSnippet} />
                            <Textarea
                                value={skill.instructions}
                                onChange={(e) => updateField('instructions', e.target.value)}
                                placeholder={`# ${skill.name || 'My Skill'}

When the user asks you to ${skill.triggers[0] || 'perform this task'}...

## Required Information
- Field 1
- Field 2

## Output Format
Structure your response as...`}
                                rows={12}
                                className="font-mono text-sm"
                            />
                        </div>
                    )}

                    {/* Step 4: Files (Resources) */}
                    {step === 3 && (
                        <div className="space-y-4 mt-6">
                            <p className="text-sm text-muted-foreground">
                                Attach reference files like templates, examples, or data.
                            </p>
                            <ResourceManager
                                resources={skill.resources || []}
                                onAdd={(resource) => addResource(resource)}
                                onRemove={(id) => removeResource(id)}
                            />

                            {/* Export Actions */}
                            <div className="pt-6 border-t border-border">
                                <div className="flex flex-col gap-3">
                                    <Button onClick={handleDownload} size="lg" className="w-full">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download ZIP
                                    </Button>
                                    <Button variant="outline" onClick={handleContinueInBuilder} className="w-full">
                                        <Rocket className="h-4 w-4 mr-2" />
                                        Continue in Builder
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-border">
                        <Button
                            variant="outline"
                            onClick={() => step > 0 ? setStep(step - 1) : router.push('/app')}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            {step === 0 ? 'Cancel' : 'Back'}
                        </Button>
                        {!isLastStep && (
                            <Button
                                onClick={() => setStep(step + 1)}
                                disabled={!canProceed()}
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </Shell>
    );
}
