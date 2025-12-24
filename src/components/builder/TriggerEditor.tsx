'use client';

import { useState } from 'react';
import { useSkillStore } from '@/lib/store/skillStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export function TriggerEditor() {
    const { skill, addTrigger, removeTrigger } = useSkillStore();
    const [inputValue, setInputValue] = useState('');

    const handleAdd = () => {
        if (inputValue.trim()) {
            addTrigger(inputValue.trim());
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="e.g., create property listing"
                />
                <Button onClick={handleAdd} type="button">
                    Add
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                {skill.triggers.map((trigger, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                        {trigger}
                        <button
                            onClick={() => removeTrigger(index)}
                            className="ml-2 hover:text-destructive focus:outline-none"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    );
}
