// Skill Resources API client
// For managing scripts/, references/, assets/ folders per Agent Skills spec

export interface SkillResource {
    id: string;
    template_id?: string;
    user_skill_id?: string;
    folder: 'scripts' | 'references' | 'assets' | 'templates' | 'examples';
    filename: string;
    content?: string;
    storage_path?: string;
    mime_type?: string;
    size_bytes?: number;
    created_at: string;
    updated_at: string;
}

export interface GroupedResources {
    [folder: string]: SkillResource[];
}

// List resources for a skill
export async function getSkillResources(
    skillId: string,
    type: 'template' | 'user' = 'template'
): Promise<{ resources: SkillResource[]; grouped: GroupedResources }> {
    try {
        const response = await fetch(`/api/skills/${skillId}/resources?type=${type}`);
        if (!response.ok) {
            return { resources: [], grouped: {} };
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching skill resources:', error);
        return { resources: [], grouped: {} };
    }
}

// Create or update a resource
export async function createSkillResource(
    token: string,
    skillId: string,
    folder: string,
    filename: string,
    content: string,
    type: 'template' | 'user' = 'user'
): Promise<{ resource?: SkillResource; error?: string }> {
    try {
        const response = await fetch(`/api/skills/${skillId}/resources`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ folder, filename, content, type }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.error || 'Failed to create resource' };
        }

        return { resource: data.resource };
    } catch (error) {
        console.error('Error creating skill resource:', error);
        return { error: 'Network error' };
    }
}

// Delete a resource
export async function deleteSkillResource(
    token: string,
    resourceId: string
): Promise<boolean> {
    try {
        const response = await fetch(`/api/skills/${resourceId}/resources`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.ok;
    } catch (error) {
        console.error('Error deleting skill resource:', error);
        return false;
    }
}

// Helper: Get file icon based on extension
export function getResourceIcon(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    const iconMap: Record<string, string> = {
        'md': '📝',
        'txt': '📄',
        'js': '🟨',
        'ts': '🔷',
        'py': '🐍',
        'json': '📋',
        'yaml': '⚙️',
        'yml': '⚙️',
        'html': '🌐',
        'css': '🎨',
        'png': '🖼️',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'gif': '🖼️',
        'svg': '🖼️',
        'pdf': '📕',
    };
    return iconMap[ext || ''] || '📎';
}

// Helper: Format file size
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
