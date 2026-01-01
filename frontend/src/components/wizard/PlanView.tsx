'use client';

import { motion } from 'framer-motion';
import { LessonPlan } from '@/lib/ai/lesson-planner';
import { Sparkles, ArrowRight, BookOpen, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlanViewProps {
    plan: LessonPlan;
    onStart: (moduleIndex: number) => void;
    onExit?: () => void;
}

export function PlanView({ plan, onStart, onExit }: PlanViewProps) {
    return (
        <div className="flex flex-col h-full items-center justify-center max-w-4xl mx-auto text-center">

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12 w-full"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium tracking-wide">AI SYLLABUS GENERATED</span>
                </div>

                {/* YAML Card Style */}
                <div className="text-left bg-black/40 border border-white/10 rounded-lg p-6 font-mono text-sm text-white/70 shadow-inner max-w-2xl mx-auto relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-30 group-hover:opacity-100 transition-opacity">
                        <div className="text-[10px] border border-white/20 rounded px-1">YAML</div>
                    </div>
                    <div className="space-y-1">
                        <div><span className="text-purple-400">plan_id:</span> <span className="text-white">"{plan.id}"</span></div>
                        <div><span className="text-purple-400">target_role:</span> <span className="text-green-400">"{plan.role}"</span></div>
                        <div><span className="text-purple-400">focus_area:</span> <span className="text-green-400">"{plan.goal}"</span></div>
                        <div><span className="text-purple-400">modules:</span> <span className="text-blue-400">[{plan.modules.length}]</span></div>
                        <div className="pt-2 text-white/40"># {plan.description}</div>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-light text-white mt-8 mb-4 leading-tight">
                    Path: <span className="font-medium text-white">{plan.title}</span>
                </h1>
            </motion.div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-12 text-left">
                {plan.modules.map((module, index) => (
                    <motion.div
                        key={module.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="group relative p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer h-full flex flex-col"
                        onClick={() => onStart(index)}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div className="text-xs font-mono text-white/30">MODULE_0{index + 1}</div>
                            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-colors -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
                        </div>

                        <h3 className="text-lg font-medium text-white mb-2 group-hover:text-primary transition-colors">
                            {module.title}
                        </h3>
                        <p className="text-sm text-white/50 leading-relaxed">
                            {module.description}
                        </p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col gap-4 items-center w-full max-w-xs"
            >
                <Button
                    size="lg"
                    className="w-full h-14 text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_30px_-5px_rgba(var(--primary-rgb),0.5)]"
                    onClick={() => onStart(0)}
                >
                    Initialize Module 01
                </Button>

                {onExit && (
                    <button
                        onClick={onExit}
                        className="text-sm text-white/30 hover:text-white transition-colors uppercase tracking-widest text-[10px]"
                    >
                        Return to Flow
                    </button>
                )}
            </motion.div>

        </div>
    );
}
