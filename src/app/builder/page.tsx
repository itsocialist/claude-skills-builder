'use client';

import { useState } from 'react';
import { useSkillStore } from '@/lib/store/skillStore';
import { generateSkillZip } from '@/lib/utils/skill-generator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { TriggerEditor } from '@/components/builder/TriggerEditor';
import { InstructionsEditor } from '@/components/builder/InstructionsEditor';

export default function BuilderPage() {
    const { skill, updateField, reset } = useSkillStore();
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const blob = await generateSkillZip(skill);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${skill.name.toLowerCase().replace(/\s+/g, '-')}.zip`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Generation failed:', error);
            alert('Failed to generate skill. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-primary-500">Create New Skill</h1>

            {/* Basic Information */}
            <Card className="mb-6 p-6">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Skill Name *
                        </label>
                        <Input
                            value={skill.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            placeholder="e.g., Property Listing Generator"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Description
                        </label>
                        <Textarea
                            value={skill.description}
                            onChange={(e) => updateField('description', e.target.value)}
                            placeholder="What does this skill do?"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Category
                        </label>
                        <Input
                            value={skill.category}
                            onChange={(e) => updateField('category', e.target.value)}
                            placeholder="e.g., Real Estate, Legal, Finance"
                        />
                    </div>
                </div>
            </Card>

            {/* Triggers */}
            <Card className="mb-6 p-6">
                <h2 className="text-xl font-semibold mb-4">Skill Triggers</h2>
                <p className="text-sm text-gray-600 mb-4">
                    When should this skill activate?
                </p>
                <TriggerEditor />
            </Card>

            {/* Instructions */}
            <Card className="mb-6 p-6">
                <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                <InstructionsEditor />
            </Card>

            {/* Actions */}
            <div className="flex justify-between">
                <Button variant="outline" onClick={reset}>
                    Reset
                </Button>
                <div className="space-x-4">
                    <Button variant="outline">
                        Save Draft
                    </Button>
                    <Button
                        onClick={handleGenerate}
                        disabled={!skill.name || !skill.instructions || isGenerating}
                        className="bg-primary-500 hover:bg-primary-600"
                    >
                        {isGenerating ? 'Generating...' : 'Generate Skill'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
