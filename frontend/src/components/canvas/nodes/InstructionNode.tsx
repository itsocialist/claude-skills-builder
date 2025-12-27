'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FileText } from 'lucide-react';

export interface InstructionNodeData {
    label: string;
    content: string;
}

function InstructionNodeComponent({ data, selected }: NodeProps<InstructionNodeData>) {
    const preview = data.content?.slice(0, 100) || '';

    return (
        <div className={`px-4 py-3 rounded-lg border-2 bg-card min-w-[250px] max-w-[300px] ${selected ? 'border-green-500 shadow-lg' : 'border-border'
            }`}>
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 !bg-green-500"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 !bg-green-500"
            />

            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-green-500/20">
                    <FileText className="w-4 h-4 text-green-500" />
                </div>
                <span className="font-medium text-foreground text-sm">
                    {data.label || 'Instructions'}
                </span>
            </div>

            {preview ? (
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded font-mono whitespace-pre-wrap line-clamp-4">
                    {preview}
                    {data.content?.length > 100 && '...'}
                </div>
            ) : (
                <div className="text-xs text-muted-foreground italic">
                    No instructions defined
                </div>
            )}
        </div>
    );
}

export const InstructionNode = memo(InstructionNodeComponent);
