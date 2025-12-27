'use client';

import { useState } from 'react';
import { useSkillStore } from '@/lib/store/skillStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Plus, X } from 'lucide-react';

export function TriggerEditor() {
    const { skill, setSkill } = useSkillStore();
    const [newTrigger, setNewTrigger] = useState('');

    const addTrigger = () => {
        if (!newTrigger.trim()) return;

        const currentTriggers = skill.triggers || [];
        if (currentTriggers.includes(newTrigger.trim())) return;

        setSkill({
            ...skill,
            triggers: [...currentTriggers, newTrigger.trim()]
        });
        setNewTrigger('');
    };

    const removeTrigger = (index: number) => {
        const currentTriggers = skill.triggers || [];
        setSkill({
            ...skill,
            triggers: currentTriggers.filter((_, i) => i !== index)
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTrigger();
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
                <div className="p-2 rounded bg-primary/20">
                    <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                    <h4 className="font-semibold text-foreground">Activation Triggers</h4>
                    <p className="text-xs text-muted-foreground">When should this skill activate?</p>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex gap-2">
                    <Input
                        placeholder="Add a trigger phrase..."
                        value={newTrigger}
                        onChange={(e) => setNewTrigger(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1"
                    />
                    <Button size="icon" onClick={addTrigger} disabled={!newTrigger.trim()}>
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="space-y-2 mt-4">
                    {skill.triggers?.map((trigger, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-muted rounded-md group">
                            <span className="text-sm font-medium">"{trigger}"</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeTrigger(i)}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    )) || (
                            <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-md">
                                No triggers defined yet.
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}
