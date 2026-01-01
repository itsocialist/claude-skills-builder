'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Sparkles } from 'lucide-react';
import {
    slideUp,
    fadeReveal,
    fadeRevealChild,
    breathe,
    optionSelect,
    continueHint,
    cinematicReveal,
} from '@/lib/butler/flow-animations';
import { bundles } from '@/lib/constants/bundles';
import { FluentEmoji } from '@/components/ui/fluent-emoji';
import { FlowBackground, useAIRecommendations, TextScrollOptions, VisualOrbOptions } from '@/components/flow';
import { TypewriterText } from '@/components/ui/typewriter-text';

interface FlowButlerProps {
    onClose: () => void;
    onComplete: (preferences: UserPreferences) => void;
}

interface UserPreferences {
    role: string;
    goal: string;
    experience: number;
}

type FlowStep = 'welcome' | 'role' | 'goal' | 'experience' | 'reveal';

const ROLES = [
    { id: 'marketer', label: 'Marketer' },
    { id: 'developer', label: 'Developer' },
    { id: 'manager', label: 'Manager' },
    { id: 'creator', label: 'Creator' },
    { id: 'researcher', label: 'Researcher' },
    { id: 'other', label: 'Something else' },
];

const GOALS = [
    { id: 'content', label: 'Create content faster' },
    { id: 'research', label: 'Research & analyze' },
    { id: 'automate', label: 'Automate workflows' },
    { id: 'learn', label: 'Learn & explore AI' },
];

export function FlowButler({ onClose, onComplete }: FlowButlerProps) {
    const [step, setStep] = useState<FlowStep>('welcome');
    const [preferences, setPreferences] = useState<UserPreferences>({
        role: '',
        goal: '',
        experience: 50,
    });
    const { bundles: recommendations, getRecommendations } = useAIRecommendations();
    const [focusIndex, setFocusIndex] = useState(0);

    const steps: FlowStep[] = ['welcome', 'role', 'goal', 'experience', 'reveal'];
    const currentIndex = steps.indexOf(step);
    const progress = ((currentIndex + 1) / steps.length) * 100;

    // Get current options based on step
    const getCurrentOptions = () => {
        if (step === 'role') return ROLES;
        if (step === 'goal') return GOALS;
        return [];
    };

    const currentOptions = getCurrentOptions();
    const maxIndex = currentOptions.length - 1;

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Arrow navigation for selection steps
            if (step === 'role' || step === 'goal') {
                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    setFocusIndex(prev => Math.min(prev + 1, maxIndex));
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    setFocusIndex(prev => Math.max(prev - 1, 0));
                } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (currentOptions[focusIndex]) {
                        if (step === 'role') {
                            selectRole(currentOptions[focusIndex].id);
                        } else {
                            selectGoal(currentOptions[focusIndex].id);
                        }
                    }
                }
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNext();
            }

            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [step, focusIndex, maxIndex, currentOptions]);

    // Reset focus when step changes
    useEffect(() => {
        setFocusIndex(0);
    }, [step]);

    const handleNext = useCallback(async () => {
        if (step === 'welcome') {
            setStep('role');
        } else if (step === 'role' && preferences.role) {
            setStep('goal');
        } else if (step === 'goal' && preferences.goal) {
            setStep('experience');
        } else if (step === 'experience') {
            // Use AI hook for recommendations
            await getRecommendations(preferences);
            setStep('reveal');
        } else if (step === 'reveal') {
            onComplete(preferences);
        }
    }, [step, preferences, getRecommendations]);

    const selectRole = (roleId: string) => {
        setPreferences(p => ({ ...p, role: roleId }));
        setTimeout(() => setStep('goal'), 400);
    };

    const selectGoal = (goalId: string) => {
        setPreferences(p => ({ ...p, goal: goalId }));
        setTimeout(() => setStep('experience'), 400);
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-background overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Animated background with particles + glow that moves with steps */}
            <div className="absolute inset-0">
                <FlowBackground
                    stepIndex={currentIndex}
                    particleCount={60}
                    connectionDistance={120}
                    particleSpeed={0.3}
                    colorHue={17}
                    opacity={0.2}
                />
            </div>

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors z-10"
            >
                <X className="h-6 w-6" />
            </button>

            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-muted/30">
                <motion.div
                    className="h-full bg-primary origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: progress / 100 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
            </div>

            {/* Flow content */}
            <div className="flex items-center justify-center h-full px-6">
                <AnimatePresence mode="wait">
                    {step === 'welcome' && (
                        <FlowStepWelcome key="welcome" onNext={handleNext} />
                    )}
                    {step === 'role' && (
                        <FlowStepRole
                            key="role"
                            selected={preferences.role}
                            onSelect={selectRole}
                            focusIndex={focusIndex}
                            onFocusChange={setFocusIndex}
                        />
                    )}
                    {step === 'goal' && (
                        <FlowStepGoal
                            key="goal"
                            selected={preferences.goal}
                            onSelect={selectGoal}
                            focusIndex={focusIndex}
                            onFocusChange={setFocusIndex}
                        />
                    )}
                    {step === 'experience' && (
                        <FlowStepExperience
                            key="experience"
                            value={preferences.experience}
                            onChange={(v) => setPreferences(p => ({ ...p, experience: v }))}
                            onNext={handleNext}
                        />
                    )}
                    {step === 'reveal' && (
                        <FlowStepReveal
                            key="reveal"
                            recommendations={recommendations}
                            preferences={preferences}
                            onComplete={() => onComplete(preferences)}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Continue hint with separator */}
            {step !== 'reveal' && (
                <motion.div
                    className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center pointer-events-none"
                    variants={continueHint}
                    initial="initial"
                    animate="animate"
                >
                    {/* Light orange line separator */}
                    <div className="w-64 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mb-6" />

                    <div className="flex flex-col items-center text-muted-foreground/60">
                        <span className="text-xs tracking-widest uppercase font-medium mb-1">
                            Arrow keys to navigate <span className="mx-2 text-primary/40">•</span> Enter to select
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

// Step: Welcome
function FlowStepWelcome({ onNext }: { onNext: () => void }) {
    // Stagger timing for entrance animations (10% slower)
    const staggerDelay = 0.17;

    return (
        <motion.div
            className="text-center max-w-2xl px-4"
            variants={slideUp}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {/* Sparkle icon - entrance */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.66, ease: "easeOut", delay: staggerDelay * 0 }}
            >
                <motion.div variants={breathe} initial="initial" animate="animate">
                    <Sparkles className="h-16 w-16 text-primary mx-auto mb-8" />
                </motion.div>
            </motion.div>

            {/* Title line 1 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: staggerDelay * 1 }}
            >
                <h1 className="text-4xl md:text-6xl font-light text-foreground leading-tight">
                    Let's find your
                </h1>
            </motion.div>

            {/* Title line 2 - highlighted */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: staggerDelay * 2 }}
                className="mb-6"
            >
                <span className="text-4xl md:text-6xl text-primary font-medium">perfect skills</span>
            </motion.div>

            {/* Subtitle */}
            <motion.p
                className="text-xl text-muted-foreground mb-12"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: staggerDelay * 3 }}
            >
                A few quick questions to personalize your experience
            </motion.p>

            {/* Button - Orange glass style */}
            <motion.button
                onClick={onNext}
                className="px-6 py-3 rounded-md text-sm font-medium backdrop-blur-sm border bg-primary/85 text-primary-foreground border-primary/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_4px_12px_rgba(193,95,60,0.25)]"
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, ease: "easeOut", delay: staggerDelay * 4 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
            >
                Let's begin
            </motion.button>
        </motion.div>
    );
}

// Step: Role - uses TextScrollOptions (horizontal arc scroll)
function FlowStepRole({
    selected,
    onSelect,
}: {
    selected: string;
    onSelect: (id: string) => void;
    focusIndex: number;
    onFocusChange: (index: number) => void;
}) {
    const options = ROLES.map(r => ({ id: r.id, label: r.label }));

    return (
        <motion.div
            className="text-center max-w-4xl w-full"
            variants={slideUp}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <h1 className="text-3xl md:text-5xl font-light text-foreground mb-16 px-4">
                <TypewriterText
                    text="What's your superpower?"
                    highlightWord="superpower"
                    speed={35}
                />
            </h1>
            <TextScrollOptions
                options={options}
                selectedId={selected}
                onSelect={onSelect}
            />
        </motion.div>
    );
}

// Step: Goal - uses VisualOrbOptions (3D orbs with connections)
function FlowStepGoal({
    selected,
    onSelect,
}: {
    selected: string;
    onSelect: (id: string) => void;
    focusIndex: number;
    onFocusChange: (index: number) => void;
}) {
    const options = GOALS.map(g => ({ id: g.id, label: g.label }));

    return (
        <motion.div
            className="text-center max-w-4xl w-full"
            variants={slideUp}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <h1 className="text-3xl md:text-5xl font-light text-foreground mb-8 px-4">
                <TypewriterText
                    text="What would you love to accomplish?"
                    highlightWord="accomplish"
                    speed={30}
                />
            </h1>
            <VisualOrbOptions
                options={options}
                selectedId={selected}
                onSelect={onSelect}
            />
        </motion.div>
    );
}

// Step: Experience - uses TextScrollOptions
function FlowStepExperience({
    value,
    onChange,
    onNext,
}: {
    value: number;
    onChange: (v: number) => void;
    onNext: () => void;
}) {
    const options = [
        { id: 'novice', label: 'Just starting' },
        { id: 'intermediate', label: 'Some experience' },
        { id: 'expert', label: 'Power user' },
    ];

    const currentId = value < 33 ? 'novice' : value < 66 ? 'intermediate' : 'expert';

    const handleSelect = (id: string) => {
        const val = id === 'novice' ? 0 : id === 'intermediate' ? 50 : 100;
        onChange(val);
    };

    return (
        <motion.div
            className="text-center max-w-4xl w-full"
            variants={slideUp}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <h1 className="text-3xl md:text-5xl font-light text-foreground mb-16 px-4">
                <TypewriterText
                    text="How familiar are you with AI assistants?"
                    highlightWord="AI assistants"
                    speed={30}
                />
            </h1>

            <div className="mb-12">
                <TextScrollOptions
                    options={options}
                    selectedId={currentId}
                    onSelect={handleSelect}
                />
            </div>

            <motion.button
                onClick={onNext}
                className="px-8 py-4 rounded-full text-lg font-medium backdrop-blur-sm border bg-primary/85 text-primary-foreground border-primary/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_4px_12px_rgba(193,95,60,0.25)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Show me my skills
            </motion.button>
        </motion.div>
    );
}

// Step: Reveal
function FlowStepReveal({
    recommendations,
    preferences,
    onComplete,
}: {
    recommendations: typeof bundles;
    preferences: { role: string; goal: string; experience: number };
    onComplete: () => void;
}) {
    // Generate personalized journey narrative based on selections
    const getJourneyNarrative = () => {
        const exp = preferences.experience;
        const role = preferences.role;
        const goal = preferences.goal;

        // Thresholds match FlowStepExperience: 0=novice, 50=intermediate, 100=expert
        if (exp <= 25) {
            return {
                title: "Your learning path awaits",
                subtitle: `As a ${role}, we'll start you with guided, beginner-friendly skills.`,
                cta: "Begin your journey"
            };
        } else if (exp <= 75) {
            return {
                title: "Perfect match found",
                subtitle: `Ready to ${goal}? These bundles are tailored for experienced ${role}s.`,
                cta: "Get started with these"
            };
        } else {
            // exp > 75 (100 = Power user)
            return {
                title: "Power tools unlocked",
                subtitle: `Advanced ${goal} workflows for expert ${role}s. Full access to all features.`,
                cta: "Launch your workflow"
            };
        }
    };

    const narrative = getJourneyNarrative();

    return (
        <motion.div
            className="text-center max-w-4xl w-full"
            variants={cinematicReveal}
            initial="initial"
            animate="animate"
        >
            <motion.div
                variants={breathe}
                initial="initial"
                animate="animate"
            >
                <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-light text-foreground mb-4 px-4">
                {narrative.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
                {narrative.subtitle}
            </p>

            {/* Journey Overview */}
            <motion.div
                className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10 text-left"
                variants={fadeReveal}
                initial="initial"
                animate="animate"
            >
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">Your Journey</h3>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-muted-foreground">Pick a bundle</span>
                    </div>
                    <div className="h-px flex-1 bg-white/10" />
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-white/30" />
                        <span className="text-muted-foreground">Learn & customize</span>
                    </div>
                    <div className="h-px flex-1 bg-white/10" />
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-white/30" />
                        <span className="text-muted-foreground">Download & use</span>
                    </div>
                </div>
            </motion.div>

            <motion.div
                className="grid md:grid-cols-2 gap-6 mb-12"
                variants={fadeReveal}
                initial="initial"
                animate="animate"
            >
                {recommendations.map((bundle, i) => (
                    <motion.div
                        key={bundle.id}
                        className="p-6 rounded-2xl border border-primary/20 bg-card/40 backdrop-blur-md text-left transition-all hover:bg-card/60 hover:border-primary/40 shadow-lg hover:shadow-primary/10"
                        variants={fadeRevealChild}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${bundle.color} flex items-center justify-center shadow-inner`}>
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-foreground">{bundle.name}</h3>
                                <p className="text-sm text-muted-foreground">{bundle.skills.length} skills</p>
                            </div>
                        </div>
                        <p className="text-muted-foreground/80 leading-relaxed">{bundle.tagline}</p>
                    </motion.div>
                ))}
            </motion.div>

            <motion.button
                onClick={onComplete}
                className="px-8 py-4 rounded-full text-lg font-medium backdrop-blur-sm border bg-primary/85 text-primary-foreground border-primary/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2),0_4px_12px_rgba(193,95,60,0.25)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                {narrative.cta}
            </motion.button>
        </motion.div>
    );
}
