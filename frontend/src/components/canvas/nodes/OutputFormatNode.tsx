'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ListOrdered } from 'lucide-react';

export interface OutputFormatNodeData {
    label: string;
    format: string;
}

const formatOptions = [
    { value: 'markdown', label: 'Markdown' },
    { value: 'json', label: 'JSON' },
    { value: 'bullet_points', label: 'Bullet Points' },
    { value: 'numbered_list', label: 'Numbered List' },
    { value: 'plain_text', label: 'Plain Text' },
    { value: 'code', label: 'Code Block' },
];

function OutputFormatNodeComponent({ data, selected }: NodeProps<OutputFormatNodeData>) {
    const currentFormat = formatOptions.find(f => f.value === data.format) || formatOptions[0];

    return (
        <div className={`px-4 py-3 rounded-lg border-2 bg-card min-w-[200px] ${selected ? 'border-cyan-500 shadow-lg' : 'border-border'
            }`}>
            <Handle
                type="target"
                position={Position.Top}
                className="!w-3 !h-3 !bg-cyan-500 !border-0"
                style={{ background: '#06b6d4', border: 'none' }}
            />
            <Handle
                type="source"
                position={Position.Bottom}
                className="!w-3 !h-3 !bg-cyan-500 !border-0"
                style={{ background: '#06b6d4', border: 'none' }}
            />

            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-cyan-500/20">
                    <ListOrdered className="w-4 h-4 text-cyan-500" />
                </div>
                <span className="font-medium text-foreground text-sm">
                    {data.label || 'Output Format'}
                </span>
            </div>

            <div className="text-xs text-muted-foreground">
                Format: <span className="text-cyan-500 font-medium">{currentFormat.label}</span>
            </div>
        </div>
    );
}

export const OutputFormatNode = memo(OutputFormatNodeComponent);
