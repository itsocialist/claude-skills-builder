export type ResourceFolder = 'resources' | 'templates' | 'examples' | 'scripts';

export interface SkillResource {
    id: string;
    folder: ResourceFolder;
    name: string;
    content: string;
}

export interface Skill {
    name: string;
    description: string;
    category: string;
    tags: string[];
    triggers: string[];
    instructions: string;
    examples?: Example[];
    resources?: SkillResource[];
}

export interface Example {
    input: string;
    output: string;
}

export interface Template {
    id: string;
    name: string;
    description: string;
    category: string;
    tags: string[];
    triggers: string[];
    instructions: string;
    sampleOutput?: string;
}
