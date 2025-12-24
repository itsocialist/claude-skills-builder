'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSkillStore } from '@/lib/store/skillStore';
import { generateSkillZip } from '@/lib/utils/skill-generator';
import { getTemplateById } from '@/lib/templates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { TriggerEditor } from '@/components/builder/TriggerEditor';
import { InstructionsEditor } from '@/components/builder/InstructionsEditor';
import { SkillPreview } from '@/components/builder/SkillPreview';
import { ResourceManager } from '@/components/builder/ResourceManager';
import { ApiKeySettings } from '@/components/builder/ApiKeySettings';
import { TriggerTester } from '@/components/builder/TriggerTester';
import { OutputPreview } from '@/components/builder/OutputPreview';
import { Shell } from '@/components/layout/Shell';
import { validateSkill, getValidationStatus } from '@/lib/utils/validation';
import { useAuth } from '@/components/auth/AuthProvider';
import { saveSkill, getSkillById, updateSkill } from '@/lib/api/skillsApi';
import { AISkillGenerator } from '@/components/builder/AISkillGenerator';
import { Save, Loader2, Sparkles } from 'lucide-react';

export default function BuilderPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading...</div>}>
            <BuilderContent />
        </Suspense>
    );
}

function BuilderContent() {
    const searchParams = useSearchParams();
    const { user, isConfigured } = useAuth();
    const { skill, updateField, setSkill, reset, addResource, removeResource } = useSkillStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showAIGenerator, setShowAIGenerator] = useState(false);
    const [activeTab, setActiveTab] = useState<'preview' | 'config' | 'test'>('preview');
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [editId, setEditId] = useState<string | null>(null);
    const [isLoadingSkill, setIsLoadingSkill] = useState(false);

    const handleApiKeyChange = useCallback((key: string | null) => {
        setApiKey(key);
    }, []);

    const handleSaveToLibrary = async () => {
        if (!user) return;
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            let result;
            if (editId) {
                // Update existing skill
                result = await updateSkill(editId, skill);
            } else {
                // Create new skill
                result = await saveSkill(user.id, skill);
                if (result) {
                    // Set editId so subsequent saves are updates
                    setEditId(result.id);
                }
            }
            if (result) {
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleAISkillAccept = (generatedSkill: {
        name: string;
        description: string;
        category: string;
        triggers: string[];
        instructions: string;
    }) => {
        setSkill({
            name: generatedSkill.name,
            description: generatedSkill.description,
            category: generatedSkill.category,
            tags: [],
            triggers: generatedSkill.triggers,
            instructions: generatedSkill.instructions,
        });
    };

    // Run validation whenever skill changes
    const validationResult = useMemo(() => validateSkill(skill), [skill]);
    const validationStatus = getValidationStatus(validationResult);

    // Load template from query parameter on mount
    useEffect(() => {
        const templateId = searchParams.get('template');
        if (templateId) {
            const template = getTemplateById(templateId);
            if (template) {
                setSkill({
                    name: template.name,
                    description: template.description,
                    category: template.category,
                    tags: template.tags,
                    triggers: template.triggers,
                    instructions: template.instructions,
                });
            }
        }
    }, [searchParams, setSkill]);

    // Load skill for editing from query parameter
    useEffect(() => {
        const editSkillId = searchParams.get('edit');
        if (editSkillId && editSkillId !== editId) {
            setIsLoadingSkill(true);
            getSkillById(editSkillId).then(savedSkill => {
                if (savedSkill) {
                    setEditId(savedSkill.id);
                    setSkill({
                        name: savedSkill.name,
                        description: savedSkill.description,
                        category: savedSkill.category,
                        tags: savedSkill.tags || [],
                        triggers: savedSkill.triggers,
                        instructions: savedSkill.instructions,
                        resources: savedSkill.resources || [],
                    });
                }
                setIsLoadingSkill(false);
            });
        }
    }, [searchParams, editId, setSkill]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const blob = await generateSkillZip(skill);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            // Use skill name or fallback to 'skill' if empty
            const filename = skill.name?.trim()
                ? skill.name.toLowerCase().replace(/\s+/g, '-')
                : 'skill';
            a.download = `${filename}.zip`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            // Delay removal and URL revocation to ensure download starts
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error('Generation failed:', error);
            alert('Failed to generate skill. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const InspectorPanel = (
        <div className="h-full flex flex-col">
            {/* Tab Switcher */}
            <div className="flex border-b border-border">
                <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'preview'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Export
                </button>
                <button
                    onClick={() => setActiveTab('config')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'config'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Config
                </button>
                <button
                    onClick={() => setActiveTab('test')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'test'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Test
                </button>
            </div>

            {/* Tab Content - Flex grow to fill available space */}
            <div className="flex-1 overflow-auto">
                {activeTab === 'preview' && (
                    <SkillPreview skill={skill} />
                )}
                {activeTab === 'config' && (
                    <div className="p-4 space-y-6">
                        <div>
                            <label className="block text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wider">Category</label>
                            <Input
                                value={skill.category}
                                onChange={(e) => updateField('category', e.target.value)}
                                placeholder="e.g. Finance"
                                className="bg-background border-border"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium mb-2 text-muted-foreground uppercase tracking-wider">Triggers</label>
                            <TriggerEditor />
                        </div>

                        <div className="border-t border-border pt-4">
                            <ResourceManager
                                resources={skill.resources || []}
                                onAdd={addResource}
                                onRemove={removeResource}
                            />
                        </div>
                    </div>
                )}
                {activeTab === 'test' && (
                    <div className="p-4 space-y-6">
                        <ApiKeySettings onKeyChange={handleApiKeyChange} />

                        <div className="border-t border-border pt-4">
                            <TriggerTester skill={skill} apiKey={apiKey} />
                        </div>

                        <div className="border-t border-border pt-4">
                            <OutputPreview skill={skill} apiKey={apiKey} />
                        </div>
                    </div>
                )}
            </div>

            {/* Generate Button - Sticky at bottom */}
            <div className="p-4 border-t border-border bg-card mt-auto space-y-2">
                {isConfigured && user && (
                    <Button
                        onClick={handleSaveToLibrary}
                        disabled={!skill.name || !skill.instructions || isSaving}
                        variant="default"
                        className="w-full font-medium bg-primary hover:bg-primary/90"
                    >
                        {isSaving ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                        ) : saveSuccess ? (
                            <><Save className="w-4 h-4 mr-2" /> Saved to Library!</>
                        ) : (
                            <><Save className="w-4 h-4 mr-2" /> Save to Library</>
                        )}
                    </Button>
                )}
                <Button
                    onClick={handleGenerate}
                    disabled={!skill.name || !skill.instructions || isGenerating}
                    variant="outline"
                    className="w-full font-medium text-foreground hover:bg-accent hover:text-foreground border-border"
                >
                    {isGenerating ? 'Generating...' : 'Generate Skill'}
                </Button>
                <Button variant="ghost" onClick={reset} className="w-full text-muted-foreground hover:text-foreground text-xs">
                    Reset Form
                </Button>
            </div>
        </div>
    );

    return (
        <Shell
            title={skill.name || 'New Skill'}
            onTitleChange={(newTitle) => updateField('name', newTitle)}
            inspector={InspectorPanel}
            validation={{
                status: validationStatus,
                message: validationResult.errors.length > 0
                    ? validationResult.errors[0].message
                    : validationResult.warnings.length > 0
                        ? validationResult.warnings[0].message
                        : 'Ready to export'
            }}
        >
            <div className="max-w-3xl">
                {/* Create with AI Button */}
                <div className="mb-6">
                    <Button
                        variant="outline"
                        onClick={() => setShowAIGenerator(true)}
                        className="border-primary/50 text-primary hover:bg-primary/10"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create with AI
                    </Button>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wide">Skill Name</label>
                    <Input
                        value={skill.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Name your skill..."
                        className="text-3xl font-bold border-none px-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/50 h-auto"
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium mb-2 text-muted-foreground uppercase tracking-wide">Description</label>
                    <Textarea
                        value={skill.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        placeholder="Describe what this skill does..."
                        className="resize-none border-border focus-visible:ring-primary/20 min-h-[100px] text-lg"
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-muted-foreground uppercase tracking-wide">Instructions</label>
                        <div className="text-xs text-muted-foreground">Markdown Supported</div>
                    </div>
                    <InstructionsEditor />
                </div>
            </div>

            {/* AI Skill Generator Modal */}
            <AISkillGenerator
                isOpen={showAIGenerator}
                onClose={() => setShowAIGenerator(false)}
                onAccept={handleAISkillAccept}
            />
        </Shell>
    );
}
