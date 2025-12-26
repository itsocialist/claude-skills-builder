export type ResourceFolder = 'scripts' | 'references' | 'assets' | 'templates' | 'examples';

export interface SkillResource {
    id: string;
    folder: ResourceFolder;
    filename: string;
    content?: string;
    storage_path?: string;
    mime_type?: string;
    size_bytes?: number;
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
