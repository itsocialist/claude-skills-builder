'use client';

import { useMemo } from 'react';
import yaml from 'js-yaml';
import type { Skill } from '@/types/skill.types';

interface SkillPreviewProps {
    skill: Skill;
}

/**
 * Generates a preview of the SKILL.md content
 * Shows YAML frontmatter + markdown instructions
 */
function generatePreviewContent(skill: Skill): string {
    // Slugify the name for Agent Skills spec compliance
    const slugName = skill.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 64);

    // Generate YAML frontmatter (only name and description per spec)
    const frontmatter = yaml.dump({
        name: slugName || 'untitled-skill',
        description: skill.description || 'No description provided',
    }, {
        indent: 2,
        lineWidth: 80,
    });

    return `---\n${frontmatter}---\n\n${skill.instructions || '# Instructions\n\nAdd your skill instructions here...'}`;
}

export function SkillPreview({ skill }: SkillPreviewProps) {
    // Memoize the preview content to avoid unnecessary recalculations
    const previewContent = useMemo(() => generatePreviewContent(skill), [skill]);

    // Split into frontmatter and body for different styling
    const [frontmatterSection, bodySection] = useMemo(() => {
        const parts = previewContent.split('---\n');
        if (parts.length >= 3) {
            return [`---\n${parts[1]}---`, parts.slice(2).join('---\n')];
        }
        return ['', previewContent];
    }, [previewContent]);

    return (
        <div className="bg-gray-900 rounded-lg overflow-hidden h-full">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Export Preview
                </span>
                <span className="text-xs text-gray-500">
                    {previewContent.length} chars
                </span>
            </div>
            <div className="p-4 font-mono text-sm overflow-auto max-h-[400px]">
                {/* YAML Frontmatter */}
                <pre className="text-gray-500 whitespace-pre-wrap">
                    {frontmatterSection}
                </pre>
                {/* Markdown Body */}
                <pre className="text-gray-200 whitespace-pre-wrap mt-2">
                    {bodySection}
                </pre>
            </div>
        </div>
    );
}
