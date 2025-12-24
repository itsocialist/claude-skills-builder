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

    // 4. Create zip file
    const zip = new JSZip();
    zip.file('SKILL.md', skillMd);
    zip.file('README.md', readme);

    // 5. Generate blob
    return await zip.generateAsync({ type: 'blob' });
}

function generateReadme(skill: Skill, slugName: string): string {
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

---

Generated with [ClaudeSkillsFacet](https://claudeskillsfacet.com)
`;
}
