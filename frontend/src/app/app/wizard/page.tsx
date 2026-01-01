'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { GlassTerminal } from '@/components/wizard/GlassTerminal';
import { PlanView } from '@/components/wizard/PlanView';
import { generateLessonPlan, LessonPlan } from '@/lib/ai/lesson-planner';
import { useSkillStore } from '@/lib/store/skillStore';
import { generateSkillZip } from '@/lib/utils/skill-generator';
import { SkillSnippets } from '@/components/builder/SkillSnippets';
import { ResourceManager } from '@/components/builder/ResourceManager';
import { motion } from 'framer-motion';
import {
    Check, ChevronLeft, ChevronRight, Download,
    Lightbulb, MessageSquare, FileText, Paperclip, Rocket,
    Plus, X, Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

// --- Constants ---
const STEPS = [
    {
        id: 'what',
        title: 'What',
        icon: Lightbulb,
        question: 'Define the Identity',
        help: 'All skills start with a clear name and purpose. This tells Claude what "hat" to wear.'
    },
    {
        id: 'when',
        title: 'When',
        icon: MessageSquare,
        question: 'Set the Triggers',
        help: 'Triggers are the "wake words" for your skill. What should the user say to activate this?'
    },
    {
        id: 'how',
        title: 'How',
        icon: FileText,
        question: 'Teach the Behavior',
        help: 'This is the brain of the skill. Provide step-by-step instructions on how to process the request.'
    },
    {
        id: 'files',
        title: 'Files',
        icon: Paperclip,
        question: 'Add Context',
        help: 'Upload templates, examples, or data files that Claude needs to do the job right.'
    },
];

const TRIGGER_EXAMPLES = [
    'Create a property listing for...',
    'Analyze this document...',
    'Draft an email to...',
    'Generate a report on...',
];

type WizardMode = 'analyzing' | 'plan' | 'wizard';

function WizardContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { skill, updateField, addTrigger, removeTrigger, addResource, removeResource, reset, setSkill } = useSkillStore();

    // State
    const [mode, setMode] = useState<WizardMode>('wizard'); // Default to wizard if no params
    const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null);
    const [step, setStep] = useState(0);
    const [triggerInput, setTriggerInput] = useState('');
    const lastPathnameRef = useRef<string | null>(null);

    // 1. Initial Load & Logic
    useEffect(() => {
        const role = searchParams.get('role');
        const goal = searchParams.get('goal');
        const experience = searchParams.get('experience');

        // If we have Flow params, enter "AI Mode"
        if (role && goal) {
            setMode('analyzing');

            // Artificial delay for "Manifesting"
            generateLessonPlan(role, goal, parseInt(experience || '50'))
                .then(plan => {
                    setLessonPlan(plan);
                    setMode('plan');
                });
        }

        // Reset store on new navigation
        if (lastPathnameRef.current !== pathname) {
            lastPathnameRef.current = pathname;
            if (!role) reset(); // Only full reset if not coming from flow (manual nav)
        }
    }, [searchParams, pathname, reset]);

    // AI Typing Logic
    const [isTyping, setIsTyping] = useState(false);

    const simulateTyping = async (text: string, field: keyof typeof skill | 'triggerInput') => {
        if (isTyping || !text) return;
        setIsTyping(true);

        let currentText = '';
        const chunkSize = 2; // Type 2 chars at a time for speed

        // Clear field first
        if (field === 'triggerInput') setTriggerInput('');
        else updateField(field as any, '');

        for (let i = 0; i < text.length; i += chunkSize) {
            currentText += text.slice(i, i + chunkSize);

            if (field === 'triggerInput') {
                setTriggerInput(currentText);
            } else {
                updateField(field as any, currentText);
            }

            // Random delay for realism
            await new Promise(r => setTimeout(r, 10 + Math.random() * 10));
        }

        setIsTyping(false);
    };

    const handleAIAssist = async () => {
        if (!lessonPlan || isTyping) return;
        const module = lessonPlan.modules[0]; // Assuming single module for now

        switch (step) {
            case 0: // Description
                await simulateTyping(module.skillTemplate.description, 'description');
                break;
            case 1: // Triggers
                if (module.skillTemplate.triggers.length > 0) {
                    await simulateTyping(module.skillTemplate.triggers[0], 'triggerInput');
                }
                break;
            case 2: // Instructions
                await simulateTyping(module.skillTemplate.instructions, 'instructions');
                break;
        }
    };

    const handleStartLesson = (moduleIndex: number) => {
        if (!lessonPlan) return;

        const module = lessonPlan.modules[moduleIndex];

        // Only set Name, let the user "Generate" the rest
        setSkill({
            ...skill,
            name: module.skillTemplate.name,
            description: '', // Clear for AI Assist
            triggers: [],    // Clear for AI Assist
            instructions: '' // Clear for AI Assist
        });

        // Transition to wizard
        setMode('wizard');
        setStep(0);
    };

    const handleExitPlan = () => {
        router.push('/app/flow');
    };

    const handleSkipUpload = () => {
        handleDownload();
    };

    // --- Wizard Handlers ---
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
        router.push('/app/builder');
    };

    const canProceed = () => {
        switch (step) {
            case 0: return !!(skill.name && skill.description);
            case 1: return skill.triggers.length > 0;
            default: return true;
        }
    };

    const currentStep = STEPS[step];
    const isLastStep = step === STEPS.length - 1;

    // --- Render: Analyzing State ---
    if (mode === 'analyzing') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-full max-w-md text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
                    <h2 className="text-2xl font-light text-white mb-2">Manifesting your path...</h2>
                    <p className="text-white/50">Analyzing compatibility profiles</p>
                </div>
            </div>
        );
    }

    // --- Render: Plan View ---
    if (mode === 'plan' && lessonPlan) {
        return (
            <div className="container mx-auto px-4 py-8">
                <GlassTerminal title="LESSON_PLAN_RECEIVED" helpText="Select a module to begin your guided implementation.">
                    <PlanView plan={lessonPlan} onStart={handleStartLesson} onExit={handleExitPlan} />
                </GlassTerminal>
            </div>
        );
    }

    const AIButton = ({ onClick }: { onClick: () => void }) => (
        <Button
            onClick={onClick}
            disabled={isTyping}
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-8 px-3 text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 transition-colors"
        >
            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="flex items-center gap-2"><Rocket className="w-4 h-4" /> <span>Auto-Generate</span></div>}
        </Button>
    );

    // --- Render: Wizard View ---
    return (
        <div className="container mx-auto px-4 py-8">
            <GlassTerminal
                title={`STEP_${step + 1}_OF_${STEPS.length}`}
                helpText={currentStep.help}
            >
                {/* Progress */}
                <div className="flex items-center justify-center mb-12 gap-1">
                    {STEPS.map((s, i) => {
                        const Icon = s.icon;
                        const isActive = i === step;
                        const isCompleted = i < step;

                        return (
                            <div key={s.id} className="flex items-center">
                                <div
                                    className={`
                                        flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                                        ${isCompleted ? 'bg-primary text-primary-foreground' : ''}
                                        ${isActive ? 'bg-primary/20 text-primary ring-2 ring-primary ring-offset-2 ring-offset-black' : ''}
                                        ${!isActive && !isCompleted ? 'bg-white/5 text-white/30' : ''}
                                    `}
                                >
                                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={`w-12 h-px mx-2 transition-colors duration-300 ${isCompleted ? 'bg-primary' : 'bg-white/10'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex-grow flex flex-col"
                    >
                        <h2 className="text-3xl font-light text-white mb-8 text-center">{currentStep.question}</h2>

                        {/* Step 1: What */}
                        {step === 0 && (
                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-medium text-white/60 mb-2 block uppercase tracking-wider">Skill Name</label>
                                    <Input
                                        value={skill.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="e.g. Property Listing Generator"
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="text-sm font-medium text-white/60 mb-2 block uppercase tracking-wider">Description</label>
                                    <AIButton onClick={handleAIAssist} />
                                    <Textarea
                                        value={skill.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        placeholder="What is the primary purpose of this skill?"
                                        rows={6}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 resize-none"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: When */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="flex gap-2 relative">
                                    <Input
                                        value={triggerInput}
                                        onChange={(e) => setTriggerInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddTrigger()}
                                        placeholder="Type a trigger phrase..."
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 h-12 pr-32"
                                    />
                                    <div className="absolute right-14 top-2">
                                        <Button
                                            onClick={handleAIAssist}
                                            disabled={isTyping}
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-purple-400 hover:text-purple-300 hover:bg-purple-400/10"
                                        >
                                            <Rocket className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <Button onClick={handleAddTrigger} disabled={!triggerInput.trim()} size="icon" className="h-12 w-12 bg-white/10 hover:bg-white/20">
                                        <Plus className="h-5 w-5" />
                                    </Button>
                                </div>

                                {skill.triggers.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {skill.triggers.map((trigger, i) => (
                                            <span key={i} className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm">
                                                {trigger}
                                                <button onClick={() => removeTrigger(i)} className="ml-2 hover:text-white">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-white/30 text-center py-8 italic border border-dashed border-white/10 rounded-lg">
                                        No triggers added yet. Try: "{TRIGGER_EXAMPLES[0]}"
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 3: How */}
                        {step === 2 && (
                            <div className="space-y-6 relative">
                                <SkillSnippets onInsert={handleInsertSnippet} />
                                <div className="relative">
                                    <AIButton onClick={handleAIAssist} />
                                    <Textarea
                                        value={skill.instructions}
                                        onChange={(e) => updateField('instructions', e.target.value)}
                                        placeholder="Instructions for Claude..."
                                        rows={12}
                                        className="bg-white/5 border-white/10 text-white placeholder:text-white/20 font-mono text-sm leading-relaxed pt-12"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Files */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <ResourceManager
                                    resources={skill.resources || []}
                                    onAdd={(resource) => addResource(resource)}
                                    onRemove={(id) => removeResource(id)}
                                />

                                <div className="pt-8 mt-8 border-t border-white/10 flex flex-col gap-3">
                                    <Button onClick={handleDownload} size="lg" className="h-14 w-full bg-primary hover:bg-primary/90 text-lg shadow-lg shadow-primary/20">
                                        <Download className="h-5 w-5 mr-3" />
                                        Complete & Download
                                    </Button>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" onClick={handleSkipUpload} className="h-12 border-white/10 text-white/70 hover:bg-white/5 hover:text-white">
                                            Skip Upload
                                        </Button>
                                        <Button variant="outline" onClick={handleContinueInBuilder} className="h-12 border-white/10 text-white hover:bg-white/5">
                                            <Rocket className="h-4 w-4 mr-2" />
                                            Open in Builder
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        {step < 3 && (
                            <div className="flex justify-between mt-auto pt-12">
                                <Button
                                    variant="ghost"
                                    onClick={() => step > 0 ? setStep(step - 1) : router.push('/app/flow')}
                                    className="text-white/50 hover:text-white hover:bg-white/5"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    {step === 0 ? 'Exit' : 'Back'}
                                </Button>

                                <Button
                                    onClick={() => setStep(step + 1)}
                                    disabled={!canProceed()}
                                    className="bg-white text-black hover:bg-white/90 px-8"
                                >
                                    Next Step
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </div>
            </GlassTerminal>
        </div>
    );
}

export default function WizardPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-full max-w-md text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
                    <p className="text-white/50">Loading Wizard...</p>
                </div>
            </div>
        }>
            <WizardContent />
        </Suspense>
    );
}
