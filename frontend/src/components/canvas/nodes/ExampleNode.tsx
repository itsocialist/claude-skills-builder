'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Sparkles } from 'lucide-react';

export interface ExampleNodeData {
    label: string;
    input: string;
    output: string;
}

function ExampleNodeComponent({ data, selected }: NodeProps<ExampleNodeData>) {
    return (
        <div className={`px-4 py-3 rounded-lg border-2 bg-card min-w-[280px] ${selected ? 'border-indigo-500 shadow-lg' : 'border-border'
            }`}>
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 !bg-indigo-500"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 !bg-indigo-500"
            />

            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-indigo-500/20">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                </div>
                <span className="font-medium text-foreground text-sm">
                    {data.label || 'Example'}
                </span>
            </div>

            <div className="space-y-2">
                <div>
                    <div className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">User Input</div>
                    <div className="text-xs bg-muted p-2 rounded font-mono truncate">
                        {data.input || '...'}
                    </div>
                </div>
                <div>
                    <div className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">Model Output</div>
                    <div className="text-xs bg-muted p-2 rounded font-mono truncate">
                        {data.output || '...'}
                    </div>
                </div>
            </div>
        </div>
    );
}

export const ExampleNode = memo(ExampleNodeComponent);
