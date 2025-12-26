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
import {
    Check, ChevronLeft, ChevronRight, Download,
    Lightbulb, MessageSquare, FileText, TestTube, Rocket,
    Plus, X
} from 'lucide-react';

const STEPS = [
    { id: 'what', title: 'What', icon: Lightbulb, question: 'What does your skill do?' },
    { id: 'when', title: 'When', icon: MessageSquare, question: 'When should Claude use it?' },
    { id: 'how', title: 'How', icon: FileText, question: 'How should Claude respond?' },
    { id: 'test', title: 'Test', icon: TestTube, question: 'Test your skill' },
    { id: 'export', title: 'Export', icon: Rocket, question: 'Download or save' },
];

const TRIGGER_EXAMPLES = [
    'Create a property listing for...',
    'Analyze this financial statement...',
    'Draft a professional email to...',
    'Generate meeting notes from...',
];

export default function WizardPage() {
    const router = useRouter();
    const { skill, updateField, addTrigger, removeTrigger, reset } = useSkillStore();
    const [step, setStep] = useState(0);
    const [triggerInput, setTriggerInput] = useState('');
    const [testInput, setTestInput] = useState('');

    const handleAddTrigger = () => {
        if (triggerInput.trim()) {
            addTrigger(triggerInput.trim());
            setTriggerInput('');
        }
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

    const handleUseInBuilder = () => {
        router.push('/app/builder');
    };

    const canProceed = () => {
        switch (step) {
            case 0: return skill.name && skill.description;
            case 1: return skill.triggers.length > 0;
            case 2: return skill.instructions.length > 20;
            default: return true;
        }
    };

    const currentStep = STEPS[step];

    return (
        <Shell title="Skill Wizard">
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
                                {i < STEPS.length - 1 && <div className="w-6 h-px bg-border mx-1" />}
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
                                <p className="text-xs text-muted-foreground mt-1">
                                    A short, descriptive name for your skill
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1 block">
                                    Description
                                </label>
                                <Textarea
                                    value={skill.description}
                                    onChange={(e) => updateField('description', e.target.value)}
                                    placeholder="Generate professional real estate listings with compelling descriptions and all key property details."
                                    rows={3}
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    What does this skill help users accomplish?
                                </p>
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
                                Add phrases that should activate this skill. Claude will use your skill when users say something similar.
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

                            {/* Current triggers */}
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

                            {/* Examples */}
                            <div className="pt-4 border-t border-border">
                                <p className="text-xs text-muted-foreground mb-2">Examples (click to add):</p>
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

                    {/* Step 3: How */}
                    {step === 2 && (
                        <div className="space-y-4 mt-6">
                            <p className="text-sm text-muted-foreground">
                                Write the instructions that tell Claude how to respond. Be specific about format, tone, and what information to include.
                            </p>
                            <Textarea
                                value={skill.instructions}
                                onChange={(e) => updateField('instructions', e.target.value)}
                                placeholder={`# ${skill.name || 'My Skill'}

When the user asks you to ${skill.triggers[0] || 'perform this task'}, follow these steps:

## Step 1: Gather Information
Ask clarifying questions if needed...

## Step 2: Generate Output
Create a structured response that includes...

## Format
- Use clear headings
- Include bullet points
- Be professional yet friendly`}
                                rows={12}
                                className="font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                                Tip: Use markdown formatting for better structure
                            </p>
                        </div>
                    )}

                    {/* Step 4: Test */}
                    {step === 3 && (
                        <div className="space-y-4 mt-6">
                            <p className="text-sm text-muted-foreground">
                                Preview how your skill will work. Enter a sample input to see the expected behavior.
                            </p>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1 block">
                                    Sample Input
                                </label>
                                <Textarea
                                    value={testInput}
                                    onChange={(e) => setTestInput(e.target.value)}
                                    placeholder={skill.triggers[0] || 'Enter a sample request...'}
                                    rows={3}
                                />
                            </div>
                            <Card className="p-4 bg-muted/50">
                                <h4 className="text-sm font-medium mb-2">Skill Preview</h4>
                                <div className="text-xs text-muted-foreground space-y-1">
                                    <p><strong>Name:</strong> {skill.name || 'Not set'}</p>
                                    <p><strong>Category:</strong> {skill.category || 'Not set'}</p>
                                    <p><strong>Triggers:</strong> {skill.triggers.length} phrases</p>
                                    <p><strong>Instructions:</strong> {skill.instructions.length} characters</p>
                                </div>
                            </Card>
                            <p className="text-xs text-muted-foreground">
                                Full testing available in the Builder with your Claude API key.
                            </p>
                        </div>
                    )}

                    {/* Step 5: Export */}
                    {step === 4 && (
                        <div className="space-y-6 mt-6 text-center">
                            <div className="py-4">
                                <Rocket className="h-12 w-12 mx-auto text-primary mb-4" />
                                <h3 className="text-lg font-semibold text-foreground">Your skill is ready!</h3>
                                <p className="text-muted-foreground">
                                    Download it or continue refining in the Builder.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button onClick={handleDownload} size="lg">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download ZIP
                                </Button>
                                <Button variant="outline" onClick={handleUseInBuilder}>
                                    Continue in Builder
                                </Button>
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
                        {step < STEPS.length - 1 && (
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
