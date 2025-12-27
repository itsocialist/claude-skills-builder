'use client';

import { useState } from 'react';
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
    Minimize2
} from 'lucide-react';

export default function CanvasPage() {
    const router = useRouter();
    const { skill } = useSkillStore();
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Inspector content based on selected node
    const getInspectorContent = () => {
        if (!selectedNodeId) {
            return (
                <div className="p-4 space-y-4">
                    <div className="text-center text-muted-foreground py-8">
                        <p className="text-sm">Select a node to view details</p>
                    </div>

                    <Card className="p-4">
                        <h4 className="font-semibold text-sm mb-3 text-foreground">Skill Overview</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Name</span>
                                <span className="text-foreground truncate max-w-[120px]">{skill.name || 'Untitled'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Triggers</span>
                                <span className="text-foreground">{skill.triggers?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Resources</span>
                                <span className="text-foreground">{skill.resources?.length || 0}</span>
                            </div>
                        </div>
                    </Card>

                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => router.push('/app/builder')}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Edit in Builder
                        </Button>
                    </div>
                </div>
            );
        }

        // Show node-specific details based on selection
        if (selectedNodeId.startsWith('trigger')) {
            return (
                <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded bg-primary/20">
                            <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="font-semibold text-foreground">Triggers</h4>
                    </div>
                    <div className="space-y-2">
                        {skill.triggers?.map((trigger, i) => (
                            <div key={i} className="text-sm bg-muted px-3 py-2 rounded">
                                "{trigger}"
                            </div>
                        )) || <p className="text-sm text-muted-foreground">No triggers defined</p>}
                    </div>
                </div>
            );
        }

        if (selectedNodeId.startsWith('instruction')) {
            return (
                <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded bg-green-500/20">
                            <FileText className="w-5 h-5 text-green-500" />
                        </div>
                        <h4 className="font-semibold text-foreground">Instructions</h4>
                    </div>
                    <div className="bg-muted p-3 rounded text-sm font-mono max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                        {skill.instructions || 'No instructions defined'}
                    </div>
                </div>
            );
        }

        if (selectedNodeId.startsWith('resource')) {
            return (
                <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded bg-amber-500/20">
                            <Paperclip className="w-5 h-5 text-amber-500" />
                        </div>
                        <h4 className="font-semibold text-foreground">Resources</h4>
                    </div>
                    <div className="space-y-2">
                        {skill.resources?.map((resource, i) => (
                            <div key={i} className="text-sm bg-muted px-3 py-2 rounded flex items-center gap-2">
                                <Paperclip className="w-3 h-3" />
                                {resource.filename}
                            </div>
                        )) || <p className="text-sm text-muted-foreground">No resources attached</p>}
                    </div>
                </div>
            );
        }

        return null;
    };

    const inspectorContent = getInspectorContent();

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
            <div className="h-[calc(100vh-180px)] flex flex-col">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/app/builder')}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Builder
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsFullscreen(true)}
                        >
                            <Maximize2 className="w-4 h-4" />
                        </Button>
                        <Button>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Canvas */}
                <div className="flex-1 border border-border rounded-lg overflow-hidden">
                    <SkillCanvas onNodeSelect={setSelectedNodeId} />
                </div>
            </div>
        </Shell>
    );
}
