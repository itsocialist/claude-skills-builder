'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Bot } from 'lucide-react';

export interface OutputNodeData {
    label: string;
    description: string;
}

function OutputNodeComponent({ data, selected }: NodeProps<OutputNodeData>) {
    return (
        <div className={`px-4 py-3 rounded-lg border-2 bg-card min-w-[200px] ${selected ? 'border-pink-500 shadow-lg' : 'border-border'
            }`}>
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 !bg-pink-500"
            />

            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-pink-500/20">
                    <Bot className="w-4 h-4 text-pink-500" />
                </div>
                <span className="font-medium text-foreground text-sm">
                    {data.label || 'Expected Response'}
                </span>
            </div>

            <div className="text-xs text-muted-foreground italic">
                {data.description || 'Final model output based on instructions and examples'}
            </div>
        </div>
    );
}

export const OutputNode = memo(OutputNodeComponent);
