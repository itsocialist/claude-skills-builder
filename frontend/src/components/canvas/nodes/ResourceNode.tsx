'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Paperclip } from 'lucide-react';

export interface ResourceNodeData {
    label: string;
    resources: { name: string; type: string }[];
}

function ResourceNodeComponent({ data, selected }: NodeProps<ResourceNodeData>) {
    return (
        <div className={`px-4 py-3 rounded-lg border-2 bg-card min-w-[280px] ${selected ? 'border-amber-500 shadow-lg' : 'border-border'
            }`}>
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 !bg-amber-500"
            />

            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-amber-500/20">
                    <Paperclip className="w-4 h-4 text-amber-500" />
                </div>
                <span className="font-medium text-foreground text-sm">
                    {data.label || 'Resources'}
                </span>
            </div>

            {data.resources && data.resources.length > 0 ? (
                <div className="space-y-1">
                    {data.resources.slice(0, 3).map((resource, i) => (
                        <div key={i} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded flex items-center gap-1">
                            <span className="truncate">{resource.name}</span>
                        </div>
                    ))}
                    {data.resources.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                            +{data.resources.length - 3} more...
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-xs text-muted-foreground italic">
                    No resources attached
                </div>
            )}
        </div>
    );
}

export const ResourceNode = memo(ResourceNodeComponent);
