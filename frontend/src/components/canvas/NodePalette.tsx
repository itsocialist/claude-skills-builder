'use client';

import {
    MessageSquare,
    FileText,
    Paperclip,
    Sparkles,
    Bot,
    GripVertical
} from 'lucide-react';

export const NodePalette = () => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="w-52 bg-card border-r border-border p-4 flex flex-col gap-4">
            <div>
                <h4 className="font-semibold text-sm mb-1 text-foreground">Components</h4>
                <p className="text-xs text-muted-foreground mb-4">Drag nodes to canvas</p>
            </div>

            <div className="space-y-3">
                <div
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background cursor-grab hover:border-primary transition-colors"
                    onDragStart={(event) => onDragStart(event, 'trigger')}
                    draggable
                >
                    <div className="p-1.5 rounded bg-primary/20">
                        <MessageSquare className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">Trigger</span>
                    <GripVertical className="w-3 h-3 text-muted-foreground ml-auto" />
                </div>

                <div
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background cursor-grab hover:border-green-500 transition-colors"
                    onDragStart={(event) => onDragStart(event, 'instruction')}
                    draggable
                >
                    <div className="p-1.5 rounded bg-green-500/20">
                        <FileText className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-sm font-medium">Instruction</span>
                    <GripVertical className="w-3 h-3 text-muted-foreground ml-auto" />
                </div>

                <div
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background cursor-grab hover:border-indigo-500 transition-colors"
                    onDragStart={(event) => onDragStart(event, 'example')}
                    draggable
                >
                    <div className="p-1.5 rounded bg-indigo-500/20">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                    </div>
                    <span className="text-sm font-medium">Example</span>
                    <GripVertical className="w-3 h-3 text-muted-foreground ml-auto" />
                </div>

                <div
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background cursor-grab hover:border-pink-500 transition-colors"
                    onDragStart={(event) => onDragStart(event, 'output')}
                    draggable
                >
                    <div className="p-1.5 rounded bg-pink-500/20">
                        <Bot className="w-4 h-4 text-pink-500" />
                    </div>
                    <span className="text-sm font-medium">Output</span>
                    <GripVertical className="w-3 h-3 text-muted-foreground ml-auto" />
                </div>

                <div
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background cursor-grab hover:border-amber-500 transition-colors"
                    onDragStart={(event) => onDragStart(event, 'resource')}
                    draggable
                >
                    <div className="p-1.5 rounded bg-amber-500/20">
                        <Paperclip className="w-4 h-4 text-amber-500" />
                    </div>
                    <span className="text-sm font-medium">Resource</span>
                    <GripVertical className="w-3 h-3 text-muted-foreground ml-auto" />
                </div>
            </div>
        </div>
    );
};
