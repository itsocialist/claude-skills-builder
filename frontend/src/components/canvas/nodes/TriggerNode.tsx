'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MessageSquare } from 'lucide-react';

export interface TriggerNodeData {
    label: string;
    triggers: string[];
}

function TriggerNodeComponent({ data, selected }: NodeProps<TriggerNodeData>) {
    return (
        <div className={`px-4 py-3 rounded-lg border-2 bg-card min-w-[280px] ${selected ? 'border-primary shadow-lg' : 'border-border'
            }`}>
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 !bg-primary"
            />

            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded bg-primary/20">
                    <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-foreground text-sm">
                    {data.label || 'Triggers'}
                </span>
            </div>

            {data.triggers && data.triggers.length > 0 ? (
                <div className="space-y-1">
                    {data.triggers.slice(0, 3).map((trigger, i) => (
                        <div key={i} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded truncate">
                            "{trigger}"
                        </div>
                    ))}
                    {data.triggers.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                            +{data.triggers.length - 3} more...
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-xs text-muted-foreground italic">
                    No triggers defined
                </div>
            )}
        </div>
    );
}

export const TriggerNode = memo(TriggerNodeComponent);
