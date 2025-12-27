'use client';

import { useCallback, useMemo } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Controls,
    Background,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { TriggerNode } from './nodes/TriggerNode';
import { InstructionNode } from './nodes/InstructionNode';
import { ResourceNode } from './nodes/ResourceNode';
import { useSkillStore } from '@/lib/store/skillStore';

const nodeTypes = {
    trigger: TriggerNode,
    instruction: InstructionNode,
    resource: ResourceNode,
};

interface SkillCanvasProps {
    onNodeSelect?: (nodeId: string | null) => void;
}

export function SkillCanvas({ onNodeSelect }: SkillCanvasProps) {
    const { skill } = useSkillStore();

    // Build initial nodes from current skill state
    const initialNodes: Node[] = useMemo(() => {
        const nodes: Node[] = [];

        // Trigger node
        nodes.push({
            id: 'trigger-1',
            type: 'trigger',
            position: { x: 250, y: 50 },
            data: {
                label: 'Activation Triggers',
                triggers: skill.triggers || [],
            },
        });

        // Instruction node
        nodes.push({
            id: 'instruction-1',
            type: 'instruction',
            position: { x: 225, y: 200 },
            data: {
                label: 'Main Instructions',
                content: skill.instructions || '',
            },
        });

        // Resource node (if resources exist)
        if (skill.resources && skill.resources.length > 0) {
            nodes.push({
                id: 'resource-1',
                type: 'resource',
                position: { x: 225, y: 400 },
                data: {
                    label: 'Attached Resources',
                    resources: skill.resources.map(r => ({ name: r.filename, type: r.mime_type || 'file' })),
                },
            });
        }

        return nodes;
    }, [skill]);

    // Build initial edges connecting nodes
    const initialEdges: Edge[] = useMemo(() => {
        const edges: Edge[] = [];

        edges.push({
            id: 'e-trigger-instruction',
            source: 'trigger-1',
            target: 'instruction-1',
            animated: true,
            style: { stroke: 'hsl(var(--primary))' },
        });

        if (skill.resources && skill.resources.length > 0) {
            edges.push({
                id: 'e-instruction-resource',
                source: 'instruction-1',
                target: 'resource-1',
                animated: true,
                style: { stroke: 'hsl(var(--primary))' },
            });
        }

        return edges;
    }, [skill]);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({
            ...params,
            animated: true,
            style: { stroke: 'hsl(var(--primary))' },
        }, eds)),
        [setEdges]
    );

    const handleNodeClick = useCallback(
        (_event: React.MouseEvent, node: Node) => {
            onNodeSelect?.(node.id);
        },
        [onNodeSelect]
    );

    const handlePaneClick = useCallback(() => {
        onNodeSelect?.(null);
    }, [onNodeSelect]);

    return (
        <div className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
                onPaneClick={handlePaneClick}
                nodeTypes={nodeTypes}
                fitView
                proOptions={{ hideAttribution: true }}
                className="bg-background"
            >
                <Controls
                    className="!bg-card !border-border !shadow-lg [&>button]:!bg-card [&>button]:!border-border [&>button]:!fill-foreground [&>button:hover]:!bg-accent"
                />
                <MiniMap
                    className="!bg-card !border-border"
                    nodeColor="hsl(var(--primary))"
                    maskColor="rgba(0, 0, 0, 0.3)"
                />
                <Background
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="hsl(var(--muted-foreground) / 0.3)"
                />
            </ReactFlow>
        </div>
    );
}
