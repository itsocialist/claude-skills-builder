'use client';

import { useSkillStore } from '@/lib/store/skillStore';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

export function InstructionEditor() {
    const { skill, setSkill } = useSkillStore();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSkill({
            ...skill,
            instructions: e.target.value
        });
    };

    return (
        <div className="p-4 space-y-4 h-full flex flex-col">
            <div className="flex items-center gap-2 pb-2 border-b border-border flex-shrink-0">
                <div className="p-2 rounded bg-green-500/20">
                    <FileText className="w-5 h-5 text-green-500" />
                </div>
                <div>
                    <h4 className="font-semibold text-foreground">Instructions</h4>
                    <p className="text-xs text-muted-foreground">What should the model do?</p>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <Textarea
                    placeholder="Enter detailed instructions for the model..."
                    value={skill.instructions || ''}
                    onChange={handleChange}
                    className="h-full min-h-[300px] font-mono text-sm resize-none"
                />
            </div>
        </div>
    );
}
