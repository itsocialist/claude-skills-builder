'use client';

import { useState } from 'react';
import { useSkillStore } from '@/lib/store/skillStore';
import { Example } from '@/types/skill.types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Trash2, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function ExampleEditor() {
    const { skill, setSkill } = useSkillStore();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const addExample = () => {
        const newExample: Example = { input: '', output: '' };
        const currentExamples = skill.examples || [];
        setSkill({
            ...skill,
            examples: [...currentExamples, newExample]
        });
        setActiveIndex(currentExamples.length);
    };

    const updateExample = (index: number, field: keyof Example, value: string) => {
        const currentExamples = [...(skill.examples || [])];
        if (currentExamples[index]) {
            currentExamples[index] = { ...currentExamples[index], [field]: value };
            setSkill({ ...skill, examples: currentExamples });
        }
    };

    const removeExample = (index: number) => {
        const currentExamples = skill.examples || [];
        setSkill({
            ...skill,
            examples: currentExamples.filter((_, i) => i !== index)
        });
        if (activeIndex === index) setActiveIndex(null);
    };

    return (
        <div className="p-4 space-y-4 h-full flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-border flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-indigo-500/20">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-foreground">Few-Shot Examples</h4>
                        <p className="text-xs text-muted-foreground">Teach by example</p>
                    </div>
                </div>
                <Button size="sm" onClick={addExample} variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {skill.examples && skill.examples.length > 0 ? (
                    skill.examples.map((example, index) => (
                        <Card key={index} className="p-3 border border-border">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-muted-foreground">Example {index + 1}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive hover:bg-destructive/10"
                                    onClick={() => removeExample(index)}
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">User Input</label>
                                    <Textarea
                                        className="h-20 text-xs font-mono"
                                        placeholder="User says..."
                                        value={example.input}
                                        onChange={(e) => updateExample(index, 'input', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Model Response</label>
                                    <Textarea
                                        className="h-20 text-xs font-mono"
                                        placeholder="AI responds..."
                                        value={example.output}
                                        onChange={(e) => updateExample(index, 'output', e.target.value)}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-md bg-muted/30">
                        No examples defined. Add one to improve accuracy.
                    </div>
                )}
            </div>
        </div>
    );
}
