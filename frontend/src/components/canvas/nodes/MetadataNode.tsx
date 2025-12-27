'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FileText } from 'lucide-react';

interface MetadataNodeData {
    name: string;
    description: string;
    category?: string;
}

const MetadataNodeComponent = ({ data, selected }: NodeProps<MetadataNodeData>) => {
    return (
        <div
            className={`
                min-w-[280px] max-w-[320px] bg-gradient-to-br from-primary/30 to-primary/10
                rounded-xl border-2 transition-all duration-200
                ${selected ? 'border-primary shadow-lg shadow-primary/20' : 'border-primary/50'}
            `}
        >
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded bg-primary/20">
                        <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">
                        Skill Metadata
                    </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground truncate">
                    {data.name || 'Untitled Skill'}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1" title={data.description}>
                    {data.description || 'Click to add description...'}
                </p>
                {data.category && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-primary/20 text-primary rounded text-xs">
                        {data.category}
                    </span>
                )}
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                className="w-3 h-3 !bg-primary"
            />
        </div>
    );
};

export const MetadataNode = memo(MetadataNodeComponent);
