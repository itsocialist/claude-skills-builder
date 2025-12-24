import JSZip from 'jszip';
import yaml from 'js-yaml';
import type { Skill } from '@/types/skill.types';

/**
 * Convert a skill name to a valid Agent Skills `name` field.
 * Must be lowercase, alphanumeric + hyphens, no starting/ending hyphens,
 * no consecutive hyphens, max 64 chars.
 */
function slugifySkillName(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric except spaces and hyphens
        .replace(/\s+/g, '-')          // Replace spaces with hyphens
        .replace(/-+/g, '-')           // Replace consecutive hyphens with single
        .replace(/^-|-$/g, '')         // Remove leading/trailing hyphens
        .slice(0, 64);                 // Max 64 chars
}

export async function generateSkillZip(skill: Skill): Promise<Blob> {
    // Slugify the name to comply with Agent Skills spec
    const slugName = slugifySkillName(skill.name || 'my-skill');

    // 1. Generate YAML frontmatter (only required fields per spec)
    const frontmatter = yaml.dump({
        name: slugName,
        description: skill.description || 'A custom Claude skill.',
    }, {
        indent: 2,
        lineWidth: 80,
    });

    // 2. Combine with markdown instructions
    const skillMd = `---\n${frontmatter}---\n\n${skill.instructions}`;

    // 3. Create README
    const readme = generateReadme(skill, slugName);

    // 4. Create config.yaml
    const config = generateConfig(skill, slugName);

    // 5. Create zip file
    const zip = new JSZip();
    zip.file('SKILL.md', skillMd);
    zip.file('README.md', readme);
    zip.file('config.yaml', config);

    // 6. Add resources to folders
    if (skill.resources && skill.resources.length > 0) {
        for (const resource of skill.resources) {
            zip.file(`${resource.folder}/${resource.name}`, resource.content);
        }
    }

    // 7. Generate blob
    return await zip.generateAsync({ type: 'blob' });
}

function generateConfig(skill: Skill, slugName: string): string {
    return yaml.dump({
        name: slugName,
        version: '1.0.0',
        description: skill.description,
        category: skill.category,
        triggers: skill.triggers,
        compatibility: {
            claude_web: true,
            claude_code: true,
        },
    }, { indent: 2 });
}

function generateReadme(skill: Skill, slugName: string): string {
    const resourceList = skill.resources && skill.resources.length > 0
        ? `## Attached Files\n\n${skill.resources.map(r => `- \`${r.folder}/${r.name}\``).join('\n')}\n\n`
        : '';

    return `# ${skill.name}

${skill.description}

## Installation

1. Go to [Claude.ai](https://claude.ai)
2. Navigate to Skills
3. Click "Add Skill"
4. Upload the \`SKILL.md\` file from this folder

## Triggers

This skill activates when you use these phrases:

${skill.triggers.map((t) => `- \`${t}\``).join('\n')}

## Category

${skill.category}

${resourceList}---

Generated with [ClaudeSkillsFacet](https://claudeskillsfacet.com)
`;
}

