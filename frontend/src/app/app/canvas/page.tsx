'use client';

import { useState, useMemo } from 'react';
import { Shell } from '@/components/layout/Shell';
import { SkillCanvas } from '@/components/canvas/SkillCanvas';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSkillStore } from '@/lib/store/skillStore';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import { saveSkill, updateSkill } from '@/lib/api/skillsApi';
import { generateSkillZip } from '@/lib/utils/skill-generator';
import {
    ArrowLeft,
    Download,
    MessageSquare,
    FileText,
    Paperclip,
    Maximize2,
    Minimize2,
    Library,
    LogOut,
    Save,
    Loader2,
    Check
} from 'lucide-react';
import { ReactFlowProvider } from 'reactflow';
import { NodePalette } from '@/components/canvas/NodePalette';
import { TriggerEditor } from '@/components/canvas/editors/TriggerEditor';
import { InstructionEditor } from '@/components/canvas/editors/InstructionEditor';
import { ExampleEditor } from '@/components/canvas/editors/ExampleEditor';
import { ResourceManager } from '@/components/builder/ResourceManager';
import { TestConsole } from '@/components/builder/TestConsole';
import { Play } from 'lucide-react';
import 'reactflow/dist/style.css';

export default function CanvasPage() {
    const router = useRouter();
    const { user, isConfigured } = useAuth();
    const { skill, setSkill, updateField } = useSkillStore();
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'test'>('details');

    // Save to Library
    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        setSaveSuccess(false);
        try {
            let result;
            if (editId) {
                result = await updateSkill(editId, skill);
            } else {
                result = await saveSkill(user.id, skill);
                if (result) {
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

    // Export as ZIP
    const handleExport = async () => {
        setIsExporting(true);
        try {
            const blob = await generateSkillZip(skill);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filename = skill.name?.trim()
                ? skill.name.toLowerCase().replace(/\s+/g, '-')
                : 'skill';
            a.download = `${filename}.zip`;
            a.click();
            URL.revokeObjectURL(url);
        } finally {
            setIsExporting(false);
        }
    };

    // Inspector content based on selection
    const inspectorContent = useMemo(() => {
        if (!selectedNodeId) {
            return (
                <div className="h-full flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-border">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'details'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setActiveTab('test')}
                            className={`px-4 py-2 text-sm font-medium flex items-center gap-1 ${activeTab === 'test'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Play className="w-3 h-3" />
                            Test
                        </button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'details' && (
                        <>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Name</label>
                                    <Input
                                        value={skill.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="My Skill Name"
                                        className="bg-background"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Description</label>
                                    <Textarea
                                        value={skill.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        placeholder="Describe what this skill does..."
                                        rows={3}
                                        className="bg-background resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Category</label>
                                    <select
                                        value={skill.category || ''}
                                        onChange={(e) => updateField('category', e.target.value)}
                                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                                    >
                                        <option value="">Select category...</option>
                                        <option value="Business">Business</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Real Estate">Real Estate</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Product">Product</option>
                                        <option value="Development">Development</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="pt-4 border-t border-border">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Structure</p>
                                    <div className="space-y-2">
                                        <div className="text-sm flex justify-between">
                                            <span>Triggers</span>
                                            <span className="font-mono bg-muted px-2 rounded">{skill.triggers?.length || 0}</span>
                                        </div>
                                        <div className="text-sm flex justify-between">
                                            <span>Resources</span>
                                            <span className="font-mono bg-muted px-2 rounded">{skill.resources?.length || 0}</span>
                                        </div>
                                        <div className="text-sm flex justify-between">
                                            <span>Examples</span>
                                            <span className="font-mono bg-muted px-2 rounded">{skill.examples?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Save Button at Bottom */}
                            <div className="p-4 border-t border-border space-y-2">
                                {isConfigured && user ? (
                                    <Button
                                        onClick={handleSave}
                                        disabled={!skill.name || !skill.instructions || isSaving}
                                        className="w-full"
                                    >
                                        {isSaving ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                                        ) : saveSuccess ? (
                                            <><Check className="w-4 h-4 mr-2" /> Saved!</>
                                        ) : (
                                            <><Save className="w-4 h-4 mr-2" /> Save to Library</>
                                        )}
                                    </Button>
                                ) : (
                                    <p className="text-xs text-muted-foreground text-center">
                                        Sign in to save to library
                                    </p>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={handleExport}
                                    disabled={!skill.name || isExporting}
                                    className="w-full"
                                >
                                    {isExporting ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Exporting...</>
                                    ) : (
                                        <><Download className="w-4 h-4 mr-2" /> Download ZIP</>
                                    )}
                                </Button>
                            </div>
                        </>
                    )}

                    {activeTab === 'test' && (
                        <TestConsole skill={skill} apiKey={apiKey} onApiKeyChange={setApiKey} />
                    )}
                </div>
            );
        }

        // Show same tabbed interface when metadata node is selected
        if (selectedNodeId.startsWith('metadata')) {
            // Same as no-selection case - show the tabbed interface
            return (
                <div className="h-full flex flex-col">
                    {/* Tabs */}
                    <div className="flex border-b border-border">
                        <button
                            onClick={() => setActiveTab('details')}
                            className={`px-4 py-2 text-sm font-medium ${activeTab === 'details'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Details
                        </button>
                        <button
                            onClick={() => setActiveTab('test')}
                            className={`px-4 py-2 text-sm font-medium flex items-center gap-1 ${activeTab === 'test'
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Play className="w-3 h-3" />
                            Test
                        </button>
                    </div>

                    {activeTab === 'details' && (
                        <>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Name</label>
                                    <Input
                                        value={skill.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="My Skill Name"
                                        className="bg-background"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Description</label>
                                    <Textarea
                                        value={skill.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        placeholder="Describe what this skill does..."
                                        rows={3}
                                        className="bg-background resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Category</label>
                                    <select
                                        value={skill.category || ''}
                                        onChange={(e) => updateField('category', e.target.value)}
                                        className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                                    >
                                        <option value="">Select category...</option>
                                        <option value="Business">Business</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Finance">Finance</option>
                                        <option value="Real Estate">Real Estate</option>
                                        <option value="Sales">Sales</option>
                                        <option value="Product">Product</option>
                                        <option value="Development">Development</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="p-4 border-t border-border space-y-2">
                                {isConfigured && user ? (
                                    <Button
                                        onClick={handleSave}
                                        disabled={!skill.name || !skill.instructions || isSaving}
                                        className="w-full"
                                    >
                                        {isSaving ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
                                        ) : saveSuccess ? (
                                            <><Check className="w-4 h-4 mr-2" /> Saved!</>
                                        ) : (
                                            <><Save className="w-4 h-4 mr-2" /> Save to Library</>
                                        )}
                                    </Button>
                                ) : (
                                    <p className="text-xs text-muted-foreground text-center">
                                        Sign in to save to library
                                    </p>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={handleExport}
                                    disabled={!skill.name || isExporting}
                                    className="w-full"
                                >
                                    {isExporting ? (
                                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Exporting...</>
                                    ) : (
                                        <><Download className="w-4 h-4 mr-2" /> Download ZIP</>
                                    )}
                                </Button>
                            </div>
                        </>
                    )}

                    {activeTab === 'test' && (
                        <TestConsole skill={skill} apiKey={apiKey} onApiKeyChange={setApiKey} />
                    )}
                </div>
            );
        }

        if (selectedNodeId.startsWith('trigger')) {
            return <TriggerEditor />;
        }

        if (selectedNodeId.startsWith('instruction')) {
            return <InstructionEditor />;
        }

        if (selectedNodeId.startsWith('example')) {
            return <ExampleEditor />;
        }

        if (selectedNodeId.startsWith('resource')) {
            return (
                <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-border">
                        <h4 className="font-semibold">Resources</h4>
                        <p className="text-xs text-muted-foreground">Manage attachments</p>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <ResourceManager
                            resources={skill.resources || []}
                            onAdd={(r) => setSkill({ ...skill, resources: [...(skill.resources || []), { ...r, id: crypto.randomUUID() }] })}
                            onRemove={(id) => setSkill({ ...skill, resources: (skill.resources || []).filter(r => r.id !== id) })}
                        />
                    </div>
                </div>
            );
        }

        if (selectedNodeId.startsWith('output')) {
            return (
                <div className="p-4 space-y-4">
                    <h4 className="font-semibold">Expected Output</h4>
                    <p className="text-sm text-muted-foreground">
                        This node visualizes the final response from the model based on your instructions and examples.
                    </p>
                    <div className="bg-muted p-3 rounded-md text-xs font-mono">
                        Output will appear here during testing.
                    </div>
                </div>
            );
        }

        return (
            <div className="p-4">
                <p className="text-muted-foreground">Select a node to edit properties</p>
            </div>
        );
    }, [selectedNodeId, skill, setSkill]);

    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-50 bg-background">
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <Minimize2 className="w-4 h-4" />
                    </Button>
                </div>
                <ReactFlowProvider>
                    <SkillCanvas onNodeSelect={setSelectedNodeId} />
                </ReactFlowProvider>
            </div>
        );
    }

    return (
        <Shell title={skill.name || 'Visual Canvas'} inspector={inspectorContent}>
            <div className="h-full flex relative">
                {/* Node Palette Sidebar */}
                <NodePalette />

                {/* Main Canvas Area - needs explicit height for ReactFlow */}
                <div className="flex-1 relative" style={{ height: 'calc(100vh - 120px)' }}>
                    {/* Toolbar overlay */}
                    <div className="absolute top-4 left-4 z-10 flex gap-2 bg-background/80 backdrop-blur border border-border p-1 rounded-lg">
                        <Button
                            variant="ghost"
                            size="icon"
                            title={saveSuccess ? "Saved!" : "Save to Library"}
                            onClick={handleSave}
                            disabled={!user || !skill.name || isSaving}
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : saveSuccess ? (
                                <Check className="w-4 h-4 text-green-500" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            title="Download ZIP"
                            onClick={handleExport}
                            disabled={!skill.name || isExporting}
                        >
                            {isExporting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Download className="w-4 h-4" />
                            )}
                        </Button>
                        <div className="w-px bg-border mx-1" />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        >
                            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </Button>
                    </div>

                    <ReactFlowProvider>
                        <SkillCanvas onNodeSelect={setSelectedNodeId} />
                    </ReactFlowProvider>
                </div>
            </div>
        </Shell>
    );
}
