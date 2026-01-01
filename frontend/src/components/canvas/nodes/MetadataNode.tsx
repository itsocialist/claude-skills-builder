'use client';

import { useRef, useEffect, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FileText } from 'lucide-react';
import { useSkillStore } from '@/lib/store/skillStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface MetadataNodeData {
    name: string;
    description: string;
    category?: string;
}

const MetadataNodeComponent = ({ data, selected }: NodeProps<MetadataNodeData>) => {
    const { updateField } = useSkillStore();

    // We update the store directly on change. 
    // Since the node gets its data from the ReactFlow 'nodes' array which is initialized from the store,
    // we need to ensure the store updates propagate back to the node data if the flow is re-rendered,
    // OR we rely on the fact that this component is just an interface to the store.

    // However, ReactFlow nodes usually need their 'data' prop updated via 'setNodes'.
    // If 'createNodesFromSkill' is only called once, then 'data' might become stale if we only update the store.
    // Ideally, the parent component should sync store changes to nodes, or we update the store and the store updates the nodes.

    // For this implementation, allow direct editing which updates the store.
    // Real-time bidirectional sync depends on the parent implementation.

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        updateField('name', e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateField('description', e.target.value);
    };

    return (
        <div
            className={`
                min-w-[300px] max-w-[340px] bg-card/95 backdrop-blur-sm
                rounded-xl border-2 transition-all duration-200
                ${selected ? 'border-primary shadow-lg shadow-primary/20' : 'border-primary/40 hover:border-primary/60'}
            `}
        >
            <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                    <div className="p-1.5 rounded bg-primary/20">
                        <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">
                        Skill Metadata
                    </span>
                </div>

                <div className="space-y-2">
                    <Input
                        value={data.name || ''}
                        onChange={handleNameChange}
                        placeholder="Skill Name"
                        className="font-semibold text-lg h-9 px-2 bg-transparent border-transparent hover:border-input focus:border-input transition-colors"
                    />

                    <Textarea
                        value={data.description || ''}
                        onChange={handleDescriptionChange}
                        placeholder="Describe what this skill does..."
                        className="text-sm text-muted-foreground min-h-[60px] resize-none px-2 py-1 bg-transparent border-transparent hover:border-input focus:border-input transition-colors"
                    />
                </div>

                {data.category && (
                    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded text-xs ml-1">
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
