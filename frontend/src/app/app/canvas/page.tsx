'use client';

import { useState, useMemo } from 'react';
import { Shell } from '@/components/layout/Shell';
import { SkillCanvas } from '@/components/canvas/SkillCanvas';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSkillStore } from '@/lib/store/skillStore';
import { useRouter } from 'next/navigation';
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
    Save
} from 'lucide-react';
import { ReactFlowProvider } from 'reactflow';
import { NodePalette } from '@/components/canvas/NodePalette';
import { TriggerEditor } from '@/components/canvas/editors/TriggerEditor';
import { InstructionEditor } from '@/components/canvas/editors/InstructionEditor';
import { ExampleEditor } from '@/components/canvas/editors/ExampleEditor';
import { ResourceManager } from '@/components/builder/ResourceManager';
import 'reactflow/dist/style.css';

export default function CanvasPage() {
    const router = useRouter();
    const { skill, setSkill } = useSkillStore();
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Inspector content based on selection
    const inspectorContent = useMemo(() => {
        if (!selectedNodeId) {
            return (
                <div className="p-4 space-y-4">
                    <h3 className="font-semibold text-lg">Skill Overview</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Name</label>
                            <p className="text-foreground font-medium">{skill.name || 'Untitled Skill'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Description</label>
                            <p className="text-sm text-foreground">{skill.description || 'No description'}</p>
                        </div>
                        <div className="pt-4 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-2">Structure</p>
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
                <SkillCanvas onNodeSelect={setSelectedNodeId} />
            </div>
        );
    }

    return (
        <Shell title={skill.name || 'Visual Canvas'} inspector={inspectorContent}>
            <div className="h-full flex relative">
                {/* Node Palette Sidebar */}
                <NodePalette />

                {/* Main Canvas Area */}
                <div className="flex-1 h-full relative">
                    {/* Toolbar overlay */}
                    <div className="absolute top-4 left-4 z-10 flex gap-2 bg-background/80 backdrop-blur border border-border p-1 rounded-lg">
                        <Button variant="ghost" size="icon" title="Save">
                            <Save className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Export">
                            <Download className="w-4 h-4" />
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
