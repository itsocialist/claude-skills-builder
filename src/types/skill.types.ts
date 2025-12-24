export interface Skill {
    name: string;
    description: string;
    category: string;
    tags: string[];
    triggers: string[];
    instructions: string;
    examples?: Example[];
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
}
