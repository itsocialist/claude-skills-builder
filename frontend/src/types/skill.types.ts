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
    output_format?: string; // Format specification for AI output (markdown, json, bullet_points, etc.)
    // Analytics (Joined from skill_stats)
    stats?: SkillStats;
}

export interface SkillStats {
    view_count: number;
    download_count: number;
    copy_count: number;
    updated_at: string;
}

export type AnalyticsEventType = 'view' | 'download' | 'copy' | 'edit';

export interface AnalyticsEvent {
    id: string;
    skill_id: string;
    event_type: AnalyticsEventType;
    metadata?: Record<string, any>;
    created_at: string;
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
    preview_image_url?: string;
}
