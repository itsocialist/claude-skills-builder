'use client';

import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
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
    ReactFlowInstance,
    XYPosition,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { TriggerNode } from './nodes/TriggerNode';
import { InstructionNode } from './nodes/InstructionNode';
import { ResourceNode } from './nodes/ResourceNode';
import { ExampleNode } from './nodes/ExampleNode';
import { OutputNode } from './nodes/OutputNode';
import { useSkillStore } from '@/lib/store/skillStore';
import { Skill } from '@/types/skill.types';

const nodeTypes = {
    trigger: TriggerNode,
    instruction: InstructionNode,
    resource: ResourceNode,
    example: ExampleNode,
    output: OutputNode,
};

// Helper to generate nodes from skill data
// We export this to use it for initial state and syncing
function createNodesFromSkill(skill: Skill): Node[] {
    const nodes: Node[] = [];
    let yOffset = 50;

    // Trigger node
    nodes.push({
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 250, y: yOffset },
        data: {
            label: 'Activation Triggers',
            triggers: skill.triggers || [],
        },
    });
    yOffset += 150;

    // Instruction node
    nodes.push({
        id: 'instruction-1',
        type: 'instruction',
        position: { x: 225, y: yOffset },
        data: {
            label: 'Main Instructions',
            content: skill.instructions || '',
        },
    });
    yOffset += 200;

    // Example nodes (if any)
    if (skill.examples && skill.examples.length > 0) {
        skill.examples.forEach((example, index) => {
            nodes.push({
                id: `example-${index}`,
                type: 'example',
                position: { x: index % 2 === 0 ? 50 : 400, y: yOffset + (Math.floor(index / 2) * 150) },
                data: {
                    label: `Example ${index + 1}`,
                    input: example.input,
                    output: example.output,
                },
            });
        });
        yOffset += (Math.ceil(skill.examples.length / 2) * 150) + 50;
    }

    // Resource node (if resources exist)
    if (skill.resources && skill.resources.length > 0) {
        nodes.push({
            id: 'resource-1',
            type: 'resource',
            position: { x: 225, y: yOffset },
            data: {
                label: 'Attached Resources',
                resources: skill.resources.map(r => ({ name: r.filename, type: r.mime_type || 'file' })),
            },
        });
        yOffset += 150;
    }

    // Output node
    nodes.push({
        id: 'output-1',
        type: 'output',
        position: { x: 250, y: yOffset },
        data: {
            label: 'Expected Response',
            description: 'Final AI output',
        },
    });

    return nodes;
}

interface SkillCanvasProps {
    onNodeSelect?: (nodeId: string | null) => void;
}

export function SkillCanvas({ onNodeSelect }: SkillCanvasProps) {
    const { skill, setSkill } = useSkillStore();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

    const initialNodes = useMemo(() => createNodesFromSkill(skill), []); // Only runs once on mount

    // Build initial edges connecting nodes
    const initialEdges: Edge[] = useMemo(() => {
        const edges: Edge[] = [];
        const edgeStyle = { stroke: '#f97316', strokeWidth: 2 }; // Orange, visible

        // Basic flow: Trigger -> Instruction
        edges.push({
            id: 'e-trigger-instruction',
            source: 'trigger-1',
            target: 'instruction-1',
            animated: true,
            style: edgeStyle,
        });

        // Instructions -> Examples
        if (skill.examples && skill.examples.length > 0) {
            skill.examples.forEach((_, index) => {
                edges.push({
                    id: `e-instruction-example-${index}`,
                    source: 'instruction-1',
                    target: `example-${index}`,
                    animated: true,
                    style: edgeStyle,
                });
            });
        }

        // Any leaf node -> Output
        if (skill.resources && skill.resources.length > 0) {
            edges.push({
                id: 'e-instruction-resource',
                source: 'instruction-1',
                target: 'resource-1',
                animated: true,
                style: edgeStyle,
            });
            edges.push({
                id: 'e-resource-output',
                source: 'resource-1',
                target: 'output-1',
                animated: true,
                style: edgeStyle,
            });
        } else if (skill.examples && skill.examples.length > 0) {
            skill.examples.forEach((_, index) => {
                edges.push({
                    id: `e-example-${index}-output`,
                    source: `example-${index}`,
                    target: 'output-1',
                    animated: true,
                    style: edgeStyle,
                });
            });
        } else {
            edges.push({
                id: 'e-instruction-output',
                source: 'instruction-1',
                target: 'output-1',
                animated: true,
                style: edgeStyle,
            });
        }

        return edges;
    }, [skill.examples?.length, skill.resources?.length]); // Re-calculate structure only when counts change

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    // Sync nodes with skill store changes (Merge Strategy)
    useEffect(() => {
        const layoutNodes = createNodesFromSkill(skill);

        setNodes((currentNodes) => {
            // Map new layout nodes to current state
            // If ID exists in current state, preserve usage (position, selected)
            // If ID is new, use layout node
            return layoutNodes.map(newNode => {
                const existing = currentNodes.find(n => n.id === newNode.id);
                if (existing) {
                    return {
                        ...newNode,
                        position: existing.position,
                        selected: existing.selected,
                        // data is updated from newNode (which comes from skill)
                    };
                }
                return newNode;
            });
        });
    }, [skill, setNodes]);

    // Keep edges synced for now (simplified)
    useEffect(() => {
        // We can just setEdges(initialEdges) because logic is in useMemo above
        setEdges(initialEdges);
    }, [initialEdges, setEdges]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({
            ...params,
            animated: true,
            style: { stroke: '#f97316', strokeWidth: 2 },
        }, eds)),
        [setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            if (typeof type === 'undefined' || !type) return;

            const position = reactFlowInstance?.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            // Update Skill Store
            if (type === 'example') {
                useSkillStore.getState().setSkill({
                    ...skill,
                    examples: [...(skill.examples || []), { input: '', output: '' }]
                });
            } else if (type === 'trigger') {
                useSkillStore.getState().setSkill({
                    ...skill,
                    triggers: [...(skill.triggers || []), 'New Trigger']
                });
            }
            // For other types, maybe alert "Only one allowed" or similar
            // But for now we just handle Example/Trigger

            // We do NOT manually add to 'nodes' here. 
            // The useEffect above will detect the change in 'skill', generate the new node, 
            // and because it's NEW (ID doesn't exist in currentNodes), it will use the default position from createNodesFromSkill.
            // PROBLEM: We want it at 'position' (drop location).

            // Workaround: We CAN optimistically add it to 'nodes' with the correct ID.
            // But we need to know the ID deterministically.
            let nextId = '';
            if (type === 'example') nextId = `example-${skill.examples?.length || 0}`;
            if (type === 'trigger') return; // Triggers are inside TriggerNode, not separate nodes in this visual model (except strictly separate ones? No, TriggerNode handles list)

            // Wait, looking at createNodesFromSkill:
            // Trigger is ONE node 'trigger-1'.
            // Instruction is ONE node.
            // Example is MULTIPLE nodes.

            // So dragging "Example" makes sense. Dragging "Trigger" appends to triggers list inside 'trigger-1'? 
            // No, user expects a visual node. But our visual model collapses triggers.
            // Let's assume 'Trigger' drag adds to the list.

            // If type == 'example', we have a specific ID.
            if (type === 'example' && position) {
                // Add temporary node with Drop position
                const newId = `example-${skill.examples?.length || 0}`;
                const newNode: Node = {
                    id: newId,
                    type,
                    position,
                    data: { label: `Example ${(skill.examples?.length || 0) + 1}`, input: '', output: '' }
                };
                setNodes(nds => nds.concat(newNode));
            }
        },
        [reactFlowInstance, skill, setNodes]
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
        <div className="w-full h-full" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
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
