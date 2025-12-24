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
import { Shell } from '@/components/layout/Shell';

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

    const InspectorPanel = (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Configuration</h3>
                <Card className="p-4 bg-gray-50 border-gray-100 shadow-none space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Category</label>
                        <Input
                            value={skill.category}
                            onChange={(e) => updateField('category', e.target.value)}
                            placeholder="e.g. Finance"
                            className="bg-white"
                        />
                    </div>
                </Card>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Triggers</h3>
                <Card className="p-4 bg-gray-50 border-gray-100 shadow-none">
                    <TriggerEditor />
                </Card>
            </div>

            <div className="pt-6 border-t border-gray-100">
                <Button
                    onClick={handleGenerate}
                    disabled={!skill.name || !skill.instructions || isGenerating}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-6 text-lg shadow-lg shadow-primary/20"
                >
                    {isGenerating ? 'Generating...' : 'Generate Skill'}
                </Button>
                <Button variant="ghost" onClick={reset} className="w-full mt-2 text-gray-500 hover:text-gray-700">
                    Reset Form
                </Button>
            </div>
        </div>
    );

    return (
        <Shell inspector={InspectorPanel}>
            <div className="max-w-3xl">
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-gray-500 uppercase tracking-wide">Skill Name</label>
                    <Input
                        value={skill.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Name your skill..."
                        className="text-3xl font-bold border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-gray-300 h-auto"
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium mb-2 text-gray-500 uppercase tracking-wide">Description</label>
                    <Textarea
                        value={skill.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        placeholder="Describe what this skill does..."
                        className="resize-none border-gray-200 focus-visible:ring-primary/20 min-h-[100px] text-lg"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide">Instructions</label>
                        <div className="text-xs text-gray-400">Markdown Supported</div>
                    </div>
                    <InstructionsEditor />
                </div>
            </div>
        </Shell>
    );
}
