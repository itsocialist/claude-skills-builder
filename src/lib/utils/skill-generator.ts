import JSZip from 'jszip';
import yaml from 'js-yaml';
import type { Skill } from '@/types/skill.types';

export async function generateSkillZip(skill: Skill): Promise<Blob> {
    // 1. Generate YAML frontmatter
    const frontmatter = yaml.dump({
        name: skill.name,
        description: skill.description,
        metadata: {
            triggers: skill.triggers,
            category: skill.category,
            tags: skill.tags || [],
        },
    }, {
        indent: 2,
        lineWidth: 80,
    });

    // 2. Combine with markdown instructions
    const skillMd = `---\n${frontmatter}---\n\n${skill.instructions}`;

    // 3. Create README
    const readme = generateReadme(skill);

    // 4. Create zip file
    const zip = new JSZip();
    zip.file('SKILL.md', skillMd);
    zip.file('README.md', readme);

    // 5. Generate blob
    return await zip.generateAsync({ type: 'blob' });
}

function generateReadme(skill: Skill): string {
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
