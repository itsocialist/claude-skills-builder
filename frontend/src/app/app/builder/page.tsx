'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { useSkillStore } from '@/lib/store/skillStore';
import { generateSkillZip } from '@/lib/utils/skill-generator';
import { getTemplateById } from '@/lib/api/templateApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { TriggerEditor } from '@/components/builder/TriggerEditor';
import { InstructionsEditor } from '@/components/builder/InstructionsEditor';
import { SkillPreview } from '@/components/builder/SkillPreview';
import { ResourceManager } from '@/components/builder/ResourceManager';
import { TestConsole } from '@/components/builder/TestConsole';
import { Shell } from '@/components/layout/Shell';
import { validateSkill, getValidationStatus } from '@/lib/utils/validation';
import { useAuth } from '@/components/auth/AuthProvider';
import { saveSkill, getSkillById, updateSkill, trackSkillDownload, trackSkillView, type SavedSkill } from '@/lib/api/skillsApi';
import { ImportSkillModal } from '@/components/builder/ImportSkillModal';
import { AISkillGenerator } from '@/components/builder/AISkillGenerator';
import { InsightsPanel } from '@/components/builder/InsightsPanel';
import { analyzeSkillContent, AIAnalysisResult } from '@/lib/claude-client';
import { supabase } from '@/lib/supabase';
import { Save, Loader2, Sparkles, Eye, Download, Lightbulb, X, Globe } from 'lucide-react';
import { useSiteSettings } from '@/lib/contexts/SiteSettingsContext';
import { DEFAULT_FLAGS } from '@/lib/flags';

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
    const { settings } = useSiteSettings();
    const { skill, updateField, setSkill, reset, addResource, removeResource } = useSkillStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [showAIGenerator, setShowAIGenerator] = useState(false);
    const [activeTab, setActiveTab] = useState<'preview' | 'config' | 'resources' | 'test' | 'insights'>('preview');
    const [editId, setEditId] = useState<string | null>(null);
    const [currentSkillData, setCurrentSkillData] = useState<SavedSkill | null>(null);
    const [isLoadingSkill, setIsLoadingSkill] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishSuccess, setPublishSuccess] = useState(false);
    const [isPublished, setIsPublished] = useState(false);

    // Feature Flag Logic
    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').toLowerCase().split(',');
    const isAdmin = user?.email && adminEmails.some(e => e.trim() === user.email?.toLowerCase().trim());

    const genFlag = settings.feature_flags?.feature_generations || DEFAULT_FLAGS.feature_generations;
    const canUseGenerations = genFlag === 'PUBLIC' || (genFlag === 'ADMIN_ONLY' && !!isAdmin);

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
                toast.success('Skill saved to library');
                setTimeout(() => setSaveSuccess(false), 3000);
            } else {
                toast.error('Failed to save skill');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save skill');
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
            setIsLoadingSkill(true);
            getTemplateById(templateId).then(template => {
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
                setIsLoadingSkill(false);
            });
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
                    setCurrentSkillData(savedSkill);
                    // Track view when opening for edit
                    trackSkillView(savedSkill.id);
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
            // Track download if this is a saved skill
            if (editId) {
                trackSkillDownload(editId);
            }
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

    const handlePublish = async () => {
        if (!user || !editId) {
            alert('Please save your skill first before publishing.');
            return;
        }
        if (!supabase) {
            alert('Database connection not available.');
            return;
        }
        setIsPublishing(true);
        try {
            // Generate slug from skill name
            const slug = skill.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

            const { error } = await supabase
                .from('market_listings')
                .insert({
                    skill_id: editId,
                    creator_id: user.id,
                    slug,
                    title: skill.name,
                    description: skill.description || '',
                    category: skill.category || 'general',
                    listing_status: 'active',
                });

            if (error) {
                if (error.code === '23505') {
                    alert('This skill is already published to the marketplace.');
                } else {
                    throw error;
                }
            } else {
                setPublishSuccess(true);
                setIsPublished(true);
                setTimeout(() => setPublishSuccess(false), 3000);
            }
        } catch (error) {
            console.error('Publish failed:', error);
            alert('Failed to publish skill. Please try again.');
        } finally {
            setIsPublishing(false);
        }
    };

    const handleAnalyzeWithAI = async () => {
        if (!apiKey) {
            alert('Please enter your Claude API key to analyze.');
            return;
        }
        setIsAnalyzing(true);
        try {
            // Build skill content as markdown
            const skillContent = `---
name: ${skill.name}
description: ${skill.description}
category: ${skill.category}
triggers:
${skill.triggers.map(t => `  - "${t}"`).join('\n')}
---

${skill.instructions}`;

            const { analysis } = await analyzeSkillContent(apiKey, skillContent);
            setAnalysisResult(analysis);
        } catch (error) {
            console.error('Analysis failed:', error);
            alert('AI analysis failed. Check your API key.');
        } finally {
            setIsAnalyzing(false);
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
                <button
                    onClick={() => setActiveTab('resources')}
                    className={`px-4 py-2 text-sm font-medium ${activeTab === 'resources'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    Resources
                </button>
                {editId && canUseGenerations && (
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'insights'
                            ? 'text-[#C15F3C] border-b-2 border-[#C15F3C]'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Insights
                    </button>
                )}
            </div>

            {/* Tab Content - Flex grow to fill available space */}
            <div className="flex-1 overflow-auto">
                {activeTab === 'preview' && (
                    <div className="flex flex-col h-full">
                        <SkillPreview skill={skill} />
                        {/* Generate Button in Export tab */}
                        <div className="p-4 border-t border-border bg-card mt-auto space-y-2">
                            <Button
                                onClick={handleGenerate}
                                disabled={!skill.name || !skill.instructions || isGenerating}
                                className="w-full font-medium"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {isGenerating ? 'Generating...' : 'Download Skill ZIP'}
                            </Button>
                            {editId && (
                                <Button
                                    onClick={handlePublish}
                                    disabled={isPublishing || isPublished}
                                    variant="outline"
                                    className="w-full font-medium border-primary/50 text-primary hover:bg-primary/10"
                                >
                                    <Globe className="w-4 h-4 mr-2" />
                                    {isPublishing ? 'Publishing...' : isPublished || publishSuccess ? 'Published!' : 'Publish to Marketplace'}
                                </Button>
                            )}
                            {!editId && (
                                <p className="text-xs text-muted-foreground text-center">
                                    Save to Library first to publish to Marketplace
                                </p>
                            )}
                        </div>
                    </div>
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
                    </div>
                )}
                {activeTab === 'resources' && (
                    <div className="p-4">
                        <ResourceManager
                            resources={skill.resources || []}
                            onAdd={addResource}
                            onRemove={removeResource}
                        />
                    </div>
                )}
                {activeTab === 'test' && (
                    <TestConsole skill={skill} apiKey={apiKey} onApiKeyChange={setApiKey} />
                )}
                {activeTab === 'insights' && editId && canUseGenerations && (
                    <div className="p-4">
                        <InsightsPanel skillId={editId} stats={currentSkillData?.stats} />
                    </div>
                )}
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border bg-card mt-auto">
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
                <button
                    onClick={reset}
                    className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground text-center py-1"
                >
                    Reset Form
                </button>
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
            <div className="max-w-3xl mx-auto">
                <div className="mb-6 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <ImportSkillModal />

                        {canUseGenerations && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAIGenerator(true)}
                                    className="border-primary/50 text-primary hover:bg-primary/10"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Create with AI
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleAnalyzeWithAI}
                                    disabled={!skill.name || !skill.instructions || isAnalyzing}
                                    className="border-[#C15F3C]/50 text-[#C15F3C] hover:bg-[#C15F3C]/10"
                                >
                                    {isAnalyzing ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                                    ) : (
                                        <><Lightbulb className="w-4 h-4 mr-2" /> Analyze with AI</>
                                    )}
                                </Button>
                            </>
                        )}

                        {/* Analytics Stats for saved skills */}
                        {currentSkillData && (
                            <div className="inline-flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    {currentSkillData.view_count ?? 0} views
                                </span>
                                <span className="flex items-center gap-1">
                                    <Download className="w-4 h-4" />
                                    {currentSkillData.download_count ?? 0} downloads
                                </span>
                            </div>
                        )}
                    </div>

                    {/* AI Analysis Results Panel */}
                    {analysisResult && (
                        <Card className="p-4 border-l-4 border-l-[#C15F3C] bg-card/50">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-[#C15F3C]" />
                                    <span className="text-sm font-medium text-foreground">AI Analysis</span>
                                    <span className="px-2 py-0.5 bg-[#C15F3C]/10 text-[#C15F3C] rounded-full text-xs font-medium">
                                        Score: {analysisResult.overallScore}/10
                                    </span>
                                </div>
                                <button
                                    onClick={() => setAnalysisResult(null)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{analysisResult.summary}</p>
                            {analysisResult.suggestions.length > 0 && (
                                <ul className="space-y-2">
                                    {analysisResult.suggestions.map((suggestion, i) => (
                                        <li
                                            key={i}
                                            className={`text-xs pl-3 py-1.5 rounded ${suggestion.type === 'error' ? 'bg-red-500/10 text-red-300 border-l-2 border-red-500' :
                                                suggestion.type === 'warning' ? 'bg-yellow-500/10 text-yellow-300 border-l-2 border-yellow-500' :
                                                    'bg-blue-500/10 text-blue-300 border-l-2 border-blue-500'
                                                }`}
                                        >
                                            <span className="font-medium uppercase text-muted-foreground mr-2">[{suggestion.area}]</span>
                                            {suggestion.message}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                    )}
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
