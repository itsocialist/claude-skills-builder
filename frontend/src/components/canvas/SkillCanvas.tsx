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
import { OutputFormatNode } from './nodes/OutputFormatNode';
import { MetadataNode } from './nodes/MetadataNode';
import { useSkillStore } from '@/lib/store/skillStore';
import { Skill } from '@/types/skill.types';

const nodeTypes = {
    metadata: MetadataNode,
    trigger: TriggerNode,
    instruction: InstructionNode,
    resource: ResourceNode,
    example: ExampleNode,
    output: OutputNode,
    outputFormat: OutputFormatNode,
};

// Helper to generate nodes from skill data
// We export this to use it for initial state and syncing
function createNodesFromSkill(skill: Skill): Node[] {
    const nodes: Node[] = [];
    let yOffset = 50;

    // Metadata node (always first)
    nodes.push({
        id: 'metadata-1',
        type: 'metadata',
        position: { x: 250, y: yOffset },
        data: {
            name: skill.name,
            description: skill.description,
            category: skill.category,
        },
    });
    yOffset += 150;

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

    // Output Format node (if format is specified)
    if (skill.output_format) {
        nodes.push({
            id: 'outputFormat-1',
            type: 'outputFormat',
            position: { x: 225, y: yOffset },
            data: {
                label: 'Output Formatting',
                format: skill.output_format,
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

        // Metadata -> Trigger
        edges.push({
            id: 'e-metadata-trigger',
            source: 'metadata-1',
            target: 'trigger-1',
            animated: true,
            style: edgeStyle,
        });

        // Trigger -> Instruction
        edges.push({
            id: 'e-trigger-instruction',
            source: 'trigger-1',
            target: 'instruction-1',
            animated: true,
            style: edgeStyle,
        });

        // Track what connects to Output
        let lastNodeBeforeOutput = 'instruction-1';

        // Instructions -> Examples (if any)
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
            // Examples feed into next node
            lastNodeBeforeOutput = `example-${skill.examples.length - 1}`;
        }

        // Connect to Resources (if any)
        if (skill.resources && skill.resources.length > 0) {
            const prevNode = skill.examples?.length ? `example-0` : 'instruction-1';
            edges.push({
                id: 'e-to-resource',
                source: prevNode,
                target: 'resource-1',
                animated: true,
                style: edgeStyle,
            });
            // Also connect remaining examples to resources for visual branching
            if (skill.examples && skill.examples.length > 1) {
                skill.examples.slice(1).forEach((_, index) => {
                    edges.push({
                        id: `e-example-${index + 1}-resource`,
                        source: `example-${index + 1}`,
                        target: 'resource-1',
                        animated: true,
                        style: edgeStyle,
                    });
                });
            }
            lastNodeBeforeOutput = 'resource-1';
        }

        // Connect to OutputFormat (if set)
        if (skill.output_format) {
            edges.push({
                id: 'e-to-outputFormat',
                source: lastNodeBeforeOutput,
                target: 'outputFormat-1',
                animated: true,
                style: edgeStyle,
            });
            lastNodeBeforeOutput = 'outputFormat-1';
        }

        // Final node -> Output
        edges.push({
            id: 'e-to-output',
            source: lastNodeBeforeOutput,
            target: 'output-1',
            animated: true,
            style: edgeStyle,
        });

        return edges;
    }, [skill.examples?.length, skill.resources?.length, skill.output_format]); // Re-calculate when structure changes

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

            // Handle different node types
            if (type === 'example') {
                // Add new example to skill store
                useSkillStore.getState().setSkill({
                    ...skill,
                    examples: [...(skill.examples || []), { input: '', output: '' }]
                });

                // Add visual node at drop position
                if (position) {
                    const newId = `example-${skill.examples?.length || 0}`;
                    const newNode: Node = {
                        id: newId,
                        type: 'example',
                        position,
                        data: { label: `Example ${(skill.examples?.length || 0) + 1}`, input: '', output: '' }
                    };
                    setNodes(nds => nds.concat(newNode));
                }
            } else if (type === 'trigger') {
                // Triggers are consolidated in one node - add new trigger phrase
                useSkillStore.getState().setSkill({
                    ...skill,
                    triggers: [...(skill.triggers || []), 'New trigger phrase']
                });
                // The trigger node will update via useEffect sync
            } else if (type === 'resource') {
                // Add placeholder resource to skill store
                const newResource = {
                    id: crypto.randomUUID(),
                    folder: 'references' as const,
                    filename: 'New Resource',
                    content: '',
                    mime_type: 'text/plain'
                };
                useSkillStore.getState().setSkill({
                    ...skill,
                    resources: [...(skill.resources || []), newResource]
                });
                // Resource node will update via useEffect sync
            } else if (type === 'outputFormat') {
                // Set default output format if not already set
                if (!skill.output_format) {
                    useSkillStore.getState().setSkill({
                        ...skill,
                        output_format: 'markdown'
                    });
                } else {
                    console.log('Output format already set. Edit it in the inspector.');
                }
            } else if (type === 'instruction' || type === 'output') {
                // These are singleton nodes - show alert
                console.log(`Only one ${type} node is allowed per skill`);
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
        <div
            className="w-full h-full"
            ref={reactFlowWrapper}
            onDrop={onDrop}
            onDragOver={onDragOver}
        >
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
