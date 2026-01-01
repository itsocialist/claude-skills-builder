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
    Lightbulb, MessageSquare, FileText, Paperclip, Sparkles, Hammer,
    Plus, X, Loader2
} from 'lucide-react';
import { FlowInput } from '@/components/flow/inputs/FlowInput';
import { FlowTextarea } from '@/components/flow/inputs/FlowTextarea';
import { FlowProgressOverview } from '@/components/flow/overview/FlowProgressOverview';
import { FlowBackground, FlowTransition, FlowButlerOverlay } from '@/components/flow';
import { Button } from '@/components/ui/button';

// --- Constants ---
// minExperience: 0-100, steps with higher values are skipped for beginners
const ALL_STEPS = [
    {
        id: 'what',
        title: 'What',
        icon: Lightbulb,
        question: 'Define the Identity',
        help: 'All skills start with a clear name and purpose. This tells Claude what "hat" to wear.',
        minExperience: 0, // Always shown
    },
    {
        id: 'when',
        title: 'When',
        icon: MessageSquare,
        question: 'Set the Triggers',
        help: 'Triggers are the "wake words" for your skill. What should the user say to activate this?',
        minExperience: 50, // Skip for beginners
    },
    {
        id: 'how',
        title: 'How',
        icon: FileText,
        question: 'Teach the Behavior',
        help: 'This is the brain of the skill. Provide step-by-step instructions on how to process the request.',
        minExperience: 0, // Always shown
    },
    {
        id: 'files',
        title: 'Files',
        icon: Paperclip,
        question: 'Add Context',
        help: 'Upload templates, examples, or data files that Claude needs to do the job right.',
        minExperience: 75, // Advanced only
    },
];

// Filter steps based on user experience (0-100)
function getVisibleSteps(experience: number = 50) {
    return ALL_STEPS.filter(step => step.minExperience <= experience);
}

// Default to showing all steps for now (can be updated based on lessonPlan experience)
const STEPS = ALL_STEPS;

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
    const [userExperience, setUserExperience] = useState(100); // Default to full wizard
    const lastPathnameRef = useRef<string | null>(null);

    // Dynamic steps based on user experience (beginners see fewer steps)
    const visibleSteps = getVisibleSteps(userExperience);

    // Wizard progress steps for the overview
    const wizardSteps = visibleSteps.map((s, i) => ({
        id: s.id,
        label: s.title,
        isCompleted: step > i,
        isActive: step === i,
    }));

    // 1. Initial Load & Logic
    useEffect(() => {
        const role = searchParams.get('role');
        const goal = searchParams.get('goal');
        const experience = searchParams.get('experience');

        // If we have Flow params, enter "AI Mode"
        if (role && goal) {
            const expValue = parseInt(experience || '50');
            setUserExperience(expValue);
            setMode('analyzing');

            // Artificial delay for "Manifesting"
            generateLessonPlan(role, goal, expValue)
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

        const chunkSize = 2; // Type 2 chars at a time for speed

        let initialText = '';
        if (field === 'triggerInput') {
            // For triggers, we usually replace or it's a new tag, but here we are typing into the input
            initialText = triggerInput;
        } else {
            initialText = (skill[field as keyof typeof skill] as string) || '';
        }

        // If we are "completing", we append. 
        // Logic: If the field is not empty, we append a space if needed (unless it's a newline)
        let needsSpace = initialText.length > 0 && !initialText.endsWith(' ') && !initialText.endsWith('\n') && !text.startsWith(' ') && !text.startsWith('\n');

        let typedSoFar = '';

        for (let i = 0; i < text.length; i += chunkSize) {
            typedSoFar += text.slice(i, i + chunkSize);

            const nextValue = initialText + (needsSpace ? ' ' : '') + typedSoFar;

            if (field === 'triggerInput') {
                setTriggerInput(nextValue);
            } else {
                updateField(field as any, nextValue);
            }

            // Random delay for realism
            await new Promise(r => setTimeout(r, 10 + Math.random() * 10));
        }

        setIsTyping(false);
    };

    const handleAIAssist = async () => {
        if (isTyping) return;

        // If we have a lesson plan, use it as a base, but don't overwrite if user has typed something unique
        // unless it matches the start of the template
        let textToType = '';
        let targetField: any = '';

        if (step === 0) { // Description
            targetField = 'description';
            const currentDesc = skill.description;
            const templateDesc = lessonPlan?.modules[0]?.skillTemplate.description || '';
            const skillName = skill.name || 'this skill';

            // Simple heuristic generation if no plan or to "complete" the thought
            if (currentDesc && !templateDesc.startsWith(currentDesc)) {
                // User has typed something custom - "generate the rest"
                const completions = [
                    ` allowing users to streamline their workflow and save time.`,
                    ` with a focus on accuracy and tone.`,
                    ` suitable for both beginners and experts.`
                ];
                textToType = completions[Math.floor(Math.random() * completions.length)];
            } else {
                // Use template or generate new base
                textToType = templateDesc || `A comprehensive assistant for ${skillName}, designed to help users achieve their goals efficiently.`;

                // If we already have this text, don't repeat it
                if (currentDesc === textToType) return;
            }
        } else if (step === 1) { // Triggers
            targetField = 'triggerInput';
            const templateTriggers = lessonPlan?.modules[0]?.skillTemplate.triggers || [];
            // filter out existing
            const available = templateTriggers.filter(t => !skill.triggers.includes(t));
            if (available.length > 0) {
                textToType = available[0];
            } else {
                textToType = `Help me with ${skill.name}`;
            }
        } else if (step === 2) { // Instructions
            targetField = 'instructions';
            const currentInst = skill.instructions;
            // For instructions, we usually append or fill if empty
            if (!currentInst) {
                textToType = lessonPlan?.modules[0]?.skillTemplate.instructions ||
                    `Role: expert ${skill.name} assistant.\n\nTask:\n1. Analyze the user's request.\n2. Provide step-by-step guidance.`;
            } else {
                textToType = `\n\n3. Ensure the output is formatted clearly.\n4. Ask for clarification if needed.`;
            }
        }

        if (textToType) {
            await simulateTyping(textToType, targetField);
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

    const handleExitWizard = () => {
        if (skill.name && !confirm('Are you sure you want to exit? Your progress may be lost.')) {
            return;
        }
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

            // Advance to "Installation Guide" step (Step 4)
            setStep(4);
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

    const currentStep = visibleSteps[step] || visibleSteps[visibleSteps.length - 1];
    const isLastStep = step === visibleSteps.length - 1;

    // --- Render: Analyzing State ---
    if (mode === 'analyzing') {
        return (
            <FlowButlerOverlay stage="analyze">
                <FlowBackground stepIndex={step} />
                <div className="flex flex-col items-center justify-center min-h-screen relative z-10">
                    <div className="w-full max-w-md text-center">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl font-light text-white mb-2">Manifesting your path...</h2>
                        <p className="text-white/50">Analyzing compatibility profiles</p>
                    </div>
                </div>
            </FlowButlerOverlay>
        );
    }

    // --- Render: Plan View ---
    if (mode === 'plan' && lessonPlan) {
        return (
            <FlowButlerOverlay stage="plan">
                <FlowBackground stepIndex={step} />
                <div className="container mx-auto px-4 py-8 relative z-10">
                    <GlassTerminal title="LESSON_PLAN_RECEIVED">
                        <PlanView plan={lessonPlan} onStart={handleStartLesson} onExit={handleExitPlan} />
                    </GlassTerminal>
                </div>
            </FlowButlerOverlay>
        );
    }

    const AIButton = ({ onClick }: { onClick: () => void }) => (
        <Button
            onClick={onClick}
            disabled={isTyping}
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-8 px-3 text-primary/80 hover:text-primary hover:bg-primary/10 transition-all hover:scale-105 active:scale-95"
        >
            {isTyping ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <div className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> <span className="font-medium">Auto-Generate</span></div>}
        </Button>
    );

    // --- Render: Wizard View ---
    return (
        <FlowButlerOverlay stage="wizard" message={currentStep?.help}>
            <FlowBackground stepIndex={step} />
            <div className="container mx-auto px-4 py-8 relative z-10">
                <GlassTerminal
                    title={step >= visibleSteps.length ? "INSTALLATION_GUIDE" : `STEP_${step + 1}_OF_${visibleSteps.length}`}
                >
                    {/* Progress */}
                    {step < visibleSteps.length && (
                        <div className="flex items-center justify-center mb-12 gap-1">
                            {visibleSteps.map((s, i) => {
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
                                        {i < visibleSteps.length - 1 && (
                                            <div className={`w-12 h-px mx-2 transition-colors duration-300 ${isCompleted ? 'bg-primary' : 'bg-white/10'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex-grow flex flex-col"
                        >
                            <h2 className="text-3xl font-light text-white mb-8 text-center">{step === 4 ? "Congratulations!" : currentStep?.question}</h2>

                            {/* Step 1: What */}
                            {step === 0 && (
                                <div className="space-y-8">
                                    <FlowInput
                                        label="Skill Name"
                                        placeholder="e.g. Property Listing Generator"
                                        value={skill.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        required
                                        description="Give your new skill a memorable name."
                                    />
                                    <div className="relative">
                                        <FlowTextarea
                                            label="Description"
                                            placeholder="What is the primary purpose of this skill?"
                                            value={skill.description}
                                            onChange={(e) => updateField('description', e.target.value)}
                                            required
                                            className="min-h-[140px] pr-36"
                                            description="Describe what this skill does in a few sentences."
                                        />
                                        <div className="absolute right-4 top-4">
                                            <AIButton onClick={handleAIAssist} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: When */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="relative">
                                        <FlowTextarea
                                            label="Add Trigger"
                                            placeholder="Type a trigger phrase..."
                                            value={triggerInput}
                                            onChange={(e) => setTriggerInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleAddTrigger();
                                                }
                                            }}
                                            minHeight="min-h-[80px]"
                                            description="Press Enter to add multiple triggers."
                                        />
                                        <div className="absolute right-4 top-4 flex gap-2">
                                            <Button
                                                onClick={handleAIAssist}
                                                disabled={isTyping}
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-primary/80 hover:text-primary hover:bg-primary/10 hover:scale-110 transition-all"
                                            >
                                                <Sparkles className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <Button onClick={handleAddTrigger} disabled={!triggerInput.trim()} size="icon" className="h-12 w-12 bg-white/10 hover:bg-white/20">
                                        <Plus className="h-5 w-5" />
                                    </Button>


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
                                        <FlowTextarea
                                            label="Instructions"
                                            placeholder="Detailed instructions for Claude..."
                                            value={skill.instructions}
                                            onChange={(e) => updateField('instructions', e.target.value)}
                                            className="min-h-[300px] font-mono text-sm leading-relaxed"
                                            description="How should the AI behave? Be specific."
                                        />
                                        <div className="absolute right-4 top-4">
                                            <AIButton onClick={handleAIAssist} />
                                        </div>
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
                                                <Hammer className="h-4 w-4 mr-2" />
                                                Open in Builder
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Installation Guide (Post-Download) */}
                            {step === 4 && (
                                <InstallationGuide onExit={handleExitWizard} />
                            )}

                            {/* Navigation */}
                            {step < 3 && (
                                <div className="flex justify-between mt-auto pt-12">
                                    <Button
                                        variant="ghost"
                                        onClick={() => step > 0 ? setStep(step - 1) : handleExitWizard()}
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
                </GlassTerminal >

                {/* Floating Overview - Positioned relative to container but fixed on screen via component styles */}
                {
                    step < 4 && (
                        <FlowProgressOverview steps={wizardSteps} currentStepIndex={step} />
                    )
                }
            </div>
        </FlowButlerOverlay>
    );
}

// Separate component for Installation Guide to keep main render clean
const InstallationGuide = ({ onExit }: { onExit: () => void }) => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="bg-white/10 rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                Download Complete!
            </h3>
            <p className="text-white/70 mb-4">
                Your skill has been packaged. Follow these steps to install it in Claude:
            </p>
            <ol className="list-decimal list-inside text-white/80 space-y-3 ml-2">
                <li>Check your downloads folder for the ZIP file.</li>
                <li>Extract the ZIP file to a folder on your computer.</li>
                <li>Open the <span className="font-mono bg-white/10 px-1 rounded text-sm">README.md</span> file inside for specific instructions.</li>
                <li>Open your Claude Desktop config (Settings {'>'} Developer {'>'} Edit Config).</li>
                <li>Add the configuration snippet from the README.</li>
            </ol>
        </div>

        <div className="flex justify-center pt-8">
            <Button onClick={onExit} size="lg" className="bg-white text-black hover:bg-white/90">
                Return to Flow
            </Button>
        </div>
    </div>
);

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
